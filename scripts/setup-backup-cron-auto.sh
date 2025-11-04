#!/bin/bash

# Автоматическая настройка cron для бэкапов (без интерактивного ввода)
# Использование: SUPABASE_SERVICE_ROLE_KEY=your-key ./scripts/setup-backup-cron-auto.sh

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔧 Автоматическая настройка cron для бэкапов"
echo "============================================="
echo ""

# Проверка SUPABASE_SERVICE_ROLE_KEY
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${RED}❌ Ошибка: SUPABASE_SERVICE_ROLE_KEY не установлен${NC}"
  echo ""
  echo "Установите переменную окружения:"
  echo "  export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
  echo "  ./scripts/setup-backup-cron-auto.sh"
  echo ""
  exit 1
fi

# Создать файл с секретами
if [ ! -f "$PROJECT_DIR/scripts/.backup-secrets.sh" ]; then
  echo "📝 Создание файла для секретов..."
  echo "export SUPABASE_SERVICE_ROLE_KEY='$SUPABASE_SERVICE_ROLE_KEY'" > "$PROJECT_DIR/scripts/.backup-secrets.sh"
  chmod 600 "$PROJECT_DIR/scripts/.backup-secrets.sh"
  echo -e "${GREEN}✅ Файл .backup-secrets.sh создан${NC}"
  
  # Добавить в .gitignore если еще не добавлен
  if ! grep -q "scripts/.backup-secrets.sh" "$PROJECT_DIR/.gitignore" 2>/dev/null; then
    echo "scripts/.backup-secrets.sh" >> "$PROJECT_DIR/.gitignore"
    echo -e "${GREEN}✅ Добавлено в .gitignore${NC}"
  fi
fi

# Настройка cron (ежедневно в 2:00)
CRON_TIME="0 2"
CRON_CMD="cd $PROJECT_DIR && source scripts/.backup-secrets.sh && ./scripts/backup-database-cron.sh >> $PROJECT_DIR/logs/backup.log 2>&1"

# Создать временный файл с cron задачей
CRON_TEMP=$(mktemp)
crontab -l 2>/dev/null > "$CRON_TEMP" || true

# Удалить существующую задачу если есть
grep -v "backup-database-cron.sh" "$CRON_TEMP" > "${CRON_TEMP}.new" || true
mv "${CRON_TEMP}.new" "$CRON_TEMP"

# Добавить новую задачу
echo "$CRON_TIME * * * $CRON_CMD" >> "$CRON_TEMP"
crontab "$CRON_TEMP"
rm "$CRON_TEMP"

echo -e "${GREEN}✅ Cron задача добавлена${NC}"

# Добавить задачу очистки старых бэкапов (через 30 минут после бэкапа)
CLEANUP_TIME="30 2"
CLEANUP_CMD="cd $PROJECT_DIR && ./scripts/cleanup-old-backups.sh 30 >> $PROJECT_DIR/logs/backup.log 2>&1"

CRON_TEMP=$(mktemp)
crontab -l 2>/dev/null > "$CRON_TEMP" || true

if ! grep -q "cleanup-old-backups.sh" "$CRON_TEMP"; then
  echo "$CLEANUP_TIME * * * $CLEANUP_CMD" >> "$CRON_TEMP"
  crontab "$CRON_TEMP"
  echo -e "${GREEN}✅ Задача очистки старых бэкапов добавлена${NC}"
fi

rm "$CRON_TEMP"

# Создать директорию для логов
mkdir -p "$PROJECT_DIR/logs"

echo ""
echo "✅ Настройка завершена!"
echo ""
echo "📊 Информация:"
echo "   - Бэкапы будут создаваться ежедневно в 2:00 AM"
echo "   - Логи будут сохраняться в: $PROJECT_DIR/logs/backup.log"
echo "   - Старые бэкапы (старше 30 дней) будут удаляться автоматически"
echo ""
echo "💡 Проверка:"
echo "   crontab -l"
echo ""

