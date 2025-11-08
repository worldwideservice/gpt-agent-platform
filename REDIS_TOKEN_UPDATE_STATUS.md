# ⚠️ Статус обновления токена Redis

**Дата:** 2025-01-26  
**Время:** 19:00 UTC

---

## 🔍 Проблема

**Ошибка:** `ERR DB connection timed-out or wrong username-password given. Please try again`

**Статус Worker:**
- ✅ Worker запущен и работает
- ✅ Health check отвечает (статус: degraded)
- ❌ Redis подключение не работает
- ⏳ Worker пытается переподключиться (retry attempts)

---

## ✅ Выполнено

1. **Сброшены учетные данные в Upstash:**
   - Нажата кнопка "Reset Credentials"
   - Введено подтверждение: `agent-redis-production`
   - Пароль успешно сброшен
   - Новый токен сгенерирован

2. **Проверен код Worker:**
   - Worker использует `ioredis` для подключения
   - Формирует URL: `rediss://default:${encodeURIComponent(env.UPSTASH_REDIS_REST_TOKEN)}@${redisHost}:${redisPort}`
   - Формат правильный для Upstash

3. **Проверены переменные окружения в Railway:**
   - ✅ `UPSTASH_REDIS_REST_URL`: `https://composed-primate-14678.upstash.io`
   - ✅ `UPSTASH_REDIS_REST_TOKEN`: настроен (старый токен)

---

## ⚠️ Проблема

**Токен в Upstash скрыт** - не могу скопировать его автоматически через браузер, так как он показывается как `********`.

**Текущий токен в Railway:**
- `AYcUASQgZjI2MTM5NzYtYzU2ZS00YjFkLTk3MmQtMWIyODAzYjY3ODg5OGE3ODAzNDUwMzQ5NGE0Yjk5NzEwZDFiNWE4ZTg0MDU=`

**Новый токен в Upstash:**
- Скрыт (показывается как `********`)
- Не могу скопировать автоматически через браузер

---

## 🔧 Решение

### Вариант 1: Обновить токен вручную

1. **Откройте Upstash Console:**
   - Перейдите: https://console.upstash.com/redis/606aca52-72df-4096-b4fb-621bae7be77a?teamid=0
   - Найдите секцию "Token / Readonly Token"
   - Нажмите кнопку "Copy" рядом с токеном
   - Скопируйте токен в буфер обмена

2. **Обновите токен в Railway:**
   - Перейдите: https://railway.com/project/ee93e450-dfe7-4414-892f-f3c6b83d91d1/service/2a8d827f-d635-4314-98a8-8c2e5cf77f39/variables?environmentId=3be5b1d4-690c-48c6-b792-86ef8be2b2b8
   - Найдите переменную `UPSTASH_REDIS_REST_TOKEN`
   - Нажмите "Variable actions" → "Edit"
   - Вставьте новый токен
   - Нажмите "Submit"

3. **Проверьте логи Worker:**
   - Перейдите: https://railway.com/project/ee93e450-dfe7-4414-892f-f3c6b83d91d1/logs?environmentId=3be5b1d4-690c-48c6-b792-86ef8be2b2b8&serviceId=2a8d827f-d635-4314-98a8-8c2e5cf77f39
   - Убедитесь, что ошибка подключения к Redis исчезла

### Вариант 2: Использовать Railway CLI

```bash
# Установите Railway CLI
npm install -g @railway/cli

# Войдите в Railway
railway login

# Обновите переменную
railway variables set UPSTASH_REDIS_REST_TOKEN="НОВЫЙ_ТОКЕН" --service 2a8d827f-d635-4314-98a8-8c2e5cf77f39
```

---

## 📋 Следующие шаги

1. Обновить токен в Railway (вручную или через CLI)
2. Проверить логи Worker после обновления
3. Убедиться, что ошибка подключения к Redis исчезла
4. Проверить health check Worker (должен вернуть статус "healthy")

---

## 🔗 Ссылки

- **Upstash Console:** https://console.upstash.com/redis/606aca52-72df-4096-b4fb-621bae7be77a?teamid=0
- **Railway Variables:** https://railway.com/project/ee93e450-dfe7-4414-892f-f3c6b83d91d1/service/2a8d827f-d635-4314-98a8-8c2e5cf77f39/variables?environmentId=3be5b1d4-690c-48c6-b792-86ef8be2b2b8
- **Railway Logs:** https://railway.com/project/ee93e450-dfe7-4414-892f-f3c6b83d91d1/logs?environmentId=3be5b1d4-690c-48c6-b792-86ef8be2b2b8&serviceId=2a8d827f-d635-4314-98a8-8c2e5cf77f39

