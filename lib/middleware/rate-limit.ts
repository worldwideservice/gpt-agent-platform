/**
 * Rate Limiting Middleware for Next.js API Routes
 * Uses Redis for distributed rate limiting with memory fallback
 */

import { NextRequest, NextResponse } from 'next/server'
import { getRedisClient, redisIncr, redisExpire, redisTTL } from '@/lib/redis'
import { logger } from '@/lib/utils/logger'

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  max: number

  /**
   * Time window in seconds
   */
  windowSeconds: number

  /**
   * Endpoint identifier (for logging and metrics)
   */
  endpoint?: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// Predefined rate limit configurations
export const RateLimitPresets = {
  // Standard API endpoints
  api: { max: 100, windowSeconds: 60 }, // 100 req/min

  // Authentication endpoints (stricter)
  auth: { max: 5, windowSeconds: 60 }, // 5 req/min

  // Webhook endpoints
  webhook: { max: 50, windowSeconds: 60 }, // 50 req/min

  // File upload endpoints
  upload: { max: 10, windowSeconds: 3600 }, // 10 req/hour

  // AI/LLM endpoints (expensive)
  ai: { max: 20, windowSeconds: 60 }, // 20 req/min
} as const

// In-memory store for fallback (development only)
interface MemoryEntry {
  count: number
  resetTime: number
}

class MemoryRateLimitStore {
  private store = new Map<string, MemoryEntry>()

  async limit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now()
    const resetTime = now + config.windowSeconds * 1000
    const entry = this.store.get(identifier)

    // Clean expired entries periodically
    this.cleanup()

    if (entry) {
      // Check if window expired
      if (now >= entry.resetTime) {
        // Reset window
        this.store.set(identifier, { count: 1, resetTime })
        return {
          success: true,
          limit: config.max,
          remaining: config.max - 1,
          reset: resetTime,
        }
      }

      // Increment counter
      const newCount = entry.count + 1
      this.store.set(identifier, { count: newCount, resetTime: entry.resetTime })

      return {
        success: newCount <= config.max,
        limit: config.max,
        remaining: Math.max(0, config.max - newCount),
        reset: entry.resetTime,
      }
    }

    // First request
    this.store.set(identifier, { count: 1, resetTime })
    return {
      success: true,
      limit: config.max,
      remaining: config.max - 1,
      reset: resetTime,
    }
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

const memoryStore = new MemoryRateLimitStore()

/**
 * Core rate limiting function using Redis
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redisKey = `ratelimit:${config.endpoint || 'api'}:${identifier}`

  try {
    const client = getRedisClient()

    // Fallback to memory store if Redis unavailable
    if (!client) {
      logger.warn('Rate limit: Using memory store (Redis unavailable)')
      return await memoryStore.limit(identifier, config)
    }

    // Atomic increment
    const count = await redisIncr(redisKey)

    if (count === 1) {
      // First request in window - set expiration
      await redisExpire(redisKey, config.windowSeconds)
    }

    // Get TTL for reset time
    const ttl = await redisTTL(redisKey)
    const resetTime = Date.now() + (ttl > 0 ? ttl * 1000 : config.windowSeconds * 1000)

    return {
      success: count <= config.max,
      limit: config.max,
      remaining: Math.max(0, config.max - count),
      reset: resetTime,
    }
  } catch (error) {
    logger.error('Rate limit check failed, allowing request (fail open):', error)

    // Fail open - allow request if rate limiting fails
    return {
      success: true,
      limit: config.max,
      remaining: config.max,
      reset: Date.now() + config.windowSeconds * 1000,
    }
  }
}

/**
 * Get identifier from request (user ID or IP address)
 */
export function getIdentifier(request: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }

  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || request.ip || 'unknown'

  return `ip:${ip}`
}

/**
 * Create rate limit response
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const retryAfter = Math.ceil((result.reset - Date.now()) / 1000)

  return NextResponse.json(
    {
      error: 'Rate limit exceeded',
      message: `Too many requests. Please try again in ${retryAfter} seconds.`,
      retryAfter,
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
        'Retry-After': retryAfter.toString(),
      },
    }
  )
}

/**
 * Add rate limit headers to successful response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.reset.toString())
  return response
}

/**
 * Higher-order function to create rate-limited API route handler
 */
export function withRateLimit<T extends any[]>(
  config: RateLimitConfig,
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      // Extract user ID if available (from auth)
      const userId = request.headers.get('x-user-id') || undefined
      const identifier = getIdentifier(request, userId)

      // Check rate limit
      const result = await checkRateLimit(identifier, config)

      if (!result.success) {
        logger.warn('Rate limit exceeded', {
          identifier,
          endpoint: config.endpoint,
          limit: result.limit,
        })
        return createRateLimitResponse(result)
      }

      // Call original handler
      const response = await handler(request, ...args)

      // Add rate limit headers
      return addRateLimitHeaders(response, result)
    } catch (error) {
      logger.error('Rate limit middleware error:', error)
      // Continue to handler on error (fail open)
      return handler(request, ...args)
    }
  }
}
