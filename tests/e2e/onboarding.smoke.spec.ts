import { test, expect } from '@playwright/test'

test.describe('Онбординг администратора', () => {
  const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'founder@example.com'
  const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? 'Demo1234!'

  test('после входа открывается мастер онбординга', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: 'Вход в GPT Agent' })).toBeVisible()

    await page.getByLabel('Email').fill(adminEmail)
    await page.getByLabel('Пароль').fill(adminPassword)

    await Promise.all([
      page.waitForURL((url) => url.pathname === '/onboarding', { waitUntil: 'networkidle' }),
      page.getByRole('button', { name: 'Войти' }).click(),
    ])

    await expect(page).toHaveURL((url) => url.pathname === '/onboarding')
    await expect(page.getByText('Добро пожаловать! Настроим систему за 3 шага')).toBeVisible()
  })
})
