#!/bin/bash

# Скрипт для ожидания деплоя и проверки endpoints
# Использование: ./scripts/wait-and-check-deployment.sh [WAIT_MINUTES]

set -e

WAIT_MINUTES="${1:-5}"
WAIT_SECONDS=$((WAIT_MINUTES * 60))

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

FRONTEND_URL="${FRONTEND_URL:-https://gpt-agent-kwid.vercel.app}"
WORKER_URL="${WORKER_URL:-https://gpt-agent-platform-production.up.railway.app}"

echo "⏳ Ожидание деплоя ($WAIT_MINUTES минут)"
echo "======================================="
echo ""

# Функция проверки
check_endpoint() {
  local name="$1"
  local url="$2"
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>&1 || echo "000")
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ $name${NC} (HTTP $HTTP_CODE)"
    return 0
  else
    echo -e "${RED}❌ $name${NC} (HTTP $HTTP_CODE)"
    return 1
  fi
}

echo "Ожидание $WAIT_MINUTES минут для завершения деплоя..."
echo ""

# Ожидание с прогресс-баром
for i in $(seq 1 $WAIT_SECONDS); do
  if [ $((i % 30)) -eq 0 ]; then
    PROGRESS=$((i * 100 / WAIT_SECONDS))
    echo -ne "\r⏳ Прогресс: $PROGRESS% ($(($i / 60))м $(($i % 60))с)"
  fi
  sleep 1
done

echo ""
echo ""
echo "🔍 Проверка endpoints..."
echo ""

# Проверка Frontend
echo "📋 Frontend (Vercel):"
check_endpoint "Health Check" "${FRONTEND_URL}/api/health"
check_endpoint "Ready Check" "${FRONTEND_URL}/api/health/ready"

echo ""
echo "📋 Worker (Railway):"
check_endpoint "Health Check" "${WORKER_URL}/health"
check_endpoint "Metrics (JSON)" "${WORKER_URL}/metrics"
check_endpoint "Prometheus Metrics" "${WORKER_URL}/metrics/prometheus"

echo ""
echo "✅ Проверка завершена!"
echo ""

