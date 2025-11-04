#!/bin/bash

# Скрипт для очистки старых бэкапов (старше указанного количества дней)
# Использование: ./scripts/cleanup-old-backups.sh [DAYS]
# Пример: ./scripts/cleanup-old-backups.sh 30

set -e

# Конфигурация
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
DAYS_TO_KEEP="${1:-30}" # По умолчанию 30 дней

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧹 Очистка старых бэкапов"
echo "========================="
echo ""

# Проверка существования директории
if [ ! -d "$BACKUP_DIR" ]; then
  echo -e "${YELLOW}⚠️  Директория для бэкапов не найдена: $BACKUP_DIR${NC}"
  exit 0
fi

# Подсчет файлов до очистки
FILES_BEFORE=$(find "$BACKUP_DIR" -name "supabase_backup_*.dump" -o -name "supabase_backup_*.sql" 2>/dev/null | wc -l | tr -d ' ')

echo "📊 Статус до очистки:"
echo "  - Всего бэкапов: $FILES_BEFORE"
echo "  - Хранить бэкапы: последние $DAYS_TO_KEEP дней"
echo ""

# Удаление старых бэкапов
echo "🗑️  Удаление бэкапов старше $DAYS_TO_KEEP дней..."

DELETED_COUNT=0
TOTAL_SIZE_FREED=0

while IFS= read -r file; do
  if [ -f "$file" ]; then
    FILE_SIZE=$(du -k "$file" | cut -f1)
    TOTAL_SIZE_FREED=$((TOTAL_SIZE_FREED + FILE_SIZE))
    rm "$file"
    DELETED_COUNT=$((DELETED_COUNT + 1))
    echo "  ✅ Удален: $(basename "$file")"
  fi
done < <(find "$BACKUP_DIR" \( -name "supabase_backup_*.dump" -o -name "supabase_backup_*.sql" \) -type f -mtime +$DAYS_TO_KEEP 2>/dev/null)

# Подсчет файлов после очистки
FILES_AFTER=$(find "$BACKUP_DIR" -name "supabase_backup_*.dump" -o -name "supabase_backup_*.sql" 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "📊 Результат очистки:"
echo "  - Удалено бэкапов: $DELETED_COUNT"
echo "  - Осталось бэкапов: $FILES_AFTER"

if [ $TOTAL_SIZE_FREED -gt 0 ]; then
  SIZE_MB=$((TOTAL_SIZE_FREED / 1024))
  echo "  - Освобождено места: ~${SIZE_MB} MB"
fi

echo ""
if [ $DELETED_COUNT -eq 0 ]; then
  echo -e "${GREEN}✅ Нет старых бэкапов для удаления${NC}"
else
  echo -e "${GREEN}✅ Очистка завершена успешно${NC}"
fi

