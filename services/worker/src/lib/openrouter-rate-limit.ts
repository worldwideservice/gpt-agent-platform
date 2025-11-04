/**
 * OpenRouter Rate Limiting
 * Защита от превышения лимитов API при высокой нагрузке
 */

import type { Redis } from 'ioredis'

interface RateLimitConfig {
  maxRequestsPerMinute: number
  maxRequestsPerHour: number
  maxRequestsPerDay: number
}

/**
 * Конфигурация rate limits для OpenRouter API
 * Настройте под ваш план OpenRouter
 */
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequestsPerMinute: 100, // 100 запросов в минуту
  maxRequestsPerHour: 5000, // 5000 запросов в час
  maxRequestsPerDay: 100000, // 100,000 запросов в день
}

export class OpenRouterRateLimiter {
  private redis: Redis
  private config: RateLimitConfig

  constructor(redis: Redis, config: Partial<RateLimitConfig> = {}) {
    this.redis = redis
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Проверить, можно ли выполнить запрос к OpenRouter API
   * @param organizationId - ID организации для разделения лимитов
   * @returns true если можно выполнить запрос, false если превышен лимит
   */
  async canMakeRequest(organizationId?: string): Promise<boolean> {
    const key = organizationId || 'default'
    const now = Date.now()

    // Проверка лимита в минуту
    const minuteKey = `openrouter:rate-limit:${key}:minute:${Math.floor(now / 60000)}`
    const minuteCount = await this.redis.incr(minuteKey)
    await this.redis.expire(minuteKey, 60) // TTL 60 секунд

    if (minuteCount > this.config.maxRequestsPerMinute) {
      console.warn(`[rate-limit] OpenRouter minute limit exceeded for ${key}: ${minuteCount}/${this.config.maxRequestsPerMinute}`)
      return false
    }

    // Проверка лимита в час
    const hourKey = `openrouter:rate-limit:${key}:hour:${Math.floor(now / 3600000)}`
    const hourCount = await this.redis.incr(hourKey)
    await this.redis.expire(hourKey, 3600) // TTL 1 час

    if (hourCount > this.config.maxRequestsPerHour) {
      console.warn(`[rate-limit] OpenRouter hour limit exceeded for ${key}: ${hourCount}/${this.config.maxRequestsPerHour}`)
      return false
    }

    // Проверка лимита в день
    const dayKey = `openrouter:rate-limit:${key}:day:${Math.floor(now / 86400000)}`
    const dayCount = await this.redis.incr(dayKey)
    await this.redis.expire(dayKey, 86400) // TTL 24 часа

    if (dayCount > this.config.maxRequestsPerDay) {
      console.warn(`[rate-limit] OpenRouter day limit exceeded for ${key}: ${dayCount}/${this.config.maxRequestsPerDay}`)
      return false
    }

    return true
  }

  /**
   * Получить текущее количество использованных запросов
   */
  async getUsage(organizationId?: string): Promise<{
    minute: number
    hour: number
    day: number
    limits: RateLimitConfig
  }> {
    const key = organizationId || 'default'
    const now = Date.now()

    const minuteKey = `openrouter:rate-limit:${key}:minute:${Math.floor(now / 60000)}`
    const hourKey = `openrouter:rate-limit:${key}:hour:${Math.floor(now / 3600000)}`
    const dayKey = `openrouter:rate-limit:${key}:day:${Math.floor(now / 86400000)}`

    const [minute, hour, day] = await Promise.all([
      this.redis.get(minuteKey).then((v) => parseInt(v || '0', 10)),
      this.redis.get(hourKey).then((v) => parseInt(v || '0', 10)),
      this.redis.get(dayKey).then((v) => parseInt(v || '0', 10)),
    ])

    return {
      minute,
      hour,
      day,
      limits: this.config,
    }
  }

  /**
   * Обертка для выполнения запроса с автоматической проверкой rate limit
   */
  async withRateLimit<T>(
    organizationId: string | undefined,
    requestFn: () => Promise<T>,
    retryDelay: number = 1000,
    maxRetries: number = 5,
  ): Promise<T> {
    let attempts = 0

    while (attempts < maxRetries) {
      const canMake = await this.canMakeRequest(organizationId)

      if (canMake) {
        try {
          return await requestFn()
        } catch (error: any) {
          // Если это rate limit error от OpenRouter, ждем и повторяем
          if (error?.status === 429 || error?.message?.includes('rate limit')) {
            attempts++
            const delay = retryDelay * Math.pow(2, attempts) // Exponential backoff
            console.warn(`[rate-limit] OpenRouter rate limit error, retrying in ${delay}ms (attempt ${attempts}/${maxRetries})`)
            await new Promise((resolve) => setTimeout(resolve, delay))
            continue
          }
          throw error
        }
      } else {
        // Превышен наш внутренний лимит, ждем и повторяем
        attempts++
        const delay = retryDelay * Math.pow(2, attempts)
        console.warn(`[rate-limit] Internal rate limit exceeded, waiting ${delay}ms before retry (attempt ${attempts}/${maxRetries})`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw new Error(`OpenRouter rate limit: failed after ${maxRetries} attempts`)
  }
}

