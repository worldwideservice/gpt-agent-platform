#!/usr/bin/env node
// ПРИНУДИТЕЛЬНЫЙ ДЕПЛОЙ НА VERCEL

const https = require('https');
const { execSync } = require('child_process');

const VERCEL_TOKEN = 'g5wBHt7TxDknUEIHchTJUHEK';
const PROJECT_NAME = 'gpt-agent-kwid';

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
  console.log('🚀 ПРИНУДИТЕЛЬНЫЙ ДЕПЛОЙ НА VERCEL');
  console.log('===================================');
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
    
    // 2. Создать новый деплой через Git
    console.log('📦 Создание нового деплоя...');
    console.log('Используется vercel CLI...');
    
    // Попробовать через vercel CLI
    try {
      console.log('Запуск: vercel --prod --force');
      const deployOutput = execSync('vercel --prod --force --yes', { 
        encoding: 'utf8',
        stdio: 'inherit',
        cwd: process.cwd()
      });
      console.log('✅ Деплой запущен через CLI');
    } catch (error) {
      console.log('⚠️  CLI деплой не сработал, пробуем через API...');
      
      // Альтернатива: триггерить деплой через GitHub/webhook
      console.log('');
      console.log('📋 РУЧНАЯ ИНСТРУКЦИЯ:');
      console.log('1. Перейдите: https://vercel.com/dashboard');
      console.log('2. Выберите проект: gpt-agent-kwid');
      console.log('3. Нажмите "Redeploy" на последнем деплое');
      console.log('   или нажмите "Deploy" → выберите последний коммит');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

main();
