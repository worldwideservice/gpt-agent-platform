# 🚀 Пошаговая инструкция по деплою

## ✅ Шаг 1: Настройка переменных окружения (5 минут)

### Автоматический способ:
```bash
bash scripts/auto-setup-env.sh
```

Это создаст все `.env` файлы с автогенерированными ключами.

### Ручной способ:
1. Скопируйте шаблоны:
   ```bash
   cp .env.local.example .env.local
   cp services/api/.env.example services/api/.env
   cp services/worker/.env.example services/worker/.env
   ```

2. Заполните реальными значениями (см. ниже)

### Что нужно заполнить:

#### Supabase (критично):
1. Откройте https://supabase.com/dashboard
2. Выберите ваш проект
3. Settings → API
4. Скопируйте:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL` и `SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
5. Получите `SUPABASE_DEFAULT_ORGANIZATION_ID`:
   - SQL Editor → выполните: `SELECT id FROM organizations LIMIT 1;`
   - Скопируйте UUID

#### OpenRouter API (критично):
1. Зарегистрируйтесь: https://openrouter.ai/
2. Keys → Create Key: https://openrouter.ai/keys
3. Скопируйте ключ (формат: `sk-or-v1-...`)
4. Добавьте в:
   - `.env.local`
   - `services/api/.env`
   - `services/worker/.env`

#### Проверка:
```bash
npm run check:env
```

---

## ✅ Шаг 2: Настройка Redis (2 минуты)

### Вариант 1: Docker (рекомендуется)
```bash
docker-compose up -d redis
```

Или:
```bash
docker run -d -p 6379:6379 --name gpt-agent-redis redis:7-alpine
```

### Вариант 2: Установка локально
```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install redis-server
sudo systemctl start redis
```

### Проверка:
```bash
npm run check:redis
# или
redis-cli ping  # должно вернуть PONG
```

---

## ✅ Шаг 3: Миграции базы данных (2 минуты)

### Через Supabase Dashboard (РЕКОМЕНДУЕТСЯ):

1. Откройте https://supabase.com/dashboard
2. Выберите ваш проект
3. SQL Editor → **New query**
4. Откройте файл `scripts/apply-all-setup.sql`
5. Скопируйте **ВЕСЬ** файл (Ctrl+A, Ctrl+C)
6. Вставьте в SQL Editor (Ctrl+V)
7. Нажмите **Run** (или F5)

### Проверка:
Вы должны увидеть:
- ✅ 5 строк в первом SELECT (5 таблиц)
- ✅ 1 строка во втором SELECT (bucket `agent-assets`)

Если bucket не создался:
1. Storage → **New bucket**
2. Name: `agent-assets`
3. Public: **NO**
4. File size limit: `52428800` (50 MB)

---

## ✅ Шаг 4: Локальное тестирование (10 минут)

### Запуск всех сервисов:

#### Терминал 1: Redis
```bash
docker-compose up -d redis
# или убедитесь что redis-server запущен
```

#### Терминал 2: Frontend
```bash
npm install
npm run dev
```

#### Терминал 3: Backend API
```bash
cd services/api
npm install
npm run dev
```

#### Терминал 4: Worker
```bash
cd services/worker
npm install
npm run dev
```

### Тестирование:

1. Откройте http://localhost:3000
2. Войдите в систему (используйте демо-логин если настроен)
3. Проверьте:
   - ✅ Dashboard загружается
   - ✅ Создание агента работает
   - ✅ Загрузка файлов работает
   - ✅ Чат с агентом работает (требует OpenRouter API)

---

## ✅ Шаг 5: Production деплой

### 5.1 Frontend (Vercel) - 10 минут

1. Установите Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Войдите в Vercel:
   ```bash
   vercel login
   ```

3. Деплой:
   ```bash
   vercel --prod
   ```

4. Настройте переменные окружения в Vercel Dashboard:
   - Project → Settings → Environment Variables
   - Добавьте все переменные из `.env.local`
   - Для продакшена обновите:
     - `BACKEND_API_URL` → URL вашего API
     - `NEXT_PUBLIC_APP_URL` → URL вашего frontend

5. Настройте домен (опционально):
   - Project → Settings → Domains

### 5.2 Backend API (Railway) - 15 минут

1. Зарегистрируйтесь: https://railway.app/
2. New Project → Deploy from GitHub
3. Выберите репозиторий
4. Настройки:
   - Root Directory: `services/api`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Port: `4000` (или оставьте автоопределение)
5. Environment Variables:
   - Добавьте все переменные из `services/api/.env`
   - Для продакшена обновите:
     - `REDIS_URL` → ваш Redis (продакшен)
     - `KOMMO_OAUTH_REDIRECT_BASE` → URL вашего frontend
6. Получите URL API и добавьте в Vercel как `BACKEND_API_URL`

### 5.3 Worker (Railway) - 15 минут

1. Railway → New Project → Deploy from GitHub
2. Настройки:
   - Root Directory: `services/worker`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. Environment Variables:
   - Добавьте все переменные из `services/worker/.env`
   - `ENCRYPTION_KEY` должен быть **одинаковый** с API
4. Убедитесь что Worker запускается автоматически

### 5.4 Redis (продакшен) - 5 минут

#### Вариант 1: Redis Cloud (бесплатный tier)
1. Зарегистрируйтесь: https://redis.com/try-free/
2. Создайте database
3. Получите connection string
4. Добавьте в API и Worker как `REDIS_URL`

#### Вариант 2: Upstash (serverless)
1. Зарегистрируйтесь: https://upstash.com/
2. Create Database → Redis
3. Получите connection string
4. Добавьте в API и Worker

---

## ✅ Шаг 6: Финальная проверка

### Checklist:

- [ ] Frontend доступен по домену
- [ ] Backend API отвечает на `/health`
- [ ] Worker обрабатывает задачи
- [ ] Redis подключен и работает
- [ ] Supabase миграции применены
- [ ] OpenRouter API ключ работает
- [ ] Можно создать агента
- [ ] Можно загрузить файлы
- [ ] Чат с агентом работает

### Команды для проверки:

```bash
# Проверка Frontend
curl https://your-domain.com

# Проверка Backend API
curl https://your-api-domain.com/health

# Проверка Redis (если есть доступ)
redis-cli -u <REDIS_URL> ping
```

---

## 🆘 Решение проблем

### Проблема: "Environment variable not found"
**Решение:** Убедитесь что все переменные добавлены в:
- Vercel Dashboard (для Frontend)
- Railway Dashboard (для API и Worker)

### Проблема: "Cannot connect to Redis"
**Решение:**
- Проверьте `REDIS_URL` корректность
- Проверьте что Redis доступен из интернета (для продакшена)
- Проверьте firewall настройки

### Проблема: "Supabase connection failed"
**Решение:**
- Проверьте `SUPABASE_URL` и ключи
- Убедитесь что проект активен в Supabase
- Проверьте RLS политики

### Проблема: "OpenRouter API key invalid"
**Решение:**
- Проверьте формат ключа: `sk-or-v1-...`
- Убедитесь что ключ добавлен во все `.env` файлы
- Проверьте баланс на OpenRouter

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в Vercel/Railway
2. Проверьте `npm run check:env`
3. См. `PROJECT_ANALYSIS_RU.md` для детального анализа

---

**После выполнения всех шагов ваш сервис готов к использованию! 🎉**

