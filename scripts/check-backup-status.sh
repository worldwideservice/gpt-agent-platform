#!/bin/bash

# Скрипт для проверки статуса бэкапов
# Проверяет последний бэкап, его размер, возраст и успешность
# Использование: ./scripts/check-backup-status.sh

set -e

# Конфигурация
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
PROJECT_REF="${SUPABASE_PROJECT_REF:-rpzchsgutabxeabbnwas}"
MAX_AGE_HOURS=48 # Максимальный возраст последнего бэкапа (часы)

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "📊 Проверка статуса бэкапов"
echo "=========================="
echo ""

# Проверка существования директории
if [ ! -d "$BACKUP_DIR" ]; then
  echo -e "${RED}❌ Директория для бэкапов не найдена: $BACKUP_DIR${NC}"
  exit 1
fi

# Поиск последнего бэкапа
LATEST_BACKUP=$(find "$BACKUP_DIR" \( -name "supabase_backup_*.dump" -o -name "supabase_backup_*.sql" \) -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)

if [ -z "$LATEST_BACKUP" ]; then
  echo -e "${RED}❌ Бэкапы не найдены в директории: $BACKUP_DIR${NC}"
  echo ""
  echo "💡 Рекомендация: Создайте первый бэкап:"
  echo "  ./scripts/backup-database.sh"
  exit 1
fi

# Информация о последнем бэкапе
BACKUP_NAME=$(basename "$LATEST_BACKUP")
BACKUP_SIZE=$(du -h "$LATEST_BACKUP" | cut -f1)
BACKUP_TIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$LATEST_BACKUP" 2>/dev/null || stat -c "%y" "$LATEST_BACKUP" 2>/dev/null | cut -d'.' -f1)
BACKUP_AGE_SECONDS=$(($(date +%s) - $(stat -f "%m" "$LATEST_BACKUP" 2>/dev/null || stat -c "%Y" "$LATEST_BACKUP")))
BACKUP_AGE_HOURS=$((BACKUP_AGE_SECONDS / 3600))
BACKUP_AGE_DAYS=$((BACKUP_AGE_HOURS / 24))

echo "📁 Последний бэкап:"
echo "  - Файл: $BACKUP_NAME"
echo "  - Размер: $BACKUP_SIZE"
echo "  - Дата создания: $BACKUP_TIME"
echo "  - Возраст: $BACKUP_AGE_HOURS часов ($BACKUP_AGE_DAYS дней)"
echo ""

# Проверка валидности бэкапа
echo "🔍 Проверка валидности бэкапа..."

if [ -f "$LATEST_BACKUP" ]; then
  # Проверка размера файла (должен быть больше 0)
  FILE_SIZE_BYTES=$(stat -f "%z" "$LATEST_BACKUP" 2>/dev/null || stat -c "%s" "$LATEST_BACKUP")
  
  if [ "$FILE_SIZE_BYTES" -eq 0 ]; then
    echo -e "${RED}❌ Бэкап пустой (размер 0 байт)${NC}"
    exit 1
  fi
  
  # Проверка формата (для .dump файлов)
  if [[ "$LATEST_BACKUP" == *.dump ]]; then
    if file "$LATEST_BACKUP" | grep -q "PostgreSQL"; then
      echo -e "${GREEN}✅ Бэкап валиден (PostgreSQL dump)${NC}"
    else
      echo -e "${YELLOW}⚠️  Формат бэкапа не распознан как PostgreSQL dump${NC}"
    fi
  fi
  
  echo -e "${GREEN}✅ Бэкап существует и не пустой${NC}"
else
  echo -e "${RED}❌ Бэкап не найден${NC}"
  exit 1
fi

echo ""

# Проверка возраста бэкапа
if [ $BACKUP_AGE_HOURS -gt $MAX_AGE_HOURS ]; then
  echo -e "${RED}⚠️  ВНИМАНИЕ: Последний бэкап старше $MAX_AGE_HOURS часов${NC}"
  echo "  Рекомендуется создать новый бэкап:"
  echo "    ./scripts/backup-database.sh"
  echo ""
else
  echo -e "${GREEN}✅ Последний бэкап свежий (младше $MAX_AGE_HOURS часов)${NC}"
  echo ""
fi

# Статистика всех бэкапов
echo "📊 Статистика всех бэкапов:"
TOTAL_BACKUPS=$(find "$BACKUP_DIR" \( -name "supabase_backup_*.dump" -o -name "supabase_backup_*.sql" \) -type f 2>/dev/null | wc -l | tr -d ' ')
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)

echo "  - Всего бэкапов: $TOTAL_BACKUPS"
echo "  - Общий размер: $TOTAL_SIZE"
echo ""

# Список последних 5 бэкапов
echo "📋 Последние 5 бэкапов:"
find "$BACKUP_DIR" \( -name "supabase_backup_*.dump" -o -name "supabase_backup_*.sql" \) -type f -printf '%T@ %p\n' 2>/dev/null | \
  sort -rn | head -5 | while read -r timestamp filepath; do
    filename=$(basename "$filepath")
    size=$(du -h "$filepath" | cut -f1)
    time=$(date -r "$(echo "$timestamp" | cut -d'.' -f1)" '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo "N/A")
    echo "  - $filename ($size, $time)"
  done

echo ""
echo -e "${GREEN}✅ Проверка завершена${NC}"

