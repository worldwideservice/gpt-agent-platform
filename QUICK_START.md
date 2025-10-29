# ⚡ Быстрый старт - За 10 минут

## 🚀 Автоматическая настройка (рекомендуется)

```bash
# 1. Запустите автоматическую настройку
bash scripts/auto-setup-env.sh

# 2. Заполните реальные значения в созданных файлах:
#    - .env.local
#    - services/api/.env  
#    - services/worker/.env

# 3. Запустите Redis
docker-compose up -d redis

# 4. Примените миграции в Supabase Dashboard:
#    SQL Editor → scripts/apply-all-setup.sql → Run

# 5. Запустите все сервисы (4 терминала)
npm run dev                    # Терминал 1: Frontend
cd services/api && npm run dev  # Терминал 2: Backend
cd services/worker && npm run dev # Терминал 3: Worker
# Redis уже работает через docker-compose
```

## 📋 Что нужно получить вручную

### 1. Supabase ключи (2 минуты)
1. https://supabase.com/dashboard
2. Settings → API
3. Скопируйте: URL, anon key, service_role key
4. Получите ORGANIZATION_ID через SQL:
   ```sql
   SELECT id FROM organizations LIMIT 1;
   ```

### 2. OpenRouter API ключ (3 минуты)
1. https://openrouter.ai/keys
2. Create Key
3. Скопируйте ключ (формат: `sk-or-v1-...`)

### 3. Миграции БД (2 минуты)
1. Supabase Dashboard → SQL Editor
2. Скопируйте `scripts/apply-all-setup.sql`
3. Выполните (Run)

## ✅ Проверка

```bash
# Проверка переменных окружения
npm run check:env

# Проверка Redis
npm run check:redis

# Тестовая сборка
npm run build
```

## 🎯 Готово!

Откройте http://localhost:3000 и начните использовать сервис!

