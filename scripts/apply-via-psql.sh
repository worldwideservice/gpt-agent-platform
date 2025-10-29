#!/bin/bash

# Скрипт для применения миграций через psql
# Требуется: PostgreSQL client (psql)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Загружаем переменные окружения
if [ -f "$PROJECT_ROOT/.env.local" ]; then
  export $(grep -v '^#' "$PROJECT_ROOT/.env.local" | xargs)
fi

SUPABASE_URL="${SUPABASE_URL:-$NEXT_PUBLIC_SUPABASE_URL}"
SQL_FILE="$SCRIPT_DIR/apply-all-setup.sql"

if [ -z "$SUPABASE_URL" ]; then
  echo "❌ Ошибка: SUPABASE_URL не найден в .env.local"
  exit 1
fi

if [ ! -f "$SQL_FILE" ]; then
  echo "❌ Ошибка: Файл $SQL_FILE не найден"
  exit 1
fi

echo "📋 Применение миграций через psql..."
echo ""

# Извлекаем connection string из SUPABASE_URL
# Формат: https://xxx.supabase.co -> postgres://postgres:[password]@xxx.supabase.co:5432/postgres

# Проверяем наличие psql
if ! command -v psql &> /dev/null; then
  echo "❌ Ошибка: psql не установлен"
  echo ""
  echo "Установка на macOS:"
  echo "  brew install postgresql"
  echo ""
  echo "Или используйте Supabase Dashboard:"
  echo "  1. https://supabase.com/dashboard"
  echo "  2. SQL Editor → New query"
  echo "  3. Скопируйте содержимое: $SQL_FILE"
  echo "  4. Вставьте и выполните"
  exit 1
fi

echo "⚠️  Для использования psql нужен прямой доступ к БД."
echo "   Рекомендуется использовать Supabase Dashboard."
echo ""
echo "📝 Инструкция:"
echo "   1. Откройте: https://supabase.com/dashboard"
echo "   2. Перейдите в SQL Editor"
echo "   3. Скопируйте содержимое файла: $SQL_FILE"
echo "   4. Вставьте и нажмите Run"
echo ""
echo "Файл находится здесь: $SQL_FILE"

