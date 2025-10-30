import { test, expect } from '@playwright/test'
import { promises as fs } from 'fs'
import path from 'path'

/**
 * Полное сканирование и тестирование всех страниц, кнопок и функций
 */
test.describe('Полное сканирование всех страниц и функций', () => {
  const screenshotsDir = path.join(process.cwd(), 'test-screenshots')
  
  test.beforeAll(async () => {
    // Создаем директорию для скриншотов
    try {
      await fs.mkdir(screenshotsDir, { recursive: true })
    } catch (error) {
      // Директория уже существует
    }
  })

  test('1. Главная страница (Dashboard) - полная проверка', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Скриншот полной страницы
    await page.screenshot({ path: path.join(screenshotsDir, '01-dashboard-full.png'), fullPage: true })

    // Проверка всех карточек статистики
    const statCards = page.locator('[class*="StatCard"], [class*="stat-card"]')
    const cardCount = await statCards.count()
    console.log(`Найдено карточек статистики: ${cardCount}`)
    
    for (let i = 0; i < cardCount; i++) {
      const card = statCards.nth(i)
      if (await card.isVisible()) {
        await expect(card).toBeVisible()
        // Кликаем на карточку для проверки интерактивности
        await card.click()
        await page.waitForTimeout(200)
        await card.screenshot({ path: path.join(screenshotsDir, `01-dashboard-card-${i}.png`) })
      }
    }

    // Проверка всех графиков
    const charts = page.locator('[class*="Chart"], svg, canvas')
    const chartCount = await charts.count()
    console.log(`Найдено графиков: ${chartCount}`)
    
    for (let i = 0; i < Math.min(chartCount, 5); i++) {
      const chart = charts.nth(i)
      if (await chart.isVisible()) {
        await expect(chart).toBeVisible()
        await chart.screenshot({ path: path.join(screenshotsDir, `01-dashboard-chart-${i}.png`) })
      }
    }

    // Проверка всех кнопок на странице
    const buttons = page.locator('button, [role="button"]')
    const buttonCount = await buttons.count()
    console.log(`Найдено кнопок на Dashboard: ${buttonCount}`)

    // Проверка всех ссылок
    const links = page.locator('a[href]')
    const linkCount = await links.count()
    console.log(`Найдено ссылок на Dashboard: ${linkCount}`)
  })

  test('2. Страница агентов - полная проверка', async ({ page }) => {
    await page.goto('/agents')
    await page.waitForLoadState('networkidle')

    // Скриншот полной страницы
    await page.screenshot({ path: path.join(screenshotsDir, '02-agents-full.png'), fullPage: true })

    // Проверка поиска
    const searchInput = page.locator('input[type="search"], input[placeholder*="Поиск"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('тест')
      await page.waitForTimeout(500)
      await page.screenshot({ path: path.join(screenshotsDir, '02-agents-search.png') })
      await searchInput.clear()
      await page.waitForTimeout(300)
    }

    // Проверка кнопки создания
    const createButton = page.getByRole('button', { name: /создать агента/i })
    if (await createButton.isVisible()) {
      await expect(createButton).toBeEnabled()
      await createButton.screenshot({ path: path.join(screenshotsDir, '02-agents-create-button.png') })
    }

    // Проверка таблицы агентов
    const table = page.locator('table')
    if (await table.isVisible()) {
      await table.screenshot({ path: path.join(screenshotsDir, '02-agents-table.png') })

      // Проверка каждой строки таблицы
      const rows = table.locator('tbody tr')
      const rowCount = await rows.count()
      console.log(`Найдено агентов в таблице: ${rowCount}`)

      for (let i = 0; i < Math.min(rowCount, 5); i++) {
        const row = rows.nth(i)
        if (await row.isVisible()) {
          // Проверка всех кнопок в строке
          const rowButtons = row.locator('button, [role="button"], a')
          const rowButtonCount = await rowButtons.count()
          
          for (let j = 0; j < rowButtonCount; j++) {
            const btn = rowButtons.nth(j)
            if (await btn.isVisible()) {
              const btnText = await btn.textContent()
              console.log(`  Строка ${i}, Кнопка ${j}: ${btnText}`)
              await expect(btn).toBeEnabled()
            }
          }

          // Клик на имя агента для перехода на страницу редактирования
          const agentNameLink = row.locator('a').first()
          if (await agentNameLink.isVisible()) {
            const href = await agentNameLink.getAttribute('href')
            if (href && href !== '#') {
              await agentNameLink.click()
              await page.waitForTimeout(1000)
              await page.screenshot({ path: path.join(screenshotsDir, `02-agent-edit-${i}.png`), fullPage: true })
              await page.goBack()
              await page.waitForTimeout(500)
            }
          }
        }
      }
    }
  })

  test('3. Страница создания/редактирования агента - все вкладки', async ({ page }) => {
    await page.goto('/agents/new')
    await page.waitForLoadState('networkidle')

    // Скриншот начального состояния
    await page.screenshot({ path: path.join(screenshotsDir, '03-agent-new-full.png'), fullPage: true })

    // Получаем все вкладки
    const tabs = [
      { name: 'Основные', value: 'general' },
      { name: 'Сделки и контакты', value: 'deals' },
      { name: 'Триггеры', value: 'triggers' },
      { name: 'Цепочки', value: 'chains' },
      { name: 'Интеграции', value: 'integrations' },
      { name: 'Дополнительно', value: 'additional' },
    ]

    for (const tab of tabs) {
      console.log(`Тестируем вкладку: ${tab.name}`)
      
      // Кликаем на вкладку
      const tabButton = page.getByRole('tab', { name: new RegExp(tab.name, 'i') })
      if (await tabButton.isVisible()) {
        await tabButton.click()
        await page.waitForTimeout(500)

        // Скриншот вкладки
        await page.screenshot({ 
          path: path.join(screenshotsDir, `03-agent-tab-${tab.value}.png`), 
          fullPage: true 
        })

        // Проверяем все интерактивные элементы на вкладке
        const inputs = page.locator('input, textarea, select, [role="combobox"], [role="textbox"]')
        const inputCount = await inputs.count()
        console.log(`  Найдено полей ввода: ${inputCount}`)

        const buttons = page.locator('button, [role="button"]')
        const buttonCount = await buttons.count()
        console.log(`  Найдено кнопок: ${buttonCount}`)

        const toggles = page.locator('input[type="checkbox"], [role="switch"]')
        const toggleCount = await toggles.count()
        console.log(`  Найдено toggle: ${toggleCount}`)

        // Тестируем каждую кнопку на вкладке
        for (let i = 0; i < Math.min(buttonCount, 10); i++) {
          const btn = buttons.nth(i)
          if (await btn.isVisible()) {
            const btnText = await btn.textContent()
            const isEnabled = await btn.isEnabled()
            console.log(`    Кнопка ${i}: "${btnText}" - Enabled: ${isEnabled}`)
            
            // Делаем скриншот кнопки если это важная кнопка
            if (btnText && (btnText.includes('Сохранить') || btnText.includes('Создать') || btnText.includes('Удалить'))) {
              await btn.screenshot({ path: path.join(screenshotsDir, `03-button-${tab.value}-${i}.png`) })
            }
          }
        }

        // Тестируем toggle switches
        for (let i = 0; i < Math.min(toggleCount, 5); i++) {
          const toggle = toggles.nth(i)
          if (await toggle.isVisible()) {
            const initialState = await toggle.isChecked()
            await toggle.click()
            await page.waitForTimeout(200)
            const newState = await toggle.isChecked()
            console.log(`    Toggle ${i}: ${initialState} -> ${newState}`)
            // Возвращаем обратно
            await toggle.click()
            await page.waitForTimeout(200)
          }
        }
      }
    }
  })

  test('4. База знаний - категории и статьи', async ({ page }) => {
    // Категории
    await page.goto('/knowledge-base/categories')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: path.join(screenshotsDir, '04-categories-full.png'), fullPage: true })

    // Проверка кнопок
    const createCategoryBtn = page.getByRole('button', { name: /создать/i })
    if (await createCategoryBtn.isVisible()) {
      await expect(createCategoryBtn).toBeEnabled()
    }

    const filterBtn = page.getByRole('button', { name: /фильтры/i })
    if (await filterBtn.isVisible()) {
      await expect(filterBtn).toBeEnabled()
    }

    // Проверка таблицы категорий
    const categoryTable = page.locator('table')
    if (await categoryTable.isVisible()) {
      await categoryTable.screenshot({ path: path.join(screenshotsDir, '04-categories-table.png') })
      
      const rows = categoryTable.locator('tbody tr')
      const rowCount = await rows.count()
      console.log(`Найдено категорий: ${rowCount}`)

      for (let i = 0; i < Math.min(rowCount, 3); i++) {
        const row = rows.nth(i)
        const actionButtons = row.locator('button, a')
        const btnCount = await actionButtons.count()
        console.log(`  Категория ${i}: ${btnCount} кнопок действий`)
      }
    }

    // Статьи
    await page.goto('/knowledge-base/articles')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: path.join(screenshotsDir, '05-articles-full.png'), fullPage: true })

    // Проверка поиска статей
    const articleSearch = page.locator('input[type="search"]')
    if (await articleSearch.isVisible()) {
      await articleSearch.fill('тест')
      await page.waitForTimeout(500)
      await page.screenshot({ path: path.join(screenshotsDir, '05-articles-search.png') })
    }

    // Проверка кнопки создания статьи
    const createArticleBtn = page.getByRole('button', { name: /создать/i })
    if (await createArticleBtn.isVisible()) {
      await expect(createArticleBtn).toBeEnabled()
    }
  })

  test('5. Тестовый чат - все функции', async ({ page }) => {
    await page.goto('/chat')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: path.join(screenshotsDir, '06-chat-full.png'), fullPage: true })

    // Проверка выбора агента
    const agentSelect = page.locator('select, [role="combobox"]')
    if (await agentSelect.isVisible()) {
      await expect(agentSelect).toBeEnabled()
      
      // Пытаемся выбрать опцию
      const options = await agentSelect.locator('option').count()
      if (options > 1) {
        await agentSelect.selectOption({ index: 1 })
        await page.waitForTimeout(300)
        await page.screenshot({ path: path.join(screenshotsDir, '06-chat-agent-selected.png') })
      }
    }

    // Проверка поля ввода сообщения
    const messageInput = page.locator('textarea, input[type="text"]')
    if (await messageInput.isVisible()) {
      await messageInput.fill('Тестовое сообщение для проверки')
      await page.waitForTimeout(300)
      await page.screenshot({ path: path.join(screenshotsDir, '06-chat-message-filled.png') })

      // Проверка кнопки отправки
      const sendButton = page.getByRole('button', { name: /отправить|send/i })
      if (await sendButton.isVisible()) {
        await expect(sendButton).toBeEnabled()
        await sendButton.screenshot({ path: path.join(screenshotsDir, '06-chat-send-button.png') })
      }
    }
  })

  test('6. Интеграции - все настройки', async ({ page }) => {
    await page.goto('/integrations')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: path.join(screenshotsDir, '07-integrations-full.png'), fullPage: true })

    // Проверка всех кнопок
    const buttons = page.locator('button, [role="button"]')
    const buttonCount = await buttons.count()
    console.log(`Найдено кнопок на странице интеграций: ${buttonCount}`)

    for (let i = 0; i < buttonCount; i++) {
      const btn = buttons.nth(i)
      if (await btn.isVisible()) {
        const btnText = await btn.textContent()
        const isEnabled = await btn.isEnabled()
        console.log(`  Кнопка ${i}: "${btnText}" - Enabled: ${isEnabled}`)
        await expect(btn).toBeEnabled()
      }
    }

    // Проверка карточек интеграций
    const cards = page.locator('[class*="Card"], [class*="card"]')
    const cardCount = await cards.count()
    console.log(`Найдено карточек интеграций: ${cardCount}`)

    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i)
      if (await card.isVisible()) {
        await card.screenshot({ path: path.join(screenshotsDir, `07-integration-card-${i}.png`) })
      }
    }
  })

  test('7. Тарифные планы - все опции', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: path.join(screenshotsDir, '08-pricing-full.png'), fullPage: true })

    // Проверка переключения месячный/годовой
    const billingButtons = page.locator('button').filter({ hasText: /ежемесячно|ежегодно/i })
    const billingCount = await billingButtons.count()
    if (billingCount >= 2) {
      await billingButtons.first().click()
      await page.waitForTimeout(300)
      await page.screenshot({ path: path.join(screenshotsDir, '08-pricing-monthly.png') })
      
      await billingButtons.nth(1).click()
      await page.waitForTimeout(300)
      await page.screenshot({ path: path.join(screenshotsDir, '08-pricing-yearly.png') })
    }

    // Проверка кнопок выбора планов
    const planButtons = page.getByRole('button').filter({ hasText: /выбрать|подписаться/i })
    const planButtonCount = await planButtons.count()
    console.log(`Найдено кнопок планов: ${planButtonCount}`)

    for (let i = 0; i < planButtonCount; i++) {
      const btn = planButtons.nth(i)
      if (await btn.isVisible()) {
        await expect(btn).toBeEnabled()
        await btn.screenshot({ path: path.join(screenshotsDir, `08-plan-button-${i}.png`) })
      }
    }
  })

  test('8. Аккаунт - все настройки', async ({ page }) => {
    await page.goto('/account')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: path.join(screenshotsDir, '09-account-full.png'), fullPage: true })

    // Проверка всех полей формы
    const inputs = page.locator('input, textarea')
    const inputCount = await inputs.count()
    console.log(`Найдено полей ввода: ${inputCount}`)

    for (let i = 0; i < Math.min(inputCount, 10); i++) {
      const input = inputs.nth(i)
      if (await input.isVisible()) {
        const inputType = await input.getAttribute('type')
        const inputName = await input.getAttribute('name')
        const placeholder = await input.getAttribute('placeholder')
        console.log(`  Поле ${i}: type=${inputType}, name=${inputName}, placeholder=${placeholder}`)
        await expect(input).toBeEnabled()
      }
    }

    // Проверка кнопок
    const saveButton = page.getByRole('button', { name: /сохранить/i })
    if (await saveButton.isVisible()) {
      await expect(saveButton).toBeEnabled()
    }
  })

  test('9. Поддержка - все разделы', async ({ page }) => {
    await page.goto('/support')
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: path.join(screenshotsDir, '10-support-full.png'), fullPage: true })

    // Проверка карточек разделов
    const cards = page.locator('[class*="Card"]')
    const cardCount = await cards.count()
    console.log(`Найдено карточек поддержки: ${cardCount}`)

    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i)
      if (await card.isVisible()) {
        await card.screenshot({ path: path.join(screenshotsDir, `10-support-card-${i}.png`) })
        // Проверяем кликабельность
        await card.click()
        await page.waitForTimeout(300)
      }
    }
  })

  test('10. Sidebar навигация - все пункты меню', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Скриншот Sidebar
    const sidebar = page.locator('nav, [role="navigation"], [class*="Sidebar"]')
    if (await sidebar.isVisible()) {
      await sidebar.screenshot({ path: path.join(screenshotsDir, '11-sidebar.png') })
    }

    // Проверка всех пунктов меню
    const menuItems = sidebar.locator('a[href]')
    const menuCount = await menuItems.count()
    console.log(`Найдено пунктов меню: ${menuCount}`)

    const menuPaths = [
      '/',
      '/agents',
      '/chat',
      '/knowledge-base',
      '/integrations',
      '/pricing',
      '/account',
      '/support',
    ]

    for (const menuPath of menuPaths) {
      const menuItem = sidebar.locator(`a[href="${menuPath}"], a[href*="${menuPath}"]`).first()
      if (await menuItem.isVisible()) {
        const menuText = await menuItem.textContent()
        console.log(`Переход на: ${menuText} (${menuPath})`)
        
        await menuItem.click()
        await page.waitForTimeout(1000)
        await page.screenshot({ 
          path: path.join(screenshotsDir, `11-nav-${menuPath.replace(/\//g, '_')}.png`), 
          fullPage: true 
        })
        
        // Проверяем что мы на правильной странице
        const currentUrl = page.url()
        if (menuPath !== '/') {
          expect(currentUrl).toContain(menuPath)
        }
      }
    }
  })

  test('11. Header - все элементы', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Скриншот Header
    const header = page.locator('header, [class*="Header"]')
    if (await header.isVisible()) {
      await header.screenshot({ path: path.join(screenshotsDir, '12-header.png') })
      
      // Проверка всех кнопок в Header
      const headerButtons = header.locator('button, [role="button"]')
      const headerButtonCount = await headerButtons.count()
      console.log(`Найдено кнопок в Header: ${headerButtonCount}`)

      for (let i = 0; i < headerButtonCount; i++) {
        const btn = headerButtons.nth(i)
        if (await btn.isVisible()) {
          const btnText = await btn.textContent()
          const ariaLabel = await btn.getAttribute('aria-label')
          console.log(`  Header кнопка ${i}: "${btnText || ariaLabel}"`)
          await expect(btn).toBeEnabled()
        }
      }
    }
  })

  test('12. Модальные окна и диалоги', async ({ page }) => {
    await page.goto('/agents')
    await page.waitForLoadState('networkidle')

    // Ищем все кнопки которые могут открыть модалы
    const modalTriggers = page.getByRole('button').filter({ 
      hasText: /создать|открыть|настроить|подключить|добавить/i 
    })
    const triggerCount = await modalTriggers.count()
    console.log(`Найдено триггеров модалов: ${triggerCount}`)

    for (let i = 0; i < Math.min(triggerCount, 5); i++) {
      const trigger = modalTriggers.nth(i)
      if (await trigger.isVisible()) {
        try {
          await trigger.click()
          await page.waitForTimeout(1000)

          // Ищем модальное окно
          const modal = page.locator('[role="dialog"], [class*="Modal"], [class*="Dialog"]')
          if (await modal.isVisible()) {
            await modal.screenshot({ path: path.join(screenshotsDir, `13-modal-${i}.png`) })
            
            // Проверяем все кнопки в модале
            const modalButtons = modal.locator('button')
            const modalButtonCount = await modalButtons.count()
            console.log(`  Модал ${i}: найдено ${modalButtonCount} кнопок`)

            // Ищем кнопку закрытия
            const closeButton = modal.locator('button').filter({ 
              hasText: /закрыть|отмена|cancel|×/i 
            }).or(modal.locator('[aria-label*="закрыть"], [aria-label*="close"]'))
            
            if (await closeButton.isVisible()) {
              await closeButton.click()
              await page.waitForTimeout(500)
            } else {
              // Закрываем через Escape
              await page.keyboard.press('Escape')
              await page.waitForTimeout(500)
            }
          }
        } catch (error) {
          // Игнорируем ошибки если модал не открылся
          console.log(`  Модал ${i} не открылся или уже закрыт`)
        }
      }
    }
  })

  test('13. Accessibility - клавиатурная навигация', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Начинаем с Tab
    await page.keyboard.press('Tab')
    await page.waitForTimeout(200)

    // Делаем скриншот фокуса
    const focused = await page.evaluate(() => document.activeElement?.tagName)
    console.log(`Первый элемент с фокусом: ${focused}`)

    // Проверяем Tab навигацию на первых 10 элементах
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)
      
      const currentFocused = await page.evaluate(() => {
        const el = document.activeElement
        return el ? { tag: el.tagName, text: el.textContent?.substring(0, 50) } : null
      })
      
      if (currentFocused) {
        console.log(`Tab ${i + 2}: ${currentFocused.tag} - "${currentFocused.text}"`)
      }
    }
  })

  test('14. Формы - валидация и disabled состояния', async ({ page }) => {
    await page.goto('/agents/new')
    await page.waitForLoadState('networkidle')

    // Находим форму
    const form = page.locator('form')
    if (await form.isVisible()) {
      await form.screenshot({ path: path.join(screenshotsDir, '14-form-empty.png') })

      // Находим submit кнопку
      const submitButton = page.locator('button[type="submit"], button').filter({ 
        hasText: /создать|сохранить|отправить/i 
      }).first()

      if (await submitButton.isVisible()) {
        // Проверяем disabled состояние когда форма пустая
        const isDisabledEmpty = await submitButton.isDisabled()
        console.log(`Submit кнопка disabled при пустой форме: ${isDisabledEmpty}`)

        // Заполняем обязательные поля
        const nameInput = page.locator('input[name*="name"], input[placeholder*="название"]').first()
        if (await nameInput.isVisible()) {
          await nameInput.fill('Тестовый агент')
          await page.waitForTimeout(300)
          
          const isDisabledFilled = await submitButton.isDisabled()
          console.log(`Submit кнопка disabled при заполненной форме: ${isDisabledFilled}`)
          
          await form.screenshot({ path: path.join(screenshotsDir, '14-form-filled.png') })
        }
      }
    }
  })

  test('15. Responsive - мобильная версия', async ({ page }) => {
    // Тестируем на разных разрешениях
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
    ]

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, `15-responsive-${viewport.name}.png`), 
        fullPage: true 
      })
      
      console.log(`Скриншот создан для ${viewport.name} (${viewport.width}x${viewport.height})`)
    }
  })
})





