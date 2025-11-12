import { test, expect } from '@playwright/test'

test.describe('Dashboard Workflow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should display dashboard statistics', async ({ page }) => {
    await page.goto('/manage/test-tenant')
    
    // Проверка наличия статистики
    await expect(page.locator('text=Ответы ИИ за этот месяц')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Ответы ИИ за последние 7 дней')).toBeVisible()
    await expect(page.locator('text=Ответы ИИ сегодня')).toBeVisible()
    await expect(page.locator('text=Агенты')).toBeVisible()
  })

  test('should display dashboard charts', async ({ page }) => {
    await page.goto('/manage/test-tenant')
    
    // Проверка наличия графиков
    await expect(page.locator('text=Ответы ИИ за этот месяц')).toBeVisible({ timeout: 5000 })
    
    // Проверка что графики рендерятся
    const charts = page.locator('svg, canvas')
    await expect(charts.first()).toBeVisible({ timeout: 5000 })
  })

  test('should display recent updates', async ({ page }) => {
    await page.goto('/manage/test-tenant')
    
    // Проверка наличия секции обновлений
    await expect(page.locator('text=Последние обновления')).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to agents from dashboard', async ({ page }) => {
    await page.goto('/manage/test-tenant')
    
    // Клик по ссылке на агентов
    await page.click('a[href*="ai-agents"]')
    
    // Проверка перехода
    await expect(page).toHaveURL(/.*ai-agents/, { timeout: 5000 })
  })

  test('should navigate to knowledge base from dashboard', async ({ page }) => {
    await page.goto('/manage/test-tenant')
    
    // Клик по ссылке на базу знаний
    await page.click('a[href*="knowledge"]')
    
    // Проверка перехода
    await expect(page).toHaveURL(/.*knowledge/, { timeout: 5000 })
  })
})

