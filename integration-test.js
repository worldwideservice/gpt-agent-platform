const { chromium } = require('playwright');

async function integrationTest() {
  console.log('🔗 ИНТЕГРАЦИОННЫЙ ТЕСТ - ПРОВЕРКА ВСЕГО ПОТОКА С СЕССИЯМИ');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'https://gpt-agent-kwid-bxw0a8dht-world-wide-services-62780b79.vercel.app';
  let testResults = { passed: 0, failed: 0, tests: [] };

  const addResult = (description, passed, details = '') => {
    if (passed) {
      testResults.passed++;
      testResults.tests.push(`✅ ${description}${details ? ': ' + details : ''}`);
    } else {
      testResults.failed++;
      testResults.tests.push(`❌ ${description}${details ? ': ' + details : ''}`);
    }
  };

  try {
    // === ТЕСТ 1: ДОСТУП К СТРАНИЦАМ ===
    console.log('\n🏠 ТЕСТ 1: ДОСТУП К ОСНОВНЫМ СТРАНИЦАМ');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    addResult('Главная страница загружается', (await page.title()).includes('GPT Agent'));

    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    addResult('Страница логина доступна', (await page.title()).includes('Вход'));

    await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
    addResult('Страница регистрации доступна', (await page.title()).includes('Регистрация'));

    // === ТЕСТ 2: ЗАЩИТА МАРШРУТОВ ===
    console.log('\n🔒 ТЕСТ 2: ЗАЩИТА МАРШРУТОВ');
    await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
    addResult('Неавторизованный доступ к /agents блокируется', page.url().includes('/login'));

    await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
    addResult('Неавторизованный доступ к /account блокируется', page.url().includes('/login'));

    // === ТЕСТ 3: ВХОД АДМИНИСТРАТОРА ===
    console.log('\n👑 ТЕСТ 3: ВХОД АДМИНИСТРАТОРА');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.fill('#email', 'admin@worldwideservice.eu');
    await page.fill('#password', 'l1tmw6u977c9!Q');
    await page.click('button[type="submit"]');

    console.log('Ждем входа и перенаправления...');
    await page.waitForTimeout(5000);

    const afterLoginUrl = page.url();
    console.log('URL после входа:', afterLoginUrl);

    const adminLoggedIn = !afterLoginUrl.includes('/login') && !afterLoginUrl.includes('/register');
    addResult('Администратор входит в систему', adminLoggedIn);

    if (adminLoggedIn) {
      const isOnPlatform = afterLoginUrl.includes('/agents') || afterLoginUrl.includes('/account');
      addResult('Администратор перенаправляется на платформу', isOnPlatform, `URL: ${afterLoginUrl}`);

      // === ТЕСТ 4: ДОСТУП К ПЛАТФОРМЕ ===
      console.log('\n🏢 ТЕСТ 4: ДОСТУП К ПЛАТФОРМЕ');
      await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const agentsUrl = page.url();
      addResult('Доступ к странице агентов', agentsUrl.includes('/agents'));

      await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const accountUrl = page.url();
      addResult('Доступ к странице аккаунта', accountUrl.includes('/account'));

      // === ТЕСТ 5: ПЕРЕНАПРАВЛЕНИЕ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ ===
      console.log('\n🔄 ТЕСТ 5: ПЕРЕНАПРАВЛЕНИЕ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ');

      // Главная страница
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      const homeRedirectUrl = page.url();
      addResult('Главная перенаправляет авторизованного пользователя', homeRedirectUrl.includes('/agents'), `URL: ${homeRedirectUrl}`);

      // Страница логина
      await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      const loginRedirectUrl = page.url();
      addResult('Логин перенаправляет авторизованного пользователя', loginRedirectUrl.includes('/agents'), `URL: ${loginRedirectUrl}`);

      // === ТЕСТ 6: КОНТЕНТ ПЛАТФОРМЫ ===
      console.log('\n🤖 ТЕСТ 6: КОНТЕНТ ПЛАТФОРМЫ');
      await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const pageTitle = await page.title();
      addResult('Заголовок страницы агентов корректный', pageTitle.includes('Агенты ИИ'));

      // Проверяем демо-агентов (должны быть для админа)
      const agent1Visible = await page.locator('text=Техническая поддержка').isVisible().catch(() => false);
      const agent2Visible = await page.locator('text=Продажи').isVisible().catch(() => false);
      addResult('Демо-агенты отображаются', agent1Visible && agent2Visible);

      // === ТЕСТ 7: РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ ===
      console.log('\n📝 ТЕСТ 7: РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ');

      // Сначала выйдем из системы админа
      await page.goto(`${baseUrl}/api/auth/signout`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      // Проверим, что вышли
      await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
      const afterLogoutUrl = page.url();
      addResult('Выход из системы работает', afterLogoutUrl.includes('/login'));

      if (afterLogoutUrl.includes('/login')) {
        const timestamp = Date.now();
        const testEmail = `integration-${timestamp}@test.com`;
        const testPassword = 'IntegrationTest123!';

        // Регистрация
        await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
        await page.fill('#firstName', 'Integration');
        await page.fill('#lastName', 'Test');
        await page.fill('#email', testEmail);
        await page.fill('#password', testPassword);
        await page.fill('#confirmPassword', testPassword);
        await page.click('button[type="submit"]');

        await page.waitForTimeout(3000);
        const postRegisterUrl = page.url();
        addResult('Регистрация работает', postRegisterUrl.includes('/login'));

        // Вход
        if (postRegisterUrl.includes('/login')) {
          await page.fill('#email', testEmail);
          await page.fill('#password', testPassword);
          await page.click('button[type="submit"]');

          await page.waitForTimeout(3000);
          const postNewLoginUrl = page.url();
          const newUserLoggedIn = !postNewLoginUrl.includes('/login') && !postNewLoginUrl.includes('/register');
          addResult('Новый пользователь может войти', newUserLoggedIn);

          if (newUserLoggedIn) {
            const newUserOnPlatform = postNewLoginUrl.includes('/agents') || postNewLoginUrl.includes('/account');
            addResult('Новый пользователь попадает на платформу', newUserOnPlatform);
          }
        }
      }
    }

  } catch (error) {
    addResult('Критическая ошибка', false, error.message);
  } finally {
    await browser.close();
  }

  // РЕЗУЛЬТАТЫ
  console.log('\n' + '='.repeat(60));
  console.log('📊 ФИНАЛЬНЫЙ ОТЧЕТ ИНТЕГРАЦИОННОГО ТЕСТИРОВАНИЯ');
  console.log('=' .repeat(60));
  console.log(`✅ Пройдено: ${testResults.passed}`);
  console.log(`❌ Провалено: ${testResults.failed}`);
  console.log(`📈 Общий результат: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

  console.log('\n📋 ДЕТАЛЬНЫЕ РЕЗУЛЬТАТЫ:');
  testResults.tests.forEach(test => console.log(test));

  const criticalTests = [
    'Администратор входит в систему',
    'Администратор перенаправляется на платформу',
    'Главная перенаправляет авторизованного пользователя',
    'Логин перенаправляет авторизованного пользователя',
    'Регистрация работает',
    'Новый пользователь может войти',
    'Новый пользователь попадает на платформу'
  ];

  const criticalPassed = testResults.tests.filter(t =>
    criticalTests.some(ct => t.includes(ct)) && t.startsWith('✅')
  ).length;

  console.log(`\n🎯 КРИТИЧЕСКИЕ ТЕСТЫ: ${criticalPassed}/${criticalTests.length}`);

  if (criticalPassed === criticalTests.length) {
    console.log('\n🎉 ВСЕ КРИТИЧЕСКИЕ ФУНКЦИИ РАБОТАЮТ! ПРОДАКШЕН ГОТОВ!');
    console.log('🚀 ПОЛЬЗОВАТЕЛЬ МОЖЕТ ПОЛНОСТЬЮ ИСПОЛЬЗОВАТЬ ПЛАТФОРМУ!');
    console.log('🔗 ВСЕ СТРАНИЦЫ СВЯЗАНЫ ПРАВИЛЬНО!');
  } else {
    console.log('\n⚠️ ЕСТЬ ПРОБЛЕМЫ С КРИТИЧЕСКИМИ ФУНКЦИЯМИ!');
    console.log('🔧 НУЖНО ИСПРАВИТЬ:');
    criticalTests.forEach(test => {
      if (!testResults.tests.some(t => t.includes(test) && t.startsWith('✅'))) {
        console.log(`  - ${test}`);
      }
    });
  }

  return criticalPassed === criticalTests.length;
}

integrationTest().catch(console.error);
