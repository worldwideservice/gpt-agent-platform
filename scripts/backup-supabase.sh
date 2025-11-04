#!/bin/bash

# Скрипт для создания ручного бэкапа Supabase базы данных
# Использование: bash scripts/backup-supabase.sh

set -e

# Загружаем переменные окружения
if [ -f .env.production ]; then
  source .env.production
elif [ -f env.production ]; then
  source env.production
fi

# Проверяем наличие необходимых переменных
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Ошибка: SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY должны быть установлены"
  echo "💡 Создайте файл env.production или установите переменные окружения"
  exit 1
fi

# Извлекаем project ref из URL
PROJECT_REF=$(echo "$SUPABASE_URL" | sed -E 's|https?://([^.]+)\.supabase\.co.*|\1|')

if [ -z "$PROJECT_REF" ]; then
  echo "❌ Не удалось извлечь project ref из SUPABASE_URL: $SUPABASE_URL"
  exit 1
fi

# Создаем директорию для бэкапов
BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"

# Формируем имя файла бэкапа
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/supabase_backup_${PROJECT_REF}_${TIMESTAMP}.sql"

echo "🗄️  Создание бэкапа Supabase базы данных..."
echo "📍 Project: $PROJECT_REF"
echo "📁 Файл: $BACKUP_FILE"
echo ""

# Получаем connection string из Supabase
# Для pg_dump нужен прямой connection string к PostgreSQL
# Формат: postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres

# Получаем пароль из Supabase Dashboard → Settings → Database → Database password
# Или используем connection string из Dashboard → Settings → Database → Connection string

echo "⚠️  ВНИМАНИЕ: Для создания бэкапа через pg_dump нужен прямой connection string к PostgreSQL"
echo ""
echo "📋 Инструкция:"
echo "1. Откройте Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/settings/database"
echo ""
echo "2. Найдите 'Connection string' в разделе 'Connection parameters'"
echo "   Или используйте 'Database password' для создания connection string"
echo ""
echo "3. Формат connection string:"
echo "   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
echo ""
echo "4. Выполните команду:"
echo "   pg_dump '[CONNECTION_STRING]' > $BACKUP_FILE"
echo ""
echo "   Или используйте Supabase CLI:"
echo "   supabase db dump --project-ref $PROJECT_REF --output $BACKUP_FILE"
echo ""

# Альтернативный вариант: через Supabase REST API для экспорта схемы
echo "📝 Альтернатива: Экспорт схемы через SQL Editor"
echo "1. Откройте SQL Editor:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
echo ""
echo "2. Выполните SQL для экспорта схемы:"
echo ""
echo "   -- Экспорт всех таблиц"
echo "   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
echo ""

echo "✅ Скрипт готов. Выполните ручной бэкап по инструкции выше."
echo ""
echo "📚 Документация: docs/SUPABASE_BACKUPS.md"

