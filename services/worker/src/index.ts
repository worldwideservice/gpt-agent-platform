import { Worker } from 'bullmq'
import Redis from 'ioredis'

import { getTaskHandlers } from './tasks'
import { env } from './lib/env'
import { startHealthServer, setRedisConnection } from './health'
import { metrics } from './metrics'
import { initSentry, trackJob } from './lib/sentry'
import { logger } from './lib/logger'

logger.info('Starting Worker service', {
  nodeVersion: process.version,
  workingDirectory: process.cwd(),
  event: 'worker.start',
})

// Инициализируем Sentry как можно раньше для отслеживания всех ошибок
initSentry()

logger.info('Environment variables loaded', {
  redisConfigured: !!env.UPSTASH_REDIS_REST_URL,
  supabaseConfigured: !!env.SUPABASE_URL,
  event: 'worker.config',
})

// Инициализируем метрики
metrics.init(env.JOB_QUEUE_NAME, env.JOB_CONCURRENCY)

// Для прямого подключения к Upstash Redis через ioredis
// ВСЕГДА формируем URL из UPSTASH_REDIS_REST_URL для надежности
// Игнорируем REDIS_URL полностью, так как он может содержать неправильный хост
let redisUrl: string
let redisHost: string = ''
let redisPort: number = 6379 // Upstash использует 6379 для TLS (не 6380)

// Формируем URL из REST URL и токена
// REST URL: https://xxx.upstash.io (без порта, это HTTPS endpoint)
// Для прямого TCP подключения используем тот же хост, но порт 6379 (TLS)
const upstashRestUrl = new URL(env.UPSTASH_REDIS_REST_URL)
redisHost = upstashRestUrl.hostname

// REST URL не содержит порт (это HTTPS endpoint), поэтому используем дефолтный порт для TLS
// Upstash использует порт 6379 для TLS подключения (не 6380)
// Если в будущем REST URL будет содержать порт, используем его
if (upstashRestUrl.port) {
  redisPort = Number.parseInt(upstashRestUrl.port, 10)
} else {
  // Для Upstash прямой TCP подключение использует порт 6379 с TLS
  redisPort = 6379
}

// Формат для ioredis: rediss://default:TOKEN@ENDPOINT:PORT
// Для Upstash:
// - Протокол: rediss:// (TLS обязателен)
// - Username: default (обязателен)
// - Порт: 6379 (для TLS подключения к Upstash)
// - Password: REST Token (один и тот же токен для REST API и прямого подключения)
redisUrl = `rediss://default:${encodeURIComponent(env.UPSTASH_REDIS_REST_TOKEN)}@${redisHost}:${redisPort}`

logger.info('Redis URL constructed from REST URL (REDIS_URL ignored)', {
  redisHost,
  redisPort,
  hasToken: !!env.UPSTASH_REDIS_REST_TOKEN,
  tokenLength: env.UPSTASH_REDIS_REST_TOKEN.length,
  restUrl: env.UPSTASH_REDIS_REST_URL,
  event: 'redis.config',
})

logger.info('Redis URL ready', {
  redisHost,
  redisPort,
  redisUrl: redisUrl.replace(/:[^:@]+@/, ':****@'), // Маскируем токен в логах
  event: 'redis.config',
})

// Создаем подключение к Redis через ioredis
// Для Upstash требуется TLS и правильные настройки
const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  connectTimeout: 60000, // Увеличено до 60 секунд для Upstash (может быть медленное подключение)
  lazyConnect: false,
  // TLS настройки для Upstash
  tls: {
    // Upstash использует самоподписанные сертификаты, поэтому нужно разрешить
    rejectUnauthorized: false, // ВАЖНО: для Upstash нужно отключить проверку сертификата
  },
  // Убираем принудительный family - позволяем системе выбрать IPv4/IPv6
  // Это может помочь избежать проблем с сетью в некоторых регионах
  // family: undefined, // Удалено - используем дефолтное поведение системы
  retryStrategy: (times) => {
    // Экспоненциальная задержка с jitter для избежания thundering herd
    // Формула: baseDelay * (2^attempt) + random(0, baseDelay)
    const baseDelay = 200
    const exponentialDelay = Math.min(baseDelay * Math.pow(2, times - 1), 10000) // Максимум 10 секунд
    const jitter = Math.random() * baseDelay // Добавляем случайность 0-200ms
    const delay = Math.min(exponentialDelay + jitter, 15000) // Финальная задержка с ограничением 15 секунд
    
    logger.warn(`Redis retry attempt ${times}, delay: ${Math.round(delay)}ms`, {
      event: 'redis.retry',
      attempt: times,
      delay: Math.round(delay),
      exponentialDelay: Math.round(exponentialDelay),
      jitter: Math.round(jitter),
    })
    
    if (times > 30) {
      logger.error(`Redis connection failed after ${times} attempts, will continue with max delay`, {
        event: 'redis.connection.failed',
        attempts: times,
      })
      // Не возвращаем null, чтобы продолжить попытки, но с максимальной задержкой
      return 15000 // Максимальная задержка 15 секунд
    }
    return delay
  },
  reconnectOnError: (err) => {
    const errorMessage = err.message.toLowerCase()
    
    // Если DNS ошибка, не переподключаемся автоматически
    if (errorMessage.includes('enotfound') || errorMessage.includes('getaddrinfo') || errorMessage.includes('eai_again')) {
      logger.error('DNS resolution failed, will not reconnect', err, {
        event: 'redis.dns.failed',
      })
      return false
    }
    
    // ВАЖНО: Upstash может возвращать таймаут как "timed-out or wrong username-password"
    // Если ошибка содержит "timed-out", пробуем переподключиться (даже если есть "wrong username-password")
    // Это может быть временный сетевой таймаут, а не реальная проблема с токеном
    if (errorMessage.includes('timed-out') || errorMessage.includes('timeout')) {
      // Если ошибка содержит и "timed-out" и "wrong username-password", это скорее всего временный таймаут
      if (errorMessage.includes('wrong username-password')) {
        logger.warn('Redis timeout with auth error (likely temporary), will reconnect', {
          event: 'redis.timeout.auth',
          error: err.message,
        })
        return true // Пробуем переподключиться при временном таймауте
      }
      logger.warn('Redis timeout, will reconnect', {
        event: 'redis.timeout',
        error: err.message,
      })
      return true
    }
    
    // Если ошибка аутентификации БЕЗ таймаута, не переподключаемся (реальная проблема с токеном)
    if ((errorMessage.includes('auth') || errorMessage.includes('password') || errorMessage.includes('wrong username-password')) 
        && !errorMessage.includes('timeout') && !errorMessage.includes('timed-out')) {
      logger.error('Redis authentication failed (no timeout), check UPSTASH_REDIS_REST_TOKEN', err, {
        event: 'redis.auth.failed',
        error: err.message,
      })
      return false
    }
    
    // Если READONLY ошибка, переподключаемся
    if (errorMessage.includes('readonly')) {
      logger.warn('Redis READONLY error, reconnecting...', {
        event: 'redis.readonly',
        error: err.message,
      })
      return true
    }
    
    // Для других ошибок пробуем переподключиться (может быть временная проблема)
    logger.warn('Redis error, will reconnect', {
      event: 'redis.error',
      error: err.message,
    })
    return true // Изменено: теперь переподключаемся при неизвестных ошибках (может быть временная проблема)
  },
})

connection.on('error', (err) => {
  logger.redisError(err)
  metrics.redisError(err)
})

connection.on('connect', () => {
  logger.redisConnect()
  metrics.redisConnected()
})

connection.on('ready', () => {
  logger.info('Redis connection ready', {
    event: 'redis.ready',
  })
  metrics.redisConnected()
})

connection.on('close', () => {
  logger.redisDisconnect()
  metrics.redisDisconnected()
})

connection.on('reconnecting', () => {
  logger.redisReconnectAttempt(metrics.getMetrics().redis.reconnectAttempts)
  metrics.redisReconnectAttempt()
})

// Периодическая проверка подключения (health check)
// Выполняется каждые 30 секунд для автоматического обнаружения проблем
let healthCheckInterval: ReturnType<typeof setInterval> | null = null
const startHealthCheck = () => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
  }
  
  healthCheckInterval = setInterval(async () => {
    try {
      // Простая проверка - попытка выполнить PING
      const result = await connection.ping()
      if (result === 'PONG') {
        // Подключение работает нормально
        logger.debug('Redis health check: OK', {
          event: 'redis.health.check',
          status: 'ok',
        })
      } else {
        logger.warn('Redis health check: unexpected response', {
          event: 'redis.health.check',
          status: 'unexpected',
          response: result,
        })
      }
    } catch (error) {
      // При ошибке health check логируем, но не переподключаемся вручную
      // ioredis сам переподключится через reconnectOnError
      logger.warn('Redis health check: failed', {
        event: 'redis.health.check',
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }, 30000) // Проверка каждые 30 секунд
  
  logger.info('Redis health check started (every 30s)', {
    event: 'redis.health.check.start',
  })
}

// Запускаем health check после успешного подключения
connection.once('ready', () => {
  startHealthCheck()
})

// Останавливаем health check при закрытии подключения
connection.on('close', () => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval)
    healthCheckInterval = null
    logger.info('Redis health check stopped', {
      event: 'redis.health.check.stop',
    })
  }
})

const handlers = getTaskHandlers()

const worker = new Worker(
  env.JOB_QUEUE_NAME,
  async (job) => {
    const jobId = job.id || 'unknown'
    const jobName = job.name
    const startTime = Date.now()

    // Отмечаем начало обработки job
    metrics.jobStarted(jobId, jobName)
    logger.jobStart(jobId, jobName, job.data)

    const handler = handlers[jobName as keyof typeof handlers]

    if (!handler) {
      const error = new Error(`No handler registered for job ${jobName}`)
      logger.jobFailed(jobId, jobName, error)
      throw error
    }

    // Обертываем выполнение job в Sentry tracking для автоматического отслеживания ошибок
    try {
      await trackJob(
        jobName,
        jobId,
        job.data,
        async () => {
          await handler(job.data)
        },
      )
      
      const duration = Date.now() - startTime
      logger.jobComplete(jobId, jobName, duration)
    } catch (error) {
      const duration = Date.now() - startTime
      logger.jobFailed(jobId, jobName, error, duration)
      throw error
    }
  },
  {
    connection,
    concurrency: env.JOB_CONCURRENCY,
    // Настройки для высокой нагрузки
    removeOnComplete: {
      count: 1000, // Хранить последние 1000 успешных jobs
      age: 24 * 3600, // 24 часа
    },
    removeOnFail: {
      count: 5000, // Хранить последние 5000 неудачных jobs для анализа
      age: 7 * 24 * 3600, // 7 дней
    },
    // Настройки для stalled jobs
    lockDuration: 30000, // 30 секунд на обработку job
    lockRenewTime: 15000, // Обновлять блокировку каждые 15 секунд
  },
)

worker.on('active', (job) => {
  logger.debug(`Job ${job.id} (${job.name}) started processing`, {
    jobId: job.id,
    jobName: job.name,
    event: 'job.active',
  })
})

worker.on('completed', (job) => {
  // Логирование уже выполнено в handler
  metrics.jobCompleted(job.id || '', job.name)
})

worker.on('failed', (job, error) => {
  // Логирование уже выполнено в handler
  metrics.jobFailed(job?.id || '', job?.name || 'unknown', error)
})

worker.on('stalled', (jobId) => {
  logger.warn(`Job ${jobId} stalled`, {
    jobId,
    event: 'job.stalled',
  })
})

worker.on('error', (error) => {
  logger.error('Worker error', error, {
    event: 'worker.error',
  })
})

// Запускаем health check сервер после создания подключения к Redis
startHealthServer()
setRedisConnection(connection)

logger.info('Worker started successfully', {
  queueName: env.JOB_QUEUE_NAME,
  concurrency: env.JOB_CONCURRENCY,
  event: 'worker.ready',
})
