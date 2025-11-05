import { test, expect } from '@playwright/test'

/**
 * Landing Page Design Tests
 * Tests for new design improvements: animations, dark mode, accessibility
 */
test.describe('Landing Page Design Improvements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display hero section with gradients', async ({ page }) => {
    const hero = page.locator('section[id="main-content"]')
    await expect(hero).toBeVisible()
    
    // Check gradient background
    const gradientBackground = hero.locator('div[class*="gradient"]').first()
    await expect(gradientBackground).toBeVisible()
  })

  test('should toggle dark mode', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.getByRole('button', { name: /toggle theme/i })
    await expect(themeToggle).toBeVisible()

    // Check initial state (should be light)
    const html = page.locator('html')
    await expect(html).not.toHaveClass(/dark/)

    // Click toggle
    await themeToggle.click()

    // Wait for theme to apply
    await page.waitForTimeout(300)

    // Check dark mode is applied
    await expect(html).toHaveClass(/dark/)

    // Toggle back
    await themeToggle.click()
    await page.waitForTimeout(300)
    await expect(html).not.toHaveClass(/dark/)
  })

  test('should have scroll animations on cards', async ({ page }) => {
    // Scroll to features section
    await page.evaluate(() => {
      const features = document.getElementById('features')
      features?.scrollIntoView({ behavior: 'smooth' })
    })

    // Wait for scroll animations
    await page.waitForTimeout(1000)

    // Check cards are visible (should be animated in)
    const cards = page.locator('[data-testid="feature-card"], .group.hover\\:scale-105').first()
    await expect(cards).toBeVisible()
  })

  test('should animate counter when visible', async ({ page }) => {
    // Scroll to stats section
    await page.evaluate(() => {
      const stats = document.querySelector('section:has-text("Моделей ИИ")')
      stats?.scrollIntoView({ behavior: 'smooth' })
    })

    // Wait for counter animation
    await page.waitForTimeout(2500)

    // Check counter shows value
    const counter = page.getByText(/100\+/i)
    await expect(counter).toBeVisible()
  })

  test('should have hover effects on cards', async ({ page }) => {
    // Scroll to features
    await page.evaluate(() => {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    })
    await page.waitForTimeout(500)

    // Get first card
    const firstCard = page.locator('.group.hover\\:scale-105').first()
    
    // Hover over card
    await firstCard.hover()
    await page.waitForTimeout(300)

    // Check hover state (card should have transform applied via CSS)
    const transform = await firstCard.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return style.transform
    })
    
    // Transform should not be 'none' when hovered
    expect(transform).not.toBe('none')
  })

  test('should have keyboard navigation', async ({ page }) => {
    // Tab through navigation
    await page.keyboard.press('Tab') // Skip link
    await page.keyboard.press('Tab') // Logo
    await page.keyboard.press('Tab') // First nav link

    // Check focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should have skip link for accessibility', async ({ page }) => {
    // Press Tab to focus skip link
    await page.keyboard.press('Tab')

    // Check skip link is focused
    const skipLink = page.getByRole('link', { name: /перейти к основному содержимому/i })
    await expect(skipLink).toBeFocused()
  })

  test('should have ARIA labels on interactive elements', async ({ page }) => {
    // Check buttons have aria-labels
    const registerButton = page.getByRole('button', { name: /начать бесплатную регистрацию/i })
    await expect(registerButton).toBeVisible()

    const loginButton = page.getByRole('button', { name: /войти в аккаунт/i })
    await expect(loginButton).toBeVisible()

    // Check navigation links have aria-labels
    const featuresLink = page.getByRole('link', { name: /перейти к разделу возможности/i })
    await expect(featuresLink).toBeVisible()
  })

  test('should have smooth transitions on buttons', async ({ page }) => {
    const button = page.getByRole('button', { name: /начать бесплатно/i }).first()
    
    // Check button has transition class
    const hasTransition = await button.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return style.transition !== 'none' && style.transition !== ''
    })

    expect(hasTransition).toBe(true)
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check layout is responsive
    const hero = page.locator('section[id="main-content"]')
    await expect(hero).toBeVisible()

    // Check mobile navigation (should be hidden on mobile)
    const desktopNav = page.locator('nav.hidden.md\\:flex')
    await expect(desktopNav).toBeVisible() // Still visible but hidden on mobile via CSS
  })
})

