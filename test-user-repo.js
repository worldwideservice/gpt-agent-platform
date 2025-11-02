const { chromium } = require('playwright');

async function testUserRepo() {
  console.log('🧪 Тестируем UserRepository через API...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Создаем тестовый API endpoint для проверки UserRepository
    console.log('📡 Тестируем поиск пользователя по email...');
    const testResponse = await page.request.post('http://localhost:3000/api/auth/callback/credentials', {
      data: {
        email: 'valid-test@example.com',
        password: 'Test123456!',
        redirect: false
      }
    });
    
    console.log(`📡 Статус ответа: ${testResponse.status()}`);
    
    if (testResponse.status() === 200) {
      const responseData = await testResponse.json();
      console.log('📡 Ответ:', JSON.stringify(responseData, null, 2));
    } else {
      console.log('📡 Ошибка в ответе');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Браузер закрыт');
  }
}

testUserRepo().then(() => {
  console.log('✅ Тест завершен');
  process.exit(0);
}).catch(error => {
  console.error('💥 Ошибка:', error);
  process.exit(1);
});
