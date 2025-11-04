#!/bin/bash

# Простой тест создания бэкапа (без восстановления)
# Использование: SUPABASE_SERVICE_ROLE_KEY=key ./scripts/test-backup-simple.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="$PROJECT_DIR/backups"

echo "🧪 Тестирование создания бэкапа"
echo "================================"
echo ""

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${YELLOW}⚠️  SUPABASE_SERVICE_ROLE_KEY не установлен${NC}"
  echo ""
  echo "Для тестирования установите переменную:"
  echo "  export SUPABASE_SERVICE_ROLE_KEY=your-key"
  echo "  ./scripts/test-backup-simple.sh"
  echo ""
  echo "Или используйте интерактивный скрипт:"
  echo "  ./scripts/backup-database.sh"
  exit 0
fi

# Проверить наличие pg_dump или supabase CLI
if command -v pg_dump &> /dev/null; then
  echo -e "${GREEN}✅ pg_dump найден${NC}"
  TOOL="pg_dump"
elif command -v supabase &> /dev/null; then
  echo -e "${GREEN}✅ Supabase CLI найден${NC}"
  TOOL="supabase"
else
  echo -e "${RED}❌ Не найден pg_dump или supabase CLI${NC}"
  echo ""
  echo "Установите один из инструментов:"
  echo "  - PostgreSQL: brew install postgresql (для pg_dump)"
  echo "  - Supabase CLI: npm install -g supabase"
  exit 1
fi

mkdir -p "$BACKUP_DIR"

echo "Создание тестового бэкапа..."
echo ""

if [ "$TOOL" = "pg_dump" ]; then
  PROJECT_REF="rpzchsgutabxeabbnwas"
  DB_HOST="db.${PROJECT_REF}.supabase.co"
  DB_PORT="5432"
  DB_NAME="postgres"
  DATE=$(date +%Y%m%d_%H%M%S)
  BACKUP_FILE="${BACKUP_DIR}/test_backup_${DATE}.sql"
  
  if PGPASSWORD="$SUPABASE_SERVICE_ROLE_KEY" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U postgres \
    -d "$DB_NAME" \
    --no-owner \
    --no-acl \
    -f "$BACKUP_FILE" 2>&1; then
    echo -e "${GREEN}✅ Бэкап создан успешно${NC}"
    echo "Файл: $BACKUP_FILE"
    ls -lh "$BACKUP_FILE"
    exit 0
  else
    echo -e "${RED}❌ Ошибка при создании бэкапа${NC}"
    exit 1
  fi
else
  echo -e "${YELLOW}⚠️  Тест через Supabase CLI требует дополнительной настройки${NC}"
  echo "Используйте pg_dump для тестирования"
  exit 1
fi

