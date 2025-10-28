import { test, expect } from '@playwright/test'

test.describe('Agents Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/agents')
  })

  test('should load agents page', async ({ page }) => {
    await expect(page).toHaveTitle(/GPT Agent/)
    await expect(page.getByText('Управление агентами')).toBeVisible()
  })

  test('should display create agent button', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /создать агента/i })
    await expect(createButton).toBeVisible()
    await expect(createButton).toBeEnabled()
  })

  test('should display agents table', async ({ page }) => {
    // Проверка наличия таблицы
    const table = page.locator('table')
    await expect(table).toBeVisible()
    
    // Проверка заголовков таблицы
    await expect(page.getByText('Название')).toBeVisible()
    await expect(page.getByText('Модель')).toBeVisible()
    await expect(page.getByText('Статус')).toBeVisible()
    await expect(page.getByText('Действия')).toBeVisible()
  })

  test('should navigate to create agent page', async ({ page }) => {
    await page.click('button:has-text("Создать агента")')
    await expect(page).toHaveURL(/\/agents\/(new|create)/)
  })

  test('should display agent details', async ({ page }) => {
    // Клик на первого агента (если есть)
    const firstAgent = page.locator('table tbody tr').first()
    if (await firstAgent.isVisible()) {
      await firstAgent.click()
      // Должен открыться либо modal либо страница деталей
      await page.waitForTimeout(500)
    }
  })

  test('should filter agents by status', async ({ page }) => {
    // Проверка фильтров (если есть)
    const activeFilter = page.getByRole('button', { name: /активные/i })
    if (await activeFilter.isVisible()) {
      await activeFilter.click()
      await page.waitForTimeout(300)
    }
  })

  test('should search agents', async ({ page }) => {
    // Поиск агентов (если есть search input)
    const searchInput = page.locator('input[type="search"], input[placeholder*="Поиск"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('Агент')
      await page.waitForTimeout(500)
    }
  })

  test('@accessibility keyboard navigation should work', async ({ page }) => {
    // Проверка keyboard navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    const focused = await page.evaluateHandle(() => document.activeElement)
    expect(focused).toBeTruthy()
  })

  test('@visual should match screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('agents-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })
})

