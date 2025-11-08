import { test, expect } from '@playwright/test'

test.describe('CRM Integration Workflow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should connect Kommo CRM', async ({ page }) => {
    await page.goto('/manage/test-tenant/ai-agents/1/edit')
    
    // Переход к интеграциям
    await page.click('text=Integrations')
    
    // Подключение Kommo
    await page.click('text=Connect Kommo')
    
    // Заполнение OAuth данных (в реальном сценарии это будет редирект)
    // Здесь тестируем форму настроек
    await page.fill('input[name="domain"]', 'test.kommo.com')
    
    // Проверка что форма отображается
    await expect(page.locator('input[name="domain"]')).toBeVisible()
  })

  test('should sync CRM pipelines', async ({ page }) => {
    await page.goto('/manage/test-tenant/ai-agents/1/edit')
    
    // Переход к настройкам CRM
    await page.click('text=CRM Settings')
    
    // Синхронизация воронок
    await page.click('button:has-text("Sync Pipelines")')
    
    // Проверка синхронизации
    await expect(page.locator('text=Sync completed')).toBeVisible({ timeout: 15000 })
  })

  test('should configure agent channels', async ({ page }) => {
    await page.goto('/manage/test-tenant/ai-agents/1/edit')
    
    // Переход к настройкам каналов
    await page.click('text=Channels')
    
    // Включение каналов
    await page.check('input[value="telegram"]')
    await page.check('input[value="whatsapp"]')
    
    // Сохранение
    await page.click('button[type="submit"]')
    
    // Проверка сохранения
    await expect(page.locator('text=Channels updated successfully')).toBeVisible({ timeout: 10000 })
  })

  test('should configure deal and contact fields', async ({ page }) => {
    await page.goto('/manage/test-tenant/ai-agents/1/edit')
    
    // Переход к настройкам полей
    await page.click('text=CRM Fields')
    
    // Выбор полей сделок
    await page.check('input[value="deal-name"]')
    await page.check('input[value="deal-price"]')
    
    // Выбор полей контактов
    await page.check('input[value="contact-email"]')
    await page.check('input[value="contact-phone"]')
    
    // Сохранение
    await page.click('button[type="submit"]')
    
    // Проверка сохранения
    await expect(page.locator('text=Fields updated successfully')).toBeVisible({ timeout: 10000 })
  })

  test('should test CRM webhook processing', async ({ page, request }) => {
    // Отправка тестового webhook
    const response = await request.post('/api/crm/webhook', {
      data: {
        type: 'lead_status_changed',
        lead_id: 123,
        status_id: 456,
      },
    })
    
    expect(response.ok()).toBeTruthy()
    
    // Проверка что webhook обработан
    const result = await response.json()
    expect(result.success).toBe(true)
  })
})

