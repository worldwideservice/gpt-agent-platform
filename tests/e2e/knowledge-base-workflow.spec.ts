import { test, expect } from '@playwright/test'

test.describe('Knowledge Base Workflow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should create a new knowledge category', async ({ page }) => {
    await page.goto('/manage/test-tenant/knowledge-categories/create')
    
    // Заполнение формы
    await page.fill('input[name="title"]', 'Test Category')
    await page.fill('textarea[name="description"]', 'Test category description')
    
    // Сохранение
    await page.click('button[type="submit"]')
    
    // Проверка создания
    await expect(page.locator('text=Category created successfully')).toBeVisible({ timeout: 10000 })
  })

  test('should create a new knowledge article', async ({ page }) => {
    await page.goto('/manage/test-tenant/knowledge-items/create')
    
    // Заполнение формы
    await page.fill('input[name="title"]', 'Test Article')
    await page.selectOption('select[name="categoryId"]', 'category-1')
    await page.fill('textarea[name="content"]', 'Test article content')
    
    // Активация
    await page.check('input[name="isActive"]')
    
    // Сохранение
    await page.click('button[type="submit"]')
    
    // Проверка создания
    await expect(page.locator('text=Article created successfully')).toBeVisible({ timeout: 10000 })
  })

  test('should edit knowledge article', async ({ page }) => {
    await page.goto('/manage/test-tenant/knowledge-items/1/edit')
    
    // Изменение контента
    await page.fill('textarea[name="content"]', 'Updated article content')
    
    // Сохранение
    await page.click('button[type="submit"]')
    
    // Проверка обновления
    await expect(page.locator('text=Article updated successfully')).toBeVisible({ timeout: 10000 })
  })

  test('should search knowledge articles', async ({ page }) => {
    await page.goto('/manage/test-tenant/knowledge-items')
    
    // Поиск
    await page.fill('input[placeholder*="Поиск"]', 'test')
    await page.press('input[placeholder*="Поиск"]', 'Enter')
    
    // Проверка результатов
    await expect(page.locator('table tbody tr')).toHaveCount({ min: 1 }, { timeout: 5000 })
  })

  test('should filter articles by category', async ({ page }) => {
    await page.goto('/manage/test-tenant/knowledge-items')
    
    // Применение фильтра
    await page.click('button:has-text("Filter")')
    await page.selectOption('select[name="category"]', 'category-1')
    await page.click('button:has-text("Apply")')
    
    // Проверка фильтрации
    await expect(page.locator('table tbody tr')).toBeVisible({ timeout: 5000 })
  })
})

