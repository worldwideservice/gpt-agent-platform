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
    // Экспоненциальная задержка с максимальным ограничением
    const delay = Math.min(times * 200, 10000) // Увеличена задержка до 10 секунд максимум
    logger.warn(`Redis retry attempt ${times}, delay: ${delay}ms`, {
      event: 'redis.retry',
      attempt: times,
      delay,
    })
    if (times > 20) {
      logger.error(`Redis connection failed after ${times} attempts`, {
        event: 'redis.connection.failed',
        attempts: times,
      })
      // Не возвращаем null, чтобы продолжить попытки, но с ограничением
      return Math.min(delay, 15000) // Максимальная задержка 15 секунд
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
    
    // Если ошибка аутентификации, не переподключаемся (проблема с токеном)
    if (errorMessage.includes('auth') || errorMessage.includes('password') || errorMessage.includes('wrong username-password')) {
      logger.error('Redis authentication failed, check UPSTASH_REDIS_REST_TOKEN', err, {
        event: 'redis.auth.failed',
      })
      return false
    }
    
    // Если ошибка таймаута, пробуем переподключиться
    if (errorMessage.includes('timeout') || errorMessage.includes('timed-out')) {
      logger.warn('Redis timeout, will reconnect', {
        event: 'redis.timeout',
      })
      return true
    }
    
    // Если READONLY ошибка, переподключаемся
    if (errorMessage.includes('readonly')) {
      logger.warn('Redis READONLY error, reconnecting...', {
        event: 'redis.readonly',
      })
      return true
    }
    
    // Для других ошибок не переподключаемся автоматически
    logger.warn('Redis error, not reconnecting', {
      event: 'redis.error',
      error: err.message,
    })
    return false
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
