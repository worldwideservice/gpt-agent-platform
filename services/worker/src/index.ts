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
// Приоритет: используем REDIS_URL если он есть, иначе формируем из REST URL и токена
let redisUrl: string

if (process.env.REDIS_URL && process.env.REDIS_URL.startsWith('rediss://')) {
  // Используем готовый REDIS_URL (если он есть и правильного формата)
  redisUrl = process.env.REDIS_URL
  logger.info('Using REDIS_URL from environment', {
    event: 'redis.config',
  })
} else {
  // Формируем URL из REST URL и токена
  // Формат для ioredis: rediss://default:TOKEN@ENDPOINT:PORT
  const upstashRestUrl = new URL(env.UPSTASH_REDIS_REST_URL)
  const redisHost = upstashRestUrl.hostname
  
  // Получаем порт из REST URL или используем 6380 по умолчанию (Upstash часто использует 6380 для TLS)
  // Если есть REDIS_URL, извлекаем порт оттуда
  let redisPort = 6380 // Upstash часто использует 6380 для TLS
  if (process.env.REDIS_URL) {
    try {
      const redisUrlObj = new URL(process.env.REDIS_URL)
      if (redisUrlObj.port) {
        redisPort = Number.parseInt(redisUrlObj.port, 10)
      }
    } catch {
      // Игнорируем ошибку парсинга
    }
  } else if (upstashRestUrl.port) {
    redisPort = Number.parseInt(upstashRestUrl.port, 10)
  }

  // Формат для ioredis: rediss://default:TOKEN@ENDPOINT:PORT
  // Для Upstash:
  // - Протокол: rediss:// (TLS обязателен)
  // - Username: default (обязателен)
  // - Порт: обычно 6380 (для TLS подключения, но может быть 6379)
  // - Password: REST Token (один и тот же токен для REST API и прямого подключения)
  redisUrl = `rediss://default:${encodeURIComponent(env.UPSTASH_REDIS_REST_TOKEN)}@${redisHost}:${redisPort}`
  
  logger.info('Redis URL constructed from REST URL', {
    redisHost,
    redisPort,
    event: 'redis.config',
  })
}

logger.info('Redis URL constructed', {
  redisHost,
  redisPort,
  hasToken: !!env.UPSTASH_REDIS_REST_TOKEN,
  tokenLength: env.UPSTASH_REDIS_REST_TOKEN.length,
  event: 'redis.config',
})

// Создаем подключение к Redis через ioredis
// Для Upstash требуется TLS и правильные настройки
const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  connectTimeout: 30000, // Увеличено до 30 секунд для Upstash
  lazyConnect: false,
  // TLS настройки для Upstash
  tls: {
    // Upstash использует самоподписанные сертификаты, поэтому нужно разрешить
    rejectUnauthorized: false, // ВАЖНО: для Upstash нужно отключить проверку сертификата
  },
  // Убираем принудительный family, позволяем системе выбрать
  family: 4, // Принудительно используем IPv4 (Upstash лучше работает с IPv4)
  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 3000) // Увеличена максимальная задержка
    logger.warn(`Redis retry attempt ${times}, delay: ${delay}ms`, {
      event: 'redis.retry',
      attempt: times,
      delay,
    })
    if (times > 10) {
      logger.error(`Redis connection failed after ${times} attempts`, {
        event: 'redis.connection.failed',
        attempts: times,
      })
      // Не возвращаем null, чтобы продолжить попытки, но с ограничением
      return Math.min(delay, 5000)
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
    logger.warn('Redis error, not reconnecting', err, {
      event: 'redis.error',
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
