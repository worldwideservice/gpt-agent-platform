#!/bin/bash
# Скрипт для добавления переменных окружения Worker через Railway API
# Используется как fallback, если браузерная автоматизация недоступна

SERVICE_ID="2a8d827f-d635-4314-98a8-8c2e5cf77f39"
RAILWAY_TOKEN="b2d35fc1-afcf-4589-8b24-da667437cf26"

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

# Добавляем переменные
add_variable "REDIS_URL" "redis://default:AYcUASQgZjI2MTM5NzYtYzU2ZS00YjFkLTk3MmQtMWIyODAzYjY3ODg5OGE3ODAzNDUwMzQ5NGE0Yjk5NzEwZDFiNWE4ZTg0MDU=@usw1-merry-term-40416.upstash.io:6379"
add_variable "SUPABASE_URL" "https://rpzchsgutabxeabbnwas.supabase.co"
add_variable "SUPABASE_SERVICE_ROLE_KEY" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2MzMzOCwiZXhwIjoyMDc1MTM5MzM4fQ.UIkX-rUGGTbMGfd5YoF41Dx3QBuLH13nO-R3BXdbx2I"
add_variable "ENCRYPTION_KEY" "HxXQ5WCMJ3TrFZehEHJUyMVgVX5fdGsSWy/2rixkVwE="
add_variable "OPENROUTER_API_KEY" "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"
add_variable "JOB_QUEUE_NAME" "agent-jobs"
add_variable "JOB_CONCURRENCY" "5"
add_variable "PORT" "3001"

echo "✅ Все переменные окружения добавлены!"

