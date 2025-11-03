# ⚡ Быстрый старт DevOps реализации

> Начните с этих 3 шагов (15-30 минут)

## 🎯 Шаг 1: Задеплоить Worker (15 минут)

👉 **📖 ДЕТАЛЬНАЯ ИНСТРУКЦИЯ:** `docs/WORKER_DEPLOY_STEP_BY_STEP.md`

### Быстро:

1. **Откройте:** https://railway.app
2. **Войдите** через GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Выберите репозиторий: `worldwideservice/gpt-agent-platform`
5. Railway обнаружит несколько сервисов - выберите или создайте сервис с:
   - **Root Directory:** `services/worker` ⚠️ **КРИТИЧНО!**
6. **Settings** → **Variables** → Добавьте переменные из `docs/RAILWAY_DEPLOY_NOW.md`
7. Деплой запустится автоматически ✅

**Проверка:** После деплоя проверьте health check:
```bash
curl https://your-worker.up.railway.app/health
```

**📋 Готовые значения:** `docs/RAILWAY_DEPLOY_NOW.md`

---

## 🎯 Шаг 2: Настроить Sentry DSN (10 минут)

👉 **📖 ДЕТАЛЬНАЯ ИНСТРУКЦИЯ:** `docs/SENTRY_DSN_STEP_BY_STEP.md`

### Быстро:

1. **Откройте:** https://sentry.io
2. Войдите в ваш проект
3. **Settings** → **Client Keys (DSN)**
4. Скопируйте DSN (выглядит как: `https://xxx@sentry.io/xxx`)

### Добавить в Vercel:

1. **Vercel Dashboard** → Ваш проект → **Settings** → **Environment Variables**
2. Добавьте:
   - `SENTRY_DSN` = `<ваш-dsn>`
   - `NEXT_PUBLIC_SENTRY_DSN` = `<ваш-dsn>`
3. Выберите: **Production**, **Preview**, **Development**
4. **Save**

**💡 Альтернатива:** `bash scripts/get-sentry-dsn.sh <org-slug> <project-slug>`

---

## 🎯 Шаг 3: Создать Sentry Алерты (15 минут)

1. **Sentry Dashboard** → **Alerts** → **Create Alert Rule**
2. Создайте 4 алерта согласно `docs/SENTRY_ALERTS.md`:

   **Алерт 1: Critical Errors**
   - Error Rate > 5%
   - Priority: Critical
   
   **Алерт 2: Health Check Failures**
   - URL contains: `/api/health`
   - Threshold: 1 раз в 1 минуту
   
   **Алерт 3: Slow API Requests**
   - Transaction slower than 5000ms
   - Transaction names: `/api/chat`, `/api/agents/*`
   
   **Алерт 4: New Error Types**
   - New issue created
   - Priority: Info

3. **Настройте интеграции:**
   - Settings → Integrations → Slack (если нужно)
   - Settings → Notifications → Email

**📋 Детальная инструкция:** `docs/SENTRY_ALERTS.md`

---

## ✅ Чеклист завершения этапа 1:

- [ ] Worker задеплоен на Railway
- [ ] Health check проходит: `/health` возвращает 200
- [ ] Sentry DSN получен и добавлен в Vercel
- [ ] 4 критичных алерта созданы в Sentry
- [ ] Email/Slack уведомления настроены

---

## 📊 Прогресс

После выполнения этих 3 шагов:
- ✅ Worker работает в production
- ✅ Мониторинг ошибок активен
- ✅ Алерты настроены

**Следующий этап:** URGENT задачи (бэкапы БД, security audit)

---

**Время выполнения:** 30-45 минут  
**Приоритет:** 🔴 Критично

