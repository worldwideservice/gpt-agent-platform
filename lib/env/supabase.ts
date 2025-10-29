import { z } from 'zod'

const supabaseServerEnvSchema = z.object({
  SUPABASE_URL: z.string({
    required_error: 'SUPABASE_URL is required',
    invalid_type_error: 'SUPABASE_URL must be a string',
  }).url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string({
    required_error: 'SUPABASE_ANON_KEY is required',
    invalid_type_error: 'SUPABASE_ANON_KEY must be a string',
  }).min(1, 'SUPABASE_ANON_KEY cannot be empty'),
  SUPABASE_SERVICE_ROLE_KEY: z.string({
    required_error: 'SUPABASE_SERVICE_ROLE_KEY is required',
    invalid_type_error: 'SUPABASE_SERVICE_ROLE_KEY must be a string',
  }).min(1, 'SUPABASE_SERVICE_ROLE_KEY cannot be empty'),
  SUPABASE_DEFAULT_ORGANIZATION_ID: z.string({
    invalid_type_error: 'SUPABASE_DEFAULT_ORGANIZATION_ID must be a string',
  }).uuid('SUPABASE_DEFAULT_ORGANIZATION_ID must be a valid UUID').optional(),
})

const supabaseClientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string({
    required_error: 'NEXT_PUBLIC_SUPABASE_URL is required',
    invalid_type_error: 'NEXT_PUBLIC_SUPABASE_URL must be a string',
  }).url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string({
    required_error: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required',
    invalid_type_error: 'NEXT_PUBLIC_SUPABASE_ANON_KEY must be a string',
  }).min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY cannot be empty'),
})

type SupabaseServerEnvSchema = z.infer<typeof supabaseServerEnvSchema>
type SupabaseClientEnvSchema = z.infer<typeof supabaseClientEnvSchema>

const formatZodErrors = (errors: string[]): string => {
  return errors.join('; ')
}

const parseEnv = <Schema extends z.ZodTypeAny>(
  schema: Schema,
  values: Record<string, string | undefined>,
): z.infer<Schema> => {
  const result = schema.safeParse(values)

  if (result.success) {
    return result.data
  }

  const issues = result.error.issues.map((issue) => {
    const path = issue.path.join('.') || 'unknown'
    return `${path}: ${issue.message}`
  })

  throw new Error(`Supabase environment validation failed: ${formatZodErrors(issues)}`)
}

export const loadSupabaseServerEnv = (): SupabaseServerEnvSchema => {
  return parseEnv(supabaseServerEnvSchema, {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_DEFAULT_ORGANIZATION_ID: process.env.SUPABASE_DEFAULT_ORGANIZATION_ID,
  })
}

export const loadSupabaseClientEnv = (): SupabaseClientEnvSchema => {
  return parseEnv(supabaseClientEnvSchema, {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })
}

export type SupabaseServerEnv = SupabaseServerEnvSchema
export type SupabaseClientEnv = SupabaseClientEnvSchema

