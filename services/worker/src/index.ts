import { Worker, Queue } from 'bullmq'
import Redis from 'ioredis'

import { getTaskHandlers } from './tasks'
import { env } from './lib/env'
import { startHealthServer, setRedisConnection, setDLQ } from './health'
import { metrics } from './metrics'
import { initSentry, trackJob } from './lib/sentry'
import { logger } from './lib/logger'
import { setRedisClient as setSharedRedisClient } from '@/lib/cache'
import { DeadLetterQueue } from './lib/dead-letter-queue'

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
    logger.debug(`Redis retry attempt ${times}, delay: ${delay}ms`, {
      event: 'redis.retry',
      attempt: times,
      delay,
    })
    if (times > 10) {
      logger.error(`Redis connection failed after ${times} attempts`, undefined, {
        event: 'redis.retry.exhausted',
        attempts: times,
      })
    }
    return delay
  },
  reconnectOnError: (err) => {
    // Если DNS ошибка, не переподключаемся автоматически
    if (
      err.message.includes('ENOTFOUND') ||
      err.message.includes('getaddrinfo')
    ) {
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

// ✅ CRITICAL FIX: Initialize Dead Letter Queue for failed jobs
const dlq = new DeadLetterQueue(connection, `${env.JOB_QUEUE_NAME}:dlq`)

// Share DLQ with health check
setDLQ(dlq)

// Create main queue instance for DLQ retry functionality
const mainQueue = new Queue(env.JOB_QUEUE_NAME, { connection })

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
      await trackJob(jobName, jobId, job.data, async () => {
        await handler(job.data)
      })

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
    settings: {
      // Максимум 3 попытки перед отправкой в DLQ
      maxStalledCount: 1,
      stalledInterval: 30000,
    },
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

worker.on('failed', async (job, error) => {
  // Логирование уже выполнено в handler
  metrics.jobFailed(job?.id || '', job?.name || 'unknown', error)

  // ✅ CRITICAL FIX: Move to DLQ after max retries
  if (job) {
    const attemptsMade = job.attemptsMade
    const maxAttempts = job.opts.attempts || 3

    if (attemptsMade >= maxAttempts) {
      logger.warn('Job exceeded max retries, moving to DLQ', {
        jobId: job.id,
        jobName: job.name,
        attemptsMade,
        maxAttempts,
        event: 'job.max_retries_exceeded',
      })

      await dlq.moveToDeadLetter(job, error, attemptsMade)
    }
  }
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

// Делимся подключением с web-приложением для единого кэша
setSharedRedisClient(connection as unknown as import('ioredis').Redis)

// Запускаем health check сервер после создания подключения к Redis
setRedisConnection(connection)
startHealthServer()

logger.info('Worker started successfully', {
  queueName: env.JOB_QUEUE_NAME,
  concurrency: env.JOB_CONCURRENCY,
  event: 'worker.ready',
})

// ✅ CRITICAL FIX: Graceful shutdown для избежания потери jobs
let isShuttingDown = false

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) {
    logger.warn('Shutdown already in progress, ignoring signal', { signal })
    return
  }

  isShuttingDown = true
  logger.info(`Received ${signal}, starting graceful shutdown...`, {
    signal,
    event: 'worker.shutdown.start',
  })

  try {
    // Даем время для завершения текущих jobs
    logger.info('Closing worker (waiting for active jobs to complete)...', {
      event: 'worker.shutdown.closing',
    })

    // Закрываем worker (не принимаем новые jobs, ждем завершения текущих)
    await worker.close()

    logger.info('Worker closed successfully', {
      event: 'worker.shutdown.closed',
    })

    // Закрываем DLQ
    logger.info('Closing Dead Letter Queue...', {
      event: 'worker.shutdown.dlq.closing',
    })

    await dlq.close()
    await mainQueue.close()

    logger.info('DLQ closed successfully', {
      event: 'worker.shutdown.dlq.closed',
    })

    // Закрываем Redis соединение
    logger.info('Closing Redis connection...', {
      event: 'worker.shutdown.redis.closing',
    })

    await connection.quit()

    logger.info('Redis connection closed', {
      event: 'worker.shutdown.redis.closed',
    })

    logger.info('Graceful shutdown completed', {
      event: 'worker.shutdown.complete',
    })

    process.exit(0)
  } catch (error) {
    logger.error('Error during graceful shutdown', error, {
      event: 'worker.shutdown.error',
    })

    // Принудительно завершаем процесс
    process.exit(1)
  }
}

// Обрабатываем сигналы завершения
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Обрабатываем необработанные ошибки
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error, {
    event: 'process.uncaughtException',
  })
  // Не завершаем процесс немедленно, позволяем graceful shutdown
  gracefulShutdown('uncaughtException')
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', reason as Error, {
    event: 'process.unhandledRejection',
    promise: String(promise),
  })
  // Не завершаем процесс немедленно
})
