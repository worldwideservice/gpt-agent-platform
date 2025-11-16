# Troubleshooting Guide

**Задача 5.2: Documentation**
**Версия:** 1.0
**Дата:** 2025-11-16

Руководство по решению частых проблем в GPT Agent Platform.

---

## 📋 Содержание

- [Build Errors](#build-errors)
- [Runtime Errors](#runtime-errors)
- [Database Issues](#database-issues)
- [Redis & Queue Issues](#redis--queue-issues)
- [Authentication Issues](#authentication-issues)
- [API Errors](#api-errors)
- [Performance Issues](#performance-issues)
- [Security Issues](#security-issues)
- [CRM Integration Issues](#crm-integration-issues)
- [Debug Tools](#debug-tools)

---

## Build Errors

### ❌ Error: `Module not found: Can't resolve '@/...'`

**Проблема**: TypeScript не находит path alias

**Решение**:

```bash
# 1. Проверить tsconfig.json
cat tsconfig.json | grep paths

# Должно быть:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# 2. Перезапустить TypeScript server (в VSCode)
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# 3. Удалить кэш и пересобрать
rm -rf .next node_modules
npm install
npm run build
```

### ❌ Error: `Cannot find module 'next/font/google'`

**Проблема**: Неправильная версия Next.js

**Решение**:

```bash
# Проверить версию Next.js
npm list next

# Должно быть 14.2.0+
npm install next@latest
```

### ❌ Error: `Type error: Cannot find module './openapi.yaml'`

**Проблема**: YAML файл не найден при сборке

**Решение**:

```bash
# Проверить что файл существует
ls -la docs/openapi.yaml

# Если нет - восстановить из git
git checkout docs/openapi.yaml

# Или пересоздать
# См. docs/openapi.yaml в репозитории
```

---

## Runtime Errors

### ❌ Error: `NEXTAUTH_SECRET` environment variable not set

**Проблема**: Отсутствует обязательная ENV переменная

**Решение**:

```bash
# Сгенерировать NEXTAUTH_SECRET
openssl rand -base64 48

# Добавить в .env.local (dev) или .env.production
NEXTAUTH_SECRET=<сгенерированный-secret>

# Перезапустить приложение
npm run dev  # или
pm2 restart gpt-agent-platform
```

### ❌ Error: `Supabase client error: Invalid JWT`

**Проблема**: Неправильный Supabase ключ

**Решение**:

```bash
# 1. Проверить что используется SERVICE_ROLE_KEY, а не ANON_KEY
echo $SUPABASE_SERVICE_ROLE_KEY

# 2. Получить правильный ключ из Supabase Dashboard
# Settings → API → service_role key

# 3. Обновить ENV
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### ❌ Error: `Redis connection refused`

**Проблема**: Redis не запущен или недоступен

**Решение**:

```bash
# Локальный Redis
# 1. Проверить статус
redis-cli ping
# Ожидается: PONG

# 2. Запустить Redis
redis-server

# Upstash Redis
# 1. Проверить ENV переменные
echo $UPSTASH_REDIS_REST_URL
echo $UPSTASH_REDIS_REST_TOKEN

# 2. Проверить подключение
curl $UPSTASH_REDIS_REST_URL/ping \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
# Ожидается: {"result":"PONG"}
```

---

## Database Issues

### ❌ Error: `relation "agents" does not exist`

**Проблема**: Миграции не применены

**Решение**:

```bash
# 1. Проверить статус миграций
npm run db:migrate:status

# 2. Применить миграции
npm run db:migrate

# 3. Проверить что таблица создана
# В Supabase Dashboard → SQL Editor:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

### ❌ Error: `permission denied for table agents`

**Проблема**: RLS (Row Level Security) блокирует доступ

**Решение**:

```sql
-- Опция 1: Использовать SERVICE_ROLE_KEY (обходит RLS)
-- Проверить что используется getSupabaseServiceRoleClient(), а не getSupabaseClient()

-- Опция 2: Проверить RLS политики
SELECT * FROM pg_policies WHERE tablename = 'agents';

-- Опция 3: Временно отключить RLS (только для debug!)
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
```

### ❌ Slow Queries

**Проблема**: Запросы выполняются медленно

**Решение**:

```bash
# 1. Проверить что индексы созданы (Задача 4.4)
# В Supabase Dashboard → SQL Editor:
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE tablename = 'agents';

# Должны быть индексы:
# - idx_agents_org_status_created
# - idx_agents_name_trgm
# - idx_agents_org_active
# - и другие (см. PERFORMANCE_OPTIMIZATION.md)

# 2. Если индексов нет - применить миграцию
npm run db:migrate

# 3. Проверить план выполнения запроса
EXPLAIN ANALYZE
SELECT * FROM agents WHERE org_id = 'xxx' AND status = 'active';
```

---

## Redis & Queue Issues

### ❌ Error: `Job failed: Maximum call stack size exceeded`

**Проблема**: Циклическая зависимость в BullMQ job

**Решение**:

```bash
# 1. Проверить логи worker
pm2 logs gpt-agent-worker

# 2. Проверить DLQ (Dead Letter Queue)
curl -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  https://your-domain.com/api/admin/dlq

# 3. Очистить DLQ
curl -X DELETE -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  https://your-domain.com/api/admin/dlq/cleanup?olderThanDays=1
```

### ❌ Error: `Redis memory limit exceeded`

**Проблема**: Redis закончилась память

**Решение**:

```bash
# Локальный Redis
# 1. Проверить использование памяти
redis-cli info memory | grep used_memory_human

# 2. Настроить maxmemory policy
redis-cli CONFIG SET maxmemory 2gb
redis-cli CONFIG SET maxmemory-policy allkeys-lru

# Upstash Redis
# 1. Проверить лимиты в Dashboard
# 2. Upgrade план или очистить старые ключи
redis-cli --scan --pattern 'cache:*' | xargs redis-cli del
```

---

## Authentication Issues

### ❌ Error: `Invalid credentials`

**Проблема**: Неправильный email/password

**Решение**:

```bash
# 1. Проверить что пользователь существует
# В Supabase Dashboard → Authentication → Users

# 2. Сбросить пароль
# Auth → Users → ... → Reset Password

# 3. Проверить bcrypt hash
# В Supabase Dashboard → SQL Editor:
SELECT email, password_hash FROM users WHERE email = 'user@example.com';
```

### ❌ Error: `Session expired`

**Проблема**: JWT токен истек

**Решение**:

```bash
# 1. Проверить maxAge в auth.ts
# Должно быть:
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30 days
}

# 2. Очистить cookies и перелогиниться
# В браузере: Developer Tools → Application → Cookies → Clear

# 3. Проверить что NEXTAUTH_URL правильный
echo $NEXTAUTH_URL
# Должен совпадать с текущим доменом
```

### ❌ Error: `CSRF token mismatch` (Задача 5.1)

**Проблема**: Невалидный CSRF токен

**Решение**:

```typescript
// 1. Получить новый CSRF токен
const response = await fetch('/api/csrf-token')
const { csrfToken } = await response.json()

// 2. Включить в запрос
await fetch('/api/agents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken  // ← ОБЯЗАТЕЛЬНО
  },
  body: JSON.stringify(data)
})

// 3. Если не помогает - временно отключить CSRF
ENABLE_CSRF_PROTECTION=0
```

---

## API Errors

### ❌ Error: 429 - Too Many Requests

**Проблема**: Превышен rate limit (Задача 5.1)

**Решение**:

```bash
# Проверить лимиты:
# - Authenticated users: 100 req/min
# - Anonymous users: 20 req/min

# Опции:
# 1. Подождать 1 минуту до сброса лимита

# 2. Использовать authenticated запросы (выше лимит)

# 3. Временно увеличить лимит (lib/rate-limit.ts)
export const apiRateLimiter = new Ratelimit({
  redis: redisClient,
  limiter: Ratelimit.slidingWindow(200, '1 m'), // было 100
})
```

### ❌ Error: 403 - Forbidden

**Проблема**: Нет доступа к ресурсу

**Решение**:

```bash
# 1. Проверить что orgId совпадает
# В браузере: Developer Tools → Application → Cookies → next-auth.session-token
# Декодировать JWT на jwt.io и проверить orgId

# 2. Проверить что используется правильный tenantId
# URL должен быть: /manage/{correct-tenantId}/...

# 3. Для admin endpoints - проверить ADMIN_EMAILS
echo $ADMIN_EMAILS
# Должен содержать ваш email
```

### ❌ Error: 500 - Internal Server Error

**Проблема**: Ошибка на сервере

**Решение**:

```bash
# 1. Проверить логи
pm2 logs gpt-agent-platform --lines 100

# Vercel
vercel logs

# Docker
docker-compose logs -f app

# 2. Включить debug режим
DEBUG=* npm run dev

# 3. Проверить Sentry (если настроен)
# https://sentry.io/your-project/issues/
```

---

## Performance Issues

### ⏱️ Slow Dashboard Load

**Проблема**: Dashboard загружается долго

**Решение**:

```bash
# 1. Проверить что кэширование работает (Задача 4.4)
# В Redis CLI:
redis-cli
> KEYS cache:dashboard:*
> TTL cache:dashboard:org-123:stats

# 2. Проверить размер кэша
> MEMORY USAGE cache:dashboard:org-123:stats

# 3. Очистить кэш (если нужно)
> DEL cache:dashboard:org-123:stats

# 4. Проверить индексы БД
# См. раздел "Database Issues → Slow Queries"
```

### ⏱️ Slow Agents List

**Проблема**: Список агентов загружается медленно

**Решение**:

```bash
# 1. Использовать пагинацию
GET /api/agents?page=1&limit=20

# 2. Использовать индексы (Задача 4.4)
# Проверить наличие idx_agents_org_status_created

# 3. Проверить что кэширование включено
# lib/repositories/agents.ts должно использовать getCachedAgentsList()
```

### ⏱️ High Memory Usage

**Проблема**: Приложение использует много памяти

**Решение**:

```bash
# 1. Проверить текущее использование
pm2 monit

# 2. Настроить max memory restart
# В ecosystem.config.js:
max_memory_restart: '1G'

# 3. Проверить утечки памяти
# Использовать Chrome DevTools Memory Profiler

# 4. Ограничить Node.js heap
node --max-old-space-size=1024 .next/server.js
```

---

## Security Issues

### 🔐 Security Headers Not Applied

**Проблема**: Security headers отсутствуют (Задача 5.1)

**Решение**:

```bash
# 1. Проверить что headers настроены в next.config.js
grep -A 30 "async headers()" next.config.js

# 2. Проверить в браузере
curl -I https://your-domain.com | grep -E "(Strict-Transport-Security|Content-Security-Policy|X-Frame-Options)"

# Должны быть:
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: ...
X-Frame-Options: DENY

# 3. Если используется Nginx - проверить конфигурацию
cat /etc/nginx/sites-available/gpt-agent-platform | grep add_header
```

### 🔐 Admin Endpoint Accessible to Non-Admins

**Проблема**: Admin endpoints доступны всем (Задача 5.1)

**Решение**:

```bash
# 1. Проверить ADMIN_EMAILS
echo $ADMIN_EMAILS

# 2. Проверить ADMIN_API_TOKEN
echo $ADMIN_API_TOKEN

# 3. Проверить что endpoint использует requireAdmin()
# В app/api/admin/dlq/route.ts:
const adminCheck = await requireAdmin(request)
if (adminCheck) return adminCheck
```

### 🔐 XSS Vulnerability

**Проблема**: Возможна XSS атака

**Решение**:

```bash
# 1. НЕ использовать dangerouslySetInnerHTML
grep -r "dangerouslySetInnerHTML" app/ components/
# Должно быть пусто

# 2. Проверить CSP header
curl -I https://your-domain.com | grep Content-Security-Policy

# 3. Использовать React escape по умолчанию
# React автоматически экранирует все значения в JSX
<div>{userInput}</div>  // ✅ Safe
<div dangerouslySetInnerHTML={{__html: userInput}} />  // ❌ Dangerous
```

---

## CRM Integration Issues

### 🔌 Kommo Webhook Not Receiving Events

**Проблема**: Webhooks от Kommo не приходят

**Решение**:

```bash
# 1. Проверить webhook URL в Kommo
# Настройки → Интеграции → Webhooks
# Должен быть: https://your-domain.com/api/crm/webhook

# 2. Проверить что endpoint доступен
curl https://your-domain.com/api/crm/webhook
# НЕ должно быть 404

# 3. Проверить webhook secret
echo $KOMMO_WEBHOOK_SECRET
# Должен совпадать с настройкой в Kommo

# 4. Проверить логи webhook events
curl -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  https://your-domain.com/api/integrations/kommo/webhook/events?limit=10
```

### 🔌 OAuth Flow Fails

**Проблема**: OAuth авторизация не работает

**Решение**:

```bash
# 1. Проверить redirect URI
echo $KOMMO_REDIRECT_URI
# Должен быть: https://your-domain.com/api/integrations/kommo/oauth/callback

# 2. Проверить что URI совпадает в Kommo настройках
# Kommo Dashboard → Интеграции → OAuth → Redirect URI

# 3. Проверить CLIENT_ID и CLIENT_SECRET
echo $KOMMO_CLIENT_ID
echo $KOMMO_CLIENT_SECRET

# 4. Проверить логи OAuth
pm2 logs | grep oauth
```

---

## Debug Tools

### Enable Debug Logging

```bash
# Development
DEBUG=* npm run dev

# Production (PM2)
pm2 restart gpt-agent-platform --log-date-format "YYYY-MM-DD HH:mm:ss"
pm2 logs gpt-agent-platform --lines 200
```

### Check Health

```bash
# Application health
curl https://your-domain.com/api/health
curl https://your-domain.com/api/health/ready

# Database health
# В Supabase Dashboard → SQL Editor:
SELECT 1;

# Redis health
redis-cli ping

# Queue health
curl -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  https://your-domain.com/api/admin/dlq
```

### Performance Profiling

```bash
# Node.js profiling
node --prof .next/server.js

# Chrome DevTools
# 1. Open: chrome://inspect
# 2. Click "Open dedicated DevTools for Node"
# 3. Go to Profiler tab

# Lighthouse audit
npx lighthouse https://your-domain.com --view

# Bundle analyzer
npm run build -- --analyze
```

### Database Query Profiling

```sql
-- Enable slow query log
ALTER SYSTEM SET log_min_duration_statement = 1000; -- log queries > 1 second

-- View slow queries
SELECT
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## Common Error Messages

### Error Code Reference

| Code | Description | Solution |
|------|-------------|----------|
| `UNAUTHORIZED` | Не авторизован | Проверить session cookie |
| `FORBIDDEN` | Доступ запрещен | Проверить orgId/tenantId |
| `CSRF_VALIDATION_FAILED` | Невалидный CSRF токен | Получить новый токен через /api/csrf-token |
| `RATE_LIMIT_EXCEEDED` | Превышен лимит запросов | Подождать 1 минуту |
| `ADMIN_REQUIRED` | Требуется admin роль | Проверить ADMIN_EMAILS |
| `WEBHOOK_SIGNATURE_INVALID` | Невалидная подпись webhook | Проверить KOMMO_WEBHOOK_SECRET |

---

## Getting Help

Если проблема не решена:

1. **Check Logs**:
   ```bash
   pm2 logs --lines 500
   vercel logs
   docker-compose logs -f
   ```

2. **Check Sentry**: https://sentry.io/your-project/issues/

3. **GitHub Issues**: https://github.com/your-org/gpt-agent-platform/issues

4. **API Documentation**: https://your-domain.com/api/docs

5. **Security Report**: `SECURITY_AUDIT_REPORT.md`

---

**Last Updated**: 2025-11-16
**Version**: 1.0
