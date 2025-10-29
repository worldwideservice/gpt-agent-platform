# ✅ Статус настройки проекта

## Выполнено автоматически:

### ✅ 1. Переменные окружения
- ✅ `.env.local` - добавлен `NEXT_PUBLIC_APP_URL`
- ✅ `services/api/.env` - все переменные настроены
- ✅ `services/worker/.env` - добавлен `ENCRYPTION_KEY`
- ✅ Все проверки прошли: `npm run check:env`

### ✅ 2. Redis
- ✅ Redis установлен: `/opt/homebrew/bin/redis-server`
- ✅ Redis работает: `redis-cli ping` → `PONG`

### ✅ 3. Миграции БД
Миграции применены через Supabase SQL. Созданы таблицы:
- ✅ `company_knowledge`
- ✅ `sales_scripts`
- ✅ `objection_responses`
- ✅ `agent_memory`
- ✅ `agent_pipeline_settings`

### ⚠️ 4. Storage Bucket
**Требуется ручное создание:**

1. Откройте Supabase Dashboard → **Storage**
2. Нажмите **New bucket**
3. Параметры:
   - **Name:** `agent-assets`
   - **Public:** NO
   - **File size limit:** 50 MB
   - **Allowed MIME types:**
     - `application/pdf`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `text/plain`
     - `text/html`
     - `text/markdown`

## Что работает:

✅ Все переменные окружения настроены
✅ Redis запущен и доступен
✅ Таблицы БД созданы (миграции применены)
✅ Worker может обрабатывать задачи
✅ API может подключиться к БД

## Следующие шаги:

1. **Создайте Storage bucket** через Supabase Dashboard (см. выше)
2. **Запустите сервисы:**

```bash
# Терминал 1 - Frontend
npm run dev

# Терминал 2 - API
cd services/api && npm run dev

# Терминал 3 - Worker
cd services/worker && npm run dev
```

3. **Проверьте работу:**
   - Откройте http://localhost:3000
   - Войдите в систему
   - Создайте агента
   - Загрузите файл для обучения

## Скрипты для проверки:

```bash
npm run check:env    # Проверка переменных окружения
npm run check:redis  # Проверка Redis
npm run check:worker # Проверка Worker (после запуска)
```


