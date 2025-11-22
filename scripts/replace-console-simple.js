#!/usr/bin/env node
/**
 * Простая автоматическая замена console.* на logger.*
 * Безопасный DevOps подход
 */

const fs = require('fs')
const path = require('path')

// Файлы которые нужно пропустить
const SKIP_FILES = [
  'lib/utils/logger.ts', // Сам logger использует console для fallback
]

const stats = {
  filesProcessed: 0,
  filesModified: 0,
  totalReplacements: 0,
  byMethod: {},
}

/**
 * Рекурсивно находит все .ts файлы
 */
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      if (!file.includes('node_modules')) {
        findTsFiles(filePath, fileList)
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath)
    }
  })

  return fileList
}

/**
 * Проверяет нужно ли пропустить файл
 */
function shouldSkip(filePath) {
  return SKIP_FILES.some(skip => filePath.includes(skip))
}

/**
 * Добавляет import logger если его нет
 */
function ensureLoggerImport(content) {
  // Проверяем есть ли уже import logger
  if (content.includes("from '@/lib/utils/logger'")) {
    return content
  }

  // Находим последнюю строку с import
  const lines = content.split('\n')
  let lastImportIndex = -1

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ') && lines[i].includes(' from ')) {
      lastImportIndex = i
    }
  }

  // Вставляем import после последнего import
  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, "import { logger } from '@/lib/utils/logger'")
  } else {
    // Нет imports - добавляем в начало
    lines.unshift("import { logger } from '@/lib/utils/logger'", '')
  }

  return lines.join('\n')
}

/**
 * Заменяет console на logger
 */
function replaceConsole(content) {
  let modified = content
  let count = 0

  // console.error(...) -> logger.error(...)
  const errorMatches = (modified.match(/console\.error\(/g) || []).length
  modified = modified.replace(/console\.error\(/g, 'logger.error(')
  if (errorMatches > 0) {
    count += errorMatches
    stats.byMethod.error = (stats.byMethod.error || 0) + errorMatches
  }

  // console.warn(...) -> logger.warn(...)
  const warnMatches = (modified.match(/console\.warn\(/g) || []).length
  modified = modified.replace(/console\.warn\(/g, 'logger.warn(')
  if (warnMatches > 0) {
    count += warnMatches
    stats.byMethod.warn = (stats.byMethod.warn || 0) + warnMatches
  }

  // console.info(...) -> logger.info(...)
  const infoMatches = (modified.match(/console\.info\(/g) || []).length
  modified = modified.replace(/console\.info\(/g, 'logger.info(')
  if (infoMatches > 0) {
    count += infoMatches
    stats.byMethod.info = (stats.byMethod.info || 0) + infoMatches
  }

  // console.debug(...) -> logger.debug(...)
  const debugMatches = (modified.match(/console\.debug\(/g) || []).length
  modified = modified.replace(/console\.debug\(/g, 'logger.debug(')
  if (debugMatches > 0) {
    count += debugMatches
    stats.byMethod.debug = (stats.byMethod.debug || 0) + debugMatches
  }

  // console.log(...) -> logger.info(...) (логический выбор)
  const logMatches = (modified.match(/console\.log\(/g) || []).length
  modified = modified.replace(/console\.log\(/g, 'logger.info(')
  if (logMatches > 0) {
    count += logMatches
    stats.byMethod['log->info'] = (stats.byMethod['log->info'] || 0) + logMatches
  }

  return { content: modified, count }
}

/**
 * Обрабатывает один файл
 */
function processFile(filePath) {
  stats.filesProcessed++

  if (shouldSkip(filePath)) {
    console.log(`⏭️  Skip: ${path.relative(process.cwd(), filePath)}`)
    return
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8')

    // Проверяем есть ли console
    if (!content.match(/console\.(log|error|warn|info|debug)/)) {
      return
    }

    const relativePath = path.relative(process.cwd(), filePath)
    console.log(`🔄 Process: ${relativePath}`)

    // Заменяем console на logger
    const { content: replaced, count } = replaceConsole(content)

    if (count === 0) {
      return
    }

    // Добавляем import
    const final = ensureLoggerImport(replaced)

    // Записываем
    fs.writeFileSync(filePath, final, 'utf-8')

    stats.filesModified++
    stats.totalReplacements += count

    console.log(`  ✅ ${count} replacements`)
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
  }
}

/**
 * Main
 */
function main() {
  console.log('🚀 Automated console → logger replacement\n')

  const libDir = path.join(process.cwd(), 'lib')
  if (!fs.existsSync(libDir)) {
    console.error('❌ lib/ directory not found')
    process.exit(1)
  }

  const files = findTsFiles(libDir)
  console.log(`📁 Found ${files.length} TypeScript files in lib/\n`)

  files.forEach(processFile)

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Summary:')
  console.log(`  Files processed: ${stats.filesProcessed}`)
  console.log(`  Files modified: ${stats.filesModified}`)
  console.log(`  Total replacements: ${stats.totalReplacements}`)

  if (Object.keys(stats.byMethod).length > 0) {
    console.log('\n  By method:')
    Object.entries(stats.byMethod).forEach(([method, count]) => {
      console.log(`    ${method}: ${count}`)
    })
  }

  console.log('\n✅ Done!')
  console.log('\n📋 Next steps:')
  console.log('  1. Review changes: git diff lib/')
  console.log('  2. Fix context objects: add proper metadata to logger calls')
  console.log('  3. Test: npm run type-check')
  console.log('  4. Commit: git add lib/ && git commit -m "refactor: automated console → logger migration"')
}

main()
