#!/usr/bin/env tsx
import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'dotenv'
import { envSchema } from '../lib/env/validation'

interface EnvironmentConfig {
  id: 'development' | 'staging' | 'production'
  label: string
  template: string
  candidates: string[]
  required: string[]
  recommended: string[]
}

const PROJECT_ROOT = path.resolve(__dirname, '..')
const PLACEHOLDER_PATTERNS = [
  /your[-_]/i,
  /change-?me/i,
  /replace-?me/i,
  /example\.com/i,
  /demo/i,
  /^\s*$/,
]

const LENGTH_CHECKS: Record<string, number> = {
  NEXTAUTH_SECRET: 32,
  JWT_SECRET: 32,
  ENCRYPTION_KEY: 32,
}

const envConfigs: EnvironmentConfig[] = [
  {
    id: 'development',
    label: 'Development (.env.local)',
    template: path.join(PROJECT_ROOT, 'env.example'),
    candidates: ['.env.local', '.env.development', '.env'],
    required: [
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'ENCRYPTION_KEY',
    ],
    recommended: [
      'OPENROUTER_API_KEY',
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
    ],
  },
  {
    id: 'staging',
    label: 'Staging (env.staging)',
    template: path.join(PROJECT_ROOT, 'env.staging.example'),
    candidates: ['env.staging', '.env.staging'],
    required: [
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
      'OPENROUTER_API_KEY',
      'ENCRYPTION_KEY',
    ],
    recommended: [
      'BACKEND_API_URL',
      'KOMMO_WEBHOOK_SECRET',
      'SENTRY_DSN',
      'NEXT_PUBLIC_SENTRY_DSN',
    ],
  },
  {
    id: 'production',
    label: 'Production (env.production)',
    template: path.join(PROJECT_ROOT, 'env.production.example'),
    candidates: ['env.production', '.env.production'],
    required: [
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
      'OPENROUTER_API_KEY',
      'ENCRYPTION_KEY',
    ],
    recommended: [
      'BACKEND_API_URL',
      'KOMMO_WEBHOOK_SECRET',
      'SENTRY_DSN',
      'NEXT_PUBLIC_SENTRY_DSN',
      'CRON_SECRET',
      'SMTP_HOST',
      'FROM_EMAIL',
    ],
  },
]

interface VerificationResult {
  missingRequired: string[]
  placeholders: string[]
  lengthViolations: string[]
  invalidBySchema: string[]
  recommendedMissing: string[]
}

function parseEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) {
    return {}
  }

  const content = fs.readFileSync(filePath, 'utf8')
  return parse(content)
}

function resolveCandidateFile(config: EnvironmentConfig): string | null {
  for (const candidate of config.candidates) {
    const filePath = path.join(PROJECT_ROOT, candidate)
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }
  return null
}

function collectTemplateKeys(templatePath: string): Set<string> {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`)
  }
  const templateVars = parseEnvFile(templatePath)
  return new Set(Object.keys(templateVars))
}

function detectPlaceholders(key: string, value: string | undefined): boolean {
  if (!value) {
    return true
  }

  return PLACEHOLDER_PATTERNS.some(pattern => pattern.test(value))
}

function validateAgainstSchema(envMap: Record<string, string>): string[] {
  const issues: string[] = []

  for (const [key, schema] of Object.entries(envSchema)) {
    const value = envMap[key]

    if (schema.required && (!value || value.trim() === '')) {
      issues.push(`${key}: отсутствует обязательное значение`)
      continue
    }

    if (value && schema.validate && !schema.validate(value)) {
      issues.push(`${key}: ${schema.description}`)
    }
  }

  return issues
}

function verifyEnvironment(config: EnvironmentConfig): VerificationResult {
  const templateKeys = collectTemplateKeys(config.template)
  const candidateFile = resolveCandidateFile(config)

  const envMap = candidateFile ? parseEnvFile(candidateFile) : {}
  const shouldValidateValues = Boolean(candidateFile)

  const missingRequired: string[] = []
  const placeholders: string[] = []
  const lengthViolations: string[] = []

  if (shouldValidateValues) {
    for (const key of config.required) {
      const value = envMap[key]
      if (!value || value.trim() === '') {
        missingRequired.push(key)
        continue
      }

      if (detectPlaceholders(key, value)) {
        placeholders.push(key)
      }

      const minLength = LENGTH_CHECKS[key]
      if (minLength && value.length < minLength) {
        lengthViolations.push(`${key} (expected ≥ ${minLength}, received ${value.length})`)
      }
    }
  }

  const recommendedMissing = shouldValidateValues
    ? config.recommended.filter(key => !envMap[key])
    : []

  const invalidBySchema = shouldValidateValues
    ? validateAgainstSchema(envMap).filter(message => {
        const [pathLabel] = message.split(':', 1)
        return templateKeys.has(pathLabel)
      })
    : []

  if (!candidateFile) {
    console.warn(`⚠️  ${config.label}: файл не найден. Используется только шаблон ${path.relative(PROJECT_ROOT, config.template)}.`)
  } else {
    console.log(`📄 Используемый файл: ${path.relative(PROJECT_ROOT, candidateFile)}`)
  }

  return {
    missingRequired,
    placeholders,
    lengthViolations,
    invalidBySchema,
    recommendedMissing,
  }
}

function printResult(config: EnvironmentConfig, result: VerificationResult): boolean {
  const {
    missingRequired,
    placeholders,
    lengthViolations,
    invalidBySchema,
    recommendedMissing,
  } = result

  console.log(`\n=== ${config.label} ===`)

  if (missingRequired.length === 0) {
    console.log('✅ Все обязательные переменные присутствуют')
  } else {
    console.error('❌ Отсутствуют обязательные переменные:')
    missingRequired.forEach(key => console.error(`   - ${key}`))
  }

  if (placeholders.length > 0) {
    console.error('\n❌ Обнаружены значения-заглушки:')
    placeholders.forEach(key => console.error(`   - ${key}`))
  }

  if (lengthViolations.length > 0) {
    console.error('\n❌ Нарушены минимальные требования к длине:')
    lengthViolations.forEach(entry => console.error(`   - ${entry}`))
  }

  if (invalidBySchema.length > 0) {
    console.error('\n❌ Проблемы при проверке схемы:')
    invalidBySchema.forEach(entry => console.error(`   - ${entry}`))
  }

  if (recommendedMissing.length > 0) {
    console.warn('\n⚠️ Рекомендуется настроить дополнительные переменные:')
    recommendedMissing.forEach(key => console.warn(`   - ${key}`))
  }

  if (
    missingRequired.length === 0 &&
    placeholders.length === 0 &&
    lengthViolations.length === 0 &&
    invalidBySchema.length === 0
  ) {
    console.log('🎉 Проверка пройдена!')
    return true
  }

  console.error('🚨 Исправьте ошибки выше перед деплоем!')
  return false
}

function main(): void {
  console.log('🔍 Проверка конфигурации переменных окружения\n')

  let overallSuccess = true

  for (const config of envConfigs) {
    try {
      const result = verifyEnvironment(config)
      const success = printResult(config, result)
      overallSuccess = overallSuccess && success
    } catch (error) {
      overallSuccess = false
      console.error(`❌ Не удалось проверить ${config.label}:`, error instanceof Error ? error.message : String(error))
    }
  }

  if (!overallSuccess) {
    process.exit(1)
  }

  console.log('\n🧪 Совет: выполните smoke-тесты `npm run check:all` перед деплоем.')
}

main()
