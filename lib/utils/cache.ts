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

  // Prevent Redis connection during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null
  }

  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) {
    logger.warn('REDIS_URL not configured, caching disabled')
    return null
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      connectTimeout: 10000,
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) return null
        return Math.min(times * 50, 2000)
      }
    })

    redisClient.on('error', (error) => {
      if (!process.env.CI) {
        logger.error('Redis connection error', error, { message: error.message })
      }
      // Don't nullify immediately, let it try to reconnect
    })

    return redisClient
  } catch (error) {
    logger.error('Failed to initialize Redis', error)
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
    logger.error('Failed to get cache key', error, { key })
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
    logger.error('Failed to set cache key', error, { key, ttl })
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
    logger.error('Failed to delete cache key', error, { key })
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
    const dashboardKeys = await client.keys(`cache:dashboard:${orgId}:*`)
    const agentsListKeys = await client.keys(`cache:agents-list:${orgId}:*`)

    const allKeys = [...keys, ...crmKeys, ...dashboardKeys, ...agentsListKeys]
    if (allKeys.length > 0) {
      await client.del(...allKeys)
    }
  } catch (error) {
    logger.error('Failed to invalidate org cache', error, { orgId })
  }
}

/**
 * Задача 4.4: Кэширование dashboard stats
 * TTL: 60 секунд (данные обновляются редко)
 */
export async function getCachedDashboardStats(orgId: string): Promise<any | null> {
  return getCache(generateCacheKey('dashboard', orgId, 'stats'))
}

export async function setCachedDashboardStats(orgId: string, stats: any): Promise<void> {
  // Короткий TTL для dashboard stats (60 секунд)
  await setCache(generateCacheKey('dashboard', orgId, 'stats'), stats, 60)
}

/**
 * Задача 4.4: Кэширование списка агентов
 * TTL: 120 секунд для списков
 */
export async function getCachedAgentsList(orgId: string, filterKey: string): Promise<any | null> {
  return getCache(generateCacheKey('agents-list', orgId, filterKey))
}

export async function setCachedAgentsList(orgId: string, filterKey: string, agents: any): Promise<void> {
  // TTL 120 секунд для списков агентов
  await setCache(generateCacheKey('agents-list', orgId, filterKey), agents, 120)
}

/**
 * Задача 4.4: Кэширование activity metrics
 * TTL: 180 секунд
 */
export async function getCachedActivityMetrics(orgId: string, type: string): Promise<any | null> {
  return getCache(generateCacheKey('activity', orgId, type))
}

export async function setCachedActivityMetrics(orgId: string, type: string, data: any): Promise<void> {
  // TTL 180 секунд для metrics
  await setCache(generateCacheKey('activity', orgId, type), data, 180)
}

/**
 * Инвалидация кэша списков агентов
 */
export async function invalidateAgentsListCache(orgId: string): Promise<void> {
  const client = getRedisClient()
  if (!client) {
    return
  }

  try {
    const keys = await client.keys(`cache:agents-list:${orgId}:*`)
    if (keys.length > 0) {
      await client.del(...keys)
    }
  } catch (error) {
    logger.error('Failed to invalidate agents list cache', error, { orgId })
  }
}

