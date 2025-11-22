#!/usr/bin/env ts-node
/**
 * Автоматическая замена console.* на logger.*
 * DevOps подход для массовой миграции
 */

import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

interface Replacement {
  file: string
  count: number
  methods: string[]
}

const replacements: Replacement[] = []

// Файлы которые нужно пропустить
const SKIP_FILES = [
  'lib/utils/logger.ts', // Сам logger использует console
  'node_modules',
]

/**
 * Добавляет import logger если его нет
 */
function addLoggerImport(content: string, filePath: string): string {
  // Проверяем есть ли уже import logger
  if (content.includes("from '@/lib/utils/logger'") || content.includes('from "@/lib/utils/logger"')) {
    return content
  }

  // Находим последний import
  const importRegex = /^import\s+.*from\s+['"].*['"]/gm
  const imports = content.match(importRegex)

  if (!imports || imports.length === 0) {
    // Нет imports - добавляем в начало
    return `import { logger } from '@/lib/utils/logger'\n\n${content}`
  }

  // Находим позицию последнего import
  const lastImport = imports[imports.length - 1]
  const lastImportIndex = content.lastIndexOf(lastImport)
  const insertPosition = lastImportIndex + lastImport.length

  // Вставляем новый import после последнего
  return (
    content.slice(0, insertPosition) +
    `\nimport { logger } from '@/lib/utils/logger'` +
    content.slice(insertPosition)
  )
}

/**
 * Заменяет console.* на logger.*
 */
function replaceConsoleStatements(content: string, filePath: string): { content: string; count: number; methods: Set<string> } {
  let newContent = content
  let count = 0
  const methods = new Set<string>()

  // Паттерны для замены
  const patterns = [
    // console.error('message', error, ...) -> logger.error('message', error, {})
    {
      pattern: /console\.error\((.*?)\)/gs,
      replacement: (match: string, args: string) => {
        count++
        methods.add('error')
        // Простая эвристика: если есть запятая, последний аргумент - это error object
        const argList = args.split(',').map(a => a.trim())
        if (argList.length === 1) {
          return `logger.error(${args}, undefined, {})`
        } else if (argList.length === 2) {
          return `logger.error(${argList[0]}, ${argList[1]}, {})`
        }
        return `logger.error(${args}, {})`
      }
    },
    // console.warn
    {
      pattern: /console\.warn\((.*?)\)/gs,
      replacement: (match: string, args: string) => {
        count++
        methods.add('warn')
        return `logger.warn(${args}, {})`
      }
    },
    // console.log -> logger.info (для информационных сообщений)
    {
      pattern: /console\.log\((.*?)\)/gs,
      replacement: (match: string, args: string) => {
        count++
        methods.add('log->info')
        return `logger.info(${args}, {})`
      }
    },
    // console.info
    {
      pattern: /console\.info\((.*?)\)/gs,
      replacement: (match: string, args: string) => {
        count++
        methods.add('info')
        return `logger.info(${args}, {})`
      }
    },
    // console.debug
    {
      pattern: /console\.debug\((.*?)\)/gs,
      replacement: (match: string, args: string) => {
        count++
        methods.add('debug')
        return `logger.debug(${args}, {})`
      }
    },
  ]

  // Применяем все паттерны
  for (const { pattern, replacement } of patterns) {
    newContent = newContent.replace(pattern, replacement)
  }

  return { content: newContent, count, methods }
}

/**
 * Обрабатывает один файл
 */
async function processFile(filePath: string): Promise<void> {
  // Проверяем нужно ли пропустить файл
  if (SKIP_FILES.some(skip => filePath.includes(skip))) {
    console.log(`⏭️  Skipping: ${filePath}`)
    return
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8')

    // Проверяем есть ли console в файле
    if (!content.match(/console\.(log|error|warn|info|debug)/)) {
      return
    }

    console.log(`🔄 Processing: ${filePath}`)

    // Заменяем console на logger
    const { content: replacedContent, count, methods } = replaceConsoleStatements(content, filePath)

    if (count === 0) {
      return
    }

    // Добавляем import logger
    const finalContent = addLoggerImport(replacedContent, filePath)

    // Записываем обратно
    fs.writeFileSync(filePath, finalContent, 'utf-8')

    replacements.push({
      file: path.relative(process.cwd(), filePath),
      count,
      methods: Array.from(methods),
    })

    console.log(`  ✅ Replaced ${count} console statements`)
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error)
  }
}

/**
 * Главная функция
 */
async function main() {
  console.log('🚀 Starting automated console → logger replacement\n')

  // Находим все TypeScript файлы в lib/
  const files = await glob('lib/**/*.{ts,tsx}', {
    ignore: ['node_modules/**', '**/*.test.ts', '**/*.spec.ts'],
  })

  console.log(`📁 Found ${files.length} TypeScript files\n`)

  // Обрабатываем все файлы
  for (const file of files) {
    await processFile(file)
  }

  // Выводим статистику
  console.log('\n📊 Summary:')
  console.log(`  Files modified: ${replacements.length}`)
  console.log(`  Total replacements: ${replacements.reduce((sum, r) => sum + r.count, 0)}`)

  if (replacements.length > 0) {
    console.log('\n📋 Modified files:')
    replacements.forEach(r => {
      console.log(`  - ${r.file}: ${r.count} replacements (${r.methods.join(', ')})`)
    })
  }

  console.log('\n✅ Done! Please review changes before committing.')
  console.log('   Run: git diff lib/')
}

main().catch(console.error)
