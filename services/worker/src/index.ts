import { Worker } from 'bullmq'
import Redis from 'ioredis'

console.log('[worker] Starting Worker service...')
console.log('[worker] Node version:', process.version)
console.log('[worker] Working directory:', process.cwd())

import { getTaskHandlers } from './tasks'
import { env } from './lib/env.ts'
import { startHealthServer } from './health'

console.log('[worker] Environment variables loaded successfully')
console.log('[worker] Redis URL:', env.REDIS_URL ? '***configured***' : 'MISSING')
console.log('[worker] Supabase URL:', env.SUPABASE_URL ? '***configured***' : 'MISSING')

// Запускаем health check сервер
startHealthServer()

const connection = new Redis(env.REDIS_URL, {
 maxRetriesPerRequest: null,
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
