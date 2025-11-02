const { chromium } = require('playwright');

async function testFullFlow() {
  console.log('🚀 ТЕСТИРОВАНИЕ ПОЛНОГО ПОТОКА: РЕГИСТРАЦИЯ → ВХОД → ПЛАТФОРМА');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'https://gpt-agent-kwid-bxw0a8dht-world-wide-services-62780b79.vercel.app';

  try {
    // 1. РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ
    console.log('\n📝 ШАГ 1: Регистрация нового пользователя');

    const timestamp = Date.now();
    const testEmail = `flow-${timestamp}@test.com`;
    const testPassword = 'FlowTest123!';

    await page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
    await page.fill('#firstName', 'Flow');
    await page.fill('#lastName', 'Test');
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    await page.fill('#confirmPassword', testPassword);
    await page.click('button[type="submit"]');

    await page.waitForURL('**/login**', { timeout: 10000 });
    console.log('✅ Регистрация успешна, перенаправлено на логин');

    // 2. ВХОД С НОВЫМИ УЧЕТНЫМИ ДАННЫМИ
    console.log('\n🔐 ШАГ 2: Вход с новыми учетными данными');

    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    await page.click('button[type="submit"]');

    await page.waitForURL(url => !url.toString().includes('/login') && !url.toString().includes('/register'), { timeout: 10000 });
    const afterLoginUrl = page.url();
    console.log('📍 URL после входа:', afterLoginUrl);

    // 3. ПРОВЕРКА ПЕРЕНАПРАВЛЕНИЯ НА ПЛАТФОРМУ
    console.log('\n🏢 ШАГ 3: Проверка перенаправления на платформу');

    const isOnPlatform = afterLoginUrl.includes('/agents') || afterLoginUrl.includes('/account');
    console.log('На платформе:', isOnPlatform);

    if (isOnPlatform) {
      console.log('✅ ПОЛЬЗОВАТЕЛЬ ПОПАЛ НА ПЛАТФОРМУ!');

      // Проверяем, что можем видеть контент платформы
      const pageTitle = await page.title();
      console.log('Заголовок страницы:', pageTitle);

      const agentsVisible = await page.locator('text=Агенты ИИ').isVisible().catch(() => false);
      console.log('Видна страница агентов:', agentsVisible);

    } else {
      console.log('❌ ПОЛЬЗОВАТЕЛЬ НЕ ПОПАЛ НА ПЛАТФОРМУ!');
      console.log('Текущий URL:', afterLoginUrl);

      if (afterLoginUrl === baseUrl || afterLoginUrl === `${baseUrl}/`) {
        console.log('⚠️ ПЕРЕНАПРАВЛЕНИЕ НА ГЛАВНУЮ СТРАНИЦУ - НЕПРАВИЛЬНО!');
      }
    }

    // 4. ТЕСТ ДОСТУПА К ЗАЩИЩЕННЫМ СТРАНИЦАМ
    console.log('\n🔒 ШАГ 4: Тест доступа к защищенным страницам');

    await page.goto(`${baseUrl}/account`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const accountUrl = page.url();
    const canAccessAccount = accountUrl.includes('/account');
    console.log('Доступ к аккаунту:', canAccessAccount);

    await page.goto(`${baseUrl}/agents`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const agentsUrl = page.url();
    const canAccessAgents = agentsUrl.includes('/agents');
    console.log('Доступ к агентам:', canAccessAgents);

    // 5. ТЕСТ АДМИНИСТРАТОРА
    console.log('\n👑 ШАГ 5: Тест администратора');

    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.fill('#email', 'admin@worldwideservice.eu');
    await page.fill('#password', 'l1tmw6u977c9!Q');
    await page.click('button[type="submit"]');

    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 });
    const adminUrl = page.url();
    const adminSuccess = adminUrl.includes('/agents');
    console.log('Админ перенаправлен на агентов:', adminSuccess);

    // 6. ТЕСТ ПЕРЕНАПРАВЛЕНИЯ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ С ГЛАВНОЙ
    console.log('\n🔄 ШАГ 6: Тест перенаправления авторизованного пользователя с главной');

    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const redirectedFromHomeUrl = page.url();
    const redirectedFromHome = redirectedFromHomeUrl.includes('/agents') || redirectedFromHomeUrl.includes('/account');
    console.log('Перенаправление с главной:', redirectedFromHome, redirectedFromHomeUrl);

    // РЕЗУЛЬТАТЫ
    console.log('\n' + '='.repeat(60));
    console.log('📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:');

    const results = [
      { name: 'Регистрация', success: page.url().includes('/login') },
      { name: 'Вход обычного пользователя', success: isOnPlatform },
      { name: 'Перенаправление на платформу', success: isOnPlatform },
      { name: 'Доступ к аккаунту', success: canAccessAccount },
      { name: 'Доступ к агентам', success: canAccessAgents },
      { name: 'Вход администратора', success: adminSuccess },
      { name: 'Перенаправление авторизованного с главной', success: redirectedFromHome },
    ];

    results.forEach(result => {
      console.log(`${result.success ? '✅' : '❌'} ${result.name}`);
    });

    const passed = results.filter(r => r.success).length;
    const total = results.length;
    const percentage = ((passed / total) * 100).toFixed(1);

    console.log(`\n🎯 ОБЩИЙ РЕЗУЛЬТАТ: ${passed}/${total} (${percentage}%)`);

    if (passed === total) {
      console.log('\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ! ПОТОК РАБОТАЕТ ИДЕАЛЬНО!');
    } else {
      console.log('\n⚠️ ЕСТЬ ПРОБЛЕМЫ! ТРЕБУЕТСЯ ИСПРАВЛЕНИЕ!');
    }

  } catch (error) {
    console.error('❌ ОШИБКА ПРИ ТЕСТИРОВАНИИ:', error.message);
  } finally {
    await browser.close();
  }
}

testFullFlow().catch(console.error);
