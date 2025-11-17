# Structured Logging System

## Обзор

Production-ready система логирования на основе [Pino](https://getpino.io/) с поддержкой:
- ✅ Structured JSON logging
- ✅ AsyncLocalStorage для автоматического request tracking
- ✅ File rotation (daily, 14 days retention)
- ✅ Sentry integration для errors
- ✅ OpenTelemetry tracing
- ✅ PII redaction
- ✅ Pretty printing в development

## Архитектура

```
lib/logger/
├── index.ts          # Main logger (enhanced Pino)
├── config.ts         # Configuration & file rotation
├── async-storage.ts  # Request context tracking
└── README.md         # This file
```

## Использование

### Базовое логирование

```typescript
import { logger } from '@/lib/utils/logger'

// Info
logger.info('User logged in', { userId: '123', email: '[email protected]' })

// Warning
logger.warn('API rate limit approaching', { remaining: 5, limit: 100 })

// Error
logger.error('Database query failed', error, { query: 'SELECT *' })

// Debug (только в development или с LOG_LEVEL=debug)
logger.debug('Processing request', { requestId: 'abc' })
```

### Request Context (AsyncLocalStorage)

```typescript
import { runWithContext, createRequestContext } from '@/lib/utils/logger'

// В API route или middleware
export async function POST(request: Request) {
  const context = createRequestContext(request)

  return runWithContext(context, async () => {
    // Все логи внутри автоматически получат requestId, path, method, ip
    logger.info('Processing request') // ✅ Автоматически добавит requestId

    await processData()

    logger.info('Request completed') // ✅ Тот же requestId
    return Response.json({ ok: true })
  })
}
```

### Performance Tracking

```typescript
const startTime = Date.now()

// ... your code ...

const duration = Date.now() - startTime
logger.performance('database_query', duration, {
  query: 'SELECT * FROM users',
  rows: 1000,
})
```

### HTTP Request Logging

```typescript
// Успешный запрос
logger.request('GET', '/api/users', 200, 145)
// → GET /api/users 200 - 145ms

// Ошибка
logger.requestError('POST', '/api/users', 500, error, { userId: '123' })
```

## Конфигурация

### Environment Variables

```bash
# Log level (trace, debug, info, warn, error, fatal)
LOG_LEVEL=info                    # production: info, development: debug

# File logging
LOG_TO_FILE=true                  # Enable file output (auto-enabled in production)
LOG_DIR=./logs                    # Log directory path

# Sentry
SENTRY_DSN=https://...            # Error tracking
```

### Log Levels

```typescript
trace  # Самый детальный (только для debug)
debug  # Детальная информация (development)
info   # Обычная информация
warn   # Предупреждения
error  # Ошибки (отправляются в Sentry)
fatal  # Критические ошибки (отправляются в Sentry)
```

## File Rotation

Логи автоматически ротируются:

```
logs/
├── app.log              # Все логи (info+)
├── app.log.2025-01-15   # Архив за 15 января
├── app.log.2025-01-14   # Архив за 14 января
├── error.log            # Только ошибки (error+)
└── error.log.2025-01-15 # Архив ошибок

# Автоматическое удаление после 14 дней
# Максимальный размер файла: 100MB
```

## PII Redaction

Sensitive данные автоматически скрываются:

```typescript
logger.info('User login', {
  email: '[email protected]',
  password: 'secret123',  // ❌ Будет удалено
  token: 'abc123',        // ❌ Будет удалено
})

// Output:
{
  "level": "info",
  "msg": "User login",
  "email": "[email protected]",
  // password и token удалены
}
```

Redacted fields:
- `password`, `secret`, `token`, `apiKey`
- `headers.authorization`, `headers.cookie`
- `access_token`, `refresh_token`
- Любые поля с префиксом `*.password`, `*.token`, `*.secret`

## Примеры

### API Route с полным контекстом

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { logger, runWithContext, createRequestContext } from '@/lib/utils/logger'

export async function POST(request: NextRequest) {
  const context = createRequestContext(request)

  return runWithContext(context, async () => {
    try {
      logger.info('Creating user')

      const body = await request.json()
      const user = await createUser(body)

      logger.info('User created successfully', { userId: user.id })

      return NextResponse.json(user)
    } catch (error) {
      logger.error('Failed to create user', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
```

Лог output:

```json
{
  "level": "info",
  "time": "2025-01-16T10:30:00.123Z",
  "msg": "Creating user",
  "requestId": "abc-123",
  "path": "/api/users",
  "method": "POST",
  "ip": "1.2.3.4",
  "service": "gpt-agent-platform",
  "environment": "production"
}
```

### Middleware с Request ID

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { runWithContext, createRequestContext, getRequestDuration } from '@/lib/utils/logger'
import { logger } from '@/lib/utils/logger'

export function middleware(request: NextRequest) {
  const context = createRequestContext(request)

  return runWithContext(context, () => {
    logger.info('Request started')

    const response = NextResponse.next()

    // Add request ID to response headers
    response.headers.set('X-Request-ID', context.requestId)

    const duration = getRequestDuration()
    logger.request(request.method, request.nextUrl.pathname, 200, duration || 0)

    return response
  })
}
```

### Child Logger с дополнительным контекстом

```typescript
// Создать child logger с постоянным контекстом
const userLogger = logger.child({ userId: '123', role: 'admin' })

// Все логи будут содержать userId и role
userLogger.info('Action performed')  // + { userId: '123', role: 'admin' }
userLogger.warn('Permission check')  // + { userId: '123', role: 'admin' }
```

## Sentry Integration

Все `error` и `fatal` логи автоматически отправляются в Sentry в production:

```typescript
try {
  await dangerousOperation()
} catch (error) {
  // Автоматически отправится в Sentry с полным контекстом
  logger.error('Operation failed', error, {
    operationId: '123',
    userId: 'abc',
  })
}
```

Sentry получит:
- Error message & stack trace
- Request context (requestId, path, method, ip)
- Custom tags (service, environment)
- Extra metadata из context parameter

## OpenTelemetry Integration

Logger автоматически аннотирует активные spans:

```typescript
import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('my-service')

tracer.startActiveSpan('process-payment', (span) => {
  logger.info('Processing payment', { amount: 100 })
  // Лог автоматически добавится к span как event

  span.end()
})
```

## Migration от console.log

### Автоматическая замена (рекомендуется)

```bash
# Dry run (посмотреть что будет заменено)
DRY_RUN=true ./scripts/replace-console-logs.sh app/

# Заменить во всех файлах
./scripts/replace-console-logs.sh app/
./scripts/replace-console-logs.sh lib/

# Проверить изменения
git diff

# Запустить тесты
npm test
```

### Ручная замена

```typescript
// ❌ Before
console.log('User logged in')
console.error('Error:', error)
console.warn('Deprecated API')

// ✅ After
import { logger } from '@/lib/utils/logger'

logger.info('User logged in')
logger.error('Error occurred', error)
logger.warn('Deprecated API')
```

## Production Checklist

- [ ] Установить `LOG_LEVEL=info` в production
- [ ] Добавить `SENTRY_DSN` для error tracking
- [ ] Включить file logging: `LOG_TO_FILE=true`
- [ ] Настроить log rotation (автоматически для файлов)
- [ ] Убедиться что sensitive данные redacted
- [ ] Заменить все `console.log` на `logger`
- [ ] Настроить мониторинг логов (CloudWatch, Datadog, etc.)

## Development Tips

### Pretty Printing

В development логи автоматически форматируются с цветами:

```
[10:30:00.123] INFO  - User logged in
    requestId: "abc-123"
    userId: "456"
```

### Debug Logging

```bash
# Включить debug логи
LOG_LEVEL=debug npm run dev

# Trace level (максимальная детализация)
LOG_LEVEL=trace npm run dev
```

### Disable Sentry (local development)

```bash
# В .env.local
SENTRY_DSN=

# Или
NODE_ENV=development
```

## Best Practices

### ✅ DO

```typescript
// Structured context
logger.info('User created', { userId: '123', email: '[email protected]' })

// Proper error logging
logger.error('Database error', error, { query, params })

// Performance tracking
logger.performance('api_call', duration, { endpoint })
```

### ❌ DON'T

```typescript
// String concatenation
logger.info('User created: ' + userId) // ❌ Не структурировано

// Логирование sensitive данных
logger.info('Password:', password) // ❌ PII leak

// console.log в production
console.log('Debug info') // ❌ Использовать logger
```

## Troubleshooting

### Логи не появляются

```bash
# Проверить LOG_LEVEL
echo $LOG_LEVEL

# Убедиться что level >= установленного
logger.debug('test')  # Не появится если LOG_LEVEL=info
logger.info('test')   # ✅ Появится

# Проверить конфигурацию
cat lib/logger/config.ts
```

### File logging не работает

```bash
# Проверить что директория logs/ создана
mkdir -p logs

# Проверить права
chmod 755 logs

# Включить file logging явно
export LOG_TO_FILE=true
```

### Request ID не добавляется автоматически

```typescript
// Убедитесь что используете runWithContext
import { runWithContext, createRequestContext } from '@/lib/utils/logger'

export async function POST(request: Request) {
  const context = createRequestContext(request)

  return runWithContext(context, async () => {
    logger.info('Now requestId is automatic')
    return Response.json({ ok: true })
  })
}
```

## Monitoring & Alerts

### CloudWatch Logs (AWS)

Логи в JSON автоматически парсятся CloudWatch:

```bash
# Создать log group
aws logs create-log-group --log-group-name /app/gpt-agent-platform

# Фильтр для errors
aws logs filter-log-events \
  --log-group-name /app/gpt-agent-platform \
  --filter-pattern '{ $.level = "error" }'
```

### Datadog

```typescript
// Datadog agent автоматически обрабатывает JSON логи
// Добавить в config:
{
  "logs": {
    "type": "file",
    "path": "/app/logs/app.log",
    "service": "gpt-agent-platform",
    "source": "nodejs"
  }
}
```

## Links

- [Pino Documentation](https://getpino.io/)
- [Sentry Integration](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [OpenTelemetry](https://opentelemetry.io/docs/languages/js/)
- [AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage)
