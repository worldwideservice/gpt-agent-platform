const { chromium } = require('playwright');

async function ultimateTest() {
  console.log('🎯 УЛЬТИМАТИВНЫЙ ТЕСТ ПРОДАКШЕНА - 100% ФУНКЦИОНАЛЬНОСТИ');
  console.log('='.repeat(80));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'https://gpt-agent-kwid-bxw0a8dht-world-wide-services-62780b79.vercel.app';
  let score = 0;
  let totalTests = 0;

  function testResult(name, success, details = '') {
    totalTests++;
    if (success) score++;
    const icon = success ? '✅' : '❌';
    console.log(`${icon} ${name}${details ? ': ' + details : ''}`);
  }

  try {
    // ТЕСТ 1: ДОСТУП К ОСНОВНЫМ СТРАНИЦАМ
    console.log('\n🏠 ТЕСТ 1: ДОСТУП К ОСНОВНЫМ СТРАНИЦАМ');

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    const homeTitle = await page.title();
    testResult('Главная страница загружается', homeTitle.includes('GPT Agent'), homeTitle);

    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    const loginTitle = await page.title();
    testResult('Страница логина доступна', loginTitle.includes('Вход'), loginTitle);

    await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
    const registerTitle = await page.title();
    testResult('Страница регистрации доступна', registerTitle.includes('Регистрация'), registerTitle);

    // ТЕСТ 2: ЗАЩИТА МАРШРУТОВ
    console.log('\n🔒 ТЕСТ 2: ЗАЩИТА МАРШРУТОВ');

    await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const accountUrl = page.url();
    testResult('Неавторизованный доступ к /account блокируется', accountUrl.includes('/login'));

    await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const agentsUrl = page.url();
    testResult('Неавторизованный доступ к /agents блокируется', agentsUrl.includes('/login'));

    // ТЕСТ 3: ВХОД АДМИНИСТРАТОРА
    console.log('\n👤 ТЕСТ 3: ВХОД АДМИНИСТРАТОРА');

    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.fill('#email', 'admin@worldwideservice.eu');
    await page.fill('#password', 'l1tmw6u977c9!Q');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    const postLoginUrl = page.url();
    const loginSuccess = !postLoginUrl.includes('/login');
    testResult('Вход администратора успешен', loginSuccess, `URL: ${postLoginUrl}`);

    if (loginSuccess) {
      // ТЕСТ 4: ДОСТУП К ЗАЩИЩЕННЫМ СТРАНИЦАМ ПОСЛЕ ВХОДА
      console.log('\n🔑 ТЕСТ 4: ДОСТУП К ЗАЩИЩЕННЫМ СТРАНИЦАМ');

      await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const accountAccessUrl = page.url();
      testResult('Доступ к странице аккаунта', accountAccessUrl.includes('/account'), accountAccessUrl);

      await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const agentsAccessUrl = page.url();
      testResult('Доступ к странице агентов', agentsAccessUrl.includes('/agents'), agentsAccessUrl);

      // ТЕСТ 5: КОНТЕНТ СТРАНИЦЫ АГЕНТОВ
      console.log('\n🤖 ТЕСТ 5: КОНТЕНТ СТРАНИЦЫ АГЕНТОВ');

      const pageTitle = await page.title();
      testResult('Заголовок страницы агентов корректный', pageTitle === 'Агенты ИИ', pageTitle);

      // Проверяем наличие агентов в контенте страницы
      const pageContent = await page.textContent('body');
      const hasAgent1 = pageContent.includes('Техническая поддержка');
      const hasAgent2 = pageContent.includes('Продажи');
      testResult('Агент "Техническая поддержка" отображается', hasAgent1);
      testResult('Агент "Продажи" отображается', hasAgent2);

      // Проверяем наличие кнопки "Создать"
      const createButton = await page.locator('text=Создать').first();
      const createButtonVisible = await createButton.isVisible().catch(() => false);
      testResult('Кнопка "Создать агента" присутствует', createButtonVisible);

      // Проверяем наличие таблицы или списка
      const tableExists = await page.locator('table').isVisible().catch(() => false);
      const listExists = await page.locator('ul, ol').first().isVisible().catch(() => false);
      const hasTableOrList = tableExists || listExists;
      testResult('Таблица или список агентов присутствует', hasTableOrList);

      // Проверяем отсутствие ошибки
      const errorExists = await page.locator('text=Произошла ошибка').isVisible().catch(() => false);
      testResult('Сообщение об ошибке отсутствует', !errorExists);

      // ТЕСТ 6: ФУНКЦИОНАЛЬНОСТЬ АГЕНТОВ
      console.log('\n⚙️ ТЕСТ 6: ФУНКЦИОНАЛЬНОСТЬ АГЕНТОВ');

      // Проверяем наличие действий с агентами
      const hasActions = pageContent.includes('Изменить') || pageContent.includes('Копировать') || pageContent.includes('Удалить');
      testResult('Действия с агентами доступны', hasActions);

      // ТЕСТ 7: НАВИГАЦИЯ
      console.log('\n🧭 ТЕСТ 7: НАВИГАЦИЯ');

      // Проверяем возможность вернуться на главную
      const homeLink = await page.locator('a[href="/"]').first();
      const canNavigateHome = await homeLink.isVisible().catch(() => false);
      testResult('Навигация на главную доступна', canNavigateHome);

      // ТЕСТ 8: АДАПТИВНОСТЬ
      console.log('\n📱 ТЕСТ 8: АДАПТИВНОСТЬ');

      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(1000);
      const mobileContent = await page.textContent('body');
      const mobileWorks = mobileContent.length > 100;
      testResult('Мобильная версия работает', mobileWorks);

      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(1000);
      const desktopContent = await page.textContent('body');
      const desktopWorks = desktopContent.length > 100;
      testResult('Десктопная версия работает', desktopWorks);

    } else {
      console.log('⚠️ Пропускаю тесты защищенных страниц - вход не удался');
      testResult('Тест защищенных страниц', false, 'Пропущен из-за неудачного входа');
    }

    // ТЕСТ 9: API ДОСТУП
    console.log('\n🌐 ТЕСТ 9: API ДОСТУП');

    const healthResponse = await page.evaluate(async (baseUrl) => {
      try {
        const response = await fetch(`${baseUrl}/api/health`);
        return response.ok;
      } catch (error) {
        return false;
      }
    }, baseUrl);
    testResult('API здоровье доступно', healthResponse);

    // ТЕСТ 10: РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ
    console.log('\n📝 ТЕСТ 10: РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ');

    const timestamp = Date.now();
    const testEmail = `test-user-${timestamp}@example.com`;

    const registerResult = await page.evaluate(async (baseUrl, email) => {
      try {
        const response = await fetch(`${baseUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: 'Test',
            lastName: 'User',
            email: email,
            password: 'TestPassword123!'
          })
        });
        return response.ok;
      } catch (error) {
        return false;
      }
    }, baseUrl, testEmail);
    testResult('Регистрация нового пользователя работает', registerResult, testEmail);

  } catch (error) {
    console.error('❌ Критическая ошибка:', error.message);
    testResult('Общее тестирование', false, `Error: ${error.message}`);
  } finally {
    await browser.close();
  }

  // ФИНАЛЬНЫЙ ОТЧЕТ
  console.log('\n' + '='.repeat(80));
  console.log('📊 ФИНАЛЬНЫЙ ОТЧЕТ ТЕСТИРОВАНИЯ');
  console.log('='.repeat(80));
  console.log(`✅ Пройдено: ${score}`);
  console.log(`❌ Провалено: ${totalTests - score}`);
  console.log(`📈 Общий результат: ${((score / totalTests) * 100).toFixed(1)}%`);

  const status = score === totalTests ? '🎉 ПРОДАКШЕН ГОТОВ К ИСПОЛЬЗОВАНИЮ!' :
                 score >= totalTests * 0.9 ? '✅ ПРОДАКШЕН ПОЧТИ ГОТОВ!' :
                 '⚠️ ТРЕБУЮТСЯ ИСПРАВЛЕНИЯ!';

  console.log(`\n${status}`);

  if (score < totalTests) {
    console.log('\n❌ ПРОБЛЕМНЫЕ ТЕСТЫ:');
    // Выведем детали проблемных тестов в будущем, если нужно
  }

  console.log('\n🌐 ПРОДАКШЕН URL:');
  console.log(baseUrl);
  console.log('\n👤 АДМИНИСТРАТОР:');
  console.log('Email: admin@worldwideservice.eu');
  console.log('Пароль: l1tmw6u977c9!Q');

  console.log('\n' + '='.repeat(80));

  return { score, totalTests, percentage: (score / totalTests) * 100 };
}

ultimateTest().catch(console.error);
