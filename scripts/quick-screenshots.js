const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  const screenshot = async (name) => {
    try {
      await page.screenshot({ path: `test-screenshots/${name}.png`, fullPage: true });
      console.log(`✓ Скриншот ${name} сохранен`);
    } catch (e) {
      console.error(`✗ Ошибка скриншота ${name}:`, e.message);
    }
  };

  try {
    console.log('Открываем localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Ждем загрузки
    await page.waitForTimeout(3000);
    
    // Проверяем есть ли ошибка
    const bodyText = await page.textContent('body').catch(() => '');
    if (bodyText.includes('Missing required error components')) {
      console.error('❌ Ошибка: Missing required error components');
      await screenshot('ERROR-page');
      await browser.close();
      return;
    } else {
      console.log('✓ Страница загрузилась');
    }

    // Делаем скриншот главной
    await screenshot('1-dashboard');

    // Проверяем элементы дашборда
    const dashboardElements = await Promise.all([
      page.locator('text=Ответы ИИ').first().isVisible().catch(() => false),
      page.locator('text=Агенты').first().isVisible().catch(() => false),
    ]);
    console.log('Элементы дашборда:', dashboardElements);

    // Переходим к агентам
    console.log('Переходим к списку агентов...');
    await page.goto('http://localhost:3000/agents', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    await screenshot('2-agents-list');

    // Проверяем элементы списка
    const agentsElements = await Promise.all([
      page.locator('text=Агенты ИИ').first().isVisible().catch(() => false),
      page.locator('button:has-text("Создать")').first().isVisible().catch(() => false),
    ]);
    console.log('Элементы списка агентов:', agentsElements);

    // Создание агента
    console.log('Переходим к созданию агента...');
    await page.goto('http://localhost:3000/agents/create', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    await screenshot('3-create-agent');

    // Проверяем обязательное поле
    const requiredField = await page.locator('text=Название').first().isVisible().catch(() => false);
    console.log('Поле "Название" видно:', requiredField);

    // Если есть агент с id, проверяем страницу редактирования
    console.log('Проверяем страницу редактирования агента...');
    await page.goto('http://localhost:3000/agents/553/edit', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    const hasError = await page.locator('text=Missing required error components').isVisible().catch(() => false);
    if (!hasError) {
      await screenshot('4-edit-agent-general');

      // Переключаемся на вкладки - ищем по data-state или по тексту в TabsTrigger
      const tabs = [
        { text: 'Сделки и контакты', value: 'deals' },
        { text: 'Триггеры', value: 'triggers' },
        { text: 'Цепочки', value: 'chains' },
        { text: 'Интеграции', value: 'integrations' },
        { text: 'Дополнительно', value: 'additional' }
      ];
      
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        console.log(`Переключаемся на вкладку "${tab.text}"...`);
        try {
          // Пробуем разные селекторы - вкладки это button с role="tab"
          const selectors = [
            `button[role="tab"]:has-text("${tab.text}")`,
            `button:has-text("${tab.text}")`,
            `[role="tab"]:text("${tab.text}")`,
            `button:text("${tab.text}")`
          ];
          
          let clicked = false;
          for (const selector of selectors) {
            try {
              await page.click(selector, { timeout: 3000 });
              clicked = true;
              break;
            } catch (e) {
              // Пробуем следующий селектор
            }
          }
          
          if (clicked) {
            await page.waitForTimeout(2000);
            await screenshot(`5-edit-agent-${i + 1}-${tab.value}`);
          } else {
            console.log(`⚠ Не удалось найти вкладку "${tab.text}"`);
          }
        } catch (e) {
          console.log(`⚠ Ошибка переключения на "${tab.text}":`, e.message);
        }
      }
    } else {
      console.error('❌ Страница редактирования показывает ошибку');
      await screenshot('ERROR-edit-agent');
    }

    console.log('\n✅ Все скриншоты сохранены в папку test-screenshots/');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    await screenshot('ERROR-general').catch(() => {});
  } finally {
    await browser.close();
  }
})();

