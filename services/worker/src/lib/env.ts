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

export const env = envSchema.parse({
  REDIS_URL: process.env.REDIS_URL,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  JOB_QUEUE_NAME: process.env.JOB_QUEUE_NAME,
  JOB_CONCURRENCY: process.env.JOB_CONCURRENCY,
})
