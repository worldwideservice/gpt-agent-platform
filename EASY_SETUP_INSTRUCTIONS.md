# 🎯 ПРОСТЫЕ ИНСТРУКЦИИ: ДОБАВИТЬ ПЕРЕМЕННЫЕ В VERCEL И SUPABASE

## 🔥 VERCEL - ДОБАВИТЬ ПЕРЕМЕННЫЕ (3 МИНУТЫ)

### ШАГ 1: Открыть Dashboard
**Перейдите:** https://vercel.com/dashboard

### ШАГ 2: Выбрать проект
**Найдите проект:** `gpt-agent-kwid` (или `world-wide-services-62780b79`)
**Нажмите на него**

### ШАГ 3: Перейти в Settings
**В меню слева нажмите:** Settings → Environment Variables

### ШАГ 4: Добавить переменные
**Нажмите:** "Add New"

**Добавьте по одной переменной:**

1. **Ключ:** `NEXTAUTH_SECRET`
   **Значение:** `XH9mgmu70y7LaauJBoI7ynjGXlja6u4JCE894ZeKgKk=`
   **Тип:** Encrypted
   **✅ Нажмите Add**

2. **Ключ:** `NEXTAUTH_URL`
   **Значение:** `https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app`
   **Тип:** Plain Text
   **✅ Нажмите Add**

3. **Ключ:** `SUPABASE_URL`
   **Значение:** `https://rpzchsgutabxeabbnwas.supabase.co`
   **Тип:** Plain Text
   **✅ Нажмите Add**

4. **Ключ:** `SUPABASE_ANON_KEY`
   **Значение:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI`
   **Тип:** Encrypted
   **✅ Нажмите Add**

5. **Ключ:** `SUPABASE_SERVICE_ROLE_KEY`
   **Значение:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2MzMzOCwiZXhwIjoyMDc1MTM5MzM4fQ.UIkX-rUGGTbMGfd5YoF41Dx3QBuLH13nO-R3BXdbx2I`
   **Тип:** Encrypted
   **✅ Нажмите Add**

6. **Ключ:** `NEXT_PUBLIC_SUPABASE_URL`
   **Значение:** `https://rpzchsgutabxeabbnwas.supabase.co`
   **Тип:** Plain Text
   **✅ Нажмите Add**

7. **Ключ:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   **Значение:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI`
   **Тип:** Plain Text
   **✅ Нажмите Add**

8. **Ключ:** `OPENROUTER_API_KEY`
   **Значение:** `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`
   **Тип:** Encrypted
   **✅ Нажмите Add**

9. **Ключ:** `NODE_ENV`
   **Значение:** `production`
   **Тип:** Plain Text
   **✅ Нажмите Add**

10. **Ключ:** `DEMO_MODE`
    **Значение:** `false`
    **Тип:** Plain Text
    **✅ Нажмите Add**

11. **Ключ:** `E2E_ONBOARDING_FAKE`
    **Значение:** `false`
    **Тип:** Plain Text
    **✅ Нажмите Add**

## 🔥 SUPABASE - ДОБАВИТЬ REDIRECT URLS (1 МИНУТА)

### ШАГ 1: Открыть Authentication Settings
**Перейдите:** https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/auth/settings

### ШАГ 2: Найти Redirect URLs
**В разделе "Redirect URLs" нажмите:** "Add URL"

### ШАГ 3: Добавить URLs
**Добавьте эти URLs по одному:**

1. `https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/api/auth/callback/*`
   **✅ Нажмите Add**

2. `https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback`
   **✅ Нажмите Add**

## ✅ ГОТОВО!

**После добавления всех переменных:**
- Перейдите на сайт: https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app
- Зарегистрируйтесь
- Создайте организацию
- Настройте AI агентов

🎊 **ВАШ ПРОДАКШЕН ГОТОВ!**
