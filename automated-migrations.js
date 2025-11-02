#!/usr/bin/env node

// АВТОМАТИЧЕСКОЕ ВЫПОЛНЕНИЕ МИГРАЦИЙ SUPABASE
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function main() {
  console.log('🚀 АВТОМАТИЧЕСКОЕ ВЫПОЛНЕНИЕ МИГРАЦИЙ SUPABASE');
  console.log('==============================================');

  try {
    // Получить ключи из аргументов командной строки или переменных окружения
    const SUPABASE_URL = process.env.SUPABASE_URL || process.argv[2] || 'https://rpzchsgutabxeabbnwas.supabase.co';
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.argv[3];
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[4];

    if (!SUPABASE_ANON_KEY || !SUPABASE_SERVICE_KEY) {
      console.error('❌ Ключи не найдены!');
      console.error('Использование: node automated-migrations.js [SUPABASE_URL] [SUPABASE_ANON_KEY] [SUPABASE_SERVICE_KEY]');
      console.error('Или установите переменные окружения: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY');
      process.exit(1);
    }
    
    // Создать клиент
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    console.log('📡 Подключение к Supabase...');
    
    // Проверить подключение
    const { data, error } = await supabase.from('organizations').select('count').limit(1);
    if (error) {
      console.error('❌ Ошибка подключения:', error.message);
      process.exit(1);
    }
    
    console.log('✅ Подключение успешно!');
    
    // Выполнить основные миграции
    console.log('📝 Выполнение миграций...');
    
    const migrationsDir = path.join(__dirname, 'supabase/migrations');
    const schemaPath = path.join(__dirname, 'supabase/schema.sql');
    
    // Сначала schema.sql
    if (fs.existsSync(schemaPath)) {
      console.log('🔧 Выполнение schema.sql...');
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      
      const { error: schemaError } = await supabase.rpc('execute_migration', {
        migration_version: 'schema',
        migration_name: 'schema.sql',
        migration_sql: schemaSQL
      });
      
      if (schemaError) {
        console.log('⚠️  Schema может уже существовать:', schemaError.message);
      } else {
        console.log('✅ Schema выполнен');
      }
    }
    
    // Затем миграции
    const migrations = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    for (const migration of migrations) {
      const migrationPath = path.join(migrationsDir, migration);
      const version = path.basename(migration, '.sql');
      
      console.log(`🔧 Выполнение ${version}...`);
      
      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      const { error: migrationError } = await supabase.rpc('execute_migration', {
        migration_version: version,
        migration_name: migration,
        migration_sql: sql
      });
      
      if (migrationError) {
        console.log(`⚠️  Миграция ${version} может уже выполнена:`, migrationError.message);
      } else {
        console.log(`✅ Миграция ${version} выполнена`);
      }
    }
    
    // Storage bucket
    console.log('📦 Создание storage bucket...');
    const storageSQL = fs.readFileSync(path.join(__dirname, 'scripts/create-storage-bucket.sql'), 'utf8');
    
    const { error: storageError } = await supabase.rpc('execute_migration', {
      migration_version: 'storage-bucket',
      migration_name: 'create-storage-bucket.sql',
      migration_sql: storageSQL
    });
    
    if (storageError) {
      console.log('⚠️  Storage bucket может уже существовать:', storageError.message);
    } else {
      console.log('✅ Storage bucket создан');
    }
    
    console.log('');
    console.log('🎉 МИГРАЦИИ ЗАВЕРШЕНЫ!');
    console.log('');
    console.log('Теперь настройте Vercel и Authentication URLs');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

main();
