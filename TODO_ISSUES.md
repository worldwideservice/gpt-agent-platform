# GitHub Issues для TODO комментариев

> **Last Updated:** 2025-11-14
> **Status:** ✅ All Critical Frontend TODOs Resolved

---

## ✅ Recently Resolved (2025-11-14)

### Issue: Notifications API Integration
**Файл:** `components/layout/ManageHeader.tsx`
**Статус:** ✅ Resolved

**Решение:**
- Создан полный набор API endpoints для notifications
- Интегрирован React Query с auto-refetch (30s)
- Реализованы mutations для mark read / delete с optimistic updates
- Добавлен unread count в реальном времени

**API Endpoints:**
- GET /api/notifications - список уведомлений
- POST /api/notifications - mark all as read
- DELETE /api/notifications - delete all
- PATCH /api/notifications/[id] - mark as read
- DELETE /api/notifications/[id] - delete one

---

### Issue: License Info API Integration
**Файл:** `components/layout/ManageHeader.tsx`
**Статус:** ✅ Resolved

**Решение:**
- Создан API endpoint для получения информации о лицензии
- GET /api/organization/[orgId]/license
- Возвращает: plan, status, expiry date, token quota/usage, days until expiry
- Graceful fallback к free plan если нет подписки

---

### Issue: Global Search API Implementation
**Файл:** `components/layout/GlobalSearch.tsx`
**Статус:** ✅ Resolved

**Решение:**
- Создан search API endpoint с поиском по agents, knowledge base, static pages
- GET /api/search?q=query&orgId=...&limit=10
- Debounced search (300ms)
- Keyboard navigation уже реализована (Arrow Up/Down, Enter, Escape, Cmd/Ctrl+K)
- Relevance sorting (exact match first)

---

### Issue: Confirmation Dialog for Delete Actions
**Файл:** `components/features/agents/AgentsTable.tsx`
**Статус:** ✅ Resolved

**Решение:**
- Добавлен window.confirm перед bulk delete
- Предотвращает случайное удаление
- Показывает количество удаляемых агентов

---

### Issue: Remove Mock API in Agent Create
**Файл:** `app/manage/[tenantId]/ai-agents/create/page.tsx`
**Статус:** ✅ Resolved

**Решение:**
- API уже был интегрирован, удален устаревший TODO комментарий

---

## 🔵 Open Issues (Backend/Optional)

### Issue 1: Re-enable GraphQL schema
**Файл:** `lib/graphql/schema.ts:2`
**Приоритет:** Low
**Labels:** enhancement, graphql
**Статус:** 🔵 Открыт

**Описание:**
GraphQL schema закомментирован и требует повторного включения когда GraphQL функциональность понадобится.

**Код:**
```typescript
// TODO: Re-enable when GraphQL is needed
```

**Задача:**
- Определить требуется ли GraphQL для проекта
- Если да - восстановить GraphQL schema
- Если нет - удалить файл

**Решение:** Принять решение о необходимости GraphQL в архитектуре

---

### Issue 2: Implement PDF export for analytics
**Файл:** `lib/services/analytics.ts:680`
**Приоритет:** Medium
**Labels:** enhancement, analytics, export
**Статус:** 🔵 Открыт

**Описание:**
Функция экспорта аналитики поддерживает JSON и CSV, но не реализована генерация PDF отчетов.

**Код:**
```typescript
case 'pdf':
  // TODO: реализовать генерацию PDF
  return null
```

**Задача:**
- Интегрировать библиотеку для генерации PDF (puppeteer, pdfkit, jsPDF)
- Реализовать форматирование данных аналитики для PDF
- Добавить шаблоны отчетов
- Добавить тесты

**Технические требования:**
- Поддержка таблиц, графиков, изображений
- Правильное форматирование кириллицы
- Возможность настройки брендинга (логотип, цвета)

**Предлагаемое решение:**
- Использовать `@react-pdf/renderer` или `jsPDF` + `html2canvas`
- Создать шаблон PDF отчета
- Добавить endpoint `/api/analytics/export/pdf`

---

### Issue 3: Implement structured logging
**Файл:** `lib/utils/logger.ts:96`
**Приоритет:** Medium
**Labels:** enhancement, logging, observability
**Статус:** 🔵 Открыт

**Описание:**
Логгер требует реализации структурированного логирования для улучшения observability.

**Код:**
```typescript
// TODO: Implement structured logging
```

**Задача:**
- Добавить структурированные поля (timestamp, level, context, metadata)
- Интегрировать с системой сбора логов (ELK, Datadog, CloudWatch)
- Добавить correlation ID для трейсинга запросов
- Реализовать log sampling для production

**Преимущества:**
- Упрощенный поиск и фильтрация логов
- Возможность построения метрик из логов
- Лучшая отладка и мониторинг

**Предлагаемое решение:**
- Использовать `pino` вместо кастомного logger
- Интегрировать с `pino-pretty` для dev
- Добавить transport для Datadog/CloudWatch

**Примечание:** Частично реализовано - 334 console.log заменены на structured logging

---

## Summary

**Frontend TODOs:** 0 (все решены! 🎉)
**Backend TODOs:** 3 (опциональные, не критичные)

**Критичность:**
- Critical: 0
- High: 0
- Medium: 2 (PDF export, structured logging)
- Low: 1 (GraphQL)

**Статус:**
- 🟢 Resolved: 8 (Redis rate limiting, notifications API, license API, search API, confirmation dialog, agent create)
- 🔵 Open: 3 (GraphQL, PDF export, structured logging)

**Приоритет выполнения оставшихся:**
1. Issue 3 (Structured logging) - улучшает observability
2. Issue 2 (PDF export) - добавляет функциональность для клиентов
3. Issue 1 (GraphQL) - по необходимости (низкий приоритет)

---

## Changelog

**2025-11-14 (Latest):**
- ✅ Resolved: Notifications API Integration (5 TODOs)
- ✅ Resolved: License Info API Integration
- ✅ Resolved: Global Search API Implementation
- ✅ Resolved: Confirmation Dialog for Delete Actions
- ✅ Resolved: Remove Mock API in Agent Create
- 📊 **Frontend: 100% Complete! (0 TODOs remaining)**

**2025-11-13:**
- ✅ Resolved: Redis rate limiting
- Updated summary statistics

**2025-01-26:**
- Initial version with 5 issues

---

**Version:** 3.0
**Next Review:** When new TODOs are added
