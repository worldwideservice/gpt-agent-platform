import { test, expect } from '@playwright/test'

test.describe('Admin Login', () => {
  test('should login admin user successfully', async ({ page }) => {
    // Go to login page
    await page.goto('/login')
    await expect(page).toHaveTitle('Вход в GPT Agent')

    // Fill login form
    await page.getByLabel('Email').fill('admin@worldwideservice.eu')
    await page.getByLabel('Пароль').fill('l1tmw6u977c9!Q')

    // Submit login
    await page.getByRole('button', { name: 'Войти' }).click()

    // Wait for redirect or success
    await page.waitForURL('**', { timeout: 10000 })

    const currentUrl = page.url()
    console.log('After login, redirected to:', currentUrl)

    // Should not be on login page anymore
    expect(currentUrl).not.toContain('/login')

    // Try to access protected pages
    await page.goto('/account')
    await page.waitForLoadState('networkidle')

    // Should stay on account page (not redirected to login)
    const accountUrl = page.url()
    console.log('Account page URL:', accountUrl)
    expect(accountUrl).toContain('/account')

    // Check if we can see account content
    const pageTitle = await page.title()
    console.log('Account page title:', pageTitle)

    // Try agents page
    await page.goto('/agents')
    await page.waitForLoadState('networkidle')

    const agentsUrl = page.url()
    console.log('Agents page URL:', agentsUrl)
    expect(agentsUrl).toContain('/agents')
  })

  test('should stay logged in across page reloads', async ({ page }) => {
    // Go to account page first
    await page.goto('/account')

    // If not logged in, should redirect to login
    await page.waitForURL('**/login**', { timeout: 5000 })

    // Login
    await page.getByLabel('Email').fill('admin@worldwideservice.eu')
    await page.getByLabel('Пароль').fill('l1tmw6u977c9!Q')
    await page.getByRole('button', { name: 'Войти' }).click()

    // Wait for redirect
    await page.waitForURL('**', { timeout: 10000 })

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should stay logged in
    const currentUrl = page.url()
    expect(currentUrl).not.toContain('/login')
    expect(currentUrl).toContain('/account')
  })
})
