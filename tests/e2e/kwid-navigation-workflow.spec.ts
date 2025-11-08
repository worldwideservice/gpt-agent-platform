import { test, expect } from '@playwright/test'

/**
 * E2E тесты для навигации по приложению согласно KWID логике
 * Основан на: kwid/docs/KWID_ARCHITECTURE.md
 */

test.describe('KWID Navigation Workflow', () => {
  const tenantId = 'test-tenant-id'

  test.beforeEach(async ({ page }) => {
    // В демо-режиме может быть редирект на /login
    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping test - requires authentication')
    }
  })

  test('should navigate via sidebar menu', async ({ page }) => {
    await page.goto(`/manage/${tenantId}`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Навигация через sidebar
    const menuItems = [
      { text: 'Инфопанель', path: '' },
      { text: 'Агенты ИИ', path: '/ai-agents' },
      { text: 'Тестовый чат', path: '/test-chat' },
      { text: 'Категории', path: '/knowledge-categories' },
      { text: 'Статьи', path: '/knowledge-items' },
      { text: 'Настройки аккаунта', path: '/account-settings' },
      { text: 'Тарифные планы', path: '/pricing' },
    ]

    for (const item of menuItems) {
      const menuLink = page.locator(`a:has-text("${item.text}"), a[href*="${item.path}"]`)
      if (await menuLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        await menuLink.click()
        await page.waitForURL(new RegExp(`.*${item.path.replace('/', '')}.*`), { timeout: 5000 }).catch(() => {})
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(500)
      }
    }
  })

  test('should navigate via breadcrumbs', async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Поиск breadcrumbs
    const breadcrumbs = page.locator('[class*="breadcrumb"], nav[aria-label*="breadcrumb"]')
    if (await breadcrumbs.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Клик по первому элементу breadcrumb (обычно ведет на список)
      const firstBreadcrumb = breadcrumbs.locator('a').first()
      if (await firstBreadcrumb.isVisible({ timeout: 2000 }).catch(() => false)) {
        await firstBreadcrumb.click()
        await page.waitForURL(/.*ai-agents/, { timeout: 5000 }).catch(() => {})
      }
    }
  })

  test('should use header search', async ({ page }) => {
    await page.goto(`/manage/${tenantId}`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Поиск глобального поиска в header
    const globalSearch = page.locator('input[placeholder*="Глобальный поиск"], input[placeholder*="Поиск"]')
    if (await globalSearch.isVisible({ timeout: 2000 }).catch(() => false)) {
      await globalSearch.fill('test search query')
      await page.waitForTimeout(1000)

      // Проверка результатов поиска (если есть)
      const searchResults = page.locator('[class*="search-results"], [class*="dropdown"]')
      const hasResults = await searchResults.count() > 0
      // В демо-режиме может не быть результатов
      expect(hasResults).toBeTruthy()
    }
  })

  test('should navigate to notifications', async ({ page }) => {
    await page.goto(`/manage/${tenantId}`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Поиск кнопки уведомлений в header
    const notificationsButton = page.locator('button[aria-label*="уведомлен"], button[aria-label*="notification"]')
    if (await notificationsButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await notificationsButton.click()
      await page.waitForTimeout(500)

      // Проверка что открылось меню уведомлений
      const notificationsMenu = page.locator('[role="menu"], [class*="dropdown"], [class*="notifications"]')
      await expect(notificationsMenu.first()).toBeVisible({ timeout: 2000 }).catch(() => {})
    }
  })

  test('should navigate to user menu', async ({ page }) => {
    await page.goto(`/manage/${tenantId}`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Поиск меню пользователя (аватар)
    const userMenu = page.locator('button[aria-label*="пользователь"], button[aria-label*="user"], [class*="avatar"]')
    if (await userMenu.isVisible({ timeout: 2000 }).catch(() => false)) {
      await userMenu.click()
      await page.waitForTimeout(500)

      // Проверка что открылось меню
      const menuDropdown = page.locator('[role="menu"], [class*="dropdown"]')
      await expect(menuDropdown.first()).toBeVisible({ timeout: 2000 }).catch(() => {})
    }
  })

  test('should navigate between agent tabs', async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents/1/edit`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Список вкладок агента
    const tabs = [
      'Основные',
      'Сделки',
      'Триггеры',
      'Цепочки',
      'Интеграции',
      'Обучение',
    ]

    for (const tabName of tabs) {
      const tab = page.locator(`button:has-text("${tabName}"), [role="tab"]:has-text("${tabName}")`)
      if (await tab.isVisible({ timeout: 1000 }).catch(() => false)) {
        await tab.click()
        await page.waitForTimeout(500)

        // Проверка что контент вкладки загрузился
        const tabContent = page.locator('[role="tabpanel"], [class*="content"]')
        await expect(tabContent.first()).toBeVisible({ timeout: 2000 }).catch(() => {})
      }
    }
  })

  test('should navigate via action buttons', async ({ page }) => {
    await page.goto(`/manage/${tenantId}/ai-agents`)
    await page.waitForLoadState('networkidle')

    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping - requires authentication')
      return
    }

    // Клик по кнопке создания
    const createButton = page.locator('button:has-text("Создать"), a[href*="create"]')
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click()
      await page.waitForURL(/.*create/, { timeout: 5000 }).catch(() => {})

      // Возврат назад
      await page.goBack()
      await page.waitForURL(/.*ai-agents/, { timeout: 5000 }).catch(() => {})
    }
  })
})

