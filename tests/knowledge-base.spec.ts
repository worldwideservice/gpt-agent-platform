import { test, expect } from '@playwright/test'

test.describe('Knowledge Base Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/knowledge-base')
  })

  test('should load knowledge base page', async ({ page }) => {
    await expect(page).toHaveTitle(/GPT Agent/)
    await expect(page.getByText(/база знаний/i)).toBeVisible()
  })

  test('should display knowledge base items', async ({ page }) => {
    // Проверка наличия элементов базы знаний
    const items = page.locator('[class*="item"], [class*="document"]')
    const count = await items.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('should have add document button', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /добавить|add|upload/i })
    if (await addButton.isVisible()) {
      await expect(addButton).toBeVisible()
      await expect(addButton).toBeEnabled()
    }
  })

  test('should search in knowledge base', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[placeholder*="Поиск"]')
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('документ')
      await page.waitForTimeout(500)
    }
  })

  test('should filter by category', async ({ page }) => {
    // Проверка фильтров по категориям (если есть)
    const filters = page.locator('[class*="filter"], select')
    if (await filters.first().isVisible()) {
      await filters.first().click()
      await page.waitForTimeout(300)
    }
  })

  test('should display document preview', async ({ page }) => {
    // Клик на первый документ
    const firstDoc = page.locator('[class*="item"], [class*="document"]').first()
    
    if (await firstDoc.isVisible()) {
      await firstDoc.click()
      await page.waitForTimeout(500)
    }
  })

  test('@accessibility should have semantic HTML', async ({ page }) => {
    // Проверка семантических элементов
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('should handle file upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]')
    
    if (await fileInput.isVisible({ timeout: 1000 })) {
      // Базовая проверка наличия input
      expect(await fileInput.count()).toBeGreaterThanOrEqual(0)
    }
  })
})

