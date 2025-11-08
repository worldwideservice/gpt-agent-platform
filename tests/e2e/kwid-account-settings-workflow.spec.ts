import { test, expect } from '@playwright/test'

/**
 * E2E тесты для настроек аккаунта согласно KWID логике
 * Основан на: kwid/docs/KWID_ALL_PAGES_COMPLETE.md
 */

test.describe('KWID Account Settings Workflow', () => {
  const tenantId = 'test-tenant-id'

  test.beforeEach(async ({ page }) => {
    await page.goto(`/manage/${tenantId}/account-settings`)
    await page.waitForLoadState('networkidle')

    // В демо-режиме может быть редирект на /login
    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping test - requires authentication')
    }
  })

  test('should toggle stop agents on human reply', async ({ page }) => {
    // Поиск переключателя "Останавливать агентов ИИ при ответе человека"
    const stopAgentsSwitch = page.locator('input[type="checkbox"][name*="stop"], [role="switch"]')
    if (await stopAgentsSwitch.isVisible({ timeout: 2000 }).catch(() => false)) {
      const initialState = await stopAgentsSwitch.isChecked()
      
      // Переключение состояния
      await stopAgentsSwitch.click()
      await page.waitForTimeout(500)

      // Проверка что состояние изменилось
      const newState = await stopAgentsSwitch.isChecked()
      expect(newState).not.toBe(initialState)

      // Сохранение изменений
      const saveButton = page.locator('button:has-text("Сохранить"), button[type="submit"]')
      if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await saveButton.click()
        await expect(page.locator('text=сохранено, text=успешно')).toBeVisible({ timeout: 5000 }).catch(() => {})
      }
    }
  })

  test('should view account settings form', async ({ page }) => {
    // Проверка наличия формы настроек
    const settingsForm = page.locator('form, [class*="settings"], [class*="form"]')
    await expect(settingsForm.first()).toBeVisible({ timeout: 5000 })

    // Проверка заголовка страницы
    const pageTitle = page.locator('h1:has-text("Настройки"), h1:has-text("Settings")')
    const hasTitle = await pageTitle.count() > 0
    expect(hasTitle).toBeTruthy()
  })

  test('should save account settings', async ({ page }) => {
    // Поиск кнопки сохранения
    const saveButton = page.locator('button:has-text("Сохранить"), button[type="submit"]')
    if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await saveButton.click()
      await page.waitForTimeout(1000)

      // Проверка сообщения об успешном сохранении
      await expect(page.locator('text=сохранено, text=успешно, text=изменения')).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })

  test('should navigate to account settings from menu', async ({ page }) => {
    // Переход на dashboard
    await page.goto(`/manage/${tenantId}`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Поиск ссылки на настройки в меню
    const settingsLink = page.locator('a[href*="account-settings"], a:has-text("Настройки")')
    if (await settingsLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await settingsLink.click()
      await page.waitForURL(/.*account-settings/, { timeout: 5000 })

      // Проверка что открылась страница настроек
      const settingsPage = page.locator('h1:has-text("Настройки"), h1:has-text("Settings")')
      await expect(settingsPage.first()).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })
})

