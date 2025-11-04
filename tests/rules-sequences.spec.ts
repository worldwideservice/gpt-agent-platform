import { test, expect } from '@playwright/test'

test.describe('Rule Engine и Sequences', () => {
  test.beforeEach(async ({ page }) => {
    // Предполагаем что пользователь уже авторизован
    await page.goto('/manage/test-tenant')
    await page.waitForLoadState('networkidle')
  })

  test('Создание правила автоматизации', async ({ page }) => {
    // Переходим к редактированию агента
    await page.goto('/manage/test-tenant/ai-agents')
    await page.waitForLoadState('networkidle')

    // Находим первого агента и переходим к редактированию
    const firstAgentLink = page.locator('a[href*="/edit"]').first()
    if (await firstAgentLink.count() > 0) {
      await firstAgentLink.click()
      await page.waitForLoadState('networkidle')

      // Переходим на вкладку "Правила"
      await page.click('text=Правила')
      await page.waitForLoadState('networkidle')

      // Нажимаем "Создать правило"
      await page.click('text=Создать правило')
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 })

      // Заполняем форму
      await page.fill('input[id="name"]', 'Тестовое правило')
      await page.fill('textarea[id="description"]', 'Описание тестового правила')

      // Выбираем тип триггера
      await page.click('text=Тип триггера')
      await page.click('text=Создание лида')

      // Добавляем условие
      await page.click('text=Добавить условие')
      await page.waitForSelector('text=Условие 1', { timeout: 5000 })

      // Добавляем действие
      await page.click('text=Добавить действие')
      await page.waitForSelector('text=Действие 1', { timeout: 5000 })

      // Сохраняем
      await page.click('button:has-text("Создать правило")')
      await page.waitForSelector('text=Правило создано', { timeout: 10000 })

      // Проверяем что правило появилось в списке
      await expect(page.locator('text=Тестовое правило')).toBeVisible()
    }
  })

  test('Создание последовательности', async ({ page }) => {
    await page.goto('/manage/test-tenant/ai-agents')
    await page.waitForLoadState('networkidle')

    const firstAgentLink = page.locator('a[href*="/edit"]').first()
    if (await firstAgentLink.count() > 0) {
      await firstAgentLink.click()
      await page.waitForLoadState('networkidle')

      // Переходим на вкладку "Цепочки"
      await page.click('text=Цепочки')
      await page.waitForLoadState('networkidle')

      // Нажимаем "Создать цепочку"
      await page.click('text=Создать цепочку')
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 })

      // Заполняем форму
      await page.fill('input[id="name"]', 'Тестовая последовательность')
      await page.fill('textarea[id="description"]', 'Описание тестовой последовательности')

      // Добавляем шаг
      await page.click('text=Добавить шаг')
      await page.waitForSelector('text=Шаг 1', { timeout: 5000 })

      // Сохраняем
      await page.click('button:has-text("Создать последовательность")')
      await page.waitForSelector('text=Последовательность создана', { timeout: 10000 })

      // Проверяем что последовательность появилась в списке
      await expect(page.locator('text=Тестовая последовательность')).toBeVisible()
    }
  })

  test('Управление правилами - включение/выключение', async ({ page }) => {
    await page.goto('/manage/test-tenant/ai-agents')
    await page.waitForLoadState('networkidle')

    const firstAgentLink = page.locator('a[href*="/edit"]').first()
    if (await firstAgentLink.count() > 0) {
      await firstAgentLink.click()
      await page.waitForLoadState('networkidle')

      await page.click('text=Правила')
      await page.waitForLoadState('networkidle')

      // Проверяем наличие правил
      const rulesCount = await page.locator('table tbody tr').count()
      if (rulesCount > 0) {
        // Находим первый switch и переключаем
        const firstSwitch = page.locator('table tbody tr').first().locator('button[role="switch"]')
        if (await firstSwitch.count() > 0) {
          const initialState = await firstSwitch.getAttribute('aria-checked')
          await firstSwitch.click()
          await page.waitForTimeout(1000)

          // Проверяем что статус изменился
          const newState = await firstSwitch.getAttribute('aria-checked')
          expect(newState).not.toBe(initialState)
        }
      }
    }
  })
})

test.describe('Скрипты продаж', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/manage/test-tenant')
    await page.waitForLoadState('networkidle')
  })

  test('Просмотр скриптов продаж', async ({ page }) => {
    await page.goto('/manage/test-tenant/ai-agents')
    await page.waitForLoadState('networkidle')

    const firstAgentLink = page.locator('a[href*="/edit"]').first()
    if (await firstAgentLink.count() > 0) {
      await firstAgentLink.click()
      await page.waitForLoadState('networkidle')

      // Переходим на страницу скриптов
      await page.goto('/manage/test-tenant/ai-agents/[id]/scripts')
      await page.waitForLoadState('networkidle')

      // Проверяем наличие страницы
      await expect(page.locator('text=Скрипты продаж')).toBeVisible()
    }
  })

  test('Создание скрипта продаж', async ({ page }) => {
    await page.goto('/manage/test-tenant/ai-agents')
    await page.waitForLoadState('networkidle')

    const firstAgentLink = page.locator('a[href*="/edit"]').first()
    if (await firstAgentLink.count() > 0) {
      const agentId = await firstAgentLink.getAttribute('href')
      const idMatch = agentId?.match(/\/ai-agents\/([^\/]+)/)
      
      if (idMatch) {
        await page.goto(`/manage/test-tenant/ai-agents/${idMatch[1]}/scripts`)
        await page.waitForLoadState('networkidle')

        // Нажимаем "Создать скрипт"
        await page.click('text=Создать скрипт')
        await page.waitForSelector('[role="dialog"]', { timeout: 5000 })

        // Заполняем форму
        await page.fill('input[id="title"]', 'Тестовый скрипт')
        await page.fill('textarea[id="content"]', 'Привет! Это тестовый скрипт для общения с клиентом.')

        // Выбираем тип
        await page.click('text=Тип скрипта')
        await page.click('text=Приветствие')

        // Сохраняем
        await page.click('button:has-text("Создать скрипт")')
        await page.waitForSelector('text=Скрипт создан', { timeout: 10000 })

        // Проверяем что скрипт появился в списке
        await expect(page.locator('text=Тестовый скрипт')).toBeVisible()
      }
    }
  })
})

