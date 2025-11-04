#!/bin/bash

# Скрипт для деплоя Frontend на Vercel
# Использование: ./scripts/deploy-frontend-vercel.sh

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Деплой Frontend на Vercel"
echo "============================="
echo ""

# Проверка наличия Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}⚠️  Vercel CLI не установлен${NC}"
  echo ""
  echo "Установите Vercel CLI:"
  echo "  npm i -g vercel"
  echo ""
  echo "Или используйте Vercel Dashboard для деплоя:"
  echo "  https://vercel.com/dashboard"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ Vercel CLI найден${NC}"
echo ""

# Проверка авторизации
if ! vercel whoami &> /dev/null; then
  echo -e "${YELLOW}⚠️  Не авторизован в Vercel${NC}"
  echo ""
  echo "Авторизуйтесь:"
  echo "  vercel login"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ Авторизован в Vercel${NC}"
echo ""

# Проверка сборки
echo "📦 Проверка сборки..."
if npm run build; then
  echo -e "${GREEN}✅ Сборка успешна${NC}"
else
  echo -e "${RED}❌ Ошибка сборки${NC}"
  exit 1
fi

echo ""
echo "🚀 Деплой на Vercel..."
echo "Выберите опцию:"
echo "1. Production деплой (--prod)"
echo "2. Preview деплой"
echo ""
read -p "Ваш выбор (1-2): " choice

case $choice in
  1)
    if vercel --prod; then
      echo -e "${GREEN}✅ Production деплой успешен${NC}"
    else
      echo -e "${RED}❌ Ошибка деплоя${NC}"
      exit 1
    fi
    ;;
  2)
    if vercel; then
      echo -e "${GREEN}✅ Preview деплой успешен${NC}"
    else
      echo -e "${RED}❌ Ошибка деплоя${NC}"
      exit 1
    fi
    ;;
  *)
    echo -e "${RED}❌ Неверный выбор${NC}"
    exit 1
    ;;
esac

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "💡 Проверьте статус:"
echo "   https://vercel.com/dashboard"
echo "   или: vercel ls"
echo ""

