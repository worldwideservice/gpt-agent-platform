/**
 * Mobile Utility Functions
 * Helpers for mobile-specific functionality
 */

/**
 * Detect if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Detect if device is iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false

  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

/**
 * Detect if device is Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false

  return /Android/.test(navigator.userAgent)
}

/**
 * Detect if device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false

  return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)
}

/**
 * Detect if device has touch support
 */
export function hasTouch(): boolean {
  if (typeof window === 'undefined') return false

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  )
}

/**
 * Get device type
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (isTablet()) return 'tablet'
  if (isMobile()) return 'mobile'
  return 'desktop'
}

/**
 * Prevent body scroll (useful for modals on mobile)
 */
export function preventBodyScroll(prevent: boolean): void {
  if (typeof document === 'undefined') return

  if (prevent) {
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
  } else {
    const scrollY = document.body.style.top
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
  }
}

/**
 * Haptic feedback (iOS and Android)
 */
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light'): void {
  if (typeof window === 'undefined') return

  // iOS Haptic Feedback
  if (isIOS() && (window as any).webkit?.messageHandlers?.haptic) {
    ;(window as any).webkit.messageHandlers.haptic.postMessage(type)
    return
  }

  // Web Vibration API (Android and some browsers)
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      warning: [10, 50, 10, 50, 10],
      error: [30, 50, 30],
    }

    navigator.vibrate(patterns[type])
  }
}

/**
 * Detect if running as PWA
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false

  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
}

/**
 * Get safe area insets (for devices with notches)
 */
export function getSafeAreaInsets(): {
  top: number
  right: number
  bottom: number
  left: number
} {
  if (typeof window === 'undefined' || typeof getComputedStyle === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 }
  }

  const style = getComputedStyle(document.documentElement)

  return {
    top: parseInt(style.getPropertyValue('--sat') || '0', 10),
    right: parseInt(style.getPropertyValue('--sar') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
    left: parseInt(style.getPropertyValue('--sal') || '0', 10),
  }
}

/**
 * Add safe area CSS variables
 */
export function addSafeAreaVariables(): void {
  if (typeof document === 'undefined') return

  const style = document.createElement('style')
  style.innerHTML = `
    :root {
      --sat: env(safe-area-inset-top);
      --sar: env(safe-area-inset-right);
      --sab: env(safe-area-inset-bottom);
      --sal: env(safe-area-inset-left);
    }
  `
  document.head.appendChild(style)
}

/**
 * Disable zoom on input focus (iOS)
 */
export function disableIOSZoom(): void {
  if (!isIOS()) return

  const viewport = document.querySelector('meta[name=viewport]')
  if (viewport) {
    viewport.setAttribute(
      'content',
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    )
  }
}

/**
 * Enable iOS zoom (restore default)
 */
export function enableIOSZoom(): void {
  if (!isIOS()) return

  const viewport = document.querySelector('meta[name=viewport]')
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1')
  }
}

/**
 * Detect screen orientation
 */
export function getOrientation(): 'portrait' | 'landscape' {
  if (typeof window === 'undefined') return 'portrait'

  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

/**
 * Listen for orientation changes
 */
export function onOrientationChange(callback: (orientation: 'portrait' | 'landscape') => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const handler = () => callback(getOrientation())

  window.addEventListener('orientationchange', handler)
  window.addEventListener('resize', handler)

  return () => {
    window.removeEventListener('orientationchange', handler)
    window.removeEventListener('resize', handler)
  }
}

/**
 * Get viewport dimensions excluding mobile browser chrome
 */
export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') return { width: 0, height: 0 }

  return {
    width: window.innerWidth,
    height: window.visualViewport?.height || window.innerHeight,
  }
}

/**
 * Check if keyboard is visible (iOS)
 */
export function isKeyboardVisible(): boolean {
  if (typeof window === 'undefined' || !isIOS()) return false

  const viewport = window.visualViewport
  if (!viewport) return false

  return viewport.height < window.innerHeight * 0.75
}

/**
 * Smooth scroll to element (mobile-optimized)
 */
export function scrollToElement(
  element: HTMLElement,
  options: { offset?: number; behavior?: ScrollBehavior } = {}
): void {
  const { offset = 0, behavior = 'smooth' } = options

  const top = element.getBoundingClientRect().top + window.pageYOffset - offset

  window.scrollTo({
    top,
    behavior,
  })
}
