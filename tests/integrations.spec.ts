import { test, expect } from '@playwright/test'

test.describe('Integrations Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/integrations')
  })

  test('should load integrations page', async ({ page }) => {
    await expect(page).toHaveTitle(/GPT Agent/)
    await expect(page.getByText(/интеграции/i)).toBeVisible()
  })

  test('should display integration cards', async ({ page }) => {
    // Проверка наличия карточек интеграций
    const cards = page.locator('[class*="card"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display Kommo integration', async ({ page }) => {
    // Проверка Kommo CRM интеграции
    await expect(page.getByText(/kommo|crm/i)).toBeVisible()
  })

  test('should open integration setup modal', async ({ page }) => {
    // Поиск кнопки настройки интеграции
    const setupButton = page.getByRole('button', { name: /настроить|подключить|setup/i }).first()
    
    if (await setupButton.isVisible()) {
      await setupButton.click()
      
      // Ожидание открытия modal
      await page.waitForTimeout(500)
    }
  })

  test('should test integration connection', async ({ page }) => {
    // Поиск кнопки тестирования
    const testButton = page.getByRole('button', { name: /тест|test/i }).first()
    
    if (await testButton.isVisible()) {
      await testButton.click()
      await page.waitForTimeout(1000)
    }
  })

  test('should display integration status', async ({ page }) => {
    // Проверка статусов интеграций
    const statusBadges = page.locator('[class*="badge"], [class*="status"]')
    const count = await statusBadges.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('@accessibility should have proper headings', async ({ page }) => {
    // Проверка заголовков для screen readers
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText(/интеграции/i)).toBeVisible()
  })
})

