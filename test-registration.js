const { chromium } = require('playwright');

async function testRegistration() {
  console.log('🚀 Запуск теста регистрации...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Переходим на страницу регистрации
    console.log('📝 Переходим на страницу регистрации...');
    await page.goto('http://localhost:3000/register');
    
    // Ждем загрузки формы
    await page.waitForSelector('form', { timeout: 10000 });
    console.log('✅ Форма регистрации загружена');
    
    // Генерируем тестовые данные
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = 'Test123456!';
    const testFirstName = 'Test';
    const testLastName = 'User';
    
    console.log(`📧 Тестовый email: ${testEmail}`);
    
    // Заполняем форму - ищем все поля
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInputs = page.locator('input[type="password"]');
    const textInputs = page.locator('input[type="text"]');
    const submitButton = page.locator('button[type="submit"]').first();
    
    // Заполняем email
    await emailInput.fill(testEmail);
    console.log('📧 Email заполнен');
    
    // Заполняем все текстовые поля (имя, фамилия и т.д.)
    const textInputCount = await textInputs.count();
    console.log(`👤 Найдено ${textInputCount} текстовых полей`);
    
    if (textInputCount >= 2) {
      await textInputs.nth(0).fill(testFirstName);
      await textInputs.nth(1).fill(testLastName);
      console.log('👤 Имя и фамилия заполнены');
    } else if (textInputCount === 1) {
      await textInputs.first().fill(`${testFirstName} ${testLastName}`);
      console.log('👤 Полное имя заполнено');
    }
    
    // Заполняем оба поля пароля
    const passwordCount = await passwordInputs.count();
    console.log(`🔑 Найдено ${passwordCount} полей пароля`);
    
    for (let i = 0; i < passwordCount; i++) {
      await passwordInputs.nth(i).fill(testPassword);
      console.log(`🔑 Поле пароля ${i + 1} заполнено`);
    }
    
    console.log('📝 Все поля заполнены, отправляем...');
    
    // Отправляем форму
    await submitButton.click();
    
    // Ждем редиректа или сообщения об успехе
    try {
      await page.waitForURL('**/login', { timeout: 15000 });
      console.log('✅ Редирект на страницу входа выполнен!');
      console.log('✅ РЕГИСТРАЦИЯ ПРОШЛА УСПЕШНО!');
      
      // Проверяем вход с новыми учетными данными
      console.log('🔐 Проверяем вход с новыми учетными данными...');
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', testPassword);
      await page.click('button[type="submit"]');
      
      // Ждем успешного входа
      await page.waitForURL('**/manage/**', { timeout: 15000 });
      console.log('✅ ВХОД ПРОШЕЛ УСПЕШНО!');
      
    } catch (error) {
      console.log('⚠️  Редирект не произошел, проверяем страницу...');
      const currentUrl = page.url();
      console.log(`Текущий URL: ${currentUrl}`);
      
      // Проверяем наличие сообщений об ошибке
      const errorElements = page.locator('.text-red-500, .text-red-600, .error, [role="alert"]');
      const errorCount = await errorElements.count();
      
      if (errorCount > 0) {
        for (let i = 0; i < Math.min(errorCount, 5); i++) {
          const errorMessage = await errorElements.nth(i).textContent();
          if (errorMessage && errorMessage.trim()) {
            console.log(`❌ Ошибка ${i + 1}: "${errorMessage.trim()}"`);
          }
        }
      } else {
        console.log('ℹ️  Нет явных сообщений об ошибке');
      }
      
      // Проверяем, есть ли success сообщение
      const successElements = page.locator('.text-green-500, .text-green-600, .success');
      const successCount = await successElements.count();
      
      if (successCount > 0) {
        for (let i = 0; i < successCount; i++) {
          const successMessage = await successElements.nth(i).textContent();
          console.log(`✅ Успех ${i + 1}: ${successMessage}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  } finally {
    // Не закрываем браузер автоматически, чтобы пользователь мог посмотреть
    console.log('\n🔍 Браузер открыт для проверки результатов');
    console.log('Закройте браузер вручную после проверки');
    // await browser.close();
  }
}

testRegistration();
