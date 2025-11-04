#!/bin/bash

# Скрипт для автоматической настройки cron задачи для бэкапов
# Использование: ./scripts/setup-backup-cron.sh

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🔧 Настройка автоматических бэкапов через cron"
echo "================================================"
echo ""

# Получить абсолютный путь к проекту
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "📁 Директория проекта: $PROJECT_DIR"
echo ""

# Проверка наличия скрипта бэкапа
if [ ! -f "$PROJECT_DIR/scripts/backup-database-cron.sh" ]; then
  echo -e "${RED}❌ Ошибка: Скрипт backup-database-cron.sh не найден${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Скрипт backup-database-cron.sh найден${NC}"
echo ""

# Проверка переменной окружения SUPABASE_SERVICE_ROLE_KEY
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${YELLOW}⚠️  SUPABASE_SERVICE_ROLE_KEY не установлен${NC}"
  echo ""
  echo "Введите SUPABASE_SERVICE_ROLE_KEY:"
  read -sp "SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
  echo ""
  
  if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ Ошибка: SUPABASE_SERVICE_ROLE_KEY не может быть пустым${NC}"
    exit 1
  fi
fi

echo ""
echo "⏰ Настройка времени выполнения бэкапа"
echo ""
echo "Выберите время выполнения (по умолчанию: 2:00 AM):"
echo "1. 2:00 AM (рекомендуется)"
echo "2. 3:00 AM"
echo "3. 4:00 AM"
echo "4. Другое время (введите в формате HH:MM)"
echo ""
read -p "Ваш выбор (1-4): " time_choice

case $time_choice in
  1)
    CRON_TIME="0 2"
    ;;
  2)
    CRON_TIME="0 3"
    ;;
  3)
    CRON_TIME="0 4"
    ;;
  4)
    read -p "Введите время (HH:MM): " custom_time
    HOUR=$(echo "$custom_time" | cut -d':' -f1)
    MINUTE=$(echo "$custom_time" | cut -d':' -f2)
    CRON_TIME="$MINUTE $HOUR"
    ;;
  *)
    CRON_TIME="0 2"
    ;;
esac

echo ""
echo "📋 Настройка cron задачи"
echo ""

# Создать временный файл с cron задачей
CRON_TEMP=$(mktemp)

# Получить текущий crontab
crontab -l 2>/dev/null > "$CRON_TEMP" || true

# Проверить, не добавлена ли уже задача
if grep -q "backup-database-cron.sh" "$CRON_TEMP"; then
  echo -e "${YELLOW}⚠️  Задача для бэкапа уже существует в crontab${NC}"
  echo ""
  echo "Выберите действие:"
  echo "1. Заменить существующую задачу"
  echo "2. Отменить"
  echo ""
  read -p "Ваш выбор (1-2): " replace_choice
  
  if [ "$replace_choice" = "1" ]; then
    # Удалить существующую задачу
    grep -v "backup-database-cron.sh" "$CRON_TEMP" > "${CRON_TEMP}.new" || true
    mv "${CRON_TEMP}.new" "$CRON_TEMP"
    echo -e "${GREEN}✅ Старая задача удалена${NC}"
  else
    echo -e "${RED}❌ Отменено${NC}"
    rm "$CRON_TEMP"
    exit 1
  fi
fi

# Определить команду для cron
CRON_CMD="cd $PROJECT_DIR && export SUPABASE_SERVICE_ROLE_KEY='$SUPABASE_SERVICE_ROLE_KEY' && ./scripts/backup-database-cron.sh >> $PROJECT_DIR/logs/backup.log 2>&1"

# Добавить новую задачу
echo "$CRON_TIME * * * $CRON_CMD" >> "$CRON_TEMP"

# Установить новый crontab
crontab "$CRON_TEMP"
rm "$CRON_TEMP"

echo -e "${GREEN}✅ Cron задача добавлена${NC}"
echo ""
echo "📋 Добавленная задача:"
echo "   $CRON_TIME * * * $CRON_CMD"
echo ""

# Создать директорию для логов
mkdir -p "$PROJECT_DIR/logs"

# Добавить задачу для очистки старых бэкапов (через 30 минут после бэкапа)
CLEANUP_MINUTE=$((MINUTE + 30))
if [ "$CLEANUP_MINUTE" -ge 60 ]; then
  CLEANUP_MINUTE=$((CLEANUP_MINUTE - 60))
  CLEANUP_HOUR=$((HOUR + 1))
else
  CLEANUP_HOUR=$HOUR
fi

CRON_TEMP=$(mktemp)
crontab -l 2>/dev/null > "$CRON_TEMP" || true

if ! grep -q "cleanup-old-backups.sh" "$CRON_TEMP"; then
  echo "$CLEANUP_MINUTE $CLEANUP_HOUR * * * cd $PROJECT_DIR && ./scripts/cleanup-old-backups.sh 30 >> $PROJECT_DIR/logs/backup.log 2>&1" >> "$CRON_TEMP"
  crontab "$CRON_TEMP"
  echo -e "${GREEN}✅ Задача очистки старых бэкапов добавлена${NC}"
fi

rm "$CRON_TEMP"

echo ""
echo "✅ Настройка завершена!"
echo ""
echo "📊 Информация:"
echo "   - Бэкапы будут создаваться ежедневно в указанное время"
echo "   - Логи будут сохраняться в: $PROJECT_DIR/logs/backup.log"
echo "   - Старые бэкапы (старше 30 дней) будут удаляться автоматически"
echo ""
echo "💡 Полезные команды:"
echo "   - Просмотр cron задач: crontab -l"
echo "   - Просмотр логов: tail -f $PROJECT_DIR/logs/backup.log"
echo "   - Проверка статуса бэкапов: ./scripts/check-backup-status.sh"
echo ""

