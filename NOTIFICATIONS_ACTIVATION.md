# 🔔 Активация системы уведомлений

## Статус: ✅ Готово к активации

Все компоненты системы уведомлений созданы и протестированы.

---

## 📋 Чеклист активации

### 1. Применить миграцию БД (ОБЯЗАТЕЛЬНО)

```bash
npx supabase db push
```

**Что создается:**
- Таблица `notifications` с RLS policies
- Индексы для производительности
- Триггеры для автообновления timestamps

**Верификация:**
```sql
-- Должна вернуть таблицу notifications
SELECT table_name FROM information_schema.tables
WHERE table_name = 'notifications';
```

### 2. UI интеграция (УЖЕ ВЫПОЛНЕНО ✅)

Панель уведомлений уже интегрирована в ManageHeader:
- `components/layout/ManageHeader.tsx` - обновлен
- `components/features/notifications/NotificationsPanelClient.tsx` - создан
- `components/features/notifications/NotificationItem.tsx` - создан

После применения миграции панель станет активной автоматически.

### 3. Бизнес-логика (ОПЦИОНАЛЬНО)

Интегрируйте создание уведомлений в обработчики:

#### Webhook Kommo - новый лид
**Файл:** `app/api/integrations/kommo/webhooks/route.ts`

```typescript
import { notifyOnNewLead } from '@/lib/notifications'

// После создания лида
await notifyOnNewLead({
  orgId: agent.org_id,
  leadName: lead.name,
  leadId: lead.id,
  source: 'Kommo',
  tenantSlug: organization.slug,
})
```

#### Назначение лида
**Файл:** `app/api/agents/[id]/leads-contacts/route.ts`

```typescript
import { notifyOnLeadAssigned } from '@/lib/notifications'

await notifyOnLeadAssigned({
  orgId: agent.org_id,
  assignedToUserId: assignedTo,
  leadName: lead.name,
  leadId: lead.id,
  assignedByUserName: session.user.name,
  tenantSlug: tenantId,
})
```

#### Ошибки интеграции
**Файл:** `app/api/integrations/*/sync/route.ts`

```typescript
import { notifyOnIntegrationError } from '@/lib/notifications'

try {
  // Синхронизация
} catch (error) {
  await notifyOnIntegrationError({
    orgId: agent.org_id,
    integrationName: 'Kommo',
    errorMessage: error.message,
    tenantSlug: organization.slug,
  })
}
```

---

## 📁 Созданные файлы

### Database
- `supabase/migrations/20251116090000_create_notifications.sql`

### API Endpoints (tenant-isolated, защищены middleware)
- `app/api/manage/[tenantId]/notifications/route.ts` (GET)
- `app/api/manage/[tenantId]/notifications/read-all/route.ts` (PUT)
- `app/api/manage/[tenantId]/notifications/[notificationId]/route.ts` (PUT, DELETE)

### React Components
- `components/features/notifications/NotificationItem.tsx`
- `components/features/notifications/NotificationsPanelClient.tsx`
- `components/layout/ManageHeader.tsx` (обновлен)

### Helper Functions
- `lib/notifications/create-notification.ts`
- `lib/notifications/integration-examples.ts`
- `lib/notifications/index.ts`

### Validation
- `lib/validation/schemas/notification.ts`

### Documentation
- `lib/notifications/README.md` (полная документация)
- `NOTIFICATIONS_ACTIVATION.md` (этот файл)

---

## 🔒 Безопасность (Security-First)

✅ **Tenant Isolation**
- Все endpoints под `/api/manage/[tenantId]/`
- RLS policies на уровне БД
- Middleware validation (tenantId → orgId)

✅ **Rate Limiting**
- 100 req/10s для authenticated users
- Автоматически через middleware

✅ **Input Validation**
- Zod schemas для всех входных данных
- UUID validation
- Type-safe query parameters

✅ **Error Handling**
- Централизованный logger
- Безопасные error messages

---

## 🧪 Тестирование

### 1. Создать тестовое уведомление

```typescript
// В консоли браузера или через API tool
import { createNotification } from '@/lib/notifications'

await createNotification({
  orgId: 'your-org-uuid',
  userId: 'your-user-uuid',
  type: 'system_alert',
  title: 'Тестовое уведомление',
  message: 'Система уведомлений работает!',
})
```

### 2. Проверить через UI

1. Откройте приложение `/manage/[tenantId]`
2. Кликните на иконку колокольчика в header
3. Должно появиться уведомление с бейджем

### 3. Проверить API

```bash
curl -X GET "https://your-domain.com/api/manage/[tenantId]/notifications" \
  -H "Cookie: your-session-cookie"
```

---

## 📊 Мониторинг

### Database query
```sql
SELECT
  type,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_read = false) as unread
FROM notifications
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY type;
```

### Логи
Все операции логируются через `logger`:
```typescript
logger.info('Notification created', { notificationId, orgId, type })
logger.error('Failed to create notification', error)
```

---

## 🚀 Production Deployment

### Environment Variables (уже настроены)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`

### Checklist
- [ ] Миграция применена в production DB
- [ ] Verify RLS policies active
- [ ] Monitor Supabase logs first 24h
- [ ] Check error rate в production logs
- [ ] Monitor React Query cache invalidation

---

## 📚 Дополнительная информация

**Полная документация:** `lib/notifications/README.md`

**Примеры интеграции:** `lib/notifications/integration-examples.ts`

**Архитектура:** См. раздел "Архитектура" в README.md

---

## ✅ Готово к использованию

После выполнения шага 1 (применение миграции) система уведомлений полностью функциональна.

Интеграция с бизнес-логикой (шаг 3) опциональна и может выполняться постепенно.
