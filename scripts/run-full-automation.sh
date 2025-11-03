#!/bin/bash

# Полная автоматизация DevOps IMMEDIATE этапа
# Использование: bash scripts/run-full-automation.sh [sentry-dsn]

set -e

SENTRY_DSN="${1:-}"

echo "🚀 Полная автоматизация DevOps IMMEDIATE этапа"
echo "=============================================="
echo ""

# Проверка готовности
echo "🔍 Проверка готовности..."
bash scripts/check-worker-readiness.sh
echo ""

# Шаг 1: Sentry DSN
if [ -z "$SENTRY_DSN" ]; then
  echo "⚠️  Sentry DSN не предоставлен"
  echo ""
  echo "📋 Получите DSN:"
  echo "1. Откройте: https://sentry.io"
  echo "2. Settings → Client Keys (DSN) → Скопируйте"
  echo "3. Запустите снова:"
  echo "   bash scripts/run-full-automation.sh <ваш-dsn>"
  echo ""
  echo "Или добавьте вручную через скрипт:"
  echo "   bash scripts/auto-setup-vercel-sentry.sh <dsn>"
  echo ""
else
  echo "✅ Sentry DSN предоставлен"
  echo ""
  echo "🔔 Настройка Sentry в Vercel..."
  bash scripts/auto-setup-vercel-sentry.sh "$SENTRY_DSN"
  echo ""
fi

# Шаг 2: Railway
echo "🚂 Деплой Worker на Railway"
echo "============================"
echo ""
echo "⚠️  Railway требует Dashboard для деплоя"
echo ""
echo "📋 Выполните следующие шаги:"
echo "1. Откройте: https://railway.app"
echo "2. New Project → Deploy from GitHub repo"
echo "3. Root Directory: services/worker"
echo "4. Добавьте переменные из: docs/RAILWAY_DEPLOY_NOW.md"
echo ""
echo "📖 Детальная инструкция: docs/WORKER_DEPLOY_STEP_BY_STEP.md"
echo ""

# Итоги
echo "✅ Автоматизация завершена!"
echo ""
echo "📋 Что сделано:"
if [ -n "$SENTRY_DSN" ]; then
  echo "  ✅ Sentry DSN добавлен в Vercel"
fi
echo "  ✅ Проверка готовности Worker выполнена"
echo ""
echo "📋 Что осталось сделать:"
echo "  ⏳ Задеплоить Worker на Railway (15 мин)"
echo "  ⏳ Создать Sentry алерты (15 мин)"
echo ""
echo "📖 Инструкции:"
echo "  - Worker: docs/WORKER_DEPLOY_STEP_BY_STEP.md"
echo "  - Alerts: docs/SENTRY_ALERTS.md"
echo ""


