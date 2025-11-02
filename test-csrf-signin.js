const { chromium } = require('playwright');

async function testCsrfSignIn() {
  console.log('🔧 Тест signIn с CSRF токеном...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.text().includes('🔐')) {
      console.log('🌐', msg.text());
    }
  });
  
  try {
    await page.goto('http://localhost:3000/login', { timeout: 10000 });
    
    // Получаем CSRF токен
    const csrfResponse = await page.request.get('http://localhost:3000/api/auth/csrf');
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;
    
    console.log('🔑 CSRF токен получен:', csrfToken ? '✅' : '❌');
    
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill('valid-test@example.com');
    await passwordInput.fill('Test123456!');
    
    console.log('📝 Форма заполнена, нажимаем вход...');
    await submitButton.click();
    
    // Ждем 3 секунды
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log(`📍 URL после входа: ${currentUrl}`);
    
    // Проверяем сессию
    const sessionResponse = await page.request.get('http://localhost:3000/api/auth/session');
    const sessionData = await sessionResponse.json();
    console.log(`📡 Сессия: ${JSON.stringify(sessionData)}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Браузер закрыт');
  }
}

testCsrfSignIn().then(() => {
  console.log('✅ Тест завершен');
  process.exit(0);
}).catch(error => {
  console.error('💥 Ошибка:', error);
  process.exit(1);
});
