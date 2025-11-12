# Environment Variables - Полный список

> Полный список всех переменных окружения для GPT Agent AI Platform
> 
> **Версия:** 1.1
> **Дата обновления:** 2025-02-18

> **Шаблоны:**
> - `env.example` — development
> - `env.staging.example` — staging/preview
> - `env.production.example` — production
>
> После копирования шаблонов выполните `npm run verify:env`, чтобы убедиться, что обязательные переменные заполнены.

## 📋 Содержание

1. [Обязательные переменные](#обязательные-переменные)
2. [AI интеграции](#ai-интеграции)
3. [CRM интеграции](#crm-интеграции)
4. [База данных](#база-данных)
5. [Очереди и кэширование](#очереди-и-кэширование)
6. [Real-time](#real-time)
7. [Мониторинг](#мониторинг)
8. [Email](#email)
9. [Безопасность](#безопасность)
10. [Product Analytics](#product-analytics)
11. [Feature Flags](#feature-flags)

---

## Обязательные переменные

### Аутентификация

```bash
# Секрет для NextAuth JWT токенов (минимум 32 символа)
# Генерация: openssl rand -base64 32
NEXTAUTH_SECRET=your_secure_random_secret_32_chars_minimum

# URL приложения
# Development: http://localhost:3000
# Production: https://your-domain.com
NEXTAUTH_URL=http://localhost:3000

# Дополнительный секрет для JWT токенов
# Генерация: openssl rand -base64 32
JWT_SECRET=another_secure_random_secret_for_jwt

# Refresh token секрет (опционально)
JWT_REFRESH_SECRET=refresh_token_secret_32_chars_minimum
```

### База данных (Supabase)

```bash
# URL вашего Supabase проекта
SUPABASE_URL=https://your-project-ref.supabase.co

# Анонимный ключ Supabase (для серверных операций)
SUPABASE_ANON_KEY=your_supabase_anon_key

# Сервисный ключ Supabase (ОБХОДИТ RLS, используйте только на сервере!)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Публичный URL Supabase (для клиентских операций)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Публичный анонимный ключ Supabase (для клиентских операций)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# UUID организации по умолчанию (опционально, для demo-режима)
SUPABASE_DEFAULT_ORGANIZATION_ID=00000000-0000-4000-8000-000000000001
```

### Приложение

```bash
# URL приложения (для ссылок и редиректов)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Режим окружения
NODE_ENV=development
```

---

## AI интеграции

### OpenRouter

```bash
# API ключ для OpenRouter
# Получение: https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key

# Модель по умолчанию для LLM
OPENROUTER_DEFAULT_MODEL=openai/gpt-4o-mini

# Модель для embeddings
OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-large

# Base URL OpenRouter (опционально, по умолчанию: https://openrouter.ai/api/v1)
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

### OpenAI (GPT-5 Brain)

```bash
# API ключ для OpenAI (для GPT-5 Brain)
OPENAI_API_KEY=sk-your-openai-api-key

# Модель GPT-5 для AI Brain
OPENAI_BRAIN_MODEL=gpt-5

# Модель для embeddings (если не используется OpenRouter)
OPENAI_EMBEDDING_MODEL=text-embedding-3-large

# Base URL OpenAI (опционально, по умолчанию: https://api.openai.com/v1)
OPENAI_BASE_URL=https://api.openai.com/v1
```

### Whisper (ASR)

```bash
# Использовать OpenAI Whisper для распознавания речи
WHISPER_ENABLED=true

# Модель Whisper (tiny, base, small, medium, large)
WHISPER_MODEL=base
```

### TTS (Text-to-Speech)

```bash
# Провайдер TTS (elevenlabs, azure, openai)
TTS_PROVIDER=elevenlabs

# ElevenLabs API ключ
ELEVENLABS_API_KEY=your-elevenlabs-api-key

# ElevenLabs Voice ID
ELEVENLABS_VOICE_ID=your-voice-id

# Azure TTS Key (если используется Azure)
AZURE_TTS_KEY=your-azure-tts-key
AZURE_TTS_REGION=your-azure-region
```

---

## CRM интеграции

### Kommo (amoCRM)

```bash
# OAuth credentials для Kommo
KOMMO_CLIENT_ID=your-kommo-client-id
KOMMO_CLIENT_SECRET=your-kommo-client-secret
KOMMO_REDIRECT_URI=http://localhost:3000/api/v1/crm/kommo/callback

# Базовый URL для OAuth редиректа Kommo (legacy)
KOMMO_OAUTH_REDIRECT_BASE=http://localhost:3000/integrations/kommo/oauth/callback

# Секрет для проверки подписи Kommo Webhook
KOMMO_WEBHOOK_SECRET=change-me-in-production

# Включить тестовые endpoints Kommo API (0 = выключено, 1 = включено)
KOMMO_TEST_ENABLED=0

# Настройки Kommo для ручного тестирования (только для разработки!)
KOMMO_TEST_DOMAIN=your-domain.kommo.com
KOMMO_TEST_CLIENT_ID=test-client-id
KOMMO_TEST_CLIENT_SECRET=test-client-secret
KOMMO_TEST_REDIRECT_URI=http://localhost:3000/test/callback
KOMMO_TEST_ACCESS_TOKEN=test-access-token
KOMMO_TEST_REFRESH_TOKEN=test-refresh-token

# Учетные данные Kommo для скриптов (только для разработки!)
# ⚠️ НЕ КОММИТЬТЕ РЕАЛЬНЫЕ КРЕДЫ В GIT!
KOMMO_EMAIL=your-email@example.com
KOMMO_PASSWORD=your-password
KOMMO_DOMAIN=your-domain.kommo.com
```

---

## Очереди и кэширование

### Redis

```bash
# REST URL для Upstash Redis (используется в production)
UPSTASH_REDIS_REST_URL=https://your-upstash-redis-url.upstash.io

# REST токен для Upstash Redis
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Прямое подключение к Redis (для локальной разработки)
# Формат: redis://username:password@host:port
REDIS_URL=redis://localhost:6379

# Redis для BullMQ (опционально, если отличается от REDIS_URL)
BULLMQ_REDIS_URL=redis://localhost:6379

# Redis password (если требуется)
REDIS_PASSWORD=

# Redis database number (по умолчанию: 0)
REDIS_DB=0
```

### Rate Limiting

```bash
# Включить rate limiting (true/false)
RATE_LIMIT_ENABLED=true

# Rate limit для API (запросов в минуту)
RATE_LIMIT_API=100

# Rate limit для синхронизации CRM (запросов в минуту)
RATE_LIMIT_CRM_SYNC=10

# Rate limit для создания/обновления (запросов в минуту)
RATE_LIMIT_CREATE_UPDATE=30
```

---

## Real-time

### WebSocket

```bash
# URL фронтенда для WebSocket CORS
FRONTEND_URL=http://localhost:3000

# URL WebSocket сервера (опционально, по умолчанию используется window.location.origin)
WEBSOCKET_URL=ws://localhost:3000

# Путь WebSocket (по умолчанию: /api/socket/io)
WEBSOCKET_PATH=/api/socket/io
```

### Supabase Realtime (опционально)

```bash
# Включить Supabase Realtime (true/false)
SUPABASE_REALTIME_ENABLED=true

# Realtime API ключ (обычно тот же что SUPABASE_ANON_KEY)
SUPABASE_REALTIME_KEY=your_supabase_realtime_key
```

---

## Мониторинг

### Sentry

```bash
# Sentry DSN для отслеживания ошибок
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Публичный Sentry DSN (для клиентской стороны)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Sentry environment
SENTRY_ENVIRONMENT=production

# Sentry traces sample rate (0.0 - 1.0)
SENTRY_TRACES_SAMPLE_RATE=1.0

# Sentry profiles sample rate (0.0 - 1.0)
SENTRY_PROFILES_SAMPLE_RATE=1.0
```

### Datadog (опционально)

```bash
# Datadog API ключ
DATADOG_API_KEY=your-datadog-api-key

# Datadog Application Key
DATADOG_APP_KEY=your-datadog-app-key

# Datadog site (datadoghq.com, datadoghq.eu, us3.datadoghq.com, etc.)
DATADOG_SITE=datadoghq.com

# Datadog service name
DATADOG_SERVICE_NAME=gpt-agent-ai
```

### Vercel Analytics

```bash
# Vercel Analytics (автоматически включен на Vercel)
# Для локальной разработки не требуется
```

---

## Product Analytics

```bash
# Segment analytics (публичный ключ)
NEXT_PUBLIC_SEGMENT_WRITE_KEY=segment-write-key

# PostHog analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key

# Кастомный домен PostHog (по умолчанию https://app.posthog.com)
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## Email

### SMTP

```bash
# SMTP настройки для отправки email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key

# Email отправителя
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=GPT Agent AI

# Reply-to email
REPLY_TO_EMAIL=support@yourdomain.com
```

### SendGrid (альтернатива SMTP)

```bash
# SendGrid API ключ (если используется SendGrid напрямую)
SENDGRID_API_KEY=SG.your-sendgrid-api-key

# SendGrid From Email
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

---

## Безопасность

### Шифрование

```bash
# Ключ шифрования для чувствительных данных (32 байта в base64)
# Генерация: openssl rand -base64 32
ENCRYPTION_KEY=32_char_encryption_key_for_sensitive_data
```

### CORS

```bash
# Разрешенные origins для CORS (через запятую)
CORS_ORIGINS=http://localhost:3000,https://your-domain.com

# Разрешить credentials в CORS
CORS_CREDENTIALS=true
```

### Admin доступ

```bash
# Список email адресов администраторов (через запятую)
ADMIN_USERS=admin@example.com,manager@example.com
```

---

## Feature Flags

```bash
# Демо-режим (только для разработки/тестирования)
DEMO_MODE=false

# Фейковый onboarding для E2E тестов (только для тестирования)
E2E_ONBOARDING_FAKE=false

# Включить аналитику
ENABLE_ANALYTICS=true

# Включить crash reporting
ENABLE_CRASH_REPORTING=true

# Включить кэширование
ENABLE_CACHE=true

# TTL кэша в секундах
CACHE_TTL=300
```

---

## Дополнительные настройки

### Backend API

```bash
# URL Fastify API сервиса (для локальной разработки: http://localhost:4000)
BACKEND_API_URL=http://localhost:4000

# Backend API ключ (если требуется)
BACKEND_API_KEY=your-backend-api-key
```

### Cron Jobs

```bash
# Секрет для защиты cron endpoints (Vercel Cron)
CRON_SECRET=your-cron-secret-here
```

### File Storage (S3/R2)

```bash
# S3/R2 совместимое хранилище
S3_BUCKET_NAME=your-bucket-name
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_REGION=us-east-1
S3_ENDPOINT=https://s3.amazonaws.com

# R2 (Cloudflare) endpoint (если используется R2)
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
```

### Vector Database (опционально, если не используется pgvector)

```bash
# Pinecone API ключ
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
PINECONE_INDEX_NAME=your-index-name

# Weaviate URL (если используется Weaviate)
WEAVIATE_URL=https://your-weaviate-instance.weaviate.network
WEAVIATE_API_KEY=your-weaviate-api-key
```

---

## Проверка переменных

### Скрипт проверки

```bash
# Проверить наличие всех обязательных переменных
npm run check:env

# Проверить и верифицировать переменные
npm run verify:env
```

### Обязательные переменные для production

```bash
# Минимальный набор для production:
NEXTAUTH_SECRET=*
NEXTAUTH_URL=*
SUPABASE_URL=*
SUPABASE_SERVICE_ROLE_KEY=*
NEXT_PUBLIC_SUPABASE_URL=*
NEXT_PUBLIC_SUPABASE_ANON_KEY=*
OPENROUTER_API_KEY=*
REDIS_URL=* (или UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
```

---

## Примечания

1. **Все переменные с префиксом `NEXT_PUBLIC_` доступны в браузере** - не используйте для секретов!
2. **Секретные переменные (ключи, токены) НЕ должны иметь префикс `NEXT_PUBLIC_`**
3. **Для production используйте `env.production.example` как шаблон**
4. **Никогда не коммитьте `.env.local` с реальными секретами в Git**
5. **Используйте переменные окружения вашего хостинга (Vercel, Railway, etc.) для production**

---

## Примеры для разных окружений

### Development (.env.local)

```bash
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
DEMO_MODE=true
```

### Staging (.env.staging)

```bash
NODE_ENV=production
NEXTAUTH_URL=https://staging.your-domain.com
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com
SENTRY_ENVIRONMENT=staging
```

### Production (.env.production)

```bash
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
SENTRY_ENVIRONMENT=production
DEMO_MODE=false
```

---

**Дата создания:** 2025-01-26  
**Версия:** 1.0

