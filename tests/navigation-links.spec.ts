import { test, expect } from '@playwright/test'

test.describe('Public navigation flow', () => {
  test('landing page header links lead to pricing and support', async ({ page }) => {
    await page.goto('/')

    const pricingLink = page.getByRole('link', { name: 'Тарифы' })
    const supportLink = page.getByRole('link', { name: 'Поддержка' })
    const demoLink = page.getByRole('link', { name: 'Демо' })

    await expect(pricingLink).toBeVisible()
    await expect(supportLink).toBeVisible()
    await expect(demoLink).toBeVisible()

    await pricingLink.click()
    await page.waitForURL('**/pricing')
    await expect(page).toHaveURL(/\/pricing$/)

    await expect(page.getByText('30 дней гарантии возврата денег')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Подберите подходящий план/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Launch' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Scale' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Max' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ежемесячно' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ежегодно' })).toBeVisible()

    const select = page.locator('select').first()
    await expect(select).toBeVisible()

    await page.goto('/')
    await supportLink.click()
    await page.waitForURL('**/support')
    await expect(page).toHaveURL(/\/support$/)

    await expect(page.getByRole('heading', { name: 'Поддержка и обучение' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Начало работы' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Видеоуроки' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Документация' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'FAQ' })).toBeVisible()

    const createAccountLink = page.getByRole('link', { name: 'Создать аккаунт' })
    const loginLink = page.getByRole('link', { name: 'Войти' })
    await expect(createAccountLink).toHaveAttribute('href', '/register')
    await expect(loginLink).toHaveAttribute('href', '/login')
  })

  test('landing CTA directs to registration flow', async ({ page }) => {
    await page.goto('/')

    const primaryCta = page.getByRole('link', { name: 'Начать бесплатно' })
    await expect(primaryCta).toHaveAttribute('href', '/register')

    await primaryCta.click()
    await page.waitForURL('**/register')
    await expect(page).toHaveTitle(/Регистрация/i)
  })
})
