#!/bin/bash

# Скрипт для добавления переменных окружения в Railway
# Использование: bash scripts/railway-setup-variables.sh

set -e

RAILWAY_TOKEN="${RAILWAY_TOKEN:-b2d35fc1-afcf-4589-8b24-da667437cf26}"

echo "🔧 Настройка переменных окружения для Worker в Railway"
echo "======================================================"
echo ""

# Устанавливаем токен
export RAILWAY_TOKEN="$RAILWAY_TOKEN"

# Значения из env.production
SUPABASE_URL="https://rpzchsgutabxeabbnwas.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2MzMzOCwiZXhwIjoyMDc1MTM5MzM4fQ.UIkX-rUGGTbMGfd5YoF41Dx3QBuLH13nO-R3BXdbx2I"
UPSTASH_REST_URL="https://usw1-merry-term-40416.upstash.io"
UPSTASH_REST_TOKEN="AYcUASQgZjI2MTM5NzYtYzU2ZS00YjFkLTk3MmQtMWIyODAzYjY3ODg5OGE3ODAzNDUwMzQ5NGE0Yjk5NzEwZDFiNWE4ZTg0MDU="
OPENROUTER_API_KEY="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"
ENCRYPTION_KEY="HxXQ5WCMJ3TrFZehEHJUyMVgVX5fdGsSWy/2rixkVwE="

# Для Upstash используем REST URL и токен
# Worker будет формировать Redis URL из этих переменных
# Формат Redis URL: rediss://default:TOKEN@HOST:6380 (для TLS)
UPSTASH_REDIS_REST_URL="$UPSTASH_REST_URL"
UPSTASH_REDIS_REST_TOKEN="$UPSTASH_REST_TOKEN"

cd services/worker || exit 1

echo "📝 Добавление переменных окружения..."
echo ""

# Добавляем переменные
railway variables set UPSTASH_REDIS_REST_URL="$UPSTASH_REDIS_REST_URL" 2>&1 | grep -v "already exists" || echo "✅ UPSTASH_REDIS_REST_URL"
railway variables set UPSTASH_REDIS_REST_TOKEN="$UPSTASH_REDIS_REST_TOKEN" 2>&1 | grep -v "already exists" || echo "✅ UPSTASH_REDIS_REST_TOKEN"
railway variables set SUPABASE_URL="$SUPABASE_URL" 2>&1 | grep -v "already exists" || echo "✅ SUPABASE_URL"
railway variables set SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" 2>&1 | grep -v "already exists" || echo "✅ SUPABASE_SERVICE_ROLE_KEY"
railway variables set ENCRYPTION_KEY="$ENCRYPTION_KEY" 2>&1 | grep -v "already exists" || echo "✅ ENCRYPTION_KEY"
railway variables set OPENROUTER_API_KEY="$OPENROUTER_API_KEY" 2>&1 | grep -v "already exists" || echo "✅ OPENROUTER_API_KEY"
railway variables set JOB_QUEUE_NAME="agent-jobs" 2>&1 | grep -v "already exists" || echo "✅ JOB_QUEUE_NAME"
railway variables set JOB_CONCURRENCY="5" 2>&1 | grep -v "already exists" || echo "✅ JOB_CONCURRENCY"
railway variables set PORT="3001" 2>&1 | grep -v "already exists" || echo "✅ PORT"

echo ""
echo "✅ Все переменные добавлены!"
echo ""
echo "⚠️  ВАЖНО: Проверьте ENCRYPTION_KEY - должен быть 32+ символа"
echo ""
echo "📋 Проверка переменных:"
railway variables

