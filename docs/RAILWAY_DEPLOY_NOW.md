# 🚀 ДЕПЛОЙ WORKER СЕЙЧАС

> Пошаговая инструкция с вашими значениями

## ⚡ Быстрый путь (5 минут)

### Шаг 1: Откройте Railway Dashboard

👉 **https://railway.app**

1. Войдите через GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Выберите: `worldwideservice/gpt-agent-platform`

### Шаг 2: Добавьте Worker сервис

1. После подключения репозитория, Railway покажет несколько сервисов
2. Если `worker` не появился автоматически:
   - **"+ New"** → **"GitHub Repo"**
   - Выберите тот же репозиторий
   - **Root Directory:** `services/worker` ⚠️ **КРИТИЧНО!**

### Шаг 3: Добавьте переменные окружения

Откройте сервис `worker` → **Settings** → **Variables**

**Добавьте каждую переменную:**

| Name | Value |
|------|-------|
| `REDIS_URL` | `redis://default:AYcUASQgZjI2MTM5NzYtYzU2ZS00YjFkLTk3MmQtMWIyODAzYjY3ODg5OGE3ODAzNDUwMzQ5NGE0Yjk5NzEwZDFiNWE4ZTg0MDU=@usw1-merry-term-40416.upstash.io:6379` |
| `SUPABASE_URL` | `https://rpzchsgutabxeabbnwas.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2MzMzOCwiZXhwIjoyMDc1MTM5MzM4fQ.UIkX-rUGGTbMGfd5YoF41Dx3QBuLH13nO-R3BXdbx2I` |
| `ENCRYPTION_KEY` | `HxXQ5WCMJ3TrFZehEHJUyMVgVX5fdGsSWy/2rixkVwE=` |
| `OPENROUTER_API_KEY` | `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` |
| `JOB_QUEUE_NAME` | `agent-jobs` |
| `JOB_CONCURRENCY` | `5` |
| `PORT` | `3001` |

### Шаг 4: Деплой запустится автоматически! ✅

Railway автоматически:
- Обнаружит `railway.json`
- Обнаружит `Dockerfile`
- Соберет образ
- Задеплоит сервис

**Время:** ~3-5 минут

### Шаг 5: Проверка

1. Дождитесь зеленой галочки ✅
2. **Settings** → **Networking** → **Generate Domain**
3. Проверьте health check:

```bash
curl https://your-worker-url.up.railway.app/health
```

**Должен вернуть:**
```json
{"status":"ok","service":"worker","timestamp":"..."}
```

---

## ✅ Готово!

Worker теперь обрабатывает:
- ✅ Загрузку файлов в базу знаний
- ✅ Генерацию embeddings
- ✅ Синхронизацию Kommo
- ✅ Webhooks

---

**Railway Token:** `5cd06a89-c580-450d-958c-6b1553bb1428` (для CLI если нужно)

