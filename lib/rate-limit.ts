import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { Redis as IORedis } from 'ioredis'
import { UserRepository } from '@/lib/repositories/users'
import { logger } from '@/lib/utils/logger'

// User tiers
export enum UserTier {
  FREE = 'free',
  PREMIUM = 'premium',
  VIP = 'vip',
}

// Redis backend type
type RedisBackend = 'upstash' | 'ioredis' | 'memory'

type RateLimitWindowUnit = 's' | 'm' | 'h' | 'd'
type RateLimitWindow = `${number}${RateLimitWindowUnit}`
export type RateLimitConfig = {
  window: RateLimitWindow
  max: number
}
type TierEndpoint = 'api' | 'upload'
type RateLimitEndpoint = 'api' | 'auth' | 'upload'

// Rate limiter configurations by user tier
export const tierRateLimitConfigs: Record<UserTier, Record<TierEndpoint, RateLimitConfig>> = {
  [UserTier.FREE]: {
    api: { window: '1m', max: 50 }, // 50 requests per minute
    upload: { window: '1h', max: 5 }, // 5 uploads per hour
  },
  [UserTier.PREMIUM]: {
    api: { window: '1m', max: 200 }, // 200 requests per minute
    upload: { window: '1h', max: 50 }, // 50 uploads per hour
  },
  [UserTier.VIP]: {
    api: { window: '1m', max: 1000 }, // 1000 requests per minute
    upload: { window: '1h', max: 200 }, // 200 uploads per hour
  },
}

// Legacy configurations for backward compatibility
export const rateLimitConfigs: Record<RateLimitEndpoint, RateLimitConfig> = {
  // API endpoints
  api: {
    window: '1m',
    max: 100,
  },

  // Authentication endpoints
  auth: {
    window: '5m',
    max: 10,
  },

  // File uploads
  upload: {
    window: '1h',
    max: 20,
  },
} as const

// In-memory store for development/fallback
class MemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>()

  async get(identifier: string) {
    const entry = this.store.get(identifier)
    if (!entry) return null

    // Check if window has expired
    if (Date.now() >= entry.resetTime) {
      this.store.delete(identifier)
      return null
    }

    return entry
  }

  async set(identifier: string, count: number, resetTime: number) {
    this.store.set(identifier, { count, resetTime })
  }
}

// Initialize rate limiter
let ratelimit: Ratelimit | null = null
let ioredisClient: IORedis | null = null
let currentBackend: RedisBackend = 'memory'
let initializationPromise: Promise<void> | null = null

// Fallback to memory store
const memoryStore = new MemoryStore()

/**
 * Initialize Redis connection for rate limiting
 */
async function initializeRedis(): Promise<void> {
  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = (async () => {
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
    const redisUrl = process.env.REDIS_URL

    // Try Upstash Redis first (for production)
    if (upstashUrl && upstashToken) {
      try {
        const redis = new Redis({
          url: upstashUrl,
          token: upstashToken,
        })

        ratelimit = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(100, '1 m'),
          analytics: true,
          prefix: '@upstash/ratelimit',
        })

        currentBackend = 'upstash'
        logger.info('Rate limiting initialized with Upstash Redis', {
          service: 'rate-limit',
          backend: 'upstash',
          analytics: true,
        })
        return
      } catch (error) {
        logger.error('Failed to initialize Upstash Redis', error, {
          service: 'rate-limit',
        })
      }
    }

    // Try local Redis (ioredis) for development if Upstash is not available
    if (!ratelimit && redisUrl) {
      try {
        ioredisClient = new IORedis(redisUrl, {
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          lazyConnect: false,
        })

        // Test connection
        await ioredisClient.ping()

        currentBackend = 'ioredis'
        logger.info('Rate limiting initialized with local Redis (ioredis)', {
          service: 'rate-limit',
          backend: 'ioredis',
          url: redisUrl.replace(/\/\/.*@/, '//<credentials>@'), // Mask credentials in logs
        })
        return
      } catch (error) {
        logger.error('Failed to initialize local Redis', error, {
          service: 'rate-limit',
        })

        // Clean up failed connection
        if (ioredisClient) {
          ioredisClient.disconnect()
          ioredisClient = null
        }
      }
    }

    // Log fallback warning if no Redis is available
    logger.warn('No Redis available, using in-memory rate limiting', {
      service: 'rate-limit',
      backend: 'memory',
      note: 'Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN or REDIS_URL for distributed rate limiting',
      limitations: 'In-memory rate limiting does not work across multiple instances',
    })
  })()

  return initializationPromise
}

// Start initialization immediately
initializeRedis().catch((error) => {
  logger.error('Failed to initialize rate limiting', error, {
    service: 'rate-limit',
  })
})

/**
 * Health check for Redis connection
 * @returns Object with status and backend information
 */
export async function checkRateLimitHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy'
  backend: RedisBackend
  message: string
  details?: Record<string, unknown>
}> {
  // Ensure initialization is complete
  await initializeRedis()

  if (ratelimit) {
    try {
      // Test Upstash Redis connection
      const testIdentifier = `health-check:${Date.now()}`
      const result = await ratelimit.limit(testIdentifier)

      return {
        status: 'healthy',
        backend: 'upstash',
        message: 'Upstash Redis rate limiting operational',
        details: {
          testSuccess: result.success,
          analytics: true,
        },
      }
    } catch (error) {
      logger.error('Upstash Redis health check failed', error, {
        service: 'rate-limit',
      })

      return {
        status: 'unhealthy',
        backend: 'upstash',
        message: 'Upstash Redis health check failed',
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
      }
    }
  }

  if (ioredisClient) {
    try {
      // Test local Redis connection
      const pong = await ioredisClient.ping()
      if (pong === 'PONG') {
        return {
          status: 'healthy',
          backend: 'ioredis',
          message: 'Local Redis rate limiting operational',
          details: {
            pingSuccess: true,
          },
        }
      }

      return {
        status: 'unhealthy',
        backend: 'ioredis',
        message: 'Local Redis ping failed',
        details: {
          response: pong,
        },
      }
    } catch (error) {
      logger.error('Local Redis health check failed', error, {
        service: 'rate-limit',
      })

      return {
        status: 'unhealthy',
        backend: 'ioredis',
        message: 'Local Redis health check failed',
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
      }
    }
  }

  return {
    status: 'degraded',
    backend: 'memory',
    message: 'Using in-memory rate limiting (Redis not configured)',
    details: {
      redisConfigured: false,
      recommendation: 'Configure UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN or REDIS_URL for production',
      limitations: 'In-memory rate limiting does not persist across restarts or work in multi-instance deployments',
    },
  }
}

/**
 * Get current rate limiting backend
 */
export function getRateLimitBackend(): RedisBackend {
  return currentBackend
}

export const rateLimit = async (
  identifier: string,
  config: RateLimitConfig = rateLimitConfigs.api,
) => {
  const startTime = Date.now()

  try {
    // Ensure initialization is complete
    await initializeRedis()

    if (ratelimit) {
      // Use Upstash rate limiter
      const result = await ratelimit.limit(identifier)

      logger.debug('Rate limit check completed', {
        service: 'rate-limit',
        backend: 'upstash',
        identifier,
        success: result.success,
        remaining: result.remaining,
        duration: Date.now() - startTime,
      })

      return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
        limit: result.limit,
      }
    }

    if (ioredisClient) {
      // Use ioredis for rate limiting with sliding window algorithm
      const now = Date.now()
      const windowMs = parseWindow(config.window)
      const key = `ratelimit:${identifier}`
      const windowStart = now - windowMs

      // Use sorted set to implement sliding window
      const multi = ioredisClient.multi()

      // Remove old entries
      multi.zremrangebyscore(key, 0, windowStart)

      // Count current window
      multi.zcard(key)

      // Add current request
      multi.zadd(key, now, `${now}`)

      // Set expiration
      multi.expire(key, Math.ceil(windowMs / 1000))

      const results = await multi.exec()

      if (!results) {
        throw new Error('Redis multi command failed')
      }

      // Get count after removing old entries (index 1 in results)
      const count = (results[1]?.[1] as number) || 0
      const success = count < config.max
      const remaining = Math.max(0, config.max - count - 1)
      const reset = now + windowMs

      logger.debug('Rate limit check completed', {
        service: 'rate-limit',
        backend: 'ioredis',
        identifier,
        success,
        count,
        remaining,
        duration: Date.now() - startTime,
      })

      return {
        success,
        remaining,
        reset,
        limit: config.max,
      }
    }

    // Use memory store fallback
    const now = Date.now()
    const windowMs = parseWindow(config.window)
    const resetTime = now + windowMs

    const existing = await memoryStore.get(identifier)

    if (existing) {
      if (existing.count >= config.max) {
        logger.debug('Rate limit exceeded (memory)', {
          service: 'rate-limit',
          backend: 'memory',
          identifier,
          count: existing.count,
          limit: config.max,
        })

        return {
          success: false,
          remaining: 0,
          reset: existing.resetTime,
          limit: config.max,
        }
      }

      await memoryStore.set(identifier, existing.count + 1, existing.resetTime)
      return {
        success: true,
        remaining: config.max - (existing.count + 1),
        reset: existing.resetTime,
        limit: config.max,
      }
    } else {
      await memoryStore.set(identifier, 1, resetTime)
      return {
        success: true,
        remaining: config.max - 1,
        reset: resetTime,
        limit: config.max,
      }
    }
  } catch (error) {
    logger.error('Rate limiting error', error, {
      service: 'rate-limit',
      identifier,
      backend: currentBackend,
      duration: Date.now() - startTime,
    })

    // Allow request in case of error (fail open for better UX)
    return {
      success: true,
      remaining: 999,
      reset: Date.now() + 60000,
      limit: 1000,
    }
  }
}

function parseWindow(window: string): number {
  const match = window.match(/^(\d+)([smhd])$/)
  if (!match) return 60000 // Default 1 minute

  const [, value, unit] = match
  const numValue = parseInt(value, 10)

  switch (unit) {
    case 's': return numValue * 1000
    case 'm': return numValue * 60 * 1000
    case 'h': return numValue * 60 * 60 * 1000
    case 'd': return numValue * 24 * 60 * 60 * 1000
    default: return 60000
  }
}

// Function to determine user tier
export async function getUserTier(userId?: string, orgId?: string): Promise<UserTier> {
  return await UserRepository.getUserTier(userId, orgId)
}

// Rate limiting with user tier support
export async function checkTierRateLimit(
  request: Request,
  endpointType: TierEndpoint = 'api',
  userId?: string,
  orgId?: string
) {
  const userTier = await getUserTier(userId, orgId)
  const config = tierRateLimitConfigs[userTier][endpointType]

  const identifier = userId
    ? `user:${userId}:${endpointType}`
    : `ip:${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous'}:${endpointType}`

  const result = await rateLimit(identifier, config)

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: 'Rate limit exceeded for your plan',
        tier: userTier,
        upgradeUrl: '/pricing',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'X-RateLimit-Tier': userTier,
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null // Allow request
}

// Legacy middleware function for backward compatibility
export async function checkRateLimit(
  request: Request,
  config: typeof rateLimitConfigs.api = rateLimitConfigs.api
) {
  const ip = request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'anonymous'

  const identifier = `${ip}:${request.url}`

  const result = await rateLimit(identifier, config)

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null // Allow request
}
