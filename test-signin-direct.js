const { chromium } = require('playwright');

async function testSignInDirect() {
  console.log('🔧 Тестирование signIn напрямую...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Переходим на страницу входа
    console.log('📝 Переходим на страницу входа...');
    await page.goto('http://localhost:3000/login', { timeout: 10000 });
    
    console.log('✅ Страница загружена');
    
    // Ждем загрузки NextAuth
    await page.waitForTimeout(1000);
    
    // Выполняем signIn через JavaScript
    console.log('🔄 Выполняем signIn через JavaScript...');
    const result = await page.evaluate(async () => {
      // Импортируем signIn
      const { signIn } = await import('next-auth/react');
      
      try {
        const result = await signIn('credentials', {
          email: 'valid-test@example.com',
          password: 'Test123456!',
          redirect: false,
          callbackUrl: '/agents'
        });
        
        return {
          success: true,
          result: result
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    console.log('📡 Результат signIn:', result);
    
    // Ждем немного
    await page.waitForTimeout(2000);
    
    // Проверяем cookies
    const cookies = await page.context().cookies();
    const hasSession = cookies.some(cookie => cookie.name.includes('next-auth'));
    console.log(`🍪 NextAuth сессия: ${hasSession ? '✅ есть' : '❌ нет'}`);
    
    // Проверяем текущий URL
    const currentUrl = page.url();
    console.log(`📍 Текущий URL: ${currentUrl}`);
    
    // Проверяем API сессии
    const sessionResponse = await page.request.get('http://localhost:3000/api/auth/session');
    const sessionData = await sessionResponse.json();
    console.log(`📡 Сессия API: ${JSON.stringify(sessionData)}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Браузер закрыт');
  }
}

testSignInDirect().then(() => {
  console.log('✅ Тест завершен');
  process.exit(0);
}).catch(error => {
  console.error('💥 Ошибка:', error);
  process.exit(1);
});
