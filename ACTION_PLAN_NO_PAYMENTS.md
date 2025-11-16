# 🚀 ПЛАН ДЕЙСТВИЙ БЕЗ МОНЕТИЗАЦИИ

**Стратегия**: Сначала 100% функционал, потом платежи
**Текущий статус**: 68/100
**Цель**: 95/100 (без платежей)
**Timeline**: 5 недель (280 часов)

---

## 📋 ПРИОРИТЕТЫ БЕЗ ПЛАТЕЖЕЙ

### 🔴 НЕДЕЛЯ 1: КРИТИЧНЫЕ ФИКСЫ (40 часов)

**Цель**: 68% → 80% (Security + Documentation + Core)

#### 1. Getting Started Documentation - 20h ⚠️ КРИТИЧНО
```bash
День 1-2 (Понедельник-Вторник): 20 часов

□ Создать структуру docs (4h)
  app/docs/ru/layout.tsx
  components/docs/DocsNav.tsx
  components/docs/DocsSearch.tsx

□ Написать Getting Started (8h)
  docs/ru/getting-started/introduction.mdx
  docs/ru/getting-started/quick-start.mdx
  docs/ru/getting-started/first-agent.mdx
  docs/ru/getting-started/test-chat.mdx

□ Feature documentation (4h)
  docs/ru/features/ai-agents.mdx
  docs/ru/features/knowledge-base.mdx
  docs/ru/features/integrations.mdx

□ Search implementation (4h)
  - Fuse.js для client-side search
  - Keyboard shortcuts (Cmd+K)
```

**Acceptance Criteria:**
- ✅ Минимум 10 статей
- ✅ Search работает
- ✅ Mobile responsive
- ✅ Code highlighting

#### 2. Security Hardening - 14h ⚠️ КРИТИЧНО

##### Rate Limiting (4h)
```typescript
□ Создать lib/middleware/rate-limit.ts
  - Redis-based rate limiting
  - 100 req/min для API
  - 5 req/min для auth
  - 50 req/min для webhooks

□ Применить ко всем endpoints:
  /api/agents/* - 100/min
  /api/auth/* - 5/min
  /api/integrations/* - 50/min
  /api/test-chat/* - 20/min

□ Response headers:
  X-RateLimit-Limit
  X-RateLimit-Remaining
  X-RateLimit-Reset
```

##### Structured Logging (6h)
```typescript
□ Установить Winston
  npm install winston winston-daily-rotate-file

□ Создать lib/logger.ts
  - JSON format
  - Log levels (error, warn, info, http, debug)
  - Daily rotation (14 days retention)
  - Request ID tracking

□ Заменить все console.log на logger
  - logger.info('User created', { userId, email })
  - logger.error('API error', { error, requestId })

□ Интеграция с Sentry
  - Auto-capture errors
  - Breadcrumbs
```

##### Token Encryption (4h)
```typescript
□ Создать lib/crypto/encryption.ts
  - AES-256-GCM encryption
  - Environment-based keys

□ Зашифровать CRM tokens
  - lib/repositories/integrations.ts
  - Encrypt на save
  - Decrypt на read

□ Migration существующих токенов
  scripts/migrate-encrypt-tokens.ts

□ .env variable:
  ENCRYPTION_KEY=<64 hex chars>
```

#### 3. Test Chat Completion - 6h

```typescript
□ Доработать persistence (3h)
  - Database tables: test_conversations, test_messages
  - Save/load conversation history

□ Real-time streaming (2h)
  - Stream AI responses
  - Show typing indicator

□ UI improvements (1h)
  - Agent selection dropdown
  - Clear conversation button
  - Export chat history
```

**Результат Недели 1:**
- Score: 68% → 80% (+12%)
- Security: 95% → 100%
- Documentation: 0% → 80%
- User onboarding: Ready ✅

---

### 🟡 НЕДЕЛЯ 2-3: CORE FEATURES (120 часов)

**Цель**: 80% → 90% (Knowledge Base + UX + Security)

#### 4. Knowledge Base - 50h ⚠️ CORE FEATURE

##### File Upload & Storage (16h)
```typescript
□ API endpoint (4h)
  POST /api/knowledge-base/upload
  - File validation (PDF, DOCX, TXT, MD)
  - Max 10MB per file
  - Upload to Vercel Blob / S3

□ Database schema (2h)
  CREATE TABLE knowledge_base_files (
    id uuid PRIMARY KEY,
    organization_id uuid,
    agent_id uuid,
    filename text,
    file_size integer,
    file_type text,
    storage_url text,
    status text, -- uploading, processing, ready, failed
    chunk_count integer,
    created_at timestamptz
  );

  CREATE TABLE knowledge_base_chunks (
    id uuid PRIMARY KEY,
    file_id uuid,
    content text,
    embedding vector(1536),
    metadata jsonb,
    created_at timestamptz
  );

□ File parsing (6h)
  lib/services/file-parser.ts
  - parsePDF() using pdf-parse
  - parseDocx() using mammoth
  - parseText()

□ Text chunking (4h)
  lib/services/text-chunker.ts
  - Smart chunking (1000 chars, 200 overlap)
  - Preserve context
```

##### Vectorization Worker (16h)
```typescript
□ Worker job (8h)
  services/worker/src/tasks/process-knowledge-base.ts

  1. Download file from storage
  2. Parse file content
  3. Chunk text
  4. Generate embeddings (OpenAI ada-002)
  5. Save chunks to DB
  6. Update file status

□ Queue setup (2h)
  - BullMQ queue: knowledge-base
  - Retry logic (3 attempts)
  - Error handling

□ Cost optimization (6h)
  - Batch embeddings (100 chunks/request)
  - Cache common chunks
  - Estimate costs before processing
```

##### Vector Search (12h)
```typescript
□ Search API (6h)
  POST /api/knowledge-base/search

  - Generate query embedding
  - pgvector similarity search
  - Return top 5 results
  - Include source metadata

□ Integration с AI Agent (4h)
  - Auto-retrieve context для каждого query
  - Inject в system prompt
  - Source citations в responses

□ Search optimization (2h)
  - Index optimization
  - Query caching
  - Result ranking
```

##### UI Components (12h)
```typescript
□ File Upload (4h)
  components/knowledge-base/FileUpload.tsx
  - Drag & drop
  - Multiple files
  - Upload progress
  - Error handling

□ File List (4h)
  components/knowledge-base/FileList.tsx
  - Table with files
  - Status badges
  - Delete action
  - Filter/search

□ Search Interface (4h)
  components/knowledge-base/KBSearch.tsx
  - Search input
  - Results display
  - Relevance scores
  - Source links
```

#### 5. Input Sanitization - 16h

```typescript
□ Install libraries (1h)
  npm install dompurify validator sanitize-html

□ Sanitization helpers (6h)
  lib/security/sanitize.ts

  - sanitizeHTML() для rich text
  - sanitizeInput() для plain text
  - sanitizePrompt() против prompt injection
  - validateEmail(), validateURL()

□ Apply to all inputs (6h)
  - Agent prompts
  - Chat messages
  - User profile data
  - Organization names
  - File names
  - Search queries

□ Validation schemas (3h)
  - Zod schemas для всех forms
  - Server-side validation
  - Client-side validation
```

#### 6. Circuit Breaker - 8h

```typescript
□ Install opossum (1h)
  npm install opossum

□ Breaker implementation (4h)
  lib/resilience/circuit-breaker.ts

  - createBreaker() factory
  - Timeout: 5s
  - Error threshold: 50%
  - Reset timeout: 30s

□ Apply to external APIs (3h)
  - OpenRouter breaker
  - Kommo breaker
  - OpenAI embeddings breaker
  - Fallback strategies
```

#### 7. Cost Tracking - 8h

```typescript
□ Database schema (2h)
  CREATE TABLE api_usage (
    id uuid PRIMARY KEY,
    organization_id uuid,
    agent_id uuid,
    service text,
    operation text,
    model text,
    input_tokens integer,
    output_tokens integer,
    estimated_cost decimal(10, 6),
    created_at timestamptz
  );

□ Cost tracker service (4h)
  lib/services/cost-tracker.ts

  - MODEL_COSTS mapping
  - trackUsage() function
  - Integrate с OpenRouter/OpenAI calls

□ Analytics API (2h)
  GET /api/analytics/costs

  - Aggregate by org/agent
  - Monthly/weekly breakdown
  - Budget alerts
```

#### 8. UX Improvements - 20h

##### Loading/Error Pages (4h)
```typescript
□ Create loading.tsx для всех routes (2h)
  app/manage/[tenantId]/loading.tsx
  app/manage/[tenantId]/ai-agents/loading.tsx
  app/manage/[tenantId]/dashboard/loading.tsx
  app/manage/[tenantId]/knowledge-base/loading.tsx

□ Create error.tsx для всех routes (2h)
  app/manage/[tenantId]/error.tsx
  app/manage/[tenantId]/ai-agents/error.tsx
  - Error logging
  - Reset button
  - User-friendly messages
```

##### A11y Audit & Fixes (16h)
```bash
□ Install tools (1h)
  npm install @axe-core/react eslint-plugin-jsx-a11y

□ Run audits (3h)
  - Lighthouse на всех страницах
  - axe DevTools
  - WAVE browser extension

□ Fixes (10h)
  - aria-labels на всех interactive elements
  - Keyboard navigation (Tab order)
  - Focus indicators (visible focus states)
  - Color contrast (WCAG AA minimum)
  - Alt text для изображений
  - Proper heading hierarchy
  - Skip to main content link
  - Form labels и error messages

□ Screen reader testing (2h)
  - NVDA (Windows)
  - VoiceOver (Mac)
  - Test critical flows
```

**Результат Недель 2-3:**
- Score: 80% → 90% (+10%)
- KWID Compliance: 64% → 85%
- Core features complete: ✅
- A11y: 70% → 95%

---

### 🟢 НЕДЕЛИ 4-5: ADVANCED FEATURES (120 часов)

**Цель**: 90% → 95% (Full Features + Performance)

#### 9. Social Integrations - 40h

##### Instagram (20h)
```typescript
□ Setup (4h)
  - Facebook App creation
  - Instagram Business Account
  - Graph API access

□ OAuth flow (8h)
  app/api/integrations/instagram/oauth/authorize/route.ts
  app/api/integrations/instagram/oauth/callback/route.ts

□ Message handling (6h)
  POST /api/integrations/instagram/messages/send
  GET /api/integrations/instagram/conversations
  POST /api/integrations/instagram/webhook/events

□ UI (2h)
  components/integrations/InstagramCard.tsx
```

##### Facebook Messenger (20h)
- Аналогично Instagram
- Messenger Platform API
- Send/receive messages
- Auto-reply с AI

#### 10. Performance Optimization - 30h

##### Bundle Optimization (10h)
```bash
□ Analyze bundle (2h)
  npm install @next/bundle-analyzer
  - Identify large dependencies
  - Find unused code

□ Code splitting (4h)
  - Dynamic imports для heavy components
  - Route-based splitting
  - Lazy loading

□ Tree shaking (2h)
  - Remove unused exports
  - Optimize imports
  - Target: < 200KB initial bundle

□ CDN setup (2h)
  - Cloudflare или Vercel CDN
  - Asset optimization
  - Cache headers
```

##### Database Optimization (10h)
```sql
□ Add missing indexes (4h)
  - Query analysis (slow query log)
  - Index creation
  - Composite indexes

□ Query optimization (4h)
  - Fix N+1 queries
  - Use select specific fields
  - Optimize joins

□ Connection pooling (2h)
  - Supabase pooler
  - Connection limits
  - Target: p95 < 50ms
```

##### Image Optimization (4h)
```bash
□ Convert to modern formats (2h)
  - WebP/AVIF
  - Responsive images
  - srcset implementation

□ Lazy loading (1h)
  - Intersection Observer
  - Blur placeholder

□ CDN delivery (1h)
  - Image CDN (Cloudinary/Vercel)
  - Auto-optimization
```

##### Core Web Vitals (6h)
```bash
□ Measure baseline (1h)
  - Lighthouse CI
  - Real user monitoring

□ Optimize LCP (2h)
  - Preload critical resources
  - Optimize images
  - Server-side rendering

□ Optimize FID (1h)
  - Code splitting
  - Defer non-critical JS

□ Optimize CLS (2h)
  - Size reservations
  - Font loading strategy
  - No layout shifts

Target:
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
```

#### 11. Infrastructure - 30h

##### Centralized Logging (10h)
```bash
□ Choose solution (1h)
  Option A: DataDog (платный, easy)
  Option B: ELK Stack (бесплатный, сложнее)
  Option C: Loki + Grafana (средний вариант)

□ Setup (4h)
  - Install agents
  - Configure shipping
  - Create indexes/streams

□ Dashboards (3h)
  - Application logs
  - Error tracking
  - Search & filtering

□ Alerts (2h)
  - Error rate alerts
  - Performance alerts
  - Custom alerts
```

##### Grafana Dashboards (10h)
```bash
□ Application metrics (4h)
  - Request rate
  - Response times (p50, p95, p99)
  - Error rate
  - Active users

□ Database metrics (3h)
  - Query performance
  - Connection pool
  - Slow queries
  - Table sizes

□ Infrastructure metrics (3h)
  - CPU/Memory usage
  - Disk I/O
  - Network traffic
  - Container health
```

##### WAF Setup (4h)
```bash
□ Cloudflare WAF (2h)
  - Enable WAF rules
  - DDoS protection
  - Bot mitigation

□ Custom rules (2h)
  - Rate limiting rules
  - Geo-blocking (optional)
  - Challenge on suspicious activity
```

##### Monitoring & Alerting (6h)
```bash
□ Uptime monitoring (2h)
  - UptimeRobot или Pingdom
  - Health check endpoints
  - Status page

□ Alert rules (2h)
  - Error rate > 1%
  - Response time p95 > 1s
  - Disk usage > 80%
  - Failed jobs > 10

□ On-call setup (2h)
  - PagerDuty integration
  - Escalation policies
  - Incident response playbook
```

#### 12. Categories & Articles CMS - 20h

```typescript
□ Database schema (4h)
  CREATE TABLE categories (
    id uuid PRIMARY KEY,
    name text,
    slug text UNIQUE,
    description text,
    parent_id uuid,
    order_index integer
  );

  CREATE TABLE articles (
    id uuid PRIMARY KEY,
    category_id uuid,
    title text,
    slug text UNIQUE,
    content text,
    author_id uuid,
    published_at timestamptz,
    status text
  );

□ CRUD API (8h)
  /api/admin/categories
  /api/admin/articles
  - Create, read, update, delete
  - Rich text editor support

□ Admin UI (6h)
  app/admin/categories/page.tsx
  app/admin/articles/page.tsx
  - Category tree view
  - Article editor (TipTap or similar)
  - Preview mode

□ Public pages (2h)
  app/docs/[category]/[article]/page.tsx
  - SEO optimization
  - Related articles
  - Table of contents
```

**Результат Недель 4-5:**
- Score: 90% → 95% (+5%)
- Performance: 70% → 95%
- Infrastructure: 80% → 98%
- Full feature set: ✅

---

## 📊 TIMELINE БЕЗ ПЛАТЕЖЕЙ

| Неделя | Часы | Задачи | Score | Status |
|--------|------|--------|-------|--------|
| **1** | 40 | Docs + Security + Test Chat | 68→80% | Critical |
| **2-3** | 120 | Knowledge Base + A11y + Security | 80→90% | Core |
| **4-5** | 120 | Social + Performance + Infra | 90→95% | Polish |
| **TOTAL** | **280h** | **5 недель full-time** | **95%** | **Ready** |

**Solo**: 7 недель (40h/week)
**Team (2)**: 3.5 недели
**Team (4)**: 2 недели

---

## ✅ PRODUCTION CHECKLIST (БЕЗ ПЛАТЕЖЕЙ)

### Backend & API (95/100)
- [x] 99+ API endpoints
- [ ] Rate limiting ⬅️ Week 1
- [ ] Structured logging ⬅️ Week 1
- [ ] Token encryption ⬅️ Week 1
- [ ] Input sanitization ⬅️ Week 2
- [ ] Circuit breakers ⬅️ Week 2
- [ ] Cost tracking ⬅️ Week 2
- [x] Error handling
- [x] JWT auth
- [x] RLS policies

### Frontend & UI (95/100)
- [x] All core pages
- [ ] Loading states ⬅️ Week 2
- [ ] Error pages ⬅️ Week 2
- [ ] A11y 95+ ⬅️ Week 2
- [x] Mobile responsive
- [x] Dark mode
- [ ] Lighthouse 90+ ⬅️ Week 4
- [x] Keyboard navigation

### Features (95/100)
- [x] Dashboard (85%)
- [x] AI Agents (80%)
- [ ] Knowledge Base ⬅️ Week 2-3 (50%→100%)
- [ ] Test Chat ⬅️ Week 1 (60%→100%)
- [x] Account Settings (70%)
- [ ] Documentation ⬅️ Week 1 (0%→80%)
- [x] Integrations - Kommo (65%)
- [ ] Social - Instagram ⬅️ Week 4 (0%→100%)
- [ ] Social - Facebook ⬅️ Week 4 (0%→100%)

### Infrastructure (98/100)
- [x] Docker production
- [x] CI/CD (7 workflows)
- [x] Prometheus metrics
- [ ] Grafana dashboards ⬅️ Week 4
- [ ] Centralized logging ⬅️ Week 4
- [ ] WAF ⬅️ Week 4
- [x] Health checks
- [x] Backup strategy

### Performance (95/100)
- [ ] Bundle < 200KB ⬅️ Week 4
- [ ] LCP < 2.5s ⬅️ Week 4
- [ ] FID < 100ms ⬅️ Week 4
- [ ] CLS < 0.1 ⬅️ Week 4
- [x] Image optimization
- [x] Code splitting
- [ ] DB query optimization ⬅️ Week 4

---

## 🎯 МЕТРИКИ УСПЕХА (БЕЗ МОНЕТИЗАЦИИ)

### Technical Metrics
- ✅ KWID Compliance: 85%+
- ✅ Security Score: 100/100
- ✅ Test Coverage: 85%+
- ✅ Lighthouse: 90+
- ✅ Response time p95: < 500ms
- ✅ Error rate: < 0.1%
- ✅ Uptime: 99.5%+

### User Metrics (после запуска)
- 📈 User signups
- 📈 DAU/MAU ratio
- 📈 Feature adoption
- 📈 Session duration
- 📉 Bounce rate
- 📉 Support tickets
- ⭐ NPS score

---

## 🚀 СТРАТЕГИЯ ЗАПУСКА (БЕЗ ПЛАТЕЖЕЙ)

### Beta Launch (Неделя 6)
```
□ Invite 20-50 beta users
□ Free access для всех
□ Собрать feedback
□ Fix critical bugs
□ Measure usage patterns
Duration: 1-2 weeks
```

### Public Launch (Неделя 7-8)
```
□ Product Hunt launch
□ Social media campaign
□ Content marketing
□ Community building
□ Influencer outreach

KPIs:
- 500+ signups в первый месяц
- 50+ DAU
- 70%+ retention (week 1)
```

### Add Monetization (Later)
```
После стабилизации:
□ Implement Stripe/Paddle
□ Design pricing tiers
□ Payment UI
□ Billing logic
□ Subscription management

Timeline: 2-3 недели (40h)
```

---

## 📋 WEEK-BY-WEEK PLAN

### 📅 WEEK 1: Foundations (40h)

**Monday-Tuesday**: Documentation (20h)
- [ ] Setup docs structure
- [ ] Write Getting Started (10 articles)
- [ ] Implement search
- [ ] Test на mobile

**Wednesday**: Security (14h)
- [ ] Rate limiting implementation
- [ ] Structured logging (Winston)
- [ ] Token encryption
- [ ] Test all security features

**Thursday-Friday**: Test Chat (6h)
- [ ] Database persistence
- [ ] Real-time streaming
- [ ] UI improvements
- [ ] E2E testing

**Deliverables Week 1:**
- ✅ Documentation live (80%)
- ✅ Security hardened (100%)
- ✅ Test Chat working (100%)
- ✅ Score: 80%

---

### 📅 WEEK 2-3: Core Features (120h)

**Days 1-5**: Knowledge Base (50h)
- [ ] File upload API
- [ ] Database schema
- [ ] File parsing
- [ ] Vectorization worker
- [ ] Vector search
- [ ] UI components
- [ ] Integration с AI

**Days 6-8**: Security & Performance (24h)
- [ ] Input sanitization
- [ ] Circuit breaker
- [ ] Cost tracking
- [ ] Testing

**Days 9-10**: UX (20h)
- [ ] Loading/Error pages
- [ ] A11y audit
- [ ] Lighthouse optimization
- [ ] Mobile testing

**Days 11-12**: Buffer & Testing (26h)
- [ ] Integration testing
- [ ] Bug fixes
- [ ] Documentation updates
- [ ] Performance testing

**Deliverables Week 2-3:**
- ✅ Knowledge Base working
- ✅ A11y score 95+
- ✅ All security features
- ✅ Score: 90%

---

### 📅 WEEK 4-5: Polish (120h)

**Days 1-4**: Social Integrations (40h)
- [ ] Instagram integration
- [ ] Facebook Messenger
- [ ] Testing
- [ ] Documentation

**Days 5-8**: Performance (30h)
- [ ] Bundle optimization
- [ ] Database optimization
- [ ] Image optimization
- [ ] Core Web Vitals

**Days 9-12**: Infrastructure (30h)
- [ ] Centralized logging
- [ ] Grafana dashboards
- [ ] WAF setup
- [ ] Monitoring & alerts

**Days 13-15**: CMS & Final Polish (20h)
- [ ] Categories/Articles
- [ ] Final testing
- [ ] Documentation review
- [ ] Pre-launch checklist

**Deliverables Week 4-5:**
- ✅ Full feature set
- ✅ Performance optimized
- ✅ Production infrastructure
- ✅ Score: 95%

---

## ✅ DAILY WORKFLOW

### Morning (9:00-10:00)
1. Review TODO list
2. Check GitHub Issues
3. Prioritize top 3 tasks
4. Plan day (Pomodoro blocks)

### Work (10:00-18:00)
1. Focus time (4h на coding)
2. Testing time (2h)
3. Documentation (1h)
4. Code review/refactor (1h)

### Evening (18:00-19:00)
1. Commit all progress
2. Update TODO
3. Write notes для tomorrow
4. Quick retrospective

---

## 🎯 ПЕРВЫЕ ШАГИ (СЕГОДНЯ)

### 1. Cleanup (10 min) ✅
```bash
cd /home/user/gpt-agent-platform

# Удалить временные файлы
rm -f API_*.md API_*.txt CRITICAL_*.md FINAL_*.md
rm -f PRODUCTION_READINESS_ANALYSIS.md REACT_QUERY_*.md
rm -f SECURITY_*.{md,txt} WORKER_*.{md,txt}
rm -f TODO_ISSUES.md КРАТКОЕ_РЕЗЮМЕ.md PR_DESCRIPTION.md
rm -f components/ui/storybook-stories.tsx

git add . && git commit -m "chore: cleanup temporary files" && git push
```

### 2. Create GitHub Issues (30 min)
```
Week 1 Issues:
□ #1 Getting Started Documentation (20h)
□ #2 Rate Limiting (4h)
□ #3 Structured Logging (6h)
□ #4 Token Encryption (4h)
□ #5 Test Chat Completion (6h)

Labels: priority:critical, milestone:week-1
```

### 3. Start with Documentation (TODAY)
```bash
# Create branch
git checkout -b feature/getting-started-docs

# Create structure
mkdir -p app/docs/ru/getting-started
mkdir -p app/docs/ru/features
mkdir -p components/docs

# Start coding!
# See detailed instructions in this plan above
```

---

**Status**: Ready to start ✅
**Next**: Documentation (Week 1, Day 1)
**Timeline**: 5 weeks → 95% ready
**Launch**: ~Week 6-7 (Beta)

**Let's ship it! 🚀**
