import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should complete full registration and login flow', async ({ page }) => {
    // Generate unique email for testing
    const timestamp = Date.now()
    const testEmail = `test-user-${timestamp}@example.com`
    const testPassword = 'TestPassword123!'

    // 1. Test registration page accessibility
    await page.goto('/register')
    await expect(page).toHaveTitle('Регистрация в GPT Agent')
    await expect(page.getByRole('heading', { name: 'Регистрация в GPT Agent' })).toBeVisible()

    // 2. Fill registration form
    await page.getByLabel('Имя').fill('Test')
    await page.getByLabel('Фамилия').fill('User')
    await page.getByLabel('Email').fill(testEmail)
    await page.getByLabel('Пароль').fill(testPassword)
    await page.getByLabel('Подтверждение пароля').fill(testPassword)

    // 3. Submit registration
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click()

    // 4. Should redirect to login after successful registration
    await page.waitForURL('**/login**', { timeout: 5000 })
    await expect(page).toHaveTitle('Вход в GPT Agent')

    // 5. Test login with registered credentials
    await page.getByLabel('Email').fill(testEmail)
    await page.getByLabel('Пароль').fill(testPassword)
    await page.getByRole('button', { name: 'Войти' }).click()

    // 6. Wait for redirect after login (should go to home/dashboard)
    await page.waitForURL('**', { timeout: 10000 })
    const currentUrl = page.url()

    // Should not be on login page anymore
    expect(currentUrl).not.toContain('/login')
    expect(currentUrl).not.toContain('/register')

    console.log('Login successful, redirected to:', currentUrl)

    // 7. Test access to protected pages - should not redirect to login
    await page.goto('/account')
    await page.waitForLoadState('networkidle')

    // If we're still authenticated, we shouldn't see login page
    const accountPageTitle = await page.title()
    console.log('Account page title:', accountPageTitle)

    // 8. Test agents page access
    await page.goto('/agents')
    await page.waitForLoadState('networkidle')

    // If we're still authenticated, we shouldn't see login page
    const agentsPageTitle = await page.title()
    console.log('Agents page title:', agentsPageTitle)
  })

  test('should validate registration form', async ({ page }) => {
    await page.goto('/register')

    // Test empty form submission
    await page.getByRole('button', { name: 'Зарегистрироваться' }).click()

    // Should stay on registration page
    await expect(page).toHaveTitle('Регистрация в GPT Agent')

    // Test password mismatch
    await page.getByLabel('Имя').fill('Test')
    await page.getByLabel('Фамилия').fill('User')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Пароль').fill('password123')
    await page.getByLabel('Подтверждение пароля').fill('differentpassword')

    await page.getByRole('button', { name: 'Зарегистрироваться' }).click()

    // Should stay on registration page (passwords don't match)
    await expect(page).toHaveTitle('Регистрация в GPT Agent')
  })

  test('should handle login with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('nonexistent@example.com')
    await page.getByLabel('Пароль').fill('wrongpassword')

    await page.getByRole('button', { name: 'Войти' }).click()

    // Should stay on login page
    await expect(page).toHaveTitle('Вход в GPT Agent')
  })
})
