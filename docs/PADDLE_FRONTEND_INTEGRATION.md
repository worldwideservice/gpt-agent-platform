# Paddle Frontend Integration - Инструкция по интеграции

## Статус интеграции

✅ **Backend готов**:
- API endpoints для webhook (`/api/webhooks/paddle`)
- Middleware проверка лицензии
- Billing service с Paddle REST API

⏳ **Frontend требует доработки**:
- Добавлен `@paddle/paddle-js` в package.json
- Нужно установить: `npm install` (или `rm -rf node_modules && npm install`)
- Нужно обновить `PricingClient.tsx`

## ШАГ 1: Установка зависимостей

```bash
cd "/Users/maksimgolovaty/Library/Mobile Documents/com~apple~CloudDocs/Development/AI agent"

# Если ошибки с iCloud (node_modules/* 2), переместите проект из iCloud
rm -rf node_modules
npm install
```

## ШАГ 2: Настройка Environment Variables

Добавьте в `.env.local`:

```bash
# Paddle Client Token (из Dashboard -> Developer tools -> Authentication)
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_ваш_токен_здесь

# Environment: sandbox или production
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
```

## ШАГ 3: Получение Paddle Price IDs

1. Зайдите в Paddle Dashboard: https://sandbox-vendors.paddle.com/ (или production)
2. Products → Create Product для каждого тарифа (Starter, Scale, Enterprise)
3. Для каждого продукта создайте 2 цены:
   - Monthly Price (например: `pri_starter_monthly`)
   - Yearly Price (например: `pri_starter_yearly`)

4. Запишите Price IDs:

```typescript
const PADDLE_PRICE_IDS = {
  starter: {
    month: 'pri_01...',  // Замените на реальный ID
    year: 'pri_02...',
  },
  scale: {
    month: 'pri_03...',
    year: 'pri_04...',
  },
  enterprise: {
    month: 'pri_05...',
    year: 'pri_06...',
  },
}
```

## ШАГ 4: Обновление PricingClient.tsx

Замените функцию `handlePlanSelection` в `components/features/pricing-internal/PricingClient.tsx`:

```typescript
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { initializePaddle, type Paddle } from '@paddle/paddle-js'

// Добавьте в начало компонента:
const [paddle, setPaddle] = useState<Paddle | null>(null)
const { data: session } = useSession()

// Инициализация Paddle
useEffect(() => {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
  if (token) {
    initializePaddle({
      token,
      environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as 'sandbox' | 'production',
      eventCallback: (data) => {
        if (data.name === 'checkout.completed') {
          toast({ title: 'Оплата успешна!' })
          queryClient.invalidateQueries({ queryKey })
        }
      },
    }).then(setPaddle)
  }
}, [])

// Обновите обработчик:
const handlePlanSelection = (planId: string, interval: Interval) => {
  const hasActiveSubscription = data?.subscription?.status === 'active'

  if (!hasActiveSubscription && paddle) {
    // Новая покупка через Paddle Checkout
    const priceId = PADDLE_PRICE_IDS[planId]?.[interval]

    if (!priceId) {
      toast({ title: 'Ошибка', description: 'Price ID не найден', variant: 'destructive' })
      return
    }

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: session?.user?.email || '' },
      customData: { orgId: tenantId, planId, interval },
    })
  } else {
    // Смена существующего плана через API
    changePlan({ newPlanId: planId, interval })
  }
}

// Передайте в PricingPlanCard:
<PricingPlanCard
  onChangePlan={handlePlanSelection}
  // ... остальные props
/>
```

## ШАГ 5: Тестирование (локально)

### Вариант А: Эмуляция через SQL (быстрый тест)

```sql
-- Вставьте фейковую подписку для тестирования middleware
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
  'ВАШ_ORG_ID',  -- Замените на реальный
  'sub_test_123',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days',
  'pro_monthly'
);
```

### Вариант Б: Тест через Paddle Sandbox

1. Откройте `http://localhost:3000/manage/[tenantId]/pricing`
2. Нажмите "Выбрать план"
3. Должен открыться Paddle Checkout overlay
4. Используйте тестовую карту: `4242 4242 4242 4242`

## ШАГ 6: Настройка Webhook в Paddle Dashboard

1. Developer tools → Notifications → Create notification
2. Webhook URL: `https://ваш-домен.vercel.app/api/webhooks/paddle`
3. Events: выберите все subscription events
4. Скопируйте Webhook Secret
5. Добавьте в Vercel env: `PADDLE_WEBHOOK_SECRET=вашсекрет`

## Финальный чеклист

- [ ] `npm install` выполнен успешно
- [ ] `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` добавлен в `.env.local`
- [ ] Price IDs созданы в Paddle Dashboard
- [ ] `PricingClient.tsx` обновлен с Paddle integration
- [ ] Тестовая подписка создана в Supabase
- [ ] Middleware блокирует мутации без подписки (тест 402)
- [ ] LicenseAlert показывает дату истечения в header
- [ ] NotificationsPanelClient показывает алерт при истекшей лицензии

## Troubleshooting

### Ошибка: "Paddle is not defined"

- Проверьте, что `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` установлен
- Убедитесь, что `@paddle/paddle-js` установлен
- Перезапустите dev server

### Checkout не открывается

- Проверьте консоль браузера на ошибки
- Убедитесь, что Price ID корректный
- Проверьте, что Paddle Environment соответствует токену (sandbox/production)

### Middleware блокирует даже с активной подпиской

- Проверьте `current_period_end` в таблице `subscriptions`
- Убедитесь, что `status = 'active'`
- Проверьте `org_id` совпадает с текущим tenantId

## Следующие шаги

После успешной интеграции:
1. Настройте Production Paddle account
2. Смените `NEXT_PUBLIC_PADDLE_ENVIRONMENT` на `production`
3. Обновите Price IDs на production
4. Настройте webhook на production URL
