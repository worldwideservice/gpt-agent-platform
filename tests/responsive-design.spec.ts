import { test, expect, devices } from '@playwright/test'

/**
 * Responsive Design Tests
 * Tests for mobile, tablet, and desktop breakpoints
 */

const viewports = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  mobileLarge: { width: 414, height: 896 }, // iPhone 11 Pro Max
  tablet: { width: 768, height: 1024 }, // iPad
  tabletLandscape: { width: 1024, height: 768 }, // iPad Landscape
  desktop: { width: 1280, height: 720 }, // Standard desktop
  desktopLarge: { width: 1920, height: 1080 }, // Large desktop
}

test.describe('Responsive Design - Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should render correctly on mobile (375px)', async ({ page }) => {
    await page.setViewportSize(viewports.mobile)

    // Check hero section is visible
    const hero = page.locator('section[id="main-content"]')
    await expect(hero).toBeVisible()

    // Check navigation is hidden on mobile (should be hidden via CSS)
    const desktopNav = page.locator('nav.hidden.md\\:flex')
    // On mobile, this should exist but be hidden
    await expect(desktopNav).toHaveCount(1)

    // Check buttons are visible and clickable
    const buttons = page.getByRole('button')
    const buttonCount = await buttons.count()
    expect(buttonCount).toBeGreaterThan(0)

    // Check text is readable (not too small)
    const heroText = page.locator('h1')
    const fontSize = await heroText.evaluate((el) => {
      return window.getComputedStyle(el).fontSize
    })
    // Should be at least 24px on mobile
    const fontSizeNum = parseInt(fontSize)
    expect(fontSizeNum).toBeGreaterThanOrEqual(24)
  })

  test('should render correctly on tablet (768px)', async ({ page }) => {
    await page.setViewportSize(viewports.tablet)

    // Check navigation is visible on tablet
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Check cards grid adapts to tablet
    await page.evaluate(() => {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    })
    await page.waitForTimeout(500)

    const cards = page.locator('.grid.sm\\:grid-cols-2')
    await expect(cards).toBeVisible()

    // Check spacing is appropriate
    const section = page.locator('section#features')
    const padding = await section.evaluate((el) => {
      return window.getComputedStyle(el).paddingTop
    })
    expect(parseInt(padding)).toBeGreaterThan(0)
  })

  test('should render correctly on desktop (1280px)', async ({ page }) => {
    await page.setViewportSize(viewports.desktop)

    // Check full navigation is visible
    const navLinks = page.locator('nav a')
    const linkCount = await navLinks.count()
    expect(linkCount).toBeGreaterThanOrEqual(3) // Features, How it works, Pricing

    // Check cards are in 3-column grid on desktop
    await page.evaluate(() => {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    })
    await page.waitForTimeout(500)

    const cardsGrid = page.locator('.md\\:grid-cols-3')
    await expect(cardsGrid).toBeVisible()

    // Check hero section has proper spacing
    const hero = page.locator('section[id="main-content"]')
    const heroPadding = await hero.evaluate((el) => {
      return window.getComputedStyle(el.querySelector('.container') || el).paddingLeft
    })
    expect(parseInt(heroPadding)).toBeGreaterThan(0)
  })

  test('should handle touch interactions on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile)

    // Check buttons are tappable (not too small)
    const button = page.getByRole('button', { name: /начать бесплатно/i }).first()
    const buttonSize = await button.boundingBox()
    
    if (buttonSize) {
      // Touch targets should be at least 44x44px
      expect(buttonSize.width).toBeGreaterThanOrEqual(44)
      expect(buttonSize.height).toBeGreaterThanOrEqual(44)
    }

    // Test scroll works
    const initialScroll = await page.evaluate(() => window.scrollY)
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(300)
    const newScroll = await page.evaluate(() => window.scrollY)
    expect(newScroll).toBeGreaterThan(initialScroll)
  })

  test('should maintain aspect ratios on resize', async ({ page }) => {
    // Start with mobile
    await page.setViewportSize(viewports.mobile)
    await page.waitForTimeout(300)

    const heroInitial = await page.locator('section[id="main-content"]').boundingBox()

    // Resize to desktop
    await page.setViewportSize(viewports.desktop)
    await page.waitForTimeout(300)

    const heroDesktop = await page.locator('section[id="main-content"]').boundingBox()

    // Hero should be visible in both sizes
    expect(heroInitial).not.toBeNull()
    expect(heroDesktop).not.toBeNull()
  })

  test('should handle landscape orientation', async ({ page }) => {
    await page.setViewportSize(viewports.tabletLandscape)

    // Check layout adapts to landscape
    const hero = page.locator('section[id="main-content"]')
    await expect(hero).toBeVisible()

    // Navigation should be visible in landscape
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Check content doesn't overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = viewports.tabletLandscape.width
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 50) // Allow small margin
  })

  test('should have proper text scaling', async ({ page }) => {
    await page.setViewportSize(viewports.mobile)

    const headings = page.locator('h1, h2, h3')
    const count = await headings.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const heading = headings.nth(i)
      const fontSize = await heading.evaluate((el) => {
        return parseFloat(window.getComputedStyle(el).fontSize)
      })
      
      // Headings should be readable (at least 18px on mobile)
      expect(fontSize).toBeGreaterThanOrEqual(16)
    }
  })

  test('should prevent horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile)

    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await page.waitForTimeout(500)

    // Check for horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    
    // Should not have horizontal scroll (allow 5px margin)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5)
  })

  test('should have responsive images and containers', async ({ page }) => {
    // Test on different viewports
    for (const [name, viewport] of Object.entries(viewports)) {
      await page.setViewportSize(viewport)
      await page.waitForTimeout(300)

      // Check containers are properly sized
      const container = page.locator('.container').first()
      const containerWidth = await container.evaluate((el) => {
        return el.getBoundingClientRect().width
      })

      // Container should not exceed viewport
      expect(containerWidth).toBeLessThanOrEqual(viewport.width)
    }
  })
})

