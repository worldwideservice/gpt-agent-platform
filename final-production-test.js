const { chromium } = require('playwright');

async function finalProductionTest() {
  console.log('🎯 ФИНАЛЬНЫЙ ПРОДАКШЕН ТЕСТ - ГОТОВНОСТЬ К ИСПОЛЬЗОВАНИЮ');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'https://gpt-agent-kwid-ihjhdwzba-world-wide-services-62780b79.vercel.app';
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
    // === БАЗОВЫЕ ПРОВЕРКИ ===
    console.log('\n🏠 БАЗОВЫЕ ПРОВЕРКИ:');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    addResult('Главная страница загружается', (await page.title()).includes('GPT Agent'), true);

    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    addResult('Страница логина доступна', (await page.title()).includes('Вход'), true);

    await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
    addResult('Страница регистрации доступна', (await page.title()).includes('Регистрация'), true);

    // === ЗАЩИТА МАРШРУТОВ ===
    console.log('\n🔒 ЗАЩИТА МАРШРУТОВ:');
    await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
    addResult('Неавторизованный доступ к /agents блокируется', page.url().includes('/login'), true);

    await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
    addResult('Неавторизованный доступ к /account блокируется', page.url().includes('/login'), true);

    // === ВХОД АДМИНИСТРАТОРА ===
    console.log('\n👑 ВХОД АДМИНИСТРАТОРА:');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.fill('#email', 'admin@worldwideservice.eu');
    await page.fill('#password', 'l1tmw6u977c9!Q');
    await page.click('button[type="submit"]');

    console.log('⏳ Ожидание перенаправления...');
    await page.waitForTimeout(5000);

    const adminUrl = page.url();
    const adminLoggedIn = !adminUrl.includes('/login') && !adminUrl.includes('/register');
    addResult('Администратор входит в систему', adminLoggedIn, true);

    if (adminLoggedIn) {
      // === ДОСТУП К ПЛАТФОРМЕ ===
      console.log('\n🏢 ДОСТУП К ПЛАТФОРМЕ:');
      await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const agentsUrl = page.url();
      addResult('Доступ к странице агентов', agentsUrl.includes('/agents'), true);

      await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const accountUrl = page.url();
      addResult('Доступ к странице аккаунта', accountUrl.includes('/account'), true);

      // === КОНТЕНТ ПЛАТФОРМЫ ===
      console.log('\n🤖 КОНТЕНТ ПЛАТФОРМЫ:');
      await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const pageTitle = await page.title();
      addResult('Заголовок страницы агентов корректный', pageTitle.includes('Агенты ИИ'));

      // Проверяем демо-агентов
      const agent1 = await page.locator('text=Техническая поддержка').isVisible().catch(() => false);
      const agent2 = await page.locator('text=Продажи').isVisible().catch(() => false);
      addResult('Демо-агенты отображаются', agent1 && agent2);

      // === РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ ===
      console.log('\n📝 РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ:');

      // Сначала выйдем
      await page.goto(`${baseUrl}/api/auth/signout`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      // Проверим выход
      await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
      const afterLogoutUrl = page.url();
      addResult('Выход из системы работает', afterLogoutUrl.includes('/login'));

      if (afterLogoutUrl.includes('/login')) {
        const timestamp = Date.now();
        const testEmail = `final-prod-${timestamp}@test.com`;
        const testPassword = 'FinalProd123!';

        // Регистрация
        await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
        await page.fill('#firstName', 'Final');
        await page.fill('#lastName', 'Prod');
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
          addResult('Новый пользователь может войти', newUserLoggedIn, true);

          if (newUserLoggedIn) {
            const newUserOnPlatform = postNewLoginUrl.includes('/agents') || postNewLoginUrl.includes('/account');
            addResult('Новый пользователь попадает на платформу', newUserOnPlatform, true);
          }
        }
      }
    }

    // === API ЗДОРОВЬЕ ===
    console.log('\n🌐 API ЗДОРОВЬЕ:');
    try {
      const response = await page.request.get(`${baseUrl}/api/health`);
      const healthData = await response.json();
      addResult('API здоровье работает', healthData?.overall_status === 'healthy');
    } catch (error) {
      addResult('API здоровье работает', false);
    }

  } catch (error) {
    addResult('Критическая ошибка тестирования', false, true);
    console.error('❌ ОШИБКА:', error.message);
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

  console.log(`\n🎯 КРИТИЧЕСКИЕ ТЕСТЫ: ${results.critical.passed}/${results.critical.passed + results.critical.failed}`);

  if (results.critical.failed === 0) {
    console.log('\n🎉 ПРОДАКШЕН ГОТОВ! ВСЕ КРИТИЧЕСКИЕ ФУНКЦИИ РАБОТАЮТ!');
    console.log('🚀 ПОЛЬЗОВАТЕЛИ МОГУТ ПОЛНОСТЬЮ ИСПОЛЬЗОВАТЬ ПЛАТФОРМУ!');
    console.log('\n📋 ДОСТУП:');
    console.log(`🌐 URL: ${baseUrl}`);
    console.log('👤 Админ: admin@worldwideservice.eu / l1tmw6u977c9!Q');
    console.log('📝 Регистрация: Доступна для новых пользователей');
  } else {
    console.log('\n⚠️ ЕСТЬ ПРОБЛЕМЫ С КРИТИЧЕСКИМИ ФУНКЦИЯМИ!');
    console.log('🔧 ТРЕБУЕТСЯ ИСПРАВЛЕНИЕ!');
  }

  return results.critical.failed === 0;
}

finalProductionTest().catch(console.error);
