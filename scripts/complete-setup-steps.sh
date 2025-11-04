#!/bin/bash

# Выполнение всех следующих шагов из финального отчета
# Использование: ./scripts/complete-setup-steps.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 ВЫПОЛНЕНИЕ СЛЕДУЮЩИХ ШАГОВ"
echo "=============================="
echo ""

# Шаг 1: Настройка cron для бэкапов
echo "📋 ШАГ 1: Настройка cron для бэкапов"
echo "-----------------------------------"

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${YELLOW}⚠️  SUPABASE_SERVICE_ROLE_KEY не установлен${NC}"
  echo ""
  echo "Для настройки cron нужен SUPABASE_SERVICE_ROLE_KEY."
  echo ""
  echo "Получить ключ можно:"
  echo "  1. Supabase Dashboard: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/settings/api-keys"
  echo "  2. Vercel Dashboard: https://vercel.com/dashboard → Ваш проект → Settings → Environment Variables"
  echo "  3. Railway Dashboard: https://railway.app → Ваш проект → Variables"
  echo ""
  read -p "Ввести SUPABASE_SERVICE_ROLE_KEY сейчас? (y/n): " setup_backup
  
  if [ "$setup_backup" = "y" ]; then
    read -sp "Введите SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
    echo ""
    export SUPABASE_SERVICE_ROLE_KEY
    
    echo "Настройка cron..."
    if "$PROJECT_DIR/scripts/setup-backup-cron-auto.sh"; then
      echo -e "${GREEN}✅ Cron для бэкапов настроен${NC}"
      todo_write "$PROJECT_DIR" "Настроить cron для бэкапов" "completed"
    else
      echo -e "${RED}❌ Ошибка при настройке cron${NC}"
    fi
  else
    echo -e "${YELLOW}⏭️  Пропущено (можно настроить позже: ./scripts/setup-backup-cron.sh)${NC}"
  fi
else
  echo -e "${GREEN}✅ SUPABASE_SERVICE_ROLE_KEY найден${NC}"
  echo "Настройка cron..."
  if "$PROJECT_DIR/scripts/setup-backup-cron-auto.sh"; then
    echo -e "${GREEN}✅ Cron для бэкапов настроен${NC}"
  fi
fi
echo ""

# Шаг 2: Добавить RAILWAY_TOKEN в GitHub Secrets
echo "📋 ШАГ 2: Добавить RAILWAY_TOKEN в GitHub Secrets"
echo "------------------------------------------------"

if command -v gh &> /dev/null && gh auth status &> /dev/null; then
  if gh secret list 2>/dev/null | grep -q "^RAILWAY_TOKEN"; then
    echo -e "${GREEN}✅ RAILWAY_TOKEN уже настроен${NC}"
  else
    echo -e "${YELLOW}⚠️  RAILWAY_TOKEN отсутствует${NC}"
    echo ""
    echo "Для получения токена:"
    echo "  https://railway.app/account/tokens"
    echo ""
    echo "Нажмите на токен 'Railway API Token - Production 2025' и скопируйте"
    echo ""
    read -p "Добавить RAILWAY_TOKEN сейчас? (y/n): " add_railway
    
    if [ "$add_railway" = "y" ]; then
      read -sp "Введите RAILWAY_TOKEN: " RAILWAY_TOKEN
      echo ""
      echo "$RAILWAY_TOKEN" | gh secret set RAILWAY_TOKEN
      echo -e "${GREEN}✅ RAILWAY_TOKEN добавлен${NC}"
    else
      echo -e "${YELLOW}⏭️  Пропущено (можно добавить позже)${NC}"
      echo "Или выполните: ./scripts/get-railway-token.sh"
    fi
  fi
else
  echo -e "${YELLOW}⚠️  GitHub CLI не доступен${NC}"
  echo "Настройте секреты через GitHub Dashboard:"
  echo "  Settings → Secrets and variables → Actions"
fi
echo ""

# Шаг 3: Проверка переменных окружения
echo "📋 ШАГ 3: Проверка переменных окружения"
echo "--------------------------------------"
echo "Запуск проверки..."
"$PROJECT_DIR/scripts/check-env-vercel-railway.sh"
echo ""

# Шаг 4: Итоговый отчет
echo "📊 ИТОГОВЫЙ ОТЧЕТ"
echo "=================="
echo ""
echo "✅ Выполнено:"
if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ] && crontab -l 2>/dev/null | grep -q "backup-database-cron.sh"; then
  echo "  ✅ Cron для бэкапов настроен"
else
  echo "  ⏳ Cron для бэкапов - требуется SUPABASE_SERVICE_ROLE_KEY"
fi

if command -v gh &> /dev/null && gh secret list 2>/dev/null | grep -q "^RAILWAY_TOKEN"; then
  echo "  ✅ RAILWAY_TOKEN настроен"
else
  echo "  ⏳ RAILWAY_TOKEN - требуется добавить"
fi

echo "  ✅ Скрипты проверки созданы"
echo ""
echo "📚 Следующие шаги:"
echo "  1. Настроить cron для бэкапов (если еще не настроено)"
echo "  2. Добавить RAILWAY_TOKEN в GitHub Secrets (если еще не добавлен)"
echo "  3. Завершить ротацию секретов по инструкции: docs/ROTATE_SECRETS.md"
echo ""

