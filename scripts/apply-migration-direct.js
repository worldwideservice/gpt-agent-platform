#!/usr/bin/env node

/**
 * Применение миграций через Supabase Management API
 * Использует Service Role Key для выполнения SQL
 */

const fs = require('fs')
const path = require('path')

// Загружаем переменные окружения
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      process.env[key] = value
    }
  })
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Ошибка: Не найдены переменные окружения')
  console.error('   Требуется: NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

async function executeSQL(sql) {
  // Получаем project ref из URL
  const projectRef = SUPABASE_URL.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]
  if (!projectRef) {
    throw new Error('Не удалось определить project ref из URL')
  }

  console.log(`📍 Project: ${projectRef}`)
  console.log(`📍 URL: ${SUPABASE_URL.replace(/\/$/, '')}\n`)

  // Supabase Management API для выполнения SQL
  // Используем Database API напрямую через connection string
  // Но для DDL нужен прямой доступ к PostgreSQL
  
  // Альтернатива: используем Supabase PostgREST с специальной функцией
  // Или напрямую через psql connection string
  
  // Попробуем через Management API (может не работать для DDL)
  try {
    // Для DDL операций Supabase REST API не подходит
    // Нужен прямой доступ к PostgreSQL
    
    console.log('⚠️  Supabase REST API не поддерживает выполнение DDL операций напрямую.')
    console.log('   Но мы можем проверить доступность проекта и попробовать альтернативный способ.\n')
    
    // Проверяем доступность проекта
    const healthCheck = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    })
    
    if (healthCheck.ok) {
      console.log('✅ Проект доступен!\n')
    } else {
      console.log(`⚠️  Проект может быть недоступен: ${healthCheck.status}`)
    }

    // Создаем скрипт для выполнения через psql
    console.log('📝 Создаю инструкцию для выполнения через Supabase Dashboard...\n')
    
    const sqlFile = path.join(__dirname, 'apply-all-setup.sql')
    const sql = fs.readFileSync(sqlFile, 'utf-8')
    
    console.log('✅ SQL файл прочитан успешно')
    console.log(`   Размер: ${sql.length} символов`)
    console.log(`   Строк: ${sql.split('\n').length}\n`)
    
    // Возвращаем инструкции
    return {
      success: true,
      message: 'SQL готов к выполнению через Dashboard',
      sqlLength: sql.length,
    }
  } catch (error) {
    throw error
  }
}

async function main() {
  try {
    console.log('🚀 Применение миграций БД...\n')

    const sqlFile = path.join(__dirname, 'apply-all-setup.sql')
    
    if (!fs.existsSync(sqlFile)) {
      console.error(`❌ Файл не найден: ${sqlFile}`)
      process.exit(1)
    }

    const result = await executeSQL(null)
    
    console.log('✅ Подготовка завершена!\n')
    console.log('📋 Для выполнения миграций:')
    console.log('')
    console.log('1. Откройте Supabase Dashboard:')
    console.log(`   https://supabase.com/dashboard/project/${SUPABASE_URL.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]}/sql/new`)
    console.log('')
    console.log('2. Откройте файл SQL:')
    console.log(`   ${sqlFile}`)
    console.log('')
    console.log('3. Скопируйте весь файл (Ctrl+A, Ctrl+C)')
    console.log('')
    console.log('4. Вставьте в SQL Editor и нажмите Run\n')
    
    // Пытаемся открыть файлы
    const { exec } = require('child_process')
    const projectRef = SUPABASE_URL.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]
    
    console.log('🌐 Открываю Supabase Dashboard и SQL файл...\n')
    
    // Открываем Dashboard
    exec(`open "https://supabase.com/dashboard/project/${projectRef}/sql/new"`, () => {})
    
    // Открываем SQL файл
    exec(`open "${sqlFile}"`, () => {})
    
    setTimeout(() => {
      console.log('✅ Файлы должны открыться в браузере и редакторе')
      console.log('   Скопируйте SQL из открытого файла и вставьте в Dashboard\n')
    }, 1000)
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

