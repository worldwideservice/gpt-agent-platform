# 🚨 Настройка Sentry алертов для Production

**Дата:** 2025-01-26  
**Версия:** 1.0  
**Статус:** ✅ Готов к настройке

---

## 📋 Обзор

Этот документ описывает настройку критичных алертов в Sentry для мониторинга production системы.

### Типы алертов

1. **Error Rate Alerts** - Всплеск ошибок
2. **Performance Alerts** - Высокая latency
3. **Worker Failure Alerts** - Сбои Worker
4. **Queue Depth Alerts** - Переполнение очереди (через метрики)

---

## 🔧 Настройка алертов в Sentry

### 1. Error Rate Alert (Критичные ошибки)

**Назначение:** Уведомление при всплеске критичных ошибок

**Шаги настройки:**

1. Откройте Sentry Dashboard: https://world-wide-services.sentry.io
2. Перейдите в **Alerts** → **Create Alert Rule**
3. Настройте правило:

   **Conditions:**
   - If an issue is seen **more than 100 times** in **5 minutes**
   - For events **where the level is error or fatal**
   - In **any environment**

   **Actions:**
   - Send notification to **Email** (ваш email)
   - Send notification to **Slack** (если настроен)
   - Create Sentry issue

   **Filters:**
   - Environment: `production`
   - Tags: `component:worker` или `component:frontend`

**Пример конфигурации:**
```
Trigger: When an issue is seen more than 100 times in 5 minutes
Conditions: 
  - Level is error or fatal
  - Environment is production
Actions:
  - Send email notification
  - Create Sentry issue
```

---

### 2. Performance Alert (Высокая latency)

**Назначение:** Уведомление при высокой latency в Worker

**Шаги настройки:**

1. Перейдите в **Alerts** → **Create Alert Rule**
2. Выберите **Performance** → **Transaction Duration**

   **Conditions:**
   - If the **p95 transaction duration** is **greater than 5 seconds**
   - For transactions matching **worker.job.***
   - In **production environment**

   **Actions:**
   - Send notification to Email
   - Send notification to Slack

**Пример конфигурации:**
```
Trigger: When p95 transaction duration > 5s
Conditions:
  - Transaction name matches worker.job.*
  - Environment is production
Actions:
  - Send email notification
```

---

### 3. Worker Failure Alert (Сбои Worker)

**Назначение:** Уведомление при критичных сбоях Worker

**Шаги настройки:**

1. Перейдите в **Alerts** → **Create Alert Rule**
2. Выберите **Issues** → **First Seen**

   **Conditions:**
   - If a new issue is **first seen**
   - For events matching **tags:component=worker**
   - With level **error or fatal**
   - In **production environment**

   **Actions:**
   - Send immediate notification (Email + Slack)
   - Create high-priority issue

**Пример конфигурации:**
```
Trigger: When a new issue is first seen
Conditions:
  - Tags: component=worker
  - Level is error or fatal
  - Environment is production
Actions:
  - Send immediate email notification
  - Send Slack notification
```

---

### 4. Queue Depth Alert (через метрики)

**Примечание:** Sentry не имеет встроенной поддержки метрик из Redis. Используйте скрипт мониторинга или внешний сервис.

**Альтернатива:** Использовать скрипт `scripts/monitor-redis-queue.sh` с cron или CI/CD пайплайном.

**Настройка через cron:**
```bash
# Добавить в crontab (каждые 5 минут)
*/5 * * * * cd /path/to/project && ./scripts/monitor-redis-queue.sh 1000 500
```

---

## 📊 Дашборды в Sentry

### Создание дашборда для Worker

1. Перейдите в **Dashboards** → **Create Dashboard**
2. Название: "Worker Production Dashboard"
3. Добавьте виджеты:

   **Widget 1: Error Rate**
   - Type: Line Chart
   - Query: `level:error OR level:fatal`
   - Group by: `component`
   - Time range: Last 24 hours

   **Widget 2: Transaction Duration (p95)**
   - Type: Line Chart
   - Query: `transaction:worker.job.*`
   - Function: p95
   - Time range: Last 24 hours

   **Widget 3: Jobs by Status**
   - Type: Bar Chart
   - Query: Custom metrics
   - Group by: `job.status`
   - Time range: Last 24 hours

   **Widget 4: Top Errors**
   - Type: Table
   - Query: `level:error OR level:fatal`
   - Sort by: Count
   - Limit: 10

---

## 🔔 Настройка уведомлений

### Email уведомления

1. Перейдите в **Settings** → **Notifications**
2. Включите email notifications
3. Настройте частоту: **Immediate** для критичных, **Digest** для остальных

### Slack интеграция

1. Перейдите в **Settings** → **Integrations** → **Slack**
2. Подключите Slack workspace
3. Выберите канал для алертов (например, `#production-alerts`)
4. Настройте фильтры:
   - Критичные алерты → `#production-alerts`
   - Warnings → `#production-warnings`

---

## 📈 Метрики для мониторинга

### Ключевые метрики

1. **Error Rate:**
   - Цель: < 0.1% от всех requests
   - Критично: > 1%

2. **Transaction Duration (p95):**
   - Цель: < 2s
   - Критично: > 5s

3. **Worker Jobs:**
   - Success Rate: > 99%
   - Failed Jobs: < 1% от общего количества

4. **Queue Depth:**
   - Норма: < 100
   - Предупреждение: 100-500
   - Критично: > 500

---

## 🧪 Тестирование алертов

### Тестовый сценарий

1. **Создать тестовую ошибку в Worker:**
   ```typescript
   // В services/worker/src/index.ts (временно)
   throw new Error('Test alert from Worker')
   ```

2. **Проверить получение алерта:**
   - Должно прийти email уведомление в течение 1 минуты
   - Должно появиться уведомление в Slack (если настроено)

3. **Удалить тестовую ошибку**

---

## 📚 Дополнительные ресурсы

- [Sentry Alert Rules Documentation](https://docs.sentry.io/product/alerts/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry Dashboards](https://docs.sentry.io/product/dashboards/)

---

## ✅ Checklist настройки

- [ ] Error Rate Alert настроен
- [ ] Performance Alert настроен
- [ ] Worker Failure Alert настроен
- [ ] Email уведомления включены
- [ ] Slack интеграция настроена (опционально)
- [ ] Дашборд создан
- [ ] Тестовые алерты проверены

---

**Последнее обновление:** 2025-01-26

