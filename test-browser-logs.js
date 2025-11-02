const { chromium } = require('playwright');

async function testBrowserLogs() {
  console.log('🔧 Тестирование с логами браузера...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Логируем все консольные сообщения
  page.on('console', msg => {
    console.log('🌐 BROWSER LOG:', msg.text());
  });
  
  try {
    console.log('📝 Переходим на страницу входа...');
    await page.goto('http://localhost:3002/login', { timeout: 10000 });
    
    console.log('✅ Страница загружена');
    
    // Заполняем форму
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill('valid-test@example.com');
    await passwordInput.fill('Test123456!');
    
    console.log('📝 Форма заполнена, нажимаем вход...');
    
    // Нажимаем кнопку входа
    await submitButton.click();
    
    // Ждем 5 секунд и логируем результат
    await page.waitForTimeout(5000);
    
    const currentUrl = page.url();
    console.log(`📍 Финальный URL: ${currentUrl}`);
    
    // Проверяем сессию
    const sessionResponse = await page.request.get('http://localhost:3002/api/auth/session');
    const sessionData = await sessionResponse.json();
    console.log(`📡 Финальная сессия: ${JSON.stringify(sessionData)}`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Браузер закрыт');
  }
}

testBrowserLogs().then(() => {
  console.log('✅ Тест завершен');
  process.exit(0);
}).catch(error => {
  console.error('💥 Ошибка:', error);
  process.exit(1);
});
