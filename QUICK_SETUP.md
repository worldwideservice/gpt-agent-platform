# 🚀 Быстрая настройка проекта

## Пошаговая инструкция

### 1️⃣ Применение миграций БД

**Откройте Supabase Dashboard:**
1. Перейдите на https://supabase.com/dashboard
2. Выберите ваш проект
3. Откройте **SQL Editor**
4. Скопируйте ВЕСЬ содержимое файла `scripts/apply-migrations.sql`
5. Вставьте в редактор и нажмите **Run**

✅ **Проверка:** Должны быть созданы таблицы:
- `agent_pipeline_settings`
- `company_knowledge`
- `sales_scripts`
- `objection_responses`
- `agent_memory`

### 2️⃣ Создание Storage Bucket

**В Supabase Dashboard:**
1. Откройте **Storage**
2. Нажмите **New bucket**
3. **Название:** `agent-assets`
4. **Public:** NO (приватный)
5. **File size limit:** 50 MB
6. Сохраните

### 3️⃣ Настройка переменных окружения

#### Автоматическая генерация:

```bash
# Генерирует ключи и создает .env файлы
bash scripts/setup-env.sh
```

Затем **заполните реальные значения** в созданных файлах.

#### Ручная настройка:

**Генерация ключей:**
```bash
# AUTH_SECRET (32 символа)
openssl rand -base64 32 | head -c 32

# ENCRYPTION_KEY (32 байта base64)
openssl rand -base64 32
```

**`.env.local` (в корне проекта):**
```env
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxxxx"
SUPABASE_SERVICE_ROLE_KEY="xxxxx"
SUPABASE_DEFAULT_ORGANIZATION_ID="xxxxx"
AUTH_SECRET="сгенерированный_ключ"
NEXTAUTH_SECRET="сгенерированный_ключ"
BACKEND_API_URL="http://localhost:4000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENROUTER_API_KEY="sk-or-v1-xxxxx"
```

**`services/api/.env`:**
```env
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="xxxxx"
REDIS_URL="redis://localhost:6379"
ENCRYPTION_KEY="сгенерированный_ключ_32_байта"
OPENROUTER_API_KEY="sk-or-v1-xxxxx"
KOMMO_OAUTH_REDIRECT_BASE="http://localhost:3000/integrations/kommo/oauth/callback"
KOMMO_WEBHOOK_SECRET="change-me"
JOB_QUEUE_NAME="agent-jobs"
```

**`services/worker/.env`:**
```env
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="xxxxx"
REDIS_URL="redis://localhost:6379"
ENCRYPTION_KEY="сгенерированный_ключ_32_байта"
OPENROUTER_API_KEY="sk-or-v1-xxxxx"
JOB_QUEUE_NAME="agent-jobs"
JOB_CONCURRENCY="5"
```

### 4️⃣ Установка и запуск Redis

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Проверка:**
```bash
redis-cli ping
# Должно ответить: PONG
```

Или через скрипт:
```bash
npm run check:redis
```

### 5️⃣ Запуск всех сервисов

**Терминал 1 - Frontend:**
```bash
npm install
npm run dev
```

**Терминал 2 - API:**
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

### 6️⃣ Проверка работоспособности

```bash
# Проверка переменных окружения
npm run check:env

# Проверка Redis
npm run check:redis

# Проверка Worker (после запуска Worker)
npm run check:worker
```

### 7️⃣ Тестирование

1. Откройте http://localhost:3000
2. Войдите в систему
3. Создайте агента
4. Загрузите файл для обучения
5. Настройте CRM интеграцию
6. Активируйте агента

## ✅ Чеклист

- [ ] Миграции применены (Supabase Dashboard → SQL Editor)
- [ ] Storage bucket `agent-assets` создан
- [ ] `.env.local` настроен с реальными значениями
- [ ] `services/api/.env` настроен
- [ ] `services/worker/.env` настроен
- [ ] Redis запущен (`redis-cli ping`)
- [ ] Worker запущен в отдельном терминале
- [ ] Все проверки пройдены (`npm run check:*`)

## 🆘 Проблемы?

См. подробную инструкцию: `SETUP_COMMANDS.md`


