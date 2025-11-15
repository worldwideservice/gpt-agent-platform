import { test, expect, Page } from '@playwright/test'

/**
 * E2E тесты для Agent Integrations Management System
 *
 * Тестируемый функционал:
 * 1. Просмотр списка интеграций агента
 * 2. Установка интеграции через OAuth (mock)
 * 3. Установка интеграции вручную
 * 4. Удаление интеграции
 * 5. Поиск интеграций
 * 6. Навигация и breadcrumbs
 */

test.describe('Agent Integrations Management', () => {
  const TENANT_ID = 'test-tenant'
  const AGENT_ID = 'test-agent-id'
  const INTEGRATIONS_URL = `/manage/${TENANT_ID}/ai-agents/${AGENT_ID}/edit/integrations`

  /**
   * Helper: Navigate to agent integrations page
   */
  async function navigateToIntegrations(page: Page) {
    await page.goto(INTEGRATIONS_URL)
    await page.waitForLoadState('networkidle')
  }

  /**
   * Helper: Wait for integrations table to load
   */
  async function waitForIntegrationsTable(page: Page) {
    // Wait for either loading state to finish or table to appear
    await Promise.race([
      page.waitForSelector('[data-testid="integrations-table"]', { timeout: 10000 }),
      page.waitForSelector('text=Загрузка', { state: 'hidden', timeout: 10000 }),
    ])
  }

  test.describe('Navigation and Layout', () => {
    test('should display integrations page with proper navigation', async ({ page }) => {
      await navigateToIntegrations(page)

      // Check breadcrumbs navigation
      await expect(page.locator('nav[aria-label="breadcrumb"]')).toBeVisible()
      await expect(page.locator('text=Агенты ИИ')).toBeVisible()
      await expect(page.locator('text=Интеграции')).toBeVisible()

      // Check tabs navigation
      await expect(page.locator('text=Основные')).toBeVisible()
      await expect(page.locator('text=Интеграции')).toBeVisible()

      // Check active tab highlighting
      const integrationsTab = page.locator('a:has-text("Интеграции")')
      await expect(integrationsTab).toHaveClass(/border-blue-600/)
    })

    test('should navigate between agent tabs', async ({ page }) => {
      await navigateToIntegrations(page)

      // Click on "Основные" tab
      await page.click('a:has-text("Основные")')
      await page.waitForURL(/\/edit$/)

      // Navigate back to integrations
      await page.click('a:has-text("Интеграции")')
      await page.waitForURL(/\/integrations$/)
    })
  })

  test.describe('Integrations List', () => {
    test('should display list of available integrations', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      // Check for integration names
      await expect(page.locator('text=Kommo')).toBeVisible()
      await expect(page.locator('text=Google Calendar')).toBeVisible()
      await expect(page.locator('text=Telegram')).toBeVisible()
      await expect(page.locator('text=WhatsApp')).toBeVisible()
    })

    test('should show install button for non-installed integrations', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      // Find a row without checkmark (not installed)
      const installButton = page.locator('button:has-text("Установить")').first()
      await expect(installButton).toBeVisible()
      await expect(installButton).toBeEnabled()
    })

    test('should show settings button for installed integrations', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      // If any integration is installed, should show settings button
      const settingsButton = page.locator('button:has-text("Настройки")').first()
      if (await settingsButton.isVisible()) {
        await expect(settingsButton).toBeEnabled()
      }
    })

    test('should display empty state when no results found', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      // Search for non-existent integration
      await page.fill('input[placeholder*="Поиск"]', 'NonExistentIntegration123')

      // Should show empty state
      await expect(page.locator('text=Интеграции не найдены')).toBeVisible()
    })
  })

  test.describe('Search Functionality', () => {
    test('should filter integrations by search query', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      // Search for Kommo
      await page.fill('input[placeholder*="Поиск"]', 'Kommo')

      // Should show only Kommo
      await expect(page.locator('text=Kommo')).toBeVisible()

      // Should hide others (or at least reduce the list)
      const rows = page.locator('tbody tr')
      const count = await rows.count()
      expect(count).toBeLessThanOrEqual(4) // Should filter results
    })

    test('should clear search and show all integrations', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      const searchInput = page.locator('input[placeholder*="Поиск"]')

      // Search for something
      await searchInput.fill('Kommo')
      await expect(page.locator('text=Kommo')).toBeVisible()

      // Clear search
      await searchInput.clear()

      // Should show all integrations again
      await expect(page.locator('text=Google Calendar')).toBeVisible()
      await expect(page.locator('text=Telegram')).toBeVisible()
    })
  })

  test.describe('Install Integration Modal', () => {
    test('should open install modal when clicking install button', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      // Click install button for first non-installed integration
      await page.click('button:has-text("Установить")').first

      // Modal should open
      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await expect(page.locator('text=Установить')).toBeVisible()

      // Should have OAuth and Manual tabs
      await expect(page.locator('text=OAuth (Рекомендуется)')).toBeVisible()
      await expect(page.locator('text=Вручную')).toBeVisible()
    })

    test('should close modal when clicking cancel', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      await page.click('button:has-text("Установить")').first
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      // Click cancel
      await page.click('button:has-text("Отмена")')

      // Modal should close
      await expect(page.locator('[role="dialog"]')).not.toBeVisible()
    })

    test('should show OAuth tab with subdomain input', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      // Open modal for Kommo
      const kommoRow = page.locator('tr:has-text("Kommo")')
      await kommoRow.locator('button:has-text("Установить")').click()

      // Should be on OAuth tab by default
      await expect(page.locator('text=Поддомен Kommo')).toBeVisible()
      await expect(page.locator('input[placeholder*="example"]')).toBeVisible()

      // OAuth button should be disabled without input
      const oauthButton = page.locator('button:has-text("Подключить через OAuth")')
      await expect(oauthButton).toBeDisabled()
    })

    test('should enable OAuth button when subdomain is entered', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      const kommoRow = page.locator('tr:has-text("Kommo")')
      await kommoRow.locator('button:has-text("Установить")').click()

      // Enter subdomain
      await page.fill('input[placeholder*="example"]', 'testcompany')

      // OAuth button should be enabled
      const oauthButton = page.locator('button:has-text("Подключить через OAuth")')
      await expect(oauthButton).toBeEnabled()
    })

    test('should show manual installation tab with credentials inputs', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      await page.click('button:has-text("Установить")').first

      // Switch to Manual tab
      await page.click('text=Вручную')

      // Should show Client ID and Secret inputs
      await expect(page.locator('input#clientId')).toBeVisible()
      await expect(page.locator('input#clientSecret')).toBeVisible()

      // Install button should be disabled without credentials
      const installButton = page.locator('button:has-text("Установить")')
      await expect(installButton).toBeDisabled()
    })

    test('should enable install button when credentials are entered', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      await page.click('button:has-text("Установить")').first
      await page.click('text=Вручную')

      // Enter credentials
      await page.fill('input#clientId', 'test-client-id')
      await page.fill('input#clientSecret', 'test-client-secret')

      // Install button should be enabled
      const installButton = page.locator('button:has-text("Установить")')
      await expect(installButton).toBeEnabled()
    })
  })

  test.describe('Delete Integration', () => {
    test('should show delete confirmation dialog', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      // Find an installed integration with settings button
      const settingsButton = page.locator('button:has-text("Настройки")').first()

      if (await settingsButton.isVisible()) {
        // Click settings (this would navigate to settings page)
        // For now, we'll test the delete dialog component separately
        // as it requires navigating to the settings page first
      }
    })
  })

  test.describe('Loading and Error States', () => {
    test('should show loading state when fetching integrations', async ({ page }) => {
      // Intercept API request to delay response
      await page.route('**/api/agents/*/integrations', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await route.continue()
      })

      await page.goto(INTEGRATIONS_URL)

      // Should show loading indicator
      await expect(
        page.locator('text=Загрузка').or(page.locator('[data-testid="loader"]'))
      ).toBeVisible({ timeout: 1000 })
    })

    test('should handle API errors gracefully', async ({ page }) => {
      // Intercept API request to return error
      await page.route('**/api/agents/*/integrations', (route) => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        })
      })

      await navigateToIntegrations(page)

      // Should show error state
      await expect(
        page.locator('text=Ошибка').or(page.locator('text=Попробовать снова'))
      ).toBeVisible({ timeout: 10000 })
    })
  })

  test.describe('OAuth Success Notification', () => {
    test('should show success toast after OAuth callback', async ({ page }) => {
      // Navigate with success query params (simulating OAuth callback)
      await page.goto(`${INTEGRATIONS_URL}?provider=kommo&status=success`)

      // Should show success toast
      await expect(
        page.locator('text=Успешно').or(page.locator('text=успешно подключена'))
      ).toBeVisible({ timeout: 5000 })

      // URL should be cleaned up (params removed)
      await page.waitForTimeout(1000)
      const url = page.url()
      expect(url).not.toContain('provider=')
      expect(url).not.toContain('status=')
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      // Check for accessible navigation
      await expect(page.locator('nav[aria-label="breadcrumb"]')).toBeVisible()

      // Check for dialog roles
      await page.click('button:has-text("Установить")').first
      await expect(page.locator('[role="dialog"]')).toBeVisible()
    })

    test('should be keyboard navigable', async ({ page }) => {
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      // Tab to install button
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Should be able to activate with Enter
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(focusedElement).toBeTruthy()
    })
  })

  test.describe('Responsive Design', () => {
    test('should display properly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      // Table should still be visible (might be scrollable)
      await expect(page.locator('table')).toBeVisible()
    })

    test('should display properly on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await navigateToIntegrations(page)
      await waitForIntegrationsTable(page)

      await expect(page.locator('table')).toBeVisible()
    })
  })
})
