#!/bin/bash

# Скрипт для проверки готовности всех компонентов к production
# Использование: ./scripts/check-production-readiness.sh

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

echo "🔍 ПРОВЕРКА ГОТОВНОСТИ К PRODUCTION"
echo "===================================="
echo ""

# Счетчики
PASSED=0
FAILED=0
WARNINGS=0

# Функция для проверки
check() {
  local name="$1"
  local command="$2"
  local expected="$3"
  
  echo -n "Проверка: $name ... "
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}❌ FAILED${NC}"
    ((FAILED++))
    return 1
  fi
}

# Функция для предупреждения
warn() {
  local name="$1"
  local message="$2"
  
  echo -e "${YELLOW}⚠️  WARNING: $name - $message${NC}"
  ((WARNINGS++))
}

# Функция для информации
info() {
  local name="$1"
  local message="$2"
  
  echo -e "${BLUE}ℹ️  INFO: $name - $message${NC}"
}

echo "📋 Проверка Frontend (Vercel)"
echo "----------------------------"

# Проверка Frontend Health Check
if check "Frontend Health Check" "curl -sf ${FRONTEND_URL}/api/health" "200"; then
  HEALTH_RESPONSE=$(curl -s "${FRONTEND_URL}/api/health")
  
  # Проверка статуса сервисов
  if echo "$HEALTH_RESPONSE" | grep -q '"database":"ok"'; then
    echo "  ✅ Database: OK"
  else
    warn "Frontend Database" "Database connection issue"
  fi
  
  if echo "$HEALTH_RESPONSE" | grep -q '"redis":"ok"'; then
    echo "  ✅ Redis: OK"
  else
    warn "Frontend Redis" "Redis connection issue"
  fi
  
  if echo "$HEALTH_RESPONSE" | grep -q '"openrouter":"ok"'; then
    echo "  ✅ OpenRouter: OK"
  else
    warn "Frontend OpenRouter" "OpenRouter connection issue"
  fi
else
  warn "Frontend Health Check" "Cannot reach frontend health endpoint"
fi

# Проверка Frontend Ready Check
check "Frontend Ready Check" "curl -sf ${FRONTEND_URL}/api/health/ready" "200"

echo ""
echo "📋 Проверка Worker (Railway)"
echo "----------------------------"

# Проверка Worker Health Check
if check "Worker Health Check" "curl -sf ${WORKER_URL}/health" "200"; then
  WORKER_HEALTH=$(curl -s "${WORKER_URL}/health")
  
  # Проверка Redis подключения
  if echo "$WORKER_HEALTH" | grep -q '"connected":true'; then
    echo "  ✅ Worker Redis: Connected"
  else
    warn "Worker Redis" "Redis not connected"
  fi
  
  # Проверка concurrency
  CONCURRENCY=$(echo "$WORKER_HEALTH" | grep -o '"concurrency":[0-9]*' | grep -o '[0-9]*' || echo "0")
  if [ "$CONCURRENCY" -ge 20 ]; then
    echo "  ✅ Worker Concurrency: $CONCURRENCY (OK)"
  else
    warn "Worker Concurrency" "Concurrency is $CONCURRENCY, should be >= 20"
  fi
else
  warn "Worker Health Check" "Cannot reach worker health endpoint"
fi

# Проверка Worker Metrics
check "Worker Metrics (JSON)" "curl -sf ${WORKER_URL}/metrics" "200"

# Проверка Worker Prometheus Metrics
check "Worker Prometheus Metrics" "curl -sf ${WORKER_URL}/metrics/prometheus" "200"

echo ""
echo "📋 Проверка конфигурации"
echo "----------------------"

# Проверка Railway конфигурации
if [ -f "services/worker/railway.json" ]; then
  REPLICAS=$(grep -o '"numReplicas":[0-9]*' services/worker/railway.json | grep -o '[0-9]*' || echo "0")
  if [ "$REPLICAS" -ge 2 ]; then
    echo "  ✅ Railway Replicas: $REPLICAS (OK)"
  else
    warn "Railway Replicas" "Replicas is $REPLICAS, should be >= 2"
  fi
else
  warn "Railway Config" "railway.json not found"
fi

# Проверка Worker concurrency в env.ts
if [ -f "services/worker/src/lib/env.ts" ]; then
  ENV_CONCURRENCY=$(grep -o 'default(25)' services/worker/src/lib/env.ts | grep -o '25' || echo "0")
  if [ "$ENV_CONCURRENCY" -eq 25 ]; then
    echo "  ✅ Worker Concurrency Config: 25 (OK)"
  else
    warn "Worker Concurrency Config" "Concurrency in env.ts is not 25"
  fi
else
  warn "Worker Env Config" "env.ts not found"
fi

echo ""
echo "📋 Проверка мониторинга"
echo "---------------------"

# Проверка UptimeRobot (информация)
info "UptimeRobot" "Проверьте вручную: https://dashboard.uptimerobot.com/monitors"

# Проверка Sentry (информация)
info "Sentry" "Проверьте вручную: https://world-wide-services.sentry.io/issues/alerts/rules/"

echo ""
echo "📋 Проверка переменных окружения"
echo "-------------------------------"

# Проверка наличия файлов с переменными окружения
if [ -f "env.production.example" ]; then
  echo "  ✅ env.production.example найден"
  info "Environment Variables" "Проверьте вручную переменные в Vercel и Railway"
else
  warn "Environment Variables Template" "env.production.example not found"
fi

echo ""
echo "📋 Итоговая статистика"
echo "====================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo ""

# Итоговый статус
if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ Все проверки пройдены! Проект готов к production.${NC}"
  exit 0
elif [ $FAILED -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Проект готов к production, но есть предупреждения. Рекомендуется их исправить.${NC}"
  exit 0
else
  echo -e "${RED}❌ Обнаружены критические ошибки. Необходимо исправить перед запуском в production.${NC}"
  exit 1
fi

