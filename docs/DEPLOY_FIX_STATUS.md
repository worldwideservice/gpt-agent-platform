# 🔧 Статус исправления деплоя Worker

**Дата:** 2025-01-26  
**Проблема:** DNS ошибка `getaddrinfo ENOTFOUND usw1-merry-term-40416.upstash.io`

---

## ❌ Проблема

Worker не может подключиться к Redis из-за DNS ошибки:
```
getaddrinfo ENOTFOUND usw1-merry-term-40416.upstash.io
```

**Причина:**
- В Railway есть переменная `REDIS_URL` с неправильным хостом: `rediss://40416.upstash.io:6380`
- Worker код использует `REDIS_URL` если он есть, игнорируя `UPSTASH_REDIS_REST_URL`
- Хост `40416.upstash.io` (и `usw1-merry-term-40416.upstash.io`) не существует

---

## ✅ Исправление

### Шаг 1: Обновлен код Worker

**Файл:** `services/worker/src/index.ts`

Добавлена проверка, чтобы игнорировать `REDIS_URL` если он содержит неправильный хост:

```typescript
// Игнорируем REDIS_URL если он содержит неправильный хост (40416, merry-term)
const hasInvalidRedisHost = process.env.REDIS_URL && (
  process.env.REDIS_URL.includes('40416') ||
  process.env.REDIS_URL.includes('merry-term')
)

if (process.env.REDIS_URL && 
    process.env.REDIS_URL.startsWith('rediss://') && 
    !hasInvalidRedisHost) {
  // Используем готовый REDIS_URL только если он правильный
  redisUrl = process.env.REDIS_URL
} else {
  // Формируем URL из UPSTASH_REDIS_REST_URL
  // ...
}
```

**Результат:**
- Worker игнорирует неправильный `REDIS_URL`
- Всегда использует `UPSTASH_REDIS_REST_URL` = `https://composed-primate-14678.upstash.io`
- Формирует правильный URL: `rediss://default:TOKEN@composed-primate-14678.upstash.io:6380`

### Шаг 2: Редеплой Worker

```bash
cd services/worker
railway up
```

---

## 🔍 Проверка

### Через Railway CLI:

```bash
cd services/worker
railway logs --tail 50 | grep -E "Redis URL|composed-primate|connected|ready"
```

**Ожидаемый результат:**
- ✅ `Redis URL constructed from REST URL`
- ✅ `redisHost: composed-primate-14678.upstash.io`
- ✅ `Redis: ready`
- ✅ Нет ошибок DNS

### Через Health Check:

```bash
curl https://gpt-agent-platform-production.up.railway.app/health | jq '.redis'
```

**Ожидаемый результат:**
```json
{
  "status": "connected",
  "host": "composed-primate-14678.upstash.io",
  "port": 6380
}
```

---

## 📋 Переменные окружения

**Текущие переменные в Railway:**
- ❌ `REDIS_URL` = `rediss://40416.upstash.io:6380` (неправильный, но игнорируется кодом)
- ✅ `UPSTASH_REDIS_REST_URL` = `https://composed-primate-14678.upstash.io` (правильный)
- ✅ `UPSTASH_REDIS_REST_TOKEN` = `AYcUASQg...` (правильный)

**Рекомендация:**
- Удалить `REDIS_URL` через Railway Dashboard (Settings → Variables → Delete)
- Или оставить как есть - код теперь игнорирует неправильный хост

---

## 🎯 Следующие шаги

После успешного деплоя:

1. ✅ Проверить Worker health check
2. ✅ Проверить Redis подключение в логах
3. ✅ Протестировать синхронизацию Kommo
4. ✅ Проверить Dashboard Recent Updates

---

**Последнее обновление:** 2025-01-26

