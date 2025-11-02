# 🚀 Финальная настройка Production

## ✅ Выполненные шаги:
- ✅ Git инициализация и коммит
- ✅ Сборка проекта (npm run build) - успешна
- ✅ Генерация NEXTAUTH_SECRET
- ✅ Supabase проект подключен (rpzchsgutabxeabbnwas)

## 🔧 Оставшиеся шаги для production:

### 1. Настройка Supabase Database
**Перейдите:** https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/sql

**Выполните SQL:**
```sql
-- Скопируйте и выполните содержимое файла:
-- scripts/apply-all-setup.sql
```

### 2. Настройка Storage Bucket
**В том же SQL Editor выполните:**
```sql
-- Скопируйте и выполните содержимое файла:
-- scripts/create-storage-bucket.sql
```

### 3. Настройка Authentication
**Перейдите:** https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/auth/settings

**Добавьте Redirect URLs:**
```
https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/api/auth/callback/*
https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback
```

### 4. Получение API ключей
**Перейдите:** https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/settings/api

**Скопируйте:**
- `anon public` → SUPABASE_ANON_KEY
- `service_role secret` → SUPABASE_SERVICE_ROLE_KEY

### 5. Настройка Vercel Environment Variables
**Перейдите:** https://vercel.com/dashboard (проект gpt-agent-kwid)

**Добавьте переменные:**
```
NEXTAUTH_SECRET=XH9mgmu70y7LaauJBoI7ynjGXlja6u4JCE894ZeKgKk=
NEXTAUTH_URL=https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app
SUPABASE_URL=https://rpzchsgutabxeabbnwas.supabase.co
SUPABASE_ANON_KEY=[ваш_anon_key]
SUPABASE_SERVICE_ROLE_KEY=[ваш_service_role_key]
OPENROUTER_API_KEY=[ваш_openrouter_key]
NODE_ENV=production
DEMO_MODE=false
E2E_ONBOARDING_FAKE=false
```

### 6. Получение OpenRouter API Key
**Перейдите:** https://openrouter.ai/keys
**Создайте API key для production**

### 7. Redis (опционально)
**Upstash:** https://console.upstash.com/
- Создайте Redis database
- Добавьте REDIS_URL в Vercel

### 8. Первый запуск и SUPABASE_DEFAULT_ORGANIZATION_ID
После настройки:
1. Перейдите на сайт
2. Зарегистрируйтесь
3. Создайте организацию
4. Получите ID организации из Supabase Dashboard
5. Добавьте `SUPABASE_DEFAULT_ORGANIZATION_ID=[org_id]` в Vercel

## 🔍 Проверка готовности:
```bash
# Локально проверить переменные:
npm run verify:env

# Проверить билд:
npm run build

# Запустить тесты (требует переменных окружения):
npm run test
```

## 📊 Текущее состояние:
- ✅ Проект собран и задеплоен на Vercel
- ✅ База данных Supabase подключена
- ✅ Переменные окружения подготовлены
- ⏳ Ждет финальной настройки ключей и миграций

## 🎯 Production URL:
https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app
