#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Функция для обновления .env.local файла
function updateEnvFile(accessToken, refreshToken) {
  const envPath = path.join(__dirname, '.env.local');

  try {
    let envContent = '';

    // Читаем существующий файл, если он есть
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Разбиваем на строки
    const lines = envContent.split('\n');

    // Обновляем или добавляем переменные
    let accessTokenUpdated = false;
    let refreshTokenUpdated = false;

    const updatedLines = lines.map(line => {
      if (line.startsWith('KOMMO_TEST_ACCESS_TOKEN=')) {
        accessTokenUpdated = true;
        return `KOMMO_TEST_ACCESS_TOKEN=${accessToken}`;
      }
      if (line.startsWith('KOMMO_TEST_REFRESH_TOKEN=')) {
        refreshTokenUpdated = true;
        return `KOMMO_TEST_REFRESH_TOKEN=${refreshToken}`;
      }
      return line;
    });

    // Добавляем переменные, если их не было
    if (!accessTokenUpdated) {
      updatedLines.push(`KOMMO_TEST_ACCESS_TOKEN=${accessToken}`);
    }
    if (!refreshTokenUpdated && refreshToken) {
      updatedLines.push(`KOMMO_TEST_REFRESH_TOKEN=${refreshToken}`);
    }

    // Записываем обратно
    fs.writeFileSync(envPath, updatedLines.join('\n'), 'utf8');

    console.log('✅ Файл .env.local успешно обновлен!');
    console.log('🔄 Перезапустите приложение, если оно запущено.');

    return true;
  } catch (error) {
    console.error('❌ Ошибка при обновлении .env.local:', error.message);
    return false;
  }
}

// Основная функция
function main() {
  const accessToken = process.argv[2];
  const refreshToken = process.argv[3] || '';

  if (!accessToken) {
    console.log('Использование: node auto-update-env.js <ACCESS_TOKEN> [REFRESH_TOKEN]');
    console.log('');
    console.log('Пример:');
    console.log('node auto-update-env.js eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...');
    process.exit(1);
  }

  console.log('🔄 Обновляем переменные окружения...');
  const success = updateEnvFile(accessToken, refreshToken);

  if (success) {
    console.log('');
    console.log('🧪 Запустите тестирование:');
    console.log('npx tsx test-kommo.ts');
    console.log('');
    console.log('Или быстрое тестирование:');
    console.log('node quick-test-tokens.js');
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateEnvFile };
