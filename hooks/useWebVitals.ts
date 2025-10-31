import { useEffect } from 'react'
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals'
import { analytics } from '@/lib/analytics'

interface WebVitalsMetrics {
  CLS: number | null
  FID: number | null
  FCP: number | null
  LCP: number | null
  TTFB: number | null
}

export const useWebVitals = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const metrics: WebVitalsMetrics = {
      CLS: null,
      FID: null,
      FCP: null,
      LCP: null,
      TTFB: null,
    }

    // Cumulative Layout Shift
    onCLS((metric) => {
      metrics.CLS = metric.value
      console.log('CLS:', metric.value)
      analytics.trackPerformance('CLS', metric.value)
    })

    // First Input Delay (deprecated, but keeping for compatibility)
    // onFID is not available in newer web-vitals versions
    // console.log('FID: Deprecated metric')

    // First Contentful Paint
    onFCP((metric) => {
      metrics.FCP = metric.value
      console.log('FCP:', metric.value)
      analytics.trackPerformance('FCP', metric.value)
    })

    // Largest Contentful Paint
    onLCP((metric) => {
      metrics.LCP = metric.value
      console.log('LCP:', metric.value)
      analytics.trackPerformance('LCP', metric.value)
    })

    // Time to First Byte
    onTTFB((metric) => {
      metrics.TTFB = metric.value
      console.log('TTFB:', metric.value)
      analytics.trackPerformance('TTFB', metric.value)
    })

    // Track navigation timing
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        console.log('Navigation timing:', {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalTime: navigation.loadEventEnd - navigation.fetchStart,
        })
      }
    }

    return () => {
      // Cleanup if needed
    }
  }, [])
}

