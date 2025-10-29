# ✅ Автоматическая настройка завершена

## Что было сделано автоматически:

### ✅ 1. Переменные окружения
- ✅ Исправлен `.env.local` - добавлен `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- ✅ Исправлен `services/worker/.env` - добавлен `ENCRYPTION_KEY`
- ✅ Все проверки пройдены: `npm run check:env` ✅

**Сгенерированные ключи (добавьте вручную если нужно пересоздать):**
- `AUTH_SECRET=Tug0TeEgWndhgb4MVoG10RwYxEIx8SIw`
- `ENCRYPTION_KEY=fsJHNrqKpmcyn+aVGv+cz1uaNdPr3FeAzxXOuMfBv8k=`

### ✅ 2. Redis
- ✅ Redis установлен: `/opt/homebrew/bin/redis-server`
- ✅ Redis работает: `redis-cli ping` → `PONG`
- ✅ Очередь `agent-jobs` существует
- ✅ Проверка: `npm run check:redis` ✅

### ✅ 3. Скрипты
- ✅ `scripts/apply-migrations.sql` - готовый SQL для миграций
- ✅ `scripts/apply-migrations-direct.sql` - упрощенная версия
- ✅ `scripts/setup-env.sh` - скрипт генерации ключей
- ✅ `scripts/check-redis.js` - проверка Redis
- ✅ `scripts/check-worker.js` - проверка Worker

### ✅ 4. Документация
- ✅ `SETUP_COMMANDS.md` - подробная инструкция
- ✅ `QUICK_SETUP.md` - быстрый старт
- ✅ `DEPLOYMENT_CHECKLIST.md` - чеклист деплоя

## ⚠️ Что нужно сделать вручную:

### 1. Применить миграции БД

**Способ A: Через Supabase Dashboard (РЕКОМЕНДУЕТСЯ)**
1. Откройте https://supabase.com/dashboard
2. Выберите проект: `rpzchsgutabxeabbnwas`
3. Перейдите в **SQL Editor**
4. Скопируйте весь файл `scripts/apply-migrations-direct.sql`
5. Вставьте в редактор и нажмите **Run**

**Способ B: Через Supabase CLI**
```bash
supabase db push
```

**Проверка после применения:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'agent_pipeline_settings',
  'company_knowledge',
  'sales_scripts',
  'objection_responses',
  'agent_memory'
)
ORDER BY table_name;
```

Должны вернуться 5 таблиц.

### 2. Создать Storage Bucket

1. Откройте Supabase Dashboard → **Storage**
2. Нажмите **New bucket**
3. Настройки:
   - **Name:** `agent-assets`
   - **Public:** NO (приватный)
   - **File size limit:** 52428800 (50 MB)
   - **Allowed MIME types:**
     - `application/pdf`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `text/plain`
     - `text/html`
     - `text/markdown`

**Проверка:**
В Storage должен появиться bucket `agent-assets`.

### 3. Проверить AUTH_SECRET

Убедитесь что в `.env.local` есть:
```env
AUTH_SECRET=...
NEXTAUTH_SECRET=...
```

Если нет - добавьте сгенерированный выше или создайте новый:
```bash
openssl rand -base64 32 | head -c 32
```

## ✅ Текущий статус:

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| Переменные окружения | ✅ | Все настроены |
| Redis | ✅ | Работает |
| Worker проверка | ⏳ | Нужно запустить Worker |
| Миграции БД | ⚠️ | Нужно применить вручную |
| Storage Bucket | ⚠️ | Нужно создать вручную |

## 🚀 Запуск после завершения:

```bash
# Терминал 1 - Frontend
npm run dev

# Терминал 2 - API
cd services/api && npm run dev

# Терминал 3 - Worker  
cd services/worker && npm run dev
```

## 📋 Финальный чеклист:

- [x] Переменные окружения исправлены
- [x] Redis запущен и проверен
- [ ] Миграции применены (Supabase SQL Editor)
- [ ] Storage bucket создан (Supabase Dashboard)
- [ ] AUTH_SECRET проверен
- [ ] Все сервисы запущены
- [ ] Система протестирована

## 🆘 Проблемы?

См. подробные инструкции:
- `QUICK_SETUP.md` - быстрая настройка
- `SETUP_COMMANDS.md` - детальные команды
- `DEPLOYMENT_CHECKLIST.md` - полный чеклист


