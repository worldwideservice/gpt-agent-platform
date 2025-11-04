# 📊 Статус настройки Sentry Metrics Alerts для Worker

**Дата:** 2025-01-26  
**Статус:** ⚠️ Требуется платный план Sentry для Custom Metrics Alerts

---

## 📋 Выполненные действия

### 1. ✅ Проверка доступных типов алертов в Sentry

**Доступные типы алертов:**
- ✅ **Issues** - доступен (уже используется)
- ❌ **Number of Errors** - требует платный план
- ❌ **Performance Metrics** (Duration, Failure Rate, Throughput) - требует платный план
- ✅ **Uptime Monitor** - доступен (но лимит для *.railway.app достигнут)
- ✅ **Cron Monitor** - доступен

**Текущие алерты в проекте:**
- ✅ "Send a notification for high priority issues"
- ✅ "Health Check Failed"
- ✅ "Critical Errors - High Error Rate"
- ✅ "New Error Types"

---

## 🔍 Ограничения текущего плана Sentry

### Недоступные функции для мониторинга метрик Worker:

1. **Custom Metrics Alerts** - требует Business или Enterprise план
2. **Number of Errors Alerts** - требует Business или Enterprise план
3. **Performance Metrics Alerts** - требует Business или Enterprise план

---

## ✅ Альтернативные решения (уже настроены)

### 1. ✅ UptimeRobot
- **Статус:** Настроен и работает
- **Монитор:** Worker Health Check
- **URL:** `https://gpt-agent-platform-production.up.railway.app/health`
- **Интервал:** 5 минут
- **Уведомления:** Email

### 2. ✅ Worker Metrics Endpoints
- **`/health`** - Health check с проверкой Redis
- **`/metrics`** - JSON метрики
- **`/metrics/prometheus`** - Prometheus метрики

### 3. ✅ Sentry Dashboard
- **Dashboard ID:** 18943
- **URL:** https://world-wide-services.sentry.io/dashboard/18943/
- **Метрики:** SLO/SLA tracking

---

## 🚀 Рекомендации для будущей интеграции

### Вариант 1: Интеграция Worker с Sentry SDK (рекомендуется)

**Для отправки custom metrics в Sentry:**

1. **Установить Sentry SDK в Worker:**
```bash
npm install @sentry/node @sentry/profiling-node
```

2. **Настроить Sentry в Worker:**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Отправка custom metrics
Sentry.metrics.distribution('worker.job.duration', durationMs, {
  tags: { jobType: job.name },
});

Sentry.metrics.increment('worker.job.completed', 1, {
  tags: { jobType: job.name },
});

Sentry.metrics.increment('worker.job.failed', 1, {
  tags: { jobType: job.name },
});
```

3. **Создать алерты в Sentry:**
   - После интеграции SDK, метрики будут доступны в Sentry
   - Можно создать алерты на основе custom metrics (требуется платный план)

### Вариант 2: Использование Prometheus + Grafana

**Для полноценного мониторинга метрик:**

1. **Настроить Prometheus для сбора метрик:**
```yaml
scrape_configs:
  - job_name: 'worker'
    static_configs:
      - targets: ['gpt-agent-platform-production.up.railway.app']
    metrics_path: '/metrics/prometheus'
    scheme: 'https'
```

2. **Настроить Grafana для визуализации:**
   - Импортировать метрики из Prometheus
   - Создать дашборды для мониторинга Worker

3. **Настроить Alertmanager:**
   - Алерты на основе метрик Prometheus
   - Интеграция с Slack, Email, PagerDuty

### Вариант 3: Upgrade Sentry до Business/Enterprise плана

**Преимущества:**
- Custom Metrics Alerts
- Number of Errors Alerts
- Performance Metrics Alerts
- Более детальная аналитика

**Стоимость:**
- Business план: от $26/месяц
- Enterprise план: индивидуальная цена

---

## 📝 Текущий статус мониторинга

### ✅ Настроено:
1. **UptimeRobot** - мониторинг доступности Worker
2. **Worker Metrics Endpoints** - метрики доступны через HTTP
3. **Sentry Dashboard** - SLO/SLA tracking
4. **Sentry Alerts** - алерты на основе Issues (критические ошибки)

### ⚠️ Требует настройки:
1. **Интеграция Worker с Sentry SDK** - для отправки custom metrics
2. **Prometheus + Grafana** - для полноценного мониторинга метрик (опционально)
3. **Upgrade Sentry** - для Custom Metrics Alerts (опционально)

---

## 🎯 Рекомендация

**Для текущего этапа проекта:**

1. **Использовать UptimeRobot** для мониторинга доступности (уже настроен)
2. **Использовать существующие Sentry алерты** для критических ошибок
3. **Мониторить метрики через `/metrics` endpoint** вручную или через скрипты
4. **В будущем:** Интегрировать Worker с Sentry SDK для отправки custom metrics

**Для production на большом масштабе:**

1. **Настроить Prometheus + Grafana** для полноценного мониторинга
2. **Интегрировать Worker с Sentry SDK** для отслеживания ошибок и производительности
3. **Рассмотреть upgrade Sentry** для Custom Metrics Alerts

---

## 📚 Ссылки

- **UptimeRobot Dashboard:** https://dashboard.uptimerobot.com/monitors
- **Worker Metrics:** https://gpt-agent-platform-production.up.railway.app/metrics
- **Sentry Dashboard:** https://world-wide-services.sentry.io/dashboard/18943/
- **Sentry Alerts:** https://world-wide-services.sentry.io/issues/alerts/rules/
- **Sentry SDK Documentation:** https://docs.sentry.io/platforms/node/

---

**Последнее обновление:** 2025-01-26

