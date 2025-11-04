#!/bin/bash

# Скрипт для обновления переменных окружения в Railway через API
# Использование: bash scripts/update-railway-variables.sh

set -e

RAILWAY_TOKEN="${RAILWAY_TOKEN:-b2d35fc1-afcf-4589-8b24-da667437cf26}"
PROJECT_ID="ee93e450-dfe7-4414-892f-f3c6b83d91d1"
SERVICE_ID="2a8d827f-d635-4314-98a8-8c2e5cf77f39"
ENVIRONMENT_ID="3be5b1d4-690c-48c6-b792-86ef8be2b2b8"

echo "🔧 Обновление переменных окружения для Worker в Railway через API"
echo "================================================================"
echo ""

# Значения из env.production
UPSTASH_REDIS_REST_URL="https://usw1-merry-term-40416.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AYcUASQgZjI2MTM5NzYtYzU2ZS00YjFkLTk3MmQtMWIyODAzYjY3ODg5OGE3ODAzNDUwMzQ5NGE0Yjk5NzEwZDFiNWE4ZTg0MDU="
SUPABASE_URL="https://rpzchsgutabxeabbnwas.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2MzMzOCwiZXhwIjoyMDc1MTM5MzM4fQ.UIkX-rUGGTbMGfd5YoF41Dx3QBuLH13nO-R3BXdbx2I"
ENCRYPTION_KEY="HxXQ5WCMJ3TrFZehEHJUyMVgVX5fdGsSWy/2rixkVwE="
OPENROUTER_API_KEY="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"

# Функция для обновления переменной через Railway API
update_variable() {
  local key=$1
  local value=$2
  
  echo "📝 Обновление $key..."
  
  # Railway API endpoint для обновления переменной
  response=$(curl -s -X POST \
    "https://api.railway.app/v1/variables" \
    -H "Authorization: Bearer $RAILWAY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"projectId\": \"$PROJECT_ID\",
      \"serviceId\": \"$SERVICE_ID\",
      \"environmentId\": \"$ENVIRONMENT_ID\",
      \"key\": \"$key\",
      \"value\": \"$value\"
    }" 2>&1)
  
  if echo "$response" | grep -q "error\|Error\|unauthorized\|Unauthorized"; then
    echo "⚠️  Ошибка при обновлении $key: $response"
    return 1
  else
    echo "✅ $key обновлен"
    return 0
  fi
}

# Обновляем переменные
update_variable "UPSTASH_REDIS_REST_URL" "$UPSTASH_REDIS_REST_URL"
update_variable "UPSTASH_REDIS_REST_TOKEN" "$UPSTASH_REDIS_REST_TOKEN"
update_variable "SUPABASE_URL" "$SUPABASE_URL"
update_variable "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
update_variable "ENCRYPTION_KEY" "$ENCRYPTION_KEY"
update_variable "OPENROUTER_API_KEY" "$OPENROUTER_API_KEY"
update_variable "JOB_QUEUE_NAME" "agent-jobs"
update_variable "JOB_CONCURRENCY" "5"
update_variable "PORT" "3001"

echo ""
echo "✅ Все переменные обновлены!"
echo ""
echo "⚠️  ВАЖНО: Если Redis подключение не работает, нужно получить правильный Redis URL из Upstash Dashboard"
echo "   https://console.upstash.com -> Ваш Redis -> Раздел 'Redis' -> Скопируйте 'Redis URL'"
