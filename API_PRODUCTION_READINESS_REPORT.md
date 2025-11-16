# ДЕТАЛЬНЫЙ АНАЛИЗ BACKEND API СЕРВИСА (services/api/)
## Production Readiness Assessment

---

## 1. СТРУКТУРА И АРХИТЕКТУРА API

### 1.1 Обзор
- **Framework**: Fastify 4.28.1
- **Language**: TypeScript
- **Entry Point**: `services/api/src/server.ts`
- **Total Code**: ~2028 строк TypeScript кода

### 1.2 Определенные Routes и Endpoints

```
/health
  GET /      -> Basic health check (timestamp + status)

/agents
  GET  /agents        -> List agents with pagination
  POST /agents        -> Create/upsert agent
  POST /:agentId/status -> Update agent status

/jobs
  POST /              -> Enqueue background jobs
    - process-asset
    - extract-knowledge-graph

/crm
  POST   /credentials           -> Save CRM provider credentials
  DELETE /credentials           -> Delete CRM credentials
  POST   /connections           -> Create CRM connection
  GET    /connections           -> List CRM connections
  DELETE /connections/:connectionId -> Delete connection
  POST   /sync                  -> Trigger manual sync
  GET    /status                -> Get CRM integration status

/kommo
  POST   /credentials           -> Save Kommo OAuth credentials
  POST   /oauth/start           -> Initialize OAuth flow
  POST   /oauth/callback        -> Handle OAuth callback
  GET    /status                -> Get Kommo connection status
  POST   /sync/pipelines        -> Trigger pipeline sync
  POST   /sync/contacts         -> Trigger contact sync
  POST   /messages/send         -> Send message via Kommo
  POST   /webhook               -> Handle Kommo webhooks

/metrics
  GET /                         -> Prometheus metrics endpoint
```

### 1.3 Middleware и Плагины Fastify

**Установленные плагины** (server.ts строки 110-133):
1. `@fastify/sensible` - HTTP utilities
2. `@fastify/cors` - CORS support
3. `@fastify/helmet` - Security headers
4. `envPlugin` - Environment variables validation

**Hooks** (server.ts строки 61-108):
- `onRequest` - Metrics start time tracking
- `onResponse` - Request duration metrics collection
- `onError` - Error logging и Sentry integration

### 1.4 Обработка Ошибок

✓ Базовая обработка через `onError` hook (server.ts:85-108)
✓ Sentry integration для отслеживания ошибок
✓ OpenTelemetry span recording
✓ Zod validation errors возвращают 400 с деталями

---

## 2. БЕЗОПАСНОСТЬ API - КРИТИЧЕСКИЕ ПРОБЛЕМЫ

### ⚠️ КРИТИЧНО: ОТСУТСТВИЕ АУТЕНТИФИКАЦИИ И АВТОРИЗАЦИИ

**Статус**: НЕТУ НИКАКОЙ ЗАЩИТЫ

#### Проблема 1: CORS настройка разрешает всем доступ
**Файл**: `/services/api/src/server.ts:111`
```typescript
app.register(cors, { origin: true, credentials: true })
```

**Проблема**: 
- `origin: true` разрешает запросы с ЛЮБОго источника (не только вашего фронтенда)
- `credentials: true` позволяет отправлять cookies/auth headers
- Эквивалент: `Access-Control-Allow-Origin: *` + `Access-Control-Allow-Credentials: true`

**Последствия**:
- Любой веб-сайт может отправить запрос от браузера пользователя
- Веб-страница со своего компьютера может создавать agents, управлять CRM подключениями
- Возможна CSRF атака

#### Проблема 2: Нет аутентификации на эндпоинтах
**Статус**: ВСЕ endpoints полностью открыты

**Пример уязвимого кода** (agents.ts:50-84):
```typescript
fastify.get('/agents', async (request, reply) => {
  const query = listQuerySchema.parse(request.query)
  // ❌ БЕЗ ПРОВЕРКИ АУТЕНТИФИКАЦИИ!
  const result = await listAgents(supabase, query)
  reply.send(response)
})

fastify.post('/agents', async (request, reply) => {
  const payload = agentPayloadSchema.parse(request.body)
  // ❌ БЕЗ ПРОВЕРКИ АУТЕНТИФИКАЦИИ!
  const agent = await upsertAgent(supabase, payload)
  reply.send({ success: true, agent })
})
```

**Что может произойти**:
- Любой человек может листать agents других организаций через перебор `orgId` (UUID)
- Любой может создать/обновить agent для чужой организации
- Любой может удалить/изменить CRM подключения

#### Проблема 3: Нет проверки прав доступа (авторизации)

**Пример** (crm.ts:237-258):
```typescript
fastify.get('/connections', async (request, reply) => {
  const query = listConnectionsSchema.parse(request.query)
  // orgId из запроса, можно указать любой UUID
  const connections = await listCrmConnections(supabase, query.orgId, provider)
})
```

**Уязвимость**:
- Клиент передает `orgId` в параметре запроса
- Нет проверки, что пользователь имеет доступ к этой организации
- Простая модификация параметра = доступ к чужим данным (Insecure Direct Object References)

#### Проблема 4: Webhook validation слабая

**Файл**: kommo.ts:384-396
```typescript
fastify.post('/webhook', async (request, reply) => {
  const signatureHeader = request.headers['x-signature']
  const secret = fastify.config.KOMMO_WEBHOOK_SECRET
  const bodyString = JSON.stringify(request.body ?? {})

  if (secret) {
    const expected = crypto.createHmac('sha256', secret).update(bodyString).digest('hex')
    if (typeof signatureHeader !== 'string' || signatureHeader !== expected) {
      reply.status(401).send({ success: false, error: 'Invalid webhook signature' })
      return
    }
  }
  // ❌ Если secret не установлен, webhook обрабатывается без проверки!
```

**Проблемы**:
- Webhook принимается БЕЗ ВАЛИДАЦИИ если `KOMMO_WEBHOOK_SECRET` не установлен
- Нет rate limiting на webhook endpoint
- Нет проверки IP адреса источника webhook

#### Проблема 5: OAuth State параметр

**Файл**: kommo.ts:156-169
```typescript
fastify.post('/oauth/callback', async (request, reply) => {
  const payload = oauthCallbackSchema.parse(request.body)
  
  // State используется для отката
  const stateRow = await consumeOAuthState(supabase, payload.provider ?? 'kommo', payload.state)
  
  if (!stateRow) {
    reply.status(400).send({ success: false, error: 'Invalid or expired state parameter' })
    return
  }
```

✓ State параметр валиден (защита от CSRF в OAuth потоке)
✓ State удаляется после использования (защита от replay)

Но: **Нет проверки, что state был создан ЭТИМ пользователем!**

### ⚠️ ВАЖНО: Отсутствие Rate Limiting

**Статус**: ПОЛНОСТЬЮ ОТСУТСТВУЕТ

- Нет `@fastify/rate-limit`
- Нет защиты от brute-force
- Нет защиты от DDoS
- Любой может перебирать orgId и получить всю информацию

**Атака на примере**:
```bash
for i in {1..1000000}; do
  curl http://api.example.com/agents?orgId=00000000-0000-0000-0000-$(printf '%012d' $i)
done
```

### ✓ ХОРОШЕЕ: Валидация входных данных

**Зод (Zod) schemas используются везде**:
- agents.ts: listQuerySchema, agentPayloadSchema
- crm.ts: credentialsBodySchema, createConnectionSchema
- kommo.ts: oauthStartSchema, oauthCallbackSchema
- jobs.ts: jobPayloadSchema

**Примеры**:
```typescript
const createConnectionSchema = z.object({
  orgId: z.string().uuid(),           // ✓ UUID validation
  provider: z.string().min(1),        // ✓ Min length
  baseDomain: z.string().min(1),      // ✓ Min length
  accessToken: z.string().min(1),     // ✓ Min length
  expiresAt: z.string().datetime().optional(),  // ✓ Datetime format
})
```

---

## 3. ИНТЕГРАЦИИ

### 3.1 Kommo CRM Интеграция

**Статус**: ✓ Хорошо структурирована

**OAuth Flow** (kommo.ts:118-255):
1. `/oauth/start` - Инициирует OAuth, создает state
2. `/oauth/callback` - Обменивает code на token
3. Токены сохраняются в БД (encrypted)
4. Автоматически запускаются sync jobs

**Проблемы**:
- ❌ Нет обновления refresh token перед истечением
- ❌ Нет обработки истекшего token в API запросах
- ❌ Credentials сохраняются без привязки к пользователю (только orgId)

**Хорошее**:
- ✓ clientSecret шифруется (AES-256-GCM)
- ✓ OAuth state параметр валиден
- ✓ Scope явно определен

### 3.2 Supabase (База Данных)

**Подключение** (supabase.ts:7-20):
```typescript
export const getSupabaseClient = (url: string, serviceRoleKey: string) => {
  if (cachedClient) {
    return cachedClient
  }

  cachedClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return cachedClient
}
```

**Критические Проблемы**:
- ❌ Используется SERVICE_ROLE_KEY везде
- ❌ Это обходит все Row Level Security (RLS) политики
- ❌ Значит, любой код может получить доступ ко ВСЕМ данным независимо от orgId

**Последствия**:
- Если есть SQL injection, данные всех организаций скомпрометированы
- Нет разграничения доступа на уровне БД

**Хорошее**:
- ✓ Используется TypeScript типы (Database schema)
- ✓ Cached client (только один экземпляр)

### 3.3 Redis для Job Queue

**Использование** (queue/index.ts):
```typescript
const connection = new Redis(options.redisUrl)
const queueInstance = new Queue<JobPayload>(options.queueName, { connection })
```

**BullMQ Очередь**:
- Использует distributed job queue
- Поддерживает retry логику (exponential backoff)
- Очистка completed/failed jobs

**Проблемы**:
- ❌ Redis URL может содержать пароль в plain text в логах
- ❌ Нет шифрования данных в Redis
- ❌ Нет тайм-аутов для длинных операций

### 3.4 Webhooks (Kommo)

**Валидация**:
```typescript
if (secret) {
  const expected = crypto.createHmac('sha256', secret).update(bodyString).digest('hex')
  if (typeof signatureHeader !== 'string' || signatureHeader !== expected) {
    reply.status(401).send({ success: false, error: 'Invalid webhook signature' })
    return
  }
}
```

**Проблемы**:
- ❌ Webhook принимается БЕЗ ВАЛИДАЦИИ если secret не установлен
- ❌ Нет защиты от replay атак
- ❌ Нет rate limiting

---

## 4. PRODUCTION READINESS

### ⚠️ КРИТИЧНО: Отсутствие Graceful Shutdown

**Файл**: server.ts:143-151
```typescript
async function start() {
  try {
    await app.listen({ port, host })
    app.log.info(`Fastify API listening on http://${host}:${port}`)
  } catch (error) {
    app.log.error({ err: error }, 'Failed to start Fastify API')
    process.exit(1)
  }
}

start()
// ❌ НЕТ обработчика для SIGTERM или SIGINT!
```

**Последствия**:
- При деплое: requests заканчиваются с ошибками
- Незавершенные transactions теряются
- Клиенты получают 500 ошибку
- Job queue может получить дублирующиеся jobs

**Что нужно добавить**:
```typescript
const gracefulShutdown = async (signal: string) => {
  app.log.info(`Received ${signal}, shutting down gracefully`)
  await app.close()
  process.exit(0)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
```

### ⚠️ Health Checks - Минимальные

**Реализация** (health.ts:1-7):
```typescript
export const registerHealthRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })
}
```

**Проблемы**:
- ❌ Не проверяет подключение к Redis
- ❌ Не проверяет подключение к Supabase
- ❌ Просто возвращает OK без проверок
- ❌ Load balancer может направить запросы на мертвый инстанс

**Нужна проверка**:
- ✓ Redis PING
- ✓ Supabase connectivity
- ✓ File system access
- ✓ Memory usage
- ✓ Database connections

### ✓ Logging и Monitoring

**Logging** (server.ts):
```typescript
const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    transport: process.env.NODE_ENV === 'production' ? undefined : {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'HH:MM:ss.l' },
    },
  },
})
```

✓ Используется Pino logger
✓ Разные уровни для prod/dev
✓ Structured logging

**Metrics** (server.ts:32-49):
```typescript
const httpRequestDuration = new Histogram({
  name: 'api_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [metricsRegistry],
})

const httpErrors = new Counter({
  name: 'api_http_errors_total',
  help: 'Total number of HTTP errors by status code',
  labelNames: ['method', 'route', 'status_code'],
  registers: [metricsRegistry],
})

app.get('/metrics', async (_request, reply) => {
  reply.header('Content-Type', metricsRegistry.contentType)
  return metricsRegistry.metrics()
})
```

✓ Prometheus metrics endpoint
✓ Request duration tracking
✓ Error counting by status code

**Sentry Integration** (server.ts:51-107):
```typescript
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
  })
}

app.addHook('onError', (request, reply, error, done) => {
  app.log.error({ err: error, path: request.url }, 'Unhandled error')
  
  if (Sentry.getCurrentHub().getClient()) {
    Sentry.captureException(error, {
      tags: { service: 'api', route: request.routerPath || request.url },
      extra: { method: request.method, statusCode: reply.statusCode },
    })
  }
  
  const span = trace.getActiveSpan()
  if (span) {
    span.recordException(error)
    span.setStatus({ code: 2, message: error.message })
  }
  
  done()
})
```

✓ Sentry error tracking
✓ OpenTelemetry span recording

### ❌ Отсутствие Request Timeouts

**Проблема**:
- Нет максимального времени выполнения request
- Нет timeout для Supabase queries
- Долгие операции блокируют горячий thread

### ❌ Отсутствие Request Size Limits

**Проблема**:
- Нет ограничения на размер JSON body
- Можно отправить 1GB JSON и затопить память сервера

### ❌ Отсутствие Database Connection Pooling

**Проблема**:
- Supabase client создается один раз и кэшируется
- Нет управления connection pool
- Нет retry logic при потере соединения

---

## 5. ПРОБЛЕМЫ И ПРОБЕЛЫ

### Таблица Критических и Важных Проблем

| № | Категория | Проблема | Файл | Строка | Критичность | Impact |
|----|-----------|----------|------|--------|-------------|--------|
| 1 | Security | CORS: `origin: true, credentials: true` | server.ts | 111 | КРИТИЧНО | CSRF атаки, XSS |
| 2 | Security | Отсутствие аутентификации на всех endpoints | все routes | - | КРИТИЧНО | Полный доступ к данным |
| 3 | Security | Отсутствие авторизации (проверки прав) | все routes | - | КРИТИЧНО | Доступ к чужим данным |
| 4 | Security | SERVICE_ROLE_KEY везде обходит RLS | supabase.ts | 12 | КРИТИЧНО | Нет разграничения доступа |
| 5 | Security | Отсутствие rate limiting | server.ts | - | ОЧЕНЬ ВАЖНО | DDoS, brute-force атаки |
| 6 | Security | Webhook validation опциональна | kommo.ts | 389 | ВАЖНО | Fake webhooks, injection |
| 7 | Operations | Отсутствие graceful shutdown | server.ts | 143-151 | КРИТИЧНО | Data loss, 500 errors |
| 8 | Operations | Слабые health checks | health.ts | 1-7 | ОЧЕНЬ ВАЖНО | Мертвые инстансы не выключаются |
| 9 | Operations | Отсутствие request timeouts | server.ts | - | ВАЖНО | Request hanging |
| 10 | Operations | Отсутствие request size limits | server.ts | - | ВАЖНО | OOM атаки |
| 11 | Data | Нет refresh token rotation | kommo.ts | 190-201 | ВАЖНО | Token compromise |
| 12 | Data | Нет обновления expired tokens | crm routes | - | ВАЖНО | Failed syncs |
| 13 | API | Webhook без replay protection | kommo.ts | 384-431 | ВАЖНО | Duplicate processing |

### Что ОТСУТСТВУЕТ (Top 15 недостатков)

1. **Authentication middleware** - Нет проверки JWT/Bearer tokens
2. **Authorization middleware** - Нет проверки прав orgId
3. **Rate limiting** - Нет защиты от overload
4. **Request timeouts** - Нет максимального времени на request
5. **Request size limits** - Нет ограничения на body size
6. **Graceful shutdown** - Нет SIGTERM/SIGINT обработчиков
7. **Rich health checks** - Только status, нет dependency checks
8. **Token refresh logic** - Нет auto-refresh для expired tokens
9. **Replay attack protection** - Для webhooks нет nonce/timestamp
10. **IP whitelisting** - Для webhooks нет проверки источника
11. **Input sanitization** - Нет защиты от JSON injection в logs
12. **API versioning** - Нет /v1/, /v2/ версионирования
13. **Circuit breaker** - Нет fallback при failure downstream services
14. **Request correlation IDs** - Нет tracking ID для distributed tracing
15. **API documentation** - Нет OpenAPI/Swagger docs

### Что НУЖНО ДОРАБОТАТЬ

#### 1. Добавить Authentication
```typescript
// Пример того, что нужно
const authenticateRequest = fp(async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    const authHeader = request.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      reply.unauthorized('Missing or invalid authorization header')
      return
    }
    // Verify JWT token...
  })
})
```

#### 2. Добавить Authorization проверку
```typescript
// Вместо этого:
const query = listConnectionsSchema.parse(request.query)
const connections = await listCrmConnections(supabase, query.orgId)

// Нужно это:
const query = listConnectionsSchema.parse(request.query)
const user = request.user // из JWT
if (query.orgId !== user.orgId) {
  reply.forbidden('Access denied')
  return
}
const connections = await listCrmConnections(supabase, query.orgId)
```

#### 3. Добавить Rate Limiting
```typescript
import rateLimit from '@fastify/rate-limit'

app.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes'
})
```

#### 4. Добавить Graceful Shutdown
```typescript
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  await app.close()
  process.exit(0)
})
```

#### 5. Улучшить Health Checks
```typescript
fastify.get('/health', async (request, reply) => {
  const redisHealth = await checkRedis()
  const dbHealth = await checkDatabase()
  
  if (!redisHealth || !dbHealth) {
    reply.status(503).send({ status: 'degraded' })
    return
  }
  
  reply.send({ status: 'ok', timestamp: new Date().toISOString() })
})
```

---

## 6. РЕКОМЕНДАЦИИ ДЛЯ PRODUCTION

### Immediate Actions (Before Going Live)

1. **🔴 КРИТИЧНО**: Добавить JWT Authentication middleware
   - Все endpoints должны требовать valid JWT token
   - Token должен содержать userId и orgId
   
2. **🔴 КРИТИЧНО**: Добавить orgId authorization проверку
   - Перед каждым запросом проверить `request.user.orgId === query.orgId`
   - Вернуть 403 если не совпадает
   
3. **🔴 КРИТИЧНО**: Исправить CORS
   - Вместо `origin: true` указать явный список доменов
   - `origin: ['https://app.example.com', 'https://admin.example.com']`
   
4. **🟠 ОЧЕНЬ ВАЖНО**: Добавить rate limiting
   - По IP адресу: max 100 req/minute
   - По user ID: max 1000 req/hour
   
5. **🟠 ОЧЕНЬ ВАЖНО**: Добавить graceful shutdown
   - Обработать SIGTERM/SIGINT
   - Дождаться завершения текущих requests
   
6. **🟠 ОЧЕНЬ ВАЖНО**: Улучшить health checks
   - Проверять Redis, Supabase, память
   - Возвращать 503 если критические сервисы недоступны

### Short-term Actions (First Sprint)

7. **🟡 ВАЖНО**: Добавить request timeouts
   - По умолчанию: 30 сек
   - Для долгих операций: 5 мин

8. **🟡 ВАЖНО**: Добавить request size limits
   - JSON body: max 5MB
   - URL params: max 2KB

9. **🟡 ВАЖНО**: Добавить token refresh logic
   - Проверить expires_at перед использованием
   - Автоматически обновлять token

10. **🟡 ВАЖНО**: Добавить webhook replay protection
    - Сохранять webhook ID в БД
    - Игнорировать дублирующиеся webhook ID

### Medium-term Actions (Next Quarters)

11. Добавить API versioning (/v1/, /v2/)
12. Добавить circuit breaker для Kommo API calls
13. Добавить request correlation IDs
14. Добавить OpenAPI/Swagger документацию
15. Добавить audit logs для всех изменений

---

## 7. DEPLOYMENT CHECKLIST

### ✓ При деплое в Production выполните:

- [ ] Environment variables
  - [ ] NEXTAUTH_SECRET установлен (min 32 chars)
  - [ ] JWT_SECRET установлен (min 32 chars)
  - [ ] ENCRYPTION_KEY установлен (base64, 32 bytes)
  - [ ] SUPABASE_SERVICE_ROLE_KEY установлен
  - [ ] REDIS_URL или UPSTASH_REDIS_REST_URL установлен
  - [ ] KOMMO_WEBHOOK_SECRET установлен

- [ ] Security
  - [ ] CORS origin явно установлен (не `true`)
  - [ ] Authentication middleware добавлен
  - [ ] Authorization проверка добавлена
  - [ ] Rate limiting включен
  - [ ] Helmet headers установлены

- [ ] Database
  - [ ] RLS политики включены в Supabase
  - [ ] Backups включены
  - [ ] Connection pooling настроен
  - [ ] Индексы созданы

- [ ] Operations
  - [ ] Health check endpoint работает
  - [ ] Graceful shutdown реализован
  - [ ] Monitoring настроено (Prometheus/Sentry)
  - [ ] Логирование включено
  - [ ] Alert rules созданы

- [ ] Testing
  - [ ] E2E тесты пройдены
  - [ ] Load testing выполнено
  - [ ] Security scan выполнен
  - [ ] Dependency audit выполнен

---

## ИТОГОВЫЙ SCORE

| Категория | Score | Status |
|-----------|-------|--------|
| Architecture | 7/10 | ✓ Хорошая структура |
| Security | **2/10** | 🔴 КРИТИЧНО: нет auth |
| Reliability | 5/10 | 🟠 Нет graceful shutdown |
| Scalability | 6/10 | 🟡 Нет rate limiting |
| Monitoring | 7/10 | ✓ Есть metrics & logs |
| Documentation | 3/10 | 🟠 Нет API docs |
| **TOTAL** | **4/10** | 🔴 **NOT PRODUCTION READY** |

**ВЕРДИКТ**: ❌ **API НЕ ГОТОВ К PRODUCTION**

**Минимальные требования для production**:
1. Добавить JWT authentication
2. Добавить authorization (orgId check)
3. Исправить CORS
4. Добавить rate limiting
5. Добавить graceful shutdown
6. Улучшить health checks

Без этих изменений API будет скомпрометирован в течение часа после запуска в production.

