#!/bin/bash

# Скрипт для создания бэкапа Supabase БД
# Использование: ./scripts/backup-database.sh

set -e

# Конфигурация
PROJECT_REF="${SUPABASE_PROJECT_REF:-rpzchsgutabxeabbnwas}"
SUPABASE_URL="${SUPABASE_URL:-https://${PROJECT_REF}.supabase.co}"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/supabase_backup_${PROJECT_REF}_${DATE}.sql"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🗄️  Создание бэкапа Supabase БД"
echo "=================================="
echo ""

# Проверка переменных окружения
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${RED}❌ Ошибка: SUPABASE_SERVICE_ROLE_KEY не установлен${NC}"
  echo "Установите переменную окружения:"
  echo "  export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
  exit 1
fi

# Создать директорию для бэкапов
mkdir -p "$BACKUP_DIR"
echo "✅ Директория для бэкапов: $BACKUP_DIR"

# Проверка наличия Supabase CLI
if command -v supabase &> /dev/null; then
  echo "✅ Supabase CLI найден"
  
  # Использовать Supabase CLI для бэкапа
  echo "📥 Создание бэкапа через Supabase CLI..."
  
  supabase db dump \
    --project-ref "$PROJECT_REF" \
    --db-url "postgresql://postgres.${PROJECT_REF}:${SUPABASE_SERVICE_ROLE_KEY}@aws-0-us-east-1.pooler.supabase.com:6543/postgres" \
    --output "$BACKUP_FILE" 2>&1 || {
    
    # Fallback на pg_dump если Supabase CLI не работает
    echo -e "${YELLOW}⚠️  Supabase CLI не удалось использовать, пробуем pg_dump...${NC}"
    
    if command -v pg_dump &> /dev/null; then
      echo "✅ pg_dump найден"
      
      # Извлечь host из SUPABASE_URL или использовать стандартный формат
      DB_HOST="db.${PROJECT_REF}.supabase.co"
      DB_PORT="5432"
      
      echo "📥 Создание бэкапа через pg_dump..."
      PGPASSWORD="$SUPABASE_SERVICE_ROLE_KEY" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U postgres \
        -d postgres \
        -F c \
        -f "${BACKUP_FILE%.sql}.dump" \
        --no-owner \
        --no-acl
      
      BACKUP_FILE="${BACKUP_FILE%.sql}.dump"
    else
      echo -e "${RED}❌ Ошибка: pg_dump не найден${NC}"
      echo "Установите PostgreSQL client tools:"
      echo "  macOS: brew install postgresql"
      echo "  Ubuntu: sudo apt-get install postgresql-client"
      exit 1
    fi
  }
else
  # Использовать pg_dump напрямую
  echo "⚠️  Supabase CLI не найден, используем pg_dump"
  
  if command -v pg_dump &> /dev/null; then
    echo "✅ pg_dump найден"
    
    DB_HOST="db.${PROJECT_REF}.supabase.co"
    DB_PORT="5432"
    
    echo "📥 Создание бэкапа через pg_dump..."
    PGPASSWORD="$SUPABASE_SERVICE_ROLE_KEY" pg_dump \
      -h "$DB_HOST" \
      -p "$DB_PORT" \
      -U postgres \
      -d postgres \
      -F c \
      -f "${BACKUP_FILE%.sql}.dump" \
      --no-owner \
      --no-acl
    
    BACKUP_FILE="${BACKUP_FILE%.sql}.dump"
  else
    echo -e "${RED}❌ Ошибка: pg_dump не найден${NC}"
    echo "Установите PostgreSQL client tools:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql-client"
    exit 1
  fi
fi

# Проверка размера файла
if [ -f "$BACKUP_FILE" ]; then
  FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo ""
  echo -e "${GREEN}✅ Бэкап успешно создан!${NC}"
  echo "📁 Файл: $BACKUP_FILE"
  echo "📊 Размер: $FILE_SIZE"
  echo ""
  
  # Показать список последних бэкапов
  echo "📋 Последние 5 бэкапов:"
  ls -lh "$BACKUP_DIR"/*.{sql,dump} 2>/dev/null | tail -5 || echo "  (нет других бэкапов)"
  
  # Предупреждение о старых бэкапах
  echo ""
  echo -e "${YELLOW}💡 Рекомендация: Настройте автоматическое удаление старых бэкапов (старше 30 дней)${NC}"
  
else
  echo -e "${RED}❌ Ошибка: Бэкап не был создан${NC}"
  exit 1
fi

echo ""
echo "✅ Готово!"

