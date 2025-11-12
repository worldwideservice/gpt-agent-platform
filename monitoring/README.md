# 📊 Мониторинг Worker сервиса

Полный стек мониторинга для Next.js, Fastify API и Worker сервисов с использованием Prometheus, Grafana и Alertmanager.

## 🚀 Быстрый старт

### 1. Запуск мониторинга

```bash
cd monitoring
docker compose up -d

# или из корня репозитория
make monitoring
```

### 2. Доступ к сервисам

- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3000 (admin/admin)
- **Alertmanager:** http://localhost:9093

### 3. Настройка Grafana

1. Откройте Grafana: http://localhost:3000
2. Войдите (admin/admin)
3. Добавьте Prometheus как источник данных:
   - Configuration → Data Sources → Add data source
   - Выберите Prometheus
   - URL: `http://prometheus:9090`
   - Save & Test

4. Импортируйте дашборд Worker:
   - Dashboards → Import
   - Загрузите `grafana/dashboards/worker-dashboard.json`

## 📋 Компоненты

### Prometheus
- Собирает метрики с Next.js (`/api/metrics`), Fastify (`/metrics`), worker (`/metrics/prometheus`) и экспортёров.
- Хранит метрики 30 дней и применяет правила алертов.

### Grafana
- Визуализация метрик Next.js, Fastify, Worker и инфраструктуры.
- Дашборды находятся в `grafana/dashboards`.
- Настраивайте алерты непосредственно из Grafana или Alertmanager.

### Alertmanager
- Маршрутизация уведомлений
- Группировка алертов
- Интеграция с Email, Slack, Webhook

### Экспортёры
- `node-exporter` — системные метрики узла.
- `cadvisor` — метрики контейнеров Docker.
- `redis-exporter` — состояние Redis кластеров/инстансов.

## 🔔 Настройка уведомлений

### Email уведомления

Отредактируйте `alertmanager/alertmanager.yml`:

```yaml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@yourdomain.com'
  smtp_auth_username: 'your-email@gmail.com'
  smtp_auth_password: 'your-app-password'
```

### Slack интеграция

Добавьте в `alertmanager/alertmanager.yml`:

```yaml
slack_configs:
  - api_url: 'YOUR_SLACK_WEBHOOK_URL'
    channel: '#alerts'
```

### Webhook

Настройте webhook endpoint для обработки алертов:

```yaml
webhook_configs:
  - url: 'https://your-webhook-url.com/alerts'
```

## 📊 Метрики Worker

Worker сервис предоставляет следующие метрики:

- `worker_jobs_total` - Общее количество jobs
- `worker_jobs_completed_total` - Успешно завершенные jobs
- `worker_jobs_failed_total` - Неудачные jobs
- `worker_jobs_processing` - Jobs в обработке
- `worker_job_duration_seconds` - Время обработки jobs
- `worker_redis_connection_status` - Статус подключения Redis
- `worker_redis_reconnect_attempts_total` - Попытки переподключения Redis

## 🔍 Алерты

Настроены следующие алерты:

1. **WorkerDown** - Worker недоступен (критично)
2. **HighJobFailureRate** - Высокий процент ошибок jobs (предупреждение)
3. **RedisDisconnected** - Redis отключен (критично)
4. **HighJobProcessingTime** - Высокое время обработки jobs (предупреждение)
5. **HighJobProcessingQueue** - Большая очередь обработки (предупреждение)
6. **HighRedisReconnectAttempts** - Частые переподключения Redis (предупреждение)
7. **LowWorkerThroughput** - Низкая производительность Worker (предупреждение)

## 🔧 Настройка для production

### 1. Обновите URL Worker в Prometheus

Отредактируйте `prometheus/prometheus.yml`:

```yaml
- job_name: 'worker'
  static_configs:
    - targets:
        - 'your-worker-url.railway.app'  # Замените на ваш URL
```

### 2. Настройте authentication

Для production добавьте authentication в Grafana и Prometheus.

### 3. Настройте резервное копирование

Настройте регулярное резервное копирование данных Prometheus и Grafana.

## 📚 Дополнительные ресурсы

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)

