#!/usr/bin/env node

/**
 * Скрипт для применения миграций через Supabase REST API
 * Использование: node scripts/apply-setup-via-api.js
 */

const fs = require('fs')
const path = require('path')

// Читаем переменные окружения
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Ошибка: Не найдены SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY')
  console.error('   Убедитесь что .env.local содержит эти переменные')
  process.exit(1)
}

async function executeSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SQL Error: ${error}`)
  }

  return await response.json()
}

async function main() {
  try {
    console.log('📋 Применение миграций через Supabase API...\n')

    const sqlFile = path.join(__dirname, 'apply-all-setup.sql')
    const sql = fs.readFileSync(sqlFile, 'utf-8')

    // Разбиваем на отдельные запросы (упрощенная версия)
    console.log('⚠️  Этот скрипт требует прямого доступа к PostgreSQL.')
    console.log('   Рекомендуется использовать Supabase Dashboard.\n')
    console.log('📝 Альтернатива:')
    console.log('   1. Откройте: https://supabase.com/dashboard')
    console.log('   2. SQL Editor → New query')
    console.log(`   3. Скопируйте файл: ${sqlFile}`)
    console.log('   4. Вставьте и выполните\n')

    // Попробуем выполнить через REST API (может не работать для DDL)
    console.log('🔄 Попытка выполнения через API...')
    
    // Supabase не предоставляет прямого REST endpoint для выполнения произвольного SQL
    // Нужно использовать либо Dashboard, либо psql напрямую
    
    console.log('\n✅ Рекомендация: Используйте Supabase Dashboard для применения миграций')
    console.log('   Или используйте psql:')
    console.log(`   psql "${process.env.SUPABASE_DB_URL}" -f ${sqlFile}`)

  } catch (error) {
    console.error('❌ Ошибка:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}





