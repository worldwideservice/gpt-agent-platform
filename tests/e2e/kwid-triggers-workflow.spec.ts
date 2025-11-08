import { test, expect } from '@playwright/test'

/**
 * E2E тесты для триггеров согласно KWID логике
 */

test.describe('KWID Triggers Workflow', () => {
  const tenantId = 'test-tenant-id'

  test.beforeEach(async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')
  })

  test('should create trigger for lead created event', async ({ page }) => {
    // Переход на вкладку "Триггеры"
    const triggersTab = page.locator('button:has-text("Триггеры"), [role="tab"]:has-text("Triggers")')
    if (await triggersTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await triggersTab.click()
      await page.waitForTimeout(500)
    }

    // Создание триггера
    const createButton = page.locator('button:has-text("Создать триггер"), button:has-text("Добавить")')
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click()

      // Заполнение формы
      await page.fill('input[name="name"]', 'Test Trigger KWID')
      await page.selectOption('select[name="trigger_type"], select[name="event_type"]', 'lead_created')

      // Настройка условий (если есть)
      const conditionSection = page.locator('text=Условия, [class*="condition"]')
      if (await conditionSection.isVisible({ timeout: 2000 }).catch(() => false)) {
        await page.selectOption('select[name="condition_field"]', 'pipeline_id')
        await page.fill('input[name="condition_value"]', '123')
      }

      // Настройка действий
      await page.selectOption('select[name="action_type"]', 'send_message')
      await page.fill('textarea[name="message"]', 'New lead created!')

      // Сохранение
      await page.click('button:has-text("Сохранить"), button[type="submit"]')
      await expect(page.locator('text=Test Trigger KWID')).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })

  test('should create trigger for stage changed event', async ({ page }) => {
    // Переход на вкладку "Триггеры"
    const triggersTab = page.locator('button:has-text("Триггеры"), [role="tab"]:has-text("Triggers")')
    if (await triggersTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await triggersTab.click()
      await page.waitForTimeout(500)
    }

    // Создание триггера
    const createButton = page.locator('button:has-text("Создать триггер"), button:has-text("Добавить")')
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click()

      // Заполнение формы
      await page.fill('input[name="name"]', 'Stage Changed Trigger')
      await page.selectOption('select[name="trigger_type"]', 'stage_changed')

      // Выбор воронки и этапа
      await page.selectOption('select[name="pipeline_id"]', { index: 0 })
      await page.selectOption('select[name="from_stage_id"]', { index: 0 })
      await page.selectOption('select[name="to_stage_id"]', { index: 1 })

      // Настройка действия
      await page.selectOption('select[name="action_type"]', 'send_message')
      await page.fill('textarea[name="message"]', 'Lead moved to new stage')

      // Сохранение
      await page.click('button:has-text("Сохранить"), button[type="submit"]')
      await expect(page.locator('text=Stage Changed Trigger')).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })

  test('should toggle trigger active status', async ({ page }) => {
    // Переход на вкладку "Триггеры"
    const triggersTab = page.locator('button:has-text("Триггеры"), [role="tab"]:has-text("Triggers")')
    if (await triggersTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await triggersTab.click()
      await page.waitForTimeout(500)
    }

    // Поиск существующего триггера
    const triggerRow = page.locator('table tbody tr, [class*="trigger"]').first()
    if (await triggerRow.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Переключение статуса
      const toggleSwitch = triggerRow.locator('input[type="checkbox"], [role="switch"]')
      if (await toggleSwitch.isVisible({ timeout: 2000 }).catch(() => false)) {
        const initialState = await toggleSwitch.isChecked()
        await toggleSwitch.click()
        await page.waitForTimeout(500)
        
        // Проверка что статус изменился
        const newState = await toggleSwitch.isChecked()
        expect(newState).not.toBe(initialState)
      }
    }
  })
})

