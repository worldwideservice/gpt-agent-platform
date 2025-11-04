#!/bin/bash

# Скрипт для коммита изменений и деплоя (через Git push)
# Использование: ./scripts/commit-and-deploy.sh [commit message]

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

COMMIT_MESSAGE="${1:-Production ready: all services tested and configured}"

echo "📦 Коммит и деплой изменений"
echo "============================"
echo ""

# Проверка наличия изменений
if [ -z "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}⚠️  Нет изменений для коммита${NC}"
  exit 0
fi

echo "📋 Изменения:"
git status --short
echo ""

# Подтверждение
read -p "Продолжить коммит и деплой? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo -e "${YELLOW}⚠️  Отменено${NC}"
  exit 0
fi

# Коммит
echo ""
echo "📝 Коммит изменений..."
git add .

if git commit -m "$COMMIT_MESSAGE"; then
  echo -e "${GREEN}✅ Изменения закоммичены${NC}"
else
  echo -e "${RED}❌ Ошибка коммита${NC}"
  exit 1
fi

# Push
echo ""
echo "🚀 Push изменений..."
if git push origin main; then
  echo -e "${GREEN}✅ Изменения отправлены${NC}"
else
  echo -e "${RED}❌ Ошибка push${NC}"
  exit 1
fi

echo ""
echo "✅ Готово!"
echo ""
echo "💡 Деплои начнутся автоматически:"
echo "   - Railway: автоматически задеплоит Worker"
echo "   - Vercel: автоматически задеплоит Frontend"
echo ""
echo "⏳ Подождите несколько минут и проверьте:"
echo "   ./scripts/verify-deployments.sh"
echo ""

