/**
 * External Services Health Check Endpoint
 * Checks connectivity to external APIs and services
 */

// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { logger } from '@/lib/utils/logger'

interface ServiceHealth {
  name: string
  status: 'ok' | 'error' | 'degraded' | 'not_configured'
  response_time_ms?: number
  status_code?: number
  error?: string
  message?: string
}

export const GET = async (request: NextRequest) => {
  try {
    const startTime = Date.now()
    const services: ServiceHealth[] = []

    // Check OpenRouter API
    try {
      const openRouterApiKey = process.env.OPENROUTER_API_KEY

      if (!openRouterApiKey || openRouterApiKey.includes('your_key')) {
        services.push({
          name: 'OpenRouter',
          status: 'not_configured',
          message: 'API key not configured',
        })
      } else {
        const openRouterStart = Date.now()
        const response = await fetch('https://openrouter.ai/api/v1/models', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${openRouterApiKey}`,
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        })

        const responseTime = Date.now() - openRouterStart

        services.push({
          name: 'OpenRouter',
          status: response.ok ? 'ok' : 'error',
          response_time_ms: responseTime,
          status_code: response.status,
        })
      }
    } catch (error) {
      services.push({
        name: 'OpenRouter',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    // Check OpenAI API (if configured)
    try {
      const openAiApiKey = process.env.OPENAI_API_KEY

      if (!openAiApiKey || openAiApiKey.includes('your_key')) {
        services.push({
          name: 'OpenAI',
          status: 'not_configured',
          message: 'API key not configured',
        })
      } else {
        const openAiStart = Date.now()
        const response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${openAiApiKey}`,
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        })

        const responseTime = Date.now() - openAiStart

        services.push({
          name: 'OpenAI',
          status: response.ok ? 'ok' : 'error',
          response_time_ms: responseTime,
          status_code: response.status,
        })
      }
    } catch (error) {
      services.push({
        name: 'OpenAI',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    // Check Supabase API
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

      if (!supabaseUrl) {
        services.push({
          name: 'Supabase',
          status: 'not_configured',
          message: 'Supabase URL not configured',
        })
      } else {
        const supabaseStart = Date.now()
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000), // 5 second timeout
        })

        const responseTime = Date.now() - supabaseStart

        services.push({
          name: 'Supabase',
          status: response.ok || response.status === 401 ? 'ok' : 'error', // 401 means API is responding
          response_time_ms: responseTime,
          status_code: response.status,
        })
      }
    } catch (error) {
      services.push({
        name: 'Supabase',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    const totalResponseTime = Date.now() - startTime

    // Determine overall status
    const hasErrors = services.some((s) => s.status === 'error')
    const hasDegraded = services.some((s) => s.status === 'degraded')

    const overallStatus = hasErrors ? 'degraded' : hasDegraded ? 'degraded' : 'healthy'

    const health = {
      status: overallStatus,
      healthy: !hasErrors,
      timestamp: new Date().toISOString(),
      total_response_time_ms: totalResponseTime,
      services,
      summary: {
        total: services.length,
        ok: services.filter((s) => s.status === 'ok').length,
        error: services.filter((s) => s.status === 'error').length,
        degraded: services.filter((s) => s.status === 'degraded').length,
        not_configured: services.filter((s) => s.status === 'not_configured').length,
      },
    }

    // Return 503 if any critical service is down, otherwise 200
    const statusCode = hasErrors ? 503 : 200

    return NextResponse.json(health, { status: statusCode })
  } catch (error: unknown) {
    logger.error('Services health check error:', error, {
      endpoint: '/api/health/services',
      method: 'GET',
    })

    return NextResponse.json(
      {
        status: 'error',
        healthy: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown services health check error',
      },
      { status: 503 }
    )
  }
}

// HEAD method for load balancers
export const HEAD = async () => {
  try {
    // Quick check - just verify we can reach OpenRouter
    const openRouterApiKey = process.env.OPENROUTER_API_KEY

    if (!openRouterApiKey || openRouterApiKey.includes('your_key')) {
      return new NextResponse(null, { status: 200 }) // Not configured is OK
    }

    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'HEAD',
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
      },
      signal: AbortSignal.timeout(3000),
    })

    return new NextResponse(null, { status: response.ok ? 200 : 503 })
  } catch {
    return new NextResponse(null, { status: 503 })
  }
}
