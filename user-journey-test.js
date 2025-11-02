const { chromium } = require('playwright');

async function testUserJourney() {
  console.log('🚶 ПОЛНЫЙ ТЕСТ ПУТИ ПОЛЬЗОВАТЕЛЯ - ОТ НАЧАЛА ДО КОНЦА');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'https://gpt-agent-kwid-ihjhdwzba-world-wide-services-62780b79.vercel.app';
  let stepResults = [];

  const addStepResult = (step, description, success, details = '') => {
    stepResults.push({ step, description, success, details });
    const status = success ? '✅' : '❌';
    console.log(`${status} ШАГ ${step}: ${description}${details ? ' - ' + details : ''}`);
  };

  try {
    // === ШАГ 1: Посещение главной страницы ===
    console.log('\n🏠 ШАГ 1: Посещение главной страницы');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const title = await page.title().catch(() => 'ERROR');
    const isMainPage = title.includes('GPT Agent');
    addStepResult(1, 'Главная страница загружается', isMainPage, `Title: ${title}`);

    if (!isMainPage) {
      console.log('❌ ГЛАВНАЯ СТРАНИЦА НЕ ЗАГРУЖАЕТСЯ!');
      await browser.close();
      return;
    }

    // === ШАГ 2: Переход на страницу входа ===
    console.log('\n🔗 ШАГ 2: Переход на страницу входа');
    await page.click('a[href="/login"]').catch(async () => {
      // Если кнопка не найдена, переходим напрямую
      await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    });

    await page.waitForTimeout(2000);
    const loginTitle = await page.title().catch(() => 'ERROR');
    const isLoginPage = loginTitle.includes('Вход');
    addStepResult(2, 'Страница входа доступна', isLoginPage, `Title: ${loginTitle}`);

    // === ШАГ 3: Вход администратора ===
    console.log('\n🔐 ШАГ 3: Вход администратора');
    await page.fill('#email', 'admin@worldwideservice.eu');
    await page.fill('#password', 'l1tmw6u977c9!Q');
    await page.click('button[type="submit"]');

    console.log('⏳ Ожидание входа и перенаправления...');
    await page.waitForTimeout(5000);

    const afterLoginUrl = page.url();
    const isLoggedIn = !afterLoginUrl.includes('/login') && !afterLoginUrl.includes('/register');
    addStepResult(3, 'Администратор входит в систему', isLoggedIn, `URL: ${afterLoginUrl}`);

    if (!isLoggedIn) {
      console.log('❌ ВХОД НЕ УДАЛСЯ!');
      await browser.close();
      return;
    }

    // === ШАГ 4: Проверка главной страницы после входа ===
    console.log('\n🔄 ШАГ 4: Проверка главной страницы после входа');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    const redirectedUrl = page.url();
    const isRedirectedToPlatform = redirectedUrl.includes('/agents') || redirectedUrl.includes('/account');
    addStepResult(4, 'Главная страница перенаправляет на платформу', isRedirectedToPlatform, `URL: ${redirectedUrl}`);

    // === ШАГ 5: Работа со страницей агентов ===
    console.log('\n🤖 ШАГ 5: Работа со страницей агентов');
    await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    const agentsTitle = await page.title().catch(() => 'ERROR');
    const hasAgentsTitle = agentsTitle.includes('Агенты ИИ');
    addStepResult(5, 'Страница агентов загружается', hasAgentsTitle, `Title: ${agentsTitle}`);

    // Проверяем демо-агентов
    const agent1Visible = await page.locator('text=Техническая поддержка').isVisible().catch(() => false);
    const agent2Visible = await page.locator('text=Продажи').isVisible().catch(() => false);
    const hasDemoAgents = agent1Visible && agent2Visible;
    addStepResult(6, 'Демо-агенты отображаются', hasDemoAgents);

    // === ШАГ 6: Работа со страницей аккаунта ===
    console.log('\n👤 ШАГ 6: Работа со страницей аккаунта');
    await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    const accountTitle = await page.title().catch(() => 'ERROR');
    const hasAccountTitle = accountTitle.includes('Настройки') || accountTitle.includes('Account');
    addStepResult(7, 'Страница аккаунта загружается', hasAccountTitle, `Title: ${accountTitle}`);

    // === ШАГ 7: Регистрация нового пользователя ===
    console.log('\n📝 ШАГ 7: Регистрация нового пользователя');

    // Сначала выходим
    await page.goto(`${baseUrl}/api/auth/signout`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Переходим на регистрацию
    await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const timestamp = Date.now();
    const testEmail = `journey-${timestamp}@test.com`;

    await page.fill('#firstName', 'Journey');
    await page.fill('#lastName', 'Test');
    await page.fill('#email', testEmail);
    await page.fill('#password', 'JourneyTest123!');
    await page.fill('#confirmPassword', 'JourneyTest123!');

    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    const postRegisterUrl = page.url();
    const registrationSuccess = postRegisterUrl.includes('/login');
    addStepResult(8, 'Регистрация успешна', registrationSuccess, `URL: ${postRegisterUrl}`);

    // === ШАГ 8: Вход нового пользователя ===
    if (registrationSuccess) {
      console.log('\n🔑 ШАГ 8: Вход нового пользователя');
      await page.fill('#email', testEmail);
      await page.fill('#password', 'JourneyTest123!');
      await page.click('button[type="submit"]');

      await page.waitForTimeout(3000);
      const postNewLoginUrl = page.url();
      const newUserLoggedIn = !postNewLoginUrl.includes('/login') && !postNewLoginUrl.includes('/register');
      addStepResult(9, 'Новый пользователь входит в систему', newUserLoggedIn, `URL: ${postNewLoginUrl}`);

      if (newUserLoggedIn) {
        // === ШАГ 9: Новый пользователь на платформе ===
        console.log('\n🎯 ШАГ 9: Новый пользователь на платформе');
        await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(3000);

        const newUserAgentsTitle = await page.title().catch(() => 'ERROR');
        const newUserOnPlatform = newUserAgentsTitle.includes('Агенты ИИ');
        addStepResult(10, 'Новый пользователь имеет доступ к платформе', newUserOnPlatform, `Title: ${newUserAgentsTitle}`);
      }
    }

    // === ШАГ 10: Проверка навигации ===
    console.log('\n🧭 ШАГ 10: Проверка навигации');
    await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Проверяем наличие навигационных элементов
    const hasNavigation = await page.locator('nav, header').isVisible().catch(() => false);
    addStepResult(11, 'Навигация работает', hasNavigation);

  } catch (error) {
    console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
    addStepResult('ERROR', 'Критическая ошибка', false, error.message);
  } finally {
    await browser.close();
  }

  // === РЕЗУЛЬТАТЫ ===
  console.log('\n' + '='.repeat(60));
  console.log('📊 РЕЗУЛЬТАТЫ ПОЛНОГО ТЕСТИРОВАНИЯ ПУТИ ПОЛЬЗОВАТЕЛЯ');
  console.log('=' .repeat(60));

  stepResults.forEach(result => {
    if (result.step !== 'ERROR') {
      console.log(`Шаг ${result.step}: ${result.success ? '✅' : '❌'} ${result.description}`);
    }
  });

  const passedSteps = stepResults.filter(r => r.success && r.step !== 'ERROR').length;
  const totalSteps = stepResults.filter(r => r.step !== 'ERROR').length;
  const successRate = ((passedSteps / totalSteps) * 100).toFixed(1);

  console.log(`\n🎯 ИТОГО: ${passedSteps}/${totalSteps} шагов пройдено (${successRate}%)`);

  const criticalSteps = [1, 2, 3, 5, 7, 9]; // Критические шаги
  const criticalPassed = stepResults.filter(r =>
    criticalSteps.includes(parseInt(r.step)) && r.success
  ).length;

  console.log(`🎯 КРИТИЧЕСКИЕ ШАГИ: ${criticalPassed}/${criticalSteps.length} пройдено`);

  if (criticalPassed === criticalSteps.length) {
    console.log('\n🎉 ВСЕ КРИТИЧЕСКИЕ ФУНКЦИИ РАБОТАЮТ! СЕРВИС ГОТОВ!');
    console.log('🚀 ПОЛЬЗОВАТЕЛИ МОГУТ ПОЛНОСТЬЮ ИСПОЛЬЗОВАТЬ ПЛАТФОРМУ!');
  } else {
    console.log('\n⚠️ ЕСТЬ ПРОБЛЕМЫ С КРИТИЧЕСКИМИ ФУНКЦИЯМИ!');
    console.log('🔍 НЕОБХОДИМО ИСПРАВИТЬ:');
    criticalSteps.forEach(step => {
      const result = stepResults.find(r => parseInt(r.step) === step);
      if (result && !result.success) {
        console.log(`  - Шаг ${step}: ${result.description}`);
      }
    });
  }

  return criticalPassed === criticalSteps.length;
}

testUserJourney().catch(console.error);


