#!/bin/bash

# Скрипт для проверки health check Worker на Railway
# Использование: ./scripts/check-worker-health.sh [WORKER_URL]

set -e

WORKER_URL="${1:-${WORKER_URL}}"

if [ -z "$WORKER_URL" ]; then
  echo "❌ Ошибка: Не указан URL Worker"
  echo "Использование: ./scripts/check-worker-health.sh [WORKER_URL]"
  echo "Или установите переменную окружения WORKER_URL"
  echo ""
  echo "Для получения URL Worker:"
  echo "1. Откройте Railway Dashboard"
  echo "2. Перейдите в сервис Worker"
  echo "3. Скопируйте Public Domain URL (если сервис публичный)"
  echo "4. Или используйте внутренний URL из метрик"
  exit 1
fi

HEALTH_CHECK_URL="${WORKER_URL%/}/health"

echo "🔍 Проверка health check Worker..."
echo "📍 URL: $HEALTH_CHECK_URL"
echo ""

# Проверяем health check
response=$(curl -s -w "\n%{http_code}" "$HEALTH_CHECK_URL" || echo -e "\n000")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
  echo "✅ Health check успешен!"
  echo ""
  echo "📊 Ответ сервера:"
  echo "$body" | jq '.' 2>/dev/null || echo "$body"
  echo ""
  
  # Извлекаем информацию из ответа
  status=$(echo "$body" | jq -r '.status' 2>/dev/null || echo "unknown")
  service=$(echo "$body" | jq -r '.service' 2>/dev/null || echo "unknown")
  uptime=$(echo "$body" | jq -r '.uptime' 2>/dev/null || echo "unknown")
  
  echo "📈 Статус: $status"
  echo "🔧 Сервис: $service"
  echo "⏱️  Uptime: ${uptime}s"
  
  exit 0
elif [ "$http_code" = "000" ]; then
  echo "❌ Ошибка: Не удалось подключиться к Worker"
  echo "Возможные причины:"
  echo "  - Worker не запущен или падает"
  echo "  - Неправильный URL"
  echo "  - Firewall блокирует соединение"
  exit 1
else
  echo "❌ Health check провален (HTTP $http_code)"
  echo ""
  echo "📊 Ответ сервера:"
  echo "$body"
  exit 1
fi



