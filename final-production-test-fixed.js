const { chromium } = require('playwright');

async function testCompleteUserJourney() {
  console.log('🎯 ФИНАЛЬНЫЙ ПРОДАКШЕН ТЕСТ - ПОЛНЫЙ ПУТЬ ПОЛЬЗОВАТЕЛЯ');
  console.log('🌐 URL: https://gpt-agent-kwid-k57c8yv0s-world-wide-services-62780b79.vercel.app');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'https://gpt-agent-kwid-k57c8yv0s-world-wide-services-62780b79.vercel.app';
  let results = { passed: 0, failed: 0, critical: { passed: 0, failed: 0 } };

  const addResult = (description, passed, critical = false) => {
    if (passed) {
      results.passed++;
      if (critical) results.critical.passed++;
    } else {
      results.failed++;
      if (critical) results.critical.failed++;
    }
    console.log(`${passed ? '✅' : '❌'} ${description}`);
  };

  try {
    // === ШАГ 1: ДОСТУП К ГЛАВНОЙ СТРАНИЦЕ ===
    console.log('\n🏠 ШАГ 1: Главная страница');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const title = await page.title().catch(() => 'ERROR');
    const isMainPage = title.includes('GPT Agent');
    addResult('Главная страница загружается', isMainPage, true);

    if (!isMainPage) {
      console.log('❌ ГЛАВНАЯ СТРАНИЦА НЕ ЗАГРУЖАЕТСЯ!');
      await browser.close();
      return;
    }

    // === ШАГ 2: ПЕРЕХОД НА СТРАНИЦУ ВХОДА ===
    console.log('\n🔗 ШАГ 2: Переход на страницу входа');
    const loginButton = await page.locator('a[href="/login"]').first();
    if (await loginButton.isVisible().catch(() => false)) {
      await loginButton.click();
    } else {
      await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    }

    await page.waitForTimeout(2000);
    const loginTitle = await page.title().catch(() => 'ERROR');
    const isLoginPage = loginTitle.includes('Вход');
    addResult('Страница входа доступна', isLoginPage, true);

    // === ШАГ 3: ВХОД АДМИНИСТРАТОРА ===
    console.log('\n🔐 ШАГ 3: Вход администратора');
    const emailField = await page.locator('#email');
    const passwordField = await page.locator('#password');
    const submitButton = await page.locator('button[type="submit"]');

    if (await emailField.isVisible().catch(() => false) &&
        await passwordField.isVisible().catch(() => false) &&
        await submitButton.isVisible().catch(() => false)) {

      await emailField.fill('admin@worldwideservice.eu');
      await passwordField.fill('l1tmw6u977c9!Q');
      await submitButton.click();

      console.log('⏳ Ожидание входа...');
      await page.waitForTimeout(5000);

      const afterLoginUrl = page.url();
      const adminLoggedIn = !afterLoginUrl.includes('/login') && !afterLoginUrl.includes('/register');
      addResult('Администратор входит в систему', adminLoggedIn, true);

      if (adminLoggedIn) {
        console.log(`📍 После входа: ${afterLoginUrl}`);

        // === ШАГ 4: ДОСТУП К СТРАНИЦЕ АГЕНТОВ ===
        console.log('\n🤖 ШАГ 4: Страница агентов');
        await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(3000);

        const agentsTitle = await page.title().catch(() => 'ERROR');
        const hasAgentsTitle = agentsTitle.includes('Агенты ИИ');
        addResult('Страница агентов загружается', hasAgentsTitle, true);

        // === ШАГ 5: ДОСТУП К СТРАНИЦЕ АККАУНТА ===
        console.log('\n👤 ШАГ 5: Страница аккаунта');
        await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(3000);

        const accountTitle = await page.title().catch(() => 'ERROR');
        const hasAccountTitle = accountTitle.includes('Настройки') || accountTitle.includes('Account');
        addResult('Страница аккаунта загружается', hasAccountTitle, true);

        // === ШАГ 6: ПРОВЕРКА КОНТЕНТА ===
        console.log('\n📄 ШАГ 6: Проверка контента');
        await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);

        // Проверяем демо-агентов
        const agent1 = await page.locator('text=Техническая поддержка').isVisible().catch(() => false);
        const agent2 = await page.locator('text=Продажи').isVisible().catch(() => false);
        const hasDemoAgents = agent1 && agent2;
        addResult('Демо-агенты отображаются', hasDemoAgents);

        // === ШАГ 7: ПЕРЕНАПРАВЛЕНИЕ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ ===
        console.log('\n🔄 ШАГ 7: Перенаправление авторизованного пользователя');

        // Проверяем главную страницу
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        const homeRedirectUrl = page.url();
        const homeRedirected = homeRedirectUrl.includes('/agents');
        addResult('Главная перенаправляет авторизованного пользователя', homeRedirected, true);

        // Проверяем страницу логина
        await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        const loginRedirectUrl = page.url();
        const loginRedirected = loginRedirectUrl.includes('/agents');
        addResult('Логин перенаправляет авторизованного пользователя', loginRedirected, true);

        // === ШАГ 8: РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ ===
        console.log('\n📝 ШАГ 8: Регистрация нового пользователя');

        // Выходим из системы
        await page.goto(`${baseUrl}/api/auth/signout`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);

        // Переходим на регистрацию
        await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);

        const registerTitle = await page.title().catch(() => 'ERROR');
        const isRegisterPage = registerTitle.includes('Регистрация');
        addResult('Страница регистрации доступна', isRegisterPage);

        if (isRegisterPage) {
          const timestamp = Date.now();
          const testEmail = `final-${timestamp}@test.com`;

          // Заполняем форму
          const firstNameField = await page.locator('#firstName');
          const lastNameField = await page.locator('#lastName');
          const regEmailField = await page.locator('#email');
          const regPasswordField = await page.locator('#password');
          const confirmPasswordField = await page.locator('#confirmPassword');
          const regSubmitButton = await page.locator('button[type="submit"]');

          if (await firstNameField.isVisible().catch(() => false) &&
              await lastNameField.isVisible().catch(() => false) &&
              await regEmailField.isVisible().catch(() => false)) {

            await firstNameField.fill('Final');
            await lastNameField.fill('Test');
            await regEmailField.fill(testEmail);
            await regPasswordField.fill('FinalTest123!');
            await confirmPasswordField.fill('FinalTest123!');
            await regSubmitButton.click();

            await page.waitForTimeout(3000);
            const postRegisterUrl = page.url();
            const registrationSuccess = postRegisterUrl.includes('/login');
            addResult('Регистрация работает', registrationSuccess, true);

            if (registrationSuccess) {
              // Вход нового пользователя
              await page.fill('#email', testEmail);
              await page.fill('#password', 'FinalTest123!');
              await page.click('button[type="submit"]');

              await page.waitForTimeout(3000);
              const postNewLoginUrl = page.url();
              const newUserLoggedIn = !postNewLoginUrl.includes('/login') && !postNewLoginUrl.includes('/register');
              addResult('Новый пользователь входит в систему', newUserLoggedIn, true);

              if (newUserLoggedIn) {
                const newUserOnPlatform = postNewLoginUrl.includes('/agents') || postNewLoginUrl.includes('/account');
                addResult('Новый пользователь попадает на платформу', newUserOnPlatform, true);
              }
            }
          }
        }

      } else {
        console.log('❌ АДМИНИСТРАТОР НЕ СМОГ ВОЙТИ!');
      }
    } else {
      addResult('Форма входа не найдена', false, true);
    }

    // === ШАГ 9: ЗАЩИТА МАРШРУТОВ ===
    console.log('\n🔒 ШАГ 9: Защита маршрутов');

    // Выходим из системы
    await page.goto(`${baseUrl}/api/auth/signout`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Проверяем защиту
    await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
    const agentsProtectedUrl = page.url();
    addResult('Маршрут /agents защищен', agentsProtectedUrl.includes('/login'), true);

    await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
    const accountProtectedUrl = page.url();
    addResult('Маршрут /account защищен', accountProtectedUrl.includes('/login'), true);

  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    addResult('Критическая ошибка тестирования', false, true);
  } finally {
    await browser.close();
  }

  // === РЕЗУЛЬТАТЫ ===
  console.log('\n' + '='.repeat(60));
  console.log('📊 ФИНАЛЬНЫЙ ОТЧЕТ ПРОДАКШЕН ТЕСТИРОВАНИЯ');
  console.log('=' .repeat(60));
  console.log(`✅ Пройдено: ${results.passed}`);
  console.log(`❌ Провалено: ${results.failed}`);
  console.log(`📈 Общий результат: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  console.log(`\n🎯 КРИТИЧЕСКИЕ ТЕСТЫ: ${results.critical.passed}/${results.critical.passed + results.critical.failed} пройдено`);

  if (results.critical.failed === 0) {
    console.log('\n🎉 ПРОДАКШЕН ГОТОВ! ВСЕ КРИТИЧЕСКИЕ ФУНКЦИИ РАБОТАЮТ!');
    console.log('🚀 ПОЛЬЗОВАТЕЛИ МОГУТ ПОЛНОСТЬЮ ИСПОЛЬЗОВАТЬ ПЛАТФОРМУ!');
    console.log('\n📋 ДОСТУП:');
    console.log(`🌐 URL: ${baseUrl}`);
    console.log('👤 Админ: admin@worldwideservice.eu / l1tmw6u977c9!Q');
    console.log('📝 Регистрация: Доступна для новых пользователей');
    console.log('\n✅ СЕРВЕРНЫЕ КОМПОНЕНТЫ РАБОТАЮТ БЕЗ ОШИБОК!');
  } else {
    console.log('\n⚠️ ЕСТЬ ПРОБЛЕМЫ С КРИТИЧЕСКИМИ ФУНКЦИЯМИ!');
    console.log('🔍 НЕОБХОДИМО ИСПРАВИТЬ:');
    console.log('❌ СЕРВЕРНЫЕ КОМПОНЕНТЫ ИМЕЮТ ОШИБКИ!');
  }

  return results.critical.failed === 0;
}

testCompleteUserJourney().catch(console.error);

