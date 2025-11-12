import fp from 'fastify-plugin'
import { z } from 'zod'

const envSchema = z.object({
 SUPABASE_URL: z.string().url(),
 SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
 ENCRYPTION_KEY: z.string().min(32),
 KOMMO_WEBHOOK_SECRET: z.string().optional(),
 KOMMO_OAUTH_REDIRECT_BASE: z.string().url().optional(),
 OPENROUTER_API_KEY: z.string().optional(),
 REDIS_URL: z.string().url(),
 JOB_QUEUE_NAME: z.string().min(1).default('agent-jobs'),
})

type EnvSchema = z.infer<typeof envSchema>

declare module 'fastify' {
 interface FastifyInstance {
 config: EnvSchema
 }
}

export const envPlugin = fp(async (fastify) => {
 const parsed = envSchema.safeParse(process.env)

 if (!parsed.success) {
 fastify.log.error({ issues: parsed.error.format() }, 'Invalid environment variables')
 throw parsed.error
 }

 fastify.decorate('config', parsed.data)
})
