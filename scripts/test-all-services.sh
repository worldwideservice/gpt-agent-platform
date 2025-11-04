#!/bin/bash

# Полное тестирование всех сервисов и компонентов
# Использование: ./scripts/test-all-services.sh

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Конфигурация
FRONTEND_URL="${FRONTEND_URL:-https://gpt-agent-kwid.vercel.app}"
WORKER_URL="${WORKER_URL:-https://gpt-agent-platform-production.up.railway.app}"

# Счетчики
PASSED=0
FAILED=0
WARNINGS=0

echo "🧪 ПОЛНОЕ ТЕСТИРОВАНИЕ ВСЕХ СЕРВИСОВ"
echo "====================================="
echo ""

# Функция для проверки
test_endpoint() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"
  
  echo -n "  Тест: $name ... "
  
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>&1 || echo "000")
  
  if [ "$HTTP_CODE" = "$expected_status" ] || [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PASSED${NC} (HTTP $HTTP_CODE)"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}❌ FAILED${NC} (HTTP $HTTP_CODE)"
    ((FAILED++))
    return 1
  fi
}

# Функция для предупреждения
warn() {
  local message="$1"
  echo -e "${YELLOW}⚠️  WARNING: $message${NC}"
  ((WARNINGS++))
}

echo "📋 ТЕСТ 1: Frontend (Vercel)"
echo "----------------------------"

# Health Check
if test_endpoint "Frontend Health Check" "${FRONTEND_URL}/api/health"; then
  HEALTH_RESPONSE=$(curl -s --max-time 10 "${FRONTEND_URL}/api/health" 2>&1)
  
  if echo "$HEALTH_RESPONSE" | grep -q '"database":"ok"'; then
    echo "    ✅ Database: OK"
  else
    warn "Frontend Database connection issue"
  fi
  
  if echo "$HEALTH_RESPONSE" | grep -q '"redis":"ok"'; then
    echo "    ✅ Redis: OK"
  else
    warn "Frontend Redis connection issue"
  fi
  
  if echo "$HEALTH_RESPONSE" | grep -q '"openrouter":"ok"'; then
    echo "    ✅ OpenRouter: OK"
  else
    warn "Frontend OpenRouter connection issue"
  fi
fi

# Ready Check
test_endpoint "Frontend Ready Check" "${FRONTEND_URL}/api/health/ready"

echo ""
echo "📋 ТЕСТ 2: Worker (Railway)"
echo "----------------------------"

# Health Check
if test_endpoint "Worker Health Check" "${WORKER_URL}/health"; then
  WORKER_HEALTH=$(curl -s --max-time 10 "${WORKER_URL}/health" 2>&1)
  
  if echo "$WORKER_HEALTH" | grep -q '"connected":true'; then
    echo "    ✅ Worker Redis: Connected"
  else
    warn "Worker Redis not connected"
  fi
  
  CONCURRENCY=$(echo "$WORKER_HEALTH" | grep -o '"concurrency":[0-9]*' | grep -o '[0-9]*' || echo "0")
  if [ "$CONCURRENCY" -ge 20 ]; then
    echo "    ✅ Worker Concurrency: $CONCURRENCY (OK)"
  else
    warn "Worker Concurrency is $CONCURRENCY, should be >= 20"
  fi
fi

# Metrics
test_endpoint "Worker Metrics (JSON)" "${WORKER_URL}/metrics"

# Prometheus Metrics
test_endpoint "Worker Prometheus Metrics" "${WORKER_URL}/metrics/prometheus"

echo ""
echo "📋 ТЕСТ 3: Скрипты"
echo "-----------------"

for script in scripts/backup-database.sh scripts/backup-database-cron.sh scripts/cleanup-old-backups.sh scripts/check-backup-status.sh scripts/check-env-production.sh; do
  if [ -f "$script" ]; then
    echo -n "  Проверка: $(basename $script) ... "
    if bash -n "$script" 2>/dev/null; then
      echo -e "${GREEN}✅ OK${NC}"
      ((PASSED++))
    else
      echo -e "${RED}❌ FAILED${NC}"
      ((FAILED++))
    fi
  fi
done

echo ""
echo "📋 ТЕСТ 4: Конфигурация"
echo "----------------------"

# Railway config
if [ -f "services/worker/railway.json" ]; then
  echo -n "  Railway Config ... "
  if grep -q '"numReplicas"' services/worker/railway.json; then
    echo -e "${GREEN}✅ OK${NC}"
    ((PASSED++))
  else
    warn "Railway config missing numReplicas"
  fi
fi

# Worker concurrency
if [ -f "services/worker/src/lib/env.ts" ]; then
  echo -n "  Worker Concurrency Config ... "
  if grep -q "default(25)" services/worker/src/lib/env.ts; then
    echo -e "${GREEN}✅ OK${NC}"
    ((PASSED++))
  else
    warn "Worker concurrency not set to 25"
  fi
fi

echo ""
echo "📊 ИТОГОВАЯ СТАТИСТИКА"
echo "====================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo ""

# Итоговый статус
if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ! Все сервисы работают корректно.${NC}"
  exit 0
elif [ $FAILED -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Все критические тесты пройдены, но есть предупреждения.${NC}"
  exit 0
else
  echo -e "${RED}❌ Обнаружены критические ошибки. Необходимо исправить.${NC}"
  exit 1
fi

