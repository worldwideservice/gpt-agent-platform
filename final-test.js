const { chromium } = require('playwright');

async function finalTest() {
  console.log('🎯 ФИНАЛЬНЫЙ ТЕСТ ПРОДАКШЕНА - ПОЛНАЯ ПРОВЕРКА');

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
    console.log('\n🏠 ТЕСТ 1: ДОСТУП К СТРАНИЦАМ');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
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

    // Ждем перенаправления
    await page.waitForTimeout(3000);
    const adminUrl = page.url();

    const adminLoggedIn = !adminUrl.includes('/login') && !adminUrl.includes('/register');
    addResult('Администратор входит в систему', adminLoggedIn, `URL: ${adminUrl}`);

    if (adminLoggedIn) {
      // === ТЕСТ 4: ПЕРЕНАПРАВЛЕНИЕ НА ПЛАТФОРМУ ===
      console.log('\n🏢 ТЕСТ 4: ПЕРЕНАПРАВЛЕНИЕ НА ПЛАТФОРМУ');

      // Если после входа не на /agents, проверяем перенаправление
      if (!adminUrl.includes('/agents')) {
        console.log('Админ не был автоматически перенаправлен на /agents, проверяем ручное перенаправление...');
        await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
        const agentsUrl = page.url();
        addResult('Ручной доступ к /agents работает', agentsUrl.includes('/agents'));

        // Теперь проверяем, перенаправит ли главная страница
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
        const homeRedirectUrl = page.url();
        addResult('Главная перенаправляет авторизованного пользователя', homeRedirectUrl.includes('/agents'), `URL: ${homeRedirectUrl}`);
      } else {
        addResult('Автоматическое перенаправление на платформу работает', adminUrl.includes('/agents'));
      }

      // === ТЕСТ 5: КОНТЕНТ ПЛАТФОРМЫ ===
      console.log('\n🤖 ТЕСТ 5: КОНТЕНТ ПЛАТФОРМЫ');
      await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const pageTitle = await page.title();
      addResult('Заголовок страницы агентов корректный', pageTitle.includes('Агенты ИИ'));

      // Проверяем демо-агентов (должны быть видны для админа)
      const agent1 = await page.locator('text=Техническая поддержка').isVisible().catch(() => false);
      const agent2 = await page.locator('text=Продажи').isVisible().catch(() => false);
      addResult('Демо-агенты отображаются', agent1 && agent2);

      // === ТЕСТ 6: ДОСТУП К ДРУГИМ СТРАНИЦАМ ===
      console.log('\n🔑 ТЕСТ 6: ДОСТУП К ДРУГИМ СТРАНИЦАМ ПЛАТФОРМЫ');
      await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
      addResult('Доступ к странице аккаунта', page.url().includes('/account'));

      // === ТЕСТ 7: ПОВТОРНЫЙ ВХОД ===
      console.log('\n🔄 ТЕСТ 7: ПОВТОРНЫЙ ВХОД (ПРОВЕРКА СЕССИИ)');
      await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const loginRedirectUrl = page.url();
      addResult('Повторный вход на /login перенаправляет на платформу', loginRedirectUrl.includes('/agents'), `URL: ${loginRedirectUrl}`);
    }

    // === ТЕСТ 8: РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ ===
    console.log('\n📝 ТЕСТ 8: РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ');
    const testEmail = `final-test-${Date.now()}@example.com`;

    await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
    await page.fill('#firstName', 'Final');
    await page.fill('#lastName', 'Test');
    await page.fill('#email', testEmail);
    await page.fill('#password', 'FinalTest123!');
    await page.fill('#confirmPassword', 'FinalTest123!');
    await page.click('button[type="submit"]');

    // Ждем перенаправления на логин
    await page.waitForTimeout(3000);
    const postRegisterUrl = page.url();
    addResult('Регистрация перенаправляет на логин', postRegisterUrl.includes('/login'));

    if (postRegisterUrl.includes('/login')) {
      // Пробуем войти
      await page.fill('#email', testEmail);
      await page.fill('#password', 'FinalTest123!');
      await page.click('button[type="submit"]');

      await page.waitForTimeout(3000);
      const postNewLoginUrl = page.url();
      const newUserLoggedIn = !postNewLoginUrl.includes('/login') && !postNewLoginUrl.includes('/register');
      addResult('Новый пользователь может войти', newUserLoggedIn, `URL: ${postNewLoginUrl}`);

      if (newUserLoggedIn) {
        // Проверяем перенаправление на платформу
        const newUserOnPlatform = postNewLoginUrl.includes('/agents') || postNewLoginUrl.includes('/account');
        addResult('Новый пользователь попадает на платформу', newUserOnPlatform);
      }
    }

  } catch (error) {
    addResult('Критическая ошибка тестирования', false, error.message);
  } finally {
    await browser.close();
  }

  // РЕЗУЛЬТАТЫ
  console.log('\n' + '='.repeat(60));
  console.log('📊 ФИНАЛЬНЫЙ ОТЧЕТ ТЕСТИРОВАНИЯ');
  console.log('=' .repeat(60));
  console.log(`✅ Пройдено: ${testResults.passed}`);
  console.log(`❌ Провалено: ${testResults.failed}`);
  console.log(`📈 Общий результат: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

  console.log('\n📋 ДЕТАЛЬНЫЕ РЕЗУЛЬТАТЫ:');
  testResults.tests.forEach(test => console.log(test));

  if (testResults.failed === 0) {
    console.log('\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! ПРОДАКШЕН ГОТОВ!');
    console.log('🚀 ПОЛЬЗОВАТЕЛЬ МОЖЕТ ПОЛНОСТЬЮ ИСПОЛЬЗОВАТЬ ПЛАТФОРМУ!');
  } else {
    console.log('\n⚠️ ЕСТЬ ПРОБЛЕМЫ! НУЖНО ИСПРАВИТЬ!');
    console.log('🔧 ОСНОВНЫЕ ПРОБЛЕМЫ:');
    if (testResults.tests.some(t => t.includes('перенаправление'))) {
      console.log('  - Перенаправление после входа не работает');
    }
    if (testResults.tests.some(t => t.includes('демо-агенты'))) {
      console.log('  - Демо-агенты не отображаются');
    }
  }

  return testResults.failed === 0;
}

finalTest().catch(console.error);