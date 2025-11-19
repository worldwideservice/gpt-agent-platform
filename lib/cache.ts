import { Redis } from 'ioredis'
import { logger } from '@/lib/utils/logger'

// Redis client instance
let redisClient: Redis | null = null

export const setRedisClient = (client: Redis | null) => {
  redisClient = client
}

// Initialize Redis client
export const getRedisClient = (): Redis | null => {
  if (redisClient) return redisClient

  // Prevent Redis connection during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null
  }

  const redisUrl = process.env.REDIS_URL

  // CRITICAL: In production, if no Redis URL configured, don't try to connect
  // Don't even attempt to create a Redis client without a valid URL
  if (!redisUrl || redisUrl.includes('your-redis-host')) {
    if (process.env.NODE_ENV === 'production') {
      logger.warn('Redis not configured for caching in production, caching disabled')
    } else {
      logger.warn('REDIS_URL not configured or using placeholder, caching disabled')
    }
    return null
  }

  try {
    // @ts-ignore - Redis constructor types might mismatch slightly depending on version
    redisClient = new Redis(redisUrl, {
      // Don't crash on connection error
      retryStrategy: (times) => {
        if (times > 3) return null // Stop retrying after 3 attempts
        return Math.min(times * 50, 2000)
      },
      maxRetriesPerRequest: 3,
    })

    redisClient.on('error', (err) => {
      // Suppress excessive error logging during build/CI
      if (!process.env.CI && process.env.NEXT_PHASE !== 'phase-production-build') {
        logger.error('Redis connection error', { error: err.message })
      }
      // Don't nullify client immediately on error, it might reconnect
    })

    redisClient.on('connect', () => {
      logger.info('Connected to Redis')
    })

    return redisClient
  } catch (error) {
    logger.error('Failed to initialize Redis client', { error })
    return null
  }
}

// Cache configuration
export const cacheConfig = {
  // Default cache TTL in seconds
  default: 300, // 5 minutes

  // Specific cache TTLs for different data types
  agents: 600, // 10 minutes - agents change infrequently
  knowledge: 1800, // 30 minutes - knowledge base updates periodically
  dashboard: 60, // 1 minute - dashboard data changes frequently
  user: 3600, // 1 hour - user data is relatively stable
  integrations: 300, // 5 minutes - integration status can change
  agentInstructions: 3600, // 1 час - инструкции меняются редко
  agentContextStatic: 900, // 15 минут - базовый контекст обновляется нечасто
  agentKnowledgeGraph: 300, // 5 минут - граф привязан к сообщению пользователя
  aiConfig: 600, // 10 минут - настройки провайдеров
} as const

// Cache key generators
export const cacheKeys = {
  agents: (orgId: string) => `agents:${orgId}`,
  agent: (id: string) => `agent:${id}`,
  knowledge: (orgId: string, category?: string) =>
    category ? `knowledge:${orgId}:${category}` : `knowledge:${orgId}`,
  dashboard: (orgId: string) => `dashboard:${orgId}`,
  user: (userId: string) => `user:${userId}`,
  integrations: (orgId: string) => `integrations:${orgId}`,
  notifications: (userId: string) => `notifications:${userId}`,
  agentInstructions: (orgId: string, agentId: string) =>
    `agent-instructions:${orgId}:${agentId}`,
  agentStaticContext: (
    orgId: string,
    agentId: string | null,
    stageId: string | null,
  ) => `agent-context:${orgId}:${agentId ?? 'global'}:${stageId ?? 'all'}`,
  agentKnowledgeGraph: (orgId: string, hash: string) =>
    `agent-kg:${orgId}:${hash}`,
  aiConfig: (orgId: string) => `ai-config:${orgId}`,
}

// Cache operations
export class Cache {
  private client: Redis | null

  constructor() {
    this.client = getRedisClient()
  }

  async get<T>(key: string): Promise<T | null> {
    // Skip if client not initialized (no REDIS_URL configured)
    if (!this.client) return null

    try {
      const data = await this.client.get(key)
      if (!data) return null

      return JSON.parse(data)
    } catch (error) {
      logger.error('Cache get error', { key, error })
      return null
    }
  }

  async set<T>(
    key: string,
    value: T,
    ttl: number = cacheConfig.default,
  ): Promise<boolean> {
    if (!this.client) return false

    try {
      const serialized = JSON.stringify(value)
      await this.client.setex(key, ttl, serialized)
      return true
    } catch (error) {
      logger.error('Cache set error', { key, ttl, error })
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.client) return false

    try {
      await this.client.del(key)
      return true
    } catch (error) {
      logger.error('Cache del error', { key, error })
      return false
    }
  }

  async delPattern(pattern: string): Promise<boolean> {
    if (!this.client) return false

    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) {
        await this.client.del(...keys)
      }
      return true
    } catch (error) {
      logger.error('Cache delPattern error', { pattern, error })
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) return false

    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      logger.error('Cache exists error', { key, error })
      return false
    }
  }

  async clear(): Promise<boolean> {
    if (!this.client) return false

    try {
      await this.client.flushdb()
      return true
    } catch (error) {
      logger.error('Cache clear error', { error })
      return false
    }
  }

  // Get cache stats
  async getStats() {
    if (!this.client) return null

    try {
      const info = await this.client.info()
      const dbSize = await this.client.dbsize()

      return {
        connected: true,
        dbSize,
        info: info.split('\n').reduce(
          (acc, line) => {
            const [key, value] = line.split(':')
            if (key && value) {
              acc[key.trim()] = value.trim()
            }
            return acc
          },
          {} as Record<string, string>,
        ),
      }
    } catch (error) {
      logger.error('Cache stats error', { error })
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

// Global cache instance
// NOTE: Cache will be disabled if REDIS_URL is not configured
export const cache = new Cache()

// Higher-level caching utilities
export const cached = async <T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = cacheConfig.default,
  skipCache = false,
): Promise<T> => {
  // Skip cache in development or when explicitly requested
  if (skipCache || process.env.NODE_ENV === 'development') {
    return fn()
  }

  try {
    // Try to get from cache first
    const cached = await cache.get<T>(key)
    if (cached !== null) {
      logger.info('Cache hit', { key })
      return cached
    }

    // Execute function and cache result
    logger.info('Cache miss', { key })
    const result = await fn()
    await cache.set(key, result, ttl)

    return result
  } catch (error) {
    logger.error('Cached function error', { key, error })
    // Fallback to executing function without cache
    return fn()
  }
}

// Invalidate cache for specific patterns
export const invalidateCache = async (patterns: string[]) => {
  for (const pattern of patterns) {
    await cache.delPattern(pattern)
  }
}

// Cache middleware for API routes
export const withCache = (
  handler: (request: Request) => Promise<Response>,
  options: {
    key: string | ((request: Request) => string)
    ttl?: number
    skipCache?: boolean
  },
) => {
  return async (request: Request): Promise<Response> => {
    const skipCache =
      options.skipCache ||
      request.headers.get('cache-control') === 'no-cache' ||
      process.env.NODE_ENV === 'development'

    if (skipCache) {
      return handler(request)
    }

    const cacheKey =
      typeof options.key === 'function' ? options.key(request) : options.key

    try {
      // Try to get from cache
      const cached = await cache.get(cacheKey)
      if (cached) {
        logger.info('API cache hit', { cacheKey })
        return new Response(JSON.stringify(cached), {
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
          },
        })
      }

      // Execute handler and cache result
      logger.info('API cache miss', { cacheKey })
      const response = await handler(request)

      if (
        response.ok &&
        response.headers.get('content-type')?.includes('application/json')
      ) {
        const data = await response.clone().json()
        await cache.set(cacheKey, data, options.ttl || cacheConfig.default)

        // Add cache header to response
        const newResponse = new Response(JSON.stringify(data), {
          status: response.status,
          statusText: response.statusText,
          headers: {
            ...Object.fromEntries(response.headers),
            'X-Cache': 'MISS',
          },
        })

        return newResponse
      }

      return response
    } catch (error) {
      logger.error('Cache middleware error', { cacheKey, error })
      return handler(request)
    }
  }
}

// Health check for cache
export const checkCacheHealth = async () => {
  try {
    const stats = await cache.getStats()
    return {
      healthy: stats?.connected || false,
      stats,
    }
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
