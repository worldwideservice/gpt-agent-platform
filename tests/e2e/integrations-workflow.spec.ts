import { test, expect } from '@playwright/test'

test.describe('Integrations Workflow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should view available integrations', async ({ page }) => {
    await page.goto('/manage/test-tenant/integrations')
    
    // Проверка наличия списка интеграций
    await expect(page.locator('text=Available Integrations')).toBeVisible({ timeout: 5000 })
    
    // Проверка наличия Kommo интеграции
    await expect(page.locator('text=Kommo')).toBeVisible()
  })

  test('should install Kommo integration', async ({ page }) => {
    await page.goto('/manage/test-tenant/integrations')
    
    // Клик по установке Kommo
    await page.click('button:has-text("Install Kommo")')
    
    // Проверка перехода к настройкам
    await expect(page.locator('text=Kommo Setup')).toBeVisible({ timeout: 10000 })
  })

  test('should configure Kommo integration settings', async ({ page }) => {
    await page.goto('/manage/test-tenant/integrations')
    
    // Переход к настройкам Kommo
    await page.click('a[href*="kommo"]')
    
    // Проверка формы настроек
    await expect(page.locator('input[name="domain"]')).toBeVisible({ timeout: 5000 })
  })

  test('should sync Kommo pipelines', async ({ page }) => {
    await page.goto('/manage/test-tenant/integrations')
    
    // Переход к Kommo
    await page.click('a[href*="kommo"]')
    
    // Синхронизация воронок
    await page.click('button:has-text("Sync Pipelines")')
    
    // Проверка синхронизации
    await expect(page.locator('text=Sync completed')).toBeVisible({ timeout: 15000 })
  })

  test('should view integration status', async ({ page }) => {
    await page.goto('/manage/test-tenant/integrations')
    
    // Проверка статуса интеграций
    await expect(page.locator('text=Connected') || page.locator('text=Not Connected')).toBeVisible({ timeout: 5000 })
  })
})

