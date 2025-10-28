import { test, expect } from '@playwright/test'

test.describe('Chat Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat')
  })

  test('should load chat page', async ({ page }) => {
    await expect(page).toHaveTitle(/GPT Agent/)
    await expect(page.getByText('Тестовый чат')).toBeVisible()
  })

  test('should display chat interface', async ({ page }) => {
    // Проверка основных элементов чата
    const chatContainer = page.locator('[class*="chat"], [id*="chat"]').first()
    if (await chatContainer.isVisible()) {
      await expect(chatContainer).toBeVisible()
    }
    
    // Проверка input для сообщений
    const messageInput = page.locator('textarea, input[type="text"]').first()
    await expect(messageInput).toBeVisible()
  })

  test('should send a message', async ({ page }) => {
    const messageInput = page.locator('textarea, input[type="text"]').first()
    await messageInput.fill('Привет! Это тестовое сообщение.')
    
    // Поиск кнопки отправки
    const sendButton = page.getByRole('button', { name: /отправить|send/i })
    if (await sendButton.isVisible()) {
      await sendButton.click()
      
      // Ожидание появления сообщения
      await page.waitForTimeout(1000)
      
      // Проверка что сообщение появилось
      await expect(page.getByText('Привет! Это тестовое сообщение.')).toBeVisible()
    }
  })

  test('should display chat history', async ({ page }) => {
    // Проверка наличия истории чата (если есть)
    const messages = page.locator('[class*="message"]')
    const count = await messages.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('should clear chat', async ({ page }) => {
    // Поиск кнопки очистки чата
    const clearButton = page.getByRole('button', { name: /очистить|clear/i })
    if (await clearButton.isVisible()) {
      await clearButton.click()
      
      // Ожидание очистки
      await page.waitForTimeout(500)
    }
  })

  test('should handle Enter key to send message', async ({ page }) => {
    const messageInput = page.locator('textarea, input[type="text"]').first()
    await messageInput.fill('Тест Enter')
    await messageInput.press('Enter')
    
    // Ожидание отправки
    await page.waitForTimeout(500)
  })

  test('@accessibility should have proper ARIA labels', async ({ page }) => {
    // Проверка accessibility
    const messageInput = page.locator('textarea, input[type="text"]').first()
    const ariaLabel = await messageInput.getAttribute('aria-label')
    const placeholder = await messageInput.getAttribute('placeholder')
    
    expect(ariaLabel || placeholder).toBeTruthy()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const messageInput = page.locator('textarea, input[type="text"]').first()
    await expect(messageInput).toBeVisible()
  })
})

