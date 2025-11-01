import { Redis } from 'ioredis'

// Redis client instance
let redisClient: Redis | null = null

// Initialize Redis client
export const getRedisClient = (): Redis | null => {
  if (redisClient) return redisClient

  try {
    const redisUrl = process.env.REDIS_URL
    if (!redisUrl || redisUrl.includes('your-redis-host')) {
      console.warn('REDIS_URL not configured or using placeholder, caching disabled')
      return null
    }

    redisClient = new Redis(redisUrl)

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err.message)
      redisClient = null
    })

    redisClient.on('connect', () => {
      console.log('Connected to Redis')
    })

    return redisClient
  } catch (error) {
    console.error('Failed to initialize Redis client:', error)
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
}

// Cache operations
export class Cache {
  private client: Redis | null

  constructor() {
    this.client = getRedisClient()
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (!this.client) return null

    try {
      const data = await this.client.get(key)
      if (!data) return null

      return JSON.parse(data)
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async set(key: string, value: any, ttl: number = cacheConfig.default): Promise<boolean> {
    if (!this.client) return false

    try {
      const serialized = JSON.stringify(value)
      await this.client.setex(key, ttl, serialized)
      return true
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.client) return false

    try {
      await this.client.del(key)
      return true
    } catch (error) {
      console.error('Cache del error:', error)
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
      console.error('Cache delPattern error:', error)
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) return false

    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      console.error('Cache exists error:', error)
      return false
    }
  }

  async clear(): Promise<boolean> {
    if (!this.client) return false

    try {
      await this.client.flushdb()
      return true
    } catch (error) {
      console.error('Cache clear error:', error)
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
        info: info.split('\n').reduce((acc, line) => {
          const [key, value] = line.split(':')
          if (key && value) {
            acc[key.trim()] = value.trim()
          }
          return acc
        }, {} as Record<string, string>),
      }
    } catch (error) {
      console.error('Cache stats error:', error)
      return { connected: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Global cache instance
export const cache = new Cache()

// Higher-level caching utilities
export const cached = async <T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = cacheConfig.default,
  skipCache = false
): Promise<T> => {
  // Skip cache in development or when explicitly requested
  if (skipCache || process.env.NODE_ENV === 'development') {
    return fn()
  }

  try {
    // Try to get from cache first
    const cached = await cache.get<T>(key)
    if (cached !== null) {
      console.log(`Cache hit for key: ${key}`)
      return cached
    }

    // Execute function and cache result
    console.log(`Cache miss for key: ${key}`)
    const result = await fn()
    await cache.set(key, result, ttl)

    return result
  } catch (error) {
    console.error('Cached function error:', error)
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
  }
) => {
  return async (request: Request): Promise<Response> => {
    const skipCache = options.skipCache ||
                     request.headers.get('cache-control') === 'no-cache' ||
                     process.env.NODE_ENV === 'development'

    if (skipCache) {
      return handler(request)
    }

    const cacheKey = typeof options.key === 'function'
      ? options.key(request)
      : options.key

    try {
      // Try to get from cache
      const cached = await cache.get(cacheKey)
      if (cached) {
        console.log(`API cache hit for: ${cacheKey}`)
        return new Response(JSON.stringify(cached), {
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
          },
        })
      }

      // Execute handler and cache result
      console.log(`API cache miss for: ${cacheKey}`)
      const response = await handler(request)

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
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
      console.error('Cache middleware error:', error)
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
