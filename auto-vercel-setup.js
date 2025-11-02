#!/usr/bin/env node
// АВТОМАТИЧЕСКАЯ НАСТРОЙКА VERCEL ENVIRONMENT VARIABLES

const https = require('https');

const VERCEL_TOKEN = 'g5wBHt7TxDknUEIHchTJUHEK';
const PROJECT_NAME = 'gpt-agent-kwid';

// Правильные переменные для production
const ENV_VARS = [
  { key: 'NEXTAUTH_SECRET', value: 'XH9mgmu70y7LaauJBoI7ynjGXlja6u4JCE894ZeKgKk=', encrypted: true },
  { key: 'NEXTAUTH_URL', value: 'https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app', encrypted: false },
  { key: 'SUPABASE_URL', value: 'https://rpzchsgutabxeabbnwas.supabase.co', encrypted: false },
  { key: 'SUPABASE_ANON_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI', encrypted: true },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2MzMzOCwiZXhwIjoyMDc1MTM5MzM4fQ.UIkX-rUGGTbMGfd5YoF41Dx3QBuLH13nO-R3BXdbx2I', encrypted: true },
  { key: 'NEXT_PUBLIC_SUPABASE_URL', value: 'https://rpzchsgutabxeabbnwas.supabase.co', encrypted: false },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI', encrypted: false },
  { key: 'OPENROUTER_API_KEY', value: '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', encrypted: true },
  { key: 'NODE_ENV', value: 'production', encrypted: false },
  { key: 'DEMO_MODE', value: 'false', encrypted: false },
  { key: 'E2E_ONBOARDING_FAKE', value: 'false', encrypted: false }
];

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ statusCode: res.statusCode, data: response });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function main() {
  console.log('🚀 АВТОМАТИЧЕСКАЯ НАСТРОЙКА VERCEL ENVIRONMENT VARIABLES');
  console.log('======================================================');
  console.log('');
  
  try {
    // 1. Получить информацию о проекте
    console.log('📡 Получение информации о проекте...');
    const projectResponse = await makeRequest({
      hostname: 'api.vercel.com',
      path: `/v9/projects/${PROJECT_NAME}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (projectResponse.statusCode !== 200) {
      console.error('❌ Проект не найден!');
      console.error('Ответ:', projectResponse.data);
      process.exit(1);
    }
    
    const projectId = projectResponse.data.id;
    console.log(`✅ Проект найден: ${projectId}`);
    console.log('');
    
    // 2. Получить существующие переменные
    console.log('📋 Получение существующих переменных...');
    const envResponse = await makeRequest({
      hostname: 'api.vercel.com',
      path: `/v10/projects/${projectId}/env`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (envResponse.statusCode === 200) {
      const existingVars = Array.isArray(envResponse.data.envs) ? envResponse.data.envs : [];
      console.log(`Найдено ${existingVars.length} существующих переменных`);
      
      // 3. Удалить все существующие переменные
      console.log('');
      console.log('🗑️  Удаление старых переменных...');
      for (const envVar of existingVars) {
        console.log(`   Удаление: ${envVar.key}...`);
        const deleteResponse = await makeRequest({
          hostname: 'api.vercel.com',
          path: `/v10/projects/${projectId}/env/${envVar.id}`,
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${VERCEL_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (deleteResponse.statusCode === 200 || deleteResponse.statusCode === 204) {
          console.log(`   ✅ ${envVar.key} удалена`);
        } else {
          console.log(`   ⚠️  ${envVar.key}: ${deleteResponse.statusCode}`);
        }
      }
    }
    
    console.log('');
    console.log('➕ Добавление правильных переменных...');
    
    // 4. Добавить новые переменные
    for (const envVar of ENV_VARS) {
      console.log(`   Добавление: ${envVar.key}...`);
      
      const addResponse = await makeRequest({
        hostname: 'api.vercel.com',
        path: `/v10/projects/${projectId}/env`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }, {
        key: envVar.key,
        value: envVar.value,
        type: envVar.encrypted ? 'encrypted' : 'plain',
        target: ['production']
      });
      
      if (addResponse.statusCode === 200 || addResponse.statusCode === 201) {
        console.log(`   ✅ ${envVar.key} добавлена`);
      } else {
        console.log(`   ❌ ${envVar.key}: ${addResponse.statusCode} - ${JSON.stringify(addResponse.data)}`);
      }
    }
    
    console.log('');
    console.log('🎉 VERCEL ENVIRONMENT VARIABLES НАСТРОЕНЫ!');
    console.log('');
    console.log('⏳ Vercel автоматически передеплоит приложение через 1-2 минуты');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

main();
