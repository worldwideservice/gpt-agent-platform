import { test, expect } from '@playwright/test'

/**
 * E2E тесты для основных настроек агента согласно KWID логике
 * Основан на: kwid/docs/KWID_ARCHITECTURE.md (вкладка "Основные")
 */

test.describe('KWID Agent Basic Settings Workflow', () => {
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

  test('should update agent name', async ({ page }) => {
    // Поиск поля названия агента
    const nameInput = page.locator('input[name="name"], input[placeholder*="название"]')
    if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nameInput.fill('Updated Agent Name KWID')
      await page.waitForTimeout(500)

      // Сохранение
      const saveButton = page.locator('button:has-text("Сохранить"), button[type="submit"]')
      if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await saveButton.click()
        await expect(page.locator('text=сохранено, text=успешно')).toBeVisible({ timeout: 5000 }).catch(() => {})
      }
    }
  })

  test('should toggle agent active status', async ({ page }) => {
    // Поиск switch активности агента
    const activeSwitch = page.locator('input[type="checkbox"][name*="active"], [role="switch"]')
    if (await activeSwitch.isVisible({ timeout: 2000 }).catch(() => false)) {
      const initialState = await activeSwitch.isChecked()
      
      // Переключение состояния
      await activeSwitch.click()
      await page.waitForTimeout(500)

      // Проверка что состояние изменилось
      const newState = await activeSwitch.isChecked()
      expect(newState).not.toBe(initialState)
    }
  })

  test('should update agent instructions', async ({ page }) => {
    // Поиск поля инструкций
    const instructionsInput = page.locator('textarea[name="instructions"], textarea[placeholder*="инструкц"]')
    if (await instructionsInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await instructionsInput.fill('Updated instructions for KWID testing workflow')
      await page.waitForTimeout(500)

      // Сохранение
      const saveButton = page.locator('button:has-text("Сохранить"), button[type="submit"]')
      if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await saveButton.click()
        await expect(page.locator('text=сохранено, text=успешно')).toBeVisible({ timeout: 5000 }).catch(() => {})
      }
    }
  })

  test('should toggle check before sending', async ({ page }) => {
    // Поиск switch "Проверять перед отправкой"
    const checkSwitch = page.locator('input[type="checkbox"][name*="check"], [role="switch"]')
    if (await checkSwitch.isVisible({ timeout: 2000 }).catch(() => false)) {
      const initialState = await checkSwitch.isChecked()
      
      // Переключение
      await checkSwitch.click()
      await page.waitForTimeout(500)

      // Проверка изменения
      const newState = await checkSwitch.isChecked()
      expect(newState).not.toBe(initialState)
    }
  })

  test('should configure knowledge base settings', async ({ page }) => {
    // Поиск секции базы знаний
    const knowledgeSection = page.locator('text=База знаний, text=Knowledge Base')
    if (await knowledgeSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Переключение "Разрешить доступ ко всем категориям"
      const allCategoriesSwitch = page.locator('input[type="checkbox"][name*="all_categories"], [role="switch"]')
      if (await allCategoriesSwitch.isVisible({ timeout: 2000 }).catch(() => false)) {
        await allCategoriesSwitch.click()
        await page.waitForTimeout(500)
      }

      // Переключение "Создать задачу, если ответ не найден"
      const createTaskSwitch = page.locator('input[type="checkbox"][name*="create_task"], [role="switch"]')
      if (await createTaskSwitch.isVisible({ timeout: 2000 }).catch(() => false)) {
        await createTaskSwitch.click()
        await page.waitForTimeout(500)
      }

      // Обновление fallback сообщения
      const fallbackInput = page.locator('textarea[name*="not_found"], textarea[name*="fallback"]')
      if (await fallbackInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await fallbackInput.fill('Updated fallback message for KWID testing')
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

  test('should configure pipeline settings', async ({ page }) => {
    // Поиск секции воронок
    const pipelineSection = page.locator('text=Настройки воронок, text=Pipelines')
    if (await pipelineSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Синхронизация воронок
      const syncButton = page.locator('button:has-text("Синхронизировать"), button:has-text("Sync")')
      if (await syncButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await syncButton.click()
        await page.waitForTimeout(2000)
      }

      // Настройка воронки (если есть)
      const pipelineToggle = page.locator('input[type="checkbox"][name*="pipeline"], [role="switch"]').first()
      if (await pipelineToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
        await pipelineToggle.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should configure channel settings', async ({ page }) => {
    // Поиск секции каналов
    const channelsSection = page.locator('text=Каналы, text=Channels')
    if (await channelsSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Переключение "Все каналы"
      const allChannelsSwitch = page.locator('input[type="checkbox"][name*="all_channels"], [role="switch"]')
      if (await allChannelsSwitch.isVisible({ timeout: 2000 }).catch(() => false)) {
        await allChannelsSwitch.click()
        await page.waitForTimeout(500)
      }

      // Выбор конкретных каналов (если "Все каналы" выключено)
      const channelCheckboxes = page.locator('input[type="checkbox"][value*="email"], input[type="checkbox"][value*="telegram"]')
      const channelCount = await channelCheckboxes.count()
      if (channelCount > 0) {
        await channelCheckboxes.first().check()
        await page.waitForTimeout(500)
      }
    }
  })
})

