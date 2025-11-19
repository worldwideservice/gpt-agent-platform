#!/usr/bin/env node

/**
 * Скрипт для применения миграций в Supabase
 * Использование: node scripts/apply-migrations.js [migration-name]
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })
dotenv.config()

// Получаем переменные окружения
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Ошибка: SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY должны быть установлены')
  console.error('Установите переменные окружения или используйте .env файл')
  process.exit(1)
}

// Создаем клиент Supabase с service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Список миграций для применения
const migrations = [
  {
    name: 'add_crm_tasks_and_calls',
    file: 'supabase/migrations/add_crm_tasks_and_calls.sql',
    description: 'Создание таблиц crm_tasks и crm_calls',
  },
  {
    name: 'add_activity_logs',
    file: 'supabase/migrations/add_activity_logs.sql',
    description: 'Создание таблицы activity_logs',
  },
  {
    name: 'rename_stripe_to_paddle',
    file: 'supabase/migrations/rename_stripe_to_paddle.sql',
    description: 'Переименование колонок Stripe в Paddle',
  },
]

async function applyMigration(migration) {
  const filePath = path.join(process.cwd(), migration.file)

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Файл миграции не найден: ${filePath}`)
    return false
  }

  const sql = fs.readFileSync(filePath, 'utf-8')

  console.log(`\n📝 Применение миграции: ${migration.name}`)
  console.log(`   ${migration.description}`)

  try {
    // Выполняем SQL через Supabase REST API
    // Используем rpc для выполнения произвольного SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      // Если функция exec_sql не существует, используем прямой запрос
      // Supabase не поддерживает прямой SQL через REST API для безопасности
      // Поэтому нужно использовать Supabase Dashboard или CLI

      console.error(`❌ Не удалось применить миграцию через API`)
      console.error(`   Ошибка: ${error.message}`)
      console.error(`\n💡 Используйте один из способов:`)
      console.error(`   1. Supabase Dashboard → SQL Editor`)
      console.error(`   2. Supabase CLI: supabase db push`)
      console.error(`   3. psql: psql [connection-string] -f ${migration.file}`)

      return false
    }

    console.log(`✅ Миграция ${migration.name} применена успешно`)
    return true
  } catch (error) {
    console.error(`❌ Ошибка при применении миграции: ${error.message}`)
    console.error(`\n💡 Используйте Supabase Dashboard → SQL Editor для применения миграции`)
    return false
  }
}

async function checkMigrationStatus(migrationName) {
  // Проверяем существование таблиц
  const tablesToCheck = {
    add_crm_tasks_and_calls: ['crm_tasks', 'crm_calls'],
    add_activity_logs: ['activity_logs'],
  }

  const tables = tablesToCheck[migrationName] || []

  if (tables.length === 0) return true

  for (const tableName of tables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('id')
        .limit(1)

      if (error && error.code === 'PGRST116') {
        // Таблица не существует
        console.log(`   ⚠️  Таблица ${tableName} не существует`)
        return false
      }

      if (error) {
        console.log(`   ⚠️  Ошибка при проверке ${tableName}: ${error.message}`)
        return false
      }

      console.log(`   ✅ Таблица ${tableName} существует`)
    } catch (error) {
      console.log(`   ⚠️  Не удалось проверить таблицу ${tableName}`)
      return false
    }
  }

  return true
}

async function main() {
  const args = process.argv.slice(2)
  const migrationName = args[0]

  console.log('🚀 Скрипт применения миграций Supabase\n')

  if (migrationName) {
    // Применяем конкретную миграцию
    const migration = migrations.find((m) => m.name === migrationName)
    if (!migration) {
      console.error(`❌ Миграция "${migrationName}" не найдена`)
      console.error('\nДоступные миграции:')
      migrations.forEach((m) => {
        console.error(`   - ${m.name}: ${m.description}`)
      })
      process.exit(1)
    }

    const applied = await applyMigration(migration)
    if (applied) {
      await checkMigrationStatus(migrationName)
    }
  } else {
    // Применяем все миграции
    console.log('📋 Применение всех миграций...\n')

    for (const migration of migrations) {
      const status = await checkMigrationStatus(migration.name)
      if (status) {
        console.log(`✅ Миграция ${migration.name} уже применена`)
        continue
      }

      await applyMigration(migration)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Пауза между миграциями
    }
  }

  console.log('\n✅ Готово!')
  console.log('\n💡 Примечание:')
  console.log('   Supabase REST API не поддерживает прямой SQL для безопасности.')
  console.log('   Используйте Supabase Dashboard → SQL Editor для применения миграций.')
}

main().catch((error) => {
  console.error('❌ Критическая ошибка:', error)
  process.exit(1)
})

