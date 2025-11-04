#!/bin/bash

# Комплексная настройка всего проекта
# Использование: ./scripts/setup-everything.sh

set -e

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Комплексная настройка проекта"
echo "================================="
echo ""

# Шаг 1: Создать необходимые директории
echo "📁 Создание директорий..."
mkdir -p "$PROJECT_DIR/backups"
mkdir -p "$PROJECT_DIR/logs"
echo -e "${GREEN}✅ Директории созданы${NC}"
echo ""

# Шаг 2: Настройка бэкапов
echo "💾 Настройка автоматических бэкапов..."
echo ""

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${YELLOW}⚠️  SUPABASE_SERVICE_ROLE_KEY не установлен${NC}"
  echo ""
  echo "Выберите вариант:"
  echo "1. Ввести SUPABASE_SERVICE_ROLE_KEY сейчас"
  echo "2. Пропустить настройку бэкапов (можно настроить позже)"
  echo ""
  read -p "Ваш выбор (1-2): " choice
  
  case $choice in
    1)
      read -sp "Введите SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
      echo ""
      export SUPABASE_SERVICE_ROLE_KEY
      
      # Настроить cron
      echo "Настройка cron..."
      "$PROJECT_DIR/scripts/setup-backup-cron-auto.sh"
      ;;
    2)
      echo -e "${YELLOW}⏭️  Пропущена настройка бэкапов${NC}"
      echo "Для настройки позже выполните: ./scripts/setup-backup-cron.sh"
      ;;
    *)
      echo -e "${YELLOW}⏭️  Пропущена настройка бэкапов${NC}"
      ;;
  esac
else
  echo -e "${GREEN}✅ SUPABASE_SERVICE_ROLE_KEY найден${NC}"
  echo "Настройка cron..."
  "$PROJECT_DIR/scripts/setup-backup-cron-auto.sh"
fi
echo ""

# Шаг 3: Проверка GitHub Secrets
echo "🔐 Проверка GitHub Secrets..."
echo ""

if command -v gh &> /dev/null && gh auth status &> /dev/null; then
  echo -e "${GREEN}✅ GitHub CLI доступен${NC}"
  
  REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "")
  if [ -n "$REPO" ]; then
    echo "Репозиторий: $REPO"
    echo ""
    echo "Проверка секретов:"
    
    MISSING_SECRETS=()
    for secret in VERCEL_TOKEN VERCEL_ORG_ID VERCEL_PROJECT_ID RAILWAY_TOKEN; do
      if ! gh secret list 2>/dev/null | grep -q "^$secret"; then
        MISSING_SECRETS+=("$secret")
        echo -e "  $secret ... ${YELLOW}⚠️  НЕ НАСТРОЕН${NC}"
      else
        echo -e "  $secret ... ${GREEN}✅ НАСТРОЕН${NC}"
      fi
    done
    
    if [ ${#MISSING_SECRETS[@]} -gt 0 ]; then
      echo ""
      echo -e "${YELLOW}⚠️  Найдены отсутствующие секреты:${NC}"
      for secret in "${MISSING_SECRETS[@]}"; do
        echo "  - $secret"
      done
      echo ""
      echo "Для настройки выполните:"
      echo "  gh secret set SECRET_NAME"
      echo ""
      echo "Или через GitHub Dashboard:"
      echo "  Settings → Secrets and variables → Actions"
    fi
  fi
else
  echo -e "${YELLOW}⚠️  GitHub CLI не установлен или не авторизован${NC}"
  echo "Для настройки секретов используйте GitHub Dashboard:"
  echo "  Settings → Secrets and variables → Actions"
fi
echo ""

# Шаг 4: Создание тестового бэкапа
echo "🧪 Тестирование бэкапов..."
echo ""

if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Создание тестового бэкапа..."
  if "$PROJECT_DIR/scripts/backup-database.sh" --test; then
    echo -e "${GREEN}✅ Тестовый бэкап создан успешно${NC}"
  else
    echo -e "${YELLOW}⚠️  Не удалось создать тестовый бэкап${NC}"
  fi
else
  echo -e "${YELLOW}⏭️  Пропущено (требуется SUPABASE_SERVICE_ROLE_KEY)${NC}"
fi
echo ""

# Шаг 5: Итоговый отчет
echo "📊 ИТОГОВЫЙ ОТЧЕТ"
echo "=================="
echo ""
echo "Выполнено:"
echo "  ✅ Созданы необходимые директории"
if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "  ✅ Настроены автоматические бэкапы"
else
  echo "  ⏭️  Пропущена настройка бэкапов"
fi
echo "  ✅ Проверены GitHub Secrets"
echo ""
echo "Следующие шаги:"
echo "  1. Настроить отсутствующие GitHub Secrets (если нужно)"
echo "  2. Настроить Sentry алерты через браузер"
echo "  3. Проверить переменные окружения в Vercel и Railway"
echo ""
echo "Для проверки всех настроек выполните:"
echo "  ./scripts/check-all-setup.sh"
echo ""

