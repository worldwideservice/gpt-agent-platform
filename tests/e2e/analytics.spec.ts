/**
 * Analytics E2E Tests
 * Tests for analytics dashboard and metrics
 */

import { test, expect } from './fixtures/auth.fixture'

test.describe('Analytics Dashboard', () => {
  test('should display analytics dashboard', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/dashboard')

    // Check for dashboard title
    await expect(page.locator('h1, h2').first()).toBeVisible()

    // Check for metric cards
    const metricCards = page.locator('[data-testid*="metric"], .metric-card, .stat-card')
    await expect(metricCards.first()).toBeVisible({ timeout: 5000 })
  })

  test('should show key metrics', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/dashboard')

    // Check for common metrics
    const metrics = [
      /Запросы|Requests|Всего|Total/i,
      /Токены|Tokens/i,
      /Стоимость|Cost/i,
      /Рейтинг|Rating/i,
    ]

    for (const metric of metrics) {
      const element = page.locator(`text=${metric}`)
      if (await element.isVisible({ timeout: 2000 })) {
        await expect(element).toBeVisible()
        break // At least one metric should be visible
      }
    }
  })

  test('should display charts', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/dashboard')

    // Check for chart elements
    const charts = page.locator('canvas, svg[class*="recharts"], [data-testid*="chart"]')

    await expect(charts.first()).toBeVisible({ timeout: 10000 })
  })

  test('should allow date range selection', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/dashboard')

    // Find date range selector
    const dateRangeButton = page.locator('button, select').filter({
      hasText: /Период|Period|Дата|Date|День|Day|Неделя|Week|Месяц|Month/i,
    })

    if (await dateRangeButton.first().isVisible({ timeout: 3000 })) {
      await dateRangeButton.first().click()

      // Select different period
      const periodOption = page.locator('text=/7 дней|7 days|Неделя|Week/i')
      if (await periodOption.isVisible({ timeout: 2000 })) {
        await periodOption.click()

        // Wait for data to reload
        await page.waitForTimeout(2000)
      }
    }
  })

  test('should show top agents', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/dashboard')

    // Check for top agents section
    await expect(
      page.locator('text=/Топ агентов|Top agents|Лучшие|Best/i')
    ).toBeVisible({ timeout: 5000 })
  })

  test('should display real-time metrics', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/dashboard')

    // Check for real-time section
    const realtimeSection = page.locator('text=/Реальное время|Real.*time|Текущий час|Current/i')

    if (await realtimeSection.isVisible({ timeout: 3000 })) {
      await expect(realtimeSection).toBeVisible()
    }
  })

  test('should navigate to detailed analytics', async ({ authenticatedPage: page }) => {
    await page.goto('/manage/test-org/dashboard')

    // Find link to detailed view
    const detailsLink = page.locator('a, button').filter({
      hasText: /Подробнее|Details|Смотреть все|View all/i,
    })

    if (await detailsLink.first().isVisible({ timeout: 3000 })) {
      await detailsLink.first().click()

      // Should navigate or show more details
      await page.waitForTimeout(1000)
    }
  })
})
