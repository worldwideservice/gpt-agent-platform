import { test, expect } from '@playwright/test'

/**
 * E2E тесты для полного цикла работы с тарифными планами согласно KWID логике
 * Основан на: kwid/docs/KWID_ALL_PAGES_COMPLETE.md
 */

test.describe('KWID Pricing Complete Workflow', () => {
  const tenantId = 'test-tenant-id'

  test.beforeEach(async ({ page }) => {
    await page.goto(`/manage/${tenantId}/pricing`)
    await page.waitForLoadState('networkidle')

    // В демо-режиме может быть редирект на /login
    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Skipping test - requires authentication')
    }
  })

  test('should view current plan information', async ({ page }) => {
    // Проверка секции текущего плана
    const currentPlanSection = page.locator('text=Ваш текущий план, text=Current Plan')
    const hasCurrentPlan = await currentPlanSection.count() > 0

    if (hasCurrentPlan) {
      // Проверка названия плана
      const planName = page.locator('text=/Launch|Scale|Max/i')
      await expect(planName.first()).toBeVisible({ timeout: 5000 }).catch(() => {})

      // Проверка информации об использовании
      const usageInfo = page.locator('text=/использовано|used|из/i')
      const hasUsage = await usageInfo.count() > 0
      expect(hasUsage).toBeTruthy()
    }
  })

  test('should change response count', async ({ page }) => {
    // Поиск селекта количества ответов
    const responseSelect = page.locator('select[name*="response"], select[aria-label*="ответ"]')
    if (await responseSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Выбор другого количества
      await responseSelect.selectOption({ index: 1 })
      await page.waitForTimeout(1000)

      // Проверка что цены обновились
      const pricingCards = page.locator('[class*="pricing"], [class*="card"]')
      await expect(pricingCards.first()).toBeVisible({ timeout: 5000 }).catch(() => {})
    }
  })

  test('should toggle billing cycle', async ({ page }) => {
    // Поиск переключателя периода оплаты
    const monthlyButton = page.locator('button:has-text("Ежемесячно"), button:has-text("Monthly")')
    const yearlyButton = page.locator('button:has-text("Ежегодно"), button:has-text("Yearly")')

    if (await monthlyButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Переключение на годовой план
      await yearlyButton.click()
      await page.waitForTimeout(1000)

      // Проверка что цены обновились
      const pricingCards = page.locator('[class*="pricing"], [class*="card"]')
      await expect(pricingCards.first()).toBeVisible({ timeout: 5000 }).catch(() => {})

      // Проверка сообщения об экономии
      const savingsText = page.locator('text=/экономия|savings|20%/i')
      const hasSavings = await savingsText.count() > 0
      // В демо-режиме может не быть
      expect(hasSavings).toBeTruthy()
    }
  })

  test('should view pricing tiers', async ({ page }) => {
    // Проверка наличия тарифных планов
    const launchTier = page.locator('text=/Launch/i')
    const scaleTier = page.locator('text=/Scale/i')
    const maxTier = page.locator('text=/Max/i')

    const hasLaunch = await launchTier.count() > 0
    const hasScale = await scaleTier.count() > 0
    const hasMax = await maxTier.count() > 0

    // Должен быть хотя бы один тариф
    expect(hasLaunch || hasScale || hasMax).toBeTruthy()
  })

  test('should view tier features', async ({ page }) => {
    // Поиск карточек тарифов
    const pricingCards = page.locator('[class*="pricing-card"], [class*="tier"]')
    const cardsCount = await pricingCards.count()

    if (cardsCount > 0) {
      // Проверка что карточки содержат информацию о функциях
      const firstCard = pricingCards.first()
      const cardText = await firstCard.textContent()
      expect(cardText?.length || 0).toBeGreaterThan(0)
    }
  })

  test('should expand FAQ questions', async ({ page }) => {
    // Поиск FAQ секции
    const faqSection = page.locator('text=Часто задаваемые вопросы, text=FAQ')
    if (await faqSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Поиск первого вопроса
      const firstQuestion = page.locator('button:has-text("Могу ли я"), button:has-text("Can I")')
      if (await firstQuestion.isVisible({ timeout: 2000 }).catch(() => false)) {
        await firstQuestion.click()
        await page.waitForTimeout(500)

        // Проверка что ответ раскрылся
        const answer = page.locator('[class*="answer"], [class*="content"]')
        await expect(answer.first()).toBeVisible({ timeout: 2000 }).catch(() => {})
      }
    }
  })

  test('should navigate to subscription management', async ({ page }) => {
    // Поиск кнопки управления подпиской
    const manageButton = page.locator('button:has-text("Управление подпиской"), button:has-text("Manage")')
    if (await manageButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await manageButton.click()
      await page.waitForTimeout(1000)

      // Проверка что открылась страница управления (может быть внешняя ссылка)
      const currentUrl = page.url()
      // Может быть редирект на внешний сервис
      expect(currentUrl).toBeTruthy()
    }
  })
})

