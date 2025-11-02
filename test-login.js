const { chromium } = require('playwright');

async function testLogin() {
  console.log('🚀 Запуск теста входа в систему...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Переходим на страницу входа
    console.log('🔐 Переходим на страницу входа...');
    await page.goto('http://localhost:3000/login');
    
    // Ждем загрузки формы
    await page.waitForSelector('form', { timeout: 10000 });
    console.log('✅ Форма входа загружена');
    
    // Сначала попробуем демо-аккаунт
    console.log('🎯 Пробуем войти с демо-аккаунтом...');
    console.log('   Email: founder@example.com');
    console.log('   Пароль: Demo1234!');
    
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill('founder@example.com');
    await passwordInput.fill('Demo1234!');
    
    console.log('📝 Демо-данные заполнены, входим...');
    await submitButton.click();
    
    // Ждем успешного входа
    try {
      await page.waitForURL('**/manage/**', { timeout: 15000 });
      console.log('✅ ВХОД С ДЕМО-АККАУНТОМ ПРОШЕЛ УСПЕШНО!');
      
      // Проверяем, что мы в системе управления
      const currentUrl = page.url();
      console.log(`📍 Текущий URL: ${currentUrl}`);
      
      // Проверяем наличие элементов управления
      const sidebar = page.locator('aside, nav').first();
      if (await sidebar.isVisible()) {
        console.log('✅ Боковая панель навигации видна');
      }
      
      // Ищем элементы меню
      const menuItems = ['Инфопанель', 'Агенты', 'Поддержка', 'Интеграции'];
      for (const item of menuItems) {
        const menuElement = page.locator(`text=${item}`).first();
        if (await menuElement.isVisible()) {
          console.log(`✅ Меню "${item}" доступно`);
        }
      }
      
    } catch (error) {
      console.log('⚠️  Вход не удался, проверяем ошибки...');
      
      // Проверяем сообщения об ошибке
      const errorElements = page.locator('.text-red-500, .text-red-600, .error, [role="alert"]');
      const errorCount = await errorElements.count();
      
      if (errorCount > 0) {
        for (let i = 0; i < Math.min(errorCount, 3); i++) {
          const errorMessage = await errorElements.nth(i).textContent();
          if (errorMessage && errorMessage.trim()) {
            console.log(`❌ Ошибка входа: "${errorMessage.trim()}"`);
          }
        }
      } else {
        console.log('ℹ️  Нет явных сообщений об ошибке входа');
        const currentUrl = page.url();
        console.log(`📍 Текущий URL: ${currentUrl}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании входа:', error.message);
  } finally {
    // Не закрываем браузер автоматически
    console.log('\n🔍 Браузер открыт для проверки результатов');
    console.log('Закройте браузер вручную после проверки');
    // await browser.close();
  }
}

testLogin();
