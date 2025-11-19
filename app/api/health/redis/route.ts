/**
 * Redis Health Check Endpoint
 * Provides detailed Redis connectivity and performance metrics
 */

// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { checkCacheHealth } from '@/lib/cache'
import { logger } from '@/lib/utils/logger'

export const GET = async (request: NextRequest) => {
  try {
    const startTime = Date.now()

    // Check if Redis is configured
    const redisUrl = process.env.REDIS_URL
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL

    if ((!redisUrl || redisUrl.includes('your-redis-host')) && !upstashUrl) {
      return NextResponse.json(
        {
          status: 'not_configured',
          healthy: false,
          timestamp: new Date().toISOString(),
          message: 'Redis is not configured. Set REDIS_URL or UPSTASH_REDIS_REST_URL environment variable.',
          response_time_ms: Date.now() - startTime,
        },
        { status: 200 } // Not an error, just not configured
      )
    }

    // Check Redis health
    const cacheHealth = await checkCacheHealth()
    const responseTime = Date.now() - startTime

    if (!cacheHealth.healthy) {
      logger.warn('Redis health check failed', {
        error: cacheHealth.error,
        endpoint: '/api/health/redis',
      })

      return NextResponse.json(
        {
          status: 'error',
          healthy: false,
          timestamp: new Date().toISOString(),
          error: cacheHealth.error || 'Redis health check failed',
          response_time_ms: responseTime,
        },
        { status: 503 }
      )
    }

    const health = {
      status: 'ok',
      healthy: true,
      timestamp: new Date().toISOString(),
      response_time_ms: responseTime,
      redis: {
        connected: true,
        backend: upstashUrl ? 'Upstash' : 'Redis',
        stats: cacheHealth.stats || {},
      },
      performance: {
        ping_time_ms: responseTime,
        status: responseTime < 50 ? 'excellent' : responseTime < 100 ? 'good' : 'slow',
      },
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error: unknown) {
    logger.error('Redis health check error:', error, {
      endpoint: '/api/health/redis',
      method: 'GET',
    })

    return NextResponse.json(
      {
        status: 'error',
        healthy: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown Redis error',
      },
      { status: 503 }
    )
  }
}

// HEAD method for load balancers
export const HEAD = async () => {
  try {
    const redisUrl = process.env.REDIS_URL
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL

    if ((!redisUrl || redisUrl.includes('your-redis-host')) && !upstashUrl) {
      return new NextResponse(null, { status: 200 }) // Not configured is OK
    }

    const cacheHealth = await checkCacheHealth()

    return new NextResponse(null, { status: cacheHealth.healthy ? 200 : 503 })
  } catch {
    return new NextResponse(null, { status: 503 })
  }
}
