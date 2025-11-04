#!/bin/bash

# Полная настройка по плану - все критические задачи
# Использование: ./scripts/setup-complete-plan.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 ПОЛНАЯ НАСТРОЙКА ПО ПЛАНУ"
echo "============================"
echo ""
echo "Приоритет:"
echo "  🔴 Критично: Бэкапы, CI/CD Secrets, Ротация секретов"
echo "  🟡 Важно: Sentry, Мониторинг, Переменные окружения"
echo "  🟢 Опционально: Stripe, Email"
echo ""

# Шаг 1: Настройка cron для бэкапов
echo "📋 ШАГ 1: Настройка cron для бэкапов"
echo "-----------------------------------"

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${YELLOW}⚠️  SUPABASE_SERVICE_ROLE_KEY не установлен${NC}"
  echo ""
  echo "Для настройки cron нужен SUPABASE_SERVICE_ROLE_KEY."
  echo ""
  echo "Варианты получения:"
  echo "  1. Supabase Dashboard → Settings → API → service_role key"
  echo "  2. Vercel Dashboard → Environment Variables → SUPABASE_SERVICE_ROLE_KEY"
  echo "  3. Railway Dashboard → Variables → SUPABASE_SERVICE_ROLE_KEY"
  echo ""
  read -p "Ввести SUPABASE_SERVICE_ROLE_KEY сейчас? (y/n): " setup_backup
  
  if [ "$setup_backup" = "y" ]; then
    read -sp "Введите SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
    echo ""
    export SUPABASE_SERVICE_ROLE_KEY
    
    echo "Настройка cron..."
    "$PROJECT_DIR/scripts/setup-backup-cron-auto.sh"
    echo -e "${GREEN}✅ Cron для бэкапов настроен${NC}"
  else
    echo -e "${YELLOW}⏭️  Пропущено (можно настроить позже: ./scripts/setup-backup-cron.sh)${NC}"
  fi
else
  echo -e "${GREEN}✅ SUPABASE_SERVICE_ROLE_KEY найден${NC}"
  echo "Настройка cron..."
  "$PROJECT_DIR/scripts/setup-backup-cron-auto.sh"
  echo -e "${GREEN}✅ Cron для бэкапов настроен${NC}"
fi
echo ""

# Шаг 2: GitHub Secrets
echo "📋 ШАГ 2: Проверка GitHub Secrets"
echo "--------------------------------"

if command -v gh &> /dev/null && gh auth status &> /dev/null; then
  echo -e "${GREEN}✅ GitHub CLI доступен${NC}"
  
  MISSING_SECRETS=()
  for secret in RAILWAY_TOKEN; do
    if ! gh secret list 2>/dev/null | grep -q "^$secret"; then
      MISSING_SECRETS+=("$secret")
    fi
  done
  
  if [ ${#MISSING_SECRETS[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Отсутствующие секреты:${NC}"
    for secret in "${MISSING_SECRETS[@]}"; do
      echo "  - $secret"
    done
    echo ""
    echo "Для добавления RAILWAY_TOKEN:"
    echo "  1. Railway Dashboard → Account → Tokens → Create Token"
    echo "  2. Затем: gh secret set RAILWAY_TOKEN"
    echo ""
    read -p "Добавить RAILWAY_TOKEN сейчас? (y/n): " add_railway
    
    if [ "$add_railway" = "y" ]; then
      read -sp "Введите RAILWAY_TOKEN: " RAILWAY_TOKEN
      echo ""
      echo "$RAILWAY_TOKEN" | gh secret set RAILWAY_TOKEN
      echo -e "${GREEN}✅ RAILWAY_TOKEN добавлен${NC}"
    else
      echo -e "${YELLOW}⏭️  Пропущено (можно добавить позже)${NC}"
    fi
  else
    echo -e "${GREEN}✅ Все GitHub Secrets настроены${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  GitHub CLI не доступен${NC}"
  echo "Настройте секреты через GitHub Dashboard:"
  echo "  Settings → Secrets and variables → Actions"
fi
echo ""

# Шаг 3: Ротация секретов (инструкция)
echo "📋 ШАГ 3: Ротация секретов"
echo "--------------------------"
echo -e "${YELLOW}⚠️  Ротация секретов требует ручных действий через браузер${NC}"
echo ""
echo "Инструкция находится в: docs/ROTATE_SECRETS.md"
echo ""
echo "Критичные секреты для ротации:"
echo "  1. Railway Token (если найден в Git истории)"
echo "  2. Sentry Tokens (если найдены в Git истории)"
echo "  3. Vercel Token (если найден в Git истории)"
echo "  4. Supabase Service Role Key (если найден в Git истории)"
echo ""
echo "Для автоматизации через браузер откройте:"
echo "  - Railway: https://railway.app/account/tokens"
echo "  - Sentry: https://sentry.io/settings/account/api/auth-tokens/"
echo "  - Vercel: https://vercel.com/account/tokens"
echo "  - Supabase: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/settings/api"
echo ""

# Шаг 4: Проверка переменных окружения
echo "📋 ШАГ 4: Проверка переменных окружения"
echo "--------------------------------------"
echo "Создание скрипта для проверки переменных..."
echo ""
echo "Для проверки переменных в Vercel:"
echo "  https://vercel.com/dashboard → Ваш проект → Settings → Environment Variables"
echo ""
echo "Для проверки переменных в Railway:"
echo "  https://railway.app → Ваш проект → Worker Service → Variables"
echo ""
echo "Запуск проверки локально..."
"$PROJECT_DIR/scripts/check-all-setup.sh" | grep -A 10 "Переменные окружения"
echo ""

# Шаг 5: Мониторинг
echo "📋 ШАГ 5: Мониторинг"
echo "-------------------"
if command -v docker &> /dev/null; then
  echo -e "${GREEN}✅ Docker найден${NC}"
  echo ""
  if [ -f "$PROJECT_DIR/scripts/start-monitoring-local.sh" ]; then
    echo "Скрипт для локального мониторинга найден."
    read -p "Запустить локальный мониторинг (Prometheus/Grafana)? (y/n): " start_monitoring
    
    if [ "$start_monitoring" = "y" ]; then
      "$PROJECT_DIR/scripts/start-monitoring-local.sh"
    else
      echo -e "${YELLOW}⏭️  Пропущено (можно запустить позже: ./scripts/start-monitoring-local.sh)${NC}"
    fi
  else
    echo -e "${YELLOW}⚠️  Скрипт start-monitoring-local.sh не найден${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Docker не установлен${NC}"
  echo "Для локального мониторинга установите Docker"
fi
echo ""

# Итоговый отчет
echo "📊 ИТОГОВЫЙ ОТЧЕТ"
echo "=================="
echo ""
echo "✅ Выполнено:"
echo "  - Проверка всех настроек"
echo "  - Инструкции для ручных действий"
echo ""
echo "⏳ Требует ручных действий:"
echo "  - Ротация секретов (через браузер)"
echo "  - Проверка переменных окружения в Vercel/Railway"
echo ""
echo "📚 Документация:"
echo "  - Ротация секретов: docs/ROTATE_SECRETS.md"
echo "  - Настройка бэкапов: docs/AUTOMATIC_BACKUPS_SETUP.md"
echo "  - Мониторинг: docs/PROMETHEUS_GRAFANA_DEPLOYMENT.md"
echo ""

