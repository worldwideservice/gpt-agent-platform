/**
 * Redis Cache Utilities
 * Caching layer for API responses and database queries
 */

import { redis } from '../redis'
import { logger } from '../logger'

export interface CacheOptions {
  /** Cache TTL in seconds */
  ttl?: number
  /** Cache key prefix */
  prefix?: string
  /** Whether to cache null/undefined values */
  cacheNull?: boolean
  /** Whether to use compression */
  compress?: boolean
}

const DEFAULT_TTL = 300 // 5 minutes
const DEFAULT_PREFIX = 'cache'

/**
 * Get value from cache
 */
export async function getCache<T = any>(
  key: string,
  options: CacheOptions = {}
): Promise<T | null> {
  const { prefix = DEFAULT_PREFIX } = options
  const cacheKey = `${prefix}:${key}`

  try {
    const cached = await redis.get(cacheKey)

    if (!cached) return null

    const parsed = JSON.parse(cached)

    logger.debug('Cache hit', { key: cacheKey })

    return parsed as T
  } catch (error) {
    logger.error('Cache get error', { error, key: cacheKey })
    return null
  }
}

/**
 * Set value in cache
 */
export async function setCache<T = any>(
  key: string,
  value: T,
  options: CacheOptions = {}
): Promise<void> {
  const { ttl = DEFAULT_TTL, prefix = DEFAULT_PREFIX, cacheNull = false } = options
  const cacheKey = `${prefix}:${key}`

  // Don't cache null/undefined unless explicitly allowed
  if (!cacheNull && (value === null || value === undefined)) {
    return
  }

  try {
    const serialized = JSON.stringify(value)

    await redis.setex(cacheKey, ttl, serialized)

    logger.debug('Cache set', { key: cacheKey, ttl })
  } catch (error) {
    logger.error('Cache set error', { error, key: cacheKey })
  }
}

/**
 * Delete value from cache
 */
export async function deleteCache(
  key: string,
  options: CacheOptions = {}
): Promise<void> {
  const { prefix = DEFAULT_PREFIX } = options
  const cacheKey = `${prefix}:${key}`

  try {
    await redis.del(cacheKey)

    logger.debug('Cache deleted', { key: cacheKey })
  } catch (error) {
    logger.error('Cache delete error', { error, key: cacheKey })
  }
}

/**
 * Clear all cache with given prefix
 */
export async function clearCache(prefix: string = DEFAULT_PREFIX): Promise<void> {
  try {
    const keys = await redis.keys(`${prefix}:*`)

    if (keys.length > 0) {
      await redis.del(...keys)
      logger.info('Cache cleared', { prefix, count: keys.length })
    }
  } catch (error) {
    logger.error('Cache clear error', { error, prefix })
  }
}

/**
 * Get or set cache (fetch from source if not cached)
 */
export async function cacheOrFetch<T = any>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  // Try to get from cache
  const cached = await getCache<T>(key, options)

  if (cached !== null) {
    return cached
  }

  // Fetch from source
  const data = await fetcher()

  // Store in cache
  await setCache(key, data, options)

  return data
}

/**
 * Invalidate cache with pattern
 */
export async function invalidatePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)

    if (keys.length > 0) {
      await redis.del(...keys)
      logger.info('Cache pattern invalidated', { pattern, count: keys.length })
    }
  } catch (error) {
    logger.error('Cache invalidate error', { error, pattern })
  }
}

/**
 * Create cache key from object
 */
export function createCacheKey(
  parts: Record<string, any>,
  separator: string = ':'
): string {
  return Object.entries(parts)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(separator)
}

/**
 * Cache decorator for functions
 */
export function cached<T extends (...args: any[]) => Promise<any>>(
  options: CacheOptions & {
    keyGenerator?: (...args: Parameters<T>) => string
  } = {}
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: Parameters<T>) {
      // Generate cache key
      const cacheKey = options.keyGenerator
        ? options.keyGenerator(...args)
        : `${propertyKey}:${JSON.stringify(args)}`

      // Try cache
      const cached = await getCache(cacheKey, options)
      if (cached !== null) {
        return cached
      }

      // Execute original method
      const result = await originalMethod.apply(this, args)

      // Cache result
      await setCache(cacheKey, result, options)

      return result
    }

    return descriptor
  }
}

/**
 * Cache statistics
 */
export async function getCacheStats(prefix: string = DEFAULT_PREFIX): Promise<{
  keys: number
  memory: string
}> {
  try {
    const keys = await redis.keys(`${prefix}:*`)
    const info = await redis.info('memory')

    const memoryMatch = info.match(/used_memory_human:(.+)/)
    const memory = memoryMatch ? memoryMatch[1].trim() : 'unknown'

    return {
      keys: keys.length,
      memory,
    }
  } catch (error) {
    logger.error('Cache stats error', { error })
    return { keys: 0, memory: 'unknown' }
  }
}
