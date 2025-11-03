#!/usr/bin/env node

/**
 * Применение миграции ensure_organizations_slug.sql
 * Использует Supabase Service Role для выполнения SQL через PostgREST API
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
  console.error('   Требуется: NEXT_PUBLIC_SUPABASE_URL или SUPABASE_URL')
  console.error('   И SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

async function applyMigration() {
  const migrationFile = path.join(__dirname, '..', 'supabase', 'migrations', 'ensure_organizations_slug.sql')
  
  if (!fs.existsSync(migrationFile)) {
    console.error(`❌ Файл миграции не найден: ${migrationFile}`)
    process.exit(1)
  }

  const sql = fs.readFileSync(migrationFile, 'utf-8')
  
  // Извлекаем project ref из URL
  const projectRef = SUPABASE_URL.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]
  
  if (!projectRef) {
    console.error('❌ Не удалось определить project ref из URL:', SUPABASE_URL)
    process.exit(1)
  }

  console.log('🚀 Применение миграции ensure_organizations_slug.sql\n')
  console.log(`📍 Project: ${projectRef}`)
  console.log(`📍 URL: ${SUPABASE_URL.replace(/\/$/, '')}\n`)

  // Supabase не поддерживает выполнение DDL через REST API
  // Нужно использовать прямой доступ к PostgreSQL через connection string
  // Или использовать Supabase CLI, или применить через Dashboard
  
  console.log('📋 Инструкция для применения миграции:\n')
  console.log('1. Откройте Supabase Dashboard:')
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new\n`)
  console.log('2. Скопируйте SQL код ниже:\n')
  console.log('─'.repeat(80))
  console.log(sql)
  console.log('─'.repeat(80))
  console.log('\n3. Вставьте SQL код в SQL Editor в Dashboard')
  console.log('4. Нажмите "Run" для выполнения\n')
  
  // Попробуем применить через Supabase CLI если доступен
  const { exec } = require('child_process')
  const { promisify } = require('util')
  const execAsync = promisify(exec)
  
  try {
    // Проверяем есть ли Supabase CLI
    await execAsync('which supabase')
    
    console.log('🔍 Попытка применения через Supabase CLI...\n')
    
    // Проверяем подключен ли проект
    try {
      const { stdout: linkCheck } = await execAsync('supabase status 2>&1 || echo "not-linked"')
      if (linkCheck.includes('not-linked') || linkCheck.includes('Error')) {
        console.log('⚠️  Проект не подключен к Supabase CLI')
        console.log(`   Выполните: supabase link --project-ref ${projectRef}\n`)
      } else {
        console.log('✅ Проект подключен, применяю миграцию...\n')
        
        // Применяем миграцию
        const { stdout, stderr } = await execAsync(
          `supabase db execute --file "${migrationFile}"`,
          { cwd: path.join(__dirname, '..') }
        )
        
        if (stdout) console.log(stdout)
        if (stderr && !stderr.includes('NOTICE')) console.error(stderr)
        
        console.log('\n✅ Миграция применена успешно!')
        return
      }
    } catch (linkError) {
      console.log('⚠️  Не удалось проверить подключение через CLI\n')
    }
  } catch (cliError) {
    console.log('⚠️  Supabase CLI не найден или недоступен\n')
  }
  
  // Открываем Dashboard в браузере
  console.log('🌐 Открываю Supabase Dashboard в браузере...\n')
  exec(`open "https://supabase.com/dashboard/project/${projectRef}/sql/new"`, () => {})
  
  console.log('✅ Dashboard должен открыться в браузере')
  console.log('   Скопируйте SQL код выше и вставьте в SQL Editor\n')
}

if (require.main === module) {
  applyMigration().catch(error => {
    console.error('❌ Ошибка:', error.message)
    process.exit(1)
  })
}

module.exports = { applyMigration }

