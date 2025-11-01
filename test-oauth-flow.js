#!/usr/bin/env node

// Быстрый тест OAuth flow Kommo
// Запуск: node test-oauth-flow.js

const config = {
  clientId: '2a5c1463-43dd-4ccc-abd0-79516f785e57',
  clientSecret: '6FhlKjCZehELKIShuUQcPHdrF9uUHKLQosf0tDsSvdTuUoahVz3EO44xzVinlbh7',
  redirectUri: 'https://gpt-agent-kwid-44gyznxsi-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback'
};

console.log('🚀 ТЕСТ OAUTH FLOW KOMMO\n');

// 1. Создаем URL авторизации
const scope = 'crm:read crm:write leads:read leads:write contacts:read contacts:write tasks:read tasks:write';
const state = 'test_' + Date.now();
const authUrl = `https://kommo.com/oauth?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&response_type=code`;

console.log('1️⃣ URL АВТОРИЗАЦИИ:');
console.log(authUrl);
console.log('\n📋 ИНСТРУКЦИИ:');
console.log('1. Скопируйте URL выше');
console.log('2. Откройте его в браузере');
console.log('3. Авторизуйтесь в Kommo');
console.log('4. Разрешите доступ приложению');
console.log('5. Скопируйте code из URL после перенаправления');
console.log('6. Запустите: node exchange-code.js "CODE_HERE"');
console.log('\n🔧 АЛЬТЕРНАТИВА:');
console.log('- Используйте: http://localhost:8080/oauth-helper.html');
console.log('- Или файл: KOMMO_OAUTH_GUIDE.md для подробной инструкции');

console.log('\n⚡ БЫСТРЫЙ СТАРТ:');
console.log('python3 -m http.server 8080 && echo "Откройте: http://localhost:8080/oauth-helper.html"');
