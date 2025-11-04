#!/bin/bash

# Комплексная проверка всех настроек проекта
# Использование: ./scripts/check-all-setup.sh

set -e

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔍 Комплексная проверка настроек проекта"
echo "========================================"
echo ""

# Счетчики
TOTAL=0
PASSED=0
FAILED=0
WARNING=0

# Функция проверки
check() {
  local name="$1"
  local command="$2"
  local required="${3:-false}"
  
  TOTAL=$((TOTAL + 1))
  echo -n "Проверка: $name ... "
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED${NC}"
    PASSED=$((PASSED + 1))
    return 0
  else
    if [ "$required" = "true" ]; then
      echo -e "${RED}❌ FAILED (критично)${NC}"
      FAILED=$((FAILED + 1))
      return 1
    else
      echo -e "${YELLOW}⚠️  WARNING (не критично)${NC}"
      WARNING=$((WARNING + 1))
      return 0
    fi
  fi
}

# Функция проверки файла
check_file() {
  local name="$1"
  local file="$2"
  local required="${3:-false}"
  
  TOTAL=$((TOTAL + 1))
  echo -n "Проверка: $name ... "
  
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ PASSED${NC}"
    PASSED=$((PASSED + 1))
    return 0
  else
    if [ "$required" = "true" ]; then
      echo -e "${RED}❌ FAILED (критично)${NC}"
      FAILED=$((FAILED + 1))
      return 1
    else
      echo -e "${YELLOW}⚠️  WARNING (не критично)${NC}"
      WARNING=$((WARNING + 1))
      return 0
    fi
  fi
}

# Функция проверки переменной окружения
check_env() {
  local name="$1"
  local var="$2"
  local required="${3:-false}"
  
  TOTAL=$((TOTAL + 1))
  echo -n "Проверка: $name ... "
  
  if [ -n "${!var}" ]; then
    echo -e "${GREEN}✅ PASSED${NC}"
    PASSED=$((PASSED + 1))
    return 0
  else
    if [ "$required" = "true" ]; then
      echo -e "${RED}❌ FAILED (критично)${NC}"
      FAILED=$((FAILED + 1))
      return 1
    else
      echo -e "${YELLOW}⚠️  WARNING (не критично)${NC}"
      WARNING=$((WARNING + 1))
      return 0
    fi
  fi
}

echo "📋 1. Проверка файлов и скриптов"
echo "--------------------------------"
check_file "Скрипт бэкапа" "$PROJECT_DIR/scripts/backup-database-cron.sh" true
check_file "Скрипт настройки cron" "$PROJECT_DIR/scripts/setup-backup-cron.sh" true
check_file "CI Pipeline" "$PROJECT_DIR/.github/workflows/ci.yml" true
check_file "CD Pipeline" "$PROJECT_DIR/.github/workflows/cd.yml" true
echo ""

echo "📋 2. Проверка Cron задач"
echo "-----------------------"
if crontab -l 2>/dev/null | grep -q "backup-database-cron.sh"; then
  echo -e "Проверка: Cron задача для бэкапов ... ${GREEN}✅ PASSED${NC}"
  PASSED=$((PASSED + 1))
  TOTAL=$((TOTAL + 1))
  crontab -l 2>/dev/null | grep "backup-database-cron.sh" | head -1
else
  echo -e "Проверка: Cron задача для бэкапов ... ${YELLOW}⚠️  WARNING (не настроено)${NC}"
  WARNING=$((WARNING + 1))
  TOTAL=$((TOTAL + 1))
fi
echo ""

echo "📋 3. Проверка переменных окружения (локально)"
echo "-----------------------------------------------"
check_env "SUPABASE_URL" "SUPABASE_URL" false
check_env "SUPABASE_SERVICE_ROLE_KEY" "SUPABASE_SERVICE_ROLE_KEY" false
check_env "REDIS_URL" "REDIS_URL" false
check_env "OPENROUTER_API_KEY" "OPENROUTER_API_KEY" false
echo ""

echo "📋 4. Проверка директорий"
echo "------------------------"
check "Директория backups" "[ -d \"$PROJECT_DIR/backups\" ]" false
check "Директория logs" "[ -d \"$PROJECT_DIR/logs\" ]" false
echo ""

echo "📋 5. Проверка GitHub Secrets (требует GitHub CLI)"
echo "-------------------------------------------------"
if command -v gh &> /dev/null; then
  if gh auth status &> /dev/null; then
    echo "Проверка: GitHub CLI авторизован ... ${GREEN}✅ PASSED${NC}"
    PASSED=$((PASSED + 1))
    TOTAL=$((TOTAL + 1))
    
    # Проверка секретов
    REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
    if [ -n "$REPO" ]; then
      echo "Репозиторий: $REPO"
      echo ""
      echo "Проверка секретов GitHub Actions:"
      
      for secret in VERCEL_TOKEN VERCEL_ORG_ID VERCEL_PROJECT_ID RAILWAY_TOKEN RAILWAY_WORKER_URL VERCEL_PROJECT_URL; do
        TOTAL=$((TOTAL + 1))
        if gh secret list 2>/dev/null | grep -q "^$secret"; then
          echo -e "  $secret ... ${GREEN}✅ PASSED${NC}"
          PASSED=$((PASSED + 1))
        else
          echo -e "  $secret ... ${YELLOW}⚠️  WARNING (не настроен)${NC}"
          WARNING=$((WARNING + 1))
        fi
      done
    fi
  else
    echo "Проверка: GitHub CLI авторизован ... ${YELLOW}⚠️  WARNING (не авторизован)${NC}"
    WARNING=$((WARNING + 1))
    TOTAL=$((TOTAL + 1))
  fi
else
  echo "Проверка: GitHub CLI установлен ... ${YELLOW}⚠️  WARNING (не установлен)${NC}"
  WARNING=$((WARNING + 1))
  TOTAL=$((TOTAL + 1))
fi
echo ""

echo "📋 6. Проверка доступности сервисов"
echo "-----------------------------------"
check "Health Check Frontend" "curl -f -s https://gpt-agent-kwid.vercel.app/api/health > /dev/null" false
check "Health Check Worker" "curl -f -s https://gpt-agent-platform-production.up.railway.app/health > /dev/null" false
echo ""

echo "📊 ИТОГОВАЯ СТАТИСТИКА"
echo "===================="
echo ""
echo -e "Всего проверок: ${BLUE}$TOTAL${NC}"
echo -e "Успешно: ${GREEN}$PASSED${NC}"
echo -e "Предупреждения: ${YELLOW}$WARNING${NC}"
echo -e "Ошибки: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ Все критические проверки пройдены!${NC}"
  exit 0
else
  echo -e "${RED}❌ Найдены критические проблемы!${NC}"
  exit 1
fi

