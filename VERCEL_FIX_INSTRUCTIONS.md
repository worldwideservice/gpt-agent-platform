# 🔧 ИСПРАВЛЕНИЕ VERCEL ENVIRONMENT VARIABLES

## ⚠️ ПРОБЛЕМА:
В Vercel уже есть переменные, но они могут быть неправильными для production!

## ✅ РЕШЕНИЕ:

### ШАГ 1: Проверить существующие переменные
Перейдите: https://vercel.com/dashboard → gpt-agent-kwid → Settings → Environment Variables

**Удалите ВСЕ существующие переменные:**
- SUPABASE_ANON_KEY (удалить)
- SUPABASE_URL (удалить) 
- NEXT_PUBLIC_SUPABASE_ANON_KEY (удалить)
- NEXT_PUBLIC_SUPABASE_URL (удалить)
- NEXTAUTH_URL (удалить)
- NEXTAUTH_SECRET (удалить)

### ШАГ 2: Добавить правильные production переменные

**Добавьте эти 11 переменных:**

1. **Ключ:** `NEXTAUTH_SECRET`
   **Значение:** `XH9mgmu70y7LaauJBoI7ynjGXlja6u4JCE894ZeKgKk=`
   **Тип:** Encrypted
   **Environments:** Production
   **✅ Add**

2. **Ключ:** `NEXTAUTH_URL`
   **Значение:** `https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app`
   **Тип:** Plain Text
   **Environments:** Production
   **✅ Add**

3. **Ключ:** `SUPABASE_URL`
   **Значение:** `https://rpzchsgutabxeabbnwas.supabase.co`
   **Тип:** Plain Text
   **Environments:** Production
   **✅ Add**

4. **Ключ:** `SUPABASE_ANON_KEY`
   **Значение:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI`
   **Тип:** Encrypted
   **Environments:** Production
   **✅ Add**

5. **Ключ:** `SUPABASE_SERVICE_ROLE_KEY`
   **Значение:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2MzMzOCwiZXhwIjoyMDc1MTM5MzM4fQ.UIkX-rUGGTbMGfd5YoF41Dx3QBuLH13nO-R3BXdbx2I`
   **Тип:** Encrypted
   **Environments:** Production
   **✅ Add**

6. **Ключ:** `NEXT_PUBLIC_SUPABASE_URL`
   **Значение:** `https://rpzchsgutabxeabbnwas.supabase.co`
   **Тип:** Plain Text
   **Environments:** Production
   **✅ Add**

7. **Ключ:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   **Значение:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI`
   **Тип:** Plain Text
   **Environments:** Production
   **✅ Add**

8. **Ключ:** `OPENROUTER_API_KEY`
   **Значение:** `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`
   **Тип:** Encrypted
   **Environments:** Production
   **✅ Add**

9. **Ключ:** `NODE_ENV`
   **Значение:** `production`
   **Тип:** Plain Text
   **Environments:** Production
   **✅ Add**

10. **Ключ:** `DEMO_MODE`
    **Значение:** `false`
    **Тип:** Plain Text
    **Environments:** Production
    **✅ Add**

11. **Ключ:** `E2E_ONBOARDING_FAKE`
    **Значение:** `false`
    **Тип:** Plain Text
    **Environments:** Production
    **✅ Add**

### ШАГ 3: Передеплой
После добавления всех переменных, Vercel автоматически передеплоит приложение.

### ШАГ 4: Проверка
Через 2-3 минуты запустите:
```bash
./CHECK_PRODUCTION_READY.sh
```

## ✅ ГОТОВО!

**Production URL:** https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app
