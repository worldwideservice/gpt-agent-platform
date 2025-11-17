# Production Deployment Checklist

**Дата создания**: 2025-11-17
**Версия проекта**: 1.0.5
**Статус готовности**: 🔴 **НЕ ГОТОВО К PRODUCTION** (требуется 48-72 часа работы)

---

## Оглавление

1. [Общий статус](#общий-статус)
2. [Критические проблемы (ОБЯЗАТЕЛЬНО)](#критические-проблемы-обязательно)
3. [Высокий приоритет](#высокий-приоритет)
4. [Средний приоритет](#средний-приоритет)
5. [Deployment чеклист по компонентам](#deployment-чеклист-по-компонентам)
6. [Пошаговый план деплоя](#пошаговый-план-деплоя)
7. [Rollback процедуры](#rollback-процедуры)

---

## Общий статус

### Компоненты готовности к production

| Компонент | Оценка | Статус | Критичные проблемы |
|-----------|--------|--------|--------------------|
| **Структура проекта** | 95/100 | ✅ Готово | Нет |
| **База данных** | 90/100 | ✅ Готово | Нужно запустить миграции |
| **Переменные окружения** | 60/100 | 🔴 Проблемы | 6 критичных проблем безопасности |
| **Docker/K8s** | 40/100 | 🔴 Не готово | Kubernetes отсутствует, security issues |
| **Безопасность** | 77/100 | ⚠️ Требует работы | 3 критичные уязвимости |
| **API & CORS** | 70/100 | ⚠️ Требует работы | 3 критичные проблемы (IDOR, WebSocket auth) |
| **Мониторинг** | 85/100 | ✅ Готово | Нужны пароли для Grafana |
| **CI/CD** | 72/100 | ⚠️ Требует работы | Hardcoded URLs, нет approval gates |
| **Production конфигурации** | 55/100 | 🔴 Проблемы | 13 критичных проблем |
| **ОБЩАЯ ГОТОВНОСТЬ** | **68/100** | 🔴 **НЕ ГОТОВО** | **25+ критичных проблем** |

---

## Критические проблемы (ОБЯЗАТЕЛЬНО)

Эти проблемы **ДОЛЖНЫ** быть исправлены перед production deployment.

### 1. Безопасность и секреты

#### ❌ 1.1. RLS на Supabase не проверена
**Файл**: Database policies
**Риск**: КРИТИЧЕСКИЙ - если RLS неправильна = полный доступ к БД
**Время на фикс**: 2 часа

**Действия**:
```bash
# Проверить RLS policies на всех таблицах
1. Открыть Supabase Dashboard → Authentication → Policies
2. Проверить каждую таблицу на наличие RLS
3. Тестировать с разными user roles
4. Убедиться что users видят только свои организации
```

#### ❌ 1.2. Fallback secrets в коде
**Файл**: `/services/api/src/plugins/auth.ts:29`
**Код**:
```typescript
const jwtSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev'
```
**Риск**: КРИТИЧЕСКИЙ для production
**Время на фикс**: 10 минут

**Действия**:
```typescript
// ИСПРАВЛЕНИЕ
const jwtSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET
if (!jwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET or NEXTAUTH_SECRET must be set in production')
}
```

#### ❌ 1.3. ALLOWED_ORIGINS не установлены
**Файл**: `/services/api/src/server.ts:114-123`
**Риск**: КРИТИЧЕСКИЙ (CORS уязвимость)
**Время на фикс**: 15 минут

**Действия**:
```typescript
// В production установить точные origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  process.env.FRONTEND_URL || 'https://your-domain.com'
]

fastify.register(cors, {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
})
```

#### ❌ 1.4. ENCRYPTION_KEY - потеря критична
**Риск**: КРИТИЧЕСКИЙ - потеря ключа = невозможно расшифровать CRM токены
**Время на фикс**: 30 минут

**Действия**:
1. Создать ENCRYPTION_KEY (64 hex chars):
   ```bash
   openssl rand -hex 32
   ```
2. Сохранить в secure vault (Railway/Vercel Secrets)
3. Создать backup в secure location
4. Документировать recovery процедуру

#### ❌ 1.5. Логирование паролей
**Файл**: `/auth.ts:55, 62, 96`
**Код**:
```typescript
console.log('User data:', user) // Может содержать пароли!
```
**Риск**: КРИТИЧЕСКИЙ
**Время на фикс**: 30 минут

**Действия**:
```typescript
// УДАЛИТЬ или заменить на:
logger.info('User authenticated', { userId: user.id, email: user.email })
// НЕ логировать весь объект user
```

#### ❌ 1.6. CSRF отключена
**Файл**: `/middleware.ts:29`
**Риск**: ВЫСОКИЙ
**Время на фикс**: 15 минут

**Действия**:
```typescript
// Включить CSRF
const csrfProtection = csrf({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
})
```

### 2. API безопасность

#### ❌ 2.1. WebSocket Authentication Bypass
**Файл**: `/lib/websocket/server.ts:63-87`
**Риск**: КРИТИЧЕСКИЙ - любой может подключиться без auth
**Время на фикс**: 15 минут

**Действия**:
```typescript
// ДОБАВИТЬ auth middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error('Authentication required'))
  }

  try {
    const decoded = await verifyJWT(token)
    socket.data.userId = decoded.userId
    socket.data.organizationId = decoded.organizationId
    next()
  } catch (error) {
    next(new Error('Invalid token'))
  }
})
```

#### ❌ 2.2. IDOR в Chat API
**Файл**: `/app/api/chat/route.ts:270`
**Риск**: КРИТИЧЕСКИЙ - User-B может получить доступ к чужим разговорам
**Время на фикс**: 30 минут

**Действия**:
```typescript
// ДОБАВИТЬ ownership check
const conversation = await db.query.conversations.findFirst({
  where: and(
    eq(conversations.id, conversationId),
    eq(conversations.organizationId, user.organizationId) // ← ДОБАВИТЬ
  )
})

if (!conversation) {
  return new Response('Conversation not found', { status: 404 })
}
```

#### ❌ 2.3. Missing Zod Validation в Admin
**Файл**: `/app/api/admin/jobs/route.ts`
**Риск**: ВЫСОКИЙ
**Время на фикс**: 1 час

**Действия**:
```typescript
// ДОБАВИТЬ runtime validation
const JobQuerySchema = z.object({
  status: z.enum(['completed', 'failed', 'active', 'waiting']).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0)
})

const query = JobQuerySchema.parse(request.query)
```

### 3. Infrastructure

#### ❌ 3.1. Нет Graceful Shutdown в Fastify API
**Файл**: `/services/api/src/server.ts`
**Риск**: ВЫСОКИЙ - активные соединения обрываются при shutdown
**Время на фикс**: 30 минут

**Действия**:
```typescript
// ДОБАВИТЬ в конец файла
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully...`)

  try {
    await fastify.close()
    logger.info('Fastify server closed')
    process.exit(0)
  } catch (err) {
    logger.error('Error during shutdown', err)
    process.exit(1)
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
```

#### ❌ 3.2. Открытые порты в dev/staging
**Файл**: `/docker-compose.dev.yml`, `/docker-compose.staging.yml`
**Риск**: ВЫСОКИЙ - Redis и PostgreSQL доступны с сети
**Время на фикс**: 5 минут

**Действия**:
```yaml
# ИЗМЕНИТЬ
ports:
  - "127.0.0.1:6379:6379"  # ← ДОБАВИТЬ 127.0.0.1:
  - "127.0.0.1:5432:5432"  # ← ДОБАВИТЬ 127.0.0.1:
```

#### ❌ 3.3. Отсутствие resource limits
**Файл**: `/docker-compose.yml`
**Риск**: ВЫСОКИЙ - контейнеры могут занять всю память
**Время на фикс**: 15 минут

**Действия**:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

#### ❌ 3.4. Kubernetes конфигурация отсутствует
**Риск**: КРИТИЧЕСКИЙ если планируется K8s deployment
**Время на фикс**: 1 неделя

**Действия**:
1. Создать базовые K8s манифесты (Deployment, Service, HPA)
2. Настроить ConfigMaps и Secrets
3. Настроить Ingress
4. Добавить resource limits
5. Настроить health checks

### 4. CI/CD

#### ❌ 4.1. Hardcoded URLs в workflows
**Файл**: `.github/workflows/main.yml:282`, `deploy-vercel.yml:55`
**Риск**: СРЕДНИЙ (security + flexibility)
**Время на фикс**: 5 минут

**Действия**:
```yaml
# ИЗМЕНИТЬ
- name: Health Check
  run: |
    curl -f ${{ secrets.DEPLOYMENT_URL }}/api/health
```

#### ❌ 4.2. Нет deployment approval gates
**Риск**: ВЫСОКИЙ - anyone can deploy
**Время на фикс**: 20 минут

**Действия**:
```yaml
# ДОБАВИТЬ в deploy-production job
environment:
  name: production
  url: https://your-app.com
  deployment_branch_policy:
    protected_branches: true
```

#### ❌ 4.3. Security checks non-blocking
**Файл**: `.github/workflows/security.yml`
**Риск**: ВЫСОКИЙ
**Время на фикс**: 5 минут

**Действия**:
```yaml
# ИЗМЕНИТЬ
- name: Security Audit
  run: npm audit --audit-level=high
  continue-on-error: false  # ← ИЗМЕНИТЬ на false
```

### 5. Production конфигурации

#### ❌ 5.1. Hardcoded localhost в next.config.js
**Файл**: `/next.config.js:22`
**Риск**: СРЕДНИЙ
**Время на фикс**: 10 минут

**Действия**:
```javascript
// ИЗМЕНИТЬ
images: {
  domains: [
    ...(process.env.NODE_ENV === 'development' ? ['localhost'] : []),
    'vercel.app',
    'supabase.co'
  ],
}
```

#### ❌ 5.2. Нет timeout для external API calls
**Файл**: `/lib/services/ai/openrouter.client.ts:78`
**Риск**: ВЫСОКИЙ
**Время на фикс**: 15 минут

**Действия**:
```typescript
const response = await fetch(`${this.baseUrl}/chat/completions`, {
  ...config,
  signal: AbortSignal.timeout(30000) // ← ДОБАВИТЬ
})
```

#### ❌ 5.3. console.warn в production
**Файл**: `/middleware.ts:108`
**Риск**: НИЗКИЙ (но best practice)
**Время на фикс**: 10 минут

**Действия**:
```typescript
// ЗАМЕНИТЬ
logger.warn(`[MIDDLEWARE] Forbidden: User...`)
```

---

## Высокий приоритет

Рекомендуется исправить перед production, но не блокирующие.

### 1. Мониторинг и алерты

#### ⚠️ 1.1. Grafana default пароль
**Файл**: `/monitoring/.env.example`
**Действия**:
```bash
GRAFANA_ADMIN_PASSWORD=<strong-random-password>
GRAFANA_SECRET_KEY=<strong-random-key>
```

#### ⚠️ 1.2. SMTP credentials для alerts
**Действия**:
```bash
SMTP_HOST=smtp.gmail.com:587
SMTP_FROM=alerts@yourdomain.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=<app-password>
ALERT_EMAIL_TO=admin@yourdomain.com
```

#### ⚠️ 1.3. Slack webhook
**Действия**:
```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### 2. Database

#### ⚠️ 2.1. Запустить production миграции
**Время**: 10 минут

**Действия**:
```bash
# 1. Backup существующей БД (если есть)
npm run db:backup

# 2. Запустить миграции
NODE_ENV=production node scripts/migrations/migrate.js migrate

# 3. Проверить
npm run db:migrate:status

# 4. Seed initial data
npm run db:seed
```

#### ⚠️ 2.2. Настроить database backups
**Действия**:
1. Настроить Supabase auto-backups (ежедневно)
2. Создать cron job для backup скрипта
3. Тестировать restore процедуру

### 3. Performance

#### ⚠️ 3.1. Добавить compression
**Файл**: `/next.config.js`
**Действия**:
```javascript
module.exports = {
  compress: true,
  // ...
}
```

#### ⚠️ 3.2. Добавить cache control headers
**Действия**:
```javascript
async headers() {
  return [
    {
      source: '/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ]
}
```

#### ⚠️ 3.3. Playwright browser cache
**Файл**: `.github/workflows/e2e-tests.yml`
**Действия**:
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ hashFiles('**/package-lock.json') }}
```

### 4. Error handling

#### ⚠️ 4.1. Создать error pages
**Действия**:
```bash
# Создать
app/error.tsx
app/not-found.tsx
app/global-error.tsx
```

#### ⚠️ 4.2. Implement circuit breaker
**Файл**: Создать `/lib/circuit-breaker.ts`
**Время**: 2 часа

---

## Средний приоритет

Желательно для production, но можно отложить.

### 1. Documentation

- [ ] Создать `.github/CODEOWNERS`
- [ ] Создать deployment runbook
- [ ] Документировать rollback процедуры
- [ ] Создать incident response playbook

### 2. Testing

- [ ] Добавить cross-browser testing
- [ ] Добавить load testing
- [ ] Добавить accessibility testing

### 3. Infrastructure

- [ ] Настроить staging environment
- [ ] Настроить blue-green deployment
- [ ] Добавить canary deployment

---

## Deployment чеклист по компонентам

### Supabase Database

- [x] Создан проект
- [ ] RLS policies проверены и работают
- [ ] Миграции запущены успешно
- [ ] Seed data загружены
- [ ] Backup настроен
- [ ] Connection pooling включен
- [ ] SSL/TLS enforced
- [ ] Performance indexes созданы

### Upstash Redis

- [x] Создан проект
- [ ] REST API URL настроен
- [ ] Token добавлен в secrets
- [ ] Eviction policy установлена
- [ ] Persistence включена
- [ ] Monitoring настроен

### Vercel (Frontend + API Routes)

- [x] Проект создан
- [ ] Environment variables установлены (68 переменных)
- [ ] Build successful
- [ ] Health check проходит
- [ ] Custom domain настроен
- [ ] SSL certificate активен
- [ ] Analytics включен
- [ ] Deployment protection включен

### Railway (Worker Service)

- [x] Проект создан
- [ ] Worker environment variables установлены
- [ ] Dockerfile протестирован
- [ ] Health check endpoint работает
- [ ] Metrics endpoint доступен
- [ ] Auto-deploy настроен
- [ ] Resource limits установлены

### Monitoring Stack

- [ ] Prometheus запущен
- [ ] Grafana admin пароль изменен
- [ ] Dashboards импортированы
- [ ] AlertManager настроен
- [ ] SMTP credentials установлены
- [ ] Slack webhook добавлен
- [ ] Alert rules протестированы

### GitHub CI/CD

- [ ] Secrets добавлены в GitHub
- [ ] Branch protection rules включены
- [ ] Required status checks настроены
- [ ] CODEOWNERS создан
- [ ] Deployment approval gates добавлены
- [ ] Security scanning enabled

---

## Пошаговый план деплоя

### Phase 1: Подготовка (День 1, 6-8 часов)

#### Шаг 1: Исправить критические security проблемы
```bash
# 1. Удалить fallback secrets
vim services/api/src/plugins/auth.ts
# Добавить env validation

# 2. Исправить CORS
vim services/api/src/server.ts
# Настроить allowed origins

# 3. Убрать логирование паролей
vim auth.ts
# Заменить console.log на logger

# 4. Включить CSRF
vim middleware.ts
# Раскомментировать CSRF

# 5. Добавить WebSocket auth
vim lib/websocket/server.ts
# Добавить auth middleware

# 6. Исправить IDOR
vim app/api/chat/route.ts
# Добавить ownership checks
```

#### Шаг 2: Исправить infrastructure проблемы
```bash
# 1. Добавить graceful shutdown
vim services/api/src/server.ts
# Добавить SIGTERM/SIGINT handlers

# 2. Закрыть открытые порты
vim docker-compose.dev.yml
vim docker-compose.staging.yml
# Добавить 127.0.0.1: перед портами

# 3. Добавить resource limits
vim docker-compose.yml
# Добавить deploy.resources

# 4. Добавить timeouts
vim lib/services/ai/openrouter.client.ts
vim lib/services/ai/openai-brain.client.ts
# Добавить AbortSignal.timeout
```

#### Шаг 3: Исправить CI/CD
```bash
# 1. Убрать hardcoded URLs
vim .github/workflows/main.yml
vim .github/workflows/deploy-vercel.yml
# Заменить на secrets

# 2. Добавить approval gates
vim .github/workflows/main.yml
# Добавить environment protection

# 3. Исправить security workflow
vim .github/workflows/security.yml
# continue-on-error: false
```

**Время**: 6-8 часов
**Результат**: Все критические проблемы исправлены

### Phase 2: Настройка инфраструктуры (День 2, 4-6 часов)

#### Шаг 1: Создать Supabase проект
```bash
1. Открыть https://supabase.com/dashboard
2. Создать новый проект
3. Выбрать region (ближайший к пользователям)
4. Записать:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - Database password
```

#### Шаг 2: Запустить миграции
```bash
# Локально, с production credentials
export SUPABASE_URL=https://xxx.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=xxx
export NODE_ENV=production

# Запустить миграции
node scripts/migrations/migrate.js migrate

# Проверить статус
node scripts/migrations/migrate.js status

# Seed initial data
npm run db:seed
```

#### Шаг 3: Создать Upstash Redis
```bash
1. Открыть https://console.upstash.com
2. Создать новый Redis database
3. Выбрать region (same as Supabase)
4. Записать:
   - UPSTASH_REDIS_REST_URL
   - UPSTASH_REDIS_REST_TOKEN
```

#### Шаг 4: Настроить secrets
```bash
# Сгенерировать secrets
NEXTAUTH_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -base64 32)

# Сохранить в secure location
# НЕ КОММИТИТЬ В GIT!
```

**Время**: 4-6 часов
**Результат**: Инфраструктура готова

### Phase 3: Deployment (День 2-3, 4-6 часов)

#### Шаг 1: Настроить Vercel
```bash
# 1. Установить Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Добавить environment variables
# Через Vercel Dashboard → Settings → Environment Variables
# ИЛИ через CLI:
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
# ... (все 68 переменных)

# 5. Deploy
vercel --prod
```

#### Шаг 2: Настроить Railway (Worker)
```bash
# 1. Создать проект на Railway
railway login
railway init

# 2. Добавить environment variables
railway variables set SUPABASE_URL=...
railway variables set REDIS_URL=...
# ... (worker variables)

# 3. Deploy
railway up

# 4. Проверить health
curl https://your-worker.railway.app/health
```

#### Шаг 3: Проверить deployment
```bash
# 1. Health check
curl https://your-app.vercel.app/api/health
curl https://your-worker.railway.app/health

# 2. Database check
curl https://your-app.vercel.app/api/health/db

# 3. Redis check
curl https://your-app.vercel.app/api/health/redis

# 4. Полная проверка
curl https://your-app.vercel.app/api/health/services
```

**Время**: 4-6 часов
**Результат**: Приложение развернуто

### Phase 4: Мониторинг (День 3, 2-4 часа)

#### Шаг 1: Настроить Grafana
```bash
# 1. Запустить monitoring stack
cd monitoring
docker-compose up -d

# 2. Открыть Grafana
open http://localhost:3000

# 3. Изменить admin пароль
# Login: admin/admin → Change password

# 4. Импортировать dashboards
# Grafana → Dashboards → Import
# Выбрать grafana/dashboards/*.json
```

#### Шаг 2: Настроить AlertManager
```bash
# 1. Настроить SMTP
vim monitoring/.env
# Добавить SMTP credentials

# 2. Настроить Slack
# Добавить SLACK_WEBHOOK_URL

# 3. Перезапустить
docker-compose restart alertmanager
```

#### Шаг 3: Настроить Sentry
```bash
# 1. Создать проект на Sentry.io
# 2. Получить DSN
# 3. Добавить в Vercel env vars
vercel env add SENTRY_DSN production
# 4. Redeploy
vercel --prod
```

**Время**: 2-4 часа
**Результат**: Мониторинг настроен

### Phase 5: Финальная проверка (День 3, 2-3 часа)

#### Шаг 1: Smoke tests
```bash
# Запустить E2E тесты против production
BASE_URL=https://your-app.vercel.app npm run test:e2e

# Проверить critical flows:
# - User registration
# - User login
# - Agent creation
# - Chat functionality
# - CRM integration
```

#### Шаг 2: Performance check
```bash
# Lighthouse
npm run lighthouse -- https://your-app.vercel.app

# Load testing
npm run test:load -- https://your-app.vercel.app
```

#### Шаг 3: Security scan
```bash
# OWASP ZAP
npm run security:scan -- https://your-app.vercel.app

# npm audit
npm audit --audit-level=high
```

**Время**: 2-3 часа
**Результат**: Production готов к использованию

---

## Rollback процедуры

### Если deployment failed

#### 1. Vercel rollback
```bash
# Получить список deployments
vercel ls

# Откатиться к предыдущему
vercel rollback <previous-deployment-url>

# ИЛИ через dashboard
# Vercel Dashboard → Deployments → Previous → Promote to Production
```

#### 2. Railway rollback
```bash
# Railway автоматически сохраняет предыдущие deployments
# Railway Dashboard → Deployments → Previous → Rollback
```

#### 3. Database rollback
```bash
# Если миграция сломала БД
# 1. Backup должен быть создан ПЕРЕД миграцией
npm run db:restore -- backups/backup-2025-11-17.sql

# 2. ИЛИ откатить конкретную миграцию
node scripts/migrations/migrate.js down <migration-name>
```

### Если production проблемы

#### 1. Проверить health checks
```bash
curl https://your-app.vercel.app/api/health
# Если не OK → проверить логи
```

#### 2. Проверить логи
```bash
# Vercel logs
vercel logs --follow

# Railway logs
railway logs --follow

# Supabase logs
# Dashboard → Logs
```

#### 3. Проверить metrics
```bash
# Grafana dashboards
# → Worker dashboard
# → Next.js dashboard
# → Fastify dashboard

# Prometheus metrics
curl https://your-app.vercel.app/api/metrics
```

#### 4. Emergency shutdown
```bash
# Если критическая проблема
# 1. Перевести приложение в maintenance mode
# 2. Rollback к предыдущей версии
# 3. Исследовать проблему
# 4. Исправить и redeploy
```

---

## Environment Variables Checklist

### Критичные (ОБЯЗАТЕЛЬНО)

```bash
# Supabase
[ ] SUPABASE_URL=https://xxx.supabase.co
[ ] SUPABASE_ANON_KEY=eyJhbGc...
[ ] SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (SECRET)

# Redis
[ ] UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
[ ] UPSTASH_REDIS_REST_TOKEN=... (SECRET)

# Auth
[ ] NEXTAUTH_URL=https://your-app.vercel.app
[ ] NEXTAUTH_SECRET=... (32+ chars, SECRET)
[ ] ENCRYPTION_KEY=... (64 hex chars, SECRET)
[ ] JWT_SECRET=... (32+ chars, SECRET)

# OpenRouter AI
[ ] OPENROUTER_API_KEY=sk-or-... (SECRET)

# Base URLs
[ ] NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
[ ] BACKEND_API_URL=https://your-api.vercel.app
[ ] FRONTEND_URL=https://your-app.vercel.app

# CORS
[ ] ALLOWED_ORIGINS=https://your-app.vercel.app,https://admin.your-app.com

# Node
[ ] NODE_ENV=production
```

### Опциональные (Рекомендуется)

```bash
# Monitoring
[ ] SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
[ ] SENTRY_ENVIRONMENT=production
[ ] LOG_LEVEL=info

# Email (для alerts)
[ ] SMTP_HOST=smtp.gmail.com:587
[ ] SMTP_USER=your-email@gmail.com
[ ] SMTP_PASS=... (SECRET)
[ ] FROM_EMAIL=noreply@your-app.com

# Stripe (если используется)
[ ] STRIPE_SECRET_KEY=sk_live_... (SECRET)
[ ] STRIPE_WEBHOOK_SECRET=whsec_... (SECRET)

# Kommo CRM (если используется)
[ ] KOMMO_WEBHOOK_SECRET=... (SECRET)
```

**ВАЖНО**:
- Все SECRET переменные должны быть в Vercel/Railway Secrets, НЕ в .env файлах
- Создать backup всех secrets в secure location (1Password, Vault)
- Документировать где какие secrets хранятся

---

## Проверка перед Go-Live

### Финальный чеклист

```bash
# Security
[ ] Все критические security проблемы исправлены
[ ] RLS policies протестированы
[ ] Secrets в secure vault
[ ] CORS правильно настроен
[ ] CSRF включен
[ ] Rate limiting работает

# Infrastructure
[ ] Database миграции запущены
[ ] Backups настроены
[ ] Health checks проходят
[ ] Monitoring работает
[ ] Alerts настроены
[ ] Graceful shutdown работает

# Performance
[ ] Lighthouse score >90
[ ] Compression включен
[ ] Caching настроен
[ ] Resource limits установлены
[ ] Database indexes созданы

# CI/CD
[ ] All tests passing
[ ] Deployment approval gates добавлены
[ ] Rollback процедура протестирована
[ ] Branch protection rules включены

# Documentation
[ ] Deployment guide обновлен
[ ] Runbook создан
[ ] Incident response plan готов
[ ] Team trained on procedures

# Legal & Compliance
[ ] Privacy policy опубликована
[ ] Terms of service опубликованы
[ ] GDPR compliance checked
[ ] Data retention policy установлена
```

---

## Контакты и поддержка

### Критические проблемы
- **DevOps Lead**: [email]
- **Backend Lead**: [email]
- **Security Lead**: [email]

### Incident Response
1. Slack: #production-alerts
2. PagerDuty: [link]
3. Emergency hotline: [phone]

### Документация
- Deployment Guide: `/docs/DEPLOYMENT_GUIDE.md`
- Runbook: `/docs/DEPLOYMENT_RUNBOOK.md`
- Security Audit: `/docs/SECURITY_AUDIT_REPORT.md`

---

**ВАЖНО**: Этот чеклист должен быть пройден ПОЛНОСТЬЮ перед production deployment. Не пропускайте критические шаги.

**Примерное время на полную подготовку**: 48-72 часа (3 дня full-time работы)

**Статус**: 🔴 **НЕ ГОТОВО** - требуется исправить 25+ критичных проблем
