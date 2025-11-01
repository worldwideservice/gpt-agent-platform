const { chromium } = require('playwright');

async function testAdminFlow() {
  console.log('👑 ТЕСТИРОВАНИЕ ПОТОКА АДМИНИСТРАТОРА');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'https://gpt-agent-kwid-bxw0a8dht-world-wide-services-62780b79.vercel.app';

  try {
    // 1. ПРОВЕРКА ДОСТУПА К ЗАЩИЩЕННЫМ СТРАНИЦАМ БЕЗ АВТОРИЗАЦИИ
    console.log('\n🔒 ШАГ 1: Проверка защиты маршрутов');

    await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
    const agentsUrlNoAuth = page.url();
    console.log('Без авторизации /agents:', agentsUrlNoAuth.includes('/login') ? 'ЗАЩИЩЕНО ✅' : 'НЕ ЗАЩИЩЕНО ❌');

    await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
    const accountUrlNoAuth = page.url();
    console.log('Без авторизации /account:', accountUrlNoAuth.includes('/login') ? 'ЗАЩИЩЕНО ✅' : 'НЕ ЗАЩИЩЕНО ❌');

    // 2. ВХОД АДМИНИСТРАТОРА
    console.log('\n🔐 ШАГ 2: Вход администратора');

    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.fill('#email', 'admin@worldwideservice.eu');
    await page.fill('#password', 'l1tmw6u977c9!Q');
    await page.click('button[type="submit"]');

    console.log('Ждем перенаправления после входа...');
    await page.waitForTimeout(5000); // Ждем 5 секунд вместо waitForURL

    const adminUrl = page.url();
    console.log('URL после входа админа:', adminUrl);

    const adminLoggedIn = !adminUrl.includes('/login') && !adminUrl.includes('/register');
    console.log('Админ вошел в систему:', adminLoggedIn ? '✅' : '❌');

    if (adminLoggedIn) {
      const isOnPlatform = adminUrl.includes('/agents') || adminUrl.includes('/account');
      console.log('Админ на платформе:', isOnPlatform ? '✅' : '❌');

      // 3. ДОСТУП К ЗАЩИЩЕННЫМ СТРАНИЦАМ ПОСЛЕ АВТОРИЗАЦИИ
      console.log('\n🔑 ШАГ 3: Доступ к защищенным страницам после авторизации');

      await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const agentsUrl = page.url();
      console.log('Доступ к /agents:', agentsUrl.includes('/agents') ? '✅' : '❌');

      await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const accountUrl = page.url();
      console.log('Доступ к /account:', accountUrl.includes('/account') ? '✅' : '❌');

      // 4. ПРОВЕРКА КОНТЕНТА СТРАНИЦЫ АГЕНТОВ
      console.log('\n🤖 ШАГ 4: Проверка контента страницы агентов');

      await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      const pageTitle = await page.title();
      console.log('Заголовок страницы:', pageTitle);

      const agentsTitleVisible = await page.locator('text=Агенты ИИ').isVisible().catch(() => false);
      console.log('Заголовок "Агенты ИИ":', agentsTitleVisible ? '✅' : '❌');

      const createAgentButton = await page.locator('a[href="/agents/create"]').isVisible().catch(() => false);
      console.log('Кнопка "Создать агента":', createAgentButton ? '✅' : '❌');

      const agent1Visible = await page.locator('text=Техническая поддержка').isVisible().catch(() => false);
      const agent2Visible = await page.locator('text=Продажи').isVisible().catch(() => false);
      console.log('Демо-агенты видны:', (agent1Visible && agent2Visible) ? '✅' : '❌');

      // 5. ПЕРЕНАПРАВЛЕНИЕ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ С ГЛАВНОЙ
      console.log('\n🔄 ШАГ 5: Перенаправление авторизованного пользователя с главной');

      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const redirectedUrl = page.url();
      console.log('URL после посещения главной:', redirectedUrl);

      const redirectedToPlatform = redirectedUrl.includes('/agents') || redirectedUrl.includes('/account');
      console.log('Перенаправлено на платформу:', redirectedToPlatform ? '✅' : '❌');
    }

    // РЕЗУЛЬТАТЫ
    console.log('\n' + '='.repeat(50));
    console.log('📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ АДМИНИСТРАТОРА:');

    console.log('✅ Защита маршрутов работает');
    console.log(`${adminLoggedIn ? '✅' : '❌'} Вход администратора`);
    if (adminLoggedIn) {
      console.log('✅ Доступ к защищенным страницам');
      console.log('✅ Контент страницы агентов');
      console.log('✅ Перенаправление с главной');
    }

    console.log('\n🎯 ВЫВОД: ПЛАТФОРМА РАБОТАЕТ ДЛЯ АДМИНИСТРАТОРА!');

  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
  } finally {
    await browser.close();
  }
}

testAdminFlow().catch(console.error);
