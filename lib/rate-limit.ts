import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { UserRepository } from '@/lib/repositories/users'

// User tiers
export enum UserTier {
  FREE = 'free',
  PREMIUM = 'premium',
  VIP = 'vip',
}

// Rate limiter configurations by user tier
export const tierRateLimitConfigs = {
  [UserTier.FREE]: {
    api: { window: '1m' as const, max: 50 }, // 50 requests per minute
    chat: { window: '1m' as const, max: 10 }, // 10 messages per minute
    upload: { window: '1h' as const, max: 5 }, // 5 uploads per hour
    knowledge: { window: '1h' as const, max: 20 }, // 20 knowledge operations per hour
  },
  [UserTier.PREMIUM]: {
    api: { window: '1m' as const, max: 200 }, // 200 requests per minute
    chat: { window: '1m' as const, max: 50 }, // 50 messages per minute
    upload: { window: '1h' as const, max: 50 }, // 50 uploads per hour
    knowledge: { window: '1h' as const, max: 100 }, // 100 knowledge operations per hour
  },
  [UserTier.VIP]: {
    api: { window: '1m' as const, max: 1000 }, // 1000 requests per minute
    chat: { window: '1m' as const, max: 200 }, // 200 messages per minute
    upload: { window: '1h' as const, max: 200 }, // 200 uploads per hour
    knowledge: { window: '1h' as const, max: 500 }, // 500 knowledge operations per hour
  },
} as const

// Legacy configurations for backward compatibility
export const rateLimitConfigs = {
  // API endpoints
  api: {
    window: '1m' as const,
    max: 100,
  },

  // Authentication endpoints
  auth: {
    window: '5m' as const,
    max: 10,
  },

  // File uploads
  upload: {
    window: '1h' as const,
    max: 20,
  },

  // Chat messages
  chat: {
    window: '1m' as const,
    max: 30,
  },
} as const

// In-memory store for development/fallback
class MemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>()

  async get(identifier: string) {
    const entry = this.store.get(identifier)
    if (!entry) return null

    // Check if window has expired
    if (Date.now() > entry.resetTime) {
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

try {
  // Try to use Upstash Redis for production
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '1m'),
      analytics: true,
    })
  }
} catch (error) {
  console.warn('Failed to initialize Upstash rate limiter, falling back to memory store')
}

// Fallback to memory store
const memoryStore = new MemoryStore()

export async function rateLimit(
  identifier: string,
  config: typeof rateLimitConfigs.api = rateLimitConfigs.api
) {
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
    console.error('Rate limiting error:', error)
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
  endpointType: keyof typeof tierRateLimitConfigs.free = 'api',
  userId?: string,
  orgId?: string
) {
  const userTier = await getUserTier(userId, orgId)
  const config = tierRateLimitConfigs[userTier][endpointType] as any

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
