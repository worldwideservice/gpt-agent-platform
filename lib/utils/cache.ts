/**
 * Кэширование для часто запрашиваемых данных
 * Использует Redis для распределенного кэша
 */

import { Redis } from 'ioredis'
import { logger } from '@/lib/utils/logger'

let redisClient: Redis | null = null

/**
 * Инициализация Redis клиента
 */
function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient
  }

  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) {
    logger.warn('[cache] REDIS_URL not configured, caching disabled')
    return null
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      connectTimeout: 10000,
      lazyConnect: true,
    })

    redisClient.on('error', (error) => {
      logger.error('[cache] Redis connection error', { error: error.message })
      redisClient = null
    })

    return redisClient
  } catch (error) {
    logger.error('[cache] Failed to initialize Redis', { error })
    return null
  }
}

/**
 * Опции кэширования
 */
export interface CacheOptions {
  ttl?: number // Time to live в секундах (по умолчанию 300 = 5 минут)
  keyPrefix?: string // Префикс для ключа
  forceRefresh?: boolean // Принудительное обновление кэша
}

const DEFAULT_TTL = 300 // 5 минут

/**
 * Получает значение из кэша
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient()
  if (!client) {
    return null
  }

  try {
    const value = await client.get(key)
    if (!value) {
      return null
    }

    return JSON.parse(value) as T
  } catch (error) {
    logger.error('[cache] Failed to get key', { key, error })
    return null
  }
}

/**
 * Сохраняет значение в кэш
 */
export async function setCache<T>(key: string, value: T, ttl: number = DEFAULT_TTL): Promise<boolean> {
  const client = getRedisClient()
  if (!client) {
    return false
  }

  try {
    await client.setex(key, ttl, JSON.stringify(value))
    return true
  } catch (error) {
    logger.error('[cache] Failed to set key', { key, ttl, error })
    return false
  }
}

/**
 * Удаляет значение из кэша
 */
export async function deleteCache(key: string): Promise<boolean> {
  const client = getRedisClient()
  if (!client) {
    return false
  }

  try {
    await client.del(key)
    return true
  } catch (error) {
    logger.error('[cache] Failed to delete key', { key, error })
    return false
  }
}

/**
 * Генерирует ключ кэша с префиксом
 */
function generateCacheKey(prefix: string, ...parts: Array<string | number>): string {
  return `${prefix}:${parts.join(':')}`
}

/**
 * Выполняет функцию с кэшированием результата
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = DEFAULT_TTL, keyPrefix = 'cache', forceRefresh = false } = options

  const cacheKey = options.keyPrefix ? generateCacheKey(keyPrefix, key) : key

  // Если не принудительное обновление - проверяем кэш
  if (!forceRefresh) {
    const cached = await getCache<T>(cacheKey)
    if (cached !== null) {
      return cached
    }
  }

  // Выполняем функцию и кэшируем результат
  const result = await fn()
  await setCache(cacheKey, result, ttl)

  return result
}

/**
 * Кэширование для данных агента
 */
export async function getCachedAgent(agentId: string, orgId: string): Promise<any | null> {
  return getCache(generateCacheKey('agent', orgId, agentId))
}

export async function setCachedAgent(agentId: string, orgId: string, agent: any, ttl: number = 600): Promise<void> {
  await setCache(generateCacheKey('agent', orgId, agentId), agent, ttl)
}

/**
 * Кэширование для CRM данных
 */
export async function getCachedCrmData(key: string, orgId: string): Promise<any | null> {
  return getCache(generateCacheKey('crm', orgId, key))
}

export async function setCachedCrmData(key: string, orgId: string, data: any, ttl: number = 300): Promise<void> {
  await setCache(generateCacheKey('crm', orgId, key), data, ttl)
}

/**
 * Инвалидация кэша агента
 */
export async function invalidateAgentCache(agentId: string, orgId: string): Promise<void> {
  await deleteCache(generateCacheKey('agent', orgId, agentId))
}

/**
 * Инвалидация всех кэшей организации
 */
export async function invalidateOrgCache(orgId: string): Promise<void> {
  const client = getRedisClient()
  if (!client) {
    return
  }

  try {
    const keys = await client.keys(`cache:agent:${orgId}:*`)
    const crmKeys = await client.keys(`cache:crm:${orgId}:*`)
    
    if (keys.length > 0 || crmKeys.length > 0) {
      await client.del(...keys, ...crmKeys)
    }
  } catch (error) {
    logger.error('[cache] Failed to invalidate org cache', { orgId, error })
  }
}

