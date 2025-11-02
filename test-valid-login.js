const { chromium } = require('playwright');

async function testValidLogin() {
  console.log('🚀 Тестирование входа с правильными данными...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Данные пользователя с правильным хэшем
    const testEmail = 'valid-test@example.com';
    const testPassword = 'Test123456!';
    
    console.log('🔐 Тестируем вход:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Пароль: ${testPassword}`);
    
    // Переходим на страницу входа
    console.log('📝 Переходим на страницу входа...');
    await page.goto('http://localhost:3000/login');
    
    // Ждем загрузки формы
    await page.waitForSelector('form', { timeout: 10000 });
    console.log('✅ Форма входа загружена');
    
    // Заполняем форму
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    
    console.log('📝 Данные заполнены, выполняем вход...');
    
    // Нажимаем кнопку входа
    await submitButton.click();
    
    // Ждем редиректа на страницу управления
    try {
      await page.waitForURL('**/manage/**', { timeout: 15000 });
      console.log('✅ ВХОД ПРОШЕЛ УСПЕШНО!');
      
      const currentUrl = page.url();
      console.log(`📍 Перенаправлено на: ${currentUrl}`);
      
      // Проверяем элементы интерфейса
      const sidebar = page.locator('aside, nav').first();
      if (await sidebar.isVisible()) {
        console.log('✅ Панель навигации загружена');
        
        // Проверяем основные разделы
        const menuItems = ['Инфопанель', 'Агенты', 'Поддержка'];
        let foundCount = 0;
        for (const item of menuItems) {
          const menuElement = page.locator(`text=${item}`).first();
          if (await menuElement.isVisible()) {
            console.log(`✅ Раздел "${item}" доступен`);
            foundCount++;
          }
        }
        
        if (foundCount > 0) {
          console.log(`🎉 СИСТЕМА АУТЕНТИФИКАЦИИ ПОЛНОСТЬЮ РАБОТАЕТ!`);
          console.log(`   Найдено ${foundCount} разделов меню`);
        }
      }
      
    } catch (error) {
      console.log('⚠️  Редирект не произошел, проверяем страницу...');
      
      const currentUrl = page.url();
      console.log(`📍 Текущий URL: ${currentUrl}`);
      
      if (currentUrl.includes('/login')) {
        console.log('❌ Остались на странице входа - вход не удался');
      } else if (currentUrl.includes('/')) {
        console.log('⚠️  Перенаправлены на главную страницу');
      }
      
      // Проверяем сообщения об ошибке
      const errorElements = page.locator('.text-red-500, .text-red-600, .error, [role="alert"]');
      const errorCount = await errorElements.count();
      
      if (errorCount > 0) {
        for (let i = 0; i < Math.min(errorCount, 3); i++) {
          const errorMessage = await errorElements.nth(i).textContent();
          if (errorMessage && errorMessage.trim()) {
            console.log(`❌ Ошибка: "${errorMessage.trim()}"`);
          }
        }
      } else {
        console.log('ℹ️  Нет явных сообщений об ошибке');
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  } finally {
    console.log('\n🔍 Браузер открыт для проверки');
    console.log('Закройте браузер вручную после проверки');
    // await browser.close();
  }
}

testValidLogin();
