#!/bin/bash

# Скрипт для автоматического деплоя Worker на Railway
# Использование: bash scripts/deploy-worker-railway.sh

set -e

RAILWAY_TOKEN="${RAILWAY_TOKEN:-b2d35fc1-afcf-4589-8b24-da667437cf26}"

echo "🚀 Деплой Worker сервиса на Railway"
echo "===================================="
echo ""

# Проверка Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI не установлен"
    echo "📦 Устанавливаем..."
    npm install -g @railway/cli
fi

# Установка токена
export RAILWAY_TOKEN="$RAILWAY_TOKEN"
echo "✅ Railway токен установлен"

# Переход в директорию worker
cd "$(dirname "$0")/../services/worker" || exit 1

echo ""
echo "📁 Рабочая директория: $(pwd)"
echo ""

# Проверка переменных окружения
echo "⚠️  ВНИМАНИЕ: Нужно добавить переменные окружения в Railway Dashboard:"
echo ""
echo "Обязательные переменные:"
echo "  - REDIS_URL"
echo "  - SUPABASE_URL"
echo "  - SUPABASE_SERVICE_ROLE_KEY"
echo "  - ENCRYPTION_KEY"
echo "  - OPENROUTER_API_KEY (опционально)"
echo "  - JOB_QUEUE_NAME (по умолчанию: agent-jobs)"
echo "  - JOB_CONCURRENCY (по умолчанию: 5)"
echo ""

read -p "Нажмите Enter после того как добавите переменные в Railway Dashboard..."

# Инициализация проекта (если еще не инициализирован)
if [ ! -f ".railway/config.json" ]; then
    echo "🔧 Инициализация Railway проекта..."
    railway init --yes || railway link
fi

# Деплой
echo ""
echo "🚀 Запуск деплоя..."
railway up

echo ""
echo "✅ Деплой запущен!"
echo ""
echo "🔍 Проверка деплоя:"
echo "  railway status"
echo "  railway logs"
echo ""
echo "🌐 Health check:"
echo "  railway domain (получите URL и проверьте /health)"
echo ""

