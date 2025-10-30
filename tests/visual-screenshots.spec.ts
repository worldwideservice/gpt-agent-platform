import { test, expect } from '@playwright/test'

test.describe('Visual Screenshots Comparison', () => {
  test.beforeEach(async ({ page }) => {
    // Логин (предполагаем что тест запускается на уже настроенном проекте)
    await page.goto('http://localhost:3000/login')
    
    // Ждем форму логина или перенаправление
    await page.waitForTimeout(2000)
    
    // Если мы на странице логина, пробуем залогиниться
    const isLoginPage = page.url().includes('/login')
    if (isLoginPage) {
      // Заполняем форму логина (нужно будет настроить тестового пользователя)
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'testpassword')
      await page.click('button[type="submit"]')
      await page.waitForURL('**/agents**', { timeout: 10000 }).catch(() => {})
    }
  })

  test('Dashboard page screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    // Скрываем динамические элементы для стабильного скриншота
    await page.evaluate(() => {
      const styles = document.createElement('style')
      styles.textContent = `
        .animate-spin { animation: none !important; }
        [aria-busy="true"] { display: none !important; }
      `
      document.head.appendChild(styles)
    })
    
    await page.screenshot({ 
      path: 'test-screenshots/dashboard-actual.png',
      fullPage: true 
    })
    
    // Проверяем наличие ключевых элементов
    await expect(page.locator('text=Ответы ИИ за этот месяц')).toBeVisible()
    await expect(page.locator('text=Агенты')).toBeVisible()
  })

  test('Agents list page screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/agents')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    await page.evaluate(() => {
      const styles = document.createElement('style')
      styles.textContent = `
        .animate-spin { animation: none !important; }
      `
      document.head.appendChild(styles)
    })
    
    await page.screenshot({ 
      path: 'test-screenshots/agents-list-actual.png',
      fullPage: true 
    })
    
    // Проверяем элементы
    await expect(page.locator('text=Агенты ИИ')).toBeVisible()
    await expect(page.locator('button:has-text("Создать")')).toBeVisible()
  })

  test('Create agent page screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/agents/create')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    
    await page.screenshot({ 
      path: 'test-screenshots/create-agent-actual.png',
      fullPage: true 
    })
    
    // Проверяем обязательное поле со звездочкой
    await expect(page.locator('text=Название')).toBeVisible()
    await expect(page.locator('text=Название span:text("*")')).toBeVisible()
  })

  test('Edit agent page - Основные tab screenshot', async ({ page }) => {
    // Предполагаем что есть агент с id 553
    await page.goto('http://localhost:3000/agents/553/edit')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    await page.screenshot({ 
      path: 'test-screenshots/edit-agent-general-actual.png',
      fullPage: true 
    })
    
    await expect(page.locator('text=Редактирование АИ ассистент')).toBeVisible()
  })

  test('Edit agent page - Сделки и контакты tab screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/agents/553/edit')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    // Переключаемся на вкладку "Сделки и контакты"
    await page.click('button:has-text("Сделки и контакты")')
    await page.waitForTimeout(1000)
    
    await page.screenshot({ 
      path: 'test-screenshots/edit-agent-deals-actual.png',
      fullPage: true 
    })
    
    await expect(page.locator('text=Сделки и контакты')).toBeVisible()
    await expect(page.locator('text=Настройки доступа к данным')).toBeVisible()
  })

  test('Edit agent page - Триггеры tab screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/agents/553/edit')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    await page.click('button:has-text("Триггеры")')
    await page.waitForTimeout(1000)
    
    await page.screenshot({ 
      path: 'test-screenshots/edit-agent-triggers-actual.png',
      fullPage: true 
    })
    
    await expect(page.locator('text=Триггеры')).toBeVisible()
    await expect(page.locator('button:has-text("Создать")')).toBeVisible()
  })

  test('Edit agent page - Цепочки tab screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/agents/553/edit')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    await page.click('button:has-text("Цепочки")')
    await page.waitForTimeout(1000)
    
    await page.screenshot({ 
      path: 'test-screenshots/edit-agent-sequences-actual.png',
      fullPage: true 
    })
    
    await expect(page.locator('text=Цепочки')).toBeVisible()
  })

  test('Edit agent page - Интеграции tab screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/agents/553/edit')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    await page.click('button:has-text("Интеграции")')
    await page.waitForTimeout(1000)
    
    await page.screenshot({ 
      path: 'test-screenshots/edit-agent-integrations-actual.png',
      fullPage: true 
    })
    
    await expect(page.locator('text=Интеграции')).toBeVisible()
    await expect(page.locator('text=Kommo')).toBeVisible()
  })

  test('Edit agent page - Дополнительно tab screenshot', async ({ page }) => {
    await page.goto('http://localhost:3000/agents/553/edit')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    await page.click('button:has-text("Дополнительно")')
    await page.waitForTimeout(1000)
    
    await page.screenshot({ 
      path: 'test-screenshots/edit-agent-additional-actual.png',
      fullPage: true 
    })
    
    await expect(page.locator('text=PRODUCT VENDORS')).toBeVisible()
    await expect(page.locator('text=Каналы')).toBeVisible()
  })
})





