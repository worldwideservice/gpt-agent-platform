# ⚡ Быстрая настройка Sentry алертов (5 минут)

> Готовые шаги для полной настройки через Dashboard

## 📋 Информация

**Организация:** `world-wide-services`  
**Проект:** `javascript-nextjs`  
**Email:** `admin@worldwideservices.eu`  
**Dashboard:** https://sentry.io/organizations/world-wide-services/projects/javascript-nextjs/alerts/rules/

---

## 🚀 Пошаговая настройка

### Шаг 1: Откройте Sentry Dashboard

👉 **https://sentry.io/organizations/world-wide-services/projects/javascript-nextjs/alerts/rules/**

---

### Шаг 2: Алерт 1 - Critical Errors (1 минута)

1. Нажмите **"Create Alert Rule"**
2. Выберите тип: **Issue Alert**

**Настройки:**

- **Name:** `Critical Errors - High Error Rate`
- **If an event is seen:** `More than 10 times`
- **In:** `1 minute`
- **And the error rate is:** `More than 5%`
- **In:** `5 minutes`
- **Environment:** `production` ✅
- **Actions:**
  - ✅ **Send Email** → `admin@worldwideservices.eu`
3. **Save Alert Rule**

---

### Шаг 3: Алерт 2 - Health Check Failures (1 минута)

1. **Create Alert Rule** → **Issue Alert**

**Настройки:**

- **Name:** `Health Check Failed`
- **If an event matches:** 
  - `message contains "health check failed"` OR
  - `url equals "/api/health"`
- **And the event is seen:** `More than 1 time`
- **In:** `1 minute`
- **Environment:** `production` ✅
- **Actions:**
  - ✅ **Send Email** → `admin@worldwideservices.eu`
3. **Save Alert Rule**

---

### Шаг 4: Алерт 3 - Slow API Requests (1 минута)

1. **Create Alert Rule** → **Performance Alert**

**Настройки:**

- **Name:** `Slow API Requests`
- **If a transaction is slower than:** `5000ms` (5 секунд)
- **In:** `5 minutes`
- **Transactions:** 
  - `/api/chat`
  - `/api/agents/*`
  - `/api/dashboard/*`
- **Environment:** `production` ✅
- **Actions:**
  - ✅ **Send Email** → `admin@worldwideservices.eu`
3. **Save Alert Rule**

---

### Шаг 5: Алерт 4 - New Error Types (1 минута)

1. **Create Alert Rule** → **Issue Alert**

**Настройки:**

- **Name:** `New Error Types Detected`
- **If:** `A new issue is created`
- **Environment:** `production` ✅
- **Actions:**
  - ✅ **Send Email** → `admin@worldwideservices.eu`
  - **Frequency:** `Daily Digest`
3. **Save Alert Rule**

---

## ✅ Проверка

После создания всех 4 алертов:

1. Проверьте что все 4 алерта видны в списке: https://sentry.io/organizations/world-wide-services/projects/javascript-nextjs/alerts/rules/
2. Убедитесь что email указан: `admin@worldwideservices.eu`
3. Отправьте тестовую ошибку (если нужно) для проверки

---

## 📧 Настройка Email уведомлений (опционально)

1. **Settings** → **Notifications**
2. Проверьте что `admin@worldwideservices.eu` добавлен
3. Настройте частоту:
   - Critical: немедленно
   - Warning: каждые 15 минут
   - Info: ежедневный digest

---

## 🎉 Готово!

**Время:** ~5 минут  
**Результат:** Все 4 критичных алерта настроены ✅

---

**Следующий шаг:** Деплой Worker (см. `docs/WORKER_DEPLOY_STEP_BY_STEP.md`)


