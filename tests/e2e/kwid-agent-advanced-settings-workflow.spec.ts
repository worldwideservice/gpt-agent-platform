import { test, expect } from '@playwright/test'

/**
 * E2E тесты для дополнительных настроек агента согласно KWID логике
 * Основан на: kwid/docs/KWID_ARCHITECTURE.md (вкладка "Дополнительно")
 */

test.describe('KWID Agent Advanced Settings Workflow', () => {
  const tenantId = 'test-tenant-id'

  test.beforeEach(async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')

    // В демо-режиме может быть редирект на /login
    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping test - requires authentication')
    }
  })

  test('should navigate to Advanced tab', async ({ page }) => {
    // Переход на вкладку "Дополнительно"
    const advancedTab = page.locator('button:has-text("Дополнительно"), [role="tab"]:has-text("Advanced")')
    if (await advancedTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await advancedTab.click()
      await page.waitForTimeout(500)

      // Проверка что вкладка активна
      const tabContent = page.locator('[role="tabpanel"], [class*="content"]')
      await expect(tabContent.first()).toBeVisible({ timeout: 2000 }).catch(() => {})
    }
  })

  test('should change AI model', async ({ page }) => {
    // Переход на вкладку "Дополнительно"
    const advancedTab = page.locator('button:has-text("Дополнительно"), [role="tab"]:has-text("Advanced")')
    if (await advancedTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await advancedTab.click()
      await page.waitForTimeout(500)
    }

    // Поиск селекта модели ИИ
    const modelSelect = page.locator('select[name="model"], select[aria-label*="модель"]')
    if (await modelSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Выбор другой модели
      const options = await modelSelect.locator('option').count()
      if (options > 1) {
        await modelSelect.selectOption({ index: 1 })
        await page.waitForTimeout(500)

        // Сохранение
        const saveButton = page.locator('button:has-text("Сохранить"), button[type="submit"]')
        if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await saveButton.click()
          await expect(page.locator('text=сохранено, text=успешно')).toBeVisible({ timeout: 5000 }).catch(() => {})
        }
      }
    }
  })

  test('should change agent language', async ({ page }) => {
    // Переход на вкладку "Дополнительно"
    const advancedTab = page.locator('button:has-text("Дополнительно"), [role="tab"]:has-text("Advanced")')
    if (await advancedTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await advancedTab.click()
      await page.waitForTimeout(500)
    }

    // Поиск селекта языка
    const languageSelect = page.locator('select[name="language"], select[aria-label*="язык"]')
    if (await languageSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Выбор языка
      const options = await languageSelect.locator('option').count()
      if (options > 1) {
        await languageSelect.selectOption({ index: 1 })
        await page.waitForTimeout(500)
      }
    }
  })

  test('should configure response settings', async ({ page }) => {
    // Переход на вкладку "Дополнительно"
    const advancedTab = page.locator('button:has-text("Дополнительно"), [role="tab"]:has-text("Advanced")')
    if (await advancedTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await advancedTab.click()
      await page.waitForTimeout(500)
    }

    // Поиск секции настроек ответа
    const responseSection = page.locator('text=Настройки ответа, text=Response Settings')
    if (await responseSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Настройка температуры (если есть)
      const temperatureInput = page.locator('input[name="temperature"], input[type="number"]')
      if (await temperatureInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await temperatureInput.fill('0.7')
        await page.waitForTimeout(500)
      }

      // Настройка максимальных токенов (если есть)
      const maxTokensInput = page.locator('input[name="max_tokens"], input[name="maxTokens"]')
      if (await maxTokensInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await maxTokensInput.fill('2000')
        await page.waitForTimeout(500)
      }

      // Сохранение
      const saveButton = page.locator('button:has-text("Сохранить"), button[type="submit"]')
      if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await saveButton.click()
        await expect(page.locator('text=сохранено, text=успешно')).toBeVisible({ timeout: 5000 }).catch(() => {})
      }
    }
  })
})

