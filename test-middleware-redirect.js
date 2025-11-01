const { chromium } = require('playwright');

async function testMiddlewareRedirect() {
  console.log('🔄 ТЕСТИРОВАНИЕ ПЕРЕНАПРАВЛЕНИЯ ЧЕРЕЗ MIDDLEWARE');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'https://gpt-agent-kwid-bxw0a8dht-world-wide-services-62780b79.vercel.app';

  try {
    // 1. ВХОД АДМИНИСТРАТОРА
    console.log('\n🔐 ШАГ 1: Вход администратора');

    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.fill('#email', 'admin@worldwideservice.eu');
    await page.fill('#password', 'l1tmw6u977c9!Q');
    await page.click('button[type="submit"]');

    console.log('Ждем входа...');
    await page.waitForTimeout(3000);

    const afterLoginUrl = page.url();
    console.log('URL после входа:', afterLoginUrl);

    // 2. ПРОВЕРКА ДОСТУПА К ЗАЩИЩЕННЫМ СТРАНИЦАМ
    console.log('\n🔑 ШАГ 2: Проверка доступа к защищенным страницам');

    await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
    const agentsUrl = page.url();
    console.log('URL /agents:', agentsUrl);

    await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
    const accountUrl = page.url();
    console.log('URL /account:', accountUrl);

    const hasAccess = agentsUrl.includes('/agents') && accountUrl.includes('/account');
    console.log('Доступ к платформе:', hasAccess ? '✅' : '❌');

    // 3. ТЕСТ ПЕРЕНАПРАВЛЕНИЯ С ПУБЛИЧНЫХ СТРАНИЦ
    console.log('\n🔄 ШАГ 3: Тест перенаправления с публичных страниц');

    // Тест главной страницы
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const homeUrl = page.url();
    console.log('Главная страница:', homeUrl);
    const homeRedirected = homeUrl.includes('/agents');
    console.log('Перенаправление с главной:', homeRedirected ? '✅' : '❌');

    // Тест страницы логина
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const loginUrl = page.url();
    console.log('Страница логина:', loginUrl);
    const loginRedirected = loginUrl.includes('/agents');
    console.log('Перенаправление с логина:', loginRedirected ? '✅' : '❌');

    // Тест страницы регистрации
    await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const registerUrl = page.url();
    console.log('Страница регистрации:', registerUrl);
    const registerRedirected = registerUrl.includes('/agents');
    console.log('Перенаправление с регистрации:', registerRedirected ? '✅' : '❌');

    // РЕЗУЛЬТАТЫ
    console.log('\n' + '='.repeat(50));
    console.log('📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ MIDDLEWARE:');

    console.log(`${hasAccess ? '✅' : '❌'} Доступ к платформе`);
    console.log(`${homeRedirected ? '✅' : '❌'} Перенаправление с главной`);
    console.log(`${loginRedirected ? '✅' : '❌'} Перенаправление с логина`);
    console.log(`${registerRedirected ? '✅' : '❌'} Перенаправление с регистрации`);

    const middlewareWorks = homeRedirected && loginRedirected && registerRedirected;
    console.log(`\n🎯 MIDDLEWARE РАБОТАЕТ: ${middlewareWorks ? '✅ ДА' : '❌ НЕТ'}`);

    if (middlewareWorks) {
      console.log('\n🎉 ВСЕ СВЯЗАНО! ПОЛЬЗОВАТЕЛЬ БУДЕТ ПЕРЕНАПРАВЛЕН НА ПЛАТФОРМУ!');
    } else {
      console.log('\n⚠️ ПРОБЛЕМА С ПЕРЕНАПРАВЛЕНИЕМ!');
    }

  } catch (error) {
    console.error('❌ ОШИБКА:', error.message);
  } finally {
    await browser.close();
  }
}

testMiddlewareRedirect().catch(console.error);
