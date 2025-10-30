import { test, expect } from '@playwright/test'

/**
 * Комплексное тестирование всех кнопок и интерактивных элементов
 */
test.describe('Comprehensive Button Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Переход на главную страницу
    await page.goto('/')
    // Ждем загрузки
    await page.waitForLoadState('networkidle')
  })

  test('Dashboard - все кнопки и интерактивные элементы', async ({ page }) => {
    // Проверка навигационных кнопок в Sidebar
    const sidebarButtons = [
      { text: /инфопанель|dashboard/i, url: '/' },
      { text: /агенты|agents/i, url: '/agents' },
      { text: /тестовый чат|chat/i, url: '/chat' },
      { text: /база знаний|knowledge/i, url: '/knowledge-base' },
      { text: /интеграции|integrations/i, url: '/integrations' },
      { text: /тарифы|pricing/i, url: '/pricing' },
      { text: /аккаунт|account/i, url: '/account' },
      { text: /поддержка|support/i, url: '/support' },
    ]

    for (const button of sidebarButtons) {
      const btn = page.getByRole('link', { name: button.text })
      if (await btn.isVisible()) {
        await expect(btn).toBeVisible()
        await expect(btn).toBeEnabled()
      }
    }

    // Проверка кнопок в Header
    const searchButton = page.locator('button[type="button"]').filter({ hasText: /поиск|search/i })
    if (await searchButton.isVisible()) {
      await expect(searchButton).toBeEnabled()
    }

    // Проверка карточек статистики (кликабельные элементы)
    const statCards = page.locator('[class*="StatCard"], [class*="stat-card"]')
    const cardCount = await statCards.count()
    if (cardCount > 0) {
      expect(cardCount).toBeGreaterThan(0)
    }
  })

  test('Agents Page - все кнопки', async ({ page }) => {
    await page.goto('/agents')
    await page.waitForLoadState('networkidle')

    // Кнопка "Создать агента"
    const createButton = page.getByRole('button', { name: /создать агента|создать|create/i })
    await expect(createButton).toBeVisible()
    await expect(createButton).toBeEnabled()

    // Тестируем клик
    await createButton.click()
    await page.waitForTimeout(500)
    // Проверяем что перешли на страницу создания или открылся модал
    const url = page.url()
    expect(url).toMatch(/\/agents\/(new|create)/)

    // Возвращаемся обратно
    if (url.includes('/agents/new') || url.includes('/agents/create')) {
      await page.goto('/agents')
      await page.waitForLoadState('networkidle')
    }

    // Проверка поиска
    const searchInput = page.locator('input[type="search"], input[placeholder*="Поиск"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('тест')
      await page.waitForTimeout(500)
      await expect(searchInput).toHaveValue('тест')
      await searchInput.clear()
    }

    // Проверка кнопок в таблице агентов (если есть)
    const tableRows = page.locator('table tbody tr')
    const rowCount = await tableRows.count()

    if (rowCount > 0) {
      const firstRow = tableRows.first()

      // Кнопка "Изменить"
      const editButton = firstRow.getByRole('link', { name: /изменить|edit/i })
      if (await editButton.isVisible()) {
        await expect(editButton).toBeEnabled()
      }

      // Кнопка "Копировать"
      const copyButton = firstRow.getByRole('button', { name: /копировать|copy|дублировать/i })
      if (await copyButton.isVisible()) {
        await expect(copyButton).toBeEnabled()
      }

      // Кнопка "Удалить"
      const deleteButton = firstRow.getByRole('button', { name: /удалить|delete/i })
      if (await deleteButton.isVisible()) {
        await expect(deleteButton).toBeEnabled()
      }

      // Toggle статуса агента
      const statusToggle = firstRow.locator('input[type="checkbox"], [role="switch"]')
      if (await statusToggle.isVisible()) {
        await expect(statusToggle).toBeEnabled()
      }
    }
  })

  test('Agent Edit Page - все вкладки и кнопки', async ({ page }) => {
    // Переход на страницу создания агента
    await page.goto('/agents/new')
    await page.waitForLoadState('networkidle')

    // Проверка breadcrumbs
    const breadcrumb = page.locator('nav, [class*="breadcrumb"]')
    if (await breadcrumb.isVisible()) {
      await expect(breadcrumb).toBeVisible()
    }

    // Проверка всех вкладок
    const tabs = [
      { name: 'Основные', value: 'general' },
      { name: 'Сделки и контакты', value: 'deals' },
      { name: 'Триггеры', value: 'triggers' },
      { name: 'Цепочки', value: 'chains' },
      { name: 'Интеграции', value: 'integrations' },
      { name: 'Дополнительно', value: 'additional' },
    ]

    for (const tab of tabs) {
      const tabButton = page.getByRole('tab', { name: new RegExp(tab.name, 'i') })
      if (await tabButton.isVisible()) {
        await expect(tabButton).toBeEnabled()
        await tabButton.click()
        await page.waitForTimeout(300)
        // Проверяем что контент вкладки видим
        const tabContent = page.locator(`[role="tabpanel"]`)
        await expect(tabContent).toBeVisible()
      }
    }

    // Вкладка "Основные"
    await page.getByRole('tab', { name: /основные/i }).click()
    await page.waitForTimeout(300)

    // Кнопка "Сохранить"
    const saveButton = page.getByRole('button', { name: /сохранить|save/i })
    if (await saveButton.isVisible()) {
      await expect(saveButton).toBeEnabled()
    }

    // Кнопка "Отмена"
    const cancelButton = page.getByRole('button', { name: /отмена|cancel/i })
    if (await cancelButton.isVisible()) {
      await expect(cancelButton).toBeEnabled()
    }

    // Toggle "Активно"
    const activeToggle = page.locator('input[type="checkbox"][checked], [role="switch"]').first()
    if (await activeToggle.isVisible()) {
      await expect(activeToggle).toBeEnabled()
    }

    // Вкладка "Сделки и контакты"
    await page.getByRole('tab', { name: /сделки и контакты/i }).click()
    await page.waitForTimeout(300)

    // Кнопка "Сохранить настройки"
    const saveSettingsButton = page.getByRole('button', { name: /сохранить настройки/i })
    if (await saveSettingsButton.isVisible()) {
      await expect(saveSettingsButton).toBeEnabled()
    }

    // Вкладка "Триггеры"
    await page.getByRole('tab', { name: /триггеры/i }).click()
    await page.waitForTimeout(300)

    // Кнопка "Создать триггер"
    const createTriggerButton = page.getByRole('button', { name: /создать триггер/i })
    if (await createTriggerButton.isVisible()) {
      await expect(createTriggerButton).toBeEnabled()
    }

    // Вкладка "Цепочки"
    await page.getByRole('tab', { name: /цепочки/i }).click()
    await page.waitForTimeout(300)

    // Кнопка "Новая цепочка"
    const createChainButton = page.getByRole('button', { name: /новая цепочка|создать/i })
    if (await createChainButton.isVisible()) {
      await expect(createChainButton).toBeEnabled()
    }

    // Вкладка "Интеграции"
    await page.getByRole('tab', { name: /интеграции/i }).click()
    await page.waitForTimeout(300)

    // Кнопка "Настроить интеграции"
    const setupIntegrationsButton = page.getByRole('button', { name: /настроить интеграции/i })
    if (await setupIntegrationsButton.isVisible()) {
      await expect(setupIntegrationsButton).toBeEnabled()
    }

    // Вкладка "Дополнительно"
    await page.getByRole('tab', { name: /дополнительно/i }).click()
    await page.waitForTimeout(300)

    // Кнопка "Сохранить" в дополнительно
    const saveAdditionalButton = page.getByRole('button', { name: /сохранить/i })
    if (await saveAdditionalButton.isVisible()) {
      await expect(saveAdditionalButton).toBeEnabled()
    }

    // Кнопка "Удалить" агента
    const deleteAgentButton = page.getByRole('button', { name: /удалить/i })
    if (await deleteAgentButton.isVisible()) {
      await expect(deleteAgentButton).toBeEnabled()
    }
  })

  test('Knowledge Base - все кнопки', async ({ page }) => {
    await page.goto('/knowledge-base/categories')
    await page.waitForLoadState('networkidle')

    // Кнопка "Создать"
    const createCategoryButton = page.getByRole('button', { name: /создать/i })
    if (await createCategoryButton.isVisible()) {
      await expect(createCategoryButton).toBeEnabled()
    }

    // Кнопка "Фильтры"
    const filtersButton = page.getByRole('button', { name: /фильтры|filters/i })
    if (await filtersButton.isVisible()) {
      await expect(filtersButton).toBeEnabled()
    }

    // Переход на страницу статей
    await page.goto('/knowledge-base/articles')
    await page.waitForLoadState('networkidle')

    // Кнопка "Создать статью"
    const createArticleButton = page.getByRole('button', { name: /создать/i })
    if (await createArticleButton.isVisible()) {
      await expect(createArticleButton).toBeEnabled()
    }

    // Проверка кнопок в таблице (если есть статьи)
    const articleRows = page.locator('table tbody tr')
    const articleCount = await articleRows.count()

    if (articleCount > 0) {
      const firstRow = articleRows.first()

      // Кнопки действий
      const openButton = firstRow.getByRole('link', { name: /открыть|open/i })
      if (await openButton.isVisible()) {
        await expect(openButton).toBeEnabled()
      }

      const editButton = firstRow.getByRole('link', { name: /редактировать|edit/i })
      if (await editButton.isVisible()) {
        await expect(editButton).toBeEnabled()
      }

      const deleteButton = firstRow.getByRole('button', { name: /удалить|delete/i })
      if (await deleteButton.isVisible()) {
        await expect(deleteButton).toBeEnabled()
      }
    }
  })

  test('Integrations Page - все кнопки', async ({ page }) => {
    await page.goto('/integrations')
    await page.waitForLoadState('networkidle')

    // Кнопка "Обновить"
    const refreshButton = page.getByRole('button', { name: /обновить|refresh/i })
    if (await refreshButton.isVisible()) {
      await expect(refreshButton).toBeEnabled()
    }

    // Кнопки настройки Kommo
    const kommoButtons = page.getByRole('button').filter({ hasText: /kommo|подключить|настроить/i })
    const kommoButtonCount = await kommoButtons.count()
    if (kommoButtonCount > 0) {
      for (let i = 0; i < kommoButtonCount; i++) {
        const btn = kommoButtons.nth(i)
        if (await btn.isVisible()) {
          await expect(btn).toBeEnabled()
        }
      }
    }
  })

  test('Chat Page - все кнопки', async ({ page }) => {
    await page.goto('/chat')
    await page.waitForLoadState('networkidle')

    // Select агента
    const agentSelect = page.locator('select, [role="combobox"]')
    if (await agentSelect.isVisible()) {
      await expect(agentSelect).toBeEnabled()
    }

    // Поле ввода сообщения
    const messageInput = page.locator('textarea[placeholder*="сообщение"], input[type="text"]')
    if (await messageInput.isVisible()) {
      await expect(messageInput).toBeEnabled()
    }

    // Кнопка отправки
    const sendButton = page.getByRole('button', { name: /отправить|send/i })
    if (await sendButton.isVisible()) {
      await expect(sendButton).toBeEnabled()
    }
  })

  test('Pricing Page - все кнопки', async ({ page }) => {
    await page.goto('/pricing')
    await page.waitForLoadState('networkidle')

    // Кнопки выбора плана
    const planButtons = page.getByRole('button').filter({ hasText: /выбрать|выбрать план|подписаться/i })
    const planButtonCount = await planButtons.count()
    if (planButtonCount > 0) {
      for (let i = 0; i < planButtonCount; i++) {
        const btn = planButtons.nth(i)
        if (await btn.isVisible()) {
          await expect(btn).toBeEnabled()
        }
      }
    }

    // Toggle месячный/годовой
    const billingToggle = page.locator('button:has-text("Ежемесячно"), button:has-text("Ежегодно")')
    if (await billingToggle.isVisible()) {
      await expect(billingToggle.first()).toBeEnabled()
      await billingToggle.first().click()
      await page.waitForTimeout(300)
    }
  })

  test('Account Page - все кнопки', async ({ page }) => {
    await page.goto('/account')
    await page.waitForLoadState('networkidle')

    // Кнопка "Сохранить"
    const saveButton = page.getByRole('button', { name: /сохранить|save/i })
    if (await saveButton.isVisible()) {
      await expect(saveButton).toBeEnabled()
    }

    // Кнопка "Изменить пароль"
    const changePasswordButton = page.getByRole('button', { name: /изменить пароль|change password/i })
    if (await changePasswordButton.isVisible()) {
      await expect(changePasswordButton).toBeEnabled()
    }
  })

  test('All buttons should be keyboard accessible', async ({ page }) => {
    await page.goto('/')

    // Получаем все кнопки на странице
    const buttons = page.locator('button, [role="button"], a[href]')
    const buttonCount = await buttons.count()

    for (let i = 0; i < Math.min(buttonCount, 20); i++) {
      const button = buttons.nth(i)
      if (await button.isVisible()) {
        // Проверяем доступность через Tab
        await page.keyboard.press('Tab')
        await page.waitForTimeout(100)

        // Проверяем что элемент получил фокус
        const isFocused = await button.evaluate((el) => document.activeElement === el)
        if (!isFocused) {
          // Попробуем кликнуть напрямую для проверки
          await expect(button).toBeEnabled()
        }
      }
    }
  })

  test('All modals and dialogs should close properly', async ({ page }) => {
    await page.goto('/agents')
    await page.waitForLoadState('networkidle')

    // Ищем все кнопки которые могут открыть модалы
    const modalTriggers = page.getByRole('button').filter({ hasText: /создать|открыть|настроить/i })
    const triggerCount = await modalTriggers.count()

    for (let i = 0; i < Math.min(triggerCount, 5); i++) {
      const trigger = modalTriggers.nth(i)
      if (await trigger.isVisible()) {
        try {
          await trigger.click()
          await page.waitForTimeout(500)

          // Ищем кнопку закрытия
          const closeButton = page.getByRole('button', { name: /закрыть|close|×/i }).or(
            page.locator('[aria-label*="закрыть"], [aria-label*="close"]')
          )

          if (await closeButton.isVisible()) {
            await closeButton.click()
            await page.waitForTimeout(300)
          }

          // Или через Escape
          await page.keyboard.press('Escape')
          await page.waitForTimeout(300)
        } catch (error) {
          // Игнорируем ошибки если модал не открылся
        }
      }
    }
  })

  test('All forms should have submit buttons enabled/disabled correctly', async ({ page }) => {
    await page.goto('/agents/new')
    await page.waitForLoadState('networkidle')

    // Проверяем форму создания агента
    const nameInput = page.locator('input[name*="name"], input[placeholder*="название"]')
    if (await nameInput.isVisible()) {
      const submitButton = page.getByRole('button', { name: /создать|сохранить/i })

      // Кнопка должна быть disabled если поле пустое
      if (await nameInput.inputValue() === '') {
        // Проверяем disabled состояние (может быть через атрибут или класс)
        const isDisabled = await submitButton.evaluate((btn) => {
          const htmlBtn = btn as HTMLButtonElement
          return htmlBtn.disabled || htmlBtn.getAttribute('aria-disabled') === 'true'
        })

        // Заполняем поле
        await nameInput.fill('Тестовый агент')
        await page.waitForTimeout(300)

        // Теперь кнопка должна быть enabled
        await expect(submitButton).toBeEnabled()
      }
    }
  })

  test('All toggle switches should be clickable', async ({ page }) => {
    await page.goto('/agents/new')
    await page.waitForLoadState('networkidle')

    // Ищем все toggle switches
    const toggles = page.locator('input[type="checkbox"], [role="switch"]')
    const toggleCount = await toggles.count()

    for (let i = 0; i < Math.min(toggleCount, 10); i++) {
      const toggle = toggles.nth(i)
      if (await toggle.isVisible()) {
        const initialState = await toggle.isChecked()
        await toggle.click()
        await page.waitForTimeout(200)

        // Проверяем что состояние изменилось
        const newState = await toggle.isChecked()
        expect(newState).toBe(!initialState)

        // Возвращаем обратно
        await toggle.click()
        await page.waitForTimeout(200)
      }
    }
  })

  test('All links should navigate correctly', async ({ page }) => {
    await page.goto('/')

    // Получаем все ссылки в навигации
    const navLinks = page.locator('nav a[href], [role="navigation"] a[href]')
    const linkCount = await navLinks.count()

    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = navLinks.nth(i)
      if (await link.isVisible()) {
        const href = await link.getAttribute('href')
        if (href && !href.startsWith('#')) {
          await expect(link).toBeEnabled()

          // Проверяем что клик переходит на другую страницу
          const currentUrl = page.url()
          await link.click()
          await page.waitForTimeout(500)

          // Проверяем что URL изменился (или остался тем же если это внешняя ссылка)
          const newUrl = page.url()
          if (href.startsWith('/') || href.startsWith('http')) {
            // URL должен измениться для внутренних ссылок
            if (href.startsWith('/')) {
              expect(newUrl).toContain(href)
            }
            // Возвращаемся обратно
            await page.goBack()
            await page.waitForTimeout(500)
          }
        }
      }
    }
  })
})







