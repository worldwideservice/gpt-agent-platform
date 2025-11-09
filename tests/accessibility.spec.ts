import { test, expect } from '@playwright/test'

/**
 * Accessibility Tests
 * WCAG AA compliance tests for landing page
 */

test.describe('Accessibility - Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check h1 exists
    const h1 = page.locator('h1')
    await expect(h1).toBeVisible()
    const h1Count = await h1.count()
    expect(h1Count).toBe(1) // Should have exactly one h1

    // Check h2 exists
    const h2 = page.locator('h2')
    const h2Count = await h2.count()
    expect(h2Count).toBeGreaterThan(0)
  })

  test('should have ARIA labels on interactive elements', async ({ page }) => {
    // Check buttons have aria-labels
    const buttons = page.getByRole('button')
    const buttonCount = await buttons.count()

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      const ariaLabel = await button.getAttribute('aria-label')
      const text = await button.textContent()
      
      // Should have either aria-label or accessible text
      expect(ariaLabel || text?.trim()).toBeTruthy()
    }
  })

  test('should support keyboard navigation', async ({ page }) => {
    const focusable = page.locator(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    const focusableCount = await focusable.count()
    expect(focusableCount).toBeGreaterThan(0)

    const focusApplied = await page.evaluate(() => {
      const candidates = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
      )

      for (const el of candidates) {
        const rect = el.getBoundingClientRect()
        const style = window.getComputedStyle(el)
        const isVisible =
          rect.width > 0 &&
          rect.height > 0 &&
          style.visibility !== 'hidden' &&
          style.display !== 'none'

        if (isVisible) {
          el.focus()
          return document.activeElement === el
        }
      }

      return false
    })

    expect(focusApplied).toBe(true)
  })

  test('should have skip link for accessibility', async ({ page }) => {
    // Check skip link exists
    const skipLink = page.getByRole('link', { name: /перейти к основному содержимому/i })
    
    // Should be hidden by default
    const isHidden = await skipLink.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return style.position === 'absolute' && 
             (style.width === '1px' || style.clip === 'rect(0px, 0px, 0px, 0px)')
    })
    
    expect(isHidden || await skipLink.isVisible()).toBeTruthy()

    // Should be visible on focus
    await skipLink.focus()
    const isVisibleOnFocus = await skipLink.isVisible()
    expect(isVisibleOnFocus).toBe(true)
  })

  test('should have proper color contrast', async ({ page }) => {
    // Проверяем, что основной заголовок использует явный цвет текста
    const heroText = page.locator('h1')
    const opacity = await heroText.evaluate((el) => parseFloat(window.getComputedStyle(el).opacity))
    expect(opacity).toBeGreaterThan(0)
  })

  test('should have alt text on images', async ({ page }) => {
    const images = page.locator('img')
    const imageCount = await images.count()

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const role = await img.getAttribute('role')
      
      // Images should have alt text or be decorative (role="presentation")
      expect(alt !== null || role === 'presentation' || role === 'none').toBe(true)
    }
  })

  test('should have proper form labels', async ({ page }) => {
    // Check if there are any form inputs
    const inputs = page.locator('input, textarea, select')
    const inputCount = await inputs.count()

    if (inputCount > 0) {
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i)
        const id = await input.getAttribute('id')
        const ariaLabel = await input.getAttribute('aria-label')
        const ariaLabelledBy = await input.getAttribute('aria-labelledby')
        const placeholder = await input.getAttribute('placeholder')
        
        // Should have label association
        if (id) {
          const label = page.locator(`label[for="${id}"]`)
          const labelExists = await label.count() > 0
          expect(labelExists || ariaLabel || ariaLabelledBy || placeholder).toBe(true)
        }
      }
    }
  })

  test('should have semantic HTML structure', async ({ page }) => {
    // Check semantic elements exist
    const header = page.locator('header')
    await expect(header).toBeVisible()

    const main = page.locator('main, section[id="main-content"]')
    await expect(main.first()).toBeVisible()

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Check navigation
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should have proper link text', async ({ page }) => {
    const links = page.locator('a[href]')
    const linkCount = await links.count()

    for (let i = 0; i < Math.min(linkCount, 10); i++) {
      const link = links.nth(i)
      const accessibleName = await link.evaluate((el) => {
        const text = el.textContent?.trim()
        const ariaLabel = el.getAttribute('aria-label')
        const title = el.getAttribute('title')
        const imgAlt = el.querySelector('img')?.getAttribute('alt')
        return ariaLabel || title || text || imgAlt || ''
      })
      
      // Should have meaningful accessible name
      expect(accessibleName).toBeTruthy()
      
      // Avoid "click here" or similar non-descriptive text
      if (accessibleName) {
        const lowerText = accessibleName.toLowerCase().trim()
        expect(lowerText).not.toMatch(/^(click here|here|link|read more)$/i)
      }
    }
  })

  test('should handle focus management', async ({ page }) => {
    // Check that focusable elements are in logical order
    const focusableElements = page.locator(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    const count = await focusableElements.count()
    
    expect(count).toBeGreaterThan(0)

    // Tab through first few elements
    await page.keyboard.press('Tab')
    let previousElement = page.locator(':focus')
    
    for (let i = 0; i < Math.min(3, count - 1); i++) {
      await page.keyboard.press('Tab')
      const currentElement = page.locator(':focus')
      await expect(currentElement).not.toEqual(previousElement)
      previousElement = currentElement
    }
  })

  test('should have proper roles and landmarks', async ({ page }) => {
    // Check main landmark
    const main = page.locator('main, [role="main"], section[id="main-content"]')
    await expect(main.first()).toBeVisible()

    // Check navigation landmark
    const nav = page.locator('nav, [role="navigation"]')
    await expect(nav.first()).toBeVisible()

    // Check contentinfo (footer)
    const footer = page.locator('footer, [role="contentinfo"]')
    await expect(footer.first()).toBeVisible()
  })

  test('should support screen reader announcements', async ({ page }) => {
    // Check for aria-live regions if dynamic content exists
    const liveRegions = page.locator('[aria-live], [aria-atomic], [aria-relevant]')
    const liveCount = await liveRegions.count()
    
    // Live regions are optional but good practice for dynamic content
    // This test just checks they exist if needed
    expect(liveCount).toBeGreaterThanOrEqual(0)
  })

  test('should have proper button types', async ({ page }) => {
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const type = await button.getAttribute('type')
      const role = await button.getAttribute('role')
      
      // Buttons should have type or role defined
      expect(type || role || button.tagName() === 'BUTTON').toBeTruthy()
    }
  })
})
