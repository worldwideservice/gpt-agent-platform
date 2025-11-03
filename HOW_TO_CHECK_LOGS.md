# 📋 Как проверить логи Worker в Railway Dashboard

## ✅ Вы открыли правильный проект!

Проект: `ee93e450-dfe7-4414-892f-f3c6b83d91d1`  
Сервис: `gpt-agent-platform` (Worker)

---

## 🔍 Шаги для проверки логов

### 1. Найдите сервис Worker
В списке сервисов найдите **"gpt-agent-platform"** и кликните на него.

### 2. Перейдите в Deployments
В меню сервиса найдите вкладку **"Deployments"** и откройте её.

### 3. Найдите последний failed deployment
- Найдите deployment со статусом **"FAILED"** (красный)
- Или последний deployment в списке (самый верхний)
- Кликните на него

### 4. Проверьте логи
Откроется страница deployment. Найдите:
- **Build Logs** — логи сборки Docker образа
- **Runtime Logs** — логи выполнения Worker

---

## 🔍 Что искать в логах

### Типичные ошибки:

1. **Missing environment variables**
   ```
   ❌ Missing required environment variables: REDIS_URL, SUPABASE_URL
   ```
   **Решение:** Добавить переменные в Settings → Variables

2. **Module not found**
   ```
   Error: Cannot find module 'bcryptjs'
   ```
   **Решение:** Проверить зависимости

3. **Import error**
   ```
   Error: Cannot resolve '@/lib/...'
   ```
   **Решение:** Проверить tsconfig.json

4. **Build error**
   ```
   npm ERR! code ELIFECYCLE
   ```
   **Решение:** Проверить package.json

---

## 📝 Что делать после проверки

**Скопируйте текст ошибки** из логов и отправьте мне. Я:
1. Определю причину ошибки
2. Исправлю проблему
3. Закоммичу и запушу изменения
4. Railway автоматически запустит новый деплой

---

## 🔧 Быстрое решение: Добавить переменные окружения

Если логи показывают отсутствие переменных окружения:

1. В сервисе Worker перейдите в **Settings** → **Variables**
2. Нажмите **"+ New Variable"**
3. Добавьте каждую переменную:

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

4. Сохраните каждую переменную
5. Railway автоматически перезапустит деплой

---

**Дата:** 2025-01-26  
**Следующий шаг:** Проверьте логи и отправьте мне текст ошибки

