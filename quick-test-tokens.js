#!/usr/bin/env node

const https = require('https');

// Настройки Kommo
const ACCESS_TOKEN = process.env.KOMMO_TEST_ACCESS_TOKEN;
const DOMAIN = process.env.KOMMO_TEST_DOMAIN || 'kwid';

if (!ACCESS_TOKEN) {
  console.error('❌ KOMMO_TEST_ACCESS_TOKEN не найден в переменных окружения');
  process.exit(1);
}

console.log('🧪 Быстрое тестирование токенов Kommo...\n');

async function testEndpoint(endpoint, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: `${DOMAIN}.amocrm.ru`,
      path: `/api/v4/${endpoint}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Kommo-Test/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log(`✅ ${description}: УСПЕШНО`);
            resolve(true);
          } else {
            console.log(`❌ ${description}: ОШИБКА ${res.statusCode}`);
            if (jsonData.title) {
              console.log(`   Сообщение: ${jsonData.title}`);
            }
            resolve(false);
          }
        } catch (e) {
          console.log(`❌ ${description}: ОШИБКА ПАРСИНГА JSON`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${description}: СЕТЕВАЯ ОШИБКА - ${error.message}`);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      console.log(`❌ ${description}: ТАЙМАУТ`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function runTests() {
  const tests = [
    { endpoint: 'users', description: 'Получение пользователей' },
    { endpoint: 'leads/pipelines', description: 'Получение воронок продаж' },
    { endpoint: 'leads', description: 'Получение сделок' },
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    const success = await testEndpoint(test.endpoint, test.description);
    if (success) passed++;
    // Небольшая пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:`);
  console.log(`   Пройдено: ${passed}/${total}`);
  console.log(`   Статус: ${passed === total ? '✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ' : '❌ НЕКОТОРЫЕ ТЕСТЫ ПРОВАЛИЛИСЬ'}`);

  if (passed > 0) {
    console.log(`\n🎉 Токены работают! Можно запускать npx tsx test-kommo.ts для полного тестирования.`);
  }
}

runTests().catch(console.error);
