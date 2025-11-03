#!/bin/bash

# Попытка деплоя Worker на Railway используя токен
# Использование: bash scripts/railway-deploy-with-token.sh

set -e

RAILWAY_TOKEN="${RAILWAY_TOKEN:-b2d35fc1-afcf-4589-8b24-da667437cf26}"

echo "🚂 Попытка деплоя Worker на Railway"
echo "===================================="
echo ""

cd "$(dirname "$0")/../services/worker"

echo "📂 Директория: $(pwd)"
echo ""

# Проверка файлов
if [ ! -f "Dockerfile" ]; then
  echo "❌ Dockerfile не найден!"
  exit 1
fi

if [ ! -f "package.json" ]; then
  echo "❌ package.json не найден!"
  exit 1
fi

echo "✅ Файлы Worker присутствуют"
echo ""

# Экспорт токена
export RAILWAY_TOKEN="$RAILWAY_TOKEN"

# Проверка Railway CLI
if ! command -v railway &> /dev/null; then
  echo "📦 Установка Railway CLI..."
  npm install -g @railway/cli || {
    echo "❌ Не удалось установить Railway CLI"
    exit 1
  }
fi

echo "✅ Railway CLI установлен"
echo ""

# Попытка использования токена напрямую
echo "🔑 Попытка авторизации с токеном..."

# Railway CLI не поддерживает прямую авторизацию через токен в неинтерактивном режиме
# Но можем попробовать через переменную окружения
if railway login --help 2>&1 | grep -q "token"; then
  railway login --token "$RAILWAY_TOKEN" 2>&1 || echo "⚠️  Требуется интерактивная авторизация"
else
  echo "⚠️  Railway CLI требует интерактивную авторизацию"
  echo ""
  echo "📋 Для деплоя используйте Railway Dashboard:"
  echo "1. Откройте: https://railway.app"
  echo "2. New Project → Deploy from GitHub repo"
  echo "3. Root Directory: services/worker"
  echo "4. Добавьте переменные из docs/RAILWAY_DEPLOY_NOW.md"
  echo ""
  echo "📖 Детальная инструкция: docs/WORKER_DEPLOY_STEP_BY_STEP.md"
  exit 0
fi

# Если авторизация прошла, попробуем деплой
if railway whoami &> /dev/null; then
  echo "✅ Авторизован в Railway"
  echo ""
  echo "🚀 Попытка деплоя..."
  
  # Проверка переменных окружения
  REQUIRED_VARS=("REDIS_URL" "SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY" "ENCRYPTION_KEY")
  MISSING=()
  
  for var in "${REQUIRED_VARS[@]}"; do
    if ! railway variables get "$var" &> /dev/null; then
      MISSING+=("$var")
    fi
  done
  
  if [ ${#MISSING[@]} -gt 0 ]; then
    echo "⚠️  Отсутствуют переменные окружения:"
    for var in "${MISSING[@]}"; do
      echo "   - $var"
    done
    echo ""
    echo "📋 Добавьте переменные из docs/RAILWAY_DEPLOY_NOW.md"
    exit 1
  fi
  
  echo "✅ Все переменные настроены"
  echo ""
  echo "🚀 Запуск деплоя..."
  railway up || {
    echo "❌ Ошибка при деплое"
    echo "Проверьте логи: railway logs"
    exit 1
  }
  
  echo ""
  echo "✅ Деплой завершен!"
else
  echo ""
  echo "📋 Для деплоя используйте Railway Dashboard (см. выше)"
fi

