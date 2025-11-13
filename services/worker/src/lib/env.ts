import { z } from 'zod'

import { loadEnvironment } from './loadEnv'

loadEnvironment()

const envSchema = z.object({
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ENCRYPTION_KEY: z.string().min(32),
  OPENROUTER_API_KEY: z.string().optional(),
  JOB_QUEUE_NAME: z.string().min(1).default('agent-jobs'),
  JOB_CONCURRENCY: z.coerce.number().int().positive().default(25), // Увеличено для обработки высокой нагрузки (135k-450k jobs/день)
  SENTRY_DSN: z.string().url().optional(), // Sentry DSN для мониторинга ошибок
  NODE_ENV: z.string().default('production'),
  KOMMO_WEBHOOK_SECRET: z.string().min(16).optional(),
})

// Валидация переменных окружения с понятными сообщениями об ошибках
let env: z.infer<typeof envSchema>

try {
  env = envSchema.parse({
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    JOB_QUEUE_NAME: process.env.JOB_QUEUE_NAME,
    JOB_CONCURRENCY: process.env.JOB_CONCURRENCY,
    KOMMO_WEBHOOK_SECRET: process.env.KOMMO_WEBHOOK_SECRET,
  })
} catch (error) {
  if (error instanceof z.ZodError && error.errors) {
    const missingVars = error.errors.map((e) => e.path.join('.')).join(', ')
    console.error('❌ Missing required environment variables:', missingVars)
    console.error('Please add these variables in Railway Dashboard: Settings → Variables')
    process.exit(1)
  }
  console.error('❌ Environment validation error:', error)
  throw error
}

export { env }
