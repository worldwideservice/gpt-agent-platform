# ⚡ КРИТИЧЕСКИЙ ПЛАН ДЕЙСТВИЙ - QUICK START

> **ВНИМАНИЕ:** Проект НЕ ГОТОВ к production. Деплой сейчас = взлом в течение 1-2 часов.

## 🎯 ЦЕЛЬ: Production-ready за 6-8 недель

---

## 📊 ТЕКУЩИЙ СТАТУС

```
┌─────────────────────────────────────────────────┐
│  ОБЩАЯ ОЦЕНКА: 52/100 - НЕ ГОТОВ К PRODUCTION  │
└─────────────────────────────────────────────────┘

Backend API:     🔴 40/100  ⛔ БЛОКЕР
Worker Service:  🔴 45/100  ⛔ БЛОКЕР
Security:        🔴 35/100  ⛔ БЛОКЕР
Docker/Deploy:   🔴 50/100  ⛔ БЛОКЕР
Frontend:        🟡 75/100  ⚠️  HIGH
Tests:           🟢 70/100  ✅ OK
Documentation:   🟢 80/100  ✅ OK
Performance:     🟡 65/100  ⚠️  MEDIUM
```

---

## 🔥 ТОП-10 КРИТИЧЕСКИХ ПРОБЛЕМ

### 1. ⛔ Backend API - БЕЗ АУТЕНТИФИКАЦИИ
```
Файл: services/api/src/server.ts
Проблема: ВСЕ 19 endpoints полностью открыты!
Риск: ЛЮБОЙ может вызвать ЛЮБОЙ endpoint
Время: 1 день
```

### 2. ⛔ X-ORG-ID Header Spoofing (IDOR)
```
Файл: app/api/crm/webhook/route.ts:113-117
Проблема: orgId берется из headers, контролируется клиентом
Риск: Доступ к чужим данным через перебор
Время: 4 часа
```

### 3. ⛔ Webhook Signature ВСЕГДА TRUE
```
Файл: app/api/crm/webhook/route.ts:127-141
Проблема: verifyWebhookSignature() всегда возвращает true
Риск: Подделка CRM данных, injection атаки
Время: 2 часа
```

### 4. ⛔ Rate Limiting ВЫКЛЮЧЕН
```
Файл: lib/rate-limit.ts:84-86
Проблема: Fallback to in-memory, Redis отключена
Риск: DDoS атаки заблокируют сервис
Время: 3 часа
```

### 5. ⛔ Worker: updateAssetStatus() BAG
```
Файл: services/worker/src/tasks/process-asset.ts:410,510,518
Проблема: Неправильный порядок аргументов (3 места!)
Риск: Assets застревают в "processing" навсегда
Время: 1 час
```

### 6. ⛔ Worker: NO Graceful Shutdown
```
Файл: services/worker/src/index.ts
Проблема: Нет обработки SIGTERM
Риск: Потеря jobs при деплое/рестарте
Время: 2 часа
```

### 7. ⛔ Worker: NO Dead Letter Queue
```
Файл: services/worker/src/index.ts
Проблема: Failed jobs удаляются навсегда
Риск: Потеря критичных операций
Время: 3 часа
```

### 8. ⛔ .env.vercel в Git с SECRETS
```
Файл: .env.vercel
Проблема: Committed в git с SENTRY_DSN, VERCEL_OIDC_TOKEN
Риск: Публичный доступ к production secrets
Время: 1 час (+ rotation)
```

### 9. ⛔ Redis БЕЗ PASSWORD
```
Файл: docker-compose.yml:25-36
Проблема: Redis exposed на :6379 без пароля
Риск: Полный доступ к данным и очередям
Время: 30 минут
```

### 10. ⛔ CORS origin: true
```
Файл: services/api/src/server.ts:111
Проблема: Разрешает запросы с ЛЮБЫХ доменов
Риск: CSRF атаки, data exfiltration
Время: 30 минут
```

**TOTAL TIME: ~2.5 дня непрерывной работы**

---

## 🚀 ФАЗА 1: КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ (10 дней)

> **GOAL:** Минимально безопасная версия для staging

### ДЕНЬ 1-2: Backend Security

**[ ] Task 1.1: JWT Authentication (6h)**
```typescript
// services/api/src/server.ts
import jwt from '@fastify/jwt'

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET
})

fastify.addHook('onRequest', async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' })
  }
})
```

**[ ] Task 1.2: Fix orgId Validation (2h)**
```typescript
// Везде заменить
const orgId = request.headers.get('x-org-id') // ❌

// На
const orgId = request.user.organizationId // ✅
```

**[ ] Task 1.3: Fix Webhook Signature (2h)**
```typescript
// app/api/crm/webhook/route.ts
const expectedSignature = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(payload))
  .digest('hex')

return crypto.timingSafeEqual(
  Buffer.from(signature),
  Buffer.from(expectedSignature)
)
```

### ДЕНЬ 3: Rate Limiting & CORS

**[ ] Task 2.1: Enable Redis Rate Limiting (3h)**
```typescript
// lib/rate-limit.ts
if (!redisClient && process.env.NODE_ENV === 'production') {
  throw new Error('Redis REQUIRED in production!')
}

export const ratelimit = new Ratelimit({
  redis: redisClient!,
  limiter: Ratelimit.slidingWindow(100, '1m'),
  analytics: true
})
```

**[ ] Task 2.2: Fix CORS (1h)**
```typescript
// services/api/src/server.ts
await fastify.register(cors, {
  origin: [
    process.env.FRONTEND_URL,
    'https://yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})
```

**[ ] Task 2.3: Add CSRF Protection (2h)**
```typescript
// app/api/auth/[...nextauth]/route.ts
import csrf from '@fastify/csrf-protection'

await fastify.register(csrf, {
  cookieOpts: { signed: true }
})
```

### ДЕНЬ 4: Worker Critical Fixes

**[ ] Task 3.1: Fix updateAssetStatus() (1h)**
```typescript
// services/worker/src/tasks/process-asset.ts:410
await updateAssetStatus(assetId, { status: 'processing' }, organizationId)

// services/worker/src/tasks/process-asset.ts:510
await updateAssetStatus(assetId, { content, status: 'completed' }, organizationId)

// services/worker/src/tasks/process-asset.ts:518
await updateAssetStatus(assetId, { content, status: 'completed' }, organizationId)
```

**[ ] Task 3.2: Graceful Shutdown (2h)**
```typescript
// services/worker/src/index.ts
const workers = [crmSyncWorker, assetProcessorWorker, knowledgeGraphWorker]

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully...')

  await Promise.all(workers.map(w => w.close()))
  await redisClient.quit()

  process.exit(0)
})
```

**[ ] Task 3.3: Dead Letter Queue (3h)**
```typescript
const deadLetterQueue = new Queue('failed-jobs', { connection })

const worker = new Worker('my-queue', processor, {
  settings: {
    backoffStrategy: exponentialBackoff,
  },
  failed: async (job, err) => {
    await deadLetterQueue.add('failed', {
      originalQueue: job.queueName,
      data: job.data,
      error: err.message,
      failedAt: Date.now()
    })
  }
})
```

### ДЕНЬ 5: Security Hardening

**[ ] Task 4.1: Rotate Exposed Secrets (2h)**
```bash
# 1. Remove from git
git rm .env.vercel
echo ".env.*" >> .gitignore

# 2. Rotate ALL tokens
- Regenerate Sentry DSN
- Regenerate Vercel tokens
- Regenerate API keys
- Update in Vercel dashboard
```

**[ ] Task 4.2: Redis Authentication (1h)**
```yaml
# docker-compose.yml
redis:
  command: redis-server --requirepass ${REDIS_PASSWORD}
  ports:
    - "127.0.0.1:6379:6379"
  environment:
    - REDIS_PASSWORD=${REDIS_PASSWORD}
```

**[ ] Task 4.3: Install Missing Dependencies (30min)**
```bash
cd services/worker
npm install pdf-parse mammoth --save
```

### ДЕНЬ 6-7: Frontend Cleanup

**[ ] Task 5.1: Remove Debug Code (4h)**
```typescript
// Find & replace ALL instances:
console.log     → logger.debug
console.error   → logger.error
console.warn    → logger.warn

// Affected files:
- app/(auth)/login/LoginClient.tsx (15+ calls)
- lib/websocket/server.ts
- components/features/*
```

**[ ] Task 5.2: Replace Native Dialogs (4h)**
```typescript
// Replace confirm() with AlertDialog:
- components/features/agents/AgentSequences.tsx (2x)
- components/features/agents/AgentsTable.tsx (1x)
- components/features/agents/AgentRules.tsx (1x)

// Replace alert() with Toast:
- components/ErrorBoundary.tsx (2x)
```

**[ ] Task 5.3: Fix Hardcoded URLs (2h)**
```typescript
// app/api/admin/jobs/test/route.ts
const WORKER_URL = process.env.WORKER_URL || 'http://localhost:3001'
const response = await fetch(`${WORKER_URL}/health`)
```

### ДЕНЬ 8: Docker & Monitoring

**[ ] Task 6.1: Create Metrics Endpoint (2h)**
```typescript
// app/api/metrics/route.ts
import { register } from 'prom-client'

export async function GET() {
  const metrics = await register.metrics()
  return new Response(metrics, {
    headers: { 'Content-Type': register.contentType }
  })
}
```

**[ ] Task 6.2: Fix Worker Dockerfile (1h)**
```dockerfile
# services/worker/Dockerfile
# Убрать дублирование lib копирования
COPY --from=base /app/lib ./lib
# (удалить строку 39 - дубликат)
```

**[ ] Task 6.3: Configure Alertmanager (3h)**
```yaml
# monitoring/alertmanager/alertmanager.yml
receivers:
  - name: 'email-critical'
    email_configs:
      - to: 'oncall@company.com'
        from: 'alerts@company.com'
        smarthost: smtp.gmail.com:587
        auth_username: '${SMTP_USER}'
        auth_password: '${SMTP_PASS}'
```

### ДЕНЬ 9-10: Testing & Validation

**[ ] Task 7.1: Write Security Tests (4h)**
```typescript
// tests/security/auth.spec.ts
test('API requires authentication', async () => {
  const response = await fetch('/api/agents')
  expect(response.status).toBe(401)
})

test('Cannot access other org data', async () => {
  const response = await fetch('/api/agents?orgId=other-org', {
    headers: { Authorization: `Bearer ${token}` }
  })
  expect(response.status).toBe(403)
})
```

**[ ] Task 7.2: Run Full Test Suite (2h)**
```bash
npm run test:unit
npm run test:components
npm run test:e2e
npm run type-check
npm run lint
```

**[ ] Task 7.3: Security Penetration Test (4h)**
- [ ] Test auth bypass attempts
- [ ] Test IDOR vulnerabilities
- [ ] Test rate limiting
- [ ] Test CSRF protection
- [ ] Test XSS vectors
- [ ] Test SQL injection

**[ ] Task 7.4: Load Testing (2h)**
```bash
# Apache Bench или Artillery
ab -n 10000 -c 100 http://localhost:3000/api/agents

# Should handle:
- 100 concurrent users
- < 500ms p95 response time
- < 1% error rate
```

---

## 📋 CHECKLIST ПЕРЕД STAGING

### Security ✅
- [ ] JWT authentication работает
- [ ] Authorization checks (orgId) работают
- [ ] Rate limiting включен
- [ ] CORS правильно настроен
- [ ] Webhook signature валидируется
- [ ] CSRF protection работает
- [ ] All secrets rotated
- [ ] Redis password установлен
- [ ] No secrets в git

### Backend ✅
- [ ] All API endpoints protected
- [ ] Health checks работают
- [ ] Graceful shutdown работает
- [ ] Error handling правильный
- [ ] Logging настроен
- [ ] Metrics endpoint работает

### Worker ✅
- [ ] updateAssetStatus() исправлен
- [ ] Graceful shutdown работает
- [ ] Dead Letter Queue работает
- [ ] Job timeouts настроены
- [ ] Dependencies установлены
- [ ] Health checks работают

### Frontend ✅
- [ ] No console.log в production
- [ ] No confirm/alert dialogs
- [ ] No hardcoded URLs
- [ ] No 'as any' types
- [ ] Error boundaries работают
- [ ] Loading states везде

### Testing ✅
- [ ] All tests passing
- [ ] Security tests passing
- [ ] Load tests passing
- [ ] E2E tests passing
- [ ] Coverage > 70%

### Monitoring ✅
- [ ] Sentry configured
- [ ] Prometheus metrics работают
- [ ] Grafana dashboards готовы
- [ ] Alerts настроены
- [ ] Logs aggregated

---

## 🎯 ПОСЛЕ ФАЗЫ 1

**Результат:** Минимально безопасная версия

```
Backend API:     🟡 75/100  ✅ Ready for staging
Worker Service:  🟡 75/100  ✅ Ready for staging
Security:        🟡 70/100  ✅ Ready for staging
Docker/Deploy:   🟡 70/100  ✅ Ready for staging
Frontend:        🟢 85/100  ✅ Ready for staging

ОБЩАЯ ОЦЕНКА:    🟡 75/100  ✅ STAGING READY
```

**Следующие шаги:**
1. Deploy на staging
2. 1 неделя тестирования
3. Начать Фазу 2 (High Priority)
4. Production через 4-6 недель

---

## 📞 ПОДДЕРЖКА

**Вопросы?** См. полный отчет:
- `PRODUCTION_READINESS_ANALYSIS.md` - Детальный анализ (100+ страниц)
- `docs/` - Техническая документация

**Найденные проблемы:**
- Backend: `API_CRITICAL_ISSUES.md`
- Worker: `WORKER_CRITICAL_ISSUES_WITH_CODE.md`
- Security: `SECURITY_AUDIT_REPORT.md`
- Docker: `FINDINGS_SUMMARY.txt`

---

**⚡ НАЧНИТЕ С ДНЯ 1 ПРЯМО СЕЙЧАС!**
