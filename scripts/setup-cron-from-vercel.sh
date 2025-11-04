#!/bin/bash

# Настройка cron для бэкапов используя переменные из Vercel
# Использование: ./scripts/setup-cron-from-vercel.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔧 Настройка cron для бэкапов из Vercel"
echo "========================================"
echo ""

# Проверка Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo -e "${RED}❌ Vercel CLI не установлен${NC}"
  echo ""
  echo "Установите: npm install -g vercel"
  exit 1
fi

echo "📥 Получение переменных окружения из Vercel..."
VERCEL_ENV_FILE="$PROJECT_DIR/.env.vercel.tmp"

# Получить переменные окружения для Production
vercel env pull "$VERCEL_ENV_FILE" --environment=production --yes 2>&1 | grep -v "Warning" || {
  echo -e "${YELLOW}⚠️  Не удалось получить переменные из Vercel${NC}"
  echo "Попробуйте вручную:"
  echo "  1. Получите SUPABASE_SERVICE_ROLE_KEY из Vercel Dashboard"
  echo "  2. Выполните: export SUPABASE_SERVICE_ROLE_KEY=your-key"
  echo "  3. Выполните: ./scripts/setup-backup-cron-auto.sh"
  exit 1
}

# Загрузить переменные
source "$VERCEL_ENV_FILE" 2>/dev/null || true

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${YELLOW}⚠️  SUPABASE_SERVICE_ROLE_KEY не найден в переменных Vercel${NC}"
  echo ""
  echo "Попробуйте вручную:"
  echo "  1. Откройте: https://vercel.com/world-wide-services-62780b79/gpt-agent-kwid/settings/environment-variables"
  echo "  2. Найдите SUPABASE_SERVICE_ROLE_KEY для Production"
  echo "  3. Нажмите 'Click to reveal' и скопируйте значение"
  echo "  4. Выполните: export SUPABASE_SERVICE_ROLE_KEY=your-key"
  echo "  5. Выполните: ./scripts/setup-backup-cron-auto.sh"
  rm -f "$VERCEL_ENV_FILE"
  exit 1
fi

echo -e "${GREEN}✅ SUPABASE_SERVICE_ROLE_KEY получен из Vercel${NC}"

# Настроить cron
export SUPABASE_SERVICE_ROLE_KEY
"$SCRIPT_DIR/setup-backup-cron-auto.sh"

# Удалить временный файл
rm -f "$VERCEL_ENV_FILE"

echo ""
echo -e "${GREEN}✅ Настройка cron завершена!${NC}"

