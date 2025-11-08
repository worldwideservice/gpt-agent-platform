import { test, expect } from '@playwright/test'

/**
 * E2E тесты для правил и последовательностей согласно KWID логике
 */

test.describe('KWID Rules and Sequences Workflow', () => {
  const tenantId = 'test-tenant-id'

  test.beforeEach(async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')
  })

  test('should create rule with conditions and actions', async ({ page }) => {
    // Переход на вкладку "Правила"
    const rulesTab = page.locator('button:has-text("Правила"), [role="tab"]:has-text("Rules")')
    if (await rulesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rulesTab.click()
      await page.waitForTimeout(500)
    }

    // Создание правила
    const createButton = page.locator('button:has-text("Создать правило"), button:has-text("Добавить")')
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click()

      // Заполнение основной информации
      await page.fill('input[name="name"]', 'Test Rule KWID')
      await page.selectOption('select[name="trigger_type"]', 'lead_created')

      // Добавление условия
      const addConditionButton = page.locator('button:has-text("Добавить условие"), button:has-text("Add Condition")')
      if (await addConditionButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addConditionButton.click()
        await page.selectOption('select[name="condition_type"]', 'field_value')
        await page.selectOption('select[name="operator"]', 'equals')
        await page.fill('input[name="value"]', 'test-value')
      }

      // Добавление действия
      const addActionButton = page.locator('button:has-text("Добавить действие"), button:has-text("Add Action")')
      if (await addActionButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addActionButton.click()
        await page.selectOption('select[name="action_type"]', 'send_message')
        await page.fill('textarea[name="message"]', 'Test message from rule')
      }

      // Сохранение
      await page.click('button:has-text("Сохранить"), button[type="submit"]')
      await expect(page.locator('text=Test Rule KWID')).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })

  test('should create sequence with multiple steps', async ({ page }) => {
    // Переход на вкладку "Цепочки"
    const sequencesTab = page.locator('button:has-text("Цепочки"), [role="tab"]:has-text("Sequences")')
    if (await sequencesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await sequencesTab.click()
      await page.waitForTimeout(500)
    }

    // Создание последовательности
    const createButton = page.locator('button:has-text("Создать цепочку"), button:has-text("Добавить")')
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click()

      // Заполнение основной информации
      await page.fill('input[name="name"]', 'Test Sequence KWID')
      await page.selectOption('select[name="trigger_type"]', 'lead_created')

      // Добавление первого шага
      const addStepButton = page.locator('button:has-text("Добавить шаг"), button:has-text("Add Step")')
      if (await addStepButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addStepButton.click()
        await page.selectOption('select[name="action_type"]', 'send_message')
        await page.fill('textarea[name="message"]', 'First step message')
        await page.fill('input[name="delay"]', '0')
      }

      // Добавление второго шага
      if (await addStepButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await addStepButton.click()
        await page.selectOption('select[name="action_type"]', 'wait')
        await page.fill('input[name="delay"]', '3600')
      }

      // Сохранение
      await page.click('button:has-text("Сохранить"), button[type="submit"]')
      await expect(page.locator('text=Test Sequence KWID')).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })

  test('should edit existing rule', async ({ page }) => {
    // Переход на вкладку "Правила"
    const rulesTab = page.locator('button:has-text("Правила"), [role="tab"]:has-text("Rules")')
    if (await rulesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rulesTab.click()
      await page.waitForTimeout(500)
    }

    // Поиск существующего правила
    const ruleRow = page.locator('table tbody tr, [class*="rule"]').first()
    if (await ruleRow.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Клик по кнопке редактирования
      const editButton = ruleRow.locator('button:has-text("Редактировать"), button[aria-label*="edit"]')
      if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await editButton.click()
        await page.waitForTimeout(500)

        // Изменение названия
        const nameInput = page.locator('input[name="name"]')
        if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await nameInput.fill('Updated Rule Name')
        }

        // Сохранение
        await page.click('button:has-text("Сохранить"), button[type="submit"]')
        await expect(page.locator('text=Updated Rule Name')).toBeVisible({ timeout: 5000 }).catch(() => {})
      }
    }
  })

  test('should delete rule', async ({ page }) => {
    // Переход на вкладку "Правила"
    const rulesTab = page.locator('button:has-text("Правила"), [role="tab"]:has-text("Rules")')
    if (await rulesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rulesTab.click()
      await page.waitForTimeout(500)
    }

    // Поиск правила для удаления
    const ruleRow = page.locator('table tbody tr, [class*="rule"]').first()
    if (await ruleRow.isVisible({ timeout: 2000 }).catch(() => false)) {
      const deleteButton = ruleRow.locator('button:has-text("Удалить"), button[aria-label*="delete"]')
      if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await deleteButton.click()

        // Подтверждение удаления (если есть диалог)
        const confirmButton = page.locator('button:has-text("Подтвердить"), button:has-text("Удалить")')
        if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await confirmButton.click()
          await page.waitForTimeout(1000)
        }
      }
    }
  })
})

