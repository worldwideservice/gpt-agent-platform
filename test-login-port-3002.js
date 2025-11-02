const { chromium } = require('playwright');

async function testLoginPort3002() {
  console.log('🚀 Тестирование входа на порту 3002...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Переходим на страницу входа на правильном порту
    console.log('📝 Переходим на страницу входа...');
    await page.goto('http://localhost:3002/login');
    
    // Ждем загрузки формы
    await page.waitForSelector('form', { timeout: 10000 });
    console.log('✅ Форма входа загружена');
    
    // Данные пользователя
    const testEmail = 'valid-test@example.com';
    const testPassword = 'Test123456!';
    
    console.log(`🔐 Входим с: ${testEmail}`);
    
    // Заполняем форму
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    
    console.log('📝 Данные заполнены, выполняем вход...');
    
    // Нажимаем кнопку входа
    await submitButton.click();
    
    // Ждем 5 секунд
    await page.waitForTimeout(5000);
    
    const currentUrl = page.url();
    console.log(`📍 URL после входа: ${currentUrl}`);
    
    // Проверяем cookies
    const cookies = await page.context().cookies();
    const hasSession = cookies.some(cookie => cookie.name.includes('next-auth'));
    console.log(`🍪 NextAuth сессия: ${hasSession ? '✅ есть' : '❌ нет'}`);
    
    // Проверяем результат
    const isOnManagePage = currentUrl.includes('/manage/');
    const isOnLanding = currentUrl === 'http://localhost:3002/' || currentUrl === 'http://localhost:3002';
    
    if (isOnManagePage) {
      console.log('✅ УСПЕХ: Попали в систему управления!');
    } else if (isOnLanding) {
      console.log('❌ ПРОВАЛ: Перенаправлены на главную страницу');
    } else {
      console.log(`⚠️ НЕИЗВЕСТНО: URL ${currentUrl}`);
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  } finally {
    await browser.close();
    console.log('🔒 Браузер закрыт');
  }
}

testLoginPort3002().then(() => {
  console.log('🎯 Тест завершен!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Критическая ошибка:', error);
  process.exit(1);
});
