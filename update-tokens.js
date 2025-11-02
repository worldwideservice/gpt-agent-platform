#!/usr/bin/env node

// Скрипт для ручного обновления токенов Kommo
// Использование: node update-tokens.js "ACCESS_TOKEN" "REFRESH_TOKEN"

const fs = require('fs');
const path = require('path');

const accessToken = process.argv[2];
const refreshToken = process.argv[3];

if (!accessToken || !refreshToken) {
  console.log('❌ Использование: node update-tokens.js "ACCESS_TOKEN" "REFRESH_TOKEN"');
  console.log('');
  console.log('Пример:');
  console.log('node update-tokens.js "eyJ0eXAiOiJKV1Qi..." "refresh_token_here"');
  process.exit(1);
}

const envPath = path.join(process.cwd(), '.env.local');

try {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Обновляем access token
  envContent = envContent.replace(
    /KOMMO_TEST_ACCESS_TOKEN=.*/,
    `KOMMO_TEST_ACCESS_TOKEN=${accessToken}`
  );
  
  // Обновляем refresh token
  envContent = envContent.replace(
    /KOMMO_TEST_REFRESH_TOKEN=.*/,
    `KOMMO_TEST_REFRESH_TOKEN=${refreshToken}`
  );
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Токены успешно обновлены в .env.local!');
  console.log('');
  console.log('🚀 Теперь протестируйте:');
  console.log('npx tsx test-kommo.ts');
  
} catch (error) {
  console.log('❌ Ошибка при обновлении токенов:', error.message);
  process.exit(1);
}
EOF && chmod +x update-tokens.js && echo "" && echo "✅ Скрипт update-tokens.js создан!" && echo "" && echo "📋 ИНСТРУКЦИИ ПО ИСПОЛЬЗОВАНИЮ:" && echo "1. Получите токены через oauth-helper.html" && echo "2. Скопируйте Access Token и Refresh Token" && echo "3. Запустите: node update-tokens.js \"ACCESS_TOKEN\" \"REFRESH_TOKEN\"" && echo "4. Протестируйте: npx tsx test-kommo.ts"