# GitHub Issues для TODO комментариев

## Issue 1: Re-enable GraphQL schema
**Файл:** `lib/graphql/schema.ts:2`
**Приоритет:** Low
**Labels:** enhancement, graphql

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

---

## Issue 2: Implement PDF export for analytics
**Файл:** `lib/services/analytics.ts:680`
**Приоритет:** Medium
**Labels:** enhancement, analytics, export

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

---

## Issue 3: Implement structured logging
**Файл:** `lib/utils/logger.ts:96`
**Приоритет:** Medium
**Labels:** enhancement, logging, observability

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

---

## Issue 4: Re-enable Redis for rate limiting
**Файл:** `lib/rate-limit.ts:84`
**Приоритет:** High
**Labels:** bug, infrastructure, redis

**Описание:**
Redis для rate limiting закомментирован из-за проблем с конфигурацией Upstash. Это критично для production.

**Код:**
```typescript
// TODO: Re-enable Redis when Upstash is properly configured
```

**Задача:**
- Настроить Upstash Redis правильно
- Проверить credentials и connection settings
- Восстановить Redis-based rate limiting
- Добавить fallback механизм при недоступности Redis
- Добавить health check для Redis

**Риски без Redis:**
- Rate limiting работает только в памяти (теряется при рестарте)
- Не работает в multi-instance окружении
- Нет распределенного rate limiting

**Приоритет:** CRITICAL для production deployment

---

## Issue 5: Refactor common functions to shared package
**Файл:** `services/worker/src/tasks/process-asset.ts:14`
**Приоритет:** Medium
**Labels:** refactoring, technical-debt, worker

**Описание:**
Общие функции между worker и основным приложением дублируются. Требуется вынести в shared package.

**Код:**
```typescript
// TODO: Вынести общие функции в отдельный пакет или использовать одинаковые функции
```

**Задача:**
- Определить общие функции между worker и main app
- Создать shared package или lib/shared директорию
- Переместить общие функции (парсинг файлов, embeddings, utils)
- Обновить импорты в worker и main app
- Добавить тесты для shared функций

**Преимущества:**
- Единый источник истины
- Упрощенное обслуживание
- Меньше дублирования кода

---

## Summary

**Всего TODO:** 5
**Critical:** 1 (Redis rate limiting)
**High:** 0
**Medium:** 3 (PDF export, structured logging, shared package)
**Low:** 1 (GraphQL)

**Рекомендуемый порядок выполнения:**
1. Issue 4 (Redis) - CRITICAL для production
2. Issue 3 (Structured logging) - улучшает observability
3. Issue 2 (PDF export) - добавляет функциональность
4. Issue 5 (Shared package) - улучшает архитектуру
5. Issue 1 (GraphQL) - по необходимости
