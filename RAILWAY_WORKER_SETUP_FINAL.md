# Railway Worker Setup - Итоговый отчет

## ✅ Выполнено

### 1. ✅ Railway API Token создан и настроен
- **Токен:** `b2d35fc1-afcf-4589-8b24-da667437cf26` ✅
- **Статус:** Работает и протестирован через GraphQL API
- **Обновлено:** Все скрипты и документация содержат новый токен

### 2. ✅ Railway проект создан
- **Проект ID:** `ee93e450-dfe7-4414-892f-f3c6b83d91d1`
- **Название:** `athletic-unity`
- **URL:** https://railway.com/project/ee93e450-dfe7-4414-892f-f3c6b83d91d1

### 3. ✅ Основной сервис задеплоен
- **Сервис:** `gpt-agent-platform`
- **Сервис ID:** `2a8d827f-d635-4314-98a8-8c2e5cf77f39`
- **Статус:** ✅ Deployment successful
- **Репозиторий:** `worldwideservice/gpt-agent-platform`

---

## ⚠️ Проблема: Worker сервис

**Ограничение Railway UI:** Railway веб-интерфейс не позволяет автоматически создать второй сервис из того же GitHub репозитория (`worldwideservice/gpt-agent-platform`).

### 🔧 Решения:

#### Вариант 1: Railway CLI (рекомендуется)
Использовать Railway CLI для создания Worker сервиса:

```bash
# Установить Railway CLI (если еще не установлен)
npm i -g @railway/cli

# Логин
railway login

# Перейти в проект
railway link --project ee93e450-dfe7-4414-892f-f3c6b83d91d1

# Создать новый сервис
railway service

# Настроить Root Directory
railway variables set RAILWAY_SERVICE_ROOT_DIRECTORY=services/worker

# ИЛИ через Railway UI:
# 1. Открыть Settings существующего сервиса
# 2. Изменить Root Directory на `services/worker`
# 3. Это превратит существующий сервис в Worker
```

#### Вариант 2: Настроить существующий сервис как Worker
Изменить Root Directory существующего сервиса `gpt-agent-platform` на `services/worker`:

1. Открыть: https://railway.com/project/ee93e450-dfe7-4414-892f-f3c6b83d91d1/service/2a8d827f-d635-4314-98a8-8c2e5cf77f39/settings
2. В разделе "Build & Deploy" найти "Root Directory"
3. Установить `services/worker`
4. Сохранить изменения

**⚠️ ВНИМАНИЕ:** Это превратит основной сервис в Worker. Если нужны оба сервиса (основной и Worker), используйте Вариант 1.

#### Вариант 3: Railway GraphQL API
Использовать Railway GraphQL API для создания Worker сервиса:

```bash
curl -X POST https://backboard.railway.com/graphql/v2 \
  -H "Authorization: Bearer b2d35fc1-afcf-4589-8b24-da667437cf26" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { serviceCreate(projectId: \"ee93e450-dfe7-4414-892f-f3c6b83d91d1\", source: { repo: \"worldwideservice/gpt-agent-platform\", rootDirectory: \"services/worker\" }) { id name } }"
  }'
```

**⚠️ ПРИМЕЧАНИЕ:** Нужно проверить точную структуру GraphQL мутации для создания сервиса (может отличаться от примера).

---

## 📋 Следующие шаги

### После создания Worker сервиса:

1. **Добавить переменные окружения для Worker:**
   - `REDIS_URL` или `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENROUTER_API_KEY`
   - `NODE_ENV=production`
   - И другие необходимые переменные

2. **Проверить деплой Worker:**
   - Убедиться, что Worker успешно запустился
   - Проверить логи: https://railway.com/project/ee93e450-dfe7-4414-892f-f3c6b83d91d1/logs
   - Проверить health check: `curl https://<worker-url>/health`

3. **Настроить мониторинг:**
   - Добавить метрики для Worker
   - Настроить алерты в Sentry для Worker

---

## 📝 Использованные токены и ID

- **Railway API Token:** `b2d35fc1-afcf-4589-8b24-da667437cf26`
- **Railway Project ID:** `ee93e450-dfe7-4414-892f-f3c6b83d91d1`
- **Railway Service ID (основной):** `2a8d827f-d635-4314-98a8-8c2e5cf77f39`
- **GitHub Repository:** `worldwideservice/gpt-agent-platform`

---

## 🔗 Полезные ссылки

- **Railway Dashboard:** https://railway.com/project/ee93e450-dfe7-4414-892f-f3c6b83d91d1
- **Railway CLI Docs:** https://docs.railway.com/develop/cli
- **Railway GraphQL API:** https://docs.railway.com/reference/public-api
- **Worker Deployment Docs:** `docs/WORKER_DEPLOYMENT.md`

---

**Дата создания:** 2025-01-26  
**Статус:** ✅ Проект создан, основной сервис задеплоен. Требуется создать Worker сервис через CLI или настроить Root Directory.


