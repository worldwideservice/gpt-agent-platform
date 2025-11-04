#!/bin/bash

# Скрипт для обновления переменных окружения в Railway через API
# ⚠️ ВАЖНО: Все секреты должны быть в переменных окружения!
# Использование: 
#   export RAILWAY_TOKEN="your-token"
#   export UPSTASH_REDIS_REST_URL="https://..."
#   export UPSTASH_REDIS_REST_TOKEN="..."
#   export SUPABASE_SERVICE_ROLE_KEY="..."
#   export ENCRYPTION_KEY="..."
#   export OPENROUTER_API_KEY="..."
#   bash scripts/update-railway-variables.sh

set -e

# Проверка обязательных переменных окружения
RAILWAY_TOKEN="${RAILWAY_TOKEN:?RAILWAY_TOKEN is required - set it as environment variable}"
PROJECT_ID="${RAILWAY_PROJECT_ID:-ee93e450-dfe7-4414-892f-f3c6b83d91d1}"
SERVICE_ID="${RAILWAY_SERVICE_ID:-2a8d827f-d635-4314-98a8-8c2e5cf77f39}"
ENVIRONMENT_ID="${RAILWAY_ENVIRONMENT_ID:-3be5b1d4-690c-48c6-b792-86ef8be2b2b8}"

echo "🔧 Обновление переменных окружения для Worker в Railway через API"
echo "================================================================"
echo ""

# Все значения должны быть из переменных окружения
UPSTASH_REDIS_REST_URL="${UPSTASH_REDIS_REST_URL:?UPSTASH_REDIS_REST_URL is required}"
UPSTASH_REDIS_REST_TOKEN="${UPSTASH_REDIS_REST_TOKEN:?UPSTASH_REDIS_REST_TOKEN is required}"
SUPABASE_URL="${SUPABASE_URL:?SUPABASE_URL is required}"
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:?SUPABASE_SERVICE_ROLE_KEY is required}"
ENCRYPTION_KEY="${ENCRYPTION_KEY:?ENCRYPTION_KEY is required}"
OPENROUTER_API_KEY="${OPENROUTER_API_KEY:-}"  # Опционально

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
