/**
 * Accessibility Utilities
 * Helper functions for improving accessibility
 */

/**
 * Announce message to screen readers using ARIA live region
 * @param message Message to announce
 * @param priority 'polite' (wait for pause) or 'assertive' (interrupt)
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  // Create or get existing live region
  let liveRegion = document.getElementById('a11y-live-region') as HTMLDivElement

  if (!liveRegion) {
    liveRegion = document.createElement('div')
    liveRegion.id = 'a11y-live-region'
    liveRegion.setAttribute('role', 'status')
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    document.body.appendChild(liveRegion)
  }

  // Update priority if needed
  liveRegion.setAttribute('aria-live', priority)

  // Clear and set new message
  liveRegion.textContent = ''
  setTimeout(() => {
    liveRegion.textContent = message
  }, 100)

  // Clear after announcement
  setTimeout(() => {
    liveRegion.textContent = ''
  }, 3000)
}

/**
 * Generate unique ID for ARIA relationships
 * @param prefix Optional prefix for the ID
 */
export function generateAriaId(prefix = 'aria'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Trap focus within an element
 * @param element Container element
 * @returns Cleanup function
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableSelector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

  const focusableElements = Array.from(
    element.querySelectorAll<HTMLElement>(focusableSelector)
  )

  if (focusableElements.length === 0) return () => {}

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  // Store previously focused element
  const previouslyFocused = document.activeElement as HTMLElement

  // Focus first element
  firstElement.focus()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown)

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown)
    if (previouslyFocused) {
      previouslyFocused.focus()
    }
  }
}

/**
 * Manage focus restoration after temporary UI changes
 */
export class FocusManager {
  private previousElement: HTMLElement | null = null

  /**
   * Store current focus
   */
  capture(): void {
    this.previousElement = document.activeElement as HTMLElement
  }

  /**
   * Restore previous focus
   */
  restore(): void {
    if (this.previousElement) {
      this.previousElement.focus()
      this.previousElement = null
    }
  }

  /**
   * Move focus to element
   */
  moveTo(element: HTMLElement | null): void {
    if (element) {
      element.focus()
    }
  }
}

/**
 * Check if element is visible and focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.hasAttribute('disabled')) return false
  if (element.getAttribute('tabindex') === '-1') return false

  const style = window.getComputedStyle(element)
  if (style.display === 'none') return false
  if (style.visibility === 'hidden') return false
  if (parseFloat(style.opacity) === 0) return false

  return true
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(isFocusable)
}

/**
 * Create accessible label association
 * @param labelId ID of label element
 * @param inputId ID of input element
 */
export function associateLabelWithInput(labelId: string, inputId: string): void {
  const label = document.getElementById(labelId)
  const input = document.getElementById(inputId)

  if (label && input) {
    label.setAttribute('for', inputId)
    input.setAttribute('aria-labelledby', labelId)
  }
}

/**
 * Enhance element with ARIA description
 */
export function addAriaDescription(element: HTMLElement, description: string): void {
  const descId = generateAriaId('desc')
  const descElement = document.createElement('span')
  descElement.id = descId
  descElement.className = 'sr-only'
  descElement.textContent = description

  element.appendChild(descElement)
  element.setAttribute('aria-describedby', descId)
}

/**
 * Check color contrast ratio (WCAG AA compliance)
 * @param foreground Foreground color (hex)
 * @param background Background color (hex)
 * @returns Contrast ratio
 */
export function getContrastRatio(foreground: string, background: string): number {
  const getLuminance = (color: string): number => {
    const rgb = parseInt(color.substring(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff

    const rsRGB = r / 255
    const gsRGB = g / 255
    const bsRGB = b / 255

    const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
    const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
    const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
  }

  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast meets WCAG AA standards
 * @param foreground Foreground color
 * @param background Background color
 * @param isLargeText Whether text is large (18pt+ or 14pt+ bold)
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  isLargeText = false
): boolean {
  const ratio = getContrastRatio(foreground, background)
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * Check if contrast meets WCAG AAA standards
 */
export function meetsWCAGAAA(
  foreground: string,
  background: string,
  isLargeText = false
): boolean {
  const ratio = getContrastRatio(foreground, background)
  return isLargeText ? ratio >= 4.5 : ratio >= 7
}

/**
 * Roving tabindex manager for keyboard navigation in lists
 */
export class RovingTabIndex {
  private elements: HTMLElement[]
  private currentIndex = 0

  constructor(container: HTMLElement, itemSelector: string) {
    this.elements = Array.from(container.querySelectorAll<HTMLElement>(itemSelector))
    this.init()
  }

  private init(): void {
    this.elements.forEach((el, index) => {
      el.setAttribute('tabindex', index === 0 ? '0' : '-1')

      el.addEventListener('keydown', (e) => this.handleKeyDown(e, index))
      el.addEventListener('focus', () => this.setCurrentIndex(index))
    })
  }

  private handleKeyDown(event: KeyboardEvent, index: number): void {
    let newIndex = index

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        newIndex = (index + 1) % this.elements.length
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        newIndex = (index - 1 + this.elements.length) % this.elements.length
        break
      case 'Home':
        event.preventDefault()
        newIndex = 0
        break
      case 'End':
        event.preventDefault()
        newIndex = this.elements.length - 1
        break
      default:
        return
    }

    this.setCurrentIndex(newIndex)
    this.elements[newIndex].focus()
  }

  private setCurrentIndex(index: number): void {
    this.elements[this.currentIndex].setAttribute('tabindex', '-1')
    this.currentIndex = index
    this.elements[this.currentIndex].setAttribute('tabindex', '0')
  }

  destroy(): void {
    this.elements.forEach((el) => {
      el.removeAttribute('tabindex')
    })
  }
}
