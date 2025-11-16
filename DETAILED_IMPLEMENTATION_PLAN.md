# 📋 ДЕТАЛИЗИРОВАННЫЙ ПЛАН РЕАЛИЗАЦИИ (110 часов)

**Вариант B**: Нормальный запуск за 4 недели
**Total**: 110 часов = 4 недели (30h/week)
**Target**: 85% готовности к production

---

## 📅 WEEK 1: SECURITY + DOCS + TEST CHAT (40 часов)

---

### 🔒 ЗАДАЧА 1: RATE LIMITING (4 часа)

#### 1.1 Setup Redis connection (30 min)
```typescript
// ШАГ 1: Проверить Redis в docker-compose.yml
Файл: docker-compose.yml
Проверить:
- Сервис redis запущен
- Port 6379 exposed
- Password настроен

// ШАГ 2: Добавить Redis client
Файл: lib/redis.ts (СОЗДАТЬ)

import { Redis } from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  }
})

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis.on('connect', () => {
  console.log('Redis connected')
})

export default redis

// ШАГ 3: Добавить в .env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password_here

// ШАГ 4: Test connection
Файл: lib/redis.test.ts (СОЗДАТЬ)

import redis from './redis'

describe('Redis Connection', () => {
  it('should connect to Redis', async () => {
    const result = await redis.ping()
    expect(result).toBe('PONG')
  })
})
```

**Acceptance Criteria:**
- ✅ Redis client подключается
- ✅ Test проходит
- ✅ Error handling работает

---

#### 1.2 Create rate limiter middleware (1.5 hours)
```typescript
// ШАГ 1: Создать типы
Файл: lib/middleware/rate-limit.types.ts (СОЗДАТЬ)

export interface RateLimitConfig {
  points: number      // Количество requests
  duration: number    // Время в секундах
  blockDuration?: number // Время блокировки при превышении
}

export const RATE_LIMIT_CONFIGS = {
  api: { points: 100, duration: 60 },      // 100 req/min
  auth: { points: 5, duration: 60 },       // 5 req/min
  webhook: { points: 50, duration: 60 },   // 50 req/min
  testChat: { points: 20, duration: 60 },  // 20 req/min
} as const

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIGS

// ШАГ 2: Создать rate limiter
Файл: lib/middleware/rate-limit.ts (СОЗДАТЬ)

import redis from '@/lib/redis'
import { RATE_LIMIT_CONFIGS, RateLimitType } from './rate-limit.types'

export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfter: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

export async function checkRateLimit(
  key: string,
  type: RateLimitType
): Promise<{
  allowed: boolean
  remaining: number
  reset: number
}> {
  const config = RATE_LIMIT_CONFIGS[type]
  const redisKey = `ratelimit:${type}:${key}`

  try {
    // Получить текущее количество запросов
    const current = await redis.get(redisKey)
    const count = current ? parseInt(current) : 0

    // Проверить лимит
    if (count >= config.points) {
      const ttl = await redis.ttl(redisKey)
      return {
        allowed: false,
        remaining: 0,
        reset: Date.now() + (ttl * 1000)
      }
    }

    // Инкрементировать счетчик
    const multi = redis.multi()
    multi.incr(redisKey)

    // Установить TTL только для первого запроса
    if (count === 0) {
      multi.expire(redisKey, config.duration)
    }

    await multi.exec()

    return {
      allowed: true,
      remaining: config.points - count - 1,
      reset: Date.now() + (config.duration * 1000)
    }
  } catch (error) {
    // Если Redis недоступен, разрешаем запрос (fail open)
    console.error('Rate limit check failed:', error)
    return {
      allowed: true,
      remaining: config.points,
      reset: Date.now() + (config.duration * 1000)
    }
  }
}

// ШАГ 3: Создать Next.js middleware helper
Файл: lib/middleware/rate-limit-api.ts (СОЗДАТЬ)

import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, RateLimitError } from './rate-limit'
import { RateLimitType } from './rate-limit.types'

export async function withRateLimit(
  request: NextRequest,
  type: RateLimitType,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // Получить идентификатор пользователя (IP или user ID)
  const identifier =
    request.headers.get('x-user-id') ||
    request.headers.get('x-forwarded-for') ||
    request.ip ||
    'anonymous'

  // Проверить rate limit
  const { allowed, remaining, reset } = await checkRateLimit(
    identifier,
    type
  )

  // Если превышен лимит
  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((reset - Date.now()) / 1000)
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMIT_CONFIGS[type].points),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(reset / 1000)),
          'Retry-After': String(Math.ceil((reset - Date.now()) / 1000))
        }
      }
    )
  }

  // Выполнить handler
  const response = await handler(request)

  // Добавить rate limit headers
  response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_CONFIGS[type].points))
  response.headers.set('X-RateLimit-Remaining', String(remaining))
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(reset / 1000)))

  return response
}
```

**Acceptance Criteria:**
- ✅ Rate limiter работает с Redis
- ✅ Разные лимиты для разных типов
- ✅ Headers правильные
- ✅ Fail open если Redis down

---

#### 1.3 Apply to API routes (1.5 hours)
```typescript
// ШАГ 1: Применить к auth endpoints
Файл: app/api/auth/[...nextauth]/route.ts (ОБНОВИТЬ)

import { withRateLimit } from '@/lib/middleware/rate-limit-api'

export async function POST(request: NextRequest) {
  return withRateLimit(request, 'auth', async (req) => {
    // Существующий код authentication
    // ...
  })
}

// ШАГ 2: Применить к agents API
Файл: app/api/agents/route.ts (ОБНОВИТЬ)

import { withRateLimit } from '@/lib/middleware/rate-limit-api'

export async function GET(request: NextRequest) {
  return withRateLimit(request, 'api', async (req) => {
    // Существующий код
  })
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, 'api', async (req) => {
    // Существующий код
  })
}

// ШАГ 3: Применить к test-chat API
Файл: app/api/test-chat/route.ts (ОБНОВИТЬ)

export async function POST(request: NextRequest) {
  return withRateLimit(request, 'testChat', async (req) => {
    // Существующий код
  })
}

// ШАГ 4: Применить к webhooks
Файл: app/api/webhooks/kommo/route.ts (ОБНОВИТЬ)

export async function POST(request: NextRequest) {
  return withRateLimit(request, 'webhook', async (req) => {
    // Существующий код
  })
}

// ШАГ 5: Создать список всех endpoints для update
Файлы для обновления:
□ app/api/auth/[...nextauth]/route.ts
□ app/api/agents/route.ts
□ app/api/agents/[id]/route.ts
□ app/api/test-chat/route.ts
□ app/api/integrations/*/route.ts
□ app/api/webhooks/*/route.ts
□ app/api/dashboard/*/route.ts
□ app/api/notifications/route.ts
```

**Acceptance Criteria:**
- ✅ Все API endpoints защищены
- ✅ Разные лимиты применены правильно
- ✅ Headers возвращаются корректно

---

#### 1.4 Testing (30 min)
```typescript
// ШАГ 1: Unit tests
Файл: lib/middleware/rate-limit.test.ts (СОЗДАТЬ)

import { checkRateLimit } from './rate-limit'
import redis from '@/lib/redis'

describe('Rate Limiter', () => {
  beforeEach(async () => {
    // Очистить Redis перед каждым тестом
    await redis.flushdb()
  })

  it('should allow requests within limit', async () => {
    const result1 = await checkRateLimit('user1', 'api')
    expect(result1.allowed).toBe(true)
    expect(result1.remaining).toBe(99)

    const result2 = await checkRateLimit('user1', 'api')
    expect(result2.allowed).toBe(true)
    expect(result2.remaining).toBe(98)
  })

  it('should block requests over limit', async () => {
    // Сделать 100 запросов
    for (let i = 0; i < 100; i++) {
      await checkRateLimit('user1', 'api')
    }

    // 101-й запрос должен быть заблокирован
    const result = await checkRateLimit('user1', 'api')
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should reset after duration', async () => {
    // Превысить лимит
    for (let i = 0; i < 6; i++) {
      await checkRateLimit('user1', 'auth')
    }

    // Подождать 61 секунду (duration + 1)
    await new Promise(resolve => setTimeout(resolve, 61000))

    // Должно снова разрешить
    const result = await checkRateLimit('user1', 'auth')
    expect(result.allowed).toBe(true)
  }, 65000)

  it('should handle Redis failure gracefully', async () => {
    // Отключить Redis
    await redis.disconnect()

    // Должно разрешить запрос (fail open)
    const result = await checkRateLimit('user1', 'api')
    expect(result.allowed).toBe(true)

    // Переподключить
    await redis.connect()
  })
})

// ШАГ 2: Integration test
Файл: tests/integration/api/rate-limit.test.ts (СОЗДАТЬ)

describe('API Rate Limiting', () => {
  it('should return 429 when limit exceeded', async () => {
    // Сделать 101 запрос к /api/agents
    for (let i = 0; i < 101; i++) {
      await fetch('/api/agents')
    }

    const response = await fetch('/api/agents')
    expect(response.status).toBe(429)
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0')
    expect(response.headers.get('Retry-After')).toBeTruthy()
  })
})
```

**Acceptance Criteria:**
- ✅ Unit tests проходят
- ✅ Integration tests проходят
- ✅ Edge cases покрыты

---

### 📝 ЗАДАЧА 2: STRUCTURED LOGGING (6 часов)

#### 2.1 Setup Winston (1 hour)
```typescript
// ШАГ 1: Install dependencies
npm install winston winston-daily-rotate-file

// ШАГ 2: Создать logger config
Файл: lib/logger/config.ts (СОЗДАТЬ)

import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const logLevel = process.env.LOG_LEVEL || 'info'
const isProduction = process.env.NODE_ENV === 'production'

// Custom format для development
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}] ${message}`
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta, null, 2)}`
    }
    return msg
  })
)

// JSON format для production
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Transports
const transports: winston.transport[] = []

// Console transport (всегда)
transports.push(
  new winston.transports.Console({
    format: isProduction ? prodFormat : devFormat
  })
)

// File transport (только production)
if (isProduction) {
  // Error log
  transports.push(
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
      maxSize: '20m',
      format: prodFormat
    })
  )

  // Combined log
  transports.push(
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '20m',
      format: prodFormat
    })
  )
}

export const loggerConfig = {
  level: logLevel,
  format: isProduction ? prodFormat : devFormat,
  transports,
  exitOnError: false
}

// ШАГ 3: Создать logger instance
Файл: lib/logger/index.ts (СОЗДАТЬ)

import winston from 'winston'
import { loggerConfig } from './config'

class Logger {
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger(loggerConfig)
  }

  // Request ID для трейсинга
  private getRequestId(): string | undefined {
    // В Next.js это можно получить из headers или AsyncLocalStorage
    return undefined // TODO: implement AsyncLocalStorage
  }

  private formatMeta(meta: any): any {
    const requestId = this.getRequestId()
    return {
      ...meta,
      ...(requestId && { requestId }),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }
  }

  info(message: string, meta?: any) {
    this.logger.info(message, this.formatMeta(meta))
  }

  error(message: string, meta?: any) {
    this.logger.error(message, this.formatMeta(meta))

    // Отправить в Sentry
    if (process.env.NODE_ENV === 'production' && meta?.error) {
      // Sentry.captureException уже настроен в проекте
    }
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, this.formatMeta(meta))
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, this.formatMeta(meta))
  }

  http(message: string, meta?: any) {
    this.logger.http(message, this.formatMeta(meta))
  }
}

// Singleton instance
export const logger = new Logger()
export default logger

// ШАГ 4: Добавить в .gitignore
Файл: .gitignore (ОБНОВИТЬ)

# Logs
logs/
*.log
```

**Acceptance Criteria:**
- ✅ Winston настроен
- ✅ Разные форматы для dev/prod
- ✅ File rotation работает
- ✅ Logs в gitignore

---

#### 2.2 Replace console.log (3 hours)
```typescript
// ШАГ 1: Найти все console.log
Команда:
grep -r "console\.log" --include="*.ts" --include="*.tsx" app/ lib/ services/

// ШАГ 2: Создать список файлов для замены
Пример результата:
app/api/agents/route.ts
app/api/auth/[...nextauth]/route.ts
lib/services/openrouter.ts
lib/repositories/agents.ts
... и т.д.

// ШАГ 3: Заменить в каждом файле
Файл: app/api/agents/route.ts (ПРИМЕР)

БЫЛО:
console.log('Creating agent:', data)

СТАЛО:
import logger from '@/lib/logger'

logger.info('Creating agent', {
  agentName: data.name,
  organizationId: data.organizationId,
  model: data.model
})

// ШАГ 4: Заменить console.error
БЫЛО:
console.error('Failed to create agent:', error)

СТАЛО:
logger.error('Failed to create agent', {
  error: error.message,
  stack: error.stack,
  agentData: data
})

// ШАГ 5: Заменить console.warn
БЫЛО:
console.warn('Agent limit reached')

СТАЛО:
logger.warn('Agent limit reached', {
  organizationId,
  currentCount: agents.length,
  limit: AGENT_LIMIT
})

// ШАГ 6: HTTP requests logging
Файл: middleware.ts (ОБНОВИТЬ)

import logger from '@/lib/logger'

export function middleware(request: NextRequest) {
  const start = Date.now()

  // Log request
  logger.http('Incoming request', {
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent')
  })

  // ... existing middleware logic

  // Log response (в конце)
  const duration = Date.now() - start
  logger.http('Request completed', {
    method: request.method,
    url: request.url,
    duration,
    status: response.status
  })
}

// ШАГ 7: Создать checklist файлов
Файлы для обновления (проверить каждый):
□ app/api/**/*.ts (все API routes)
□ lib/services/**/*.ts
□ lib/repositories/**/*.ts
□ services/worker/src/**/*.ts
□ middleware.ts
```

**Список ВСЕХ файлов для замены (примерно 40-50 файлов)**:
```
□ app/api/agents/route.ts
□ app/api/agents/[id]/route.ts
□ app/api/auth/[...nextauth]/route.ts
□ app/api/dashboard/stats/route.ts
□ app/api/integrations/kommo/oauth/callback/route.ts
□ app/api/test-chat/route.ts
□ lib/services/openrouter.ts
□ lib/services/email.ts
□ lib/services/analytics.ts
□ lib/repositories/agents.ts
□ lib/repositories/integrations.ts
□ services/worker/src/index.ts
□ services/worker/src/tasks/process-asset.ts
... (продолжить со всеми файлами)
```

**Acceptance Criteria:**
- ✅ Все console.log заменены на logger
- ✅ Structured metadata везде
- ✅ Request/response logging работает

---

#### 2.3 Request ID tracking (1 hour)
```typescript
// ШАГ 1: Setup AsyncLocalStorage
Файл: lib/logger/async-storage.ts (СОЗДАТЬ)

import { AsyncLocalStorage } from 'async_hooks'

interface RequestContext {
  requestId: string
  userId?: string
  organizationId?: string
}

export const requestContext = new AsyncLocalStorage<RequestContext>()

export function getRequestContext(): RequestContext | undefined {
  return requestContext.getStore()
}

// ШАГ 2: Обновить middleware для set context
Файл: middleware.ts (ОБНОВИТЬ)

import { requestContext } from '@/lib/logger/async-storage'
import { nanoid } from 'nanoid'

export function middleware(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || nanoid()

  return requestContext.run(
    { requestId },
    () => {
      // Existing middleware logic

      // Add request ID to response headers
      response.headers.set('X-Request-ID', requestId)
      return response
    }
  )
}

// ШАГ 3: Обновить logger для use context
Файл: lib/logger/index.ts (ОБНОВИТЬ)

import { getRequestContext } from './async-storage'

class Logger {
  private formatMeta(meta: any): any {
    const context = getRequestContext()
    return {
      ...meta,
      ...(context?.requestId && { requestId: context.requestId }),
      ...(context?.userId && { userId: context.userId }),
      ...(context?.organizationId && { organizationId: context.organizationId }),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }
  }

  // ... rest of code
}
```

**Acceptance Criteria:**
- ✅ Request ID генерируется для каждого request
- ✅ Request ID в логах
- ✅ Request ID в response headers

---

#### 2.4 Sentry integration (30 min)
```typescript
// ШАГ 1: Проверить Sentry уже настроен
Файл: instrumentation.ts (проверить существует)

// ШАГ 2: Интегрировать с logger
Файл: lib/logger/index.ts (ОБНОВИТЬ)

import * as Sentry from '@sentry/nextjs'

error(message: string, meta?: any) {
  this.logger.error(message, this.formatMeta(meta))

  // Отправить в Sentry
  if (process.env.NODE_ENV === 'production') {
    if (meta?.error instanceof Error) {
      Sentry.captureException(meta.error, {
        contexts: {
          metadata: meta
        },
        tags: {
          requestId: getRequestContext()?.requestId
        }
      })
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        contexts: { metadata: meta }
      })
    }
  }
}
```

**Acceptance Criteria:**
- ✅ Errors отправляются в Sentry
- ✅ Request ID в Sentry
- ✅ Metadata attached

---

#### 2.5 Testing (30 min)
```typescript
// ШАГ 1: Test logger
Файл: lib/logger/logger.test.ts (СОЗДАТЬ)

import logger from './index'
import winston from 'winston'

describe('Logger', () => {
  it('should log info messages', () => {
    const spy = jest.spyOn(winston.Logger.prototype, 'info')

    logger.info('Test message', { foo: 'bar' })

    expect(spy).toHaveBeenCalledWith(
      'Test message',
      expect.objectContaining({
        foo: 'bar',
        timestamp: expect.any(String)
      })
    )
  })

  it('should include request ID in logs', () => {
    // TODO: test with AsyncLocalStorage
  })
})
```

**Acceptance Criteria:**
- ✅ Tests проходят
- ✅ Logs пишутся корректно

---

### 🔐 ЗАДАЧА 3: TOKEN ENCRYPTION (4 часа)

#### 3.1 Setup encryption (1 hour)
```typescript
// ШАГ 1: Создать encryption utilities
Файл: lib/crypto/encryption.ts (СОЗДАТЬ)

import crypto from 'crypto'

const algorithm = 'aes-256-gcm'
const ENCRYPTION_KEY_LENGTH = 32 // 256 bits

// Получить encryption key из env
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }

  // Key должен быть 64 hex chars (32 bytes)
  if (key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be 64 hexadecimal characters')
  }

  return Buffer.from(key, 'hex')
}

/**
 * Encrypt text using AES-256-GCM
 * Returns: iv:encrypted:authTag (all in hex)
 */
export function encrypt(text: string): string {
  if (!text) {
    throw new Error('Text to encrypt cannot be empty')
  }

  const key = getEncryptionKey()
  const iv = crypto.randomBytes(16) // Initialization vector

  const cipher = crypto.createCipheriv(algorithm, key, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag()

  // Return format: iv:encrypted:authTag
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`
}

/**
 * Decrypt text encrypted with encrypt()
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) {
    throw new Error('Encrypted text cannot be empty')
  }

  const key = getEncryptionKey()

  // Parse format: iv:encrypted:authTag
  const parts = encryptedText.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format')
  }

  const [ivHex, encryptedHex, authTagHex] = parts

  const iv = Buffer.from(ivHex, 'hex')
  const encrypted = encryptedHex
  const authTag = Buffer.from(authTagHex, 'hex')

  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * Check if text is encrypted (has our format)
 */
export function isEncrypted(text: string): boolean {
  if (!text) return false
  const parts = text.split(':')
  return parts.length === 3 && parts[0].length === 32 // 16 bytes = 32 hex
}

// ШАГ 2: Генерировать encryption key
Файл: scripts/generate-encryption-key.ts (СОЗДАТЬ)

import crypto from 'crypto'

const key = crypto.randomBytes(32).toString('hex')
console.log('Generated encryption key:')
console.log(key)
console.log('\nAdd to .env:')
console.log(`ENCRYPTION_KEY=${key}`)

// Run: npx tsx scripts/generate-encryption-key.ts

// ШАГ 3: Добавить в .env.example
Файл: .env.example (ОБНОВИТЬ)

# Encryption
ENCRYPTION_KEY=<generate_with_scripts/generate-encryption-key.ts>

// ШАГ 4: Добавить validation на startup
Файл: lib/crypto/validate-env.ts (СОЗДАТЬ)

export function validateEncryptionEnv() {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error(
      'ENCRYPTION_KEY is not set. Generate one with: npx tsx scripts/generate-encryption-key.ts'
    )
  }

  if (process.env.ENCRYPTION_KEY.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be exactly 64 hexadecimal characters')
  }

  console.log('✅ Encryption key validated')
}

// Call in app startup
Файл: instrumentation.ts (ОБНОВИТЬ)

import { validateEncryptionEnv } from './lib/crypto/validate-env'

export function register() {
  validateEncryptionEnv()
  // ... existing code
}
```

**Acceptance Criteria:**
- ✅ Encryption/decryption работает
- ✅ Key validation на startup
- ✅ Error handling

---

#### 3.2 Update integrations repository (1.5 hours)
```typescript
// ШАГ 1: Обновить Kommo integration repository
Файл: lib/repositories/integrations.ts (НАЙТИ И ОБНОВИТЬ)

import { encrypt, decrypt, isEncrypted } from '@/lib/crypto/encryption'
import logger from '@/lib/logger'

// Найти функцию saveKommoIntegration
export async function saveKommoIntegration(data: {
  organizationId: string
  accessToken: string
  refreshToken: string
  expiresAt: Date
  ...
}) {
  // Зашифровать токены перед сохранением
  const encryptedAccessToken = encrypt(data.accessToken)
  const encryptedRefreshToken = encrypt(data.refreshToken)

  logger.info('Saving Kommo integration', {
    organizationId: data.organizationId,
    // НЕ логировать токены!
  })

  return await db.integrations.upsert({
    where: { organizationId: data.organizationId },
    update: {
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      expiresAt: data.expiresAt,
      updatedAt: new Date()
    },
    create: {
      organizationId: data.organizationId,
      type: 'kommo',
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      expiresAt: data.expiresAt
    }
  })
}

// Найти функцию getKommoIntegration
export async function getKommoIntegration(organizationId: string) {
  const integration = await db.integrations.findUnique({
    where: {
      organizationId,
      type: 'kommo'
    }
  })

  if (!integration) {
    return null
  }

  // Расшифровать токены
  return {
    ...integration,
    accessToken: decrypt(integration.accessToken),
    refreshToken: decrypt(integration.refreshToken)
  }
}

// Найти функцию refreshKommoToken
export async function refreshKommoToken(organizationId: string) {
  const integration = await getKommoIntegration(organizationId)

  if (!integration) {
    throw new Error('Integration not found')
  }

  // Refresh token через Kommo API
  const response = await fetch('https://example.amocrm.ru/oauth2/access_token', {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: integration.refreshToken, // Уже расшифрован
      client_id: process.env.KOMMO_CLIENT_ID,
      client_secret: process.env.KOMMO_CLIENT_SECRET
    })
  })

  const tokens = await response.json()

  // Сохранить новые токены (будут зашифрованы)
  await saveKommoIntegration({
    organizationId,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: new Date(Date.now() + tokens.expires_in * 1000)
  })

  return tokens
}
```

**Acceptance Criteria:**
- ✅ Tokens зашифровываются при save
- ✅ Tokens расшифровываются при get
- ✅ Refresh token работает
- ✅ Нет логов с plain text tokens

---

#### 3.3 Migration script (1 hour)
```typescript
// ШАГ 1: Создать migration script
Файл: scripts/migrate-encrypt-tokens.ts (СОЗДАТЬ)

import { PrismaClient } from '@prisma/client'
import { encrypt, isEncrypted } from '@/lib/crypto/encryption'
import logger from '@/lib/logger'

const db = new PrismaClient()

async function migrateTokens() {
  logger.info('Starting token encryption migration')

  // Получить все integrations
  const integrations = await db.integrations.findMany({
    where: {
      type: 'kommo'
    }
  })

  logger.info(`Found ${integrations.length} integrations to migrate`)

  let migratedCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const integration of integrations) {
    try {
      // Проверить если уже зашифрован
      if (
        isEncrypted(integration.accessToken) &&
        isEncrypted(integration.refreshToken)
      ) {
        logger.debug('Integration already encrypted', {
          integrationId: integration.id
        })
        skippedCount++
        continue
      }

      // Зашифровать токены
      const encryptedAccessToken = encrypt(integration.accessToken)
      const encryptedRefreshToken = encrypt(integration.refreshToken)

      // Обновить в БД
      await db.integrations.update({
        where: { id: integration.id },
        data: {
          accessToken: encryptedAccessToken,
          refreshToken: encryptedRefreshToken
        }
      })

      logger.info('Integration encrypted', {
        integrationId: integration.id,
        organizationId: integration.organizationId
      })

      migratedCount++
    } catch (error) {
      logger.error('Failed to encrypt integration', {
        integrationId: integration.id,
        error: error.message
      })
      errorCount++
    }
  }

  logger.info('Token encryption migration completed', {
    total: integrations.length,
    migrated: migratedCount,
    skipped: skippedCount,
    errors: errorCount
  })

  await db.$disconnect()
}

// Run migration
migrateTokens()
  .then(() => {
    console.log('✅ Migration completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  })

// ШАГ 2: Добавить npm script
Файл: package.json (ОБНОВИТЬ)

{
  "scripts": {
    "migrate:encrypt-tokens": "tsx scripts/migrate-encrypt-tokens.ts"
  }
}

// ШАГ 3: Создать rollback script (на случай проблем)
Файл: scripts/rollback-encrypt-tokens.ts (СОЗДАТЬ)

// Аналогично migrate, но decrypt вместо encrypt
// (на случай если что-то пошло не так)
```

**Acceptance Criteria:**
- ✅ Migration script работает
- ✅ Все токены зашифрованы
- ✅ Rollback script готов
- ✅ Dry-run mode для тестирования

---

#### 3.4 Testing (30 min)
```typescript
// ШАГ 1: Test encryption
Файл: lib/crypto/encryption.test.ts (СОЗДАТЬ)

import { encrypt, decrypt, isEncrypted } from './encryption'

describe('Encryption', () => {
  const testData = 'my-secret-token-12345'

  beforeAll(() => {
    // Set test encryption key
    process.env.ENCRYPTION_KEY = '0'.repeat(64) // 64 hex chars
  })

  it('should encrypt and decrypt correctly', () => {
    const encrypted = encrypt(testData)
    const decrypted = decrypt(encrypted)

    expect(decrypted).toBe(testData)
    expect(encrypted).not.toBe(testData)
  })

  it('should produce different ciphertext for same input', () => {
    // Due to random IV
    const encrypted1 = encrypt(testData)
    const encrypted2 = encrypt(testData)

    expect(encrypted1).not.toBe(encrypted2)
    expect(decrypt(encrypted1)).toBe(testData)
    expect(decrypt(encrypted2)).toBe(testData)
  })

  it('should detect encrypted text', () => {
    const encrypted = encrypt(testData)

    expect(isEncrypted(encrypted)).toBe(true)
    expect(isEncrypted(testData)).toBe(false)
  })

  it('should throw on invalid encrypted text', () => {
    expect(() => decrypt('invalid')).toThrow()
  })

  it('should throw on missing encryption key', () => {
    delete process.env.ENCRYPTION_KEY

    expect(() => encrypt(testData)).toThrow('ENCRYPTION_KEY')
  })
})

// ШАГ 2: Test integration
Файл: tests/integration/integrations/encryption.test.ts (СОЗДАТЬ)

import { saveKommoIntegration, getKommoIntegration } from '@/lib/repositories/integrations'
import { isEncrypted } from '@/lib/crypto/encryption'

describe('Token Encryption Integration', () => {
  it('should save tokens encrypted', async () => {
    const testData = {
      organizationId: 'test-org',
      accessToken: 'plain-access-token',
      refreshToken: 'plain-refresh-token',
      expiresAt: new Date()
    }

    await saveKommoIntegration(testData)

    // Проверить в БД напрямую
    const raw = await db.integrations.findUnique({
      where: { organizationId: 'test-org' }
    })

    expect(isEncrypted(raw.accessToken)).toBe(true)
    expect(isEncrypted(raw.refreshToken)).toBe(true)
  })

  it('should retrieve tokens decrypted', async () => {
    const testData = {
      organizationId: 'test-org-2',
      accessToken: 'my-access-token',
      refreshToken: 'my-refresh-token',
      expiresAt: new Date()
    }

    await saveKommoIntegration(testData)

    const retrieved = await getKommoIntegration('test-org-2')

    expect(retrieved.accessToken).toBe(testData.accessToken)
    expect(retrieved.refreshToken).toBe(testData.refreshToken)
  })
})
```

**Acceptance Criteria:**
- ✅ Unit tests проходят
- ✅ Integration tests проходят
- ✅ Encryption/decryption работает end-to-end

---

### 💬 ЗАДАЧА 4: TEST CHAT COMPLETION (6 часов)

#### 4.1 Database schema (1 hour)
```sql
-- ШАГ 1: Создать migration
Файл: supabase/migrations/20250116_test_chat.sql (СОЗДАТЬ)

-- Test conversations table
CREATE TABLE IF NOT EXISTS test_conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
  title text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Test messages table
CREATE TABLE IF NOT EXISTS test_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid NOT NULL REFERENCES test_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  tokens_used integer,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_test_conversations_org ON test_conversations(organization_id);
CREATE INDEX idx_test_conversations_agent ON test_conversations(agent_id);
CREATE INDEX idx_test_messages_conversation ON test_messages(conversation_id);
CREATE INDEX idx_test_messages_created ON test_messages(created_at DESC);

-- RLS policies
ALTER TABLE test_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_messages ENABLE ROW LEVEL SECURITY;

-- Users can only see their org's conversations
CREATE POLICY test_conversations_select_policy ON test_conversations
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY test_conversations_insert_policy ON test_conversations
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY test_conversations_delete_policy ON test_conversations
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can see messages from their conversations
CREATE POLICY test_messages_select_policy ON test_messages
  FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM test_conversations
      WHERE organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY test_messages_insert_policy ON test_messages
  FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM test_conversations
      WHERE organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- ШАГ 2: Apply migration
npm run db:migrate
```

**Acceptance Criteria:**
- ✅ Tables созданы
- ✅ Indexes работают
- ✅ RLS policies активны

---

(ПРОДОЛЖЕНИЕ В СЛЕДУЮЩЕМ ФАЙЛЕ...)

**Это первая часть детального плана. Продолжить с остальными задачами?**
