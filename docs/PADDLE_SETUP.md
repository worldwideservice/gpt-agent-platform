# Налаштування Paddle для проекту

## 📋 Про Paddle

Paddle - це платіжна платформа типу Merchant of Record, яка:
- ✅ Працює з українськими розробниками
- ✅ Підтримує виплати через **Wise** (можна вивести на українську картку без PayPal)
- ✅ Обробляє податки та комплаєнс автоматично
- ✅ Приймає платежі з усього світу (карти, PayPal, Apple Pay, Google Pay)
- ✅ Не потребує реєстрації ФОП в Україні

**Комісія**: 5% + $0.50 за транзакцію

## 📋 Кроки налаштування

### 1. Створення акаунту

1. Перейдіть на [paddle.com](https://paddle.com)
2. Натисніть "Get Started" → "Sign Up"
3. Заповніть форму реєстрації (можна використовувати особисті дані)
4. Підтвердіть email

### 2. Налаштування бізнес-профілю

1. Перейдіть у **Settings → Business Details**
2. Заповніть:
   - **Business Name**: Назва вашого бізнесу
   - **Country**: Ukraine
   - **Address**: Адреса (можна домашню)
   - **Tax ID**: Необов'язково для початку
3. Збережіть зміни

### 3. Створення продуктів і цін

1. Перейдіть у **Catalog → Products**
2. Натисніть **Create Product**
3. Заповніть форму:
   - **Name**: "AI Agent Pro"
   - **Description**: "AI Agent Platform Subscription"
   - **Tax Category**: "SaaS"

4. Додайте **Prices** (ціни) для кожного плану:

   **Starter Plan**:
   - Name: "Starter Plan"
   - Billing Cycle: Monthly
   - Amount: $29.00 USD
   - Trial Period: 14 days (опціонально)

   **Pro Plan**:
   - Name: "Pro Plan"
   - Billing Cycle: Monthly
   - Amount: $99.00 USD
   - Trial Period: 14 days (опціонально)

   **Enterprise Plan**:
   - Name: "Enterprise Plan"
   - Billing Cycle: Monthly
   - Amount: $299.00 USD
   - Trial Period: 14 days (опціонально)

5. Для кожної ціни скопіюйте **Price ID** (формат: `pri_...`)

### 4. Отримання API ключа

1. Перейдіть у **Developer Tools → Authentication**
2. Натисніть **Create API Key**
3. Заповніть:
   - **Name**: "Production API Key"
   - **Description**: "API key for production environment"
4. Скопіюйте **API Key** (показується тільки один раз!)
   - Формат: `pdl_live_apikey_...` (production) або `pdl_test_...` (sandbox)

### 5. Налаштування Webhook

1. Перейдіть у **Developer Tools → Notifications**
2. Натисніть **New Notification Destination**
3. Заповніть:
   - **Description**: "Production Webhook"
   - **Destination URL**: `https://your-domain.com/api/webhooks/paddle`
   - **Type**: URL

4. **Subscribe to Events** (виберіть всі події підписок):
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.expired`
   - `subscription.resumed`
   - `subscription.paused`
   - `transaction.completed`
   - `transaction.payment_failed`

5. Збережіть та скопіюйте **Webhook Secret Key**

### 6. Додавання змінних оточення

Додайте в `.env.local`:

```bash
# Paddle Billing Configuration
PADDLE_API_KEY=pdl_live_apikey_01kaeep48yxa0v0qj32bj52f5m_QXHn8TMnnc0q6HhjeKvrY1_AbX
PADDLE_WEBHOOK_SECRET=pdwhsec_your_webhook_secret_here
PADDLE_ENVIRONMENT=production

# Price IDs для різних планів
PADDLE_STARTER_PRICE_ID=pri_01hqr123456789
PADDLE_PRO_PRICE_ID=pri_01hqr987654321
PADDLE_ENTERPRISE_PRICE_ID=pri_01hqr111222333
```

### 7. Застосування міграції бази даних

Запустіть міграцію для оновлення таблиці `subscriptions`:

```bash
# Через Supabase CLI
supabase db push

# Або через Supabase Dashboard → SQL Editor
# Скопіюйте вміст файлу supabase/migrations/20250119_paddle_integration.sql
```

Міграція виконає:
- ✅ Додасть колонки `paddle_subscription_id`, `paddle_customer_id`, `price_id`
- ✅ Перейменує старі Lemon Squeezy колонки в `legacy_ls_*`
- ✅ Створить індекси для швидкого пошуку
- ✅ Оновить RLS policies

### 8. Тестування в Sandbox mode

Для тестування локально використовуйте **Sandbox** режим:

1. Створіть окремий API ключ у Paddle:
   - **Developer Tools → Authentication → Create API Key**
   - **Environment**: Sandbox
   - Формат ключа: `pdl_test_...`

2. Додайте в `.env.local`:
```bash
PADDLE_ENVIRONMENT=sandbox
PADDLE_API_KEY=pdl_test_your_sandbox_key
```

3. Використайте **ngrok** для тестування webhooks локально:

```bash
# Встановіть ngrok
npm install -g ngrok

# Запустіть ngrok
ngrok http 3000

# URL для webhook буде:
# https://your-random-id.ngrok.io/api/webhooks/paddle
```

4. Оновіть webhook URL у Paddle Dashboard на ngrok URL

5. Тестові картки для Sandbox:
   - **Успішна оплата**: `4242 4242 4242 4242`
   - **Відхилена оплата**: `4000 0000 0000 0002`
   - CVV: будь-які 3 цифри
   - Expiry: будь-яка майбутня дата

### 9. Використання в коді

#### Створення checkout сесії

```typescript
import { createCheckoutSession } from '@/lib/services/billing'

// У вашому API route
const checkoutUrl = await createCheckoutSession(
  tenantId,
  process.env.PADDLE_PRO_PRICE_ID!,
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

console.log(`License valid for ${license.daysLeft} days`)
```

#### Скасування підписки

```typescript
import { cancelSubscription } from '@/lib/services/billing'

// Скасувати в кінці періоду (рекомендовано)
await cancelSubscription(tenantId, true)

// Скасувати негайно
await cancelSubscription(tenantId, false)
```

#### Відновлення підписки

```typescript
import { resumeSubscription } from '@/lib/services/billing'

await resumeSubscription(tenantId)
```

#### Зміна плану

```typescript
import { changeSubscriptionPlan } from '@/lib/services/billing'

await changeSubscriptionPlan(tenantId, process.env.PADDLE_ENTERPRISE_PRICE_ID!)
```

#### Отримання customer portal

```typescript
import { getCustomerPortalUrl } from '@/lib/services/billing'

const portalUrl = await getCustomerPortalUrl(tenantId)
// Перенаправити користувача на portalUrl для управління підпискою
```

## 🔒 Безпека

1. **Ніколи не комітьте** `.env.local` в git!
2. Додайте `.env.local` в `.gitignore` (вже додано)
3. На production використовуйте **Vercel Environment Variables**
4. Webhook signature **завжди перевіряється** автоматично

## 💰 Налаштування виплат через Wise

1. Перейдіть у **Settings → Payouts**
2. Виберіть **Add Payout Method → Wise**
3. Підключіть ваш Wise акаунт:
   - Якщо немає Wise акаунту:
     - Зареєструйтесь на [wise.com](https://wise.com)
     - Підтвердьте особу (потрібен паспорт)
     - Додайте українську картку для виводу
   - Підключіть Wise до Paddle
4. Налаштуйте автоматичні виплати або вивід вручну

**Мінімальна сума для виплати**: $50

**Як вивести гроші на українську картку**:
1. Paddle → Wise (автоматично)
2. Wise → Українська картка (Monobank/Privatbank)

**Комісія Wise**: ~0.5-1% за конвертацію USD → UAH

## 📊 Моніторинг

### Перегляд логів

```bash
# Локально (розробка)
npm run dev

# Production логи у Vercel
vercel logs --follow
```

### Перевірка webhooks

1. **Paddle Dashboard → Developer Tools → Notifications**
2. Виберіть ваш webhook
3. Перегляньте **Event Log** для всіх отриманих подій
4. Можна передіслати події (Resend) для тестування

### Тестування webhook локально

```bash
# Використайте Paddle CLI для відправки тестових webhooks
npx paddle-cli webhook send subscription.created \
  --webhook-url http://localhost:3000/api/webhooks/paddle \
  --data '{"id": "sub_test123", "status": "active"}'
```

## 🚀 Production Deployment

### 1. Додайте змінні в Vercel

```bash
# Через Vercel CLI
vercel env add PADDLE_API_KEY production
vercel env add PADDLE_WEBHOOK_SECRET production
vercel env add PADDLE_ENVIRONMENT production

# Або через Vercel Dashboard
# Settings → Environment Variables
```

### 2. Оновіть webhook URL

1. **Paddle Dashboard → Developer Tools → Notifications**
2. Знайдіть ваш webhook
3. Оновіть **Destination URL** на:
   ```
   https://your-production-domain.com/api/webhooks/paddle
   ```

### 3. Перевірте що все працює

```bash
# Deploy на production
vercel --prod

# Перевірте логи
vercel logs --follow

# Зробіть тестову оплату
```

### 4. Переключіться з Sandbox на Production

1. Змініть `PADDLE_ENVIRONMENT=production` у Vercel
2. Використовуйте live API key (`pdl_live_...`)
3. Використовуйте production webhook secret
4. Тестуйте з реальною карткою (буде списано)

## 🆘 Troubleshooting

### Webhook не приходить

1. **Перевірте URL**: Paddle Dashboard → Notifications → перевірте Destination URL
2. **Перевірте Event Log**: Paddle показує чи webhook був доставлений
3. **Статус код**: Ваш endpoint повинен повертати `200 OK`
4. **Перевірте логи**: `vercel logs` або `npm run dev`
5. **HTTPS обов'язковий**: Paddle не відправляє webhooks на HTTP

### Підписка не створюється

1. **Перевірте custom_data**: `org_id` повинен передаватись у checkout
2. **Перевірте логи Supabase**: Database → Logs
3. **Перевірте міграцію**: таблиця `subscriptions` має всі колонки
4. **Перевірте webhook events**: чи приходить `subscription.created`

### API помилки (401 Unauthorized)

1. **Перевірте PADDLE_API_KEY**: правильний формат `pdl_live_...` або `pdl_test_...`
2. **Environment**: Sandbox ключ не працює з production, і навпаки
3. **Перевірте Paddle Dashboard**: чи ключ активний

### Signature verification failed

1. **Перевірте PADDLE_WEBHOOK_SECRET**: правильний секрет з Paddle Dashboard
2. **Заголовок**: Paddle відправляє `Paddle-Signature` (з великої літери)
3. **Формат**: `ts=timestamp;h1=signature`

### Customer portal не відкривається

1. **Підписка повинна бути активна**: статус `active` або `trialing`
2. **Перевірте paddle_subscription_id**: він повинен існувати в БД
3. **API помилка**: перевірте логи

### Комісія більша ніж очікувалось

1. **Paddle комісія**: 5% + $0.50
2. **Валютна конвертація**: якщо клієнт платить не в USD
3. **Податки**: Paddle автоматично додає VAT/Sales Tax (залежить від країни покупця)
4. **Wise комісія**: ~0.5-1% за вивід

## 📚 Корисні посилання

- [Paddle API Documentation](https://developer.paddle.com/api-reference/overview)
- [Paddle Webhooks Guide](https://developer.paddle.com/webhooks/overview)
- [Paddle Sandbox Testing](https://developer.paddle.com/concepts/sell/sandbox)
- [Paddle Pricing](https://www.paddle.com/pricing)
- [Wise для бізнесу](https://wise.com/gb/business/)

## 💡 Поради

1. **Використовуйте Sandbox** для всіх тестів перед переходом на production
2. **Логуйте всі webhook події** для дебагу
3. **Тестуйте різні сценарії**:
   - Успішна оплата
   - Відхилена оплата
   - Скасування підписки
   - Зміна плану
   - Trial період
4. **Налаштуйте Sentry/Logging** для відстеження помилок
5. **Регулярно перевіряйте Paddle Dashboard** на аномалії

## 🎯 Next Steps

Після налаштування Paddle:

1. ✅ Створіть продукти та ціни в Paddle
2. ✅ Додайте Price IDs в `.env.local`
3. ✅ Застосуйте міграцію бази даних
4. ✅ Протестуйте checkout у Sandbox
5. ✅ Налаштуйте webhooks
6. ✅ Підключіть Wise для виплат
7. ✅ Deploy на production
8. ✅ Зробіть тестову транзакцію
9. ✅ Моніторте логи та webhook events
