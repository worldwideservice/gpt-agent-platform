# 🚀 ПЛАН ДЕЙСТВИЙ ДО ПРОДАКШЕНА (100/100)

**Текущий статус**: 68/100
**Цель**: 100/100 (Production Ready)
**Timeline**: 6 недель (320+ часов)
**Дата создания**: 2025-11-16

---

## 📋 ТЕЗИСНО - ЧТО НУЖНО СДЕЛАТЬ

### 🔴 КРИТИЧНО (Неделя 1)
1. ✅ Внедрить платежную систему Lemon Squeezy
2. ✅ Создать Getting Started документацию
3. ✅ Доделать Test Chat функционал
4. ✅ Добавить Rate Limiting
5. ✅ Внедрить Structured Logging
6. ✅ Зашифровать токены в БД

### 🟡 ВАЖНО (Недели 2-3)
7. ✅ Реализовать Knowledge Base (upload + search)
8. ✅ Добавить Input Sanitization
9. ✅ Внедрить Circuit Breaker
10. ✅ Добавить Cost Tracking
11. ✅ Создать Loading/Error pages
12. ✅ Провести A11y audit

### 🟢 ПОЛИРОВКА (Недели 4-6)
13. ✅ Social интеграции (Instagram, Facebook)
14. ✅ Categories/Articles система
15. ✅ Advanced Analytics
16. ✅ Performance optimization
17. ✅ WAF + Security hardening
18. ✅ Centralized logging
19. ✅ Grafana dashboards
20. ✅ Load testing + optimization

---

## 📅 ДЕТАЛЬНЫЙ ПЛАН ПО НЕДЕЛЯМ

---

## 📅 НЕДЕЛЯ 1: КРИТИЧНЫЕ БЛОКЕРЫ (80 часов)

**Цель**: 68% → 78% (Backend + Core Features)
**Фокус**: Монетизация, Security, Core Features

### День 1-2 (Понедельник-Вторник): Pricing + Payments - 40h

#### 1. Setup Lemon Squeezy (4h)
```bash
□ Создать Lemon Squeezy account
□ Настроить продукты и pricing plans
  - Basic: 5000 responses/month - $99/mo
  - Pro: 15000 responses/month - $249/mo
  - Enterprise: Unlimited - $499/mo
□ Получить API keys (prod + test)
□ Добавить в .env:
  LEMONSQUEEZY_API_KEY=
  LEMONSQUEEZY_STORE_ID=
  LEMONSQUEEZY_WEBHOOK_SECRET=
```

**Файлы для создания:**
- `.env.example` - добавить LS переменные
- `lib/integrations/lemonsqueezy.ts` - SDK wrapper

#### 2. Pricing Calculation Engine (6h)
```typescript
□ Создать lib/services/pricing.ts
  - calculatePrice(responses, period)
  - getDiscountForYearly() // 20% off
  - getTaxRate(country)
  - calculateTotal(plan, period, country)

□ Создать lib/types/pricing.ts
  interface PricingPlan {
    id: string
    name: string
    responses: number
    priceMonthly: number
    priceYearly: number
    features: string[]
  }
```

**Тесты:**
- `tests/unit/services/pricing.test.ts`

#### 3. Payment UI Components (8h)
```bash
□ Создать components/pricing/PricingCalculator.tsx
  - Response quantity selector
  - Monthly/Yearly toggle
  - Live price calculation
  - Discount badge для yearly

□ Создать components/pricing/PricingCards.tsx
  - 3 плана (Basic, Pro, Enterprise)
  - Feature comparison
  - CTA кнопки

□ Создать components/pricing/CurrentPlan.tsx
  - Display current plan
  - Usage stats (responses used/total)
  - Renewal date
  - Upgrade/Downgrade buttons

□ Создать components/pricing/FAQ.tsx
  - Accordion с 10+ вопросами
  - 30-day money back guarantee
```

**Файлы:**
- `components/pricing/PricingCalculator.tsx`
- `components/pricing/PricingCards.tsx`
- `components/pricing/CurrentPlan.tsx`
- `components/pricing/FAQ.tsx`

#### 4. Checkout Flow (12h)
```typescript
□ Создать app/api/checkout/route.ts
  POST /api/checkout
  - Validate plan selection
  - Create Lemon Squeezy checkout session
  - Return checkout URL
  - Save pending subscription to DB

□ Создать app/api/checkout/success/route.ts
  GET /api/checkout/success
  - Verify payment
  - Activate license
  - Send welcome email
  - Redirect to dashboard

□ Создать app/api/checkout/cancel/route.ts
  GET /api/checkout/cancel
  - Log cancellation
  - Return to pricing page

□ Обновить app/manage/[tenantId]/pricing/page.tsx
  - Integrate PricingCalculator
  - Handle checkout button click
  - Redirect to Lemon Squeezy checkout
```

**Database migrations:**
```sql
-- supabase/migrations/20250116_subscriptions.sql
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id),
  lemonsqueezy_subscription_id text UNIQUE,
  plan_id text NOT NULL,
  status text NOT NULL, -- active, cancelled, expired
  responses_limit integer NOT NULL,
  period text NOT NULL, -- monthly, yearly
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

#### 5. Webhook Handler (8h)
```typescript
□ Создать app/api/webhooks/lemonsqueezy/route.ts
  POST /api/webhooks/lemonsqueezy
  - Verify signature
  - Handle events:
    - subscription_created
    - subscription_updated
    - subscription_cancelled
    - subscription_expired
    - payment_succeeded
    - payment_failed

□ Создать lib/services/subscription.ts
  - activateSubscription(data)
  - updateSubscription(data)
  - cancelSubscription(id)
  - handlePaymentFailed(id)

□ Добавить в BullMQ Worker:
  - Queue: subscription-events
  - Process: update licenses, send emails
```

**Тесты:**
- `tests/integration/api/checkout.test.ts`
- `tests/integration/webhooks/lemonsqueezy.test.ts`

#### 6. Testing (4h)
```bash
□ Test checkout flow в test mode
□ Test webhook signature verification
□ Test subscription activation
□ Test upgrade/downgrade logic
□ Test payment failure handling
□ E2E test полного flow
```

**Acceptance Criteria:**
- ✅ User может выбрать план
- ✅ User может перейти к оплате
- ✅ Payment обрабатывается через Lemon Squeezy
- ✅ License активируется автоматически
- ✅ Webhook events обрабатываются правильно
- ✅ User получает email подтверждение

---

### День 3 (Среда): Getting Started Documentation - 20h

#### 1. Documentation Structure (4h)
```bash
□ Создать app/docs/ru/layout.tsx
  - Sidebar navigation
  - Search bar
  - Breadcrumbs
  - Table of contents

□ Создать components/docs/DocsNav.tsx
  - Tree navigation
  - Active page highlight
  - Collapsible sections

□ Создать components/docs/DocsSearch.tsx
  - Search index (Algolia or Fuse.js)
  - Keyboard shortcuts (Cmd+K)
  - Search results preview
```

**Структура:**
```
/docs/ru
  /getting-started
    - introduction.mdx
    - quick-start.mdx
    - first-agent.mdx
    - test-chat.mdx
  /features
    - ai-agents.mdx
    - knowledge-base.mdx
    - integrations.mdx
    - analytics.mdx
  /integrations
    - kommo.mdx
    - instagram.mdx (placeholder)
    - facebook.mdx (placeholder)
  /api
    - authentication.mdx
    - endpoints.mdx
    - webhooks.mdx
  /troubleshooting
    - common-issues.mdx
    - faq.mdx
```

#### 2. Getting Started Content (8h)
```bash
□ docs/ru/getting-started/introduction.mdx
  - Что такое платформа
  - Ключевые возможности
  - Архитектура (диаграмма)
  - Видео overview (placeholder)

□ docs/ru/getting-started/quick-start.mdx
  - Создание аккаунта (скриншоты)
  - Выбор плана и оплата
  - Настройка организации
  - Приглашение команды

□ docs/ru/getting-started/first-agent.mdx
  - Создание первого агента (step-by-step)
  - Настройка GPT модели
  - Добавление промпта
  - Настройка интеграций
  - Публикация агента

□ docs/ru/getting-started/test-chat.mdx
  - Как использовать Test Chat
  - Тестирование ответов
  - Анализ логов
  - Отладка проблем
```

#### 3. Feature Documentation (4h)
```bash
□ docs/ru/features/ai-agents.mdx
  - Типы агентов
  - Настройки (temperature, max tokens)
  - Advanced settings
  - Best practices

□ docs/ru/features/knowledge-base.mdx
  - Загрузка файлов
  - Поддерживаемые форматы
  - Векторизация
  - Search и retrieval

□ docs/ru/features/integrations.mdx
  - Доступные интеграции
  - OAuth процесс
  - Webhook setup
  - Troubleshooting

□ docs/ru/features/analytics.mdx
  - Метрики и дашборды
  - Экспорт данных
  - Reports
```

#### 4. Search Implementation (4h)
```typescript
□ Использовать Fuse.js для client-side search
□ Создать lib/docs/search-index.ts
  - generateSearchIndex()
  - searchDocs(query)
  - rankResults()

□ Keyboard shortcuts (Cmd+K)
□ Search suggestions
□ Recent searches
```

**Acceptance Criteria:**
- ✅ Минимум 10 статей документации
- ✅ Search работает
- ✅ Navigation интуитивная
- ✅ Mobile responsive
- ✅ Code examples с syntax highlighting

---

### День 4-5 (Четверг-Пятница): Critical Backend Fixes - 20h

#### 1. Test Chat Completion (6h)
```typescript
□ Доработать app/api/test-chat/route.ts
  POST /api/test-chat/messages
  - Save message to DB
  - Stream response from OpenRouter
  - Save AI response to DB
  - Return conversation history

□ Создать lib/repositories/test-chat.ts
  - getConversations(organizationId)
  - getMessages(conversationId)
  - createMessage(data)
  - deleteConversation(id)

□ Обновить components/test-chat/ChatPanel.tsx
  - Real-time streaming
  - Message history persistence
  - Agent selection dropdown
  - Clear conversation button

□ Database migration:
  CREATE TABLE test_conversations (
    id uuid PRIMARY KEY,
    organization_id uuid REFERENCES organizations(id),
    agent_id uuid REFERENCES ai_agents(id),
    created_at timestamptz DEFAULT now()
  );

  CREATE TABLE test_messages (
    id uuid PRIMARY KEY,
    conversation_id uuid REFERENCES test_conversations(id),
    role text NOT NULL, -- user, assistant
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
  );
```

**Тесты:**
- `tests/integration/api/test-chat.test.ts`

#### 2. Rate Limiting (4h)
```typescript
□ Создать lib/middleware/rate-limit.ts
  import { Redis } from 'ioredis'

  const rateLimiters = {
    api: { points: 100, duration: 60 }, // 100 req/min
    auth: { points: 5, duration: 60 },  // 5 req/min
    webhook: { points: 50, duration: 60 }
  }

  export async function rateLimit(
    key: string,
    type: keyof typeof rateLimiters
  ): Promise<boolean>

□ Применить ко всем API routes:
  // app/api/*/route.ts
  const allowed = await rateLimit(userId, 'api')
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    )
  }

□ Добавить headers:
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1234567890
```

**Endpoints to protect:**
- `/api/agents/*` - 100/min
- `/api/auth/*` - 5/min
- `/api/integrations/*` - 50/min
- `/api/test-chat/*` - 20/min
- `/api/webhooks/*` - 50/min

#### 3. Structured Logging (6h)
```typescript
□ Установить Winston или Pino
  npm install winston winston-daily-rotate-file

□ Создать lib/logger.ts
  import winston from 'winston'

  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    defaultMeta: {
      service: 'gpt-agent-platform',
      environment: process.env.NODE_ENV
    },
    transports: [
      new winston.transports.Console(),
      new winston.transports.DailyRotateFile({
        filename: 'logs/app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d'
      })
    ]
  })

□ Заменить все console.log на logger
  // Before:
  console.log('User created', userId)

  // After:
  logger.info('User created', {
    userId,
    email: user.email,
    organizationId: user.organizationId,
    timestamp: new Date().toISOString()
  })

□ Добавить Request ID tracking
  // middleware.ts
  export function middleware(request: NextRequest) {
    const requestId = crypto.randomUUID()
    request.headers.set('X-Request-ID', requestId)

    logger.info('Request received', {
      requestId,
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent')
    })
  }

□ Интеграция с Sentry для errors
  logger.error('Database error', {
    error: error.message,
    stack: error.stack,
    requestId
  })
  Sentry.captureException(error)
```

**Log Levels:**
- `error` - Errors и exceptions
- `warn` - Warning situations
- `info` - Important events (user actions)
- `http` - HTTP requests
- `debug` - Debugging information

#### 4. Token Encryption (4h)
```typescript
□ Установить crypto library
  npm install @aws-sdk/client-kms (или использовать native crypto)

□ Создать lib/crypto/encryption.ts
  import crypto from 'crypto'

  const algorithm = 'aes-256-gcm'
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')

  export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(algorithm, key, iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`
  }

  export function decrypt(encrypted: string): string {
    const [ivHex, encryptedHex, authTagHex] = encrypted.split(':')

    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }

□ Обновить lib/repositories/integrations.ts
  // При сохранении токенов
  async function saveKommoTokens(tokens) {
    const encryptedAccess = encrypt(tokens.accessToken)
    const encryptedRefresh = encrypt(tokens.refreshToken)

    await db.integrations.update({
      accessToken: encryptedAccess,
      refreshToken: encryptedRefresh
    })
  }

  // При чтении токенов
  async function getKommoTokens(integrationId) {
    const integration = await db.integrations.findUnique({ id })

    return {
      accessToken: decrypt(integration.accessToken),
      refreshToken: decrypt(integration.refreshToken)
    }
  }

□ Migration для существующих токенов
  // scripts/migrate-encrypt-tokens.ts
  import { encrypt } from '@/lib/crypto/encryption'

  async function migrateTokens() {
    const integrations = await db.integrations.findMany()

    for (const integration of integrations) {
      if (integration.accessToken && !isEncrypted(integration.accessToken)) {
        await db.integrations.update({
          where: { id: integration.id },
          data: {
            accessToken: encrypt(integration.accessToken),
            refreshToken: encrypt(integration.refreshToken)
          }
        })
      }
    }
  }

□ Добавить в .env:
  ENCRYPTION_KEY=<generate 64 hex chars>

□ Generate key:
  node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

**Security Best Practices:**
- ✅ Key rotation strategy
- ✅ Env variable validation on startup
- ✅ Never log decrypted tokens
- ✅ Audit log for token access

---

### Результаты Недели 1:

**Completed:**
- ✅ Pricing + Payments working (Lemon Squeezy)
- ✅ Getting Started documentation (10+ articles)
- ✅ Test Chat fully functional
- ✅ Rate Limiting на всех endpoints
- ✅ Structured Logging с Winston
- ✅ Token Encryption для CRM токенов

**Metrics:**
- Score: 68% → 78% (+10%)
- Revenue ready: ✅
- Security: 95% → 98%
- Production readiness: 70% → 80%

---

## 📅 НЕДЕЛЯ 2-3: ВАЖНЫЕ ДОРАБОТКИ (120 часов)

**Цель**: 78% → 88% (Core Features + Security)
**Фокус**: Knowledge Base, Security, Performance

### День 6-8 (Понедельник-Среда): Knowledge Base - 50h

#### 1. File Upload API (16h)

##### Backend API
```typescript
□ Создать app/api/knowledge-base/upload/route.ts
  POST /api/knowledge-base/upload

  import { put } from '@vercel/blob'
  import { createWorkerJob } from '@/lib/queue'

  - Validate file (size, type)
  - Upload to Vercel Blob / S3
  - Create DB record
  - Queue vectorization job
  - Return upload status

□ Supported formats:
  - PDF (.pdf)
  - Word (.doc, .docx)
  - Text (.txt)
  - Markdown (.md)
  - CSV (.csv)
  - Max size: 10MB per file

□ Database migration:
  CREATE TABLE knowledge_base_files (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid REFERENCES organizations(id),
    agent_id uuid REFERENCES ai_agents(id),
    filename text NOT NULL,
    file_size integer NOT NULL,
    file_type text NOT NULL,
    storage_url text NOT NULL,
    status text NOT NULL, -- uploading, processing, ready, failed
    chunk_count integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    processed_at timestamptz
  );

  CREATE TABLE knowledge_base_chunks (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id uuid REFERENCES knowledge_base_files(id) ON DELETE CASCADE,
    content text NOT NULL,
    embedding vector(1536), -- OpenAI ada-002
    metadata jsonb,
    created_at timestamptz DEFAULT now()
  );

  CREATE INDEX idx_kb_files_org ON knowledge_base_files(organization_id);
  CREATE INDEX idx_kb_files_agent ON knowledge_base_files(agent_id);
  CREATE INDEX idx_kb_chunks_file ON knowledge_base_chunks(file_id);

  -- Vector similarity search index (pgvector)
  CREATE INDEX ON knowledge_base_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

##### File Processing
```typescript
□ Создать lib/services/file-parser.ts
  import pdf from 'pdf-parse'
  import mammoth from 'mammoth'

  export async function parseFile(
    fileUrl: string,
    fileType: string
  ): Promise<string> {
    switch (fileType) {
      case 'application/pdf':
        return await parsePDF(fileUrl)
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await parseDocx(fileUrl)
      case 'text/plain':
      case 'text/markdown':
        return await parseText(fileUrl)
      default:
        throw new Error('Unsupported file type')
    }
  }

  async function parsePDF(url: string): Promise<string> {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    const data = await pdf(buffer)
    return data.text
  }

□ Создать lib/services/text-chunker.ts
  export function chunkText(
    text: string,
    options = {
      maxChunkSize: 1000,
      overlap: 200,
      separator: '\n\n'
    }
  ): string[] {
    // Разбить текст на chunks с overlap
    // Для лучшего контекста при поиске
  }
```

##### Worker Job для Vectorization
```typescript
□ Обновить services/worker/src/tasks/process-knowledge-base.ts
  import { OpenAI } from 'openai'

  export async function processKnowledgeBaseFile(
    job: Job<{ fileId: string }>
  ) {
    const { fileId } = job.data

    // 1. Get file from DB
    const file = await db.knowledgeBaseFiles.findUnique({
      where: { id: fileId }
    })

    // 2. Download file content
    const response = await fetch(file.storageUrl)
    const buffer = await response.arrayBuffer()

    // 3. Parse file
    const text = await parseFile(file.storageUrl, file.fileType)

    // 4. Chunk text
    const chunks = chunkText(text, {
      maxChunkSize: 1000,
      overlap: 200
    })

    // 5. Generate embeddings (batch)
    const openai = new OpenAI()
    const embeddings = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: chunks
    })

    // 6. Save chunks to DB
    for (let i = 0; i < chunks.length; i++) {
      await db.knowledgeBaseChunks.create({
        data: {
          fileId,
          content: chunks[i],
          embedding: embeddings.data[i].embedding,
          metadata: {
            chunkIndex: i,
            totalChunks: chunks.length
          }
        }
      })
    }

    // 7. Update file status
    await db.knowledgeBaseFiles.update({
      where: { id: fileId },
      data: {
        status: 'ready',
        chunkCount: chunks.length,
        processedAt: new Date()
      }
    })

    logger.info('Knowledge base file processed', {
      fileId,
      chunkCount: chunks.length
    })
  }

□ Добавить в BullMQ queues:
  queues.knowledgeBase.add('process-file', { fileId })
```

#### 2. Vector Search API (12h)

```typescript
□ Создать app/api/knowledge-base/search/route.ts
  POST /api/knowledge-base/search

  import { OpenAI } from 'openai'

  export async function POST(request: Request) {
    const { query, agentId, limit = 5 } = await request.json()

    // 1. Generate query embedding
    const openai = new OpenAI()
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query
    })

    // 2. Vector similarity search (pgvector)
    const results = await db.$queryRaw`
      SELECT
        c.id,
        c.content,
        c.metadata,
        f.filename,
        1 - (c.embedding <=> ${embedding.data[0].embedding}::vector) as similarity
      FROM knowledge_base_chunks c
      JOIN knowledge_base_files f ON f.id = c.file_id
      WHERE f.agent_id = ${agentId}
        AND f.status = 'ready'
      ORDER BY c.embedding <=> ${embedding.data[0].embedding}::vector
      LIMIT ${limit}
    `

    return NextResponse.json({ results })
  }

□ Создать lib/services/knowledge-base.ts
  export class KnowledgeBaseService {
    async search(query: string, agentId: string, options?: SearchOptions) {
      // Wrapper для search API
      // Caching результатов
      // Ranking и re-ranking
    }

    async getRelevantContext(
      query: string,
      agentId: string
    ): Promise<string> {
      const results = await this.search(query, agentId, { limit: 5 })

      // Concatenate top results
      return results
        .map(r => `[${r.filename}]\n${r.content}`)
        .join('\n\n---\n\n')
    }
  }
```

#### 3. Knowledge Base UI (12h)

```typescript
□ Создать app/manage/[tenantId]/knowledge-base/page.tsx
  - File upload drag & drop
  - Upload progress
  - File list with status
  - Search interface
  - Delete files

□ Создать components/knowledge-base/FileUpload.tsx
  import { useDropzone } from 'react-dropzone'

  - Drag & drop area
  - File validation
  - Upload progress bar
  - Multiple file upload
  - Error handling

□ Создать components/knowledge-base/FileList.tsx
  - Table с файлами
  - Status badges (processing, ready, failed)
  - Chunk count
  - File size
  - Upload date
  - Delete button

□ Создать components/knowledge-base/KBSearch.tsx
  - Search input
  - Search results
  - Relevance score
  - Highlighted matches
  - Source file links
```

#### 4. Integration с AI Agent (6h)

```typescript
□ Обновить lib/services/openrouter.ts
  export async function generateResponse(
    messages: Message[],
    agent: AIAgent,
    context?: string // Knowledge Base context
  ) {
    const systemPrompt = agent.systemPrompt

    // Добавить KB context в system prompt
    const enrichedPrompt = context
      ? `${systemPrompt}\n\nRelevant Knowledge:\n${context}`
      : systemPrompt

    const completion = await openrouter.chat.completions.create({
      model: agent.model,
      messages: [
        { role: 'system', content: enrichedPrompt },
        ...messages
      ]
    })

    return completion.choices[0].message.content
  }

□ Обновить app/api/agents/[id]/chat/route.ts
  export async function POST(request: Request) {
    const { message, agentId } = await request.json()

    // 1. Search knowledge base
    const kb = new KnowledgeBaseService()
    const context = await kb.getRelevantContext(message, agentId)

    // 2. Generate response with context
    const response = await generateResponse(
      [{ role: 'user', content: message }],
      agent,
      context
    )

    return new Response(stream(response))
  }
```

#### 5. Testing (4h)

```bash
□ Test file upload (PDF, DOCX, TXT)
□ Test chunking strategy
□ Test vectorization job
□ Test search accuracy
□ Test agent responses with KB
□ E2E test full flow
```

**Acceptance Criteria:**
- ✅ User может загружать файлы (PDF, DOCX, TXT, MD)
- ✅ Files автоматически векторизуются
- ✅ Search работает с высокой точностью
- ✅ AI Agents используют KB context
- ✅ UI показывает processing status
- ✅ Error handling для failed uploads

---

### День 9-10 (Четверг-Пятница): Security & Infrastructure - 30h

#### 1. Input Sanitization (16h)

```typescript
□ Установить sanitization libraries
  npm install dompurify validator sanitize-html

□ Создать lib/security/sanitize.ts
  import DOMPurify from 'isomorphic-dompurify'
  import validator from 'validator'

  export function sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      ALLOWED_ATTR: ['href', 'title']
    })
  }

  export function sanitizeInput(input: string): string {
    return validator.escape(input)
  }

  export function validateEmail(email: string): boolean {
    return validator.isEmail(email)
  }

  export function sanitizePrompt(prompt: string): string {
    // Remove potential injection patterns
    let sanitized = prompt

    // Remove system prompt injections
    sanitized = sanitized.replace(/ignore previous instructions/gi, '')
    sanitized = sanitized.replace(/you are now/gi, '')
    sanitized = sanitized.replace(/disregard .* and/gi, '')

    // Limit length
    if (sanitized.length > 10000) {
      sanitized = sanitized.substring(0, 10000)
    }

    return sanitized.trim()
  }

□ Применить ко всем user inputs:
  // Before saving agent prompt
  const sanitizedPrompt = sanitizePrompt(userInput.systemPrompt)

  // Before chat messages
  const sanitizedMessage = sanitizeInput(userMessage)

  // Before saving HTML content
  const sanitizedHTML = sanitizeHTML(richTextContent)

□ Добавить validation layer
  import { z } from 'zod'

  const AgentSchema = z.object({
    name: z.string().min(1).max(100),
    systemPrompt: z.string().min(10).max(10000).transform(sanitizePrompt),
    model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus']),
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().min(100).max(4000)
  })
```

**Protected Inputs:**
- Agent system prompts
- Chat messages
- User profile data
- Organization names
- File names
- Search queries

#### 2. Circuit Breaker для External APIs (8h)

```typescript
□ Установить opossum
  npm install opossum

□ Создать lib/resilience/circuit-breaker.ts
  import CircuitBreaker from 'opossum'

  const breakerOptions = {
    timeout: 5000, // 5s timeout
    errorThresholdPercentage: 50, // Open after 50% errors
    resetTimeout: 30000 // Try again after 30s
  }

  export function createBreaker<T>(
    fn: (...args: any[]) => Promise<T>,
    name: string
  ) {
    const breaker = new CircuitBreaker(fn, breakerOptions)

    breaker.on('open', () => {
      logger.warn('Circuit breaker opened', { service: name })
    })

    breaker.on('halfOpen', () => {
      logger.info('Circuit breaker half-open', { service: name })
    })

    breaker.on('close', () => {
      logger.info('Circuit breaker closed', { service: name })
    })

    return breaker
  }

□ Применить к external API calls:
  // OpenRouter API
  const openrouterBreaker = createBreaker(
    async (messages, model) => {
      return await openrouter.chat.completions.create({ messages, model })
    },
    'openrouter'
  )

  // Kommo API
  const kommoBreaker = createBreaker(
    async (endpoint, data) => {
      return await kommo.api.call(endpoint, data)
    },
    'kommo'
  )

  // OpenAI Embeddings
  const embeddingsBreaker = createBreaker(
    async (input) => {
      return await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input
      })
    },
    'openai-embeddings'
  )

□ Fallback strategies:
  try {
    const result = await openrouterBreaker.fire(messages, model)
    return result
  } catch (error) {
    if (error.message === 'Breaker is open') {
      // Use fallback model or return cached response
      logger.warn('Using fallback due to circuit breaker')
      return await fallbackModel.generate(messages)
    }
    throw error
  }
```

#### 3. Cost Tracking (8h)

```typescript
□ Database migration:
  CREATE TABLE api_usage (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid REFERENCES organizations(id),
    agent_id uuid REFERENCES ai_agents(id),
    service text NOT NULL, -- openrouter, openai, etc
    operation text NOT NULL, -- chat, embedding, etc
    model text,
    input_tokens integer,
    output_tokens integer,
    total_tokens integer,
    estimated_cost decimal(10, 6),
    created_at timestamptz DEFAULT now()
  );

  CREATE INDEX idx_api_usage_org ON api_usage(organization_id);
  CREATE INDEX idx_api_usage_date ON api_usage(created_at);

□ Создать lib/services/cost-tracker.ts
  const MODEL_COSTS = {
    'gpt-4': { input: 0.03, output: 0.06 }, // per 1k tokens
    'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
    'claude-3-opus': { input: 0.015, output: 0.075 },
    'text-embedding-ada-002': { input: 0.0001, output: 0 }
  }

  export async function trackUsage(data: {
    organizationId: string
    agentId?: string
    service: string
    operation: string
    model: string
    inputTokens: number
    outputTokens: number
  }) {
    const costs = MODEL_COSTS[data.model] || { input: 0, output: 0 }

    const estimatedCost =
      (data.inputTokens / 1000) * costs.input +
      (data.outputTokens / 1000) * costs.output

    await db.apiUsage.create({
      data: {
        ...data,
        totalTokens: data.inputTokens + data.outputTokens,
        estimatedCost
      }
    })

    logger.info('API usage tracked', {
      organizationId: data.organizationId,
      model: data.model,
      tokens: data.inputTokens + data.outputTokens,
      cost: estimatedCost
    })
  }

□ Интегрировать в OpenRouter calls:
  export async function generateResponse(messages, agent) {
    const completion = await openrouter.chat.completions.create({
      model: agent.model,
      messages
    })

    // Track usage
    await trackUsage({
      organizationId: agent.organizationId,
      agentId: agent.id,
      service: 'openrouter',
      operation: 'chat',
      model: agent.model,
      inputTokens: completion.usage.prompt_tokens,
      outputTokens: completion.usage.completion_tokens
    })

    return completion
  }

□ Создать app/api/analytics/costs/route.ts
  GET /api/analytics/costs?period=month

  - Aggregate costs by organization
  - Group by service, model
  - Calculate trends
  - Alert on budget overruns

□ Dashboard widget:
  components/dashboard/CostOverview.tsx
  - Monthly spend
  - Cost breakdown (by model)
  - Usage trends chart
  - Budget alerts
```

#### 4. Loading/Error Pages (4h)

```typescript
□ Создать app/manage/[tenantId]/loading.tsx
  export default function Loading() {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
        <p className="ml-4 text-muted-foreground">Loading...</p>
      </div>
    )
  }

□ Создать app/manage/[tenantId]/error.tsx
  'use client'

  export default function Error({
    error,
    reset
  }: {
    error: Error & { digest?: string }
    reset: () => void
  }) {
    useEffect(() => {
      logger.error('Page error', { error: error.message })
    }, [error])

    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground mt-2">{error.message}</p>
        <Button onClick={reset} className="mt-4">
          Try again
        </Button>
      </div>
    )
  }

□ Создать loading/error pages для:
  - app/manage/[tenantId]/ai-agents/loading.tsx
  - app/manage/[tenantId]/ai-agents/error.tsx
  - app/manage/[tenantId]/dashboard/loading.tsx
  - app/manage/[tenantId]/dashboard/error.tsx
  - app/manage/[tenantId]/knowledge-base/loading.tsx
  - app/manage/[tenantId]/knowledge-base/error.tsx
```

---

### День 11 (Понедельник Week 3): A11y Audit & Fixes (16h)

```bash
□ Установить a11y tools
  npm install @axe-core/react eslint-plugin-jsx-a11y

□ Запустить Lighthouse audit
  - Target: Accessibility 90+
  - Fix all critical issues

□ Run axe DevTools на каждой странице
  - Dashboard
  - AI Agents
  - Knowledge Base
  - Settings
  - Test Chat

□ Fixes:
  - Добавить aria-labels ко всем интерактивным элементам
  - Keyboard navigation (Tab order)
  - Focus indicators
  - Color contrast (WCAG AAA)
  - Alt text для всех изображений
  - Screen reader testing
  - Skip to main content link
  - Proper heading hierarchy (h1-h6)

□ Обновить components:
  // Button component
  <Button aria-label="Create new agent">
    <PlusIcon className="h-4 w-4" aria-hidden="true" />
    Create Agent
  </Button>

  // Form inputs
  <Input
    id="agent-name"
    aria-required="true"
    aria-invalid={!!errors.name}
    aria-describedby={errors.name ? 'name-error' : undefined}
  />
  {errors.name && (
    <p id="name-error" role="alert">
      {errors.name.message}
    </p>
  )}

□ Test с screen readers:
  - NVDA (Windows)
  - JAWS (Windows)
  - VoiceOver (Mac/iOS)
```

---

### Результаты Недель 2-3:

**Completed:**
- ✅ Knowledge Base (upload, vectorization, search)
- ✅ Input Sanitization (security)
- ✅ Circuit Breaker (reliability)
- ✅ Cost Tracking (budget control)
- ✅ Loading/Error pages (UX)
- ✅ A11y audit & fixes (accessibility)

**Metrics:**
- Score: 78% → 88% (+10%)
- Security: 98% → 100%
- Accessibility: 70% → 95%
- Reliability: 80% → 95%

---

## 📅 НЕДЕЛЯ 4-6: ПОЛИРОВКА ДО 100% (120+ часов)

**Цель**: 88% → 100% (Full Feature Complete)
**Фокус**: Advanced Features, Performance, Infrastructure

### Неделя 4: Advanced Features (40h)

#### 1. Social Integrations - Instagram (20h)

```typescript
□ Instagram Graph API setup (4h)
  - Create Facebook App
  - Instagram Business Account
  - Get access tokens
  - Setup webhooks

□ OAuth flow (8h)
  app/api/integrations/instagram/oauth/authorize/route.ts
  app/api/integrations/instagram/oauth/callback/route.ts

  - Authorization URL
  - Token exchange
  - Store tokens (encrypted)
  - Refresh token logic

□ Instagram API endpoints (8h)
  POST /api/integrations/instagram/messages/send
  GET /api/integrations/instagram/conversations
  POST /api/integrations/instagram/webhook/events

  - Send messages
  - Receive messages
  - Handle webhooks
  - Auto-reply с AI Agent

□ UI Integration (4h)
  components/integrations/InstagramCard.tsx
  - Connect button
  - Status indicator
  - Settings
  - Disconnect
```

#### 2. Social Integrations - Facebook (20h)

```typescript
□ Facebook Messenger API setup (4h)
□ OAuth flow (8h)
□ Messenger API endpoints (8h)
  - Send/receive messages
  - Webhook handling
  - Auto-reply
□ UI Integration (4h)
```

### Неделя 5: Performance & Infrastructure (40h)

#### 1. Performance Optimization (20h)

```bash
□ Bundle size optimization (8h)
  - Analyze bundle с webpack-bundle-analyzer
  - Dynamic imports для больших components
  - Tree shaking
  - Remove unused dependencies

  Target: < 200KB initial bundle

□ Database query optimization (8h)
  - Add missing indexes
  - Optimize N+1 queries
  - Query result caching
  - Connection pooling

  Target: p95 query time < 50ms

□ Image optimization (4h)
  - Convert to WebP/AVIF
  - Implement CDN (Cloudflare/Vercel)
  - Lazy loading
  - Responsive images

  Target: LCP < 2.5s
```

#### 2. Infrastructure Improvements (20h)

```bash
□ Centralized Logging (8h)
  - Setup DataDog или ELK stack
  - Log aggregation
  - Search and filtering
  - Alerts

□ Grafana Dashboards (8h)
  - Application metrics
  - Database metrics
  - API response times
  - Error rates
  - User activity

□ WAF Implementation (4h)
  - Cloudflare WAF или AWS WAF
  - DDoS protection
  - Bot mitigation
  - Rate limiting rules
```

### Неделя 6: Final Polish (40h)

#### 1. Categories & Articles CMS (12h)

```typescript
□ Database schema
  CREATE TABLE categories (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    slug text UNIQUE,
    description text,
    parent_id uuid REFERENCES categories(id),
    created_at timestamptz DEFAULT now()
  );

  CREATE TABLE articles (
    id uuid PRIMARY KEY,
    category_id uuid REFERENCES categories(id),
    title text NOT NULL,
    slug text UNIQUE,
    content text NOT NULL,
    author_id uuid REFERENCES users(id),
    published_at timestamptz,
    created_at timestamptz DEFAULT now()
  );

□ CRUD API для categories и articles
□ Admin UI для management
□ Public documentation pages
```

#### 2. Advanced Analytics (8h)

```typescript
□ Enhanced dashboard metrics
  - User engagement
  - Conversion funnels
  - Cohort analysis
  - A/B testing results

□ Export functionality
  - CSV export
  - PDF reports
  - Email reports

□ Real-time analytics
  - Active users
  - Live chat sessions
  - API calls per second
```

#### 3. Load Testing & Optimization (12h)

```bash
□ Setup k6 или Artillery
□ Create load test scenarios:
  - 100 concurrent users
  - 1000 req/sec sustained
  - Spike test (10x traffic)
  - Stress test (до failure)

□ Run tests на staging
□ Identify bottlenecks
□ Optimize:
  - Database queries
  - API endpoints
  - Worker jobs
  - Caching strategies

□ Target SLAs:
  - p50 response time: < 100ms
  - p95 response time: < 500ms
  - p99 response time: < 1000ms
  - Error rate: < 0.1%
  - Uptime: 99.9%
```

#### 4. Final Security Hardening (8h)

```bash
□ Penetration testing
  - SQL injection attempts
  - XSS attempts
  - CSRF verification
  - API abuse scenarios

□ Security headers audit
  - CSP tightening
  - HSTS
  - X-Frame-Options
  - X-Content-Type-Options

□ Dependency audit
  npm audit fix
  - Update vulnerable packages
  - Review licenses

□ Secrets rotation
  - Database passwords
  - API keys
  - Encryption keys
  - JWT secrets
```

---

## 🎯 ФИНАЛЬНЫЙ ЧЕК-ЛИСТ ПЕРЕД ЗАПУСКОМ

### Backend & API (100/100)

- [ ] ✅ 110+ API endpoints working
- [ ] ✅ Rate limiting на всех routes
- [ ] ✅ Structured logging (Winston/Pino)
- [ ] ✅ Token encryption
- [ ] ✅ Input sanitization
- [ ] ✅ Circuit breakers
- [ ] ✅ Cost tracking
- [ ] ✅ Error handling
- [ ] ✅ API documentation (Swagger)
- [ ] ✅ Load tested (1000 req/sec)

### Frontend & UI (100/100)

- [ ] ✅ All pages implemented (15+)
- [ ] ✅ Loading states everywhere
- [ ] ✅ Error boundaries
- [ ] ✅ A11y score 95+
- [ ] ✅ Lighthouse score 90+
- [ ] ✅ Bundle size < 200KB
- [ ] ✅ Mobile responsive
- [ ] ✅ Dark mode
- [ ] ✅ Keyboard navigation
- [ ] ✅ Screen reader tested

### Database (100/100)

- [ ] ✅ 40+ tables with proper schema
- [ ] ✅ Foreign keys & constraints
- [ ] ✅ Indexes for performance
- [ ] ✅ RLS policies
- [ ] ✅ Migrations tracked
- [ ] ✅ Backup strategy
- [ ] ✅ Query optimization
- [ ] ✅ Connection pooling

### Security (100/100)

- [ ] ✅ JWT authentication
- [ ] ✅ RBAC authorization
- [ ] ✅ CSRF protection
- [ ] ✅ Rate limiting
- [ ] ✅ Input validation
- [ ] ✅ SQL injection prevention
- [ ] ✅ XSS prevention
- [ ] ✅ Token encryption
- [ ] ✅ Security headers
- [ ] ✅ Penetration tested

### DevOps (100/100)

- [ ] ✅ Docker production-ready
- [ ] ✅ CI/CD fully automated
- [ ] ✅ 7+ GitHub workflows
- [ ] ✅ Monitoring (Prometheus)
- [ ] ✅ Alerting (AlertManager)
- [ ] ✅ Dashboards (Grafana)
- [ ] ✅ Logging (centralized)
- [ ] ✅ WAF enabled
- [ ] ✅ CDN configured
- [ ] ✅ Backup automated

### Testing (100/100)

- [ ] ✅ 350+ test files
- [ ] ✅ 90%+ code coverage
- [ ] ✅ Unit tests
- [ ] ✅ Integration tests
- [ ] ✅ E2E tests
- [ ] ✅ Load tests
- [ ] ✅ Security tests
- [ ] ✅ A11y tests
- [ ] ✅ All tests passing
- [ ] ✅ CI enforcement

### Documentation (100/100)

- [ ] ✅ User documentation (20+ articles)
- [ ] ✅ API documentation
- [ ] ✅ Architecture docs
- [ ] ✅ Deployment guides
- [ ] ✅ Troubleshooting guides
- [ ] ✅ Security guidelines
- [ ] ✅ Contributing guide
- [ ] ✅ Changelog
- [ ] ✅ FAQ
- [ ] ✅ Video tutorials

### KWID Compliance (100/100)

- [ ] ✅ Dashboard (100%)
- [ ] ✅ AI Agents (100%)
- [ ] ✅ Pricing (100%)
- [ ] ✅ Knowledge Base (100%)
- [ ] ✅ Test Chat (100%)
- [ ] ✅ Account Settings (100%)
- [ ] ✅ Integrations (100%)
- [ ] ✅ Documentation (100%)
- [ ] ✅ Social (100%)
- [ ] ✅ All features complete

### Business Requirements (100/100)

- [ ] ✅ Payment processing
- [ ] ✅ Subscription management
- [ ] ✅ License activation
- [ ] ✅ User onboarding
- [ ] ✅ Support system
- [ ] ✅ Analytics tracking
- [ ] ✅ Cost monitoring
- [ ] ✅ Usage limits
- [ ] ✅ Email notifications
- [ ] ✅ Terms & Privacy

---

## 📊 ОЦЕНКА ПРОГРЕССА

| Неделя | Задачи | Часы | Score | Milestone |
|--------|--------|------|-------|-----------|
| **1** | Critical Blockers | 80 | 68→78% | Revenue Ready |
| **2-3** | Core Features | 120 | 78→88% | Feature Complete |
| **4** | Advanced Features | 40 | 88→92% | Full Features |
| **5** | Infrastructure | 40 | 92→96% | Production Grade |
| **6** | Final Polish | 40 | 96→100% | **LAUNCH READY** |

**Total**: 320 hours (8 недель solo, 4 недели team)

---

## ✅ КРИТЕРИИ ГОТОВНОСТИ К ЗАПУСКУ

### Must Have (Blocking)
- ✅ All payments working
- ✅ All core features complete (KWID 95%+)
- ✅ Security score 100/100
- ✅ No critical bugs
- ✅ Performance targets met
- ✅ Documentation complete
- ✅ Monitoring/Alerting live
- ✅ Backup/Recovery tested

### Should Have (Important)
- ✅ A11y score 95+
- ✅ Load tested
- ✅ Mobile optimized
- ✅ Email templates
- ✅ Support system
- ✅ Analytics tracking
- ✅ Cost monitoring
- ✅ User feedback system

### Nice to Have (Post-launch)
- ⚠️ Video tutorials
- ⚠️ Multi-language support
- ⚠️ Mobile apps
- ⚠️ Advanced analytics
- ⚠️ White-label options

---

## 🚀 LAUNCH STRATEGY

### Soft Launch (Week 7)
```
□ Beta с 10-20 users
□ Собрать feedback
□ Fix критичные issues
□ Optimize на основе данных
Duration: 1 week
```

### Public Launch (Week 8)
```
□ Press release
□ Product Hunt launch
□ Social media campaign
□ Email marketing
□ Paid ads (опционально)
```

---

**Статус**: План утвержден ✅
**Начало**: 2025-11-16
**Запуск**: ~2025-01-20 (8 недель)

**Удачи! 🚀**
