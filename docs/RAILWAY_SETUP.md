# 🚂 Настройка Worker на Railway

> Пошаговая инструкция по деплою Worker сервиса на Railway с использованием токена

## 🔑 Railway Token

Ваш Railway токен: `5cd06a89-c580-450d-958c-6b1553bb1428`

---

## 📋 Шаг 1: Установка Railway CLI

```bash
npm install -g @railway/cli
```

---

## 📋 Шаг 2: Авторизация с токеном

### Вариант A: Через переменную окружения

```bash
export RAILWAY_TOKEN="5cd06a89-c580-450d-958c-6b1553bb1428"
railway login
```

### Вариант B: Через Railway Dashboard

1. Откройте https://railway.app
2. Войдите через GitHub
3. Settings → Tokens → Create Token
4. Используйте токен для авторизации

---

## 📋 Шаг 3: Инициализация проекта

```bash
cd services/worker
railway init
```

При запросе:
- **Project name:** `gpt-agent-worker`
- **Service name:** `worker`
- **Root directory:** `services/worker` (если не автоматически)

---

## 📋 Шаг 4: Настройка переменных окружения

### Через Railway CLI:

```bash
railway variables set REDIS_URL="your-redis-url"
railway variables set SUPABASE_URL="https://your-project.supabase.co"
railway variables set SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
railway variables set ENCRYPTION_KEY="your-32-char-encryption-key"
railway variables set OPENROUTER_API_KEY="sk-or-v1-..."
railway variables set JOB_QUEUE_NAME="agent-jobs"
railway variables set JOB_CONCURRENCY="5"
railway variables set PORT="3001"
```

### Через Railway Dashboard:

1. Откройте ваш проект в Railway
2. Выберите сервис `worker`
3. Settings → Variables
4. Добавьте каждую переменную:

**Обязательные:**
- `REDIS_URL` - URL вашего Redis (Upstash)
- `SUPABASE_URL` - URL вашего Supabase проекта
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key из Supabase
- `ENCRYPTION_KEY` - 32-символьный ключ шифрования

**Опциональные:**
- `OPENROUTER_API_KEY` - для генерации embeddings (если используется)
- `JOB_QUEUE_NAME` - имя очереди (по умолчанию: `agent-jobs`)
- `JOB_CONCURRENCY` - количество параллельных задач (по умолчанию: `5`)
- `PORT` - порт для health check (по умолчанию: `3001`)

---

## 📋 Шаг 5: Деплой

### Вариант A: Через Railway Dashboard (Рекомендуется)

1. Railway автоматически обнаружит `railway.json` и `Dockerfile`
2. Перейдите в Settings → Source
3. Убедитесь что:
   - **Root Directory:** `services/worker`
   - **Build Command:** (автоматически из Dockerfile)
   - **Start Command:** (автоматически из Dockerfile)

4. Нажмите **Deploy** или дождитесь автоматического деплоя

### Вариант B: Через CLI

```bash
cd services/worker
railway up
```

---

## ✅ Шаг 6: Проверка деплоя

### Проверить статус:

```bash
railway status
```

### Проверить логи:

```bash
railway logs
```

### Проверить health check:

```bash
# Получить URL деплоя
railway domain

# Проверить health check
curl https://your-worker.railway.app/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "service": "worker",
  "timestamp": "2025-01-XX..."
}
```

---

## 🔧 Troubleshooting

### Проблема: "Build failed"

**Решение:**
- Проверьте что `Dockerfile` существует в `services/worker/`
- Проверьте логи: `railway logs`
- Убедитесь что `package.json` в корне `services/worker/`

### Проблема: "Environment variables missing"

**Решение:**
- Проверьте что все обязательные переменные добавлены
- Проверьте через: `railway variables`

### Проблема: "Health check fails"

**Решение:**
- Проверьте что `PORT` переменная установлена
- Проверьте логи worker
- Убедитесь что health endpoint работает: `/health`

---

## 📊 Мониторинг

### Просмотр метрик:

```bash
railway metrics
```

### Просмотр логов в реальном времени:

```bash
railway logs --follow
```

---

## 🔄 Обновление деплоя

После изменений в коде:

```bash
cd services/worker
railway up
```

Или просто push в GitHub - Railway автоматически задеплоит изменения если настроен GitHub integration.

---

## 🔗 Полезные команды

```bash
# Список всех проектов
railway list

# Открыть проект в браузере
railway open

# Просмотр всех переменных
railway variables

# Обновление переменной
railway variables set KEY="value"

# Удаление переменной
railway variables unset KEY
```

---

**Последнее обновление:** 2025-01-XX  
**Статус:** ✅ Готово к использованию

