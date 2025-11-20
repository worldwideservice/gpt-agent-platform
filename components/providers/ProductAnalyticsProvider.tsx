'use client'

import { type ReactNode, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { AnalyticsBrowser } from '@segment/analytics-next'

const DEFAULT_POSTHOG_HOST = 'https://app.posthog.com'

declare global {
  interface Window {
    __SEGMENT_ANALYTICS__?: ReturnType<typeof AnalyticsBrowser.load>
    __POSTHOG_INITIALIZED__?: boolean
  }
}

export type ProductAnalyticsContext = 'public' | 'app'

interface ProductAnalyticsProviderProps {
  children: ReactNode
  context?: ProductAnalyticsContext
}

function getCurrentUrl(pathname: string, searchParams: ReturnType<typeof useSearchParams>): string | null {
  if (!searchParams || searchParams.size === 0) {
    return pathname
  }

  const query = searchParams.toString()
  return query ? `${pathname}?${query}` : pathname
}

export function ProductAnalyticsProvider({
  children,
  context = 'public',
}: ProductAnalyticsProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const segmentKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || DEFAULT_POSTHOG_HOST

    if (segmentKey && !window.__SEGMENT_ANALYTICS__) {
      window.__SEGMENT_ANALYTICS__ = AnalyticsBrowser.load({
        writeKey: segmentKey,
      })
    }

    if (posthogKey && !window.__POSTHOG_INITIALIZED__) {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        capture_pageview: false,
        capture_pageleave: true,
        person_profiles: 'identified_only',
        persistence: 'localStorage+cookie',
        property_denylist: ['credit_card', 'password', 'token'],
      })
      window.__POSTHOG_INITIALIZED__ = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const url = getCurrentUrl(pathname, searchParams)
    if (!url) return
    
    const pageProperties = {
      url,
      context,
    }

    if (window.__SEGMENT_ANALYTICS__) {
      window.__SEGMENT_ANALYTICS__.then(([analytics]) => {
        analytics.page({
          name: context === 'app' ? 'Cabinet Page View' : 'Public Page View',
          properties: pageProperties,
        })
      })
    }

    if (window.__POSTHOG_INITIALIZED__) {
      posthog.capture('$pageview', pageProperties)
    }
  }, [context, pathname, searchParams])

  return <>{children}</>
}
