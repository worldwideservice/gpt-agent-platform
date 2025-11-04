#!/bin/bash

# Автоматизированный скрипт для деплоя Worker на Railway
# Использование: bash scripts/deploy-worker-railway-auto.sh

set -e

RAILWAY_TOKEN="${RAILWAY_TOKEN:?RAILWAY_TOKEN is required}"

echo "🚀 Автоматический деплой Worker на Railway"
echo "=========================================="
echo ""

# Проверка Railway CLI
if ! command -v railway &> /dev/null; then
  echo "📦 Установка Railway CLI..."
  npm install -g @railway/cli || {
    echo "❌ Не удалось установить Railway CLI"
    echo "Установите вручную: npm install -g @railway/cli"
    exit 1
  }
fi

echo "✅ Railway CLI установлен"
echo ""

# Переходим в директорию worker
cd "$(dirname "$0")/../services/worker"

echo "📂 Текущая директория: $(pwd)"
echo ""

# Авторизация
export RAILWAY_TOKEN="$RAILWAY_TOKEN"
echo "🔑 Авторизация в Railway..."

if ! railway whoami &> /dev/null; then
  echo "⚠️  Требуется интерактивная авторизация"
  echo "Выполните: railway login"
  echo "Или используйте Railway Dashboard для деплоя"
  echo ""
  echo "📋 Инструкции для Dashboard деплоя:"
  echo "1. Откройте: https://railway.app"
  echo "2. New Project → Deploy from GitHub repo"
  echo "3. Root Directory: services/worker"
  echo "4. Добавьте переменные окружения (см. docs/RAILWAY_DEPLOY_NOW.md)"
  exit 1
fi

echo "✅ Авторизован в Railway"
echo ""

# Проверка инициализации проекта
if [ ! -f ".railway/railway.json" ]; then
  echo "📋 Инициализация Railway проекта..."
  echo "⚠️  Требуется интерактивная инициализация"
  echo "Выполните: railway init"
  echo ""
  echo "Или используйте Dashboard деплой (рекомендуется)"
  exit 1
fi

echo "✅ Railway проект инициализирован"
echo ""

# Проверка переменных окружения
echo "🔍 Проверка переменных окружения..."
echo ""

REQUIRED_VARS=("REDIS_URL" "SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY" "ENCRYPTION_KEY")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
  if ! railway variables get "$var" &> /dev/null; then
    MISSING_VARS+=("$var")
  fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
  echo "⚠️  Отсутствуют переменные окружения:"
  for var in "${MISSING_VARS[@]}"; do
    echo "   - $var"
  done
  echo ""
  echo "📝 Добавьте переменные через:"
  echo "   railway variables set KEY=\"value\""
  echo ""
  echo "Или через Railway Dashboard: Settings → Variables"
  echo ""
  echo "📋 Список необходимых переменных см. в docs/RAILWAY_DEPLOY_NOW.md"
  exit 1
fi

echo "✅ Все обязательные переменные настроены"
echo ""

# Деплой
echo "🚀 Запуск деплоя..."
railway up || {
  echo "❌ Ошибка при деплое"
  echo "Проверьте логи: railway logs"
  exit 1
}

echo ""
echo "✅ Деплой запущен!"
echo ""
echo "🔍 Проверка статуса:"
railway status
echo ""
echo "📋 Полезные команды:"
echo "   railway logs        - просмотр логов"
echo "   railway domain      - получить URL деплоя"
echo "   railway open        - открыть проект в браузере"
echo ""

