const { chromium } = require('playwright');

async function testRegistration() {
  console.log('🧪 ТЕСТИРОВАНИЕ РЕГИСТРАЦИИ И ВХОДА');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'https://gpt-agent-kwid-bxw0a8dht-world-wide-services-62780b79.vercel.app';

  try {
    // 1. ТЕСТ ДОСТУПА К СТРАНИЦАМ
    console.log('📍 ШАГ 1: Проверка доступа к страницам');

    await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
    const registerTitle = await page.title();
    console.log(`📄 Страница регистрации: ${registerTitle}`);

    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    const loginTitle = await page.title();
    console.log(`📄 Страница логина: ${loginTitle}`);

    // 2. ТЕСТ РЕГИСТРАЦИИ
    console.log('\n📝 ШАГ 2: Регистрация нового пользователя');

    const timestamp = Date.now();
    const testEmail = `user-${timestamp}@test.com`;
    const testPassword = 'TestPass123!';

    await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });

    // Заполняем форму
    await page.fill('#firstName', 'Test');
    await page.fill('#lastName', 'User');
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    await page.fill('#confirmPassword', testPassword);

    // Нажимаем кнопку регистрации
    await page.click('button[type="submit"]');
    console.log('🔘 Нажата кнопка регистрации');

    // Ждем редиректа
    await page.waitForTimeout(3000);
    const postRegisterUrl = page.url();
    console.log(`📍 После регистрации: ${postRegisterUrl}`);

    // 3. ТЕСТ ВХОДА
    console.log('\n🔐 ШАГ 3: Вход с новыми учетными данными');

    if (!postRegisterUrl.includes('/login')) {
      console.log('⚠️ Регистрация не перенаправила на логин, переходим вручную');
      await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    }

    // Заполняем форму входа
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);

    // Нажимаем кнопку входа
    await page.click('button[type="submit"]');
    console.log('🔘 Нажата кнопка входа');

    // Ждем редиректа
    await page.waitForTimeout(3000);
    const postLoginUrl = page.url();
    console.log(`📍 После входа: ${postLoginUrl}`);

    // 4. ПРОВЕРКА ДОСТУПА К ЗАЩИЩЕННЫМ СТРАНИЦАМ
    console.log('\n🔒 ШАГ 4: Проверка доступа к защищенным страницам');

    const loginSuccess = !postLoginUrl.includes('/login') && !postLoginUrl.includes('/register');

    if (loginSuccess) {
      console.log('✅ ВХОД УСПЕШЕН!');

      // Проверяем доступ к аккаунту
      await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const accountUrl = page.url();
      console.log(`📄 Страница аккаунта: ${accountUrl}`);

      // Проверяем доступ к агентам
      await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const agentsUrl = page.url();
      console.log(`🤖 Страница агентов: ${agentsUrl}`);

      const accountAccessible = accountUrl.includes('/account');
      const agentsAccessible = agentsUrl.includes('/agents');

      console.log('\n📊 РЕЗУЛЬТАТЫ:');
      console.log(`✅ Доступ к аккаунту: ${accountAccessible ? 'РАБОТАЕТ' : 'НЕ РАБОТАЕТ'}`);
      console.log(`✅ Доступ к агентам: ${agentsAccessible ? 'РАБОТАЕТ' : 'НЕ РАБОТАЕТ'}`);

      if (accountAccessible && agentsAccessible) {
        console.log('\n🎉 ВСЕ РАБОТАЕТ! ПОЛЬЗОВАТЕЛЬ МОЖЕТ ПОЛНОСТЬЮ ИСПОЛЬЗОВАТЬ ПЛАТФОРМУ!');
      }

    } else {
      console.log('❌ ВХОД НЕ УДАЛСЯ!');
      console.log('🔍 Возможные причины:');
      console.log('  - Проблемы с NextAuth');
      console.log('  - Ошибки валидации');
      console.log('  - Проблемы с сессией');
    }

    // 5. ТЕСТ АДМИНИСТРАТОРА
    console.log('\n👑 ШАГ 5: Проверка администратора');

    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.fill('#email', 'admin@worldwideservice.eu');
    await page.fill('#password', 'l1tmw6u977c9!Q');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(3000);
    const adminUrl = page.url();
    const adminSuccess = !adminUrl.includes('/login');

    console.log(`👑 Вход администратора: ${adminSuccess ? 'УСПЕШЕН' : 'НЕ УДАЛСЯ'}`);

    if (adminSuccess) {
      console.log('🎯 АДМИНИСТРАТОР ИМЕЕТ ПОЛНЫЙ ДОСТУП К СИСТЕМЕ!');
    }

  } catch (error) {
    console.error('❌ ОШИБКА ПРИ ТЕСТИРОВАНИИ:', error.message);
  } finally {
    await browser.close();
  }
}

testRegistration().catch(console.error);
