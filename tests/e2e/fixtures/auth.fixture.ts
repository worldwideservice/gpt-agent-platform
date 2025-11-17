/**
 * Authentication Fixture
 * Provides authenticated context for tests
 */

import { test as base, expect } from '@playwright/test'
import { testUsers } from './test-data'

type AuthFixtures = {
  authenticatedPage: any
  adminPage: any
}

/**
 * Extend base test with authentication fixtures
 */
export const test = base.extend<AuthFixtures>({
  // Regular authenticated user
  authenticatedPage: async ({ page, context }, use) => {
    // Login before each test
    await page.goto('/login')

    await page.fill('input[name="email"]', testUsers.user.email)
    await page.fill('input[name="password"]', testUsers.user.password)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    await page.waitForURL(/\/manage\/.*/, { timeout: 10000 })

    await use(page)

    // Logout after test
    await page.goto('/api/auth/signout')
  },

  // Admin authenticated user
  adminPage: async ({ page, context }, use) => {
    // Login as admin
    await page.goto('/login')

    await page.fill('input[name="email"]', testUsers.admin.email)
    await page.fill('input[name="password"]', testUsers.admin.password)
    await page.click('button[type="submit"]')

    // Wait for redirect
    await page.waitForURL(/\/manage\/.*/, { timeout: 10000 })

    await use(page)

    // Logout
    await page.goto('/api/auth/signout')
  },
})

export { expect }

/**
 * Helper: Login programmatically
 */
export async function login(page: any, email: string, password: string) {
  await page.goto('/login')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/manage\/.*/, { timeout: 10000 })
}

/**
 * Helper: Logout programmatically
 */
export async function logout(page: any) {
  await page.goto('/api/auth/signout')
  await page.waitForURL('/login', { timeout: 5000 })
}

/**
 * Helper: Check if user is authenticated
 */
export async function isAuthenticated(page: any): Promise<boolean> {
  try {
    await page.goto('/')
    const url = page.url()
    return !url.includes('/login')
  } catch {
    return false
  }
}
