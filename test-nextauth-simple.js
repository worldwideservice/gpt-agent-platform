const { chromium } = require('playwright');

async function testNextAuthSimple() {
  console.log('🔧 Простой тест NextAuth...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Проверяем, доступен ли NextAuth API
    console.log('📡 Проверяем /api/auth/session...');
    const sessionResponse = await page.request.get('http://localhost:3000/api/auth/session');
    console.log(`📡 Статус: ${sessionResponse.status()}`);
    const sessionData = await sessionResponse.json();
    console.log(`📡 Данные: ${JSON.stringify(sessionData)}`);
    
    // Проверяем /api/auth/providers
    console.log('📡 Проверяем /api/auth/providers...');
    const providersResponse = await page.request.get('http://localhost:3000/api/auth/providers');
    console.log(`📡 Статус: ${providersResponse.status()}`);
    const providersData = await providersResponse.json();
    console.log(`📡 Провайдеры: ${JSON.stringify(providersData)}`);
    
    // Проверяем, что страница входа загружается
    console.log('🌐 Проверяем страницу входа...');
    await page.goto('http://localhost:3000/login');
    await page.waitForSelector('form', { timeout: 5000 });
    console.log('✅ Форма входа загружена');
    
    // Проверяем NextAuth скрипты на странице
    const hasNextAuth = await page.locator('script[src*="next-auth"]').count() > 0;
    console.log(`🔧 NextAuth скрипты: ${hasNextAuth ? 'найдены' : 'не найдены'}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Браузер закрыт');
  }
}

testNextAuthSimple().then(() => {
  console.log('✅ Тест завершен');
  process.exit(0);
}).catch(error => {
  console.error('💥 Ошибка:', error);
  process.exit(1);
});
