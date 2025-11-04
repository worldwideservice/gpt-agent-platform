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

// Для прямого подключения к Upstash Redis через ioredis используем формат:
// rediss://default:TOKEN@ENDPOINT:6379
// 
// Данные получены из Upstash Console:
// - Endpoint: тот же хост, что и REST URL (composed-primate-14678.upstash.io)
// - Port: 6379 (для TLS подключения)
// - Username: default (обязателен для Upstash)
// - Password: тот же REST Token используется для прямого подключения
const upstashRestUrl = new URL(env.UPSTASH_REDIS_REST_URL)
const redisHost = upstashRestUrl.hostname

// Формат для ioredis: rediss://default:TOKEN@ENDPOINT:6379
// Для Upstash:
// - Протокол: rediss:// (TLS обязателен)
// - Username: default (обязателен)
// - Порт: 6379 (для TLS подключения)
// - Password: REST Token (один и тот же токен для REST API и прямого подключения)
const redisUrl = `rediss://default:${env.UPSTASH_REDIS_REST_TOKEN}@${redisHost}:6379`

logger.debug('Redis URL constructed', {
  redisHost,
  event: 'redis.config',
})

// Создаем подключение к Redis через ioredis
// Для Upstash требуется TLS и правильные настройки
const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  connectTimeout: 15000,
  lazyConnect: false,
  // Убираем принудительный family, позволяем системе выбрать
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    console.log(`[worker] Redis retry attempt ${times}, delay: ${delay}ms`)
    if (times > 10) {
      console.error(`[worker] Redis connection failed after ${times} attempts`)
    }
    return delay
  },
  reconnectOnError: (err) => {
    // Если DNS ошибка, не переподключаемся автоматически
    if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      logger.error('DNS resolution failed', err, {
        event: 'redis.dns.failed',
      })
      // Пробуем использовать REST API как fallback
      return false
    }
    const targetError = 'READONLY'
    if (err.message.includes(targetError)) {
      logger.warn('Redis READONLY error, reconnecting...', {
        event: 'redis.readonly',
      })
      return true
    }
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
