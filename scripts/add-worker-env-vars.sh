#!/bin/bash
# Скрипт для добавления переменных окружения Worker через Railway API
# Используется как fallback, если браузерная автоматизация недоступна

SERVICE_ID="${SERVICE_ID:?SERVICE_ID is required}"
RAILWAY_TOKEN="${RAILWAY_TOKEN:?RAILWAY_TOKEN is required}"

echo "🔧 Добавление переменных окружения для Worker..."

# Функция для добавления переменной
add_variable() {
  local name=$1
  local value=$2
  
  echo "Добавляю переменную: $name"
  
  curl -s -X POST https://backboard.railway.com/graphql/v2 \
    -H "Authorization: Bearer $RAILWAY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"query\": \"mutation { variableUpsert(input: { serviceId: \\\"$SERVICE_ID\\\", name: \\\"$name\\\", value: \\\"$value\\\" }) { id name } }\"
    }" | python3 -m json.tool
  
  echo ""
}

# Добавляем переменные (используем переменные окружения)
add_variable "UPSTASH_REDIS_REST_URL" "${UPSTASH_REDIS_REST_URL:?UPSTASH_REDIS_REST_URL is required}"
add_variable "UPSTASH_REDIS_REST_TOKEN" "${UPSTASH_REDIS_REST_TOKEN:?UPSTASH_REDIS_REST_TOKEN is required}"
add_variable "SUPABASE_URL" "${SUPABASE_URL:?SUPABASE_URL is required}"
add_variable "SUPABASE_SERVICE_ROLE_KEY" "${SUPABASE_SERVICE_ROLE_KEY:?SUPABASE_SERVICE_ROLE_KEY is required}"
add_variable "ENCRYPTION_KEY" "${ENCRYPTION_KEY:?ENCRYPTION_KEY is required}"
add_variable "OPENROUTER_API_KEY" "${OPENROUTER_API_KEY:-}"
add_variable "JOB_QUEUE_NAME" "agent-jobs"
add_variable "JOB_CONCURRENCY" "5"
add_variable "PORT" "3001"

echo "✅ Все переменные окружения добавлены!"


