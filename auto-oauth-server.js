#!/usr/bin/env node

const http = require('http');
const https = require('https');
const { URL } = require('url');
const { exec } = require('child_process');

// Настройки
const CONFIG = {
  clientId: '2a5c1463-43dd-4ccc-abd0-79516f785e57',
  clientSecret: '6FhlKjCZehELKIShuUQcPHdrF9uUHKLQosf0tDsSvdTuUoahVz3EO44xzVinlbh7',
  localPort: 8081,
  domain: 'kwid'
};

let server;
let resolveCode;

// Функция для HTTP запросов
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data, raw: true });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// Создание локального сервера для приема callback
function createLocalServer() {
  return new Promise((resolve) => {
    server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${CONFIG.localPort}`);
      const code = url.searchParams.get('code');

      if (code) {
        console.log('\n✅ Authorization code получен!');
        console.log('🔑 Code:', code.substring(0, 20) + '...');

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
<!DOCTYPE html>
<html>
<head><title>OAuth Success</title></head>
<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
  <h1 style="color: green;">✅ Успешно!</h1>
  <p>Authorization code получен. Можно закрыть эту вкладку.</p>
  <p><small>Не закрывайте терминал!</small></p>
</body>
</html>
        `);

        resolve(code);
        server.close();
      } else {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
<!DOCTYPE html>
<html>
<head><title>OAuth Error</title></head>
<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
  <h1 style="color: red;">❌ Ошибка</h1>
  <p>Authorization code не найден.</p>
</body>
</html>
        `);
      }
    });

    server.listen(CONFIG.localPort, () => {
      console.log(`🌐 Локальный сервер запущен на http://localhost:${CONFIG.localPort}`);
    });
  });
}

// Шаг 1: Проверка существующих токенов
async function checkExistingTokens() {
  console.log('📋 ШАГ 1: Проверка существующих токенов...');

  const envPath = './.env.local';
  if (!require('fs').existsSync(envPath)) {
    console.log('❌ Файл .env.local не найден');
    return false;
  }

  const envContent = require('fs').readFileSync(envPath, 'utf8');
  const accessToken = envContent.match(/KOMMO_TEST_ACCESS_TOKEN=(.+)/)?.[1];

  if (!accessToken) {
    console.log('❌ Токены не найдены в .env.local');
    return false;
  }

  console.log('✅ Найден существующий токен, проверяем...');

  try {
    const response = await makeRequest(`https://${CONFIG.domain}.amocrm.ru/api/v4/users`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log('✅ Существующие токены работают!');
      return true;
    } else {
      console.log('❌ Токены не работают, нужно получить новые');
      return false;
    }
  } catch (error) {
    console.log('❌ Ошибка проверки токенов:', error.message);
    return false;
  }
}

// Шаг 2: Получение authorization code
async function getAuthorizationCode() {
  console.log('\n📋 ШАГ 2: Получение authorization code...');

  // Создаем локальный сервер для приема callback
  const codePromise = createLocalServer();

  // Генерируем OAuth URL с локальным redirect
  const params = new URLSearchParams({
    client_id: CONFIG.clientId,
    redirect_uri: `http://localhost:${CONFIG.localPort}/callback`,
    scope: 'crm:read crm:write leads:read leads:write contacts:read contacts:write tasks:read tasks:write',
    state: `auto_${Date.now()}`,
    response_type: 'code'
  });

  const oauthUrl = `https://kommo.com/oauth?${params.toString()}`;
  console.log('🔗 OAuth URL:', oauthUrl);

  // Открываем браузер
  console.log('\n🔗 Открываю браузер...');
  try {
    if (process.platform === 'darwin') {
      exec(`open "${oauthUrl}"`);
    } else if (process.platform === 'linux') {
      exec(`xdg-open "${oauthUrl}"`);
    } else {
      exec(`start "${oauthUrl}"`);
    }
    console.log('✅ Браузер открыт');
  } catch (error) {
    console.log('⚠️ Не удалось открыть браузер автоматически');
    console.log('🔗 Откройте вручную:', oauthUrl);
  }

  console.log('\n🎯 Авторизуйтесь в Kommo и разрешите доступ...');

  // Ждем получения кода
  const code = await codePromise;
  return code;
}

// Шаг 3: Обмен кода на токены
async function exchangeCodeForTokens(code) {
  console.log('\n📋 ШАГ 3: Обмен кода на токены...');

  try {
    const response = await makeRequest('https://kommo.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CONFIG.clientId,
        client_secret: CONFIG.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `http://localhost:${CONFIG.localPort}/callback`,
      }).toString()
    });

    if (response.status === 200 && response.data.access_token) {
      console.log('✅ Токены получены успешно!');
      console.log('🔑 Access Token:', response.data.access_token.substring(0, 20) + '...');
      if (response.data.refresh_token) {
        console.log('🔄 Refresh Token:', response.data.refresh_token.substring(0, 20) + '...');
      }
      return response.data;
    } else {
      console.log('❌ Ошибка получения токенов:', response.data);
      return null;
    }
  } catch (error) {
    console.log('❌ Ошибка сети при получении токенов:', error.message);
    return null;
  }
}

// Шаг 4: Обновление .env.local
function updateEnvFile(tokens) {
  console.log('\n📋 ШАГ 4: Обновление .env.local...');

  const fs = require('fs');
  const envPath = './.env.local';
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Обновляем или добавляем переменные
  const lines = envContent.split('\n');
  const updatedLines = [];
  let accessTokenUpdated = false;
  let refreshTokenUpdated = false;

  for (const line of lines) {
    if (line.startsWith('KOMMO_TEST_ACCESS_TOKEN=')) {
      updatedLines.push(`KOMMO_TEST_ACCESS_TOKEN=${tokens.access_token}`);
      accessTokenUpdated = true;
    } else if (line.startsWith('KOMMO_TEST_REFRESH_TOKEN=')) {
      updatedLines.push(`KOMMO_TEST_REFRESH_TOKEN=${tokens.refresh_token || ''}`);
      refreshTokenUpdated = true;
    } else {
      updatedLines.push(line);
    }
  }

  if (!accessTokenUpdated) {
    updatedLines.push(`KOMMO_TEST_ACCESS_TOKEN=${tokens.access_token}`);
  }
  if (!refreshTokenUpdated) {
    updatedLines.push(`KOMMO_TEST_REFRESH_TOKEN=${tokens.refresh_token || ''}`);
  }

  fs.writeFileSync(envPath, updatedLines.join('\n'), 'utf8');
  console.log('✅ Файл .env.local обновлен!');
}

// Шаг 5: Тестирование токенов
async function testTokens() {
  console.log('\n📋 ШАГ 5: Тестирование токенов...');

  const fs = require('fs');
  const envContent = fs.readFileSync('./.env.local', 'utf8');
  const accessToken = envContent.match(/KOMMO_TEST_ACCESS_TOKEN=(.+)/)?.[1];

  if (!accessToken) {
    console.log('❌ Токен не найден в .env.local');
    return false;
  }

  try {
    const response = await makeRequest(`https://${CONFIG.domain}.amocrm.ru/api/v4/users`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      console.log('✅ Токены работают! API доступен');
      return true;
    } else {
      console.log('❌ Токены не работают, статус:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Ошибка тестирования:', error.message);
    return false;
  }
}

// Основная функция
async function main() {
  try {
    console.log('🚀 АВТОМАТИЧЕСКАЯ НАСТРОЙКА KOMMO OAUTH\n');
    console.log('='.repeat(50));

    // Шаг 1: Проверка существующих токенов
    const tokensWorking = await checkExistingTokens();
    if (tokensWorking) {
      console.log('\n🎉 Токены уже работают! Настройка завершена.');
      return;
    }

    // Шаг 2: Получение authorization code
    const code = await getAuthorizationCode();

    // Шаг 3: Обмен на токены
    const tokens = await exchangeCodeForTokens(code);
    if (!tokens) {
      console.log('\n❌ Не удалось получить токены.');
      return;
    }

    // Шаг 4: Обновление .env
    updateEnvFile(tokens);

    // Шаг 5: Тестирование
    const testResult = await testTokens();

    if (testResult) {
      console.log('\n🎉 УСПЕХ! Kommo интеграция полностью настроена!');
      console.log('\n🚀 Теперь можно запускать:');
      console.log('npx tsx test-kommo.ts');
    } else {
      console.log('\n❌ Тестирование провалилось, но токены сохранены.');
    }

  } catch (error) {
    console.log('\n💥 Критическая ошибка:', error.message);
  } finally {
    if (server) {
      server.close();
    }
  }
}

// Запуск
if (require.main === module) {
  main();
}
