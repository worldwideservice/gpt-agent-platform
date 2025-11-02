import { test, expect } from '@playwright/test'

const TEST_EMAIL = process.env.TEST_USER_EMAIL ?? 'founder@example.com'
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD ?? 'Demo1234!'

test.describe('Tenant navigation for authenticated users', () => {
  test('logs in and opens key sections inside /manage/[tenantId]', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill(TEST_EMAIL)
    await page.getByLabel('Пароль').fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Войти' }).click()

    await page.waitForURL('**/manage/**', { timeout: 30000 })
    const dashboardUrl = new URL(page.url())
    const match = dashboardUrl.pathname.match(/\/manage\/([^/]+)/)
    expect(match).not.toBeNull()
    const tenantId = match?.[1] as string

    const sidebar = page.locator('aside')
    await expect(sidebar).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Инфопанель', exact: false })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Агенты ИИ', exact: false })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Тестовый чат', exact: false })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Поддержка', exact: false })).toHaveAttribute(
      'href',
      `/manage/${tenantId}/support`
    )
    await expect(sidebar.getByRole('link', { name: 'Интеграции', exact: false })).toHaveAttribute(
      'href',
      `/manage/${tenantId}/integrations`
    )
    await expect(sidebar.getByRole('link', { name: 'Тарифы', exact: false })).toHaveAttribute(
      'href',
      `/manage/${tenantId}/pricing`
    )

    await sidebar.getByRole('link', { name: 'Агенты ИИ', exact: false }).click()
    await page.waitForURL(`**/manage/${tenantId}/ai-agents**`)
    await expect(page.locator('main')).toBeVisible()

    await sidebar.getByRole('link', { name: 'Поддержка', exact: false }).click()
    await page.waitForURL(`**/manage/${tenantId}/support`)
    await expect(page.getByRole('heading', { name: 'Центр поддержки' })).toBeVisible()

    await sidebar.getByRole('link', { name: 'Интеграции', exact: false }).click()
    await page.waitForURL(`**/manage/${tenantId}/integrations`)
    await expect(page.getByRole('heading', { name: 'Интеграции' })).toBeVisible()
  })
})
