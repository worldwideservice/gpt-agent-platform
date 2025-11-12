import { test, expect } from '@playwright/test'

test.describe('Agent Workflow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Логин и переход к tenant
    await page.goto('/')
    // Предполагаем что есть тестовый пользователь
    await page.waitForLoadState('networkidle')
  })

  test('should create a new AI agent', async ({ page }) => {
    // Переход к странице создания агента
    await page.goto('/manage/test-tenant/ai-agents/create')
    
    // Заполнение формы создания агента
    await page.fill('input[name="name"]', 'Test Agent')
    await page.fill('textarea[name="description"]', 'Test agent description')
    
    // Выбор модели
    await page.selectOption('select[name="model"]', 'gpt-4')
    
    // Сохранение
    await page.click('button[type="submit"]')
    
    // Проверка успешного создания
    await expect(page.locator('text=Agent created successfully')).toBeVisible({ timeout: 10000 })
  })

  test('should edit agent settings', async ({ page }) => {
    // Переход к редактированию агента
    await page.goto('/manage/test-tenant/ai-agents/1/edit')
    
    // Изменение настроек
    await page.fill('input[name="name"]', 'Updated Agent Name')
    
    // Сохранение
    await page.click('button[type="submit"]')
    
    // Проверка обновления
    await expect(page.locator('text=Agent updated successfully')).toBeVisible({ timeout: 10000 })
  })

  test('should configure agent CRM integration', async ({ page }) => {
    await page.goto('/manage/test-tenant/ai-agents/1/edit')
    
    // Переход к настройкам интеграций
    await page.click('text=Integrations')
    
    // Настройка Kommo интеграции
    await page.click('text=Connect Kommo')
    
    // Заполнение данных подключения
    await page.fill('input[name="domain"]', 'test.kommo.com')
    await page.fill('input[name="accessToken"]', 'test-token')
    
    // Сохранение
    await page.click('button[type="submit"]')
    
    // Проверка подключения
    await expect(page.locator('text=Kommo connected successfully')).toBeVisible({ timeout: 10000 })
  })

  test('should configure agent knowledge base', async ({ page }) => {
    await page.goto('/manage/test-tenant/ai-agents/1/edit')
    
    // Переход к настройкам базы знаний
    await page.click('text=Knowledge Base')
    
    // Выбор категорий
    await page.check('input[value="category-1"]')
    await page.check('input[value="category-2"]')
    
    // Сохранение
    await page.click('button[type="submit"]')
    
    // Проверка сохранения
    await expect(page.locator('text=Knowledge base settings saved')).toBeVisible({ timeout: 10000 })
  })

  test('should test agent in chat', async ({ page }) => {
    await page.goto('/manage/test-tenant/test-chat')
    
    // Выбор агента
    await page.selectOption('select[name="agent"]', 'agent-1')
    
    // Отправка сообщения
    await page.fill('textarea[name="message"]', 'Hello, test message')
    await page.click('button[type="submit"]')
    
    // Проверка ответа агента
    await expect(page.locator('.message-assistant')).toBeVisible({ timeout: 15000 })
  })
})

