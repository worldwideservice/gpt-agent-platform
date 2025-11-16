# Deployment Guide

**Задача 5.2: Documentation**
**Версия:** 1.0
**Дата:** 2025-11-16

Полное руководство по деплою GPT Agent Platform в production.

---

## 📋 Содержание

- [Pre-deployment Checklist](#pre-deployment-checklist)
- [Environment Variables](#environment-variables)
- [Deployment Options](#deployment-options)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Docker](#docker)
  - [Self-hosted](#self-hosted)
- [Database Setup](#database-setup)
- [Redis Setup](#redis-setup)
- [Security Configuration](#security-configuration)
- [Post-deployment](#post-deployment)
- [Rollback Procedure](#rollback-procedure)

---

## Pre-deployment Checklist

### ✅ Code Quality

```bash
# Запустить все проверки перед деплоем
npm run lint                 # ESLint проверка
npm run type-check          # TypeScript проверка
npm run test:unit           # Юнит тесты
npm run test:e2e            # E2E тесты
npm run build               # Production сборка
```

### ✅ Security Audit

```bash
# Security проверки (Задача 5.1)
npm audit --audit-level=high

# Проверить что установлены обязательные ENV
- ADMIN_EMAILS
- ADMIN_API_TOKEN
- KOMMO_WEBHOOK_SECRET
```

### ✅ Performance

```bash
# Проверить что миграции применены (Задача 4.4)
npm run db:migrate:status

# Проверить индексы в БД
- idx_agents_org_status_created
- idx_agents_name_trgm
- idx_agents_org_active
# ... и другие (см. PERFORMANCE_OPTIMIZATION.md)
```

---

## Environment Variables

### Категории переменных

#### 1. NextAuth (Обязательно)

```bash
NEXTAUTH_SECRET=<64-char-random-string>
NEXTAUTH_URL=https://your-domain.com

# Генерация NEXTAUTH_SECRET:
openssl rand -base64 48
```

#### 2. Database (Обязательно)

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database URL (для миграций)
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

#### 3. Redis & Queue (Обязательно)

```bash
# Upstash Redis (рекомендуется для production)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AYXXXxxxXXX

# Или локальный Redis
REDIS_URL=redis://localhost:6379

# BullMQ Queue
JOB_QUEUE_NAME=gpt-agent-queue
```

#### 4. AI Provider (Обязательно)

```bash
# OpenRouter (рекомендуется)
OPENROUTER_API_KEY=sk-or-v1-xxxxx
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Или OpenAI
OPENAI_API_KEY=sk-xxxxx
```

#### 5. CRM Integration (Опционально)

```bash
# Kommo/amoCRM
KOMMO_CLIENT_ID=xxxxx
KOMMO_CLIENT_SECRET=xxxxx
KOMMO_REDIRECT_URI=https://your-domain.com/api/integrations/kommo/oauth/callback
KOMMO_WEBHOOK_SECRET=<strong-random-string>

# Генерация KOMMO_WEBHOOK_SECRET:
openssl rand -hex 32
```

#### 6. Security (Задача 5.1 - Обязательно!)

```bash
# CSRF Protection (опционально, для постепенного внедрения)
ENABLE_CSRF_PROTECTION=1

# Admin Access (ОБЯЗАТЕЛЬНО!)
ADMIN_EMAILS=admin@company.com,security@company.com
ADMIN_API_TOKEN=<strong-random-token>

# Генерация ADMIN_API_TOKEN:
openssl rand -base64 32

# Metrics Access (опционально)
METRICS_AUTH_TOKEN=<strong-random-token>
```

#### 7. Monitoring & Analytics (Опционально)

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=xxxxx

# Vercel Analytics
VERCEL_ANALYTICS_ID=xxxxx

# Posthog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

#### 8. Feature Flags

```bash
# Demo Mode
DEMO_MODE=false
E2E_ONBOARDING_FAKE=false

# Development
NODE_ENV=production
```

---

## Deployment Options

### Vercel (Recommended)

Vercel - это рекомендуемая платформа для деплоя Next.js приложений.

#### Шаг 1: Подготовка проекта

```bash
# Установить Vercel CLI
npm install -g vercel

# Войти в Vercel
vercel login
```

#### Шаг 2: Настройка ENV переменных

Создайте файл `.env.production` или используйте Vercel Dashboard:

```bash
# Через CLI
vercel env add NEXTAUTH_SECRET production
vercel env add SUPABASE_URL production
# ... остальные переменные

# Или через Dashboard: https://vercel.com/your-project/settings/environment-variables
```

#### Шаг 3: Деплой

```bash
# Preview деплой
vercel

# Production деплой
vercel --prod

# Или через скрипт
npm run vercel:deploy
```

#### Шаг 4: Настройка домена

1. Перейдите в `Vercel Dashboard → Settings → Domains`
2. Добавьте ваш домен (например, `app.your-domain.com`)
3. Настройте DNS записи согласно инструкциям Vercel

#### Шаг 5: Настройка Build Settings

В `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

### Docker

Для деплоя через Docker используйте Docker Compose.

#### Производственный Docker Compose

Создайте `docker-compose.production.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - REDIS_URL=redis://redis:6379
      # ... остальные ENV
    depends_on:
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 3s
      retries: 3

  worker:
    build:
      context: .
      dockerfile: Dockerfile.worker
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      # ... остальные ENV
    depends_on:
      - redis
    restart: unless-stopped

volumes:
  redis-data:
```

#### Деплой через Docker

```bash
# Создать .env файл с production переменными
cp .env.example .env.production

# Запустить production окружение
docker-compose -f docker-compose.production.yml up -d

# Проверить статус
docker-compose -f docker-compose.production.yml ps

# Просмотреть логи
docker-compose -f docker-compose.production.yml logs -f app
```

#### Dockerfile для Production

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

---

### Self-hosted

Для деплоя на собственный сервер (VPS, Dedicated).

#### Требования сервера

- **CPU**: 2+ cores
- **RAM**: 4GB+ (8GB рекомендуется)
- **Storage**: 20GB+ SSD
- **OS**: Ubuntu 22.04 LTS (рекомендуется)
- **Node.js**: 20+
- **PM2** или **systemd** для управления процессами

#### Установка на Ubuntu

```bash
# 1. Обновить систему
sudo apt update && sudo apt upgrade -y

# 2. Установить Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Установить PM2
sudo npm install -g pm2

# 4. Клонировать репозиторий
git clone https://github.com/your-org/gpt-agent-platform.git
cd gpt-agent-platform

# 5. Установить зависимости
npm ci --only=production

# 6. Настроить ENV
cp .env.example .env.production
nano .env.production  # Настроить все переменные

# 7. Собрать приложение
npm run build

# 8. Запустить через PM2
pm2 start ecosystem.config.js --env production

# 9. Настроить автозапуск
pm2 save
pm2 startup

# 10. Настроить Nginx (reverse proxy)
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/gpt-agent-platform
```

#### Nginx конфигурация

```nginx
upstream nextjs {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req zone=api burst=20 nodelay;

    # Client max body size
    client_max_body_size 10M;
}
```

#### PM2 Ecosystem config

`ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'gpt-agent-platform',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 2,
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s'
  }, {
    name: 'gpt-agent-worker',
    script: 'node',
    args: 'services/worker/dist/index.js',
    env: {
      NODE_ENV: 'production'
    },
    instances: 1,
    exec_mode: 'fork',
    autorestart: true
  }]
}
```

---

## Database Setup

### Supabase Migration

```bash
# 1. Применить миграции
npm run db:migrate

# 2. Проверить статус
npm run db:migrate:status

# 3. Применить seed данные (опционально)
npm run db:seed

# 4. Проверить индексы (Задача 4.4)
# В Supabase Dashboard → SQL Editor:
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('agents', 'agent_activity_metrics')
ORDER BY tablename, indexname;
```

### RLS (Row Level Security) Policies

Проверьте что RLS политики настроены:

```sql
-- Agents table RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their org agents"
  ON agents FOR SELECT
  USING (org_id = current_setting('request.jwt.claims')::json->>'orgId');

CREATE POLICY "Users can insert their org agents"
  ON agents FOR INSERT
  WITH CHECK (org_id = current_setting('request.jwt.claims')::json->>'orgId');

-- ... и т.д. для других таблиц
```

---

## Redis Setup

### Upstash (Recommended for Production)

1. Перейдите на [upstash.com](https://upstash.com)
2. Создайте Redis database
3. Выберите регион близкий к вашему серверу
4. Скопируйте `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN`
5. Добавьте в environment variables

### Self-hosted Redis

Для production рекомендуется Redis Cluster или Sentinel:

```bash
# Установить Redis
sudo apt install redis-server

# Настроить для production
sudo nano /etc/redis/redis.conf

# Рекомендуемые настройки:
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000

# Запустить Redis
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

---

## Security Configuration

### 1. CSRF Protection (Задача 5.1)

```bash
# Включить CSRF protection
ENABLE_CSRF_PROTECTION=1
```

**Обновить клиентский код:**

```typescript
// Получить CSRF токен при инициализации
const { csrfToken } = await fetch('/api/csrf-token').then(r => r.json())

// Включать во все state-changing запросы
fetch('/api/agents', {
  method: 'POST',
  headers: {
    'x-csrf-token': csrfToken
  },
  body: JSON.stringify(data)
})
```

### 2. Admin Access

```bash
# Настроить admin emails
ADMIN_EMAILS=admin@company.com,cto@company.com

# Сгенерировать admin token
openssl rand -base64 32
ADMIN_API_TOKEN=<результат-команды-выше>
```

### 3. Webhook Security

```bash
# Сгенерировать webhook secret
openssl rand -hex 32
KOMMO_WEBHOOK_SECRET=<результат-команды-выше>
```

### 4. SSL/TLS Certificates

```bash
# Установить Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Получить сертификат
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Автообновление (добавить в crontab)
sudo crontab -e
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Post-deployment

### Health Checks

```bash
# Проверить health endpoint
curl https://your-domain.com/api/health

# Ожидаемый ответ:
{
  "status": "ok",
  "timestamp": "2025-11-16T12:00:00.000Z"
}

# Проверить ready endpoint
curl https://your-domain.com/api/health/ready
```

### Monitoring Setup

#### 1. Prometheus Metrics

```bash
# Metrics endpoint (требует admin auth)
curl -H "Authorization: Bearer ${ADMIN_API_TOKEN}" \
  https://your-domain.com/api/metrics
```

#### 2. Sentry Error Tracking

```bash
# Проверить что Sentry работает
# В Sentry Dashboard должны появляться события
```

#### 3. Uptime Monitoring

Настройте uptime мониторинг через:
- UptimeRobot (бесплатно)
- Pingdom
- Datadog
- Better Uptime

### Performance Validation

```bash
# Проверить время ответа
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com

# curl-format.txt:
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_appconnect:  %{time_appconnect}\n
time_pretransfer:  %{time_pretransfer}\n
time_redirect:  %{time_redirect}\n
time_starttransfer:  %{time_starttransfer}\n
----------\n
time_total:  %{time_total}\n
```

---

## Rollback Procedure

### Vercel Rollback

```bash
# Список деплоев
vercel ls

# Rollback к предыдущей версии
vercel rollback https://your-app-xxxxx.vercel.app
```

### Docker Rollback

```bash
# Остановить текущую версию
docker-compose -f docker-compose.production.yml down

# Checkout предыдущей версии
git checkout <previous-commit-hash>

# Пересобрать и запустить
docker-compose -f docker-compose.production.yml up -d --build
```

### PM2 Rollback

```bash
# Остановить приложение
pm2 stop gpt-agent-platform

# Checkout предыдущей версии
git checkout <previous-commit-hash>

# Пересобрать
npm run build

# Перезапустить
pm2 restart gpt-agent-platform
```

---

## Troubleshooting

Если возникли проблемы после деплоя, см. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

---

## Support

- **Documentation**: `/api/docs`
- **Security**: `SECURITY_AUDIT_REPORT.md`
- **Performance**: `PERFORMANCE_OPTIMIZATION.md`
- **Issues**: GitHub Issues

---

**Last Updated**: 2025-11-16
**Version**: 1.0
