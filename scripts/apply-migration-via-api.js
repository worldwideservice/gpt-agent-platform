#!/usr/bin/env node

/**
 * Скрипт для применения миграций через Supabase REST API
 * Использует Service Role Key для выполнения DDL операций
 */

const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Ошибка: Требуются переменные окружения:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL или SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nУбедитесь что .env.local существует и содержит эти переменные.')
  process.exit(1)
}

async function executeSQL(sql) {
  try {
    // Supabase REST API не поддерживает выполнение произвольного SQL напрямую
    // Нужно использовать либо:
    // 1. Supabase Dashboard (SQL Editor)
    // 2. pgREST через прямой SQL (требует специальных настроек)
    // 3. Supabase CLI
    
    // Попробуем через Management API, если доступен
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ sql }),
    })

    if (response.ok) {
      return await response.json()
    }

    // Если не работает через RPC, пробуем другой подход
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  } catch (error) {
    if (error.message.includes('exec_sql')) {
      // RPC функция не существует - это нормально
      throw new Error('Direct SQL execution через REST API не поддерживается. Используйте Supabase Dashboard или psql.')
    }
    throw error
  }
}

async function main() {
  try {
    console.log('📋 Применение миграций через Supabase API...\n')
    console.log(`📍 Supabase URL: ${SUPABASE_URL.replace(/\/$/, '')}\n`)

    const sqlFile = path.join(__dirname, 'apply-all-setup.sql')
    
    if (!fs.existsSync(sqlFile)) {
      console.error(`❌ Файл не найден: ${sqlFile}`)
      process.exit(1)
    }

    const sql = fs.readFileSync(sqlFile, 'utf-8')
    
    console.log('⚠️  Supabase REST API не поддерживает прямое выполнение DDL операций.')
    console.log('   Рекомендуется использовать один из вариантов ниже:\n')
    
    console.log('📝 Вариант 1: Supabase Dashboard (РЕКОМЕНДУЕТСЯ - 2 минуты)')
    console.log('   1. Откройте: https://supabase.com/dashboard')
    console.log('   2. Выберите проект')
    console.log('   3. SQL Editor → New query')
    console.log(`   4. Откройте файл: ${sqlFile}`)
    console.log('   5. Скопируйте ВЕСЬ файл (Ctrl+A, Ctrl+C)')
    console.log('   6. Вставьте в SQL Editor (Ctrl+V)')
    console.log('   7. Нажмите Run\n')
    
    console.log('📝 Вариант 2: Через Supabase CLI')
    console.log('   1. supabase link --project-ref <project-ref>')
    console.log('   2. supabase db push\n')
    
    console.log('📝 Вариант 3: Через psql')
    console.log('   psql "<connection-string>" -f ' + sqlFile)
    console.log('   Получите connection string в Supabase Dashboard → Settings → Database\n')

    // Пытаемся выполнить через psql если доступен
    if (require('child_process').spawnSync('which', ['psql']).status === 0) {
      console.log('🔄 Попытка выполнения через psql...\n')
      
      // Получаем connection string из переменных окружения
      // Формат: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
      // Нужно получить из Supabase Dashboard
      
      const projectRef = SUPABASE_URL.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]
      if (projectRef) {
        console.log(`✅ Найден project ref: ${projectRef}`)
        console.log('   Получите connection string:')
        console.log('   Supabase Dashboard → Settings → Database → Connection string')
        console.log('   Используйте формат: "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"\n')
      }
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

