import { z } from 'zod'

import { loadEnvironment } from './loadEnv'

loadEnvironment()

const envSchema = z.object({
 REDIS_URL: z.string().url(),
 SUPABASE_URL: z.string().url(),
 SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
 ENCRYPTION_KEY: z.string().min(32),
 OPENROUTER_API_KEY: z.string().optional(),
 JOB_QUEUE_NAME: z.string().min(1).default('agent-jobs'),
 JOB_CONCURRENCY: z.coerce.number().int().positive().default(5),
})

// Валидация переменных окружения с понятными сообщениями об ошибках
let env: z.infer<typeof envSchema>

try {
  env = envSchema.parse({
    REDIS_URL: process.env.REDIS_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    JOB_QUEUE_NAME: process.env.JOB_QUEUE_NAME,
    JOB_CONCURRENCY: process.env.JOB_CONCURRENCY,
  })
} catch (error) {
  if (error instanceof z.ZodError) {
    const missingVars = error.errors.map((e) => e.path.join('.')).join(', ')
    console.error('❌ Missing required environment variables:', missingVars)
    console.error('Please add these variables in Railway Dashboard: Settings → Variables')
    process.exit(1)
  }
  throw error
}

export { env }
