#!/usr/bin/env node

// АВТОМАТИЧЕСКАЯ НАСТРОЙКА VERCEL ENVIRONMENT VARIABLES
const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

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

async function setupVercelEnv() {
  console.log('🚀 НАСТРОЙКА VERCEL ENVIRONMENT VARIABLES');
  console.log('==========================================');
  
  try {
    // Получить Vercel токен
    const VERCEL_TOKEN = await ask('Введите Vercel API Token (получить: https://vercel.com/account/tokens): ');
    
    if (!VERCEL_TOKEN) {
      console.log('⚠️  Vercel токен не указан. Перейдите к ручной настройке.');
      console.log('📋 Ручная настройка: https://vercel.com/dashboard');
      return;
    }
    
    // Получить ключи
    const SUPABASE_ANON_KEY = await ask('Введите SUPABASE_ANON_KEY: ');
    const SUPABASE_SERVICE_KEY = await ask('Введите SUPABASE_SERVICE_ROLE_KEY: ');
    const OPENROUTER_API_KEY = await ask('Введите OPENROUTER_API_KEY: ');
    
    // Получить информацию о проекте
    console.log('📡 Получение информации о проекте...');
    
    const projectResponse = await makeRequest({
      hostname: 'api.vercel.com',
      path: '/v9/projects/gpt-agent-kwid',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (projectResponse.statusCode !== 200) {
      console.log('❌ Не удалось получить проект Vercel');
      console.log('📋 Ручная настройка: https://vercel.com/dashboard');
      return;
    }
    
    const projectId = projectResponse.data.id;
    console.log(`✅ Проект найден: ${projectId}`);
    
    // Переменные окружения
    const envVars = [
      { key: 'NEXTAUTH_SECRET', value: 'XH9mgmu70y7LaauJBoI7ynjGXlja6u4JCE894ZeKgKk=', type: 'encrypted' },
      { key: 'NEXTAUTH_URL', value: 'https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app', type: 'plain' },
      { key: 'SUPABASE_URL', value: 'https://rpzchsgutabxeabbnwas.supabase.co', type: 'plain' },
      { key: 'SUPABASE_ANON_KEY', value: SUPABASE_ANON_KEY, type: 'encrypted' },
      { key: 'SUPABASE_SERVICE_ROLE_KEY', value: SUPABASE_SERVICE_KEY, type: 'encrypted' },
      { key: 'OPENROUTER_API_KEY', value: OPENROUTER_API_KEY, type: 'encrypted' },
      { key: 'NODE_ENV', value: 'production', type: 'plain' },
      { key: 'DEMO_MODE', value: 'false', type: 'plain' },
      { key: 'E2E_ONBOARDING_FAKE', value: 'false', type: 'plain' }
    ];
    
    // Добавить переменные
    for (const envVar of envVars) {
      console.log(`🔧 Установка ${envVar.key}...`);
      
      const response = await makeRequest({
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
        type: envVar.type,
        target: ['production']
      });
      
      if (response.statusCode === 200 || response.statusCode === 201) {
        console.log(`✅ ${envVar.key} установлен`);
      } else {
        console.log(`⚠️  Ошибка установки ${envVar.key}:`, response.data);
      }
    }
    
    console.log('');
    console.log('🎉 VERCEL ENVIRONMENT VARIABLES НАСТРОЕНЫ!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.log('📋 Ручная настройка: https://vercel.com/dashboard');
  } finally {
    rl.close();
  }
}

setupVercelEnv();
