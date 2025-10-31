# 🚀 PRODUCTION DEPLOYMENT GUIDE

## 🎯 ОБЗОР
Этот гайд поможет вам настроить полное продакшен окружение для AI Agent Platform.

## 📋 ПРЕДВАРИТЕЛЬНЫЕ ТРЕБОВАНИЯ

### 1. Аккаунты и Сервисы
- ✅ [Vercel Account](https://vercel.com) - для хостинга
- ✅ [Supabase Account](https://supabase.com) - база данных
- ✅ [Upstash Redis](https://upstash.com) - Redis для rate limiting и background jobs
- ✅ [OpenRouter Account](https://openrouter.ai) - AI API

---

## 🔧 ШАГ 1: НАСТРОЙКА SUPABASE

### 1.1 Создание проекта
1. Перейдите в [Supabase Dashboard](https://supabase.com/dashboard)
2. Нажмите "New Project"
3. Заполните:
   - **Name:** `ai-agent-platform-prod`
   - **Database Password:** Создайте сильный пароль
   - **Region:** Выберите ближайший регион

### 1.2 Настройка базы данных
1. Дождитесь создания проекта (5-10 минут)
2. Перейдите в **SQL Editor**
3. Выполните скрипт из файла `scripts/setup-production-database.sql`

### 1.3 Получение ключей API
В **Settings > API** скопируйте:
- **Project URL:** `https://your-project-ref.supabase.co`
- **anon public key**
- **service_role secret key**

---

## 🔧 ШАГ 2: НАСТРОЙКА REDIS (UPSTASH)

### 2.1 Создание Redis базы
1. Перейдите в [Upstash Console](https://console.upstash.com)
2. Нажмите "Create Database"
3. Выберите **Redis**
4. Заполните:
   - **Name:** `ai-agent-platform-prod`
   - **Region:** Выберите ближайший регион

### 2.2 Получение подключения
В **Database Details** скопируйте:
- **REST URL:** `https://your-redis-id.upstash.io`
- **REST Token:** Ваш токен

---

## 🔧 ШАГ 3: НАСТРОЙКА VERCEL

### 3.1 Импорт проекта
1. Перейдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Нажмите "Import Project"
3. Выберите **From Git Repository**
4. Подключите ваш GitHub репозиторий

### 3.2 Настройка переменных окружения

Перейдите в **Project Settings > Environment Variables** и добавьте:

#### ОБЯЗАТЕЛЬНЫЕ ПЕРЕМЕННЫЕ:

```bash
# === АУТЕНТИФИКАЦИЯ ===
NEXTAUTH_SECRET=ваш_секрет_минимум_32_символа
NEXTAUTH_URL=https://ваш-домен.vercel.app

# === SUPABASE ===
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=ваш_anon_key
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key

# === REDIS ===
UPSTASH_REDIS_REST_URL=https://ваш-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=ваш_redis_token

# === AI API ===
OPENROUTER_API_KEY=sk-or-v1-ваш_openrouter_key

# === ПРОДАКШЕН ===
NODE_ENV=production
DEMO_MODE=false
E2E_ONBOARDING_FAKE=false
```

#### ОПЦИОНАЛЬНЫЕ ПЕРЕМЕННЫЕ:

```bash
# === АДМИН ДОСТУП ===
ADMIN_USERS=admin@company.com,manager@company.com

# === SENTRY MONITORING ===
SENTRY_DSN=https://ваш-sentry-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://ваш-sentry-dsn@sentry.io/project-id

# === PAYMENT PROCESSING ===
STRIPE_PUBLISHABLE_KEY=pk_live_ваш_stripe_key
STRIPE_SECRET_KEY=sk_live_ваш_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_ваш_webhook_secret

# === EMAIL SERVICE ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ваш-email@gmail.com
SMTP_PASS=ваш_app_password
```

### 3.3 Настройка домена (опционально)
1. В **Project Settings > Domains**
2. Добавьте ваш кастомный домен
3. Следуйте инструкциям DNS настройки

### 3.4 Deploy
1. Нажмите **Deploy** в Vercel Dashboard
2. Дождитесь завершения deployment
3. Проверьте что все работает на продакшен URL

---

## 🔧 ШАГ 4: ЗАПУСК МИГРАЦИЙ

### 4.1 Локальная настройка (для тестирования)
```bash
# Установите переменные окружения локально
cp env.example .env.local

# Запустите миграции
npm run db:migrate

# Запустите seeding
npm run db:seed
```

### 4.2 Supabase Dashboard
1. Перейдите в **SQL Editor**
2. Выполните скрипты миграций из `supabase/migrations/`
3. Проверьте что таблицы созданы

---

## 🔧 ШАГ 5: ЗАПУСК BACKGROUND WORKER

### 5.1 Настройка worker сервера
Для background jobs вам нужен отдельный сервер. Рекомендуем:

#### Вариант 1: Railway
1. Создайте аккаунт на [Railway](https://railway.app)
2. Создайте новый проект
3. Добавьте переменные окружения (те же что и в Vercel)
4. Деплойте из GitHub

#### Вариант 2: Heroku
1. Создайте Heroku app
2. Добавьте Redis addon
3. Настройте переменные окружения
4. Деплойте worker

#### Вариант 3: VPS
```bash
# На вашем сервере
git clone https://github.com/your-repo/ai-agent-platform.git
cd ai-agent-platform
npm install --production=false
npm run build:worker
npm run start:worker
```

---

## 🔧 ШАГ 6: ТЕСТИРОВАНИЕ ПРОДАКШЕНА

### 6.1 Проверка здоровья
```bash
# Health check
curl https://ваш-домен.vercel.app/api/health

# Readiness check
curl https://ваш-домен.vercel.app/api/health/ready
```

### 6.2 Тестирование функционала
1. **Регистрация/Вход:** Создайте тестового пользователя
2. **Создание агента:** Проверьте создание AI агента
3. **Чат:** Протестируйте общение с агентом
4. **Админ панель:** Проверьте доступ к `/admin`
5. **GraphQL:** Проверьте `/graphql-playground`

### 6.3 Проверка лимитов
1. **Rate Limiting:** Попробуйте превысить лимиты API
2. **Background Jobs:** Создайте задачу на обработку файла
3. **WebSocket:** Проверьте real-time уведомления

---

## 🔧 ШАГ 7: МОНИТОРИНГ И ОБСЛУЖИВАНИЕ

### 7.1 Sentry (рекомендуется)
1. Создайте проект в [Sentry](https://sentry.io)
2. Добавьте DSN в переменные окружения
3. Настройте alerts для ошибок

### 7.2 Аналитика
1. **Vercel Analytics:** Включено автоматически
2. **Google Analytics:** Добавьте GA4 код
3. **Custom Analytics:** Используйте встроенную систему аналитики

### 7.3 Backups
1. **Supabase:** Автоматические ежедневные бэкапы
2. **Redis:** Upstash имеет persistence
3. **Ручные бэкапы:** Регулярно экспортируйте важные данные

---

## 🚨 ПРОБЛЕМЫ И РЕШЕНИЯ

### Проблема: Build fails в Vercel
**Решение:**
- Проверьте переменные окружения
- Убедитесь что все dependencies установлены
- Проверьте логи сборки

### Проблема: Database connection fails
**Решение:**
- Проверьте SUPABASE_URL и ключи
- Убедитесь что IP адрес Vercel добавлен в Supabase allowlist
- Проверьте RLS политики

### Проблема: Redis connection fails
**Решение:**
- Проверьте UPSTASH_REDIS_REST_URL и токен
- Убедитесь что Redis база активна в Upstash
- Проверьте network connectivity

### Проблема: AI API не работает
**Решение:**
- Проверьте OPENROUTER_API_KEY
- Убедитесь что у вас есть кредиты в OpenRouter
- Проверьте rate limits OpenRouter

---

## 📊 ПРОДАКШЕН ЧЕКЛИСТ

- ✅ Supabase проект создан и настроен
- ✅ Redis (Upstash) настроен
- ✅ Vercel проект импортирован
- ✅ Переменные окружения добавлены
- ✅ Домены настроены (опционально)
- ✅ Первый deployment успешен
- ✅ Миграции выполнены
- ✅ Background worker запущен
- ✅ Health checks проходят
- ✅ Основной функционал протестирован
- ✅ Мониторинг настроен
- ✅ Backups проверены

---

## 🎯 СЛЕДУЮЩИЕ ШАГИ

1. **Масштабирование:** Настройте auto-scaling в Vercel
2. **CDN:** Настройте Vercel Edge Network
3. **Security:** Добавьте WAF и DDoS protection
4. **Performance:** Настройте caching стратегии
5. **Monitoring:** Добавьте APM инструменты

---

## 📞 ПОДДЕРЖКА

Если возникли проблемы:
1. Проверьте логи в Vercel Dashboard
2. Проверьте Supabase/Redis консоли
3. Создайте issue в GitHub репозитории
4. Свяжитесь с разработчиками

---

**🎉 ПОЗДРАВЛЯЕМ! ВАША AI AGENT PLATFORM ГОТОВА К ПРОДАКШЕНУ!**
