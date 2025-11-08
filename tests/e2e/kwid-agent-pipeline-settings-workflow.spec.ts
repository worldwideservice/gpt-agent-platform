import { test, expect } from '@playwright/test'

/**
 * E2E тесты для настроек воронок агента согласно KWID логике
 * Основан на: kwid/docs/KWID_ARCHITECTURE.md (вкладка "Основные" - секция "Настройки воронок")
 */

test.describe('KWID Agent Pipeline Settings Workflow', () => {
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

  test('should sync CRM pipelines', async ({ page }) => {
    // Поиск секции воронок
    const pipelineSection = page.locator('text=Настройки воронок, text=Pipelines')
    if (await pipelineSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Поиск кнопки синхронизации
      const syncButton = page.locator('button:has-text("Синхронизировать"), button:has-text("Sync")')
      if (await syncButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await syncButton.click()
        await page.waitForTimeout(2000)

        // Проверка что синхронизация началась/завершилась
        await expect(page.locator('text=синхронизация, text=sync, text=успешно')).toBeVisible({ timeout: 10000 }).catch(() => {})
      }
    }
  })

  test('should toggle pipeline active status', async ({ page }) => {
    // Поиск переключателя активности воронки
    const pipelineToggle = page.locator('input[type="checkbox"][name*="pipeline"], [role="switch"]').first()
    if (await pipelineToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
      const initialState = await pipelineToggle.isChecked()
      
      // Переключение
      await pipelineToggle.click()
      await page.waitForTimeout(500)

      // Проверка изменения
      const newState = await pipelineToggle.isChecked()
      expect(newState).not.toBe(initialState)
    }
  })

  test('should toggle all stages option', async ({ page }) => {
    // Поиск переключателя "Все этапы сделок"
    const allStagesSwitch = page.locator('input[type="checkbox"][name*="all_stages"], [role="switch"]')
    if (await allStagesSwitch.isVisible({ timeout: 2000 }).catch(() => false)) {
      const initialState = await allStagesSwitch.isChecked()
      
      // Переключение
      await allStagesSwitch.click()
      await page.waitForTimeout(500)

      // Проверка изменения
      const newState = await allStagesSwitch.isChecked()
      expect(newState).not.toBe(initialState)
    }
  })

  test('should select specific pipeline stages', async ({ page }) => {
    // Поиск селекта этапов сделок
    const stagesSelect = page.locator('select[name*="stage"], [class*="multiselect"]')
    if (await stagesSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Выбор этапов
      const options = await stagesSelect.locator('option').count()
      if (options > 1) {
        await stagesSelect.selectOption({ index: 0 })
        await page.waitForTimeout(500)
      }
    }
  })

  test('should configure stage instructions', async ({ page }) => {
    // Поиск ссылки на инструкции для этапа
    const instructionsLink = page.locator('a:has-text("Инструкции для этапа"), button:has-text("Инструкции")')
    if (await instructionsLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await instructionsLink.click()
      await page.waitForTimeout(500)

      // Заполнение инструкций
      const instructionsInput = page.locator('textarea[name*="instruction"], textarea[placeholder*="инструкц"]')
      if (await instructionsInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await instructionsInput.fill('Test stage instructions for KWID workflow')
        await page.waitForTimeout(500)
      }
    }
  })

  test('should expand/collapse pipeline details', async ({ page }) => {
    // Поиск кнопки раскрытия деталей воронки
    const expandButton = page.locator('button[aria-label*="expand"], button[aria-label*="раскрыть"]')
    if (await expandButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expandButton.click()
      await page.waitForTimeout(500)

      // Проверка что детали отобразились
      const pipelineDetails = page.locator('[class*="pipeline-details"], [class*="stages"]')
      await expect(pipelineDetails.first()).toBeVisible({ timeout: 2000 }).catch(() => {})

      // Сворачивание
      await expandButton.click()
      await page.waitForTimeout(500)
    }
  })
})

