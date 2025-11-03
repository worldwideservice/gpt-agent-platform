# 🚀 Быстрый старт: Деплой Worker на Railway

> Минимальная инструкция для быстрого деплоя

## 🎯 Вариант 1: Через Railway Dashboard (Рекомендуется - 5 минут)

### Шаг 1: Создать проект

1. Откройте https://railway.app
2. Войдите через GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Выберите репозиторий: `worldwideservice/gpt-agent-platform`

### Шаг 2: Настроить сервис Worker

1. Railway автоматически обнаружит репозиторий
2. **Add Service** → Выберите GitHub репозиторий (если не добавился автоматически)
3. В настройках сервиса:
   - **Name:** `worker`
   - **Root Directory:** `services/worker`
   - **Build Command:** (автоматически из Dockerfile)
   - **Start Command:** (автоматически из Dockerfile)

### Шаг 3: Получить Redis URL из Upstash

**Важно:** Для BullMQ нужен Redis URL (не REST URL)!

1. Откройте https://console.upstash.com
2. Выберите ваш Redis instance: `usw1-merry-term-40416`
3. Перейдите в раздел **"Redis"** (не REST API)
4. Найдите **"Redis URL"**
5. Скопируйте URL в формате: `redis://default:TOKEN@HOST:PORT`

Или используйте REST token для генерации URL (см. вариант ниже).

### Шаг 4: Добавить переменные окружения

В Railway Dashboard → Ваш проект → Сервис `worker` → **Settings** → **Variables**

Добавьте переменные:

```bash
REDIS_URL=redis://default:AYcUASQgZjI2MTM5NzYtYzU2ZS00YjFkLTk3MmQtMWIyODAzYjY3ODg5OGE3ODAzNDUwMzQ5NGE0Yjk5NzEwZDFiNWE4ZTg0MDU=@usw1-merry-term-40416.upstash.io:6379
SUPABASE_URL=https://rpzchsgutabxeabbnwas.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2MzMzOCwiZXhwIjoyMDc1MTM5MzM4fQ.UIkX-rUGGTbMGfd5YoF41Dx3QBuLH13nO-R3BXdbx2I
ENCRYPTION_KEY=HxXQ5WCMJ3TrFZehEHJUyMVgVX5fdGsSWy/2rixkVwE=
OPENROUTER_API_KEY=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
JOB_QUEUE_NAME=agent-jobs
JOB_CONCURRENCY=5
PORT=3001
```

### Шаг 5: Деплой запустится автоматически

Railway автоматически:
1. Обнаружит `railway.json`
2. Обнаружит `Dockerfile`
3. Запустит сборку
4. Задеплоит сервис

### Шаг 6: Проверка

1. Railway → Ваш проект → Сервис `worker`
2. Нажмите на **"..."** → **"Settings"** → **"Generate Domain"**
3. Получите URL (например: `worker-production.up.railway.app`)
4. Проверьте health check:

```bash
curl https://worker-production.up.railway.app/health
```

Должен вернуть:
```json
{"status":"ok","service":"worker","timestamp":"..."}
```

---

## 🎯 Вариант 2: Через Railway CLI (Продвинутый)

### Авторизация:

```bash
export RAILWAY_TOKEN="5cd06a89-c580-450d-958c-6b1553bb1428"
cd services/worker
railway login  # Используйте токен когда попросит
```

### Инициализация:

```bash
railway init
# Project name: gpt-agent-worker
# Service name: worker
```

### Добавление переменных:

```bash
bash ../../scripts/railway-setup-variables.sh
```

### Деплой:

```bash
railway up
```

---

## ⚠️ Важные заметки

### Redis URL для Upstash

Upstash предоставляет два типа подключения:
1. **Redis URL** (для BullMQ/ioredis) - нужен нам
2. **REST URL** (для HTTP API) - не подходит

**Как получить Redis URL:**
1. Upstash Dashboard → Ваш Redis
2. Вкладка **"Redis"** (не REST API)
3. Найдите **"Endpoint"** и **"Port"**
4. Формат: `redis://default:TOKEN@ENDPOINT:PORT`

Если нет прямого Redis URL, можно использовать:
- REST API endpoint как hostname
- REST token как password
- Порт 6379 (стандартный Redis порт)

**Формат:**
```
redis://default:REST_TOKEN@ENDPOINT_HOST:6379
```

Где:
- `ENDPOINT_HOST` = `usw1-merry-term-40416.upstash.io` (из REST URL без `https://`)
- `REST_TOKEN` = ваш REST token
- Порт = `6379`

---

## ✅ Чеклист

- [ ] Railway проект создан
- [ ] Сервис `worker` добавлен
- [ ] Root Directory: `services/worker`
- [ ] Все переменные окружения добавлены
- [ ] Redis URL правильного формата (не REST URL)
- [ ] Деплой запущен успешно
- [ ] Health check возвращает `{"status":"ok"}`
- [ ] Логи не показывают ошибок подключения

---

## 🐛 Troubleshooting

### "Redis connection failed"

**Решение:**
- Проверьте что REDIS_URL правильный формат
- Убедитесь что используете Redis URL (не REST URL)
- Проверьте что токен актуален

### "Supabase connection failed"

**Решение:**
- Проверьте SUPABASE_URL
- Проверьте SUPABASE_SERVICE_ROLE_KEY
- Убедитесь что ключ не истек

### "ENCRYPTION_KEY too short"

**Решение:**
- ENCRYPTION_KEY должен быть минимум 32 символа
- Используйте: `HxXQ5WCMJ3TrFZehEHJUyMVgVX5fdGsSWy/2rixkVwE=`

---

**Последнее обновление:** 2025-01-XX  
**Статус:** ✅ Готово к использованию

