#!/bin/bash

# Скрипт для деплоя Worker на Railway
# Использование: ./scripts/deploy-worker-railway.sh

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Деплой Worker на Railway"
echo "==========================="
echo ""

# Проверка наличия Railway CLI
if ! command -v railway &> /dev/null; then
  echo -e "${YELLOW}⚠️  Railway CLI не установлен${NC}"
  echo ""
  echo "Установите Railway CLI:"
  echo "  npm i -g @railway/cli"
  echo ""
  echo "Или используйте Railway Dashboard для деплоя:"
  echo "  https://railway.app"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ Railway CLI найден${NC}"
echo ""

# Проверка авторизации
if ! railway whoami &> /dev/null; then
  echo -e "${YELLOW}⚠️  Не авторизован в Railway${NC}"
  echo ""
  echo "Авторизуйтесь:"
  echo "  railway login"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ Авторизован в Railway${NC}"
echo ""

# Переход в директорию Worker
cd services/worker

echo "📦 Сборка Worker..."
if npm run build; then
  echo -e "${GREEN}✅ Сборка успешна${NC}"
else
  echo -e "${RED}❌ Ошибка сборки${NC}"
  exit 1
fi

echo ""
echo "🚀 Деплой на Railway..."
if railway up; then
  echo -e "${GREEN}✅ Деплой успешен${NC}"
else
  echo -e "${RED}❌ Ошибка деплоя${NC}"
  exit 1
fi

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "💡 Проверьте статус:"
echo "   https://railway.app"
echo "   или: railway status"
echo ""
