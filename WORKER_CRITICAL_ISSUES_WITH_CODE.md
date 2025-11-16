# Критические проблемы Worker сервиса - Кодовые примеры

---

## 1. 🔴 BUG: Некорректные вызовы updateAssetStatus()

### Местоположение:
`/services/worker/src/tasks/process-asset.ts`

### Проблема:
Функция `updateAssetStatus` определена как:
```typescript
// Строка 103
const updateAssetStatus = async (assetId: string, update: AssetStatusUpdate): Promise<void> => {
  // Принимает: assetId (string) + update (объект)
}
```

Но она вызывается с неправильными параметрами:

#### ❌ НЕПРАВИЛЬНО - Строка 410:
```typescript
await updateAssetStatus(assetId, 'processing')
// Передается: string вместо объекта AssetStatusUpdate
```

#### ❌ НЕПРАВИЛЬНО - Строка 510:
```typescript
await updateAssetStatus(assetId, 'completed', null, chunksWithEmbeddings.length)
// Функция не принимает 4 параметра!
```

#### ❌ НЕПРАВИЛЬНО - Строка 518:
```typescript
await updateAssetStatus(assetId, 'failed', errorMessage)
// Передается: status как string, потом message
```

### ✅ ИСПРАВЛЕННЫЙ КОД:

```typescript
// Все вызовы должны передавать объект AssetStatusUpdate
await updateAssetStatus(assetId, { status: 'processing' })

await updateAssetStatus(assetId, { 
  status: 'completed', 
  chunksCount: chunksWithEmbeddings.length 
})

await updateAssetStatus(assetId, { 
  status: 'failed', 
  error: errorMessage 
})
```

### ПОСЛЕДСТВИЯ:
- Asset статус НЕ обновляется в БД
- Frontend видит stuck статус "обработка"
- Пользователь не знает что произошло
- Невозможно переобработать файл

---

## 2. 🔴 ОТСУТСТВИЕ: Graceful Shutdown

### Текущее состояние:
`/services/worker/src/index.ts` **НЕ ИМЕЕТ** обработки SIGTERM/SIGINT

### ❌ ПРОБЛЕМА:

При масштабировании или обновлении container:
1. Kubernetes отправляет SIGTERM
2. Worker не получает сигнал
3. Docker убивает процесс через 30s (SIGKILL)
4. **Jobs в процессе могут быть потеряны или обработаны дважды**

### ✅ ТРЕБУЕМОЕ РЕШЕНИЕ:

Добавить в конец `index.ts` (перед `logger.info('Worker started successfully')`):

```typescript
// Graceful shutdown handling
const gracefulShutdown = async () => {
  console.log('[worker] Graceful shutdown initiated...')
  
  try {
    // Закрываем worker (больше не берем новые jobs)
    console.log('[worker] Closing worker...')
    await worker.close()
    
    // Даем time для завершения текущих jobs (макс 30 секунд)
    // BullMQ автоматически ждет завершения
    
    // Закрываем Redis подключение
    console.log('[worker] Closing Redis connection...')
    await connection.quit()
    
    console.log('[worker] Graceful shutdown completed')
    process.exit(0)
  } catch (error) {
    console.error('[worker] Error during graceful shutdown:', error)
    process.exit(1)
  }
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

// Дополнительная защита - max shutdown timeout 35 секунд
setTimeout(() => {
  console.error('[worker] Shutdown timeout exceeded, force exiting')
  process.exit(1)
}, 35000)
```

---

## 3. 🔴 MISSING: Dead Letter Queue (DLQ)

### Текущее состояние:
После 5-10 неудачных попыток job просто удаляется из Redis

```typescript
// Строка 170-172 в index.ts
removeOnFail: {
  count: 5000,
  age: 7 * 24 * 3600, // 7 дней
  // После этого - удаляется, БЕЗ УВЕДОМЛЕНИЯ!
}
```

### ❌ ПРОБЛЕМЫ:

- **Критичные операции теряются:**
  - CRM sync - контакты никогда не синхронизируются
  - Message send - письма не отправляются
  - Asset processing - файлы не обрабатываются
  
- **Невозможно отладить** - нет записи о том что произошло
- **Нет алертинга** - администратор не знает о проблеме

### ✅ ТРЕБУЕМОЕ РЕШЕНИЕ:

#### Шаг 1: Создать таблицу для DLQ в Supabase

```sql
CREATE TABLE worker_dlq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name TEXT NOT NULL,
  job_id TEXT NOT NULL,
  job_name TEXT NOT NULL,
  job_data JSONB NOT NULL,
  error_message TEXT,
  error_stack TEXT,
  attempts INTEGER,
  last_failed_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  resolved BOOLEAN DEFAULT FALSE,
  resolution_note TEXT
);

CREATE INDEX idx_worker_dlq_job_name ON worker_dlq(job_name);
CREATE INDEX idx_worker_dlq_resolved ON worker_dlq(resolved);
```

#### Шаг 2: Добавить DLQ handler в index.ts

```typescript
// Добавить перед worker creation
worker.on('failed', async (job, error) => {
  // После последней попытки - отправить в DLQ
  if (job?.attemptsMade === job?.opts?.attempts) {
    try {
      const supabase = getSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
      
      await supabase.from('worker_dlq').insert({
        queue_name: env.JOB_QUEUE_NAME,
        job_id: job.id,
        job_name: job.name,
        job_data: job.data,
        error_message: error?.message,
        error_stack: error?.stack,
        attempts: job.attemptsMade,
      })
      
      logger.error(`Job ${job.id} added to DLQ`, error, {
        jobId: job.id,
        jobName: job.name,
        event: 'job.dlq',
      })
      
      // Отправить алерт в Sentry
      Sentry.captureException(error, {
        tags: {
          dlq: 'true',
          jobType: job.name,
        },
        extra: {
          jobId: job.id,
          attempts: job.attemptsMade,
        },
      })
    } catch (dlqError) {
      logger.error('Failed to add job to DLQ', dlqError)
    }
  }
})
```

---

## 4. 🔴 MISSING: Timeout для Jobs

### Текущее состояние:
Worker создается БЕЗ timeout:

```typescript
// Строка 129-177 в index.ts
const worker = new Worker(
  env.JOB_QUEUE_NAME,
  async (job) => { ... },
  {
    connection,
    concurrency: env.JOB_CONCURRENCY,
    removeOnComplete: { ... },
    removeOnFail: { ... },
    lockDuration: 30000,
    lockRenewTime: 15000,
    // ⬆️ ЧЕМ-ТО НЕ ХВАТАЕТ? Вот это!!
    // timeout НЕ УСТАНОВЛЕН ⬆️
  },
)
```

### ❌ ПРОБЛЕМЫ:

Если job зависнет (например, при ошибке сети):
```typescript
await generateEmbeddings(chunks) // Зависла на fetch request
// 30 сек - worker все еще ждет ответ
// Lock обновляется каждые 15 сек
// Job никогда не выпустит slot!
```

### ✅ ТРЕБУЕМОЕ РЕШЕНИЕ:

```typescript
const worker = new Worker(
  env.JOB_QUEUE_NAME,
  async (job) => { ... },
  {
    connection,
    concurrency: env.JOB_CONCURRENCY,
    removeOnComplete: { ... },
    removeOnFail: { ... },
    lockDuration: 30000,
    lockRenewTime: 15000,
    
    // ✅ ДОБАВИТЬ TIMEOUT
    timeout: 5 * 60 * 1000, // 5 минут для обычных jobs
    
    // Опционально - разные timeout для разных типов jobs
    // (требует обновления handler function)
  },
)

// Альтернатива - timeout в payload при создании job
// Это лучше!
```

---

## 5. 🔴 MISSING: Missing npm dependencies

### Текущее состояние:
В `package.json` отсутствуют зависимости для PDF/DOCX обработки:

```json
{
  "dependencies": {
    // ... другие зависимости
    // pdf-parse - ОТСУТСТВУЕТ!
    // mammoth - ОТСУТСТВУЕТ!
  }
}
```

Но в коде (process-asset.ts, строки 150-176) используются:

```typescript
const pdfParse = (await import('pdf-parse')).default
// ↑ Runtime error если не установлен!

const mammoth = (await import('mammoth')).default
// ↑ Runtime error если не установлен!
```

### ❌ ПРОБЛЕМЫ:

```
Error: Cannot find module 'pdf-parse'
Error: Cannot find module 'mammoth'
```

При попытке обработать PDF или DOCX файл - job ПАДАЕТ.

### ✅ ТРЕБУЕМОЕ РЕШЕНИЕ:

Добавить в `package.json`:

```bash
cd /home/user/gpt-agent-platform/services/worker
npm install pdf-parse mammoth
```

Или обновить package.json вручную:

```json
{
  "dependencies": {
    "@opentelemetry/api": "^1.9.0",
    "@sentry/node": "^8.40.0",
    "@sentry/profiling-node": "^8.40.0",
    "@supabase/supabase-js": "^2.76.1",
    "@upstash/redis": "^1.35.6",
    "bcryptjs": "^3.0.3",
    "bullmq": "^5.12.6",
    "dotenv": "^16.4.5",
    "ioredis": "^5.8.2",
    "mammoth": "^1.6.0",           // ✅ ДОБАВИТЬ
    "node-fetch": "^3.3.2",
    "pdf-parse": "^1.1.1",         // ✅ ДОБАВИТЬ
    "pino": "^9.5.0",
    "pino-pretty": "^11.2.2",
    "prom-client": "^15.1.3",
    "tsx": "^4.15.5",
    "typescript": "^5.4.5",
    "zod": "^4.1.12"
  }
}
```

---

## 6. 🟠 SERIOUS: Config conflicts - JOB_CONCURRENCY

### Текущее состояние:

**В `env.ts` (строка 15):**
```typescript
JOB_CONCURRENCY: z.coerce.number().int().positive().default(25),
// Default = 25 ⬆️
```

**В `railway.json` (строка 23):**
```json
"JOB_CONCURRENCY": "5"
// = 5 ⬆️
```

**В `render.yaml` (строка 23):**
```yaml
JOB_CONCURRENCY: 5
# = 5 ⬆️
```

### ❌ ПРОБЛЕМА:

Разные deployment platformы будут использовать разные значения:
- Railway: JOB_CONCURRENCY = 5
- Render: JOB_CONCURRENCY = 5
- Local development: JOB_CONCURRENCY = 25
- Environment variable: JOB_CONCURRENCY = [что установлено]

Это создает непредсказуемость в production.

### ✅ ТРЕБУЕМОЕ РЕШЕНИЕ:

#### Опция 1: Синхронизировать конфиги
Все должны быть = 25, или выбрать одно значение:

```json
// railway.json
"JOB_CONCURRENCY": "25"
```

```yaml
# render.yaml
JOB_CONCURRENCY: 25
```

#### Опция 2: Удалить default из env.ts
Сделать JOB_CONCURRENCY **обязательной**:

```typescript
JOB_CONCURRENCY: z.coerce.number().int().positive(),
// ⬆️ Без .default() - ОБЯЗАТЕЛЬНА переменная
```

Тогда ВСЕГДА будет явно установлено.

---

## 7. 🟠 SERIOUS: OpenRouter Rate Limiting не используется

### Текущее состояние:

Файл `/services/worker/src/lib/openrouter-rate-limit.ts` **создан**, но **не используется**!

```typescript
// Определен класс
export class OpenRouterRateLimiter { ... }

// Но никто не импортирует и не использует его!
```

В `processAsset` (строка 51):
```typescript
const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
  // Без проверки rate limits!
})
```

В `extractKnowledgeGraph` (строка 97):
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  // Без проверки rate limits!
})
```

### ❌ ПРОБЛЕМЫ:

При 25 concurrent jobs:
- 25 * N embeddings requests в минуту
- Легко превысить лимиты OpenRouter
- API возвращает 429 (Too Many Requests)
- Job падает БЕЗ retry (нет exponential backoff для 429)

### ✅ ТРЕБУЕМОЕ РЕШЕНИЕ:

#### Шаг 1: Инициализировать RateLimiter в index.ts

```typescript
import { OpenRouterRateLimiter } from './lib/openrouter-rate-limit'

const rateLimiter = new OpenRouterRateLimiter(connection, {
  maxRequestsPerMinute: 100,
  maxRequestsPerHour: 5000,
  maxRequestsPerDay: 100000,
})
```

#### Шаг 2: Использовать в processAsset

```typescript
const chunksWithEmbeddings = await generateEmbeddingsForDocument(
  textContent, 
  600, 
  120
)

// ⬇️ Обновить функцию generateEmbeddings
const generateEmbeddings = async (
  input: string | string[],
  organizationId?: string,
  rateLimiter?: OpenRouterRateLimiter,
): Promise<Array<{ embedding: number[]; index: number }>> => {
  // ✅ Проверить rate limit ПЕРЕД запросом
  if (rateLimiter && organizationId) {
    return await rateLimiter.withRateLimit(
      organizationId,
      async () => {
        const response = await fetch('https://openrouter.ai/api/v1/embeddings', { ... })
        return response.json()
      }
    )
  }
  
  // Fallback без rate limiting
  const response = await fetch('https://openrouter.ai/api/v1/embeddings', { ... })
  return response.json()
}
```

---

## 8. 🟠 SERIOUS: console.log вместо logger

### Текущее состояние:

В `process-asset.ts` используются console.log вместо structured logging:

```typescript
// Строка 309
console.log(`[worker] Large file ${assetId} processed with streaming: ...`)

// Строка 434
console.log(`[worker] Processing large file ${assetId} ...`)

// Строка 512
console.log(`[worker] Asset ${assetId} processed successfully: ...`)

// Строка 515
console.error(`[worker] Failed to process asset ${assetId}:`, error)

// Строка 357
console.error(`[worker] Failed to process large file ${assetId} with streaming:`, error)
```

### ❌ ПРОБЛЕМЫ:

- **Несходится с остальным кодом** - остальное использует `logger`
- **Не структурировано** - нет контекста в production JSON логах
- **Нет уровня логирования** - все важно одинаково
- **Невозможно фильтровать** в log aggregation систем (ELK, Datadog)

### ✅ ТРЕБУЕМОЕ РЕШЕНИЕ:

```typescript
import { logger } from '../lib/logger'

// ✅ ВМЕСТО console.log
logger.info(`Large file ${assetId} processed with streaming`, {
  assetId,
  chunksCount: allChunksWithEmbeddings.length,
  event: 'asset.processing.complete',
})

// ✅ ВМЕСТО console.error
logger.error(`Failed to process asset ${assetId}`, error, {
  assetId,
  organizationId,
  event: 'asset.processing.failed',
})
```

---

## СВОДКА КРИТИЧНЫХ ПРОБЛЕМ

| # | Проблема | Тип | Effort | Риск |
|---|----------|------|--------|------|
| 1 | updateAssetStatus bug | BUG | 30min | 🔴 CRITICAL |
| 2 | Нет graceful shutdown | MISSING | 1h | 🔴 CRITICAL |
| 3 | Нет DLQ | MISSING | 2h | 🔴 CRITICAL |
| 4 | Нет timeout | MISSING | 30min | 🔴 CRITICAL |
| 5 | Missing npm deps | MISSING | 5min | 🔴 CRITICAL |
| 6 | Config conflicts | CONFIG | 30min | 🟠 SERIOUS |
| 7 | Unused rate limiter | INTEGRATION | 2h | 🟠 SERIOUS |
| 8 | console.log | CODE STYLE | 1h | 🟠 SERIOUS |

**TOTAL EFFORT: ~8-9 hours**

