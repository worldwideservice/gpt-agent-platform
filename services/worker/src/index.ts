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

console.log('[worker] Parsing Redis URL:', redisUrl.substring(0, 20) + '...')

// Парсим URL для извлечения компонентов
// Пробуем разные форматы парсинга
let url: URL
try {
  // Стандартный формат: rediss://default:TOKEN@HOST:PORT
  url = new URL(redisUrl.replace(/^rediss?:\/\//, 'https://'))
} catch (error) {
  console.error('[worker] Failed to parse Redis URL:', error)
  throw new Error(`Invalid REDIS_URL format: ${redisUrl}`)
}

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
  urlUsername: url.username,
})

// Для Upstash пробуем разные варианты подключения
// Вариант 1: Стандартное подключение с TLS
const connectionOptions: Redis.RedisOptions = {
  host,
  port,
  password,
  username: url.username && url.username !== 'default' ? url.username : undefined,
  tls: isTLS ? {
    // Upstash требует TLS для прямого подключения
    rejectUnauthorized: true,
  } : undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  connectTimeout: 15000, // Увеличиваем таймаут до 15 секунд
  lazyConnect: false,
  // Пробуем сначала IPv4, потом IPv6
  family: 4, // Начинаем с IPv4
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    console.log(`[worker] Redis retry attempt ${times}, delay: ${delay}ms`)
    if (times > 10) {
      console.error(`[worker] Redis connection failed after ${times} attempts`)
      // После 10 попыток пробуем IPv6
      if (times === 11) {
        console.log('[worker] Trying IPv6 connection...')
        connectionOptions.family = 6
      }
    }
    return delay
  },
  reconnectOnError: (err) => {
    const targetError = 'READONLY'
    if (err.message.includes(targetError)) {
      console.log('[worker] Redis READONLY error, reconnecting...')
      return true
    }
    // Если DNS ошибка, не переподключаемся автоматически
    if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error('[worker] DNS resolution failed. Check REDIS_URL hostname.')
      return false
    }
    return false
  },
}

const connection = new Redis(connectionOptions)

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
