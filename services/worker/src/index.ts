import { Worker } from 'bullmq'
import Redis from 'ioredis'

console.log('[worker] Starting Worker service...')
console.log('[worker] Node version:', process.version)
console.log('[worker] Working directory:', process.cwd())

import { getTaskHandlers } from './tasks'
import { env } from './lib/env'
import { startHealthServer } from './health'

console.log('[worker] Environment variables loaded successfully')
console.log('[worker] Redis URL:', env.REDIS_URL ? '***configured***' : 'MISSING')
console.log('[worker] Supabase URL:', env.SUPABASE_URL ? '***configured***' : 'MISSING')

// Запускаем health check сервер
startHealthServer()

// Настройки подключения к Redis для Upstash
// Upstash требует TLS и может использовать IPv6
const redisUrl = env.REDIS_URL
if (!redisUrl) {
  throw new Error('REDIS_URL is required')
}

// Парсим URL для извлечения компонентов
const url = new URL(redisUrl.replace(/^rediss?:\/\//, 'https://'))
const isTLS = redisUrl.startsWith('rediss://')
const host = url.hostname
const port = parseInt(url.port) || (isTLS ? 6380 : 6379)
const password = url.password || url.username

console.log('[worker] Redis connection details:', {
  host,
  port,
  isTLS,
  hasPassword: !!password,
  protocol: isTLS ? 'rediss' : 'redis',
})

const connection = new Redis({
  host,
  port,
  password,
  username: url.username && url.username !== 'default' ? url.username : undefined,
  tls: isTLS ? {
    // Upstash требует TLS для прямого подключения
    rejectUnauthorized: true,
  } : undefined,
  // Убираем принудительный IPv6, позволяем системе выбрать автоматически
  // family: 4, // Попробуем IPv4 сначала
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  connectTimeout: 10000, // 10 секунд таймаут подключения
  lazyConnect: false,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    console.log(`[worker] Redis retry attempt ${times}, delay: ${delay}ms`)
    if (times > 5) {
      console.error(`[worker] Redis connection failed after ${times} attempts`)
    }
    return delay
  },
  reconnectOnError: (err) => {
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
