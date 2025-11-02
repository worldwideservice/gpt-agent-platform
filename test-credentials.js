const { chromium } = require('playwright');

async function testCredentialsDirect() {
  console.log('🔧 Тестирование credentials provider напрямую...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Прямой вызов NextAuth API с credentials
    console.log('📡 Вызываем /api/auth/callback/credentials напрямую...');
    
    const response = await page.request.post('http://localhost:3000/api/auth/callback/credentials', {
      data: {
        email: 'valid-test@example.com',
        password: 'Test123456!',
        redirect: false,
        callbackUrl: '/'
      }
    });
    
    console.log(`📡 Статус ответа: ${response.status()}`);
    
    if (response.status() === 200) {
      const data = await response.json();
      console.log('📡 Ответ:', JSON.stringify(data, null, 2));
    } else {
      console.log('📡 Ошибка в ответе');
      const text = await response.text();
      console.log('📡 Текст ответа:', text.substring(0, 500));
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Браузер закрыт');
  }
}

testCredentialsDirect().then(() => {
  console.log('✅ Тест завершен');
  process.exit(0);
}).catch(error => {
  console.error('💥 Ошибка:', error);
  process.exit(1);
});
