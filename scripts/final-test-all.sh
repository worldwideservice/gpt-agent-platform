#!/bin/bash

# Финальный тест всех настроек
# Использование: ./scripts/final-test-all.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🧪 ФИНАЛЬНОЕ ТЕСТИРОВАНИЕ ВСЕХ НАСТРОЕК"
echo "========================================"
echo ""

# Счетчики
TOTAL=0
PASSED=0
FAILED=0

test_check() {
  local name="$1"
  local command="$2"
  
  TOTAL=$((TOTAL + 1))
  echo -n "Тест: $name ... "
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED${NC}"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}❌ FAILED${NC}"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

echo "📋 1. Тест доступности сервисов"
echo "-------------------------------"
test_check "Frontend Health" "curl -f -s https://gpt-agent-kwid.vercel.app/api/health"
test_check "Worker Health" "curl -f -s https://gpt-agent-platform-production.up.railway.app/health"
echo ""

echo "📋 2. Тест GitHub Secrets"
echo "------------------------"
if command -v gh &> /dev/null && gh auth status &> /dev/null; then
  for secret in VERCEL_TOKEN VERCEL_ORG_ID VERCEL_PROJECT_ID RAILWAY_WORKER_URL VERCEL_PROJECT_URL; do
    TOTAL=$((TOTAL + 1))
    if gh secret list 2>/dev/null | grep -q "^$secret"; then
      echo -e "Тест: $secret ... ${GREEN}✅ PASSED${NC}"
      PASSED=$((PASSED + 1))
    else
      echo -e "Тест: $secret ... ${YELLOW}⚠️  WARNING${NC}"
      FAILED=$((FAILED + 1))
    fi
  done
else
  echo -e "${YELLOW}⚠️  GitHub CLI не доступен${NC}"
fi
echo ""

echo "📋 3. Тест Cron задач"
echo "-------------------"
if crontab -l 2>/dev/null | grep -q "backup-database-cron.sh"; then
  echo -e "Тест: Cron задача для бэкапов ... ${GREEN}✅ PASSED${NC}"
  PASSED=$((PASSED + 1))
  TOTAL=$((TOTAL + 1))
else
  echo -e "Тест: Cron задача для бэкапов ... ${YELLOW}⚠️  WARNING (не настроено)${NC}"
  FAILED=$((FAILED + 1))
  TOTAL=$((TOTAL + 1))
fi
echo ""

echo "📋 4. Тест файлов и директорий"
echo "------------------------------"
test_check "Директория backups" "[ -d \"$(pwd)/backups\" ]"
test_check "Директория logs" "[ -d \"$(pwd)/logs\" ]"
test_check "Скрипт проверки" "[ -f \"$(pwd)/scripts/check-all-setup.sh\" ]"
test_check "Скрипт настройки" "[ -f \"$(pwd)/scripts/setup-everything.sh\" ]"
echo ""

echo "📊 ИТОГОВАЯ СТАТИСТИКА"
echo "======================"
echo ""
echo -e "Всего тестов: ${BLUE}$TOTAL${NC}"
echo -e "Успешно: ${GREEN}$PASSED${NC}"
echo -e "Ошибки/Предупреждения: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Некоторые тесты не пройдены (см. выше)${NC}"
  exit 0
fi

