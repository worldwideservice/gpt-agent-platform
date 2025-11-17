/**
 * Frontend Performance Optimization Utilities
 */

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Lazy load component with retry logic
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  maxRetries: number = 3
) {
  return new Promise<{ default: T }>((resolve, reject) => {
    const attemptImport = async (retriesLeft: number) => {
      try {
        const component = await componentImport()
        resolve(component)
      } catch (error) {
        if (retriesLeft <= 0) {
          reject(error)
          return
        }

        // Exponential backoff
        const delay = Math.pow(2, maxRetries - retriesLeft) * 1000

        setTimeout(() => {
          attemptImport(retriesLeft - 1)
        }, delay)
      }
    }

    attemptImport(maxRetries)
  })
}

/**
 * Prefetch resources
 */
export function prefetch(url: string, as: 'script' | 'style' | 'image' | 'fetch' = 'fetch'): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.as = as
  link.href = url

  document.head.appendChild(link)
}

/**
 * Preload critical resources
 */
export function preload(url: string, as: 'script' | 'style' | 'image' | 'font'): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = as
  link.href = url

  if (as === 'font') {
    link.crossOrigin = 'anonymous'
  }

  document.head.appendChild(link)
}

/**
 * Measure component render time
 */
export function measureRender(
  componentName: string,
  callback?: (duration: number) => void
): void {
  if (typeof window === 'undefined' || !window.performance) return

  const markStart = `${componentName}-render-start`
  const markEnd = `${componentName}-render-end`
  const measureName = `${componentName}-render`

  // Start mark
  performance.mark(markStart)

  // Schedule end mark for next frame
  requestAnimationFrame(() => {
    performance.mark(markEnd)
    performance.measure(measureName, markStart, markEnd)

    const measure = performance.getEntriesByName(measureName)[0]
    if (measure && callback) {
      callback(measure.duration)
    }

    // Clean up marks
    performance.clearMarks(markStart)
    performance.clearMarks(markEnd)
    performance.clearMeasures(measureName)
  })
}

/**
 * Intersection Observer for lazy loading
 */
export function createLazyLoader(
  onIntersect: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
    ...options,
  }

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onIntersect(entry)
      }
    })
  }, defaultOptions)
}

/**
 * Request idle callback wrapper
 */
export function runWhenIdle(
  callback: () => void,
  options?: { timeout?: number }
): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, options)
  } else {
    setTimeout(callback, 1)
  }
}

/**
 * Web Vitals tracking
 */
export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
}

export function reportWebVitals(onReport: (metric: WebVitalsMetric) => void): void {
  if (typeof window === 'undefined') return

  // Use web-vitals library if available
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
    onCLS(onReport)
    onFID(onReport)
    onFCP(onReport)
    onLCP(onReport)
    onTTFB(onReport)
    onINP?.(onReport)
  }).catch(() => {
    // web-vitals not available
  })
}

/**
 * Image lazy loading helper
 */
export function setupLazyImages(selector: string = 'img[data-src]'): void {
  if (typeof document === 'undefined') return

  const images = document.querySelectorAll<HTMLImageElement>(selector)

  const observer = createLazyLoader((entry) => {
    const img = entry.target as HTMLImageElement
    const src = img.dataset.src

    if (src) {
      img.src = src
      img.removeAttribute('data-src')
      observer.unobserve(img)
    }
  })

  images.forEach((img) => observer.observe(img))
}

/**
 * Code splitting helper
 */
export async function loadChunk(chunkName: string): Promise<void> {
  try {
    await import(/* webpackChunkName: "[request]" */ `@/${chunkName}`)
  } catch (error) {
    console.error(`Failed to load chunk: ${chunkName}`, error)
    throw error
  }
}

/**
 * Bundle size analyzer
 */
export function analyzeBundleSize(): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return

  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]

  const scripts = entries
    .filter((entry) => entry.name.endsWith('.js'))
    .map((entry) => ({
      name: entry.name.split('/').pop() || 'unknown',
      size: entry.transferSize,
      duration: entry.duration,
    }))
    .sort((a, b) => b.size - a.size)

  console.table(scripts)
}

/**
 * Memory usage tracker
 */
export function trackMemoryUsage(): void {
  if (typeof window === 'undefined' || !(performance as any).memory) return

  const memory = (performance as any).memory

  console.log('Memory Usage:', {
    used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
    total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
    limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
  })
}

/**
 * Optimize images
 */
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpeg' | 'png'
  } = {}
): string {
  const { width, height, quality = 75, format = 'webp' } = options

  // If using Next.js Image Optimization
  if (src.startsWith('/')) {
    const params = new URLSearchParams()
    if (width) params.set('w', String(width))
    if (height) params.set('h', String(height))
    params.set('q', String(quality))
    params.set('f', format)

    return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`
  }

  return src
}
