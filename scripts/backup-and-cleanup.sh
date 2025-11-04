#!/bin/bash

# Скрипт для создания бэкапа и очистки старых бэкапов
# Использование: ./scripts/backup-and-cleanup.sh [DAYS_TO_KEEP]
# Пример: ./scripts/backup-and-cleanup.sh 30

set -e

# Конфигурация
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DAYS_TO_KEEP="${1:-30}"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "💾 Создание бэкапа и очистка старых бэкапов"
echo "=========================================="
echo ""

# Проверка переменной окружения
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${RED}❌ Ошибка: SUPABASE_SERVICE_ROLE_KEY не установлен${NC}"
  echo "Установите переменную окружения:"
  echo "  export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
  echo "  ./scripts/backup-and-cleanup.sh"
  exit 1
fi

# Создать бэкап
echo "📥 Создание бэкапа..."
if "$SCRIPT_DIR/backup-database-cron.sh"; then
  echo -e "${GREEN}✅ Бэкап успешно создан${NC}"
else
  echo -e "${RED}❌ Ошибка при создании бэкапа${NC}"
  exit 1
fi

echo ""

# Очистить старые бэкапы
echo "🧹 Очистка старых бэкапов (старше $DAYS_TO_KEEP дней)..."
if "$SCRIPT_DIR/cleanup-old-backups.sh" "$DAYS_TO_KEEP"; then
  echo -e "${GREEN}✅ Очистка завершена${NC}"
else
  echo -e "${YELLOW}⚠️  Предупреждение при очистке (возможно, нет старых бэкапов)${NC}"
fi

echo ""
echo -e "${GREEN}✅ Все операции завершены успешно${NC}"

