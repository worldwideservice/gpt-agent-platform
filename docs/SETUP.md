# Настройка окружения

## Переменные окружения

Создайте файл `.env.local` (для Next.js) и `.env` в папке `services/api` со значениями:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<public-anon-key>"
SUPABASE_URL="https://<project>.supabase.co"
SUPABASE_ANON_KEY="<public-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role>"
SUPABASE_DEFAULT_ORGANIZATION_ID="<uuid>"

# Backend
BACKEND_API_URL="http://localhost:4000"
ENCRYPTION_KEY="<base64 32-byte key>"
KOMMO_OAUTH_REDIRECT_BASE="http://localhost:3000/integrations/kommo/oauth/callback"
KOMMO_WEBHOOK_SECRET="change-me"
OPENROUTER_API_KEY="<your-openrouter-token>"
REDIS_URL="redis://localhost:6379"
```

Создайте файл `.env` в `services/worker` со значениями:

```
SUPABASE_URL="https://<project>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service-role>"
REDIS_URL="redis://localhost:6379"
ENCRYPTION_KEY="<base64 32-byte key>"
JOB_QUEUE_NAME="agent-jobs"
JOB_CONCURRENCY="5"
OPENROUTER_API_KEY="<your-openrouter-token>"
```

Генерация `ENCRYPTION_KEY`:

```bash
openssl rand -base64 32
```

## Supabase

1. `supabase db remote commit`
2. `supabase db push` (локально) или выполните `supabase/schema.sql` вручную.
3. Запустите seed: `supabase db reset --seed supabase/seed.sql`.

## Backend API

```
cd services/api
npm install
npm run dev
```

## Worker (BullMQ)

```
cd services/worker
npm install
npm run dev
```

## Frontend

```
npm install
npm run dev
```
