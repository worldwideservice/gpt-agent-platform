# ✅ Улучшения Webhooks от Kommo

**Дата реализации:** 2025-01-27  
**Статус:** ✅ Полностью реализовано

---

## 📋 Что было реализовано

### 1. ✅ Полная обработка всех типов событий

**Реализовано:**
- ✅ `leads` (сделки) - создание, обновление, изменение статуса
- ✅ `contacts` (контакты) - создание, обновление
- ✅ `tasks` (задачи) - создание, завершение, обновление
- ✅ `messages` (сообщения) - отправка, получение
- ✅ `calls` (звонки) - начало, завершение, пропущенные
- ✅ `customers` (покупатели) - обработка событий

**Файлы:**
- `lib/services/webhook-processor.ts` - основной сервис обработки

---

### 2. ✅ Автоматический запуск Rule Engine

**Реализовано:**
- Автоматический запуск Rule Engine при webhook событиях
- Маппинг типов событий на trigger types Rule Engine:
  - `lead_created` → `lead_created`
  - `lead_updated` → `lead_updated`
  - `lead_status_changed` → `stage_changed`
  - `message_sent` / `message_received` → `message_received`

**Интеграция:**
- Функция `triggerRuleEngine()` в `webhook-processor.ts`
- Автоматический запуск после успешной обработки события

---

### 3. ✅ История webhook событий в UI

**API Endpoints:**

#### GET `/api/webhooks`
Получение списка webhook событий с фильтрацией и пагинацией

**Query параметры:**
- `page` (number, default: 1) - номер страницы
- `limit` (number, default: 20, max: 100) - количество на странице
- `status` (enum) - фильтр по статусу: `pending`, `processing`, `completed`, `failed`, `retrying`
- `event_type` (string) - фильтр по типу события
- `entity_type` (string) - фильтр по типу сущности
- `start_date` (ISO datetime) - начало периода
- `end_date` (ISO datetime) - конец периода

**Пример запроса:**
```bash
GET /api/webhooks?page=1&limit=20&status=failed&event_type=leads
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "eventType": "leads",
      "eventSubtype": "lead_status_changed",
      "entityType": "lead",
      "entityId": "12345",
      "status": "completed",
      "retryCount": 0,
      "maxRetries": 3,
      "error": null,
      "createdAt": "2025-01-27T10:00:00Z",
      "processedAt": "2025-01-27T10:00:01Z",
      "nextRetryAt": null,
      "payloadPreview": ["leads", "status", "account"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### GET `/api/webhooks/[id]`
Получение детальной информации о конкретном событии включая полный payload

**Ответ:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "provider": "kommo",
    "eventType": "leads",
    "eventSubtype": "lead_status_changed",
    "entityType": "lead",
    "entityId": "12345",
    "status": "completed",
    "retryCount": 0,
    "maxRetries": 3,
    "error": null,
    "payload": { /* полный payload события */ },
    "executionContext": {},
    "createdAt": "2025-01-27T10:00:00Z",
    "processedAt": "2025-01-27T10:00:01Z",
    "processingStartedAt": "2025-01-27T10:00:00Z",
    "nextRetryAt": null
  }
}
```

#### POST `/api/webhooks/[id]/retry`
Принудительный retry события

**Использование:**
- Для событий со статусом `failed` или `retrying`
- Сбрасывает статус и запускает повторную обработку
- Проверяет лимиты retry

**Ответ:**
```json
{
  "success": true,
  "message": "Событие поставлено в очередь для повторной обработки"
}
```

---

### 4. ✅ Retry механизм для failed webhooks

**Реализовано:**
- Автоматический retry с экспоненциальной задержкой:
  - 1-я попытка: 5 минут
  - 2-я попытка: 10 минут
  - 3-я попытка: 20 минут
  - 4-я попытка: 40 минут
  - 5-я попытка: 60 минут (максимум)
- Максимальное количество попыток: 3 (настраивается в БД)
- Статусы событий:
  - `pending` - ожидает обработки
  - `processing` - обрабатывается
  - `completed` - успешно обработано
  - `failed` - ошибка, достигнут лимит retry
  - `retrying` - ожидает повторной попытки

**Интеграция с очередями:**
- Задача `webhook:retry` добавлена в `lib/queue.ts`
- Приоритет: 8 (высокий)
- Обработчик в `services/worker/src/tasks/index.ts`

**Функция получения событий для retry:**
```typescript
import { getEventsForRetry } from '@/lib/services/webhook-processor'

// Получить события готовые для retry
const events = await getEventsForRetry(10) // limit = 10
```

---

### 5. ✅ Улучшенный webhook handler

**Улучшения:**
- ✅ Определение `orgId` из webhook payload (base_domain)
- ✅ Извлечение метаданных событий (subtype, entity_id, entity_type)
- ✅ Проверка подписи webhook (опционально)
- ✅ Асинхронная обработка (быстрый ответ webhook)
- ✅ Сохранение всех событий в БД перед обработкой

**Файлы:**
- `app/api/crm/webhook/route.ts` - основной endpoint
- `lib/services/webhook-processor.ts` - логика обработки

---

## 🗄️ База данных

### Миграция: `improve_webhook_events.sql`

**Новые поля в таблице `webhook_events`:**
- `status` - статус обработки (pending, processing, completed, failed, retrying)
- `retry_count` - количество попыток retry
- `max_retries` - максимальное количество попыток (default: 3)
- `next_retry_at` - время следующей попытки retry
- `processed_at` - время завершения обработки
- `processing_started_at` - время начала обработки
- `org_id` - ID организации (foreign key)
- `event_subtype` - подтип события (lead_created, task_updated и т.д.)
- `entity_id` - ID сущности из CRM (lead_id, contact_id, task_id)
- `entity_type` - тип сущности (lead, contact, task, message, call)
- `execution_context` - JSONB контекст для Rule Engine

**Индексы:**
- `idx_webhook_events_status` - для быстрого поиска по статусу
- `idx_webhook_events_org_status` - для фильтрации по организации и статусу
- `idx_webhook_events_next_retry` - для поиска событий готовых к retry
- `idx_webhook_events_entity` - для поиска по типу и ID сущности
- `idx_webhook_events_created` - для сортировки по дате создания

**Применение миграции:**
```bash
# Через Supabase CLI
supabase migration up improve_webhook_events

# Или напрямую в БД
psql $DATABASE_URL < supabase/migrations/improve_webhook_events.sql
```

---

## 📦 Созданные файлы

1. ✅ `lib/services/webhook-processor.ts` - основной сервис обработки webhooks
2. ✅ `supabase/migrations/improve_webhook_events.sql` - миграция БД
3. ✅ `app/api/webhooks/route.ts` - API для получения списка событий
4. ✅ `app/api/webhooks/[id]/route.ts` - API для деталей и retry

**Обновленные файлы:**
1. ✅ `app/api/crm/webhook/route.ts` - улучшенный webhook endpoint
2. ✅ `lib/crm/kommo.ts` - улучшенный парсинг webhook событий
3. ✅ `lib/queue.ts` - добавлена задача `webhook:retry`
4. ✅ `services/worker/src/tasks/index.ts` - обработчик retry задач

---

## 🔄 Использование

### Обработка webhook события

```typescript
import { saveWebhookEvent, processWebhookEvent } from '@/lib/services/webhook-processor'

// Сохранение события
const eventId = await saveWebhookEvent(
  orgId,
  'kommo',
  'leads',
  payload,
  {
    eventSubtype: 'lead_status_changed',
    entityId: '12345',
    entityType: 'lead',
  }
)

// Обработка события
await processWebhookEvent(eventId)
```

### Получение истории webhooks

```typescript
// В компоненте React
const response = await fetch('/api/webhooks?page=1&limit=20&status=completed')
const { data, pagination } = await response.json()
```

### Принудительный retry

```typescript
const response = await fetch(`/api/webhooks/${eventId}/retry`, {
  method: 'POST',
})
const result = await response.json()
```

---

## 🧪 Тестирование

### Ручное тестирование webhook endpoint

```bash
# Пример события от Kommo (leads)
curl -X POST http://localhost:3000/api/crm/webhook \
  -H "Content-Type: application/json" \
  -H "X-Org-Id: your-org-id" \
  -d '{
    "account": {
      "base_domain": "your-domain.amocrm.ru"
    },
    "leads": {
      "status": [{
        "id": 12345,
        "pipeline_id": 1,
        "status_id": 2
      }]
    }
  }'
```

### Проверка истории событий

```bash
# Получить список событий
curl http://localhost:3000/api/webhooks?page=1&limit=10

# Получить детали события
curl http://localhost:3000/api/webhooks/{event-id}

# Retry события
curl -X POST http://localhost:3000/api/webhooks/{event-id}/retry
```

---

## 🎯 Следующие шаги (опционально)

1. **UI компоненты:**
   - Список webhook событий в админке
   - Детали события с payload
   - Фильтры и поиск
   - Графики и статистика

2. **Уведомления:**
   - Email уведомления при failed webhooks
   - Slack/Discord интеграция для алертов

3. **Мониторинг:**
   - Метрики успешности обработки
   - Время обработки событий
   - Частота retry

4. **Оптимизация:**
   - Батчинг обработки событий
   - Кэширование правил Rule Engine
   - Асинхронная обработка через очередь (BullMQ)

---

## ✅ Готово к использованию

Все основные функции реализованы и готовы к использованию. Webhook события теперь:
- ✅ Полностью обрабатываются (все типы событий)
- ✅ Сохраняются в БД с метаданными
- ✅ Автоматически запускают Rule Engine
- ✅ Имеют retry механизм при ошибках
- ✅ Доступны через API для просмотра истории

