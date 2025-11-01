#!/usr/bin/env node

// Скрипт для тестирования разных redirect URI
// Запуск: node test-redirect-uri.js

const https = require('https');

const testUrls = [
    {
        name: 'WorldWide Services',
        url: 'https://kommo.com/oauth?client_id=2a5c1463-43dd-4ccc-abd0-79516f785e57&redirect_uri=https%3A%2F%2Fworldwideservices.kommo.com%2Foauth%2Fcallback&scope=crm%3Aread%20crm%3Awrite%20leads%3Aread%20leads%3Awrite%20contacts%3Aread%20contacts%3Awrite%20tasks%3Aread%20tasks%3Awrite&state=test_worldwide&response_type=code'
    },
    {
        name: 'Vercel Production',
        url: 'https://kommo.com/oauth?client_id=2a5c1463-43dd-4ccc-abd0-79516f785e57&redirect_uri=https%3A%2F%2Fgpt-agent-kwid-7tkz4pejp-world-wide-services-62780b79.vercel.app%2Fintegrations%2Fkommo%2Foauth%2Fcallback&scope=crm%3Aread%20crm%3Awrite%20leads%3Aread%20leads%3Awrite%20contacts%3Aread%20contacts%3Awrite%20tasks%3Aread%20tasks%3Awrite&state=test_vercel&response_type=code'
    },
    {
        name: 'Localhost',
        url: 'https://kommo.com/oauth?client_id=2a5c1463-43dd-4ccc-abd0-79516f785e57&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fintegrations%2Fkommo%2Foauth%2Fcallback&scope=crm%3Aread%20crm%3Awrite%20leads%3Aread%20leads%3Awrite%20contacts%3Aread%20contacts%3Awrite%20tasks%3Aread%20tasks%3Awrite&state=test_localhost&response_type=code'
    }
];

console.log('🧪 ТЕСТИРОВАНИЕ REDIRECT URI ДЛЯ KOMMO OAUTH\n');
console.log('Этот скрипт проверяет, какие redirect URI принимаются Kommo\n');
console.log('='.repeat(60));

testUrls.forEach((testUrl, index) => {
    console.log(`${index + 1}. ${testUrl.name}:`);
    console.log(`   URL: ${testUrl.url.substring(0, 80)}...`);
    console.log(`   Redirect URI: ${decodeURIComponent(testUrl.url.match(/redirect_uri=([^&]+)/)[1])}`);
    console.log('');
});

console.log('📋 ИНСТРУКЦИИ:');
console.log('1. Скопируйте один из URL выше');
console.log('2. Откройте в браузере');
console.log('3. Если авторизация прошла успешно - этот URI правильный');
console.log('4. Если ошибка "Redirect URI is not associated with client" - попробуйте следующий');
console.log('');
console.log('🔍 ПОСЛЕ УСПЕШНОЙ АВТОРИЗАЦИИ:');
console.log('1. Скопируйте URL из адресной строки');
console.log('2. Найдите code=ВАШ_КОД');
console.log('3. Запустите: node exchange-code.js "ВАШ_КОД"');
console.log('');
console.log('📝 ПРИМЕЧАНИЕ:');
console.log('Если ни один URI не работает, нужно обновить настройки приложения в Kommo');

process.exit(0);
