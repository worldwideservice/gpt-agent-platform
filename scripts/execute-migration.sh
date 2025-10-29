#!/bin/bash

# Скрипт для выполнения миграций БД через Supabase CLI или открытие Dashboard
# Автоматически открывает файл для копирования

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="$SCRIPT_DIR/apply-all-setup.sql"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📋 Применение миграций БД..."
echo ""

# Проверяем наличие файла SQL
if [ ! -f "$SQL_FILE" ]; then
  echo "❌ Файл не найден: $SQL_FILE"
  exit 1
fi

# Пробуем выполнить через Supabase CLI
if command -v supabase &> /dev/null; then
  echo "✅ Supabase CLI найден"
  
  # Проверяем статус проекта
  cd "$PROJECT_ROOT"
  
  echo "🔄 Попытка выполнения через Supabase CLI..."
  echo ""
  echo "⚠️  Для выполнения миграций через CLI нужно:"
  echo "   1. supabase login"
  echo "   2. supabase link --project-ref <project-ref>"
  echo ""
  
  # Пробуем выполнить через db execute (если доступно)
  if supabase db execute --file "$SQL_FILE" 2>/dev/null; then
    echo "✅ Миграции применены успешно!"
    exit 0
  else
    echo "⚠️  Не удалось выполнить через CLI (требуется настройка)"
  fi
else
  echo "⚠️  Supabase CLI не установлен"
fi

echo ""
echo "📝 ВАРИАНТ 1: Через Supabase Dashboard (РЕКОМЕНДУЕТСЯ)"
echo ""
echo "1. Откройте: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas"
echo "2. Перейдите в SQL Editor → New query"
echo ""
echo "3. Откройте файл для копирования:"
echo "   $SQL_FILE"
echo ""

# Пытаемся открыть файл в редакторе по умолчанию
if command -v open &> /dev/null; then
  echo "4. Файл будет открыт автоматически..."
  open "$SQL_FILE" 2>/dev/null || code "$SQL_FILE" 2>/dev/null || echo "   Откройте файл вручную: $SQL_FILE"
  echo ""
  echo "5. Скопируйте ВЕСЬ файл (Ctrl+A / Cmd+A, затем Ctrl+C / Cmd+C)"
  echo "6. Вставьте в SQL Editor (Ctrl+V / Cmd+V)"
  echo "7. Нажмите Run (или Ctrl+Enter / Cmd+Enter)"
else
  echo "4. Скопируйте содержимое файла: $SQL_FILE"
  echo "5. Вставьте в SQL Editor"
  echo "6. Нажмите Run"
fi

echo ""
echo "📋 Проверка после выполнения:"
echo ""
echo "Должны вернуться:"
echo "  ✅ 5 таблиц (в первом SELECT)"
echo "  ✅ 1 bucket (во втором SELECT)"
echo ""

# Открываем Supabase Dashboard
if command -v open &> /dev/null; then
  echo "🌐 Открываю Supabase Dashboard..."
  open "https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/sql/new" 2>/dev/null || true
fi

echo ""
echo "✅ Инструкция завершена!"

