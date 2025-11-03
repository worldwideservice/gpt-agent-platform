#!/bin/bash

# Автоматическая настройка Sentry DSN в Vercel
# Использование: bash scripts/auto-setup-vercel-sentry.sh <sentry-dsn>

set -e

SENTRY_DSN="${1:-}"
VERCEL_TOKEN="${VERCEL_TOKEN:-g5wBHt7TxDknUEIHchTJUHEK}"
VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv}"
VERCEL_ORG_ID="${VERCEL_ORG_ID:-team_eYhYqLCO9dqINAo5SeQGntIH}"

if [ -z "$SENTRY_DSN" ]; then
  echo "⚠️  Использование: bash scripts/auto-setup-vercel-sentry.sh <sentry-dsn>"
  echo ""
  echo "📋 Пример:"
  echo "   bash scripts/auto-setup-vercel-sentry.sh https://xxx@sentry.io/xxx"
  echo ""
  exit 1
fi

echo "🔔 Настройка Sentry DSN в Vercel"
echo "================================="
echo ""
echo "Project ID: $VERCEL_PROJECT_ID"
echo "DSN: ${SENTRY_DSN:0:30}..."
echo ""

# Проверка Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "📦 Установка Vercel CLI..."
  npm install -g vercel@latest || {
    echo "❌ Не удалось установить Vercel CLI"
    exit 1
  }
fi

echo "✅ Vercel CLI установлен"
echo ""

# Авторизация (если нужно)
if ! vercel whoami &> /dev/null; then
  echo "🔑 Авторизация в Vercel..."
  echo "$VERCEL_TOKEN" | vercel login --token
fi

echo "✅ Авторизован в Vercel"
echo ""

# Добавление переменных окружения
echo "📝 Добавление переменных окружения..."

# SENTRY_DSN
echo "   → SENTRY_DSN"
if echo "$SENTRY_DSN" | vercel env add SENTRY_DSN production --token "$VERCEL_TOKEN" 2>&1 | grep -q "Created\|already exists"; then
  echo "   ✅ SENTRY_DSN добавлен для production"
else
  echo "   ⚠️  Попытка добавления SENTRY_DSN (может уже существовать)"
fi

# Также для preview и development
echo "$SENTRY_DSN" | vercel env add SENTRY_DSN preview --token "$VERCEL_TOKEN" 2>&1 | grep -q "Created\|already exists" && echo "   ✅ SENTRY_DSN добавлен для preview" || true
echo "$SENTRY_DSN" | vercel env add SENTRY_DSN development --token "$VERCEL_TOKEN" 2>&1 | grep -q "Created\|already exists" && echo "   ✅ SENTRY_DSN добавлен для development" || true

# NEXT_PUBLIC_SENTRY_DSN
echo "   → NEXT_PUBLIC_SENTRY_DSN"
echo "$SENTRY_DSN" | vercel env add NEXT_PUBLIC_SENTRY_DSN production --token "$VERCEL_TOKEN" 2>&1 | grep -q "Created\|already exists" && echo "   ✅ NEXT_PUBLIC_SENTRY_DSN добавлен для production" || echo "   ⚠️  Попытка добавления"
echo "$SENTRY_DSN" | vercel env add NEXT_PUBLIC_SENTRY_DSN preview --token "$VERCEL_TOKEN" 2>&1 | grep -q "Created\|already exists" && echo "   ✅ NEXT_PUBLIC_SENTRY_DSN добавлен для preview" || true
echo "$SENTRY_DSN" | vercel env add NEXT_PUBLIC_SENTRY_DSN development --token "$VERCEL_TOKEN" 2>&1 | grep -q "Created\|already exists" && echo "   ✅ NEXT_PUBLIC_SENTRY_DSN добавлен для development" || true

echo ""
echo "✅ Переменные окружения добавлены!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Проверьте в Vercel Dashboard: Settings → Environment Variables"
echo "2. Перезапустите деплой (если нужно)"
echo "3. Проверьте что ошибки отправляются в Sentry"
echo ""


