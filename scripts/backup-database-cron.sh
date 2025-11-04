#!/bin/bash

# Скрипт для автоматических бэкапов Supabase БД через cron
# Использование: Настройте в crontab для ежедневного выполнения
# Пример: 0 2 * * * /path/to/scripts/backup-database-cron.sh >> /var/log/backup.log 2>&1

set -e

# Конфигурация
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
LOG_FILE="${LOG_FILE:-$PROJECT_DIR/logs/backup.log}"
PROJECT_REF="${SUPABASE_PROJECT_REF:-rpzchsgutabxeabbnwas}"
SUPABASE_URL="${SUPABASE_URL:-https://${PROJECT_REF}.supabase.co}"
DATE=$(date +%Y%m%d_%H%M%S)

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Создать директории
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

# Функция логирования
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🗄️  Начало автоматического бэкапа Supabase БД"

# Проверка переменных окружения
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  log "${RED}❌ Ошибка: SUPABASE_SERVICE_ROLE_KEY не установлен${NC}"
  exit 1
fi

# Создать бэкап
BACKUP_FILE="${BACKUP_DIR}/supabase_backup_${PROJECT_REF}_${DATE}.sql"

if command -v pg_dump &> /dev/null; then
  log "✅ pg_dump найден, создание бэкапа..."
  
  DB_HOST="db.${PROJECT_REF}.supabase.co"
  DB_PORT="5432"
  
  if PGPASSWORD="$SUPABASE_SERVICE_ROLE_KEY" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U postgres \
    -d postgres \
    -F c \
    -f "${BACKUP_FILE%.sql}.dump" \
    --no-owner \
    --no-acl 2>&1 | tee -a "$LOG_FILE"; then
    
    BACKUP_FILE="${BACKUP_FILE%.sql}.dump"
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    
    log "${GREEN}✅ Бэкап успешно создан: $BACKUP_FILE (размер: $FILE_SIZE)${NC}"
    
    # Удалить старые бэкапы (старше 30 дней)
    find "$BACKUP_DIR" -name "supabase_backup_*.dump" -type f -mtime +30 -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "supabase_backup_*.sql" -type f -mtime +30 -delete 2>/dev/null || true
    
    log "✅ Старые бэкапы (старше 30 дней) удалены"
    
    exit 0
  else
    log "${RED}❌ Ошибка при создании бэкапа${NC}"
    exit 1
  fi
else
  log "${RED}❌ Ошибка: pg_dump не найден${NC}"
  exit 1
fi

