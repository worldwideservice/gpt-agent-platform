#!/bin/bash

# Скрипт для настройки переменных окружения
# Использование: ./scripts/setup-env.sh

set -e

echo "🔧 Настройка переменных окружения..."

# Генерация AUTH_SECRET
echo ""
echo "📝 1. Генерация AUTH_SECRET (32 символа)..."
AUTH_SECRET=$(openssl rand -base64 32 | tr -d '\n' | cut -c1-32)
echo "AUTH_SECRET=$AUTH_SECRET"
echo ""
echo "Добавьте в .env.local:"
echo "AUTH_SECRET=$AUTH_SECRET"
echo "NEXTAUTH_SECRET=$AUTH_SECRET"
echo ""

# Генерация ENCRYPTION_KEY
echo "📝 2. Генерация ENCRYPTION_KEY (32 байта base64)..."
ENCRYPTION_KEY=$(openssl rand -base64 32)
echo "ENCRYPTION_KEY=$ENCRYPTION_KEY"
echo ""
echo "Добавьте в services/api/.env и services/worker/.env:"
echo "ENCRYPTION_KEY=$ENCRYPTION_KEY"
echo ""

# Создание .env.local шаблона
echo "📝 3. Создание .env.local шаблона..."
if [ ! -f .env.local ]; then
  cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<public-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
SUPABASE_DEFAULT_ORGANIZATION_ID="<uuid>"

# Auth
AUTH_SECRET="$AUTH_SECRET"
NEXTAUTH_SECRET="$AUTH_SECRET"

# Backend
BACKEND_API_URL="http://localhost:4000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OpenRouter
OPENROUTER_API_KEY="sk-or-v1-<your-key>"

# Kommo CRM
KOMMO_OAUTH_REDIRECT_BASE="http://localhost:3000/integrations/kommo/oauth/callback"
KOMMO_WEBHOOK_SECRET="change-me"
EOF
  echo "✅ .env.local создан"
else
  echo "⚠️  .env.local уже существует, не перезаписываем"
fi

# Создание services/api/.env шаблона
echo ""
echo "📝 4. Создание services/api/.env шаблона..."
if [ ! -f services/api/.env ]; then
  cat > services/api/.env << EOF
# Supabase
SUPABASE_URL="https://<project>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"

# Redis
REDIS_URL="redis://localhost:6379"

# Encryption
ENCRYPTION_KEY="$ENCRYPTION_KEY"

# OpenRouter
OPENROUTER_API_KEY="sk-or-v1-<your-key>"

# Kommo CRM
KOMMO_OAUTH_REDIRECT_BASE="http://localhost:3000/integrations/kommo/oauth/callback"
KOMMO_WEBHOOK_SECRET="change-me"

# Queue
JOB_QUEUE_NAME="agent-jobs"
EOF
  echo "✅ services/api/.env создан"
else
  echo "⚠️  services/api/.env уже существует, не перезаписываем"
fi

# Создание services/worker/.env шаблона
echo ""
echo "📝 5. Создание services/worker/.env шаблона..."
if [ ! -f services/worker/.env ]; then
  cat > services/worker/.env << EOF
# Supabase
SUPABASE_URL="https://<project>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"

# Redis
REDIS_URL="redis://localhost:6379"

# Encryption
ENCRYPTION_KEY="$ENCRYPTION_KEY"

# OpenRouter
OPENROUTER_API_KEY="sk-or-v1-<your-key>"

# Queue
JOB_QUEUE_NAME="agent-jobs"
JOB_CONCURRENCY="5"
EOF
  echo "✅ services/worker/.env создан"
else
  echo "⚠️  services/worker/.env уже существует, не перезаписываем"
fi

echo ""
echo "✅ Готово! Теперь:"
echo "1. Заполните реальные значения в .env файлах"
echo "2. Примените миграции через Supabase Dashboard"
echo "3. Проверьте: npm run check:env"






