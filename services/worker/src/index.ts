// Регистрируем tsconfig-paths для резолва path aliases (@/lib, @/types и т.д.)
// Это необходимо для правильного резолва импортов в lib/ файлах, которые используют @/ импорты
import { register } from 'tsconfig-paths'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

// Определяем корень проекта (где находится tsconfig.json)
// В ESM __dirname не доступен, используем import.meta.url
const currentFile = fileURLToPath(import.meta.url)
const currentDir = dirname(currentFile)
// dist/index.js -> services/worker/dist/index.js
// Корень проекта на 2 уровня выше: /app
const projectRoot = resolve(currentDir, '../..')

// Регистрируем path aliases из корневого tsconfig.json
register({
  baseUrl: projectRoot,
  paths: {
    '@/*': ['./*'],
    '@/lib/*': ['./lib/*'],
    '@/types/*': ['./types/*'],
  },
})

import { Worker } from 'bullmq'
import Redis from 'ioredis'

import { getTaskHandlers } from './tasks'
import { env } from './lib/env'
import { startHealthServer } from './health'

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
