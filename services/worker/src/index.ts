import { Worker } from 'bullmq'
import Redis from 'ioredis'

console.log('[worker] Starting Worker service...')
console.log('[worker] Node version:', process.version)
console.log('[worker] Working directory:', process.cwd())

import { getTaskHandlers } from './tasks'
import { env } from './lib/env'
import { startHealthServer } from './health'

console.log('[worker] Environment variables loaded successfully')
console.log('[worker] Upstash REST URL:', env.UPSTASH_REDIS_REST_URL ? '***configured***' : 'MISSING')
console.log('[worker] Upstash REST Token:', env.UPSTASH_REDIS_REST_TOKEN ? '***configured***' : 'MISSING')
console.log('[worker] Supabase URL:', env.SUPABASE_URL ? '***configured***' : 'MISSING')

// Запускаем health check сервер
startHealthServer()

// Пробуем получить правильный Redis URL для прямого подключения
// Для Upstash прямой Redis URL обычно имеет формат: rediss://default:TOKEN@ENDPOINT:PORT
// ENDPOINT может отличаться от REST URL хоста
// Используем REST URL хост как fallback, но с правильным портом и TLS
const upstashRestUrl = new URL(env.UPSTASH_REDIS_REST_URL)
const redisHost = upstashRestUrl.hostname

// Для Upstash прямой Redis подключение обычно использует:
// - Протокол: rediss:// (TLS)
// - Порт: 6380 (для TLS) или 6379 (для non-TLS)
// - Хост: может быть тот же, что и REST URL, или другой
// Попробуем использовать тот же хост с правильным портом
const redisUrl = `rediss://default:${env.UPSTASH_REDIS_REST_TOKEN}@${redisHost}:6380`

console.log('[worker] Constructed Redis URL:', redisUrl.substring(0, 30) + '...')

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
      console.error('[worker] DNS resolution failed. Trying alternative approach...')
      // Пробуем использовать REST API как fallback
      return false
    }
    const targetError = 'READONLY'
    if (err.message.includes(targetError)) {
      console.log('[worker] Redis READONLY error, reconnecting...')
      return true
    }
    return false
  },
})

connection.on('error', (err) => {
  console.error('[worker] Redis connection error:', err.message)
})

connection.on('connect', () => {
  console.log('[worker] Redis connection established')
})

connection.on('ready', () => {
  console.log('[worker] Redis connection ready')
})

connection.on('close', () => {
  console.log('[worker] Redis connection closed')
})

const handlers = getTaskHandlers()

const worker = new Worker(
 env.JOB_QUEUE_NAME,
 async (job) => {
 const handler = handlers[job.name as keyof typeof handlers]

 if (!handler) {
 throw new Error(`No handler registered for job ${job.name}`)
 }

 await handler(job.data)
 },
 {
 connection,
 concurrency: env.JOB_CONCURRENCY,
 },
)

worker.on('completed', (job) => {
 console.log('[worker] completed', { jobId: job.id, name: job.name })
})

worker.on('failed', (job, error) => {
 console.error('[worker] failed', { jobId: job?.id, name: job?.name, error })
})

console.log(`[worker] Started processing jobs from queue: ${env.JOB_QUEUE_NAME}`)
console.log(`[worker] Concurrency: ${env.JOB_CONCURRENCY}`)
