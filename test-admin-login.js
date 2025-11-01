const { chromium } = require('playwright');

async function testAdminLogin() {
  console.log('🚀 Запуск теста входа администратора...');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Переходим на страницу логина
    console.log('📍 Переход на страницу логина...');
    await page.goto('https://gpt-agent-kwid-fm5rq72et-world-wide-services-62780b79.vercel.app/login');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    console.log('📄 Заголовок страницы:', title);

    // Сначала попробуем демо-данные, чтобы проверить работу аутентификации
    console.log('📝 Сначала пробуем демо-данные...');

    // Очищаем поля и заполняем демо-данными
    await page.fill('#email', '');
    await page.fill('#password', '');
    await page.fill('#email', 'founder@example.com');
    await page.fill('#password', 'Demo1234!');

    // Нажимаем кнопку входа
    console.log('🔘 Нажимаем кнопку входа...');
    await page.click('button[type="submit"]');

    // Ждем редиректа
    console.log('⏳ Ждем редиректа...');
    await page.waitForURL('**', { timeout: 10000 });

    const currentUrl = page.url();
    console.log('📍 Текущий URL после входа:', currentUrl);

    // Проверяем, вошли ли мы
    if (currentUrl.includes('/login')) {
      console.log('❌ Вход НЕ удался - остались на странице логина');
    } else {
      console.log('✅ Вход удался! Перешли на:', currentUrl);

      // Проверяем доступ к защищенным страницам
      console.log('🔒 Проверяем доступ к защищенным страницам...');

      await page.goto('https://gpt-agent-kwid-fm5rq72et-world-wide-services-62780b79.vercel.app/account');
      await page.waitForLoadState('networkidle');
      const accountUrl = page.url();
      console.log('📄 Страница аккаунта:', accountUrl);

      if (accountUrl.includes('/account')) {
        console.log('✅ Доступ к странице аккаунта работает!');
      } else {
        console.log('❌ Доступ к странице аккаунта заблокирован');
      }

      await page.goto('https://gpt-agent-kwid-fm5rq72et-world-wide-services-62780b79.vercel.app/agents');
      await page.waitForLoadState('networkidle');
      const agentsUrl = page.url();
      console.log('🤖 Страница агентов:', agentsUrl);

      if (agentsUrl.includes('/agents')) {
        console.log('✅ Доступ к странице агентов работает!');
      } else {
        console.log('❌ Доступ к странице агентов заблокирован');
      }
    }

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  } finally {
    await browser.close();
  }
}

testAdminLogin().catch(console.error);
