# 📊 Развертывание Prometheus/Grafana мониторинга

**Дата создания:** 2025-01-26  
**Версия:** 1.0

---

## 📋 Обзор

Это руководство описывает развертывание полного стека мониторинга для Worker сервиса:
- **Prometheus** - сбор метрик
- **Grafana** - визуализация метрик
- **Alertmanager** - отправка уведомлений при алертах

---

## 🚀 Вариант 1: Локальное развертывание (для тестирования)

### Предварительные требования

- Docker и Docker Compose установлены
- Порт 9090, 3000, 9093 свободны

### Шаг 1: Запуск мониторинга

```bash
cd monitoring
docker-compose up -d
```

### Шаг 2: Проверка запуска

```bash
# Проверить статус контейнеров
docker-compose ps

# Проверить логи
docker-compose logs prometheus
docker-compose logs grafana
docker-compose logs alertmanager
```

### Шаг 3: Доступ к сервисам

- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3000 (admin/admin)
- **Alertmanager:** http://localhost:9093

### Шаг 4: Настройка Grafana

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
   - Или создайте свой дашборд

### Шаг 5: Проверка сбора метрик

1. Откройте Prometheus: http://localhost:9090
2. Перейдите в Status → Targets
3. Убедитесь, что `worker` target показывает статус "UP"

---

## ☁️ Вариант 2: Развертывание на Railway

### Предварительные требования

- Аккаунт на Railway
- Railway CLI установлен (опционально)

### Шаг 1: Создание нового проекта

1. Откройте: https://railway.app
2. Создайте новый проект "monitoring"
3. Добавьте новый сервис "GitHub Repo"

### Шаг 2: Настройка Docker Compose

1. В настройках сервиса выберите "Docker Compose"
2. Укажите путь к `monitoring/docker-compose.yml`
3. Настройте переменные окружения (если нужны)

### Шаг 3: Настройка публичных URL

1. В настройках каждого сервиса (Prometheus, Grafana, Alertmanager)
2. Generate Domain для каждого сервиса
3. Сохраните URL для доступа

### Шаг 4: Обновление конфигурации

Обновите `monitoring/prometheus/prometheus.yml`:
- Убедитесь, что URL Worker правильный
- Обновите URL Alertmanager в конфигурации Prometheus

### Шаг 5: Проверка

1. Откройте Grafana через публичный URL
2. Настройте источник данных (URL Prometheus)
3. Импортируйте дашборд

---

## ☁️ Вариант 3: Grafana Cloud (Managed Service)

### Предварительные требования

- Аккаунт на Grafana Cloud: https://grafana.com

### Шаг 1: Регистрация

1. Зарегистрируйтесь на https://grafana.com
2. Создайте бесплатный аккаунт (или платный для production)

### Шаг 2: Создание Prometheus instance

1. В Grafana Cloud Dashboard выберите "Prometheus"
2. Создайте новый Prometheus instance
3. Сохраните URL и credentials

### Шаг 3: Настройка Remote Write

Обновите `monitoring/prometheus/prometheus.yml`:

```yaml
remote_write:
  - url: 'https://prometheus-prod-01.grafana.net/api/prom/push'
    basic_auth:
      username: YOUR_USERNAME
      password: YOUR_API_KEY
```

### Шаг 4: Настройка Grafana

1. В Grafana Cloud Dashboard откройте Grafana
2. Добавьте Prometheus как источник данных
3. Используйте URL из Grafana Cloud
4. Импортируйте дашборд Worker

---

## 🔧 Настройка для Production

### Безопасность

1. **Измените пароль Grafana:**
   ```bash
   # В Grafana UI: Configuration → Users → Admin → Change Password
   ```

2. **Настройте authentication:**
   - Включите OAuth или LDAP
   - Или используйте Railway/Vercel authentication

3. **Ограничьте доступ:**
   - Настройте firewall rules
   - Используйте VPN для доступа к Prometheus

### Резервное копирование

1. **Настройте бэкап данных Prometheus:**
   ```bash
   # Создайте скрипт для бэкапа
   docker exec prometheus tar czf /prometheus/backup.tar.gz /prometheus
   ```

2. **Настройте бэкап данных Grafana:**
   ```bash
   # Экспорт дашбордов и настроек
   # В Grafana UI: Configuration → Data Sources → Export
   ```

### Масштабирование

1. **Для высокой нагрузки:**
   - Увеличьте retention time в Prometheus
   - Настройте remote write для долгосрочного хранения
   - Используйте Thanos для long-term storage

2. **Для высокой доступности:**
   - Разверните несколько экземпляров Prometheus
   - Используйте Alertmanager в режиме кластера

---

## 📊 Метрики Worker

Worker сервис предоставляет следующие метрики через `/metrics/prometheus`:

### Основные метрики:

- `worker_jobs_total` - Общее количество jobs
- `worker_jobs_completed_total` - Успешно завершенные jobs
- `worker_jobs_failed_total` - Неудачные jobs
- `worker_jobs_processing` - Jobs в обработке
- `worker_job_duration_seconds` - Время обработки jobs (histogram)
- `worker_redis_connection_status` - Статус подключения Redis (1 = connected, 0 = disconnected)
- `worker_redis_reconnect_attempts_total` - Попытки переподключения Redis

### Node.js метрики:

- `process_cpu_user_seconds_total` - CPU usage
- `process_memory_heap_used_bytes` - Memory usage
- `nodejs_eventloop_lag_seconds` - Event loop lag

---

## 🔔 Настройка алертов

Алерты настроены в `monitoring/prometheus/alerts/worker-alerts.yml`:

1. **WorkerDown** - Worker недоступен (критично)
2. **HighJobFailureRate** - Высокий процент ошибок jobs (предупреждение)
3. **RedisDisconnected** - Redis отключен (критично)
4. **HighJobProcessingTime** - Высокое время обработки jobs (предупреждение)
5. **HighJobProcessingQueue** - Большая очередь обработки (предупреждение)
6. **HighRedisReconnectAttempts** - Частые переподключения Redis (предупреждение)
7. **LowWorkerThroughput** - Низкая производительность Worker (предупреждение)

Настройте уведомления в Alertmanager (см. `docs/ALERTMANAGER_SETUP.md`).

---

## 🧪 Тестирование

### Проверка сбора метрик

```bash
# Проверить метрики Worker напрямую
curl https://gpt-agent-platform-production.up.railway.app/metrics/prometheus

# Проверить метрики в Prometheus
curl http://localhost:9090/api/v1/query?query=worker_jobs_total
```

### Проверка алертов

1. Откройте Prometheus: http://localhost:9090
2. Перейдите в Alerts
3. Убедитесь, что все алерты показывают статус "Inactive" (нет проблем)

### Проверка Grafana

1. Откройте Grafana: http://localhost:3000
2. Откройте дашборд Worker
3. Убедитесь, что метрики отображаются

---

## 🔧 Troubleshooting

### Prometheus не собирает метрики

1. Проверьте, что Worker endpoint доступен:
   ```bash
   curl https://gpt-agent-platform-production.up.railway.app/metrics/prometheus
   ```

2. Проверьте конфигурацию Prometheus:
   ```bash
   docker exec prometheus promtool check config /etc/prometheus/prometheus.yml
   ```

3. Проверьте логи Prometheus:
   ```bash
   docker-compose logs prometheus
   ```

### Grafana не видит метрики

1. Проверьте подключение к Prometheus:
   - Configuration → Data Sources → Prometheus → Test

2. Проверьте, что Prometheus собирает метрики:
   - Откройте Prometheus UI и выполните запрос

3. Проверьте, что дашборд использует правильный источник данных

### Алерты не срабатывают

1. Проверьте конфигурацию алертов:
   ```bash
   docker exec prometheus promtool check rules /etc/prometheus/alerts/*.yml
   ```

2. Проверьте, что Alertmanager работает:
   ```bash
   curl http://localhost:9093/api/v1/status
   ```

3. Проверьте логи Alertmanager:
   ```bash
   docker-compose logs alertmanager
   ```

---

## 📚 Дополнительные ресурсы

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [Grafana Cloud](https://grafana.com/products/cloud/)
- [Railway Documentation](https://docs.railway.app/)

---

## ✅ Чеклист развертывания

- [ ] Docker и Docker Compose установлены
- [ ] Промоутер конфигурация проверена
- [ ] Grafana конфигурация проверена
- [ ] Alertmanager конфигурация проверена
- [ ] Мониторинг запущен (локально или в облаке)
- [ ] Prometheus собирает метрики Worker
- [ ] Grafana подключена к Prometheus
- [ ] Дашборд Worker импортирован
- [ ] Алерты настроены и работают
- [ ] Уведомления настроены (Email/Slack/Webhook)
- [ ] Безопасность настроена (пароли, authentication)
- [ ] Резервное копирование настроено

---

**Последнее обновление:** 2025-01-26

