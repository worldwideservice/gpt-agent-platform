/**
 * Environment Variables Validation
 * Validates and provides defaults for all required environment variables
 */

interface EnvSchema {
 [key: string]: {
 required: boolean
 default?: string | number | boolean
 validate?: (value: string) => boolean
 description: string
 }
}

const envSchema: EnvSchema = {
 // Database
 SUPABASE_URL: {
 required: true,
 validate: (value) => value.startsWith('https://') && value.includes('.supabase.co'),
 description: 'Supabase project URL',
 },
 SUPABASE_SERVICE_ROLE_KEY: {
 required: true,
 validate: (value) => value.length > 50,
 description: 'Supabase service role key for server-side operations',
 },
 NEXT_PUBLIC_SUPABASE_URL: {
 required: true,
 validate: (value) => value.startsWith('https://') && value.includes('.supabase.co'),
 description: 'Public Supabase project URL for client-side operations',
 },
 NEXT_PUBLIC_SUPABASE_ANON_KEY: {
 required: true,
 validate: (value) => value.length > 50,
 description: 'Supabase anonymous key for client-side operations',
 },

 // Redis
 REDIS_URL: {
 required: false,
 default: '',
 validate: (value) => !value || value.startsWith('redis://') || value.startsWith('rediss://'),
 description: 'Redis connection URL (optional, caching disabled if not provided)',
 },

 // Authentication
 NEXTAUTH_URL: {
 required: true,
 validate: (value) => value.startsWith('http'),
 description: 'NextAuth base URL',
 },
 NEXTAUTH_SECRET: {
 required: true,
 validate: (value) => value.length > 16,
 description: 'NextAuth secret for JWT encryption',
 },

 // External APIs
 OPENROUTER_API_KEY: {
 required: false,
 validate: (value) => !value || value.startsWith('sk-or-v1-'),
 description: 'OpenRouter API key for AI model access',
 },
 KOMMO_TEST_ENABLED: {
 required: false,
 default: '0',
 validate: (value) => ['0', '1', 'true', 'false'].includes(value.toLowerCase()),
 description: 'Enable Kommo test endpoint and scripts (development only)',
 },
 KOMMO_TEST_DOMAIN: {
 required: false,
 description: 'Kommo API domain used for manual testing',
 },
 KOMMO_TEST_CLIENT_ID: {
 required: false,
 description: 'Kommo OAuth client ID for manual testing',
 },
 KOMMO_TEST_CLIENT_SECRET: {
 required: false,
 description: 'Kommo OAuth client secret for manual testing',
 },
 KOMMO_TEST_REDIRECT_URI: {
 required: false,
 description: 'Kommo OAuth redirect URI for manual testing',
 },
 KOMMO_TEST_ACCESS_TOKEN: {
 required: false,
 description: 'Kommo access token used for manual testing',
 },
 KOMMO_TEST_REFRESH_TOKEN: {
 required: false,
 description: 'Kommo refresh token used for manual testing',
 },
 SENTRY_DSN: {
 required: false,
 validate: (value) => !value || value.includes('sentry.io'),
 description: 'Sentry DSN for error tracking',
 },

 // Feature Flags
 E2E_ONBOARDING_FAKE: {
 required: false,
 default: '0',
 validate: (value) => ['0', '1'].includes(value),
 description: 'Enable fake onboarding for E2E tests',
 },
 DEMO_MODE: {
 required: false,
 default: '0',
 validate: (value) => ['0', '1'].includes(value),
 description: 'Enable demo mode with limited functionality',
 },

 // Organization defaults
 SUPABASE_DEFAULT_ORGANIZATION_ID: {
 required: false,
 validate: (value) => !value || !!value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
 description: 'Default organization UUID for demo users',
 },
}

export interface ValidatedEnv {
 [key: string]: string | number | boolean
}

/**
 * Validates all environment variables against the schema
 * @throws Error if required variables are missing or invalid
 * @returns Validated environment variables with defaults applied
 */
export function validateEnvironment(): ValidatedEnv {
 const validated: ValidatedEnv = {}
 const errors: string[] = []

 for (const [key, schema] of Object.entries(envSchema)) {
 const value = process.env[key]

 // Check if required variable is missing
 if (schema.required && (!value || value.trim() === '')) {
 errors.push(`Missing required environment variable: ${key}`)
 continue
 }

 // Use default value if not provided
 const finalValue = value || schema.default?.toString() || ''

 // Validate value format if validator is provided and value is not empty
 if (schema.validate && finalValue && !schema.validate(finalValue)) {
 // Only validate format if value is provided and not empty
 errors.push(`Invalid format for ${key}: ${schema.description}`)
 continue
 }

 // Convert to appropriate type
 if (typeof schema.default === 'boolean') {
 validated[key] = finalValue === '1' || finalValue.toLowerCase() === 'true'
 } else if (typeof schema.default === 'number') {
 validated[key] = parseInt(finalValue, 10)
 } else {
 validated[key] = finalValue
 }
 }

 if (errors.length > 0) {
 throw new Error(`Environment validation failed:\n${errors.join('\n')}`)
 }

 return validated
}

/**
 * Gets a validated environment variable
 * @param key - Environment variable name
 * @returns The validated value
 * @throws Error if variable is not configured properly
 */
export function getValidatedEnv(key: string): string | number | boolean {
 const validated = validateEnvironment()
 return validated[key]
}

/**
 * Logs environment validation status
 */
export function logEnvironmentStatus(): void {
 try {
 const validated = validateEnvironment()
 const requiredVars = Object.keys(envSchema).filter(key => envSchema[key].required)
 const optionalVars = Object.keys(envSchema).filter(key => !envSchema[key].required)

 console.log('✅ Environment validation passed')
 console.log(`📋 Required variables: ${requiredVars.length}/${requiredVars.length} configured`)
 console.log(`📋 Optional variables: ${optionalVars.filter(key => validated[key]).length}/${optionalVars.length} configured`)
 } catch (error) {
 console.error('❌ Environment validation failed:', error instanceof Error ? error.message : String(error))
 throw error
 }
}
