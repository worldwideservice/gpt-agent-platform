# ✅ TODO ДО ПРОДАКШЕНА

**Текущий статус**: 68/100
**Цель**: 100/100
**Срок**: 6-8 недель

---

## 🔴 НЕДЕЛЯ 1: КРИТИЧНО (80 часов)

### 1. Pricing + Payments - 40h ⚠️ БЛОКЕР
```
□ Setup Lemon Squeezy account
□ Создать pricing calculation engine
□ Сделать Payment UI (cards, calculator, FAQ)
□ Реализовать checkout flow
□ Webhook handlers для subscription events
□ Тестирование платежей

Файлы:
- lib/integrations/lemonsqueezy.ts
- lib/services/pricing.ts
- components/pricing/*
- app/api/checkout/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- supabase/migrations/subscriptions.sql
```

### 2. Getting Started Docs - 20h ⚠️ БЛОКЕР
```
□ Создать docs structure (/docs/ru)
□ Написать Getting Started guide
□ Feature documentation
□ API documentation
□ Search implementation (Fuse.js)

Файлы:
- app/docs/ru/layout.tsx
- docs/ru/getting-started/*.mdx (10+ статей)
- components/docs/DocsNav.tsx
- components/docs/DocsSearch.tsx
```

### 3. Backend Security - 20h ⚠️ КРИТИЧНО
```
□ Rate Limiting (Redis) - 4h
  - lib/middleware/rate-limit.ts
  - Применить ко всем API endpoints

□ Structured Logging (Winston) - 6h
  - lib/logger.ts
  - Заменить все console.log
  - Request ID tracking

□ Token Encryption - 4h
  - lib/crypto/encryption.ts
  - Зашифровать CRM tokens
  - Migration существующих токенов

□ Test Chat - 6h
  - Доделать persistence
  - Real-time messaging
  - Agent selection
```

**Результат недели**: 68% → 78% (+10%)

---

## 🟡 НЕДЕЛИ 2-3: ВАЖНО (120 часов)

### 4. Knowledge Base - 50h ⚠️ CORE FEATURE
```
□ File Upload API (16h)
  - app/api/knowledge-base/upload/route.ts
  - Support: PDF, DOCX, TXT, MD
  - Vercel Blob / S3 storage

□ Vectorization (16h)
  - lib/services/file-parser.ts (parse PDF/DOCX)
  - lib/services/text-chunker.ts (chunking)
  - services/worker/process-knowledge-base.ts
  - OpenAI embeddings (ada-002)
  - Database: knowledge_base_files + chunks

□ Vector Search (12h)
  - app/api/knowledge-base/search/route.ts
  - pgvector similarity search
  - Integrate с AI Agent responses

□ UI Components (12h)
  - components/knowledge-base/FileUpload.tsx
  - components/knowledge-base/FileList.tsx
  - components/knowledge-base/KBSearch.tsx
```

### 5. Security & Infrastructure - 30h
```
□ Input Sanitization (16h)
  - lib/security/sanitize.ts
  - DOMPurify, validator
  - Prompt injection protection
  - Применить ко всем user inputs

□ Circuit Breaker (8h)
  - lib/resilience/circuit-breaker.ts
  - Wrap external APIs (OpenRouter, Kommo, OpenAI)
  - Fallback strategies

□ Cost Tracking (8h)
  - Database: api_usage table
  - lib/services/cost-tracker.ts
  - Track OpenAI/OpenRouter costs
  - Dashboard widget
```

### 6. UX Improvements - 20h
```
□ Loading/Error Pages (4h)
  - app/**/loading.tsx для всех routes
  - app/**/error.tsx для всех routes

□ A11y Audit & Fixes (16h)
  - Lighthouse audit (target: 90+)
  - axe DevTools на всех страницах
  - aria-labels, keyboard navigation
  - Color contrast fixes
  - Screen reader testing
```

**Результат недель 2-3**: 78% → 88% (+10%)

---

## 🟢 НЕДЕЛИ 4-6: ПОЛИРОВКА (120+ часов)

### 7. Advanced Features - 40h
```
□ Instagram Integration (20h)
  - OAuth flow
  - Send/receive messages
  - Webhook handling
  - Auto-reply с AI Agent

□ Facebook Integration (20h)
  - Messenger API
  - OAuth flow
  - Message handling
```

### 8. Performance - 20h
```
□ Bundle Optimization (8h)
  - webpack-bundle-analyzer
  - Dynamic imports
  - Target: < 200KB

□ Database Optimization (8h)
  - Add indexes
  - Fix N+1 queries
  - Connection pooling
  - Target: p95 < 50ms

□ Image Optimization (4h)
  - WebP/AVIF
  - CDN setup
  - Lazy loading
```

### 9. Infrastructure - 20h
```
□ Centralized Logging (8h)
  - DataDog или ELK stack
  - Log aggregation
  - Alerts

□ Grafana Dashboards (8h)
  - App metrics
  - DB metrics
  - API response times
  - Error rates

□ WAF (4h)
  - Cloudflare WAF
  - DDoS protection
  - Bot mitigation
```

### 10. Final Polish - 40h
```
□ Categories/Articles CMS (12h)
  - Database schema
  - CRUD API
  - Admin UI

□ Advanced Analytics (8h)
  - Enhanced metrics
  - Export (CSV, PDF)
  - Real-time analytics

□ Load Testing (12h)
  - k6 scenarios
  - 1000 req/sec sustained
  - Identify bottlenecks
  - Optimize

□ Security Hardening (8h)
  - Penetration testing
  - Security headers audit
  - Dependency audit
  - Secrets rotation
```

**Результат недель 4-6**: 88% → 100% (+12%)

---

## 📊 ПРОГРЕСС

```
Week 1  ████████░░░░░░░░░░  78%  (Critical Blockers)
Week 2  ████████████░░░░░░  88%  (Core Features)
Week 3  ████████████░░░░░░  88%  (Security & UX)
Week 4  ██████████████░░░░  92%  (Advanced Features)
Week 5  ████████████████░░  96%  (Infrastructure)
Week 6  ██████████████████ 100%  (Final Polish)
```

---

## 🎯 МИНИМУМ ДЛЯ ЗАПУСКА (MVP)

### Обязательно (2 недели, 116 часов):
1. ✅ Pricing + Payments (40h)
2. ✅ Getting Started Docs (20h)
3. ✅ Rate Limiting (4h)
4. ✅ Structured Logging (6h)
5. ✅ Token Encryption (4h)
6. ✅ Test Chat (6h)
7. ✅ Input Sanitization (16h)
8. ✅ Loading/Error Pages (4h)
9. ✅ A11y Basic Fixes (16h)

**Результат**: 75% готовности, можно запускать

### Желательно (еще 2 недели, +110 часов):
10. ✅ Knowledge Base (50h)
11. ✅ Circuit Breaker (8h)
12. ✅ Cost Tracking (8h)
13. ✅ A11y Full Audit (остальные часы)

**Результат**: 85% готовности, стабильный продукт

### Идеально (еще 2-4 недели, +120 часов):
14. ✅ Social Integrations (40h)
15. ✅ Performance Optimization (20h)
16. ✅ Infrastructure (20h)
17. ✅ Final Polish (40h)

**Результат**: 100% готовности, production grade

---

## 🚨 ТОП-5 ПРИОРИТЕТОВ (НАЧАТЬ СЕГОДНЯ)

1. **Setup Lemon Squeezy** (2 часа)
   - Создать account
   - Настроить products
   - Получить API keys

2. **Удалить лишние файлы** (10 минут)
   ```bash
   # См. ПОЛНЫЙ_АУДИТ_ПРОЕКТА.md раздел 3
   rm -f API_*.md CRITICAL_*.md FINAL_*.md ...
   ```

3. **Создать GitHub Issues** (1 час)
   - Issue для каждой задачи из Недели 1
   - Assign priorities
   - Set milestones

4. **Начать Pricing implementation** (сегодня)
   - Создать ветку `feature/pricing-payments`
   - Начать с pricing calculation engine

5. **Setup Winston logger** (завтра)
   - Создать ветку `feature/structured-logging`
   - Реализовать lib/logger.ts

---

## 📅 ДЕДЛАЙНЫ

| Milestone | Дата | Задачи |
|-----------|------|--------|
| **Week 1 Complete** | 2025-11-23 | Pricing, Docs, Security |
| **Week 2-3 Complete** | 2025-12-07 | Knowledge Base, A11y |
| **Week 4 Complete** | 2025-12-14 | Social, Performance |
| **Week 5 Complete** | 2025-12-21 | Infrastructure |
| **Week 6 Complete** | 2025-12-28 | Final Polish |
| **🚀 SOFT LAUNCH** | 2026-01-04 | Beta (10-20 users) |
| **🎉 PUBLIC LAUNCH** | 2026-01-11 | Production |

---

## ✅ DAILY CHECKLIST

### Каждый день:
- [ ] Утро: Review TODO, prioritize tasks
- [ ] Работа: Focus на 1-2 больших задачах
- [ ] Вечер: Commit progress, update TODO
- [ ] Before sleep: Plan tomorrow

### Каждую неделю:
- [ ] Понедельник: Plan week, create issues
- [ ] Среда: Mid-week review, adjust
- [ ] Пятница: Week review, demo
- [ ] Суббота: Catch up, cleanup

### Перед коммитом:
- [ ] Tests passing
- [ ] Lint clean
- [ ] Types check
- [ ] No console.logs
- [ ] Comments updated

---

## 📞 ПОМОЩЬ

**Если застрял:**
1. Проверь ПОЛНЫЙ_АУДИТ_ПРОЕКТА.md
2. Проверь PRODUCTION_ACTION_PLAN.md
3. Проверь KWID_COMPLIANCE_REPORT.md
4. Создай GitHub Issue
5. Ask team/ChatGPT

**Документация:**
- Architecture: PROJECT_STRUCTURE.md
- Deployment: docs/DEPLOYMENT_GUIDE.md
- Database: docs/DATABASE_SCHEMA.md
- API: Swagger docs в коде

---

**Статус**: 📝 Ready to Start
**Следующий шаг**: Setup Lemon Squeezy + Delete temp files
**Удачи! 🚀**
