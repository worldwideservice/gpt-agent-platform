import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { NextRequest } from 'next/server'
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
let redisClient: Redis | null = null

// ✅ CRITICAL FIX: Включаем Redis rate limiting для production
try {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (upstashUrl && upstashToken) {
    redisClient = new Redis({
      url: upstashUrl,
      token: upstashToken,
    })

    ratelimit = new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      analytics: true,
      prefix: '@upstash/ratelimit',
    })

    logger.info('Rate limiting: Using Upstash Redis (production-ready)')
  } else {
    // ВАЖНО: В production без Redis используем memory store как fallback
    // Это не идеально для production, но позволяет приложению работать
    if (process.env.NODE_ENV === 'production') {
      logger.warn('CRITICAL: Redis credentials missing in production! Using memory store fallback (NOT recommended for multi-instance deployments)')
    } else {
      logger.warn('Rate limiting: Using memory store (development only - NOT for production)')
    }
  }
} catch (error) {
  logger.error('Failed to initialize Redis rate limiter:', error)

  // ВАЖНО: Даже в production используем graceful degradation
  // Приложение должно работать, даже если Redis недоступен
  logger.warn('Rate limiting will use memory store as fallback')
}

// Fallback to memory store (только для development)
const memoryStore = new MemoryStore()

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
    logger.error('Rate limiting error:', error)
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
/**
 * Получает идентификатор для rate limiting в middleware.
 * Приоритет: ID пользователя (если есть сессия) > IP-адрес (если нет).
 */
export function getRateLimitIdentifier(
  req: NextRequest,
  userId?: string | null,
): string {
  return userId || req.ip || '127.0.0.1'
}

/**
 * Строгий лимитер для эндпоинтов аутентификации (логин, регистрация, сброс пароля).
 * 10 запросов в минуту с одного IP.
 */
export const authRateLimiter = redisClient
  ? new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      prefix: 'ratelimit:auth',
      analytics: true,
    })
  : null

/**
 * Общий лимитер для аутентифицированных пользователей API.
 * 100 запросов в 10 секунд на одного пользователя.
 */
export const apiRateLimiter = redisClient
  ? new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(100, '10 s'),
      prefix: 'ratelimit:api:user',
      analytics: true,
    })
  : null

/**
 * Общий лимитер для неаутентифицированных запросов к API.
 * 20 запросов в 10 секунд на один IP.
 */
export const publicApiRateLimiter = redisClient
  ? new Ratelimit({
      redis: redisClient,
      limiter: Ratelimit.slidingWindow(20, '10 s'),
      prefix: 'ratelimit:api:ip',
      analytics: true,
    })
  : null

/**
 * Check rate limit health
 */
export async function checkRateLimitHealth() {
  try {
    if (!redisClient) {
      return {
        healthy: false,
        error: 'Redis client not initialized',
      }
    }

    // Simple ping to check Redis connection
    await redisClient.ping()
    
    return {
      healthy: true,
      status: 'ok',
    }
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
