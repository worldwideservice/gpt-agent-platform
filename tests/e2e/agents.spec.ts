/**
 * AI Agents E2E Tests
 * Tests for creating, editing, and managing AI agents
 */

import { test, expect } from './fixtures/auth.fixture'
import { generateRandomAgent } from './fixtures/test-data'

test.describe('AI Agents Management', () => {
  test('should display agents list page', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/ai-agents')

    // Check page title
    await expect(page.locator('h1, h2').filter({ hasText: /Агент|Agent/i }).first()).toBeVisible()

    // Check for agents list or empty state
    const agentsList = page.locator('[data-testid="agents-list"], .agents-grid, .agents-table')
    const emptyState = page.locator('text=/Нет агентов|No agents|Создайте|Create/i')

    await expect(agentsList.or(emptyState)).toBeVisible({ timeout: 5000 })
  })

  test('should open create agent form', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/ai-agents')

    // Click create button
    const createButton = page.locator('button, a').filter({
      hasText: /Создать|Create.*Agent|Новый|New/i,
    })
    await createButton.first().click()

    // Wait for form or modal
    await expect(
      page.locator('input[name="name"], input[placeholder*="Название"], input[placeholder*="Name"]')
    ).toBeVisible({ timeout: 5000 })
  })

  test('should create new agent with valid data', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/ai-agents')

    // Click create button
    const createButton = page.locator('button, a').filter({
      hasText: /Создать|Create.*Agent|Новый|New/i,
    })
    await createButton.first().click()

    const agentData = generateRandomAgent()

    // Fill form
    await page.fill('input[name="name"]', agentData.name)

    // Fill description if visible
    const descInput = page.locator('textarea[name="description"], input[name="description"]')
    if (await descInput.isVisible()) {
      await descInput.fill(agentData.description)
    }

    // Select model if available
    const modelSelect = page.locator('select[name="model"], [data-testid="model-select"]')
    if (await modelSelect.isVisible()) {
      await modelSelect.selectOption(agentData.model)
    }

    // Fill system prompt if available
    const promptInput = page.locator('textarea[name="systemPrompt"], textarea[name="system_prompt"]')
    if (await promptInput.isVisible()) {
      await promptInput.fill(agentData.systemPrompt)
    }

    // Submit form
    await page.click('button[type="submit"], button:has-text("Создать"), button:has-text("Create")')

    // Wait for success message or redirect
    await expect(
      page.locator('text=/Успешно|Success|создан|created/i').or(page.locator('[role="alert"]'))
    ).toBeVisible({ timeout: 10000 })
  })

  test('should validate required fields', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/ai-agents')

    // Open create form
    const createButton = page.locator('button, a').filter({
      hasText: /Создать|Create.*Agent|Новый|New/i,
    })
    await createButton.first().click()

    // Try to submit without filling required fields
    await page.click('button[type="submit"], button:has-text("Создать"), button:has-text("Create")')

    // Should show validation errors
    await expect(page.locator('text=/обязательн|required|заполните|fill/i')).toBeVisible({
      timeout: 3000,
    })
  })

  test('should edit existing agent', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/ai-agents')

    // Find first agent edit button
    const editButton = page
      .locator('button, a')
      .filter({ hasText: /Изменить|Edit|Редактировать/ })
      .first()

    if (await editButton.isVisible({ timeout: 3000 })) {
      await editButton.click()

      // Wait for edit form
      const nameInput = page.locator('input[name="name"]')
      await expect(nameInput).toBeVisible()

      // Modify agent name
      await nameInput.fill('Updated Agent Name')

      // Save changes
      await page.click('button[type="submit"], button:has-text("Сохранить"), button:has-text("Save")')

      // Wait for success
      await expect(page.locator('text=/Успешно|Success|обновлен|updated/i')).toBeVisible({
        timeout: 10000,
      })
    }
  })

  test('should delete agent with confirmation', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/ai-agents')

    // Find delete button
    const deleteButton = page
      .locator('button, a')
      .filter({ hasText: /Удалить|Delete/ })
      .first()

    if (await deleteButton.isVisible({ timeout: 3000 })) {
      await deleteButton.click()

      // Confirm deletion in modal
      const confirmButton = page
        .locator('button')
        .filter({ hasText: /Подтвердить|Confirm|Удалить|Delete/ })
        .last()

      if (await confirmButton.isVisible({ timeout: 3000 })) {
        await confirmButton.click()

        // Wait for success message
        await expect(page.locator('text=/Успешно|Success|удален|deleted/i')).toBeVisible({
          timeout: 5000,
        })
      }
    }
  })

  test('should toggle agent status', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/ai-agents')

    // Find status toggle
    const statusToggle = page.locator('button[role="switch"], input[type="checkbox"][name*="status"]').first()

    if (await statusToggle.isVisible({ timeout: 3000 })) {
      const initialState = await statusToggle.getAttribute('aria-checked')

      // Toggle status
      await statusToggle.click()

      // Verify state changed
      await expect(statusToggle).not.toHaveAttribute('aria-checked', initialState!)
    }
  })

  test('should navigate to agent details', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/ai-agents')

    // Find first agent link
    const agentLink = page
      .locator('a[href*="/ai-agents/"], button')
      .filter({ hasText: /Просмотр|View|Открыть/ })
      .first()

    if (await agentLink.isVisible({ timeout: 3000 })) {
      await agentLink.click()

      // Should navigate to agent details page
      await expect(page).toHaveURL(/\/ai-agents\/[a-f0-9-]+/)

      // Check for agent details
      await expect(page.locator('h1, h2').first()).toBeVisible()
    }
  })
})
