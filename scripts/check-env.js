#!/usr/bin/env node

/**
 * Скрипт для проверки наличия необходимых переменных окружения
 * Обновлено: 2025-01-26
 */

const fs = require('fs')
const path = require('path')

const requiredVars = {
  root: [
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'ENCRYPTION_KEY',
  ],
  optional: [
    'OPENROUTER_API_KEY',
    'BACKEND_API_URL',
    'KOMMO_OAUTH_REDIRECT_BASE',
    'KOMMO_WEBHOOK_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'FROM_EMAIL',
    'CRON_SECRET',
    'SENTRY_DSN',
    'NEXT_PUBLIC_SENTRY_DSN',
    'ADMIN_USERS',
    'JWT_SECRET',
    'REDIS_URL',
  ],
}

function checkEnvFile(filePath, required, optional, context) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${context}: файл ${filePath} не найден`)
    return { missing: required, optional: [], fileExists: false }
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const envVars = new Set()

  for (const line of lines) {
    // Пропускаем комментарии и пустые строки
    const trimmed = line.trim()
    if (trimmed.startsWith('#') || trimmed === '') continue

    const match = trimmed.match(/^([A-Z_]+)=/)
    if (match) {
      envVars.add(match[1])
    }
  }

  const missing = required.filter((varName) => !envVars.has(varName))
  const optionalFound = optional.filter((varName) => envVars.has(varName))

  return { missing, optionalFound, fileExists: true, envVars }
}

function main() {
  console.log('🔍 Проверка переменных окружения...\n')

  const rootPath = process.cwd()
  const rootEnv = path.join(rootPath, '.env.local')

  let hasErrors = false

  // Проверка корневого .env.local
  console.log('📁 Корневой проект (.env.local):')
  const rootCheck = checkEnvFile(rootEnv, requiredVars.root, requiredVars.optional, 'Root')
  
  if (!rootCheck.fileExists) {
    console.log(`   ❌ Файл не найден`)
    console.log(`   💡 Создайте файл .env.local на основе env.example`)
    hasErrors = true
  } else {
    if (rootCheck.missing.length === 0) {
      console.log(`   ✅ Все обязательные переменные найдены`)
    } else {
      console.log(`   ❌ Отсутствуют обязательные переменные:`)
      rootCheck.missing.forEach((varName) => {
        console.log(`      - ${varName}`)
      })
      hasErrors = true
    }

    if (rootCheck.optionalFound.length > 0) {
      console.log(`   📋 Найдено опциональных переменных: ${rootCheck.optionalFound.length}`)
      if (rootCheck.optionalFound.length <= 5) {
        rootCheck.optionalFound.forEach((varName) => {
          console.log(`      ✓ ${varName}`)
        })
      }
    }

    const optionalMissing = requiredVars.optional.filter(
      (varName) => !rootCheck.envVars.has(varName)
    )
    if (optionalMissing.length > 0 && optionalMissing.length < requiredVars.optional.length) {
      console.log(`   ⚠️  Отсутствуют опциональные переменные (не критично):`)
      optionalMissing.forEach((varName) => {
        console.log(`      - ${varName}`)
      })
    }
  }

  // Итоговая информация
  console.log('\n' + '='.repeat(50))

  if (hasErrors) {
    console.log('\n❌ Найдены проблемы с переменными окружения')
    console.log('\n📖 Инструкции по настройке:')
    console.log('   - env.example - шаблон всех переменных')
    console.log('   - env.production.example - шаблон для production')
    console.log('   - docs/SECRETS.md - подробная документация')
    console.log('   - docs/SETUP.md - инструкции по настройке')
    console.log('\n💡 Для локальной разработки:')
    console.log('   1. Скопируйте env.example в .env.local')
    console.log('   2. Заполните все обязательные переменные')
    console.log('   3. Запустите проверку снова: npm run check:env')
    process.exit(1)
  } else {
    console.log('\n✅ Все обязательные переменные окружения настроены правильно!')
    console.log('\n📋 Статистика:')
    console.log(`   - Обязательных переменных: ${requiredVars.root.length}`)
    console.log(`   - Опциональных переменных найдено: ${rootCheck.optionalFound.length}/${requiredVars.optional.length}`)
    console.log('\n💡 Для production используйте env.production.example как шаблон')
    process.exit(0)
  }
}

main()
