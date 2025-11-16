# Rate Limiting Middleware

## Обзор

Система rate limiting для защиты API endpoints от DDoS атак и злоупотреблений. Поддерживает Redis (локальный и Upstash) с автоматическим fallback на memory store.

## Основные компоненты

### 1. `lib/redis.ts`
Универсальное подключение к Redis:
- **Production**: Upstash Redis (serverless)
- **Development**: Локальный Redis (docker-compose)
- **Fallback**: Memory store (только для dev)

### 2. `lib/middleware/rate-limit.ts`
Core middleware с функциями rate limiting:
- `checkRateLimit()` - проверка лимитов
- `getIdentifier()` - получение идентификатора (user ID или IP)
- `createRateLimitResponse()` - создание 429 ответа
- `withRateLimit()` - HOC для оборачивания handlers

### 3. `lib/middleware/rate-limit-api.ts`
Готовые хелперы для применения в API routes:
- `rateLimitAPI()` - стандартные API endpoints (100/min)
- `rateLimitAuth()` - аутентификация (5/min)
- `rateLimitWebhook()` - вебхуки (50/min)
- `rateLimitUpload()` - загрузка файлов (10/hour)
- `rateLimitAI()` - AI endpoints (20/min)

## Использование

### Пример 1: Стандартный API endpoint

```typescript
// app/api/manage/[tenantId]/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { rateLimitAPI } from '@/lib/middleware/rate-limit-api'

export async function GET(request: NextRequest) {
  // Применить rate limiting
  const rateLimitResponse = await rateLimitAPI(request, userId)
  if (rateLimitResponse) return rateLimitResponse

  // Ваша логика...
  return NextResponse.json({ data: 'ok' })
}
```

### Пример 2: Auth endpoint (строгий лимит)

```typescript
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { rateLimitAuth } from '@/lib/middleware/rate-limit-api'

export async function POST(request: NextRequest) {
  // Строгий лимит для auth (5 req/min)
  const rateLimitResponse = await rateLimitAuth(request)
  if (rateLimitResponse) return rateLimitResponse

  // Регистрация...
}
```

### Пример 3: Webhook endpoint

```typescript
// app/api/crm/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { rateLimitWebhook } from '@/lib/middleware/rate-limit-api'

export async function POST(request: NextRequest) {
  // Rate limit для вебхуков (50 req/min)
  const rateLimitResponse = await rateLimitWebhook(request, 'kommo')
  if (rateLimitResponse) return rateLimitResponse

  // Обработка webhook...
}
```

### Пример 4: Кастомный лимит

```typescript
import { applyRateLimit, RateLimitPresets } from '@/lib/middleware/rate-limit-api'

export async function POST(request: NextRequest) {
  // Кастомный лимит: 30 запросов в 5 минут
  const rateLimitResponse = await applyRateLimit(
    request,
    {
      max: 30,
      windowSeconds: 300,
      endpoint: 'custom',
    },
    userId
  )
  if (rateLimitResponse) return rateLimitResponse

  // Ваша логика...
}
```

### Пример 5: HOC Pattern

```typescript
import { withAPIRateLimit } from '@/lib/middleware/rate-limit-api'

export const GET = withAPIRateLimit(
  async (request: NextRequest) => {
    return NextResponse.json({ data: 'ok' })
  },
  { max: 50, windowSeconds: 60, endpoint: 'custom' }
)
```

## Конфигурация

### Переменные окружения

```bash
# Production: Upstash Redis (предпочтительно)
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Development: Локальный Redis
REDIS_URL=redis://localhost:6379
# ИЛИ
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

### Доступные пресеты

```typescript
RateLimitPresets = {
  api: { max: 100, windowSeconds: 60 },      // 100/min
  auth: { max: 5, windowSeconds: 60 },       // 5/min (строгий)
  webhook: { max: 50, windowSeconds: 60 },   // 50/min
  upload: { max: 10, windowSeconds: 3600 },  // 10/hour
  ai: { max: 20, windowSeconds: 60 },        // 20/min
}
```

## Запуск Redis

### Development (Docker)

```bash
# Запустить Redis контейнер
docker-compose up -d redis

# Проверить статус
docker ps | grep redis

# Проверить логи
docker logs gpt-agent-redis
```

### Production (Upstash)

1. Создать аккаунт на [upstash.com](https://upstash.com)
2. Создать Redis database
3. Скопировать REST API credentials
4. Добавить в Vercel Environment Variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Тестирование

```bash
# Unit тесты
npm run test:unit -- lib/middleware/rate-limit.test.ts

# Проверка типов
npm run type-check

# Тест rate limiting вручную (curl)
# Сделать 101 запрос - последний должен вернуть 429
for i in {1..101}; do
  curl -w "\n%{http_code}\n" http://localhost:3000/api/test
done
```

## Response Headers

При каждом запросе в ответ добавляются заголовки:

```
X-RateLimit-Limit: 100           # Максимум запросов
X-RateLimit-Remaining: 95        # Осталось запросов
X-RateLimit-Reset: 1642345678000 # Unix timestamp сброса
Retry-After: 45                  # Секунд до следующей попытки
```

## Обработка ошибок

### Fail Open
Если Redis недоступен, middleware пропускает запросы (fail open):

```typescript
// Redis down → запрос разрешен
const result = await checkRateLimit(identifier, config)
// result.success === true (даже если Redis не работает)
```

### 429 Response

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again in 45 seconds.",
  "retryAfter": 45
}
```

## Best Practices

1. **Используйте userId когда возможно**
   ```typescript
   const session = await auth()
   rateLimitAPI(request, session?.user?.id) // ✅ Лучше
   rateLimitAPI(request) // ⚠️ Только IP
   ```

2. **Разные лимиты для разных endpoints**
   ```typescript
   rateLimitAuth(request)    // ✅ Строгий для auth
   rateLimitAPI(request)     // ✅ Стандартный для API
   rateLimitUpload(request)  // ✅ Часовой для uploads
   ```

3. **Логируйте превышения лимитов**
   ```typescript
   // Автоматически логируется в middleware
   logger.warn('Rate limit exceeded', { identifier, endpoint })
   ```

4. **Тестируйте в production-like окружении**
   ```bash
   # Запустить с Redis
   docker-compose up -d redis
   npm run dev
   ```

## Архитектура

```
┌─────────────────────────────────────┐
│ API Request                         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Rate Limit Middleware               │
│ - Получить identifier (user/IP)    │
│ - Проверить Redis counter           │
│ - Increment или reject              │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   Allowed       Rate Limited
   (200 OK)      (429 Too Many Requests)
```

## Мониторинг

### Redis Health Check

```typescript
import { isRedisAvailable } from '@/lib/redis'

const healthy = await isRedisAvailable()
console.log('Redis status:', healthy ? 'OK' : 'DOWN')
```

### Метрики (TODO)

- Total requests per endpoint
- Rate limit hits (429 responses)
- Top rate-limited IPs/users
- Redis latency

## Roadmap

- [ ] Интеграция с Sentry для алертов
- [ ] Dashboard для мониторинга rate limits
- [ ] Whitelist/Blacklist IP addresses
- [ ] Динамические лимиты на основе user tier
- [ ] Burst allowance (короткие всплески)
- [ ] Distributed rate limiting across regions

## Troubleshooting

### Rate limiting не работает

1. Проверить Redis подключение:
   ```bash
   docker ps | grep redis
   ```

2. Проверить переменные окружения:
   ```bash
   echo $REDIS_URL
   echo $UPSTASH_REDIS_REST_URL
   ```

3. Посмотреть логи:
   ```bash
   docker logs gpt-agent-redis
   ```

### Redis connection refused

```bash
# Перезапустить Redis
docker-compose restart redis

# Проверить порт
netstat -an | grep 6379
```

### Memory store используется в production

```
CRITICAL: Redis credentials missing in production!
```

Решение: добавить `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN` в Vercel.

## Ссылки

- [Upstash Redis](https://upstash.com)
- [Redis Rate Limiting Patterns](https://redis.io/docs/manual/patterns/rate-limiting/)
- [OWASP API Security - Rate Limiting](https://owasp.org/www-project-api-security/)
