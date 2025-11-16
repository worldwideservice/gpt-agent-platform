# Система уведомлений TON 18 Platform

Полнофункциональная система уведомлений с поддержкой multi-tenancy, RLS и real-time обновлений.

## 📋 Оглавление

- [Архитектура](#архитектура)
- [Установка](#установка)
- [Использование](#использование)
- [API Reference](#api-reference)
- [Интеграция](#интеграция)
- [Безопасность](#безопасность)

---

## 🏗️ Архитектура

### Компоненты системы

```
notifications/
├── Database
│   └── supabase/migrations/20251116090000_create_notifications.sql
│       - Таблица notifications с RLS
│       - 6 типов уведомлений
│       - Триггеры и индексы
│
├── API Endpoints (tenant-isolated)
│   ├── GET    /api/manage/[tenantId]/notifications
│   ├── PUT    /api/manage/[tenantId]/notifications/read-all
│   ├── PUT    /api/manage/[tenantId]/notifications/[id]
│   └── DELETE /api/manage/[tenantId]/notifications/[id]
│
├── React Components
│   ├── NotificationItem.tsx          - Компонент одного уведомления
│   └── NotificationsPanelClient.tsx  - Popover панель с React Query
│
└── Helper Functions
    ├── create-notification.ts        - Core функции создания
    ├── integration-examples.ts       - Примеры интеграции
    └── index.ts                      - Exports
```

### Типы уведомлений

| Тип | Описание | Использование |
|-----|----------|---------------|
| `lead_new` | Новый лид | Webhook при создании лида |
| `lead_assigned` | Лид назначен | Ручное назначение лида |
| `lead_status_changed` | Статус изменен | Перемещение по воронке |
| `message_new` | Новое сообщение | Входящее сообщение от лида |
| `system_alert` | Системное | Обслуживание, обновления |
| `integration_error` | Ошибка интеграции | Сбой синхронизации |

---

## 🚀 Установка

### Шаг 1: Применить миграцию БД

```bash
# Из корня проекта
npx supabase db push
```

Или вручную через Supabase Dashboard:
1. Откройте SQL Editor
2. Скопируйте содержимое `supabase/migrations/20251116090000_create_notifications.sql`
3. Выполните

### Шаг 2: Верификация миграции

Проверьте, что таблица создана:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'notifications';
```

Проверьте RLS policies:

```sql
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'notifications';
```

Должно быть 4 policy:
- `Users can view their own notifications in their org` (SELECT)
- `Users can update their own notifications` (UPDATE)
- `Users can delete their own notifications` (DELETE)
- `Service role can insert notifications` (INSERT)

### Шаг 3: Интеграция готова ✅

ManageHeader уже интегрирован с `NotificationsPanelClient`. После применения миграции панель уведомлений станет активной автоматически.

---

## 💻 Использование

### Создание уведомления

```typescript
import { createNotification } from '@/lib/notifications'

// Базовое использование
await createNotification({
  orgId: 'uuid-организации',
  userId: 'uuid-пользователя',
  type: 'lead_new',
  title: 'Новый лид',
  message: 'Получен новый лид "Иван Иванов" из Instagram',
  actionUrl: '/manage/my-org/leads/lead-123',
  metadata: {
    leadId: 'lead-123',
    source: 'instagram'
  }
})
```

### Использование шаблонов

```typescript
import { createNotification, NotificationTemplates } from '@/lib/notifications'

const template = NotificationTemplates.leadNew('Иван Иванов', 'Instagram')

await createNotification({
  ...template,
  orgId,
  userId,
  actionUrl: `/manage/${tenantSlug}/leads/${leadId}`,
  metadata: { leadId, source: 'instagram' }
})
```

### Массовые уведомления

```typescript
import { createBulkNotifications, NotificationTemplates } from '@/lib/notifications'

const userIds = ['user1-uuid', 'user2-uuid', 'user3-uuid']
const template = NotificationTemplates.systemAlert('Плановое обслуживание 23:00-01:00')

await createBulkNotifications(userIds, {
  ...template,
  orgId: 'org-uuid',
  actionUrl: '/manage/my-org'
})
```

---

## 📚 API Reference

### `createNotification(input: CreateNotificationInput): Promise<string | null>`

Создает одно уведомление.

**Parameters:**
```typescript
{
  orgId: string        // UUID организации
  userId: string       // UUID получателя
  type: NotificationType
  title: string        // Макс. 255 символов
  message: string      // Макс. 2000 символов
  actionUrl?: string   // Опционально
  metadata?: Record<string, any>  // Опционально
}
```

**Returns:** ID созданного уведомления или `null` при ошибке

**Example:**
```typescript
const notificationId = await createNotification({
  orgId: session.user.orgId,
  userId: assignedToUserId,
  type: 'lead_assigned',
  title: 'Лид назначен вам',
  message: 'Лид "Компания ABC" назначен вам',
  actionUrl: `/manage/${tenantSlug}/leads/${leadId}`
})
```

### `createBulkNotifications(userIds: string[], data: Omit<CreateNotificationInput, 'userId'>): Promise<number>`

Создает уведомления для нескольких пользователей.

**Returns:** Количество успешно созданных уведомлений

### `NotificationTemplates`

Предопределенные шаблоны для типовых сценариев:

```typescript
NotificationTemplates.leadNew(leadName, source)
NotificationTemplates.leadAssigned(leadName, assignedBy)
NotificationTemplates.leadStatusChanged(leadName, oldStatus, newStatus)
NotificationTemplates.messageNew(leadName, messagePreview)
NotificationTemplates.systemAlert(message)
NotificationTemplates.integrationError(integrationName, errorMessage)
```

---

## 🔌 Интеграция

### 1. Webhook обработчик Kommo

**Файл:** `app/api/integrations/kommo/webhooks/route.ts`

```typescript
import { notifyOnNewLead } from '@/lib/notifications'

export async function POST(request: Request) {
  // ... обработка webhook

  // После создания лида:
  await notifyOnNewLead({
    orgId: agent.org_id,
    leadName: lead.name,
    leadId: lead.id,
    source: 'Kommo',
    tenantSlug: organization.slug,
  })

  // ...
}
```

### 2. Назначение лида

**Файл:** `app/api/agents/[id]/leads-contacts/route.ts`

```typescript
import { notifyOnLeadAssigned } from '@/lib/notifications'

export async function PUT(request: Request) {
  // ... логика назначения

  await notifyOnLeadAssigned({
    orgId: agent.org_id,
    assignedToUserId: assignedTo,
    leadName: lead.name,
    leadId: lead.id,
    assignedByUserName: session.user.name,
    tenantSlug: tenantId,
  })

  // ...
}
```

### 3. Изменение статуса лида

**Файл:** `app/api/agents/[id]/pipeline-settings/route.ts`

```typescript
import { notifyOnLeadStatusChange } from '@/lib/notifications'

export async function POST(request: Request) {
  // ... логика изменения статуса

  await notifyOnLeadStatusChange({
    orgId: agent.org_id,
    assignedToUserId: lead.assigned_to,
    leadName: lead.name,
    leadId: lead.id,
    oldStatus: oldPipelineStage,
    newStatus: newPipelineStage,
    tenantSlug: tenantId,
  })

  // ...
}
```

### 4. Ошибки интеграции

**Файл:** `app/api/integrations/kommo/sync/route.ts`

```typescript
import { notifyOnIntegrationError } from '@/lib/notifications'

try {
  // ... логика синхронизации
} catch (error) {
  await notifyOnIntegrationError({
    orgId: agent.org_id,
    integrationName: 'Kommo',
    errorMessage: error.message,
    tenantSlug: organization.slug,
  })

  throw error
}
```

### 5. Новое сообщение в чате

**Файл:** `app/api/chat/route.ts`

```typescript
import { notifyOnNewMessage } from '@/lib/notifications'

export async function POST(request: Request) {
  // ... обработка сообщения

  await notifyOnNewMessage({
    orgId: conversation.org_id,
    assignedToUserId: lead.assigned_to,
    leadName: lead.name,
    leadId: lead.id,
    messageText: message.text,
    tenantSlug: tenantId,
  })

  // ...
}
```

---

## 🔒 Безопасность

### Row Level Security (RLS)

Все уведомления защищены RLS policies на уровне БД:

```sql
-- Пользователи видят только свои уведомления в своей организации
CREATE POLICY "Users can view their own notifications in their org"
  ON notifications FOR SELECT
  USING (
    user_id = auth.uid() AND
    org_id IN (
      SELECT om.org_id FROM organization_members om
      WHERE om.user_id = auth.uid()
    )
  );
```

### Middleware Protection

Все API endpoints защищены middleware:
- ✅ Rate Limiting (100 req/10s для auth пользователей)
- ✅ Tenant Access Control (slug → orgId validation)
- ✅ Session verification

### Input Validation

Все входные данные валидируются Zod schemas:
- Email format
- UUID format
- String lengths (title: 1-255, message: 1-2000)
- Enum types (notification types)

### Logs

Все операции логируются:
```typescript
logger.info('Notification created', {
  notificationId,
  orgId,
  userId,
  type
})
```

---

## 📊 Мониторинг

### Проверка работы системы

1. **Database query:**
```sql
SELECT
  type,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE is_read = false) as unread
FROM notifications
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY type;
```

2. **API health check:**
```bash
curl -X GET "https://your-domain.com/api/manage/[tenantId]/notifications?limit=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

3. **React Query DevTools:**
Включите в development для мониторинга запросов:
```typescript
// components/providers/QueryClientProvider.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
```

---

## 🐛 Troubleshooting

### Уведомления не появляются

1. **Проверьте миграцию:**
   ```sql
   SELECT COUNT(*) FROM notifications;
   ```

2. **Проверьте RLS:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'notifications';
   ```

3. **Проверьте логи:**
   ```bash
   # В консоли браузера
   localStorage.debug = 'notifications:*'
   ```

### Ошибка 403 Forbidden

- Убедитесь, что пользователь является членом организации
- Проверьте `organization_members` таблицу
- Проверьте, что `tenantId` в URL совпадает с `orgId` пользователя

### Уведомления не обновляются

- React Query кеш: `queryClient.invalidateQueries(['notifications'])`
- Проверьте `refetchInterval` (по умолчанию 30 секунд)
- Откройте React Query DevTools

---

## 📝 Changelog

### Version 1.0.0 (2025-11-16)

- ✅ Создана таблица `notifications` с RLS
- ✅ API endpoints с tenant isolation
- ✅ React компоненты с React Query
- ✅ Helper функции для создания уведомлений
- ✅ Шаблоны для типовых сценариев
- ✅ Интеграция с ManageHeader
- ✅ Документация и примеры

---

## 🤝 Contributing

При добавлении новых типов уведомлений:

1. Добавьте тип в миграцию (`supabase/migrations/...`)
2. Обновите Zod enum (`lib/validation/schemas/notification.ts`)
3. Добавьте иконку в `NotificationItem.tsx`
4. Создайте шаблон в `NotificationTemplates`
5. Обновите документацию

---

## 📧 Support

Вопросы и проблемы: [GitHub Issues](https://github.com/your-repo/issues)
