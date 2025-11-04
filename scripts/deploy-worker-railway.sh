#!/bin/bash

# Скрипт для деплоя Worker на Railway

set -e

echo "🚀 Деплой Worker на Railway..."
echo ""

# Проверка Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI не установлен"
    echo ""
    echo "📦 Установка Railway CLI..."
    npm install -g @railway/cli
    echo ""
fi

# Проверка авторизации
echo "🔐 Проверка авторизации Railway..."
if ! railway whoami &> /dev/null; then
    echo "⚠️  Не авторизован в Railway"
    echo "🔑 Войдите в Railway..."
    railway login
    echo ""
fi

# Переход в директорию Worker
cd "$(dirname "$0")/../services/worker"

echo "📦 Деплой Worker..."
echo ""

# Деплой
railway up

echo ""
echo "✅ Деплой запущен!"
echo ""
echo "📊 Проверка статуса..."
echo "Подождите 1-2 минуты и проверьте:"
echo "  ./scripts/check-worker-health.sh"
echo ""

