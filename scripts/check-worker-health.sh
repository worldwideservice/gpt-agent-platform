#!/bin/bash

# Скрипт для проверки статуса Worker после деплоя

WORKER_URL="https://gpt-agent-platform-production.up.railway.app"

echo "🔍 Проверка Worker Health Check..."
echo ""

# Health Check
echo "📊 Health Check:"
HEALTH=$(curl -s "${WORKER_URL}/health" 2>/dev/null)
echo "$HEALTH" | jq . 2>/dev/null || echo "$HEALTH"
echo ""

# Проверка Redis статуса
REDIS_STATUS=$(echo "$HEALTH" | jq -r '.redis.connected' 2>/dev/null)
if [ "$REDIS_STATUS" = "true" ]; then
  echo "✅ Redis: ПОДКЛЮЧЕН"
elif [ "$REDIS_STATUS" = "false" ]; then
  echo "❌ Redis: НЕ ПОДКЛЮЧЕН"
  ERROR=$(echo "$HEALTH" | jq -r '.redis.error' 2>/dev/null)
  echo "   Ошибка: $ERROR"
else
  echo "⚠️  Redis: Статус неизвестен"
fi
echo ""

# Metrics
echo "📈 Metrics:"
METRICS=$(curl -s "${WORKER_URL}/metrics" 2>/dev/null)
echo "$METRICS" | jq '.redis, .jobs, .worker' 2>/dev/null || echo "$METRICS"
echo ""

# Итог
if [ "$REDIS_STATUS" = "true" ]; then
  echo "✅ Worker работает корректно!"
  exit 0
else
  echo "❌ Worker требует внимания - Redis не подключен"
  exit 1
fi
