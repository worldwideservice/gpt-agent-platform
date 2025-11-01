// Скрипт для обмена authorization code на токены
// Запуск: node exchange-code.js "YOUR_CODE_HERE"

const code = process.argv[2];

if (!code) {
  console.log('❌ Использование: node exchange-code.js "YOUR_AUTHORIZATION_CODE"');
  process.exit(1);
}

console.log('🔄 Обмениваем code на токены...');

fetch('https://kommo.com/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    client_id: '2a5c1463-43dd-4ccc-abd0-79516f785e57',
    client_secret: '6FhlKjCZehELKIShuUQcPHdrF9uUHKLQosf0tDsSvdTuUoahVz3EO44xzVinlbh7',
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: 'https://gpt-agent-kwid-7tkz4pejp-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback',
  }),
})
.then(res => res.json())
.then(tokens => {
  if (tokens.access_token) {
    console.log('✅ Токены получены!');
    console.log('');
    console.log('📝 Добавьте в .env.local:');
    console.log(`KOMMO_TEST_ACCESS_TOKEN=${tokens.access_token}`);
    if (tokens.refresh_token) {
      console.log(`KOMMO_TEST_REFRESH_TOKEN=${tokens.refresh_token}`);
    }
    console.log('');
    console.log('🔄 Перезапустите dev сервер после обновления .env.local');
  } else {
    console.log('❌ Ошибка получения токенов:', tokens);
  }
})
.catch(err => {
  console.error('❌ Ошибка сети:', err.message);
});
