# 🚀 Деплой Worker сервиса

> Руководство по деплою Worker сервиса для обработки фоновых задач

## 📋 Описание

Worker сервис обрабатывает фоновые задачи через BullMQ:
- Обработка файлов для базы знаний
- Генерация embeddings
- Синхронизация с CRM
- Обработка webhooks
- Извлечение Knowledge Graph

---

## 🐳 Docker деплой

### Локальная сборка и тестирование

```bash
cd services/worker

# Сборка образа
docker build -t gpt-agent-worker:latest .

# Запуск с переменными окружения
docker run -d \
  --name worker \
  -e REDIS_URL="redis://localhost:6379" \
  -e SUPABASE_URL="https://your-project.supabase.co" \
  -e SUPABASE_SERVICE_ROLE_KEY="your-key" \
  -e ENCRYPTION_KEY="your-32-char-key" \
  -e OPENROUTER_API_KEY="sk-or-v1-..." \
  -e JOB_QUEUE_NAME="agent-jobs" \
  -e JOB_CONCURRENCY="5" \
  -p 3001:3001 \
  gpt-agent-worker:latest

# Проверка health check
curl http://localhost:3001/health

# Просмотр логов
docker logs -f worker
```

---

## 🚂 Railway

### Настройка деплоя

1. **Установите Railway CLI:**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Инициализируйте проект:**
   ```bash
   cd services/worker
   railway init
   ```

3. **Настройте переменные окружения:**
   ```bash
   railway variables set REDIS_URL="redis://..."
   railway variables set SUPABASE_URL="https://..."
   railway variables set SUPABASE_SERVICE_ROLE_KEY="..."
   railway variables set ENCRYPTION_KEY="..."
   railway variables set OPENROUTER_API_KEY="sk-or-v1-..."
   railway variables set JOB_QUEUE_NAME="agent-jobs"
   railway variables set JOB_CONCURRENCY="5"
   ```

4. **Деплой:**
   ```bash
   railway up
   ```

### Через Railway Dashboard

1. Откройте [Railway Dashboard](https://railway.app)
2. Создайте новый проект
3. Добавьте GitHub репозиторий
4. Выберите сервис `services/worker`
5. Railway автоматически обнаружит `railway.json` и `Dockerfile`
6. Добавьте переменные окружения в Settings → Variables
7. Деплой запустится автоматически

### Проверка деплоя

```bash
# Health check
curl https://your-worker.railway.app/health

# Логи
railway logs
```

---

## 🎨 Render

### Настройка через Dashboard

1. Откройте [Render Dashboard](https://render.com)
2. Создайте новый **Background Worker**
3. Подключите GitHub репозиторий
4. Настройки:
   - **Root Directory:** `services/worker`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Dockerfile Path:** `services/worker/Dockerfile` (если используете Docker)

5. **Переменные окружения:**
   ```
   NODE_ENV=production
   REDIS_URL=redis://...
   SUPABASE_URL=https://...
   SUPABASE_SERVICE_ROLE_KEY=...
   ENCRYPTION_KEY=...
   OPENROUTER_API_KEY=sk-or-v1-...
   JOB_QUEUE_NAME=agent-jobs
   JOB_CONCURRENCY=5
   PORT=3001
   ```

6. **Health Check:**
   - Path: `/health`
   - Interval: 30s

7. Нажмите **Create Background Worker**

### Через render.yaml

Файл `render.yaml` уже настроен. Просто:
1. Подключите репозиторий к Render
2. Render автоматически обнаружит `render.yaml`
3. Настройте переменные окружения

---

## ✈️ Fly.io

### Настройка деплоя

1. **Установите Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   fly auth login
   ```

2. **Создайте fly.toml (в services/worker):**
   ```bash
   fly launch --no-deploy
   ```

3. **Настройте fly.toml:**
   ```toml
   app = "gpt-agent-worker"
   primary_region = "fra"

   [build]
     dockerfile = "Dockerfile"

   [env]
     NODE_ENV = "production"
     PORT = "3001"

   [[services]]
     internal_port = 3001
     protocol = "tcp"
     ports = [{ port = 80, handlers = ["http"] }]

     [[services.http_checks]]
       interval = "30s"
       timeout = "10s"
       grace_period = "10s"
       method = "GET"
       path = "/health"
   ```

4. **Установите переменные окружения:**
   ```bash
   fly secrets set REDIS_URL="redis://..."
   fly secrets set SUPABASE_URL="https://..."
   fly secrets set SUPABASE_SERVICE_ROLE_KEY="..."
   fly secrets set ENCRYPTION_KEY="..."
   fly secrets set OPENROUTER_API_KEY="sk-or-v1-..."
   fly secrets set JOB_QUEUE_NAME="agent-jobs"
   fly secrets set JOB_CONCURRENCY="5"
   ```

5. **Деплой:**
   ```bash
   fly deploy
   ```

---

## 🔍 Мониторинг

### Health Check

Worker автоматически запускает HTTP сервер для health checks:

```bash
curl http://your-worker-url/health
```

Ответ:
```json
{
  "status": "ok",
  "service": "worker",
  "timestamp": "2025-01-XX...",
  "uptime": 12345.67
}
```

### Логи

#### Railway
```bash
railway logs --follow
```

#### Render
- Dashboard → Logs

#### Fly.io
```bash
fly logs
```

### Метрики

Мониторинг очередей через BullMQ Dashboard или Redis CLI:

```bash
# Подключение к Redis
redis-cli -u REDIS_URL

# Проверка очереди
KEYS *job*
LLEN bull:agent-jobs:wait
LLEN bull:agent-jobs:active
LLEN bull:agent-jobs:completed
LLEN bull:agent-jobs:failed
```

---

## 🔧 Переменные окружения

### Обязательные

| Переменная | Описание | Пример |
|-----------|----------|--------|
| `REDIS_URL` | URL подключения к Redis | `redis://...` или `https://...` для Upstash |
| `SUPABASE_URL` | URL Supabase проекта | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role ключ Supabase | `eyJhbGc...` |
| `ENCRYPTION_KEY` | Ключ шифрования (32 символа) | Base64 строка |

### Опциональные

| Переменная | Описание | По умолчанию |
|-----------|----------|--------------|
| `OPENROUTER_API_KEY` | API ключ OpenRouter | - |
| `JOB_QUEUE_NAME` | Имя очереди | `agent-jobs` |
| `JOB_CONCURRENCY` | Количество одновременных задач | `5` |
| `PORT` | Порт для health check | `3001` |

---

## 🐛 Отладка

### Локальная разработка

```bash
cd services/worker
npm install
npm run dev
```

### Проверка подключений

```bash
# Проверка Redis
redis-cli -u $REDIS_URL ping

# Проверка Supabase
curl -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
     "$SUPABASE_URL/rest/v1/"
```

### Ошибки при деплое

1. **Проверьте логи:**
   ```bash
   # Railway
   railway logs
   
   # Render
   # Dashboard → Logs
   
   # Fly.io
   fly logs
   ```

2. **Проверьте переменные окружения:**
   - Все обязательные переменные установлены
   - Формат значений корректный
   - Нет лишних пробелов

3. **Проверьте health check:**
   ```bash
   curl https://your-worker-url/health
   ```

---

## 📊 Масштабирование

### Автоматическое масштабирование

#### Railway
- Settings → Scaling → Auto Scaling

#### Render
- Dashboard → Settings → Scaling

#### Fly.io
```bash
fly scale count 2  # 2 инстанса
```

### Ручное масштабирование

Worker можно масштабировать горизонтально:
- Несколько инстансов обрабатывают одну очередь
- BullMQ автоматически распределяет задачи
- Увеличьте `JOB_CONCURRENCY` для каждого инстанса или количество инстансов

---

## ✅ Чеклист деплоя

- [ ] Переменные окружения настроены
- [ ] Dockerfile собран и протестирован локально
- [ ] Health check работает
- [ ] Подключение к Redis проверено
- [ ] Подключение к Supabase проверено
- [ ] Логи доступны
- [ ] Мониторинг настроен
- [ ] Документация обновлена

---

## 🔗 Полезные ссылки

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Fly.io Docs](https://fly.io/docs)
- [BullMQ Docs](https://docs.bullmq.io)

---

**Последнее обновление:** 2025-01-XX  
**Версия:** 1.0

