#!/usr/bin/env node

// КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Добавление RLS политики для создания пользователей
const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rpzchsgutabxeabbnwas.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[2];

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY не найден!');
  process.exit(1);
}

const migrationSQL = fs.readFileSync(
  path.join(__dirname, 'supabase/migrations/fix_users_insert_policy.sql'),
  'utf8'
);

function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    };

    // Разбиваем SQL на отдельные команды и выполняем по одной
    const statements = sql.split(';').filter(s => s.trim().length > 0);
    
    console.log(`📝 Найдено ${statements.length} SQL команд`);
    
    async function executeNext(index) {
      if (index >= statements.length) {
        resolve();
        return;
      }
      
      const statement = statements[index].trim();
      if (!statement) {
        executeNext(index + 1);
        return;
      }
      
      console.log(`🔧 Выполнение команды ${index + 1}/${statements.length}...`);
      
      // Используем прямой запрос к PostgreSQL через REST API
      const query = encodeURIComponent(statement);
      const queryPath = `/rest/v1/rpc/exec_sql?query=${query}`;
      
      const req = https.request({
        hostname: url.hostname,
        path: queryPath,
        method: 'GET',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ Команда ${index + 1} выполнена`);
            executeNext(index + 1);
          } else {
            console.log(`⚠️  Команда ${index + 1}: ${body}`);
            executeNext(index + 1); // Продолжаем даже при ошибке
          }
        });
      });
      
      req.on('error', (error) => {
        console.error(`❌ Ошибка команды ${index + 1}:`, error.message);
        executeNext(index + 1); // Продолжаем
      });
      
      req.end();
    }
    
    executeNext(0);
  });
}

// Альтернативный метод - через Supabase Management API
async function applyMigrationDirectly() {
  console.log('🚀 Применение исправления RLS политики для users...');
  console.log('');
  
  // Используем Supabase MCP для выполнения SQL
  console.log('📋 SQL для выполнения:');
  console.log(migrationSQL);
  console.log('');
  console.log('⚠️  ВНИМАНИЕ: Этот скрипт должен выполняться через Supabase MCP или Dashboard');
  console.log('');
  console.log('📝 Инструкция:');
  console.log('1. Перейдите в Supabase Dashboard: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/sql');
  console.log('2. Скопируйте содержимое файла: supabase/migrations/fix_users_insert_policy.sql');
  console.log('3. Вставьте в SQL Editor');
  console.log('4. Нажмите RUN');
  console.log('');
}

applyMigrationDirectly();
