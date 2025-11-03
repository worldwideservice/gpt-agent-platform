# 🔔 Настройка Sentry алертов

> Пошаговая инструкция по настройке мониторинга и алертов в Sentry

## 📋 Предварительные требования

1. ✅ Sentry проект создан (см. `SENTRY_SETUP.md`)
2. ✅ `SENTRY_DSN` добавлен в Vercel Environment Variables
3. ✅ `NEXT_PUBLIC_SENTRY_DSN` добавлен в Vercel Environment Variables

---

## 🎯 Настройка алертов

### Алерт 1: Критические ошибки (Error Rate > 5%)

**Назначение:** Уведомление при высоком уровне ошибок

**Шаги:**

1. Откройте Sentry Dashboard: https://sentry.io
2. Перейдите в ваш проект
3. **Alerts** → **Create Alert Rule**

**Настройки:**

- **Name:** `Critical Errors - High Error Rate`
- **Alert Conditions:**
  - **When:** `An issue is seen more than`
  - **Threshold:** `10 times`
  - **In:** `1 minute`
  - **AND:** `The error rate is more than`
  - **Threshold:** `5%`
  - **In:** `5 minutes`

- **Filters:**
  - **Environment:** `production`
  - **Tags:** (опционально) можно фильтровать по типу ошибки

- **Actions:**
  - ✅ **Send Email** → Ваш email
  - ✅ **Send Slack** → (если настроен Slack integration)
  - ✅ **Send Discord** → (если настроен Discord integration)

**Приоритет:** 🔴 Critical

---

### Алерт 2: Медленные запросы

**Назначение:** Уведомление при медленных API запросах

**Шаги:**

1. **Alerts** → **Create Alert Rule**
2. Выберите тип: **Performance**

**Настройки:**

- **Name:** `Slow API Requests`
- **Alert Conditions:**
  - **When:** `A transaction is slower than`
  - **Threshold:** `5000ms` (5 секунд)
  - **In:** `5 minutes`

- **Filters:**
  - **Transaction Names:**
    - `/api/chat`
    - `/api/agents/*`
    - `/api/dashboard/*`
  - **Environment:** `production`

- **Actions:**
  - ✅ **Send Email**
  - ✅ **Send Slack**

**Приоритет:** ⚠️ Warning

---

### Алерт 3: Health Check Failures

**Назначение:** Уведомление когда health check не проходит

**Шаги:**

1. **Alerts** → **Create Alert Rule**
2. Выберите тип: **Issues**

**Настройки:**

- **Name:** `Health Check Failed`
- **Alert Conditions:**
  - **When:** `An issue matches`
  - **Filter:** `message:"health check failed" OR url:"/api/health"`
  - **Threshold:** `1 time`
  - **In:** `1 minute`

- **Filters:**
  - **Environment:** `production`

- **Actions:**
  - ✅ **Send Email** (критичное уведомление)
  - ✅ **Send Slack** (#alerts канал)
  - ✅ **Send SMS** (если настроено для критичных алертов)

**Приоритет:** 🔴 Critical

---

### Алерт 4: Новые типы ошибок

**Назначение:** Уведомление о новых типах ошибок (для обнаружения регрессий)

**Шаги:**

1. **Alerts** → **Create Alert Rule**

**Настройки:**

- **Name:** `New Error Types Detected`
- **Alert Conditions:**
  - **When:** `A new issue is created`
  - **Filter:** `environment:production`

- **Actions:**
  - ✅ **Send Email** (daily digest)
  - ✅ **Send Slack**

**Приоритет:** ℹ️ Info

---

## 🔗 Настройка интеграций

### Slack Integration

1. Sentry → **Settings** → **Integrations**
2. Найдите **Slack**
3. Нажмите **Add Integration**
4. Выберите workspace и канал
5. Настройте какие события отправлять

**Рекомендуемые каналы:**
- `#alerts-critical` - для критичных алертов
- `#alerts-warnings` - для предупреждений
- `#alerts-info` - для информационных

### Email Integration

1. **Settings** → **Notifications**
2. Добавьте email адреса команды
3. Настройте частоту уведомлений:
   - Critical: немедленно
   - Warning: каждые 15 минут (digest)
   - Info: ежедневный digest

### Discord Integration (опционально)

1. **Settings** → **Integrations**
2. Найдите **Discord**
3. Добавьте webhook URL из Discord канала

---

## 📊 Dashboard и мониторинг

### Создание Dashboard

1. **Dashboards** → **Create Dashboard**
2. Добавьте widgets:

**Рекомендуемые widgets:**

- **Error Rate** (line chart)
- **Response Time** (line chart)
- **Top Errors** (table)
- **Active Users** (number)
- **API Endpoints Performance** (table)

### Настройка retention

1. **Settings** → **Data Retention**
2. Рекомендуется: **90 days** для production
3. **30 days** для development

---

## ✅ Чеклист настройки

- [ ] Sentry проект создан и настроен
- [ ] DSN добавлен в Vercel
- [ ] Алерт на критические ошибки настроен
- [ ] Алерт на медленные запросы настроен
- [ ] Алерт на health check failures настроен
- [ ] Slack интеграция настроена (опционально)
- [ ] Email уведомления настроены
- [ ] Dashboard создан с ключевыми метриками
- [ ] Retention настроен
- [ ] Команда знает где смотреть алерты

---

## 🔍 Просмотр алертов

### В Sentry Dashboard

1. Откройте: https://sentry.io
2. Ваш проект → **Issues** (для ошибок)
3. Ваш проект → **Performance** (для медленных запросов)
4. Ваш проект → **Alerts** (для настроенных алертов)

### В Slack

- Проверьте канал `#alerts-critical`
- Все критические алерты приходят немедленно

### В Email

- Проверьте inbox для уведомлений
- Daily digest приходит каждый день в 9:00 UTC

---

## 📝 Примеры алертов

### Пример алерта в Slack

```
🚨 Critical Alert: High Error Rate

Project: GPT Agent Platform
Environment: production
Error Rate: 7.5% (threshold: 5%)
Time: 2025-01-XX 10:30 UTC

Top Errors:
1. Database connection timeout (15 occurrences)
2. Redis connection failed (8 occurrences)

View in Sentry: https://sentry.io/...
```

---

**Последнее обновление:** 2025-01-XX  
**Ответственный:** DevOps Team

