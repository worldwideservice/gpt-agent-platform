/**
 * Environment Variables Validation
 * Validates and provides defaults for all required environment variables
 * 
 * Обновлено: 2025-01-26
 * Удалены неиспользуемые переменные, добавлены актуальные
 */

interface EnvSchema {
  [key: string]: {
    required: boolean
    default?: string | number | boolean
    validate?: (value: string) => boolean
    description: string
  }
}

export const envSchema: EnvSchema = {
  // ============================================================================
  // ОБЯЗАТЕЛЬНЫЕ ПЕРЕМЕННЫЕ (Критично для работы)
  // ============================================================================

  // Database - Supabase
  SUPABASE_URL: {
    required: true,
    validate: (value) => value.startsWith('https://') && value.includes('.supabase.co'),
    description: 'Supabase project URL',
  },
  SUPABASE_ANON_KEY: {
    required: true,
    validate: (value) => value.length > 50,
    description: 'Supabase anonymous key for server-side operations',
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    required: true,
    validate: (value) => value.length > 50,
    description: 'Supabase service role key for server-side operations (bypasses RLS)',
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

  // Authentication
  NEXTAUTH_URL: {
    required: true,
    validate: (value) => value.startsWith('http'),
    description: 'NextAuth base URL',
  },
  NEXTAUTH_SECRET: {
    required: true,
    validate: (value) => value.length > 16,
    description: 'NextAuth secret for JWT encryption (minimum 32 characters recommended)',
  },
  JWT_SECRET: {
    required: false, // Опционально, но рекомендуется
    validate: (value) => !value || value.length > 16,
    description: 'Additional JWT secret for token encryption',
  },

  // Redis
  UPSTASH_REDIS_REST_URL: {
    required: true, // Требуется для production
    validate: (value) => !value || value.startsWith('https://') && value.includes('.upstash.io'),
    description: 'Upstash Redis REST URL',
  },
  UPSTASH_REDIS_REST_TOKEN: {
    required: true, // Требуется для production
    validate: (value) => !value || value.length > 20,
    description: 'Upstash Redis REST token',
  },
  REDIS_URL: {
    required: false,
    default: '',
    validate: (value) => !value || value.startsWith('redis://') || value.startsWith('rediss://'),
    description: 'Redis connection URL (optional, for local development)',
  },

  // AI API
  OPENROUTER_API_KEY: {
    required: false, // Опционально, но требуется для работы AI
    validate: (value) => !value || value.startsWith('sk-or-v1-'),
    description: 'OpenRouter API key for AI model access',
  },

  // Encryption
  ENCRYPTION_KEY: {
    required: true, // Требуется для шифрования CRM секретов
    validate: (value) => value.length >= 32,
    description: 'Encryption key for sensitive data (32 bytes minimum, base64 encoded)',
  },

  // ============================================================================
  // ОПЦИОНАЛЬНЫЕ ПЕРЕМЕННЫЕ (Используются при наличии)
  // ============================================================================

  // Backend API
  BACKEND_API_URL: {
    required: false,
    validate: (value) => !value || value.startsWith('http'),
    description: 'Backend API URL (Fastify service)',
  },

  // Kommo Integration
  KOMMO_OAUTH_REDIRECT_BASE: {
    required: false,
    validate: (value) => !value || value.startsWith('http'),
    description: 'Base URL for Kommo OAuth redirect',
  },
  KOMMO_WEBHOOK_SECRET: {
    required: false,
    validate: (value) => !value || value.length > 10,
    description: 'Secret for Kommo webhook signature verification',
  },

  // Email (SMTP)
  SMTP_HOST: {
    required: false,
    description: 'SMTP server hostname',
  },
  SMTP_PORT: {
    required: false,
    validate: (value) => !value || !isNaN(Number(value)) && Number(value) > 0 && Number(value) < 65536,
    description: 'SMTP server port',
  },
  SMTP_USER: {
    required: false,
    description: 'SMTP username',
  },
  SMTP_PASS: {
    required: false,
    description: 'SMTP password',
  },
  FROM_EMAIL: {
    required: false,
    validate: (value) => !value || value.includes('@'),
    description: 'Default sender email address',
  },

  // Cron
  CRON_SECRET: {
    required: false,
    validate: (value) => !value || value.length > 10,
    description: 'Secret for protecting cron endpoints',
  },

  // Monitoring
  SENTRY_DSN: {
    required: false,
    validate: (value) => !value || value.includes('sentry.io'),
    description: 'Sentry DSN for error tracking',
  },
  NEXT_PUBLIC_SENTRY_DSN: {
    required: false,
    validate: (value) => !value || value.includes('sentry.io'),
    description: 'Public Sentry DSN for client-side error tracking',
  },

  // WebSocket
  FRONTEND_URL: {
    required: false,
    validate: (value) => !value || value.startsWith('http'),
    description: 'Frontend URL for WebSocket CORS (defaults to NEXTAUTH_URL)',
  },
  WEBSOCKET_URL: {
    required: false,
    validate: (value) => !value || value.startsWith('ws://') || value.startsWith('wss://') || value.startsWith('http'),
    description: 'WebSocket server URL (defaults to window.location.origin in production)',
  },

  // Admin
  ADMIN_USERS: {
    required: false,
    validate: (value) => !value || value.split(',').every(email => email.includes('@')),
    description: 'Comma-separated list of admin email addresses',
  },

  // Feature Flags
  DEMO_MODE: {
    required: false,
    default: '0',
    validate: (value) => ['0', '1', 'true', 'false'].includes(value.toLowerCase()),
    description: 'Enable demo mode with limited functionality (development only)',
  },
  E2E_ONBOARDING_FAKE: {
    required: false,
    default: '0',
    validate: (value) => ['0', '1'].includes(value),
    description: 'Enable fake onboarding for E2E tests (testing only)',
  },

  // Organization defaults
  SUPABASE_DEFAULT_ORGANIZATION_ID: {
    required: false,
    validate: (value) => !value || !!value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i),
    description: 'Default organization UUID for demo users',
  },

  // Environment
  NODE_ENV: {
    required: false,
    default: 'development',
    validate: (value) => ['development', 'production', 'test'].includes(value),
    description: 'Node.js environment mode',
  },

  // ============================================================================
  // ТОЛЬКО ДЛЯ РАЗРАБОТКИ (Development Only)
  // ============================================================================

  // Kommo Testing
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
    validate: (value) => !value || value.startsWith('http'),
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

  // OpenRouter Embeddings (optional)
  OPENROUTER_EMBEDDING_MODEL: {
    required: false,
    description: 'OpenRouter embedding model (defaults to text-embedding-ada-002)',
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
