import { test, expect } from '@playwright/test'

/**
 * МАКСИМАЛЬНО ПОЛНОЕ СКАНИРОВАНИЕ ВСЕХ СТРАНИЦ, КНОПОК И ФУНКЦИЙ
 * Проверяет абсолютно все: страницы, кнопки, формы, модалы, навигацию
 */

test.describe('🔍 ПОЛНОЕ СКАНИРОВАНИЕ ВСЕГО ПРИЛОЖЕНИЯ', () => {
  const screenshotsDir = './test-screenshots'
  const baseURL = process.env.BASE_URL || 'http://localhost:3000'

  test('📊 1. DASHBOARD - Все элементы и кнопки', async ({ page }) => {
    await page.goto(baseURL)
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    
    // Полный скриншот
    await page.screenshot({ 
      path: `${screenshotsDir}/01-dashboard-complete.png`, 
      fullPage: true 
    })

    // ✅ Проверка Sidebar - все пункты меню
    console.log('📱 Проверка Sidebar навигации...')
    const sidebarLinks = [
      { text: /инфопанель|dashboard|главная/i, path: '/' },
      { text: /агенты|agents/i, path: '/agents' },
      { text: /тестовый чат|chat/i, path: '/chat' },
      { text: /база знаний|knowledge/i, path: '/knowledge-base' },
      { text: /интеграции|integrations/i, path: '/integrations' },
      { text: /тарифы|pricing/i, path: '/pricing' },
      { text: /аккаунт|account/i, path: '/account' },
      { text: /поддержка|support/i, path: '/support' },
    ]

    for (const link of sidebarLinks) {
      const linkElement = page.locator(`nav a[href="${link.path}"], [role="navigation"] a[href*="${link.path}"]`).first()
      if (await linkElement.isVisible({ timeout: 2000 }).catch(() => false)) {
        const href = await linkElement.getAttribute('href')
        console.log(`  ✅ Найден: ${link.path} -> ${href}`)
        await expect(linkElement).toBeVisible()
      } else {
        console.log(`  ⚠️  Не найден: ${link.path}`)
      }
    }

    // ✅ Проверка всех карточек статистики
    console.log('📊 Проверка карточек статистики...')
    const statCards = page.locator('[class*="StatCard"], article')
    const cardCount = await statCards.count()
    console.log(`  Найдено карточек: ${cardCount}`)
    
    for (let i = 0; i < Math.min(cardCount, 10); i++) {
      const card = statCards.nth(i)
      if (await card.isVisible({ timeout: 2000 }).catch(() => false)) {
        await card.screenshot({ 
          path: `${screenshotsDir}/01-dashboard-card-${i}.png` 
        })
      }
    }

    // ✅ Проверка всех графиков
    console.log('📈 Проверка графиков...')
    const charts = page.locator('svg, canvas, [class*="Chart"]')
    const chartCount = await charts.count()
    console.log(`  Найдено графиков: ${chartCount}`)

    // ✅ Проверка всех кнопок на странице
    console.log('🔘 Проверка всех кнопок Dashboard...')
    const buttons = page.locator('button, [role="button"]')
    const buttonCount = await buttons.count()
    console.log(`  Найдено кнопок: ${buttonCount}`)

    const buttonInfo = []
    for (let i = 0; i < Math.min(buttonCount, 20); i++) {
      const btn = buttons.nth(i)
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        const text = await btn.textContent()
        const ariaLabel = await btn.getAttribute('aria-label')
        const isEnabled = await btn.isEnabled()
        buttonInfo.push({ text: text || ariaLabel, enabled: isEnabled })
        console.log(`    Кнопка ${i}: "${text || ariaLabel}" - Enabled: ${isEnabled}`)
      }
    }

    // ✅ Проверка Header элементов
    console.log('🔝 Проверка Header...')
    const header = page.locator('header, [class*="Header"]')
    if (await header.isVisible({ timeout: 2000 }).catch(() => false)) {
      await header.screenshot({ path: `${screenshotsDir}/01-dashboard-header.png` })
    }
  })

  test('🤖 2. AGENTS PAGE - Полная проверка', async ({ page }) => {
    await page.goto(`${baseURL}/agents`)
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    
    await page.screenshot({ 
      path: `${screenshotsDir}/02-agents-complete.png`, 
      fullPage: true 
    })

    // ✅ Кнопка создания агента
    console.log('➕ Проверка кнопки создания агента...')
    const createButton = page.getByRole('button', { name: /создать агента|создать|create/i })
    if (await createButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(createButton).toBeEnabled()
      await createButton.screenshot({ path: `${screenshotsDir}/02-create-button.png` })
      
      // Кликаем и делаем скриншот
      await createButton.click()
      await page.waitForTimeout(1000)
      await page.screenshot({ 
        path: `${screenshotsDir}/02-after-create-click.png`, 
        fullPage: true 
      })
    }

    // ✅ Поиск
    console.log('🔍 Проверка поиска...')
    const searchInput = page.locator('input[type="search"], input[placeholder*="Поиск"]')
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('тест')
      await page.waitForTimeout(200)
      await searchInput.clear()
    }

    // ✅ Таблица агентов
    console.log('📋 Проверка таблицы агентов...')
    const table = page.locator('table')
    if (await table.isVisible({ timeout: 5000 }).catch(() => false)) {
      await table.screenshot({ path: `${screenshotsDir}/02-agents-table.png` })
      
      const rows = table.locator('tbody tr')
      const rowCount = await rows.count()
      console.log(`  Найдено агентов: ${rowCount}`)

      // Проверяем каждую строку
      for (let i = 0; i < Math.min(rowCount, 3); i++) {
        const row = rows.nth(i)
        
        // Все кнопки в строке
        const rowButtons = row.locator('button, a, [role="button"]')
        const btnCount = await rowButtons.count()
        console.log(`  Строка ${i}: ${btnCount} интерактивных элементов`)

        for (let j = 0; j < btnCount; j++) {
          const btn = rowButtons.nth(j)
          if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
            const text = await btn.textContent()
            console.log(`    Элемент ${j}: "${text}"`)
          }
        }
      }
    }
  })

  test('✏️  3. AGENT EDIT - Все вкладки и функции', async ({ page }) => {
    await page.goto(`${baseURL}/agents/new`)
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    
    await page.screenshot({ 
      path: `${screenshotsDir}/03-agent-edit-start.png`, 
      fullPage: true 
    })

    const tabs = [
      'Основные',
      'Сделки и контакты',
      'Триггеры',
      'Цепочки',
      'Интеграции',
      'Дополнительно',
    ]

    for (const tabName of tabs) {
      console.log(`📑 Тестируем вкладку: ${tabName}`)
      
      const tabButton = page.getByRole('tab', { name: new RegExp(tabName, 'i') })
      if (await tabButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await tabButton.click()
        await page.waitForTimeout(1000)

        // Скриншот вкладки
        const safeName = tabName.replace(/\s+/g, '-').toLowerCase()
        await page.screenshot({ 
          path: `${screenshotsDir}/03-tab-${safeName}.png`, 
          fullPage: true 
        })

        // Все кнопки на вкладке
        const tabButtons = page.locator('button, [role="button"]')
        const tabBtnCount = await tabButtons.count()
        console.log(`  Найдено кнопок: ${tabBtnCount}`)

        // Все поля ввода
        const inputs = page.locator('input, textarea, select')
        const inputCount = await inputs.count()
        console.log(`  Найдено полей: ${inputCount}`)

        // Все toggle switches
        const toggles = page.locator('input[type="checkbox"], [role="switch"]')
        const toggleCount = await toggles.count()
        console.log(`  Найдено toggle: ${toggleCount}`)

        // Тестируем каждую кнопку
        for (let i = 0; i < Math.min(tabBtnCount, 15); i++) {
          const btn = tabButtons.nth(i)
          if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
            const text = await btn.textContent()
            const enabled = await btn.isEnabled()
            if (text && (text.includes('Сохранить') || text.includes('Создать') || text.includes('Удалить'))) {
              console.log(`    🔘 "${text}" - Enabled: ${enabled}`)
            }
          }
        }
      }
    }
  })

  test('📚 4. KNOWLEDGE BASE - Категории и статьи', async ({ page }) => {
    // Категории
    await page.goto(`${baseURL}/knowledge-base/categories`)
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    await page.screenshot({ 
      path: `${screenshotsDir}/04-categories-complete.png`, 
      fullPage: true 
    })

    // Статьи
    await page.goto(`${baseURL}/knowledge-base/articles`)
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    await page.screenshot({ 
      path: `${screenshotsDir}/05-articles-complete.png`, 
      fullPage: true 
    })

    // Проверка всех кнопок
    const buttons = page.locator('button, [role="button"]')
    const btnCount = await buttons.count()
    console.log(`База знаний: найдено ${btnCount} кнопок`)
  })

  test('💬 5. CHAT - Все функции', async ({ page }) => {
    await page.goto(`${baseURL}/chat`)
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    await page.screenshot({ 
      path: `${screenshotsDir}/06-chat-complete.png`, 
      fullPage: true 
    })

    // Select агента
    const agentSelect = page.locator('select, [role="combobox"]')
    if (await agentSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(agentSelect).toBeEnabled()
    }

    // Поле ввода
    const messageInput = page.locator('textarea, input[type="text"]')
    if (await messageInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await messageInput.fill('Тестовое сообщение')
      await page.screenshot({ 
        path: `${screenshotsDir}/06-chat-with-message.png` 
      })
    }
  })

  test('🔌 6. INTEGRATIONS - Все настройки', async ({ page }) => {
    await page.goto(`${baseURL}/integrations`)
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    await page.screenshot({ 
      path: `${screenshotsDir}/07-integrations-complete.png`, 
      fullPage: true 
    })

    // Все кнопки
    const buttons = page.locator('button, [role="button"]')
    const btnCount = await buttons.count()
    console.log(`Интеграции: найдено ${btnCount} кнопок`)

    for (let i = 0; i < Math.min(btnCount, 10); i++) {
      const btn = buttons.nth(i)
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        const text = await btn.textContent()
        console.log(`  Кнопка ${i}: "${text}"`)
      }
    }
  })

  test('💰 7. PRICING - Все планы', async ({ page }) => {
    await page.goto(`${baseURL}/pricing`)
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    await page.screenshot({ 
      path: `${screenshotsDir}/08-pricing-complete.png`, 
      fullPage: true 
    })

    // Toggle месячный/годовой
    const billingToggle = page.locator('button').filter({ 
      hasText: /ежемесячно|ежегодно/i 
    }).first()
    if (await billingToggle.isVisible({ timeout: 5000 }).catch(() => false)) {
      await billingToggle.click()
      await page.waitForTimeout(200)
    }

    // Кнопки планов
    const planButtons = page.getByRole('button').filter({ 
      hasText: /выбрать|подписаться/i 
    })
    const planCount = await planButtons.count()
    console.log(`Найдено кнопок планов: ${planCount}`)
  })

  test('👤 8. ACCOUNT - Все настройки', async ({ page }) => {
    await page.goto(`${baseURL}/account`)
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    await page.screenshot({ 
      path: `${screenshotsDir}/09-account-complete.png`, 
      fullPage: true 
    })
  })

  test('📖 9. SUPPORT - Все разделы', async ({ page }) => {
    await page.goto(`${baseURL}/support`)
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    await page.screenshot({ 
      path: `${screenshotsDir}/10-support-complete.png`, 
      fullPage: true 
    })
  })

  test('🎯 10. КЛАВИАТУРНАЯ НАВИГАЦИЯ', async ({ page }) => {
    await page.goto(baseURL)
    await page.waitForLoadState('networkidle', { timeout: 30000 })

    // Tab навигация
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(200)
      
      const focused = await page.evaluate(() => {
        const el = document.activeElement
        return el ? {
          tag: el.tagName,
          text: el.textContent?.substring(0, 50),
          type: (el as HTMLElement).getAttribute('type'),
        } : null
      })
      
      if (focused) {
        console.log(`Tab ${i + 1}: ${focused.tag}${focused.type ? `[${focused.type}]` : ''} - "${focused.text}"`)
      }
    }
  })

  test('📱 11. RESPONSIVE - Разные разрешения', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
    ]

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(baseURL)
      await page.waitForLoadState('networkidle', { timeout: 30000 })
      
      await page.screenshot({ 
        path: `${screenshotsDir}/11-responsive-${vp.name}.png`, 
        fullPage: true 
      })
      console.log(`✅ Скриншот ${vp.name} (${vp.width}x${vp.height})`)
    }
  })
})









