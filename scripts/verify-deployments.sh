#!/bin/bash

# Скрипт для проверки деплоев на Railway и Vercel
# Использование: ./scripts/verify-deployments.sh

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

FRONTEND_URL="${FRONTEND_URL:-https://gpt-agent-kwid.vercel.app}"
WORKER_URL="${WORKER_URL:-https://gpt-agent-platform-production.up.railway.app}"

echo "🔍 ПРОВЕРКА ДЕПЛОЕВ"
echo "=================="
echo ""

# Счетчики
PASSED=0
FAILED=0

# Функция проверки
check() {
  local name="$1"
  local url="$2"
  local expected="${3:-200}"
  
  echo -n "  $name ... "
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>&1 || echo "000")
  
  if [ "$HTTP_CODE" = "$expected" ]; then
    echo -e "${GREEN}✅ OK${NC} (HTTP $HTTP_CODE)"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}❌ FAILED${NC} (HTTP $HTTP_CODE)"
    ((FAILED++))
    return 1
  fi
}

echo "📋 Frontend (Vercel)"
echo "-------------------"
echo "URL: $FRONTEND_URL"
echo ""

check "Health Check" "${FRONTEND_URL}/api/health"
check "Ready Check" "${FRONTEND_URL}/api/health/ready"
check "Main Page" "${FRONTEND_URL}/"

echo ""
echo "📋 Worker (Railway)"
echo "------------------"
echo "URL: $WORKER_URL"
echo ""

check "Health Check" "${WORKER_URL}/health"
check "Metrics (JSON)" "${WORKER_URL}/metrics"
check "Prometheus Metrics" "${WORKER_URL}/metrics/prometheus"

echo ""
echo "📊 ИТОГ"
echo "======"
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ Все деплои работают корректно!${NC}"
  exit 0
else
  echo -e "${RED}❌ Обнаружены проблемы. Проверьте деплои.${NC}"
  exit 1
fi

