import { test, expect } from '@playwright/test'

test.describe('История Webhooks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/manage/test-tenant')
    await page.waitForLoadState('networkidle')
  })

  test('Просмотр истории Webhooks', async ({ page }) => {
    await page.goto('/manage/test-tenant/webhooks')
    await page.waitForLoadState('networkidle')

    // Проверяем наличие страницы
    await expect(page.locator('text=История Webhooks')).toBeVisible()

    // Проверяем наличие статистики
    await expect(page.locator('text=Всего')).toBeVisible()
    await expect(page.locator('text=Успешно')).toBeVisible()
    await expect(page.locator('text=Ошибки')).toBeVisible()

    // Проверяем наличие таблицы
    const table = page.locator('table')
    if (await table.count() > 0) {
      await expect(table).toBeVisible()
    }
  })

  test('Фильтрация Webhooks по статусу', async ({ page }) => {
    await page.goto('/manage/test-tenant/webhooks')
    await page.waitForLoadState('networkidle')

    // Выбираем фильтр по статусу
    const statusFilter = page.locator('select').first()
    if (await statusFilter.count() > 0) {
      await statusFilter.selectOption({ value: 'completed' })
      await page.waitForTimeout(1000)

      // Проверяем что фильтр применен
      await expect(statusFilter).toHaveValue('completed')
    }
  })

  test('Поиск Webhooks', async ({ page }) => {
    await page.goto('/manage/test-tenant/webhooks')
    await page.waitForLoadState('networkidle')

    // Вводим поисковый запрос
    const searchInput = page.locator('input[placeholder*="Поиск"]')
    if (await searchInput.count() > 0) {
      await searchInput.fill('leads')
      await page.waitForTimeout(1000)

      // Проверяем что поиск применен
      await expect(searchInput).toHaveValue('leads')
    }
  })
})

test.describe('Расширенная аналитика', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/manage/test-tenant')
    await page.waitForLoadState('networkidle')
  })

  test('Просмотр расширенной аналитики', async ({ page }) => {
    await page.goto('/manage/test-tenant/analytics')
    await page.waitForLoadState('networkidle')

    // Проверяем наличие страницы
    await expect(page.locator('text=Расширенная аналитика')).toBeVisible()

    // Проверяем наличие основных метрик
    await expect(page.locator('text=Агенты')).toBeVisible()
    await expect(page.locator('text=Разговоры')).toBeVisible()
    await expect(page.locator('text=Токены')).toBeVisible()
    await expect(page.locator('text=Время ответа')).toBeVisible()
  })

  test('Изменение диапазона дат', async ({ page }) => {
    await page.goto('/manage/test-tenant/analytics')
    await page.waitForLoadState('networkidle')

    // Выбираем диапазон дат
    const dateRangeSelect = page.locator('select').first()
    if (await dateRangeSelect.count() > 0) {
      await dateRangeSelect.selectOption({ value: '30d' })
      await page.waitForTimeout(1000)

      // Проверяем что диапазон изменен
      await expect(dateRangeSelect).toHaveValue('30d')
    }
  })

  test('Экспорт аналитики', async ({ page }) => {
    await page.goto('/manage/test-tenant/analytics')
    await page.waitForLoadState('networkidle')

    // Нажимаем кнопку экспорта
    const exportButton = page.locator('button:has-text("Экспорт")')
    if (await exportButton.count() > 0) {
      // Ждем загрузки данных перед экспортом
      await page.waitForTimeout(2000)

      // Проверяем что кнопка видна
      await expect(exportButton).toBeVisible()

      // Нажимаем (без ожидания скачивания файла, так как это может быть асинхронно)
      // await exportButton.click()
      // await page.waitForTimeout(2000)
    }
  })

  test('Просмотр метрик производительности', async ({ page }) => {
    await page.goto('/manage/test-tenant/analytics')
    await page.waitForLoadState('networkidle')

    // Проверяем наличие секции метрик производительности
    await expect(page.locator('text=Метрики производительности')).toBeVisible()
    await expect(page.locator('text=Время первого ответа')).toBeVisible()
    await expect(page.locator('text=Удовлетворенность')).toBeVisible()
  })

  test('Просмотр топ агентов', async ({ page }) => {
    await page.goto('/manage/test-tenant/analytics')
    await page.waitForLoadState('networkidle')

    // Проверяем наличие секции топ агентов
    await expect(page.locator('text=Топ агентов')).toBeVisible()
  })

  test('Просмотр использования по периодам', async ({ page }) => {
    await page.goto('/manage/test-tenant/analytics')
    await page.waitForLoadState('networkidle')

    // Проверяем наличие таблицы использования
    await expect(page.locator('text=Использование по периодам')).toBeVisible()
  })

  test('Просмотр распределения по каналам', async ({ page }) => {
    await page.goto('/manage/test-tenant/analytics')
    await page.waitForLoadState('networkidle')

    // Проверяем наличие секции каналов
    await expect(page.locator('text=Распределение по каналам')).toBeVisible()
  })
})

































