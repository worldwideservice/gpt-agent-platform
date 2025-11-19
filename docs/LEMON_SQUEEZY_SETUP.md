# Налаштування Lemon Squeezy для проекту

## 📋 Кроки налаштування

### 1. Створення акаунту

1. Перейдіть на [lemonsqueezy.com](https://lemonsqueezy.com)
2. Зареєструйтесь (можна використовувати українську картку Монобанк/Приват)
3. Створіть Store

### 2. Створення продуктів і варіантів

1. У Lemon Squeezy створіть продукт (наприклад, "AI Agent Pro")
2. Додайте варіанти підписки:
   - **Starter Plan**: $29/місяць
   - **Pro Plan**: $99/місяць
   - **Enterprise Plan**: $299/місяць

3. Для кожного варіанту скопіюйте `Variant ID` (знадобиться для `.env`)

### 3. Налаштування API ключа

1. Перейдіть у **Settings → API**
2. Створіть новий API ключ
3. Скопіюйте ключ (показується тільки один раз!)

### 4. Налаштування Webhook

1. Перейдіть у **Settings → Webhooks**
2. Натисніть "+" для створення нового webhook
3. **URL**: `https://your-domain.com/api/webhooks/lemon-squeezy`
4. **Events** (виберіть всі події підписок):
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_expired`
   - `subscription_resumed`
   - `subscription_payment_success`
   - `subscription_payment_failed`

5. **Signing Secret**: скопіюйте (для верифікації webhook)

### 5. Додавання змінних оточення

Додайте в `.env.local`:

```bash
# Lemon Squeezy Configuration
LEMON_SQUEEZY_API_KEY=your_api_key_here
LEMON_SQUEEZY_STORE_ID=your_store_id_here
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here

# Variant IDs для різних планів
LEMON_SQUEEZY_STARTER_VARIANT_ID=123456
LEMON_SQUEEZY_PRO_VARIANT_ID=123457
LEMON_SQUEEZY_ENTERPRISE_VARIANT_ID=123458
```

### 6. Оновлення database schema

Запустіть міграцію для оновлення таблиці `subscriptions`:

```sql
-- Додати нові поля для Lemon Squeezy
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS lemon_squeezy_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS lemon_squeezy_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS variant_id TEXT,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS renews_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ;

-- Видалити старі Stripe поля (опціонально)
-- ALTER TABLE subscriptions DROP COLUMN IF EXISTS stripe_subscription_id;
-- ALTER TABLE subscriptions DROP COLUMN IF EXISTS stripe_customer_id;
-- ALTER TABLE subscriptions DROP COLUMN IF EXISTS stripe_price_id;

-- Оновити статуси підписок
ALTER TABLE subscriptions
  ALTER COLUMN status TYPE TEXT;

-- Додати індекси
CREATE INDEX IF NOT EXISTS idx_subscriptions_lemon_squeezy_id
  ON subscriptions(lemon_squeezy_subscription_id);
```

### 7. Тестування в development mode

1. Використайте **ngrok** або **локалтунел** для тестування webhooks локально:

```bash
npx localtunnel --port 3000
```

2. URL для webhook буде: `https://your-temp-url.loca.lt/api/webhooks/lemon-squeezy`

3. У Lemon Squeezy увімкніть **Test Mode** для тестових платежів

### 8. Використання в коді

#### Створення checkout сесії

```typescript
import { createCheckoutSession } from '@/lib/services/billing'

// У вашому API route
const checkoutUrl = await createCheckoutSession(
  tenantId,
  process.env.LEMON_SQUEEZY_PRO_VARIANT_ID!,
  `${process.env.NEXT_PUBLIC_APP_URL}/manage/${tenantId}/subscription/success`,
  `${process.env.NEXT_PUBLIC_APP_URL}/manage/${tenantId}/subscription/cancel`
)

if (checkoutUrl) {
  return Response.redirect(checkoutUrl)
}
```

#### Перевірка ліцензії

```typescript
import { checkLicense } from '@/lib/services/billing'

const license = await checkLicense(tenantId)

if (!license.isValid) {
  // Заблокувати функціонал
  return { error: 'Your subscription has expired' }
}
```

#### Скасування підписки

```typescript
import { cancelSubscription } from '@/lib/services/billing'

await cancelSubscription(tenantId, true) // true = скасувати після закінчення періоду
```

#### Отримання customer portal

```typescript
import { getCustomerPortalUrl } from '@/lib/services/billing'

const portalUrl = await getCustomerPortalUrl(tenantId)
// Перенаправити користувача на portalUrl для управління підпискою
```

## 🔒 Безпека

1. **Ніколи не комітьте** `.env.local` в git!
2. Додайте `.env.local` в `.gitignore`
3. На production використовуйте **Vercel Environment Variables**
4. Webhook signature завжди перевіряйте (зараз TODO в коді)

## 💰 Виплати

Lemon Squeezy підтримує виплати на:
- **PayPal** (найпростіший спосіб для України)
- **Wise** (Transfer Wise)
- Банківський переказ (SWIFT)

Мінімальна сума для виплати: $50

## 📊 Моніторинг

Всі події записуються в логи через `logger.info/warn/error`:

```typescript
// Подивитися логи
npm run logs

// Або у Vercel Dashboard → Logs
```

## 🚀 Production Deployment

1. Додайте змінні в **Vercel → Settings → Environment Variables**
2. Оновіть webhook URL на production URL
3. Вимкніть Test Mode у Lemon Squeezy
4. Перевірте, що webhook працює: Lemon Squeezy → Webhooks → Recent deliveries

## 🆘 Troubleshooting

### Webhook не приходить

1. Перевірте URL webhook в Lemon Squeezy
2. Подивіться "Recent deliveries" в Lemon Squeezy
3. Перевірте логи: `console.log` у `app/api/webhooks/lemon-squeezy/route.ts`

### Підписка не створюється

1. Перевірте, що `org_id` передається в checkout
2. Подивіться логи в Supabase → Logs
3. Перевірте, що таблиця `subscriptions` має всі необхідні поля

### Customer portal не відкривається

1. Переконайтесь, що підписка активна
2. Перевірте `lemon_squeezy_subscription_id` в БД
3. Подивіться логи помилок API

## 📚 Корисні посилання

- [Lemon Squeezy API Docs](https://docs.lemonsqueezy.com/api)
- [Lemon Squeezy Webhooks](https://docs.lemonsqueezy.com/api/webhooks)
- [Lemon Squeezy Testing](https://docs.lemonsqueezy.com/help/getting-started/test-mode)
