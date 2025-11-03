# ✅ ФИНАЛЬНЫЙ ЧЕКЛИСТ SENTRY

> Пошаговая инструкция для полного завершения настройки Sentry

## 📋 ТЕКУЩИЙ СТАТУС

**✅ Выполнено:**
- [x] Sentry DSN получен
- [x] DSN добавлен в Vercel (Production, Preview, Development)
- [x] Email настроен: `admin@worldwideservices.eu`
- [x] Персональный токен работает

**⏳ Осталось:**
- [ ] Алерт 1: Critical Errors
- [ ] Алерт 2: Health Check Failed
- [ ] Алерт 3: Slow API Requests
- [ ] Алерт 4: New Error Types

---

## 🎯 ПОШАГОВАЯ ИНСТРУКЦИЯ

### Шаг 1: Открыть Sentry Dashboard

1. **Откройте в браузере:**
   ```
   https://sentry.io/organizations/world-wide-services/projects/javascript-nextjs/alerts/rules/
   ```

2. **Войдите в аккаунт** (если требуется)

---

### Шаг 2: Создать Алерт 1 - Critical Errors

1. **Нажмите:** `Create Alert Rule` (синяя кнопка)
2. **Выберите:** `Issue Alert`
3. **Настройте:**

   **When:**
   - Select: `An event is seen more than`
   - Value: `10`
   - Time: `1 minute`
   
   **AND:**
   - Select: `The error rate is more than`
   - Value: `5%`
   - Time: `5 minutes`

   **Filter by:**
   - `Environment` = `production` ✅

   **Then:**
   - `Send a notification` → `Email`
   - Email: `admin@worldwideservices.eu`

4. **Name:** `Critical Errors - High Error Rate`
5. **Save Alert Rule**

**✅ Проверка:** Алерт появился в списке

---

### Шаг 3: Создать Алерт 2 - Health Check Failed

1. **Create Alert Rule** → `Issue Alert`
2. **Настройте:**

   **When:**
   - Select: `An event matches`
   - Condition: `message contains "health check"` OR `url equals "/api/health"`
   
   **AND:**
   - Select: `An event is seen more than`
   - Value: `1`
   - Time: `1 minute`

   **Filter by:**
   - `Environment` = `production` ✅

   **Then:**
   - `Send a notification` → `Email`
   - Email: `admin@worldwideservices.eu`

3. **Name:** `Health Check Failed`
4. **Save Alert Rule**

**✅ Проверка:** Алерт появился в списке

---

### Шаг 4: Создать Алерт 3 - Slow API Requests

1. **Create Alert Rule** → `Performance Alert`
2. **Настройте:**

   **When:**
   - Select: `A transaction is slower than`
   - Value: `5000ms` (5 секунд)
   - Time window: `5 minutes`

   **Filter by:**
   - `Transaction` matches:
     - `/api/chat`
     - `/api/agents/*`
     - `/api/dashboard/*`
   - `Environment` = `production` ✅

   **Then:**
   - `Send a notification` → `Email`
   - Email: `admin@worldwideservices.eu`

3. **Name:** `Slow API Requests`
4. **Save Alert Rule**

**✅ Проверка:** Алерт появился в списке

---

### Шаг 5: Создать Алерт 4 - New Error Types

1. **Create Alert Rule** → `Issue Alert`
2. **Настройте:**

   **When:**
   - Select: `A new issue is created`

   **Filter by:**
   - `Environment` = `production` ✅

   **Then:**
   - `Send a notification` → `Email`
   - Email: `admin@worldwideservices.eu`
   - **Frequency:** `Daily Digest` (опционально)

3. **Name:** `New Error Types Detected`
4. **Save Alert Rule**

**✅ Проверка:** Алерт появился в списке

---

## ✅ ФИНАЛЬНАЯ ПРОВЕРКА

После создания всех 4 алертов:

1. **Проверьте список алертов:**
   - URL: https://sentry.io/organizations/world-wide-services/projects/javascript-nextjs/alerts/rules/
   - Должно быть 4 алерта в списке

2. **Проверьте каждый алерт:**
   - Нажмите на каждый алерт
   - Убедитесь что email указан: `admin@worldwideservices.eu`
   - Проверьте условия (conditions) - они должны соответствовать описанным выше

3. **Проверьте Email настройки:**
   - Settings → Notifications
   - Убедитесь что `admin@worldwideservices.eu` в списке

---

## 🎉 ГОТОВО!

**✅ Все 4 алерта созданы**
**✅ Email настроен**
**✅ Sentry полностью настроен (100%)**

---

## 📊 ИТОГОВАЯ ИНФОРМАЦИЯ

**Организация:** `world-wide-services`  
**Проект:** `javascript-nextjs`  
**Email:** `admin@worldwideservices.eu`  
**DSN:** Настроен в Vercel ✅  
**Алерты:** 4 созданы ✅

**Dashboard:** https://sentry.io/organizations/world-wide-services/projects/javascript-nextjs/

---

**Время выполнения:** ~5-10 минут  
**Статус:** ✅ Готово к использованию

