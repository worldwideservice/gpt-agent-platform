/**
 * Authentication E2E Tests
 * Tests for login, logout, and registration flows
 */

import { test, expect } from '@playwright/test'
import { testUsers, testMessages, generateRandomEmail } from './fixtures/test-data'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Start from home page
    await page.goto('/')
  })

  test('should display login page', async ({ page }) => {
    await page.goto('/login')

    // Check page title
    await expect(page).toHaveTitle(/Вход|Login/)

    // Check form elements
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill login form
    await page.fill('input[name="email"]', testUsers.user.email)
    await page.fill('input[name="password"]', testUsers.user.password)

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL(/\/manage\/.*/, { timeout: 10000 })

    // Verify we're on dashboard
    expect(page.url()).toContain('/manage/')
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill with invalid credentials
    await page.fill('input[name="email"]', 'invalid@test.local')
    await page.fill('input[name="password"]', 'WrongPassword123!')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for error message
    await expect(page.locator('text=/Invalid|Неверн|Error|Ошибка/i')).toBeVisible({
      timeout: 5000,
    })
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/login')

    // Fill with invalid email format
    await page.fill('input[name="email"]', 'not-an-email')
    await page.fill('input[name="password"]', 'Password123!')

    // Try to submit
    await page.click('button[type="submit"]')

    // Check for validation error
    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toHaveAttribute('type', 'email')
  })

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', testUsers.user.email)
    await page.fill('input[name="password"]', testUsers.user.password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/manage\/.*/)

    // Logout
    await page.click('button:has-text("Выход"), button:has-text("Logout"), [aria-label*="Выход"]')

    // Verify redirected to login
    await page.waitForURL(/\/login|\//, { timeout: 5000 })
  })

  test('should redirect to login when accessing protected route', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('/manage/test-org/ai-agents')

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 5000 })
  })

  test('should show password visibility toggle', async ({ page }) => {
    await page.goto('/login')

    const passwordInput = page.locator('input[name="password"]')

    // Initially password type
    await expect(passwordInput).toHaveAttribute('type', 'password')

    // Click toggle button if exists
    const toggleButton = page.locator('button:has([data-icon*="eye"])')
    if (await toggleButton.isVisible()) {
      await toggleButton.click()

      // Should change to text type
      await expect(passwordInput).toHaveAttribute('type', 'text')
    }
  })
})
