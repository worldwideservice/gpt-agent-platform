#!/bin/bash

# Скрипт для тестирования восстановления из бэкапа
# Использование: ./scripts/test-backup-restore.sh [BACKUP_FILE]
# Пример: ./scripts/test-backup-restore.sh backups/supabase_backup_20250126_020000.dump

set -e

# Конфигурация
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
PROJECT_REF="${SUPABASE_PROJECT_REF:-rpzchsgutabxeabbnwas}"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧪 Тестирование восстановления из бэкапа"
echo "========================================"
echo ""
echo "⚠️  ВНИМАНИЕ: Этот скрипт предназначен для тестирования восстановления"
echo "   в тестовую БД. НЕ используйте его для восстановления в production БД!"
echo ""

# Проверка аргументов
if [ -z "$1" ]; then
  # Найти последний бэкап
  LATEST_BACKUP=$(find "$BACKUP_DIR" \( -name "supabase_backup_*.dump" -o -name "supabase_backup_*.sql" \) -type f -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | cut -d' ' -f2-)
  
  if [ -z "$LATEST_BACKUP" ]; then
    echo -e "${RED}❌ Бэкапы не найдены в директории: $BACKUP_DIR${NC}"
    echo ""
    echo "Создайте бэкап сначала:"
    echo "  ./scripts/backup-database.sh"
    exit 1
  fi
  
  BACKUP_FILE="$LATEST_BACKUP"
  echo "📁 Используется последний бэкап: $(basename "$BACKUP_FILE")"
else
  BACKUP_FILE="$1"
  
  if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Файл бэкапа не найден: $BACKUP_FILE${NC}"
    exit 1
  fi
fi

echo ""
echo "📋 Информация о бэкапе:"
FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
FILE_TIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$BACKUP_FILE" 2>/dev/null || stat -c "%y" "$BACKUP_FILE" 2>/dev/null | cut -d'.' -f1)
echo "   - Файл: $(basename "$BACKUP_FILE")"
echo "   - Размер: $FILE_SIZE"
echo "   - Дата: $FILE_TIME"
echo ""

# Проверка наличия pg_restore
if ! command -v pg_restore &> /dev/null; then
  echo -e "${RED}❌ Ошибка: pg_restore не найден${NC}"
  echo "Установите PostgreSQL client tools:"
  echo "  macOS: brew install postgresql"
  echo "  Ubuntu: sudo apt-get install postgresql-client"
  exit 1
fi

# Запросить данные для тестовой БД
echo "📝 Введите данные для тестовой БД Supabase:"
echo ""
read -p "Test Project Ref (или нажмите Enter для пропуска): " TEST_PROJECT_REF

if [ -z "$TEST_PROJECT_REF" ]; then
  echo -e "${YELLOW}⚠️  Тестовое восстановление пропущено${NC}"
  echo ""
  echo "Для тестирования восстановления:"
  echo "1. Создайте тестовый проект в Supabase"
  echo "2. Запустите скрипт снова и введите Test Project Ref"
  echo ""
  echo "✅ Валидация бэкапа:"
  
  # Простая валидация файла
  if [[ "$BACKUP_FILE" == *.dump ]]; then
    if file "$BACKUP_FILE" | grep -q "PostgreSQL"; then
      echo -e "${GREEN}✅ Бэкап валиден (PostgreSQL dump)${NC}"
    else
      echo -e "${YELLOW}⚠️  Формат бэкапа не распознан как PostgreSQL dump${NC}"
    fi
  fi
  
  FILE_SIZE_BYTES=$(stat -f "%z" "$BACKUP_FILE" 2>/dev/null || stat -c "%s" "$BACKUP_FILE")
  if [ "$FILE_SIZE_BYTES" -gt 0 ]; then
    echo -e "${GREEN}✅ Бэкап не пустой (размер: $FILE_SIZE_BYTES байт)${NC}"
  else
    echo -e "${RED}❌ Бэкап пустой${NC}"
    exit 1
  fi
  
  exit 0
fi

read -sp "Test Supabase Service Role Key: " TEST_SERVICE_ROLE_KEY
echo ""

if [ -z "$TEST_SERVICE_ROLE_KEY" ]; then
  echo -e "${RED}❌ Ошибка: Test Service Role Key не введен${NC}"
  exit 1
fi

echo ""
echo "⚠️  ВНИМАНИЕ: Вы собираетесь восстановить бэкап в тестовую БД!"
echo "   Test Project: $TEST_PROJECT_REF"
echo ""
read -p "Продолжить? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo -e "${YELLOW}⚠️  Отменено${NC}"
  exit 0
fi

# Восстановление бэкапа
echo ""
echo "📥 Восстановление бэкапа в тестовую БД..."

DB_HOST="db.${TEST_PROJECT_REF}.supabase.co"
DB_PORT="5432"

if PGPASSWORD="$TEST_SERVICE_ROLE_KEY" pg_restore \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U postgres \
  -d postgres \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  "$BACKUP_FILE" 2>&1; then
  
  echo ""
  echo -e "${GREEN}✅ Бэкап успешно восстановлен в тестовую БД${NC}"
  echo ""
  echo "📋 Проверьте тестовую БД:"
  echo "   https://supabase.com/dashboard/project/$TEST_PROJECT_REF"
  echo ""
else
  echo ""
  echo -e "${RED}❌ Ошибка при восстановлении бэкапа${NC}"
  echo ""
  echo "Возможные причины:"
  echo "1. Неверный Test Project Ref или Service Role Key"
  echo "2. Проблемы с подключением к тестовой БД"
  echo "3. Несовместимость версий PostgreSQL"
  exit 1
fi

