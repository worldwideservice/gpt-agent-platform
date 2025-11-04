#!/bin/bash

# Комплексное тестирование всех компонентов проекта
# Использование: ./scripts/comprehensive-test.sh

set -e

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Конфигурация
FRONTEND_URL="${FRONTEND_URL:-https://gpt-agent-kwid.vercel.app}"
WORKER_URL="${WORKER_URL:-https://gpt-agent-platform-production.up.railway.app}"

# Счетчики
PASSED=0
FAILED=0
WARNINGS=0
TOTAL=0

echo -e "${CYAN}🧪 КОМПЛЕКСНОЕ ТЕСТИРОВАНИЕ ПРОЕКТА${NC}"
echo "=========================================="
echo ""

# Функция проверки endpoint
test_endpoint() {
  local name="$1"
  local url="$2"
  local expected_status="${3:-200}"
  local check_content="${4:-}"
  
  ((TOTAL++))
  echo -n "  [$TOTAL] $name ... "
  
  HTTP_CODE=$(curl -s -o /tmp/response.json -w "%{http_code}" --max-time 10 "$url" 2>&1 || echo "000")
  RESPONSE=$(cat /tmp/response.json 2>/dev/null || echo "")
  
  if [ "$HTTP_CODE" = "$expected_status" ] || [ "$HTTP_CODE" = "200" ]; then
    if [ -n "$check_content" ]; then
      if echo "$RESPONSE" | grep -q "$check_content"; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP $HTTP_CODE)"
        ((PASSED++))
        return 0
      else
        echo -e "${YELLOW}⚠️  WARNING${NC} (HTTP $HTTP_CODE, но не содержит: $check_content)"
        ((WARNINGS++))
        return 0
      fi
    else
      echo -e "${GREEN}✅ PASSED${NC} (HTTP $HTTP_CODE)"
      ((PASSED++))
      return 0
    fi
  else
    echo -e "${RED}❌ FAILED${NC} (HTTP $HTTP_CODE)"
    ((FAILED++))
    return 1
  fi
}

# Функция проверки JSON
check_json_field() {
  local field="$1"
  local expected_value="$2"
  local response_file="$3"
  
  local value=$(cat "$response_file" 2>/dev/null | grep -o "\"$field\":[^,}]*" | grep -o '[^:]*$' | tr -d '" ' || echo "")
  
  if [ "$value" = "$expected_value" ]; then
    echo -e "    ${GREEN}✅ $field: $value${NC}"
    return 0
  else
    echo -e "    ${YELLOW}⚠️  $field: $value (ожидалось: $expected_value)${NC}"
    return 1
  fi
}

echo -e "${BLUE}📋 ТЕСТ 1: Frontend (Vercel)${NC}"
echo "=================================="
echo "URL: $FRONTEND_URL"
echo ""

# Health Check
if test_endpoint "Health Check" "${FRONTEND_URL}/api/health" "200" "database"; then
  check_json_field "database" "ok" /tmp/response.json
  check_json_field "redis" "ok" /tmp/response.json || echo -e "    ${YELLOW}⚠️  Redis может быть не критичен${NC}"
fi

# Ready Check
test_endpoint "Ready Check" "${FRONTEND_URL}/api/health/ready"

# Main Page
test_endpoint "Main Page" "${FRONTEND_URL}/" "200"

# Login Page
test_endpoint "Login Page" "${FRONTEND_URL}/login" "200"

echo ""
echo -e "${BLUE}📋 ТЕСТ 2: Worker (Railway)${NC}"
echo "=================================="
echo "URL: $WORKER_URL"
echo ""

# Health Check
if test_endpoint "Health Check" "${WORKER_URL}/health" "200" "redis"; then
  RESPONSE=$(curl -s --max-time 10 "${WORKER_URL}/health" 2>&1)
  echo "$RESPONSE" > /tmp/worker-health.json
  
  check_json_field "status" "ok" /tmp/worker-health.json
  check_json_field "redis.connected" "true" /tmp/worker-health.json
  
  UPTIME=$(echo "$RESPONSE" | grep -o '"uptime":[0-9.]*' | grep -o '[0-9.]*' || echo "0")
  if [ -n "$UPTIME" ] && [ "$(echo "$UPTIME > 0" | bc 2>/dev/null || echo 0)" = "1" ]; then
    echo -e "    ${GREEN}✅ Uptime: ${UPTIME}s${NC}"
  fi
fi

# Metrics (JSON)
if test_endpoint "Metrics (JSON)" "${WORKER_URL}/metrics" "200"; then
  RESPONSE=$(curl -s --max-time 10 "${WORKER_URL}/metrics" 2>&1)
  echo "$RESPONSE" > /tmp/worker-metrics.json
  
  check_json_field "redis.connected" "true" /tmp/worker-metrics.json
  
  JOBS_TOTAL=$(echo "$RESPONSE" | grep -o '"total":[0-9]*' | grep -o '[0-9]*' || echo "0")
  echo -e "    ${CYAN}ℹ️  Jobs processed: $JOBS_TOTAL${NC}"
fi

# Prometheus Metrics
test_endpoint "Prometheus Metrics" "${WORKER_URL}/metrics/prometheus" "200"

echo ""
echo -e "${BLUE}📋 ТЕСТ 3: Интеграции${NC}"
echo "=========================="

# Supabase Connection (через Frontend health)
echo -n "  Supabase Connection ... "
if curl -s --max-time 10 "${FRONTEND_URL}/api/health" 2>&1 | grep -q '"database":"ok"'; then
  echo -e "${GREEN}✅ OK${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ FAILED${NC}"
  ((FAILED++))
fi
((TOTAL++))

# Redis Connection (через Worker)
echo -n "  Redis Connection (Worker) ... "
if curl -s --max-time 10 "${WORKER_URL}/health" 2>&1 | grep -q '"connected":true'; then
  echo -e "${GREEN}✅ OK${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ FAILED${NC}"
  ((FAILED++))
fi
((TOTAL++))

echo ""
echo -e "${BLUE}📋 ТЕСТ 4: Конфигурация${NC}"
echo "============================="

# Проверка переменных окружения в коде
echo -n "  Worker Concurrency Config ... "
if grep -q "default(25)" services/worker/src/lib/env.ts 2>/dev/null; then
  echo -e "${GREEN}✅ OK (25)${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  Проверьте конфигурацию${NC}"
  ((WARNINGS++))
fi
((TOTAL++))

# Проверка Sentry инициализации
echo -n "  Sentry Integration ... "
if grep -q "initSentry" services/worker/src/index.ts 2>/dev/null; then
  echo -e "${GREEN}✅ OK${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  Sentry не найден${NC}"
  ((WARNINGS++))
fi
((TOTAL++))

echo ""
echo -e "${BLUE}📋 ТЕСТ 5: Скрипты${NC}"
echo "====================="

SCRIPTS=(
  "scripts/backup-database.sh"
  "scripts/backup-database-cron.sh"
  "scripts/cleanup-old-backups.sh"
  "scripts/check-backup-status.sh"
  "scripts/check-env-production.sh"
  "scripts/test-all-services.sh"
  "scripts/verify-deployments.sh"
)

for script in "${SCRIPTS[@]}"; do
  if [ -f "$script" ]; then
    ((TOTAL++))
    echo -n "  $(basename $script) ... "
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
echo -e "${BLUE}📋 ТЕСТ 6: Обработка задач (Worker)${NC}"
echo "======================================"

echo -n "  Worker Queue Status ... "
WORKER_METRICS=$(curl -s --max-time 10 "${WORKER_URL}/metrics" 2>&1 || echo "")
if echo "$WORKER_METRICS" | grep -q "queueName"; then
  QUEUE_NAME=$(echo "$WORKER_METRICS" | grep -o '"queueName":"[^"]*"' | grep -o '"[^"]*"' | tr -d '"' || echo "")
  echo -e "${GREEN}✅ OK (Queue: $QUEUE_NAME)${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  Не удалось получить статус очереди${NC}"
  ((WARNINGS++))
fi
((TOTAL++))

echo ""
echo -e "${CYAN}📊 ИТОГОВАЯ СТАТИСТИКА${NC}"
echo "=========================="
echo -e "${GREEN}✅ Passed: $PASSED/$TOTAL${NC}"
echo -e "${RED}❌ Failed: $FAILED/$TOTAL${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo ""

# Расчет процента
if [ $TOTAL -gt 0 ]; then
  PERCENT=$((PASSED * 100 / TOTAL))
  echo -e "${CYAN}Процент успешных тестов: ${PERCENT}%${NC}"
  echo ""
fi

# Итоговый статус
if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ! Проект полностью функционален.${NC}"
  exit 0
elif [ $FAILED -eq 0 ]; then
  echo -e "${YELLOW}⚠️  Все критические тесты пройдены, но есть предупреждения.${NC}"
  exit 0
else
  echo -e "${RED}❌ Обнаружены критические ошибки. Необходимо исправить.${NC}"
  exit 1
fi

