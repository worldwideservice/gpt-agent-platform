#!/usr/bin/env node

/**
 * Скрипт для проверки наличия необходимых переменных окружения
 */

const fs = require('fs')
const path = require('path')

const requiredVars = {
  root: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_DEFAULT_ORGANIZATION_ID',
    'OPENROUTER_API_KEY',
    'NEXT_PUBLIC_APP_URL',
  ],
  api: [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'REDIS_URL',
    'ENCRYPTION_KEY',
    'OPENROUTER_API_KEY',
  ],
  worker: [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'REDIS_URL',
    'ENCRYPTION_KEY',
    'OPENROUTER_API_KEY',
  ],
}

function checkEnvFile(filePath, required, context) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${context}: файл ${filePath} не найден`)
    return { missing: required, fileExists: false }
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const envVars = new Set()

  for (const line of lines) {
    const match = line.match(/^([A-Z_]+)=/)
    if (match) {
      envVars.add(match[1])
    }
  }

  const missing = required.filter((varName) => !envVars.has(varName))

  return { missing, fileExists: true, envVars }
}

function main() {
  console.log('🔍 Проверка переменных окружения...\n')

  const rootPath = process.cwd()
  const rootEnv = path.join(rootPath, '.env.local')
  const apiEnv = path.join(rootPath, 'services/api/.env')
  const workerEnv = path.join(rootPath, 'services/worker/.env')

  let hasErrors = false

  // Проверка корневого .env.local
  console.log('📁 Корневой проект (.env.local):')
  const rootCheck = checkEnvFile(rootEnv, requiredVars.root, 'Root')
  if (!rootCheck.fileExists) {
    console.log(`   ❌ Файл не найден`)
    hasErrors = true
  } else {
    if (rootCheck.missing.length === 0) {
      console.log(`   ✅ Все необходимые переменные найдены`)
    } else {
      console.log(`   ⚠️  Отсутствуют переменные:`)
      rootCheck.missing.forEach((varName) => {
        console.log(`      - ${varName}`)
      })
      hasErrors = true
    }
  }

  // Проверка services/api/.env
  console.log('\n📁 Backend API (services/api/.env):')
  const apiCheck = checkEnvFile(apiEnv, requiredVars.api, 'API')
  if (!apiCheck.fileExists) {
    console.log(`   ❌ Файл не найден`)
    hasErrors = true
  } else {
    if (apiCheck.missing.length === 0) {
      console.log(`   ✅ Все необходимые переменные найдены`)
    } else {
      console.log(`   ⚠️  Отсутствуют переменные:`)
      apiCheck.missing.forEach((varName) => {
        console.log(`      - ${varName}`)
      })
      hasErrors = true
    }
  }

  // Проверка services/worker/.env
  console.log('\n📁 Worker (services/worker/.env):')
  const workerCheck = checkEnvFile(workerEnv, requiredVars.worker, 'Worker')
  if (!workerCheck.fileExists) {
    console.log(`   ❌ Файл не найден`)
    hasErrors = true
  } else {
    if (workerCheck.missing.length === 0) {
      console.log(`   ✅ Все необходимые переменные найдены`)
    } else {
      console.log(`   ⚠️  Отсутствуют переменные:`)
      workerCheck.missing.forEach((varName) => {
        console.log(`      - ${varName}`)
      })
      hasErrors = true
    }
  }

  // Итоговая информация
  console.log('\n' + '='.repeat(50))

  if (hasErrors) {
    console.log('\n❌ Найдены проблемы с переменными окружения')
    console.log('\n📖 Инструкции по настройке:')
    console.log('   - docs/SETUP.md')
    console.log('   - docs/OPENROUTER_SETUP.md (для OpenRouter)')
    process.exit(1)
  } else {
    console.log('\n✅ Все переменные окружения настроены правильно!')
    process.exit(0)
  }
}

main()




















