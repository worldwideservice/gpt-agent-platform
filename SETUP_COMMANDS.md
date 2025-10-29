# Команды для настройки проекта

## 1. Применение миграций БД

### Вариант A: Через Supabase Dashboard (Рекомендуется)

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **SQL Editor**
4. Скопируйте содержимое файла `scripts/apply-migrations.sql`
5. Вставьте в редактор и выполните (Run)

### Вариант B: Через Supabase CLI

```bash
# Если установлен Supabase CLI
supabase db push

# Или применить конкретную миграцию
supabase migration up add_company_knowledge
supabase migration up add_agent_pipeline_settings
```

### Проверка миграций

```sql
-- Выполните в Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'agent_pipeline_settings',
  'company_knowledge',
  'sales_scripts',
  'objection_responses',
  'agent_memory'
);
```

Должны быть созданы все 5 таблиц.

## 2. Создание Storage Bucket

### Через Supabase Dashboard

1. Откройте **Storage** в Dashboard
2. Нажмите **New bucket**
3. Название: `agent-assets`
4. Public: **NO** (приватный)
5. File size limit: `50 MB`
6. Allowed MIME types:
   - `application/pdf`
   - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
   - `text/plain`
   - `text/html`
   - `text/markdown`

### Проверка bucket

```sql
SELECT * FROM storage.buckets WHERE id = 'agent-assets';
```

## 3. Настройка переменных окружения

### Автоматическая настройка

```bash
# Генерирует ключи и создает .env файлы
./scripts/setup-env.sh
```

### Ручная настройка

#### Root `.env.local`

```bash
# Скопируйте шаблон и заполните реальные значения
cp scripts/setup-env.sh .env.local
# Редактируйте .env.local
```

Необходимые переменные:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DEFAULT_ORGANIZATION_ID`
- `AUTH_SECRET` или `NEXTAUTH_SECRET` (обязательно!)
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_APP_URL`

Генерация `AUTH_SECRET`:
```bash
openssl rand -base64 32 | head -c 32
```

#### `services/api/.env`

```bash
cd services/api
cp .env.example .env
# Редактируйте .env
```

Необходимые переменные:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `REDIS_URL`
- `ENCRYPTION_KEY` (32 байта base64)
- `OPENROUTER_API_KEY`

Генерация `ENCRYPTION_KEY`:
```bash
openssl rand -base64 32
```

#### `services/worker/.env`

```bash
cd services/worker
cp .env.example .env
# Редактируйте .env
```

Те же переменные что и для `services/api/.env`.

### Проверка переменных окружения

```bash
npm run check:env
```

## 4. Проверка Redis

### Установка Redis (macOS)

```bash
brew install redis
brew services start redis
```

### Установка Redis (Linux)

```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### Проверка подключения

```bash
# Простая проверка
redis-cli ping

# Детальная проверка через скрипт
node scripts/check-redis.js
```

## 5. Проверка Worker

### Запуск Worker

```bash
cd services/worker
npm install
npm run dev
```

### Проверка работы

В другом терминале:

```bash
node scripts/check-worker.js
```

Должен показать что Worker обрабатывает задачи.

## 6. Финальная проверка

### Запуск всех сервисов

**Терминал 1 - Next.js Frontend:**
```bash
npm run dev
```

**Терминал 2 - API сервис:**
```bash
cd services/api
npm install
npm run dev
```

**Терминал 3 - Worker:**
```bash
cd services/worker
npm install
npm run dev
```

### Проверка эндпоинтов

1. Откройте http://localhost:3000
2. Войдите в систему
3. Проверьте создание агента
4. Проверьте загрузку файлов
5. Проверьте обучение агента

## ✅ Чеклист готовности

- [ ] Миграции применены
- [ ] Storage bucket `agent-assets` создан
- [ ] `.env.local` настроен
- [ ] `services/api/.env` настроен
- [ ] `services/worker/.env` настроен
- [ ] Redis запущен и доступен
- [ ] Worker обрабатывает задачи
- [ ] Frontend запущен
- [ ] API сервис запущен
- [ ] Все проверки пройдены

## 🆘 Решение проблем

### Миграции не применяются

- Проверьте права доступа к базе данных
- Убедитесь что используются правильные credentials
- Проверьте логи в Supabase Dashboard

### Redis не подключается

- Проверьте что Redis запущен: `redis-cli ping`
- Проверьте `REDIS_URL` в `.env` файлах
- Убедитесь что порт 6379 не заблокирован

### Worker не обрабатывает задачи

- Проверьте что Worker запущен
- Проверьте подключение к Redis
- Проверьте логи Worker: `cd services/worker && npm run dev`

### AUTH_SECRET ошибки

- Убедитесь что `AUTH_SECRET` или `NEXTAUTH_SECRET` установлен
- Длина должна быть минимум 32 символа
- Используйте: `openssl rand -base64 32 | head -c 32`


