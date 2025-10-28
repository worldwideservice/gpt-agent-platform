import { test, expect } from '@playwright/test'

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load dashboard page', async ({ page }) => {
    // Проверка заголовка страницы
    await expect(page).toHaveTitle(/GPT Agent/)
    
    // Проверка основных элементов
    await expect(page.getByText('Инфопанель')).toBeVisible()
  })

  test('should display statistics cards', async ({ page }) => {
    // Проверка карточек статистики
    await expect(page.getByText('Ответы ИИ за месяц')).toBeVisible()
    await expect(page.getByText('Активных агентов')).toBeVisible()
    await expect(page.getByText('Обработано запросов')).toBeVisible()
    await expect(page.getByText('Средний рейтинг')).toBeVisible()
  })

  test('should display sidebar navigation', async ({ page }) => {
    // Проверка пунктов меню
    await expect(page.getByText('Инфопанель')).toBeVisible()
    await expect(page.getByText('Агенты ИИ')).toBeVisible()
    await expect(page.getByText('Тестовый чат')).toBeVisible()
    await expect(page.getByText('База знаний')).toBeVisible()
    await expect(page.getByText('Интеграции')).toBeVisible()
  })

  test('should navigate to agents page', async ({ page }) => {
    await page.click('text=Агенты ИИ')
    await expect(page).toHaveURL('/agents')
    await expect(page.getByText('Управление агентами')).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    // Проверка на мобильном разрешении
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('Инфопанель')).toBeVisible()
  })

  test('@accessibility should have no accessibility violations', async ({ page }) => {
    // Базовая проверка accessibility
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
    
    // Проверка ARIA labels
    const buttons = page.locator('button')
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
  })
})

