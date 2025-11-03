#!/bin/bash

# Скрипт для добавления переменных окружения в Railway
# Использование: bash scripts/railway-setup-variables.sh

set -e

RAILWAY_TOKEN="${RAILWAY_TOKEN:-5cd06a89-c580-450d-958c-6b1553bb1428}"

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

# Для Upstash нужно получить Redis URL из Dashboard
# Upstash предоставляет два URL: REST (для API) и Redis (для прямого подключения)
# Для BullMQ нужен Redis URL, который можно получить в Upstash Dashboard:
# 1. Зайдите в Upstash Dashboard: https://console.upstash.com
# 2. Выберите ваш Redis instance
# 3. В разделе "Redis REST API" найдите "Redis URL"
# Формат: redis://default:TOKEN@HOST:PORT
# ИЛИ используйте формат через REST API (но это медленнее)
# 
# Временно используем Upstash REST URL, но лучше получить Redis URL из Dashboard
REDIS_HOST=$(echo "$UPSTASH_REST_URL" | sed 's|https://||' | sed 's|http://||' | cut -d':' -f1)
# Для Upstash Redis URL формат обычно: redis://default:TOKEN@ENDPOINT:PORT
# ENDPOINT можно получить из Upstash Dashboard в разделе "Redis" -> "Redis URL"
REDIS_URL="redis://default:${UPSTASH_REST_TOKEN}@${REDIS_HOST}:6379"

cd services/worker || exit 1

echo "📝 Добавление переменных окружения..."
echo ""

# Добавляем переменные
railway variables set REDIS_URL="$REDIS_URL" 2>&1 | grep -v "already exists" || echo "✅ REDIS_URL"
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

