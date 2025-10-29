# ⚙️ Настройка переменных окружения в Vercel

## 📋 Критически важные переменные для продакшена:

### 1. Откройте Vercel Dashboard:
https://vercel.com/world-wide-services-62780b79/gpt-agent-platform/settings/environment-variables

### 2. Добавьте следующие переменные:

#### **Supabase (обязательно):**
```
NEXT_PUBLIC_SUPABASE_URL = https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = ваш-anon-key
SUPABASE_SERVICE_ROLE_KEY = ваш-service-role-key
SUPABASE_DEFAULT_ORGANIZATION_ID = uuid-вашей-организации
```

#### **Auth (обязательно):**
```
AUTH_SECRET = сгенерированный-32-символьный-ключ
NEXTAUTH_SECRET = сгенерированный-32-символьный-ключ
```
**Генерация:**
```bash
openssl rand -base64 32 | head -c 32
```

#### **OpenRouter (обязательно для LLM):**
```
OPENROUTER_API_KEY = sk-or-v1-ваш-ключ
```

#### **App URLs:**
```
NEXT_PUBLIC_APP_URL = https://gpt-agent-platform.vercel.app
BACKEND_API_URL = https://ваш-api-домен.com (если отдельный)
```

#### **Supabase (опционально, если используется напрямую):**
```
SUPABASE_URL = https://ваш-проект.supabase.co
SUPABASE_ANON_KEY = ваш-anon-key
```

---

## 🔑 Как получить значения:

### Supabase:
1. https://supabase.com/dashboard → ваш проект
2. Settings → API
3. Скопируйте:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`

### OpenRouter:
1. https://openrouter.ai/keys
2. Create Key
3. Скопируйте ключ (начинается с `sk-or-v1-`)

### Организация ID:
1. Supabase SQL Editor
2. Выполните: `SELECT id FROM organizations LIMIT 1;`
3. Скопируйте UUID

---

## ✅ После добавления:

1. Перейдите в **Deployments**
2. Найдите последний неудачный деплой
3. Нажмите **Redeploy** (или подождите автоматического пересборки)

---

**Важно:** После добавления переменных Vercel автоматически пересоберет проект!

