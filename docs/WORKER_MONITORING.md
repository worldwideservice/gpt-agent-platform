# 📊 Мониторинг Worker

**Дата создания:** 2025-01-26  
**Версия:** 1.0

---

## 📋 Обзор

Worker сервис предоставляет несколько endpoints для мониторинга состояния и метрик:

- **`/health`** - Health check с проверкой Redis подключения
- **`/metrics`** - Детальные метрики в JSON формате
- **`/metrics/prometheus`** - Метрики в формате Prometheus

---

## 🏥 Health Check Endpoint

### URL
```
GET /health
```

### Описание
Проверяет состояние Worker и подключение к Redis. Возвращает статус `ok` или `degraded` в зависимости от состояния Redis.

### Пример запроса
```bash
curl https://your-worker-url.railway.app/health
```

### Пример ответа (успех)
```json
{
  "status": "ok",
  "service": "worker",
  "timestamp": "2025-01-26T12:00:00.000Z",
  "uptime": 3600.5,
  "redis": {
    "connected": true,
    "error": null
  },
  "worker": {
    "concurrency": 5,
    "queueName": "agent-jobs",
    "jobsProcessing": 2
  }
}
```

### Пример ответа (Redis недоступен)
```json
{
  "status": "degraded",
  "service": "worker",
  "timestamp": "2025-01-26T12:00:00.000Z",
  "uptime": 3600.5,
  "redis": {
    "connected": false,
    "error": "Connection timeout"
  },
  "worker": {
    "concurrency": 5,
    "queueName": "agent-jobs",
    "jobsProcessing": 0
  }
}
```

### HTTP Status Codes
- **200 OK** - Worker и Redis работают нормально
- **503 Service Unavailable** - Redis недоступен или есть проблемы

---

## 📈 Metrics Endpoint (JSON)

### URL
```
GET /metrics
```

### Описание
Возвращает детальные метрики Worker в JSON формате.

### Пример запроса
```bash
curl https://your-worker-url.railway.app/metrics
```

### Пример ответа
```json
{
  "jobs": {
    "total": 150,
    "completed": 145,
    "failed": 3,
    "processing": 2,
    "byType": {
      "test-job": {
        "completed": 50,
        "failed": 0,
        "totalTime": 5000,
        "avgTime": 100
      },
      "extract-knowledge-graph": {
        "completed": 45,
        "failed": 2,
        "totalTime": 45000,
        "avgTime": 1000
      },
      "process-asset": {
        "completed": 50,
        "failed": 1,
        "totalTime": 25000,
        "avgTime": 500
      }
    }
  },
  "redis": {
    "connected": true,
    "lastError": null,
    "reconnectAttempts": 0
  },
  "worker": {
    "uptime": 3600.5,
    "concurrency": 5,
    "queueName": "agent-jobs"
  },
  "performance": {
    "avgProcessingTime": 500,
    "maxProcessingTime": 5000,
    "minProcessingTime": 50
  }
}
```

### Структура метрик

#### Jobs
- **total** - Общее количество обработанных jobs
- **completed** - Количество успешно завершенных jobs
- **failed** - Количество упавших jobs
- **processing** - Текущее количество обрабатываемых jobs
- **byType** - Статистика по типам jobs:
  - **completed** - Завершенные jobs данного типа
  - **failed** - Упавшие jobs данного типа
  - **totalTime** - Общее время обработки (мс)
  - **avgTime** - Среднее время обработки (мс)

#### Redis
- **connected** - Статус подключения к Redis
- **lastError** - Последняя ошибка Redis (если была)
- **reconnectAttempts** - Количество попыток переподключения

#### Worker
- **uptime** - Время работы Worker в секундах
- **concurrency** - Количество одновременных jobs
- **queueName** - Имя очереди

#### Performance
- **avgProcessingTime** - Среднее время обработки job (мс)
- **maxProcessingTime** - Максимальное время обработки (мс)
- **minProcessingTime** - Минимальное время обработки (мс)

---

## 📊 Prometheus Metrics Endpoint

### URL
```
GET /metrics/prometheus
```

### Описание
Возвращает метрики в формате Prometheus для интеграции с системами мониторинга.

### Пример запроса
```bash
curl https://your-worker-url.railway.app/metrics/prometheus
```

### Пример ответа
```
# HELP worker_uptime_seconds Worker uptime in seconds
# TYPE worker_uptime_seconds gauge
worker_uptime_seconds 3600.5

# HELP worker_jobs_total Total number of jobs processed
# TYPE worker_jobs_total counter
worker_jobs_total 150

# HELP worker_jobs_completed Total number of completed jobs
# TYPE worker_jobs_completed counter
worker_jobs_completed 145

# HELP worker_jobs_failed Total number of failed jobs
# TYPE worker_jobs_failed counter
worker_jobs_failed 3

# HELP worker_jobs_processing Current number of jobs being processed
# TYPE worker_jobs_processing gauge
worker_jobs_processing 2

# HELP worker_redis_connected Redis connection status
# TYPE worker_redis_connected gauge
worker_redis_connected 1

# HELP worker_avg_processing_time_ms Average job processing time in milliseconds
# TYPE worker_avg_processing_time_ms gauge
worker_avg_processing_time_ms 500

# HELP worker_jobs_by_type_test-job_completed Completed jobs of type test-job
# TYPE worker_jobs_by_type_test-job_completed counter
worker_jobs_by_type_test-job_completed 50

# HELP worker_jobs_by_type_test-job_failed Failed jobs of type test-job
# TYPE worker_jobs_by_type_test-job_failed counter
worker_jobs_by_type_test-job_failed 0

# HELP worker_jobs_by_type_test-job_avg_time_ms Average processing time for test-job in milliseconds
# TYPE worker_jobs_by_type_test-job_avg_time_ms gauge
worker_jobs_by_type_test-job_avg_time_ms 100
```

---

## 🔔 Настройка алертов

### Railway Health Checks
Railway автоматически проверяет `/health` endpoint каждые 30 секунд.

### Sentry Alerts
Рекомендуется настроить алерты в Sentry для:
- Высокого процента ошибок jobs (`failed / total > 0.05`)
- Долгого времени обработки (`avgProcessingTime > 5000ms`)
- Проблем с Redis (`redis.connected === false`)

### Пример скрипта для мониторинга
```bash
#!/bin/bash
# Скрипт для проверки метрик Worker

WORKER_URL="${WORKER_URL:-https://your-worker-url.railway.app}"

# Проверка health
echo "🔍 Checking Worker health..."
HEALTH=$(curl -s "${WORKER_URL}/health")
STATUS=$(echo "$HEALTH" | jq -r '.status')
REDIS_CONNECTED=$(echo "$HEALTH" | jq -r '.redis.connected')

if [ "$STATUS" != "ok" ]; then
  echo "❌ Worker status: $STATUS"
  exit 1
fi

if [ "$REDIS_CONNECTED" != "true" ]; then
  echo "❌ Redis not connected"
  exit 1
fi

echo "✅ Worker is healthy"

# Получение метрик
echo "📊 Fetching metrics..."
METRICS=$(curl -s "${WORKER_URL}/metrics")
FAILED=$(echo "$METRICS" | jq -r '.jobs.failed')
TOTAL=$(echo "$METRICS" | jq -r '.jobs.total')
FAIL_RATE=$(echo "scale=2; $FAILED / $TOTAL * 100" | bc)

echo "Jobs failed: $FAILED / $TOTAL ($FAIL_RATE%)"
echo "✅ Monitoring complete"
```

---

## 📝 Интеграция с системами мониторинга

### Prometheus
Настройте Prometheus для сбора метрик:
```yaml
scrape_configs:
  - job_name: 'worker'
    static_configs:
      - targets: ['your-worker-url.railway.app:443']
    metrics_path: '/metrics/prometheus'
    scheme: 'https'
```

### Grafana
Импортируйте метрики в Grafana и создайте дашборды для визуализации:
- Количество обработанных jobs
- Процент ошибок
- Время обработки
- Статус Redis подключения

### Sentry
Используйте Sentry для отслеживания ошибок и производительности:
- Настройте алерты на основе метрик
- Интегрируйте с Dashboard для визуализации

---

## 🔧 Устранение неполадок

### Проблема: Health check возвращает 503
**Решение:**
1. Проверьте подключение к Redis
2. Проверьте переменные окружения `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN`
3. Проверьте логи Worker в Railway

### Проблема: Метрики не обновляются
**Решение:**
1. Убедитесь, что Worker обрабатывает jobs
2. Проверьте логи Worker на наличие ошибок
3. Перезапустите Worker через Railway Dashboard

### Проблема: Высокий процент ошибок
**Решение:**
1. Проверьте логи Worker для выявления паттернов ошибок
2. Проверьте подключение к Supabase
3. Проверьте ресурсы Worker (CPU, Memory)

---

## 📚 Дополнительные ресурсы

- **Railway Dashboard:** https://railway.app
- **Sentry Dashboard:** https://world-wide-services.sentry.io/dashboard/18943/
- **Upstash Console:** https://console.upstash.com/redis

---

**Последнее обновление:** 2025-01-26

