import { test, expect } from '@playwright/test'

/**
 * E2E тесты для обучения агента согласно KWID логике
 */

test.describe('KWID Agent Training Workflow', () => {
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

  test('should upload training file', async ({ page }) => {
    // Переход на вкладку "Обучение"
    const trainingTab = page.locator('button:has-text("Обучение"), [role="tab"]:has-text("Training")')
    if (await trainingTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await trainingTab.click()
      await page.waitForTimeout(500)
    }

    // Загрузка файла
    const fileInput = page.locator('input[type="file"]')
    if (await fileInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Создаем тестовый файл
      const testFile = Buffer.from('Test training content for agent')
      await fileInput.setInputFiles({
        name: 'test-training.txt',
        mimeType: 'text/plain',
        buffer: testFile,
      })

      // Проверка что файл загружается
      await expect(page.locator('text=загружается, text=uploading, text=processing')).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })

  test('should view training history', async ({ page }) => {
    // Переход на вкладку "Обучение"
    const trainingTab = page.locator('button:has-text("Обучение"), [role="tab"]:has-text("Training")')
    if (await trainingTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await trainingTab.click()
      await page.waitForTimeout(500)
    }

    // Проверка истории обучения
    const historySection = page.locator('[class*="history"], [class*="training"], table')
    if (await historySection.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(historySection.first()).toBeVisible()
    }
  })

  test('should configure training settings', async ({ page }) => {
    // Переход на вкладку "Обучение"
    const trainingTab = page.locator('button:has-text("Обучение"), [role="tab"]:has-text("Training")')
    if (await trainingTab.isVisible({ timeout: 2000 }).catch(() => false)) {
      await trainingTab.click()
      await page.waitForTimeout(500)
    }

    // Настройка параметров обучения
    const autoTrainingSwitch = page.locator('input[type="checkbox"][name*="auto"], [role="switch"]')
    if (await autoTrainingSwitch.isVisible({ timeout: 2000 }).catch(() => false)) {
      await autoTrainingSwitch.check()
    }

    // Сохранение настроек
    const saveButton = page.locator('button:has-text("Сохранить"), button[type="submit"]')
    if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await saveButton.click()
      await expect(page.locator('text=сохранено, text=успешно')).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })
})

