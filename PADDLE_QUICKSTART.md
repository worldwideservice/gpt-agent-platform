# 🚀 Paddle Integration - Quick Start

## ✅ Что уже готово

### Backend (100% Complete)
- ✅ [middleware.ts](middleware.ts) - Проверка лицензии для мутаций (POST/PUT/DELETE/PATCH)
- ✅ [lib/services/billing.ts](lib/services/billing.ts) - Paddle REST API integration
- ✅ [app/api/webhooks/paddle](app/api/webhooks/paddle/route.ts) - Webhook handler
- ✅ [app/api/manage/[tenantId]/subscription](app/api/manage/[tenantId]/subscription/) - API routes

### Frontend (100% Complete)
- ✅ [PricingClient.tsx](components/features/pricing-internal/PricingClient.tsx) - Paddle Checkout integration
- ✅ [LicenseAlert.tsx](components/layout/LicenseAlert.tsx) - Статус лицензии в header
- ✅ [NotificationsPanelClient.tsx](components/features/notifications/NotificationsPanelClient.tsx) - Алерты подписки
- ✅ [KommoIntegrationSettings.tsx](components/features/agents/KommoIntegrationSettings.tsx) - Статусные бейджи
- ✅ [AgentBasicsForm.tsx](components/features/agents/AgentBasicsForm.tsx) - Логика каналов

### Documentation
- ✅ [docs/PADDLE_FRONTEND_INTEGRATION.md](docs/PADDLE_FRONTEND_INTEGRATION.md) - Полная документация
- ✅ [scripts/test-subscription.sql](scripts/test-subscription.sql) - SQL для тестирования
- ✅ [.env.example](.env.example) - Пример конфигурации

---

## 🎯 Следующие шаги (для запуска)

### Шаг 1: Получить Paddle Client Token

1. Зайдите в [Paddle Sandbox Dashboard](https://sandbox-vendors.paddle.com/)
2. Developer tools → Authentication → Create API Key
3. Скопируйте **Client Token** (начинается с `test_...`)

### Шаг 2: Добавить Environment Variables

**Локально (.env.local):**
```bash
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_ваш_токен_здесь
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
```

**На Vercel:**
```bash
# Опция 1: Через CLI
bash scripts/setup-paddle-env.sh

# Опция 2: Через Dashboard
https://vercel.com/world-wide-services-62780b79/ton-18-platform/settings/environment-variables
```

### Шаг 3: Создать Price IDs в Paddle

1. **Products** → Create Product (для каждого тарифа)
2. Для каждого продукта создайте 2 цены:
   - Monthly (например: `$29/month`)
   - Yearly (например: `$290/year`)
3. Скопируйте Price IDs

4. **Обновите** [PricingClient.tsx:24-37](components/features/pricing-internal/PricingClient.tsx#L24-L37):

```typescript
const PADDLE_PRICE_IDS: Record<string, { month: string; year: string }> = {
  starter: {
    month: 'pri_01h...',  // ← Замените на реальный
    year: 'pri_01h...',
  },
  scale: {
    month: 'pri_01h...',
    year: 'pri_01h...',
  },
  enterprise: {
    month: 'pri_01h...',
    year: 'pri_01h...',
  },
}
```

### Шаг 4: Тестирование (БЕЗ реальных платежей)

**Создайте тестовую подписку в Supabase:**

```sql
-- Откройте Supabase SQL Editor
-- Замените YOUR_ORG_ID на реальный

INSERT INTO subscriptions (
  id,
  org_id,
  paddle_subscription_id,
  status,
  current_period_start,
  current_period_end,
  plan_id
) VALUES (
  gen_random_uuid(),
  'YOUR_ORG_ID',
  'sub_test_active',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days',
  'pro_monthly'
)
ON CONFLICT (org_id) DO UPDATE SET
  status = 'active',
  current_period_end = NOW() + INTERVAL '30 days';
```

**Результат:**
- ✅ Middleware разрешит создание агентов
- ✅ LicenseAlert покажет дату истечения
- ✅ NotificationsPanelClient НЕ покажет алерт

---

## 🧪 Чек-лист тестирования

### 1. Middleware блокирует мутации без подписки

```bash
# Удалите подписку:
DELETE FROM subscriptions WHERE org_id = 'YOUR_ORG_ID';

# Попробуйте создать агента (POST /api/manage/.../agents)
# Ожидается: 402 Payment Required
```

**Проверка:** ✅ Middleware вернул 402

### 2. UI показывает статус лицензии

```bash
# Создайте истекшую подписку (см. scripts/test-subscription.sql)
```

**Проверка:**
- ✅ LicenseAlert: КРАСНЫЙ бейдж с датой
- ✅ NotificationsPanelClient: Красный алерт "Лицензия истекла"

### 3. Paddle Checkout открывается

```bash
# 1. Откройте /manage/[tenantId]/pricing
# 2. Нажмите "Выбрать план"
```

**Проверка:**
- ✅ Консоль: `[Paddle] Initialized successfully`
- ✅ Открывается Paddle Checkout overlay
- ✅ После оплаты: `[Paddle] Checkout completed`

### 4. Агенты - переключатель каналов

```bash
# Откройте /manage/[tenantId]/ai-agents/[agentId]/settings
# Переключите "Все каналы" → OFF
```

**Проверка:**
- ✅ Появился MultiSelect с каналами

---

## 🛠️ Troubleshooting

### Ошибка: "Paddle is not defined"

**Причина:** `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` не установлен

**Решение:**
```bash
# Проверьте .env.local:
cat .env.local | grep PADDLE

# Если пусто:
echo "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_ваш_токен" >> .env.local
echo "NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox" >> .env.local

# Перезапустите:
npm run dev
```

### Checkout не открывается

**Причина:** Price ID некорректный или не существует

**Решение:**
1. Проверьте консоль браузера: `[Paddle] Missing Price ID`
2. Проверьте Price IDs в Paddle Dashboard
3. Обновите `PADDLE_PRICE_IDS` в PricingClient.tsx

### Middleware блокирует даже с подпиской

**Причина:** `current_period_end` в прошлом

**Решение:**
```sql
-- Проверьте дату:
SELECT org_id, status, current_period_end
FROM subscriptions
WHERE org_id = 'YOUR_ORG_ID';

-- Обновите:
UPDATE subscriptions
SET current_period_end = NOW() + INTERVAL '30 days'
WHERE org_id = 'YOUR_ORG_ID';
```

---

## 📚 Дополнительная документация

- [Полная документация интеграции](docs/PADDLE_FRONTEND_INTEGRATION.md)
- [SQL тесты подписок](scripts/test-subscription.sql)
- [Пример .env](.env.example)

---

## 🚀 Production Deployment

1. **Получите Production API Key** в [Paddle Production Dashboard](https://vendors.paddle.com/)
2. **Обновите environment:**
   ```bash
   NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
   ```
3. **Создайте Production Price IDs** и обновите код
4. **Настройте Webhook:**
   - URL: `https://ваш-домен.vercel.app/api/webhooks/paddle`
   - Secret: Скопируйте и добавьте `PADDLE_WEBHOOK_SECRET`

---

**Готово к запуску!** 🎉

Если возникнут вопросы, откройте issue или проверьте [документацию](docs/PADDLE_FRONTEND_INTEGRATION.md).
