const { chromium } = require('playwright');

async function testAuthFinal() {
  console.log('🚀 Финальный тест аутентификации...');
  
  // Запускаем браузер
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('📝 Переходим на страницу входа...');
    await page.goto('http://localhost:3000/login', { timeout: 10000 });
    
    console.log('✅ Страница загружена');
    
    // Проверяем, что форма существует
    const formExists = await page.locator('form').count() > 0;
    console.log(`📋 Форма найдена: ${formExists}`);
    
    // Проверяем API сессии
    console.log('🔍 Проверяем API сессии...');
    const sessionResponse = await page.request.get('http://localhost:3000/api/auth/session');
    const sessionStatus = sessionResponse.status();
    console.log(`📡 Статус сессии API: ${sessionStatus}`);
    
    if (sessionStatus === 200) {
      const sessionData = await sessionResponse.json();
      console.log(`📡 Данные сессии: ${JSON.stringify(sessionData)}`);
    }
    
    // Проверяем провайдеры
    const providersResponse = await page.request.get('http://localhost:3000/api/auth/providers');
    const providersStatus = providersResponse.status();
    console.log(`📡 Статус провайдеров API: ${providersStatus}`);
    
    if (providersStatus === 200) {
      const providersData = await providersResponse.json();
      console.log(`📡 Провайдеры: ${Object.keys(providersData).join(', ')}`);
    }
    
    // Пробуем заполнить форму и нажать вход (без ожидания результата)
    console.log('📝 Заполняем форму...');
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill('founder@example.com');
    await passwordInput.fill('Demo1234!');
    
    console.log('🔄 Нажимаем кнопку входа...');
    await submitButton.click();
    
    // Ждем 3 секунды и проверяем URL
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    console.log(`📍 URL через 3 секунды: ${currentUrl}`);

    // Проверяем сессию после попытки входа
    const sessionAfterResponse = await page.request.get('http://localhost:3000/api/auth/session');
    const sessionAfterData = await sessionAfterResponse.json();
    console.log(`📡 Сессия после входа: ${JSON.stringify(sessionAfterData)}`);
    
    // Финальный результат
    const hasSession = sessionAfterData && Object.keys(sessionAfterData).length > 0;
    const isOnManagePage = currentUrl.includes('/manage/');
    const isOnLoginPage = currentUrl.includes('/login') || currentUrl.includes('localhost:3000/login');
    
    console.log('🎯 РЕЗУЛЬТАТ:');
    console.log(`   - Сессия создана: ${hasSession ? '✅' : '❌'}`);
    console.log(`   - На странице управления: ${isOnManagePage ? '✅' : '❌'}`);
    console.log(`   - Остались на входе: ${isOnLoginPage ? '✅' : '❌'}`);
    
    if (isOnManagePage && hasSession) {
      console.log('🎉 УСПЕХ: Аутентификация работает!');
    } else {
      console.log('❌ ПРОВАЛ: Аутентификация не работает');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    // Всегда закрываем браузер
    await browser.close();
    console.log('🔒 Браузер закрыт');
  }
}

// Запускаем и завершаемся
testAuthFinal().then(() => {
  console.log('✅ Тест завершен успешно');
  process.exit(0);
}).catch(error => {
  console.error('💥 Критическая ошибка:', error);
  process.exit(1);
});
