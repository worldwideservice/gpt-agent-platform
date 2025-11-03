# 🌐 Автоматизация через браузер - Инструкция

> Пошаговое руководство для выполнения задач через веб-интерфейсы

## 🎯 Задача 1: Получить Sentry DSN

### Шаги:

1. **Откройте браузер:** https://sentry.io
2. **Войдите через Google:**
   - Нажмите "Sign In"
   - Выберите "Continue with Google"
   - Авторизуйтесь

3. **Найдите или создайте проект:**
   - Если проект есть: выберите его из списка
   - Если нет: Create Project → Next.js → `gpt-agent-platform`

4. **Получите DSN:**
   - Settings → Client Keys (DSN)
   - Скопируйте DSN (выглядит как: `https://xxx@sentry.io/xxx`)

5. **Автоматически добавьте в Vercel:**
   ```bash
   bash scripts/auto-setup-vercel-sentry.sh <ваш-dsn>
   ```

**✅ Результат:** Sentry DSN добавлен в Vercel автоматически!

---

## 🎯 Задача 2: Задеплоить Worker на Railway

### Шаги:

1. **Откройте браузер:** https://railway.app
2. **Войдите через GitHub:**
   - Нажмите "Start a New Project"
   - Выберите "Deploy from GitHub repo"
   - Авторизуйтесь через GitHub

3. **Выберите репозиторий:**
   - Найдите: `worldwideservice/gpt-agent-platform`
   - Выберите его

4. **Настройте Worker сервис:**
   - Если появился автоматически: нажмите на него
   - Если нет: "+ New" → "GitHub Repo" → Root Directory: `services/worker`

5. **Добавьте переменные окружения:**
   - Settings → Variables
   - Добавьте каждую переменную из `docs/RAILWAY_DEPLOY_NOW.md`:
     - REDIS_URL
     - SUPABASE_URL
     - SUPABASE_SERVICE_ROLE_KEY
     - ENCRYPTION_KEY
     - OPENROUTER_API_KEY
     - JOB_QUEUE_NAME
     - JOB_CONCURRENCY
     - PORT

6. **Дождитесь деплоя:**
   - Railway автоматически начнет сборку
   - Дождитесь зеленой галочки ✅

7. **Проверьте health check:**
   - Settings → Networking → Generate Domain
   - Скопируйте URL
   - Проверьте: `curl https://your-worker.up.railway.app/health`

**✅ Результат:** Worker работает в production!

---

## 🎯 Задача 3: Создать Sentry алерты

### Шаги:

1. **Откройте Sentry Dashboard:** https://sentry.io
2. **Перейдите в проект:** `gpt-agent-platform`
3. **Alerts** → **Create Alert Rule**

### Алерт 1: Critical Errors
- **Name:** `Critical Errors - High Error Rate`
- **When:** `The error rate is more than`
- **Threshold:** `5%`
- **In:** `5 minutes`
- **Environment:** `production`
- **Actions:** Email notifications

### Алерт 2: Health Check Failures
- **Name:** `Health Check Failed`
- **When:** `An issue matches`
- **Filter:** `url:"/api/health" OR message:"health check"`
- **Threshold:** `1 time`
- **In:** `1 minute`

### Алерт 3: Slow API Requests
- **Type:** Performance Alert
- **Name:** `Slow API Requests`
- **When:** `A transaction is slower than`
- **Threshold:** `5000ms`
- **Transactions:** `/api/chat`, `/api/agents/*`, `/api/dashboard/*`

### Алерт 4: New Error Types
- **Name:** `New Error Types Detected`
- **When:** `A new issue is created`
- **Environment:** `production`

**✅ Результат:** Все алерты настроены!

---

## ✅ Чеклист завершения

- [ ] Sentry DSN получен и добавлен в Vercel
- [ ] Worker задеплоен на Railway
- [ ] Health check Worker проходит
- [ ] 4 Sentry алерта созданы
- [ ] Email уведомления настроены

---

**📖 Детальные инструкции:** `docs/WORKER_DEPLOY_STEP_BY_STEP.md`


