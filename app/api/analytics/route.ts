import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per minute
})

interface AnalyticsEvent {
  event: string
  category?: string
  action?: string
  label?: string
  value?: number
  userId?: string
  sessionId?: string
  timestamp: number
  userAgent?: string
  url?: string
  referrer?: string
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    try {
      await limiter.check(10, 'ANALYTICS_CACHE_TOKEN') // 10 requests per minute
    } catch {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body: AnalyticsEvent = await request.json()

    // Validate required fields
    if (!body.event) {
      return NextResponse.json(
        { error: 'Event name is required' },
        { status: 400 }
      )
    }

    // Add server-side data
    const enrichedEvent: AnalyticsEvent = {
      ...body,
      timestamp: body.timestamp || Date.now(),
      userAgent: request.headers.get('user-agent') || undefined,
      url: request.headers.get('referer') || undefined,
    }

    // Log the event (in production, you'd send to analytics service)
    console.log('Analytics Event:', enrichedEvent)

    // In production, you would send to your analytics service
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, Google Analytics, Mixpanel, etc.
      await sendToAnalyticsService(enrichedEvent)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendToAnalyticsService(event: AnalyticsEvent) {
  try {
    // Example: Send to Google Analytics 4
    if (process.env.GA_MEASUREMENT_ID && process.env.GA_API_SECRET) {
      const response = await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: event.sessionId || 'unknown',
            events: [{
              name: event.event,
              params: {
                category: event.category,
                action: event.action,
                label: event.label,
                value: event.value,
                user_id: event.userId,
                page_location: event.url,
                page_referrer: event.referrer,
              },
            }],
          }),
        }
      )

      if (!response.ok) {
        console.error('Failed to send to Google Analytics:', response.statusText)
      }
    }

    // Example: Send to Mixpanel
    if (process.env.MIXPANEL_TOKEN) {
      const response = await fetch('https://api.mixpanel.com/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          data: JSON.stringify([{
            event: event.event,
            properties: {
              ...event,
              token: process.env.MIXPANEL_TOKEN,
              distinct_id: event.userId || event.sessionId || 'anonymous',
            },
          }]),
        }),
      })

      if (!response.ok) {
        console.error('Failed to send to Mixpanel:', response.statusText)
      }
    }
  } catch (error) {
    console.error('Failed to send analytics:', error)
  }
}