/**
 * Redis Connection Manager
 * Supports both local Redis (ioredis) and Upstash Redis for production
 */

import Redis from 'ioredis'
import { Redis as UpstashRedis } from '@upstash/redis'
import { logger } from '@/lib/utils/logger'

// Connection instances
let ioredisClient: Redis | null = null
let upstashClient: UpstashRedis | null = null

export type RedisClient = Redis | UpstashRedis

/**
 * Get Redis client based on environment configuration
 * Priority: Upstash (production) > Local Redis (development)
 */
export function getRedisClient(): RedisClient | null {
  // Try Upstash first (production)
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (upstashUrl && upstashToken) {
    if (!upstashClient) {
      try {
        upstashClient = new UpstashRedis({
          url: upstashUrl,
          token: upstashToken,
        })
        logger.info('Redis: Connected to Upstash (production)')
      } catch (error) {
        logger.error('Failed to connect to Upstash Redis:', error)
        throw error
      }
    }
    return upstashClient
  }

  // Fallback to local Redis (development)
  const redisUrl = process.env.REDIS_URL
  const redisHost = process.env.REDIS_HOST || 'localhost'
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10)
  const redisPassword = process.env.REDIS_PASSWORD

  if (redisUrl || redisHost) {
    if (!ioredisClient) {
      try {
        ioredisClient = new Redis(
          redisUrl || {
            host: redisHost,
            port: redisPort,
            password: redisPassword,
            maxRetriesPerRequest: 3,
            retryStrategy(times: number) {
              const delay = Math.min(times * 50, 2000)
              logger.warn(`Redis connection retry ${times}, delay: ${delay}ms`)
              return delay
            },
            lazyConnect: false,
          }
        )

        ioredisClient.on('error', (err) => {
          logger.error('Redis connection error:', err)
        })

        ioredisClient.on('connect', () => {
          logger.info('Redis: Connected to local instance')
        })

        logger.info('Redis: Connecting to local instance')
      } catch (error) {
        logger.error('Failed to connect to local Redis:', error)

        // In production, fail hard
        if (process.env.NODE_ENV === 'production') {
          throw error
        }

        return null
      }
    }
    return ioredisClient
  }

  // No Redis configured
  if (process.env.NODE_ENV === 'production') {
    logger.error('CRITICAL: No Redis configuration found in production')
    throw new Error('Redis configuration required in production')
  }

  logger.warn('No Redis configuration found, rate limiting will use memory store')
  return null
}

/**
 * Check if Redis is available and connected
 */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    const client = getRedisClient()
    if (!client) return false

    if (client instanceof Redis) {
      await client.ping()
    } else {
      // Upstash - just check if client exists
      await client.get('health-check')
    }

    return true
  } catch (error) {
    logger.warn('Redis health check failed:', error)
    return false
  }
}

/**
 * Gracefully close Redis connections
 */
export async function closeRedis(): Promise<void> {
  try {
    if (ioredisClient) {
      await ioredisClient.quit()
      ioredisClient = null
      logger.info('Redis: Local connection closed')
    }

    // Upstash doesn't need explicit closing
    if (upstashClient) {
      upstashClient = null
      logger.info('Redis: Upstash client released')
    }
  } catch (error) {
    logger.error('Error closing Redis connection:', error)
  }
}

/**
 * Get value from Redis with type safety
 */
export async function redisGet<T = string>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient()
    if (!client) return null

    const value = await client.get(key)
    if (!value) return null

    return value as T
  } catch (error) {
    logger.error('Redis GET error:', error)
    return null
  }
}

/**
 * Set value in Redis with optional expiration
 */
export async function redisSet(
  key: string,
  value: string,
  expirationSeconds?: number
): Promise<boolean> {
  try {
    const client = getRedisClient()
    if (!client) return false

    if (expirationSeconds) {
      await client.setex(key, expirationSeconds, value)
    } else {
      await client.set(key, value)
    }

    return true
  } catch (error) {
    logger.error('Redis SET error:', error)
    return false
  }
}

/**
 * Delete key from Redis
 */
export async function redisDel(key: string): Promise<boolean> {
  try {
    const client = getRedisClient()
    if (!client) return false

    await client.del(key)
    return true
  } catch (error) {
    logger.error('Redis DEL error:', error)
    return false
  }
}

/**
 * Increment counter in Redis (atomic operation)
 */
export async function redisIncr(key: string): Promise<number> {
  try {
    const client = getRedisClient()
    if (!client) return 0

    const result = await client.incr(key)
    return typeof result === 'number' ? result : parseInt(String(result), 10)
  } catch (error) {
    logger.error('Redis INCR error:', error)
    return 0
  }
}

/**
 * Set expiration on existing key
 */
export async function redisExpire(key: string, seconds: number): Promise<boolean> {
  try {
    const client = getRedisClient()
    if (!client) return false

    await client.expire(key, seconds)
    return true
  } catch (error) {
    logger.error('Redis EXPIRE error:', error)
    return false
  }
}

/**
 * Get TTL of a key
 */
export async function redisTTL(key: string): Promise<number> {
  try {
    const client = getRedisClient()
    if (!client) return -1

    const ttl = await client.ttl(key)
    return typeof ttl === 'number' ? ttl : parseInt(String(ttl), 10)
  } catch (error) {
    logger.error('Redis TTL error:', error)
    return -1
  }
}
