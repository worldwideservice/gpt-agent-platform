const { chromium } = require('playwright');

async function testLoginDebug() {
  console.log('🚀 Тестирование входа с отладкой...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Переходим на страницу входа
    console.log('📝 Переходим на страницу входа...');
    await page.goto('http://localhost:3000/login');
    
    // Ждем загрузки формы
    await page.waitForSelector('form', { timeout: 10000 });
    console.log('✅ Форма входа загружена');
    
    // Данные пользователя с правильным хэшем
    const testEmail = 'valid-test@example.com';
    const testPassword = 'Test123456!';
    
    console.log(`🔐 Тестируем вход:`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   Пароль: ${testPassword}`);
    
    // Заполняем форму
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    await emailInput.fill(testEmail);
    await passwordInput.fill(testPassword);
    
    console.log('📝 Данные заполнены, выполняем вход...');
    
    // Нажимаем кнопку входа
    await submitButton.click();
    
    // Ждем немного и проверяем URL
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    console.log(`📍 Текущий URL после входа: ${currentUrl}`);
    
    // Проверяем cookies
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name.includes('next-auth'));
    console.log(`🍪 NextAuth cookie: ${sessionCookie ? 'найден' : 'не найден'}`);
    
    // Проверяем API get-tenant-redirect
    console.log('🔍 Проверяем API get-tenant-redirect...');
    try {
      const apiResponse = await page.request.get('/api/auth/get-tenant-redirect');
      const apiData = await apiResponse.json();
      console.log('📡 API ответ:', JSON.stringify(apiData, null, 2));
    } catch (error) {
      console.log('❌ Ошибка API:', error.message);
    }
    
    // Ждем еще немного
    await page.waitForTimeout(2000);
    const finalUrl = page.url();
    console.log(`🎯 Финальный URL: ${finalUrl}`);
    
    // Проверяем содержимое страницы
    const pageTitle = await page.title();
    console.log(`📄 Заголовок страницы: "${pageTitle}"`);
    
    const hasSidebar = await page.locator('aside, nav').count() > 0;
    console.log(`🧭 Панель навигации: ${hasSidebar ? 'видна' : 'не видна'}`);
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  } finally {
    console.log('\n🔍 Браузер открыт для проверки');
    console.log('Закройте браузер вручную после проверки');
    // await browser.close();
  }
}

testLoginDebug();
