import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { UserRepository } from '@/lib/repositories/users'
import { logger } from '@/lib/utils/logger'

// User tiers
export enum UserTier {
  FREE = 'free',
  PREMIUM = 'premium',
  VIP = 'vip',
}

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

// Initialize Redis if credentials are available
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

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

    logger.info('Rate limiting initialized with Redis/Upstash', {
      service: 'rate-limit',
      backend: 'upstash-redis',
    })
  } catch (error) {
    logger.error('Failed to initialize Upstash Redis', error, {
      service: 'rate-limit',
    })
    logger.warn('Falling back to in-memory rate limiting', {
      service: 'rate-limit',
      backend: 'memory-store',
    })
  }
} else {
  logger.warn('Upstash Redis credentials not found, using in-memory rate limiting', {
    service: 'rate-limit',
    backend: 'memory-store',
    note: 'Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for production',
  })
}

// Fallback to memory store
const memoryStore = new MemoryStore()

/**
 * Health check for Redis connection
 * @returns Object with status and backend information
 */
export async function checkRateLimitHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy'
  backend: 'redis' | 'memory'
  message: string
  details?: Record<string, unknown>
}> {
  if (ratelimit) {
    try {
      // Test Redis connection with a simple rate limit check
      const testIdentifier = `health-check:${Date.now()}`
      const result = await ratelimit.limit(testIdentifier)

      return {
        status: 'healthy',
        backend: 'redis',
        message: 'Redis rate limiting operational',
        details: {
          testSuccess: result.success,
          upstashConfigured: true,
        },
      }
    } catch (error) {
      logger.error('Redis health check failed', error, {
        service: 'rate-limit',
      })

      return {
        status: 'unhealthy',
        backend: 'redis',
        message: 'Redis health check failed',
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
      upstashConfigured: false,
      recommendation: 'Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for production',
    },
  }
}

/**
 * Get current rate limiting backend
 */
export function getRateLimitBackend(): 'redis' | 'memory' {
  return ratelimit ? 'redis' : 'memory'
}

export const rateLimit = async (
  identifier: string,
  config: RateLimitConfig = rateLimitConfigs.api,
) => {
  try {
    if (ratelimit) {
      // Use Upstash rate limiter
      const result = await ratelimit.limit(identifier)
      return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
        limit: result.limit,
      }
    } else {
      // Use memory store fallback
      const now = Date.now()
      const windowMs = parseWindow(config.window)
      const resetTime = now + windowMs

      const existing = await memoryStore.get(identifier)

      if (existing) {
        if (existing.count >= config.max) {
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
    }
  } catch (error) {
    logger.error('Rate limiting error', error, {
      service: 'rate-limit',
      identifier,
    })
    // Allow request in case of error
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
