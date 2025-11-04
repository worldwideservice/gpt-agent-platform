#!/bin/bash

# Скрипт для добавления переменных окружения в Railway
# Использование: bash scripts/railway-setup-variables.sh

set -e

RAILWAY_TOKEN="${RAILWAY_TOKEN:?RAILWAY_TOKEN is required}"

echo "🔧 Настройка переменных окружения для Worker в Railway"
echo "======================================================"
echo ""

# Устанавливаем токен
export RAILWAY_TOKEN="$RAILWAY_TOKEN"

# Значения из переменных окружения (обязательны)
SUPABASE_URL="${SUPABASE_URL:?SUPABASE_URL is required}"
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:?SUPABASE_SERVICE_ROLE_KEY is required}"
UPSTASH_REDIS_REST_URL="${UPSTASH_REDIS_REST_URL:?UPSTASH_REDIS_REST_URL is required}"
UPSTASH_REDIS_REST_TOKEN="${UPSTASH_REDIS_REST_TOKEN:?UPSTASH_REDIS_REST_TOKEN is required}"
OPENROUTER_API_KEY="${OPENROUTER_API_KEY:-}"
ENCRYPTION_KEY="${ENCRYPTION_KEY:?ENCRYPTION_KEY is required}"

# Для Upstash используем REST URL и токен из переменных окружения
# Worker будет формировать Redis URL из этих переменных
# Формат Redis URL: rediss://default:TOKEN@HOST:6379 (для TLS)

echo "📝 Добавление переменных окружения..."
echo ""

# Добавляем переменные через Railway CLI
# Используем правильный синтаксис: railway variables --set "KEY=VALUE"
railway variables --set "UPSTASH_REDIS_REST_URL=$UPSTASH_REDIS_REST_URL" --set "UPSTASH_REDIS_REST_TOKEN=$UPSTASH_REDIS_REST_TOKEN" --set "SUPABASE_URL=$SUPABASE_URL" --set "SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY" --set "ENCRYPTION_KEY=$ENCRYPTION_KEY" --set "OPENROUTER_API_KEY=$OPENROUTER_API_KEY" --set "JOB_QUEUE_NAME=agent-jobs" --set "JOB_CONCURRENCY=5" --set "PORT=3001" --service gpt-agent-platform --environment production 2>&1 || echo "⚠️  Ошибка при установке переменных. Проверьте Railway CLI авторизацию."

echo ""
echo "✅ Все переменные добавлены!"
echo ""
echo "⚠️  ВАЖНО: Проверьте ENCRYPTION_KEY - должен быть 32+ символа"
echo ""
echo "📋 Проверка переменных:"
railway variables

