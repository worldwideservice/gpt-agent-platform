# 🗺️ ПЛАН РЕАЛИЗАЦИИ - 4 НЕДЕЛИ

**Вариант B**: 110 часов за 4 недели → 85% готовности
**Стратегия**: Последовательное выполнение по неделям

---

## 📅 WEEK 1: SECURITY + DOCS (40h)

### 🔒 Day 1: Rate Limiting (4h)

**Файлы создать:**
```
lib/redis.ts
lib/middleware/rate-limit.ts
lib/middleware/rate-limit-api.ts
lib/middleware/rate-limit.test.ts
```

**Файлы обновить:**
```
app/api/*/route.ts (применить middleware ко всем endpoints)
docker-compose.yml (проверить Redis)
.env.example (добавить REDIS_*)
```

**Ключевые моменты:**
- Redis connection с retry
- Разные лимиты: api (100/min), auth (5/min), webhook (50/min)
- Headers: X-RateLimit-Limit, Remaining, Reset
- Fail open если Redis down

**Проверка:**
```bash
npm test -- rate-limit
# Тест: 101-й запрос должен вернуть 429
```

---

### 📝 Day 2: Structured Logging (6h)

**Файлы создать:**
```
lib/logger/config.ts
lib/logger/index.ts
lib/logger/async-storage.ts
scripts/generate-encryption-key.ts
```

**Файлы обновить:**
```
app/api/**/*.ts (заменить console.log на logger)
middleware.ts (добавить request ID)
instrumentation.ts (validate env)
.gitignore (добавить logs/)
```

**Ключевые моменты:**
- Winston с JSON format для production
- Daily rotate (14 days)
- Request ID tracking (AsyncLocalStorage)
- Sentry integration для errors
- Заменить ВСЕ console.log (найти через grep)

**Проверка:**
```bash
grep -r "console\.log" app/ lib/ services/
# Должно быть пусто
```

---

### 🔐 Day 3: Token Encryption (4h)

**Файлы создать:**
```
lib/crypto/encryption.ts
lib/crypto/encryption.test.ts
scripts/migrate-encrypt-tokens.ts
```

**Файлы обновить:**
```
lib/repositories/integrations.ts (encrypt/decrypt токенов)
.env.example (ENCRYPTION_KEY)
```

**Ключевые моменты:**
- AES-256-GCM encryption
- Generate key: `node -e "console.log(crypto.randomBytes(32).toString('hex'))"`
- Encrypt при save, decrypt при get
- Migration script для существующих токенов

**Проверка:**
```bash
npm run migrate:encrypt-tokens
# Проверить в БД: токены должны быть в формате iv:encrypted:authTag
```

---

### 💬 Day 4: Test Chat - DB + API (6h)

**Миграция создать:**
```sql
supabase/migrations/20250116_test_chat.sql
- test_conversations (id, org_id, agent_id, title)
- test_messages (id, conversation_id, role, content, tokens)
- RLS policies
```

**Файлы создать:**
```
app/api/test-chat/conversations/route.ts
app/api/test-chat/[conversationId]/messages/route.ts
lib/repositories/test-chat.ts
```

**API endpoints:**
```typescript
GET    /api/test-chat/conversations          // Список разговоров
POST   /api/test-chat/conversations          // Создать новый
GET    /api/test-chat/[id]/messages          // История сообщений
POST   /api/test-chat/[id]/messages          // Отправить сообщение
DELETE /api/test-chat/[id]                   // Удалить разговор
```

**Ключевые моменты:**
- Streaming responses (Server-Sent Events)
- Сохранение каждого сообщения в БД
- Token tracking для cost analysis

**Проверка:**
```bash
curl -X POST /api/test-chat/conversations
curl -X POST /api/test-chat/[id]/messages -d '{"content":"test"}'
```

---

### 💬 Day 5: Test Chat - UI (2h)

**Файлы обновить:**
```
components/test-chat/ChatPanel.tsx
components/test-chat/ChatList.tsx
components/test-chat/AgentSelector.tsx
```

**Добавить функции:**
- Agent selection dropdown (загрузка из API)
- Message persistence (сохранение/загрузка из БД)
- Clear conversation button
- Export chat history (JSON/TXT)
- Auto-scroll to bottom

**Проверка:**
- Создать conversation
- Отправить 5 сообщений
- Обновить страницу - история должна остаться

---

### 📚 Days 6-10: Documentation (20h)

**Структура создать:**
```
app/docs/ru/layout.tsx                    // Sidebar + search
components/docs/DocsNav.tsx               // Navigation
components/docs/DocsSearch.tsx            // Search с Cmd+K
lib/docs/search-index.json                // Автогенерация
```

**Контент написать (MDX):**
```
docs/ru/getting-started/
  - introduction.mdx           (2h)
  - quick-start.mdx            (3h)
  - first-agent.mdx            (3h)
  - test-chat.mdx              (2h)

docs/ru/features/
  - ai-agents.mdx              (2h)
  - knowledge-base.mdx         (2h)
  - integrations.mdx           (2h)
  - analytics.mdx              (1h)

docs/ru/integrations/
  - kommo.mdx                  (2h)

docs/ru/help/
  - faq.mdx                    (1h)
```

**Search setup:**
```bash
npm install fuse.js gray-matter
npm run docs:build-index  # Generate search index
```

**Ключевые моменты:**
- Минимум 10 статей
- Code examples с syntax highlighting
- Screenshots (можно placeholders)
- SEO meta tags (title, description)

**Проверка:**
- Открыть /docs/ru
- Cmd+K - поиск должен работать
- Mobile - sidebar должен сворачиваться

---

**РЕЗУЛЬТАТ WEEK 1:**
- ✅ Security: rate limiting, logging, encryption
- ✅ Test Chat: полностью работает
- ✅ Documentation: 10+ статей
- ✅ Score: 68% → 80%

---

## 📅 WEEK 2-3: KNOWLEDGE BASE + UX (70h)

### 📚 Days 11-18: Knowledge Base (50h)

**Day 11-12: File Upload API (16h)**

Миграция:
```sql
supabase/migrations/20250117_knowledge_base.sql
- knowledge_base_files (id, org_id, agent_id, filename, status, storage_url)
- knowledge_base_chunks (id, file_id, content, embedding vector(1536))
- pgvector indexes
```

Файлы создать:
```
app/api/knowledge-base/upload/route.ts
app/api/knowledge-base/files/route.ts
app/api/knowledge-base/[fileId]/route.ts
lib/services/file-parser.ts
lib/services/text-chunker.ts
```

Установить:
```bash
npm install pdf-parse mammoth @vercel/blob
npm install --save-dev @types/pdf-parse
```

Ключевые моменты:
- Upload to Vercel Blob (or S3)
- Support: PDF, DOCX, TXT, MD
- Max 10MB per file
- Parse → chunk (1000 chars, 200 overlap) → queue job

**Day 13-15: Vectorization Worker (16h)**

Файлы создать:
```
services/worker/src/tasks/process-knowledge-base.ts
lib/services/embeddings.ts
```

Процесс:
```
1. Download file from storage
2. Parse content (pdf-parse/mammoth)
3. Chunk text (smart chunking)
4. Generate embeddings batch (OpenAI ada-002)
5. Save to DB with pgvector
6. Update file status → ready
```

Ключевые моменты:
- Batch embeddings (100 chunks/request)
- Retry logic (3 attempts)
- Cost tracking (embeddings API)
- Error handling → status: failed

**Day 16-17: Vector Search API (12h)**

Файлы создать:
```
app/api/knowledge-base/search/route.ts
lib/services/knowledge-base.ts
```

API:
```typescript
POST /api/knowledge-base/search
{
  query: "как вернуть товар?",
  agentId: "uuid",
  limit: 5
}

Response:
{
  results: [
    {
      content: "...",
      filename: "politika-vozvrata.pdf",
      similarity: 0.87
    }
  ]
}
```

Интеграция с AI Agent:
```
app/api/agents/[id]/chat/route.ts
1. Get user message
2. Search knowledge base (top 5)
3. Inject context into system prompt
4. Generate response
5. Return with sources
```

**Day 18: KB UI Components (6h)**

Файлы создать/обновить:
```
app/manage/[tenantId]/knowledge-base/page.tsx
components/knowledge-base/FileUpload.tsx
components/knowledge-base/FileList.tsx
components/knowledge-base/KBSearch.tsx
```

Функции:
- Drag & drop upload
- Multiple files
- Progress bar
- Status badges (uploading, processing, ready, failed)
- Delete files
- Search test interface

**Проверка Knowledge Base:**
```bash
# 1. Upload PDF через UI
# 2. Дождаться processing → ready (2-5 мин)
# 3. Test search: найти контент из PDF
# 4. Test chat с агентом: должен использовать KB
```

---

### 🎨 Days 19-20: UX Improvements (20h)

**Day 19: Loading/Error Pages (4h)**

Файлы создать:
```
app/manage/[tenantId]/loading.tsx
app/manage/[tenantId]/error.tsx
app/manage/[tenantId]/ai-agents/loading.tsx
app/manage/[tenantId]/ai-agents/error.tsx
app/manage/[tenantId]/dashboard/loading.tsx
app/manage/[tenantId]/dashboard/error.tsx
app/manage/[tenantId]/knowledge-base/loading.tsx
app/manage/[tenantId]/knowledge-base/error.tsx
```

Template:
```typescript
// loading.tsx
export default function Loading() {
  return <Spinner size="lg" />
}

// error.tsx
'use client'
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Что-то пошло не так</h2>
      <button onClick={reset}>Попробовать снова</button>
    </div>
  )
}
```

**Days 20-23: A11y Audit & Fixes (16h)**

Установить:
```bash
npm install @axe-core/react eslint-plugin-jsx-a11y
```

Запустить аудиты:
```bash
# Lighthouse на каждой странице
npm run lighthouse

# axe DevTools в браузере
# Target: Accessibility 95+
```

Fixes checklist:
```
□ aria-labels на всех кнопках/ссылках
□ Keyboard navigation (Tab order логичный)
□ Focus indicators видимые
□ Color contrast WCAG AA (4.5:1)
□ Alt text на всех изображениях
□ Form labels и error messages
□ Heading hierarchy (h1 → h2 → h3)
□ Skip to content link
□ Screen reader test (NVDA/VoiceOver)
```

Файлы обновить:
```
components/ui/button.tsx         // aria-label
components/ui/input.tsx          // aria-describedby
components/ui/dialog.tsx         // focus trap
components/forms/*               // labels
app/manage/[tenantId]/layout.tsx // skip link
```

**Проверка:**
- Lighthouse Accessibility: 95+
- Tab navigation работает везде
- Screen reader озвучивает корректно

---

**РЕЗУЛЬТАТ WEEKS 2-3:**
- ✅ Knowledge Base: upload, vectorization, search
- ✅ UX: loading/error pages, A11y fixes
- ✅ Score: 80% → 90%

---

## 📅 WEEK 4: BUFFER & TESTING (остаток часов)

### 🧪 Testing & Bug Fixes (20h)

**Integration Tests:**
```bash
tests/integration/knowledge-base.test.ts
tests/integration/test-chat.test.ts
tests/integration/rate-limit.test.ts
```

**E2E Tests Update:**
```bash
tests/e2e/ai-agents.spec.ts     // Обновить с новыми features
tests/e2e/knowledge-base.spec.ts // Новый
tests/e2e/test-chat.spec.ts     // Обновить
```

**Manual Testing Checklist:**
```
□ Rate limiting работает (101-й запрос = 429)
□ Logging пишет в файлы
□ Токены зашифрованы в БД
□ Test Chat сохраняет историю
□ Documentation search работает
□ Knowledge Base: upload → process → search
□ A11y: Tab navigation + screen reader
□ Mobile responsive все страницы
```

---

### 📦 Production Prep (10h)

**Environment Setup:**
```bash
# Production .env validation
□ ENCRYPTION_KEY установлен
□ REDIS_HOST, REDIS_PASSWORD
□ OPENAI_API_KEY для embeddings
□ SENTRY_DSN для errors
□ LOG_LEVEL=info
```

**Database:**
```bash
# Apply all migrations
npm run db:migrate

# Encrypt existing tokens
npm run migrate:encrypt-tokens

# Verify indexes
npm run db:verify-indexes
```

**Build & Deploy Test:**
```bash
# Local production build
npm run build
npm start

# Test критичные flows:
1. Create agent
2. Upload document
3. Test chat
4. Check logs
5. Check metrics
```

**Documentation Final:**
```bash
# Build search index
npm run docs:build-index

# Verify all links работают
npm run docs:check-links
```

---

## ✅ ФИНАЛЬНЫЙ ЧЕКЛИСТ

### Security (100%)
- [x] Rate limiting на всех endpoints
- [x] Structured logging (Winston)
- [x] Token encryption (AES-256-GCM)
- [x] Request ID tracking
- [x] Error tracking (Sentry)

### Features (90%)
- [x] Test Chat полностью работает
- [x] Knowledge Base (upload + search)
- [x] Documentation (10+ статей)
- [x] All existing features stable

### UX (95%)
- [x] Loading pages везде
- [x] Error pages с recovery
- [x] A11y score 95+
- [x] Mobile responsive
- [x] Search работает

### Testing (85%)
- [x] Unit tests pass
- [x] Integration tests pass
- [x] E2E tests updated
- [x] Manual testing done
- [x] Production build works

### Infrastructure (90%)
- [x] Redis working
- [x] Logs rotating
- [x] Metrics collecting
- [x] Migrations applied
- [x] Backups configured

---

## 📊 МЕТРИКИ УСПЕХА

**Перед запуском:**
- ✅ Score: 90%+
- ✅ KWID Compliance: 85%+
- ✅ Security: 100/100
- ✅ A11y: 95+
- ✅ Test Coverage: 85%+

**После запуска (month 1):**
- 📈 300+ signups
- 📈 30+ DAU
- 📈 60%+ retention (week 1)
- 📉 < 15 support tickets/week
- ⭐ NPS > 35

---

## 🚀 DEPLOYMENT

```bash
# 1. Final checks
npm run test
npm run lint
npm run type-check

# 2. Build
npm run build

# 3. Deploy
git push origin main  # Triggers Vercel deploy

# 4. Migrations
npm run db:migrate -- --production

# 5. Smoke tests
curl https://your-domain.com/api/health
curl https://your-domain.com/docs

# 6. Monitor
# Check Sentry, logs, metrics
```

---

## 📅 TIMELINE SUMMARY

| Week | Hours | Tasks | Score |
|------|-------|-------|-------|
| 1 | 40 | Security + Docs + Test Chat | 68→80% |
| 2-3 | 70 | Knowledge Base + UX | 80→90% |
| 4 | 30 | Testing + Polish | 90→95% |
| **Total** | **140h** | **Complete** | **95%** |

**Launch**: End of Week 4 (Beta) → Week 5 (Public)

---

## 💡 TIPS

**Daily workflow:**
1. Morning: выбрать задачу из плана
2. Work: следовать чеклисту
3. Evening: commit progress, update TODO
4. Test: проверить acceptance criteria

**Если застрял:**
1. Check детальный план (Parts 1-2)
2. Google конкретную проблему
3. ChatGPT для debug
4. Skip и вернуться позже

**Приоритеты:**
- Security НЕЛЬЗЯ пропустить
- Knowledge Base можно упростить (без векторизации)
- Documentation можно минимизировать (5 статей вместо 10)
- A11y можно сделать basic (не 95+, а 85+)

**Удачи! 🚀**
