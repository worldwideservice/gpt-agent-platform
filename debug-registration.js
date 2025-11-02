const { chromium } = require('playwright');

async function debugRegistration() {
  console.log('🔍 ПОШАГОВАЯ ОТЛАДКА РЕГИСТРАЦИИ');

  const browser = await chromium.launch({ headless: false }); // visible browser for debugging
  const page = await browser.newPage();

  const baseUrl = 'https://gpt-agent-kwid-bxw0a8dht-world-wide-services-62780b79.vercel.app';

  try {
    console.log('1. Переход на страницу регистрации...');
    await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    console.log('2. Проверка наличия формы...');
    const formExists = await page.locator('form').isVisible().catch(() => false);
    console.log('   Форма найдена:', formExists);

    const emailField = await page.locator('#email').isVisible().catch(() => false);
    const passwordField = await page.locator('#password').isVisible().catch(() => false);
    const firstNameField = await page.locator('#firstName').isVisible().catch(() => false);
    const lastNameField = await page.locator('#lastName').isVisible().catch(() => false);
    const submitButton = await page.locator('button[type="submit"]').isVisible().catch(() => false);

    console.log('   Поле email:', emailField);
    console.log('   Поле пароль:', passwordField);
    console.log('   Поле имя:', firstNameField);
    console.log('   Поле фамилия:', lastNameField);
    console.log('   Кнопка отправки:', submitButton);

    if (!formExists || !emailField || !passwordField || !firstNameField || !lastNameField || !submitButton) {
      console.log('❌ ФОРМА НЕ ПОЛНАЯ! Останавливаемся.');
      await browser.close();
      return;
    }

    console.log('3. Заполнение формы...');
    const timestamp = Date.now();
    const testEmail = `debug-${timestamp}@test.com`;

    await page.fill('#firstName', 'Debug');
    await page.fill('#lastName', 'User');
    await page.fill('#email', testEmail);
    await page.fill('#password', 'DebugPass123!');
    await page.fill('#confirmPassword', 'DebugPass123!');

    console.log('   Данные заполнены');

    console.log('4. Отправка формы...');
    await page.click('button[type="submit"]');
    console.log('   Кнопка нажата');

    console.log('5. Ожидание ответа (10 секунд)...');
    await page.waitForTimeout(10000);

    const currentUrl = page.url();
    console.log('   Текущий URL:', currentUrl);

    // Проверяем наличие сообщений об ошибке
    const errorText = await page.locator('.text-red-500, .text-red-600, .text-red-700').textContent().catch(() => '');
    if (errorText) {
      console.log('   Сообщение об ошибке:', errorText);
    }

    // Проверяем наличие уведомлений
    const successToast = await page.locator('text=Регистрация успешна').isVisible().catch(() => false);
    if (successToast) {
      console.log('   ✅ Уведомление об успехе найдено');
    }

    // Проверяем, перешли ли на страницу логина
    const isOnLoginPage = currentUrl.includes('/login');
    console.log('   На странице логина:', isOnLoginPage);

    if (isOnLoginPage) {
      console.log('✅ РЕГИСТРАЦИЯ УСПЕШНА! Пользователь перенаправлен на логин.');

      console.log('6. Тестирование входа...');
      await page.fill('#email', testEmail);
      await page.fill('#password', 'DebugPass123!');
      await page.click('button[type="submit"]');

      console.log('   Попытка входа...');
      await page.waitForTimeout(5000);

      const afterLoginUrl = page.url();
      console.log('   URL после входа:', afterLoginUrl);

      const loginSuccess = !afterLoginUrl.includes('/login');
      console.log('   Вход успешен:', loginSuccess);

    } else {
      console.log('❌ РЕГИСТРАЦИЯ НЕ УСПЕШНА! Пользователь не перенаправлен на логин.');

      // Проверяем, есть ли мы все еще на странице регистрации
      const stillOnRegister = currentUrl.includes('/register');
      console.log('   Все еще на регистрации:', stillOnRegister);

      if (stillOnRegister) {
        console.log('🔍 ДИАГНОСТИКА:');
        console.log('   - Проверьте консоль браузера на ошибки JavaScript');
        console.log('   - Проверьте network tab на неудачные запросы');
        console.log('   - Проверьте, что все поля формы заполнены корректно');
      }
    }

  } catch (error) {
    console.error('❌ ОШИБКА ПРИ ОТЛАДКЕ:', error.message);
  } finally {
    // Не закрываем браузер автоматически, чтобы пользователь мог посмотреть
    console.log('\n🔍 БРАУЗЕР ОСТАЛСЯ ОТКРЫТЫМ ДЛЯ АНАЛИЗА');
    console.log('Закройте браузер вручную после проверки');
    // await browser.close();
  }
}

debugRegistration().catch(console.error);
