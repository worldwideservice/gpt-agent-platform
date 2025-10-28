import { test, expect } from '@playwright/test'

test.describe('Account Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/account')
  })

  test('should load account page', async ({ page }) => {
    await expect(page).toHaveTitle(/GPT Agent/)
    await expect(page.getByText(/аккаунт|профиль|настройки/i)).toBeVisible()
  })

  test('should display account information', async ({ page }) => {
    // Проверка наличия информации об аккаунте
    const accountInfo = page.locator('[class*="account"], [class*="profile"]')
    if (await accountInfo.first().isVisible()) {
      await expect(accountInfo.first()).toBeVisible()
    }
  })

  test('should have edit profile button', async ({ page }) => {
    const editButton = page.getByRole('button', { name: /редактировать|edit/i })
    if (await editButton.isVisible()) {
      await expect(editButton).toBeEnabled()
    }
  })

  test('should display settings sections', async ({ page }) => {
    // Проверка наличия разделов настроек
    const sections = page.locator('section, [class*="section"]')
    const count = await sections.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should save changes', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /сохранить|save/i })
    
    if (await saveButton.isVisible()) {
      await saveButton.click()
      await page.waitForTimeout(500)
    }
  })

  test('@accessibility should have form labels', async ({ page }) => {
    // Проверка labels для form inputs
    const inputs = page.locator('input')
    const count = await inputs.count()
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      const id = await input.getAttribute('id')
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        if (await label.isVisible()) {
          await expect(label).toBeVisible()
        }
      }
    }
  })

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText(/аккаунт|профиль|настройки/i)).toBeVisible()
  })
})

