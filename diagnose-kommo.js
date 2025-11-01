#!/usr/bin/env node

// Диагностика настройки Kommo API
// Запуск: node diagnose-kommo.js

const https = require('https');

const config = {
  clientId: '2a5c1463-43dd-4ccc-abd0-79516f785e57',
  clientSecret: '6FhlKjCZehELKIShuUQcPHdrF9uUHKLQosf0tDsSvdTuUoahVz3EO44xzVinlbh7',
  redirectUri: 'https://gpt-agent-kwid-44gyznxsi-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback',
  domain: 'kwid'
};

console.log('🔍 Диагностика настройки Kommo API\n');

// Шаг 1: Проверка доступности OAuth эндпоинта
console.log('1️⃣ Проверка доступности OAuth эндпоинта...');
const oauthUrl = `https://kommo.com/oauth?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=crm:read&state=diagnostic&response_type=code`;

console.log(`   URL: ${oauthUrl}`);
console.log('   Статус: Этот URL нужно открыть в браузере для авторизации\n');

// Шаг 2: Проверка токенов из .env.local (если есть)
console.log('2️⃣ Проверка переменных окружения...');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('   ✅ Файл .env.local найден');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasEnabled = envContent.includes('KOMMO_TEST_ENABLED=1');
  const hasClientId = envContent.includes('KOMMO_TEST_CLIENT_ID=');
  const hasAccessToken = envContent.includes('KOMMO_TEST_ACCESS_TOKEN=') && !envContent.includes('KOMMO_TEST_ACCESS_TOKEN=demo');

  console.log(`   KOMMO_TEST_ENABLED: ${hasEnabled ? '✅' : '❌'}`);
  console.log(`   KOMMO_TEST_CLIENT_ID: ${hasClientId ? '✅' : '❌'}`);
  console.log(`   KOMMO_TEST_ACCESS_TOKEN: ${hasAccessToken ? '✅' : '❌ (демо значение)'}`);
} else {
  console.log('   ❌ Файл .env.local не найден');
}

// Шаг 3: Тестовый запрос к API (если есть токен)
console.log('\n3️⃣ Тестирование API подключения...');

// Проверяем переменные окружения
const accessToken = process.env.KOMMO_TEST_ACCESS_TOKEN;
if (accessToken && accessToken !== 'demo-access-token-replace-with-real-one') {
  console.log('   ✅ Найден access token, тестируем...');

  // Делаем тестовый запрос
  const apiUrl = 'https://api-c.kommo.com/api/v4/users';

  https.get(apiUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }, (res) => {
    console.log(`   Статус ответа: ${res.statusCode}`);

    if (res.statusCode === 200) {
      console.log('   ✅ Токен работает!');
      console.log('\n🎉 Настройка Kommo успешна!');
      console.log('   Теперь можно запускать: npx tsx test-kommo.ts');
    } else if (res.statusCode === 401) {
      console.log('   ❌ Токен истек или недействителен');
      console.log('   Нужно получить новые токены через OAuth');
    } else {
      console.log(`   ⚠️  Неожиданный статус: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.log(`   ❌ Ошибка сети: ${err.message}`);
  });

} else {
  console.log('   ❌ Access token не найден или содержит демо значение');
}

// Шаг 4: Инструкции
console.log('\n📋 РЕКОМЕНДАЦИИ:');
console.log('');
console.log('1. Создайте/проверьте интеграцию в Kommo:');
console.log('   https://www.kommo.com/developers/config/');
console.log('');
console.log('2. Убедитесь, что права доступа включают:');
console.log('   - crm:read, crm:write');
console.log('   - leads:read, leads:write');
console.log('   - contacts:read, contacts:write');
console.log('   - tasks:read, tasks:write');
console.log('');
console.log('3. Проверьте Redirect URI:');
console.log(`   ${config.redirectUri}`);
console.log('');
console.log('4. Получите новые токены:');
console.log('   - Запустите: python3 -m http.server 8080');
console.log('   - Откройте: http://localhost:8080/oauth-helper.html');
console.log('   - Следуйте инструкциям');
console.log('');
console.log('5. Или используйте скрипт:');
console.log('   node exchange-code.js "YOUR_AUTH_CODE"');
console.log('');
console.log('📖 Подробная инструкция: KOMMO_OAUTH_GUIDE.md');
