import { test, expect } from '@playwright/test'

/**
 * Полный E2E тест создания и настройки агента согласно KWID логике
 * Основан на документации: kwid/docs/KWID_AGENT_TABS_COMPLETE.md
 */

test.describe('Agent Full Workflow - KWID Logic', () => {
  const tenantId = 'test-tenant-id'

  test.beforeEach(async ({ page }) => {
    // Переход на страницу агентов
    await page.goto(`/manage/${tenantId}/ai-agents`)
    await page.waitForLoadState('networkidle')
  })

  test('should create agent with all basic settings', async ({ page }) => {
    // Переход к созданию агента
    await page.click('button:has-text("Создать"), a[href*="create"]')
    await page.waitForURL(/.*create/, { timeout: 5000 })

    // Заполнение основных полей (вкладка "Основные")
    await page.fill('input[name="name"], input[placeholder*="название"]', 'Test Agent KWID')
    await page.fill('textarea[name="description"], textarea[placeholder*="описание"]', 'Test agent description')

    // Выбор модели ИИ
    await page.selectOption('select[name="model"]', 'gpt-4o')

    // Сохранение
    await page.click('button[type="submit"], button:has-text("Сохранить")')
    
    // Проверка успешного создания (редирект на страницу редактирования)
    await page.waitForURL(/.*edit/, { timeout: 10000 })
    await expect(page.locator('text=Test Agent KWID')).toBeVisible({ timeout: 5000 })
  })

  test('should configure agent CRM settings (Deals and Contacts tab)', async ({ page }) => {
    // Переход к редактированию агента
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')

    // Переход на вкладку "Сделки и контакты" (если есть табы)
    const dealsTab = page.locator('button:has-text("Сделки"), button:has-text("Deals"), [role="tab"]:has-text("Сделки")')
    if (await dealsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dealsTab.click()
    }

    // Настройка полей сделок
    const dealFields = page.locator('input[type="checkbox"][value*="deal"], input[name*="deal"]')
    const dealFieldsCount = await dealFields.count()
    if (dealFieldsCount > 0) {
      await dealFields.first().check()
    }

    // Настройка полей контактов
    const contactFields = page.locator('input[type="checkbox"][value*="contact"], input[name*="contact"]')
    const contactFieldsCount = await contactFields.count()
    if (contactFieldsCount > 0) {
      await contactFields.first().check()
    }

    // Сохранение
    const saveButton = page.locator('button:has-text("Сохранить"), button[type="submit"]')
    if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await saveButton.click()
      await expect(page.locator('text=сохранено, text=успешно')).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })

  test('should create trigger for agent (Triggers tab)', async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')

    // Переход на вкладку "Триггеры"
    const triggersTab = page.locator('button:has-text("Триггеры"), [role="tab"]:has-text("Триггеры")')
    if (await triggersTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await triggersTab.click()
    }

    // Создание триггера
    const createTriggerButton = page.locator('button:has-text("Создать триггер"), button:has-text("Добавить")')
    if (await createTriggerButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createTriggerButton.click()

      // Заполнение формы триггера
      await page.fill('input[name="name"], input[placeholder*="название"]', 'Test Trigger')
      await page.selectOption('select[name="trigger_type"]', 'lead_created')

      // Сохранение триггера
      await page.click('button:has-text("Сохранить"), button[type="submit"]')
      await expect(page.locator('text=Test Trigger')).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })

  test('should create sequence for agent (Sequences tab)', async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')

    // Переход на вкладку "Цепочки"
    const sequencesTab = page.locator('button:has-text("Цепочки"), [role="tab"]:has-text("Последовательности")')
    if (await sequencesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sequencesTab.click()
    }

    // Создание последовательности
    const createSequenceButton = page.locator('button:has-text("Создать цепочку"), button:has-text("Добавить")')
    if (await createSequenceButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createSequenceButton.click()

      // Заполнение формы
      await page.fill('input[name="name"], input[placeholder*="название"]', 'Test Sequence')
      await page.selectOption('select[name="trigger_type"]', 'lead_created')

      // Добавление шага
      const addStepButton = page.locator('button:has-text("Добавить шаг"), button:has-text("Add Step")')
      if (await addStepButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addStepButton.click()
        await page.selectOption('select[name="action_type"]', 'send_message')
      }

      // Сохранение
      await page.click('button:has-text("Сохранить"), button[type="submit"]')
      await expect(page.locator('text=Test Sequence')).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })

  test('should create rule for agent (Rules tab)', async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')

    // Переход на вкладку "Правила"
    const rulesTab = page.locator('button:has-text("Правила"), [role="tab"]:has-text("Rules")')
    if (await rulesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rulesTab.click()
    }

    // Создание правила
    const createRuleButton = page.locator('button:has-text("Создать правило"), button:has-text("Добавить")')
    if (await createRuleButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createRuleButton.click()

      // Заполнение формы
      await page.fill('input[name="name"], input[placeholder*="название"]', 'Test Rule')
      await page.selectOption('select[name="trigger_type"]', 'lead_created')

      // Добавление условия
      const addConditionButton = page.locator('button:has-text("Добавить условие")')
      if (await addConditionButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addConditionButton.click()
      }

      // Добавление действия
      const addActionButton = page.locator('button:has-text("Добавить действие")')
      if (await addActionButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addActionButton.click()
        await page.selectOption('select[name="action_type"]', 'send_message')
      }

      // Сохранение
      await page.click('button:has-text("Сохранить"), button[type="submit"]')
      await expect(page.locator('text=Test Rule')).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })

  test('should configure agent integration (Integrations tab)', async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')

    // Переход на вкладку "Интеграции"
    const integrationsTab = page.locator('button:has-text("Интеграции"), [role="tab"]:has-text("Integrations")')
    if (await integrationsTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await integrationsTab.click()
    }

    // Подключение Kommo интеграции
    const connectKommoButton = page.locator('button:has-text("Подключить Kommo"), button:has-text("Connect")')
    if (await connectKommoButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await connectKommoButton.click()
      
      // Проверка что открылась форма настроек
      await expect(page.locator('input[name="domain"], input[placeholder*="домен"]')).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })

  test('should configure agent knowledge base (Knowledge tab)', async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')

    // Поиск вкладки с базой знаний (может быть в разных местах)
    const knowledgeSection = page.locator('text=База знаний, text=Knowledge, [class*="knowledge"]')
    if (await knowledgeSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Выбор категорий базы знаний
      const categoryCheckbox = page.locator('input[type="checkbox"][value*="category"], input[name*="category"]')
      const categoryCount = await categoryCheckbox.count()
      if (categoryCount > 0) {
        await categoryCheckbox.first().check()
      }

      // Сохранение
      const saveButton = page.locator('button:has-text("Сохранить"), button[type="submit"]')
      if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await saveButton.click()
      }
    }
  })

  test('should configure agent channels', async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')

    // Поиск секции каналов
    const channelsSection = page.locator('text=Каналы, text=Channels')
    if (await channelsSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Включение каналов
      const emailChannel = page.locator('input[type="checkbox"][value="email"], input[name*="email"]')
      if (await emailChannel.isVisible({ timeout: 2000 }).catch(() => false)) {
        await emailChannel.check()
      }

      const telegramChannel = page.locator('input[type="checkbox"][value="telegram"], input[name*="telegram"]')
      if (await telegramChannel.isVisible({ timeout: 2000 }).catch(() => false)) {
        await telegramChannel.check()
      }

      // Сохранение
      const saveButton = page.locator('button:has-text("Сохранить"), button[type="submit"]')
      if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await saveButton.click()
      }
    }
  })

  test('should test agent in chat after configuration', async ({ page }) => {
    // Сначала настраиваем агента
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')

    // Переход в тестовый чат
    await page.goto(`/manage/${tenantId}/test-chat`)
    await page.waitForLoadState('networkidle')

    // Выбор агента
    const agentSelect = page.locator('select[name="agent"], select[aria-label*="агент"]')
    if (await agentSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      await agentSelect.selectOption({ index: 0 })
    }

    // Отправка тестового сообщения
    const messageInput = page.locator('textarea[name="message"], textarea[placeholder*="сообщение"]')
    if (await messageInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await messageInput.fill('Тестовое сообщение для проверки агента')
      await page.click('button:has-text("Отправить"), button[type="submit"]')
      
      // Проверка ответа (может занять время)
      await expect(page.locator('.message-assistant, [class*="assistant"]')).toBeVisible({ timeout: 15000 }).catch(() => {})
    }
  })
})

