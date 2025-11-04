# 🔍 Vercel Environment Variables Audit

**Дата проверки:** 2025-01-26  
**Проект:** gpt-agent-kwid

## 📊 Текущее состояние

### ✅ Найдено в Vercel (Production)

1. **Аутентификация:**
   - `NEXTAUTH_SECRET` ✅ (Production)
   - `NEXTAUTH_URL` ✅ (Production)

2. **Supabase:**
   - `SUPABASE_URL` ✅ (Production)
   - `SUPABASE_ANON_KEY` ✅ (Production)
   - `SUPABASE_SERVICE_ROLE_KEY` ✅ (Production)
   - `NEXT_PUBLIC_SUPABASE_URL` ✅ (Production)

3. **Kommo Integration:**
   - `KOMMO_WEBHOOK_SECRET` ✅ (All Environments)
   - `KOMMO_OAUTH_REDIRECT_BASE` ✅ (Production)

4. **SMTP:**
   - `SMTP_HOST` ✅ (All Environments)
   - `SMTP_PORT` ✅ (All Environments)
   - `SMTP_USER` ✅ (All Environments)
   - `SMTP_PASS` ✅ (All Environments)
   - `FROM_EMAIL` ✅ (All Environments)

5. **Cron:**
   - `CRON_SECRET` ✅ (All Environments)

6. **Sentry:**
   - `SENTRY_DSN` ✅ (Development, Preview, Production)
   - `NEXT_PUBLIC_SENTRY_DSN` ✅ (Development, Preview, Production)

---

## ❌ Отсутствуют обязательные переменные

### Критичные (обязательные):

1. `JWT_SECRET` - Дополнительный секрет для JWT
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Публичный анонимный ключ для клиентской стороны
3. `UPSTASH_REDIS_REST_URL` - REST URL для Upstash Redis
4. `UPSTASH_REDIS_REST_TOKEN` - REST токен для Upstash Redis (⚠️ СЕКРЕТНО)
5. `OPENROUTER_API_KEY` - API ключ для OpenRouter (⚠️ СЕКРЕТНО)
6. `ENCRYPTION_KEY` - Ключ шифрования для чувствительных данных (⚠️ СЕКРЕТНО)

### Важные (опциональные, но рекомендуемые):

1. `BACKEND_API_URL` - URL Fastify API сервиса
2. `FRONTEND_URL` - URL фронтенда для WebSocket CORS
3. `ADMIN_USERS` - Список email адресов администраторов
4. `SUPABASE_DEFAULT_ORGANIZATION_ID` - UUID организации по умолчанию

---

## ⚠️ Переменные которые НЕ должны быть в production

- `DEMO_MODE` - ❌ НЕТ (хорошо)
- `E2E_ONBOARDING_FAKE` - ❌ НЕТ (хорошо)

---

## 📝 Рекомендации

1. **Добавить обязательные переменные:**
   - Все 6 критичных переменных должны быть добавлены
   - Секретные переменные должны быть добавлены как Secrets (не Environment Variables)

2. **Проверить окружения:**
   - Некоторые переменные есть только в Production
   - Рекомендуется добавить основные переменные для All Environments

3. **Удалить лишнее:**
   - Лишних переменных не обнаружено (хорошо!)

---

## 🔄 Следующие шаги

1. Добавить недостающие обязательные переменные
2. Проверить Railway Dashboard для Worker сервиса
3. Создать финальный отчет

