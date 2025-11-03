#!/bin/bash

# Скрипт для настройки Sentry с использованием токена
# Использование: bash scripts/setup-sentry.sh

set -e

SENTRY_TOKEN="${SENTRY_TOKEN:-82a4d7aaaf2d11f092a62ea79c10f815}"
SENTRY_ORG="${SENTRY_ORG:-your-org}"
SENTRY_PROJECT="${SENTRY_PROJECT:-gpt-agent-platform}"

echo "🔔 Настройка Sentry"
echo "===================="
echo ""
echo "Токен: ${SENTRY_TOKEN:0:10}..."
echo "Организация: $SENTRY_ORG"
echo "Проект: $SENTRY_PROJECT"
echo ""

# Проверка Sentry CLI
if ! command -v sentry-cli &> /dev/null; then
    echo "📦 Установка Sentry CLI..."
    npm install -g @sentry/cli || {
        echo "❌ Не удалось установить Sentry CLI"
        echo "Установите вручную: npm install -g @sentry/cli"
        exit 1
    }
fi

echo "✅ Sentry CLI установлен"

# Авторизация
export SENTRY_AUTH_TOKEN="$SENTRY_TOKEN"
export SENTRY_ORG="$SENTRY_ORG"

echo ""
echo "🔑 Авторизация в Sentry..."
sentry-cli login --token "$SENTRY_TOKEN" 2>&1 || echo "⚠️  Авторизация через токен может требовать дополнительной настройки"

# Получение DSN
echo ""
echo "📋 Инструкции для получения DSN:"
echo ""
echo "1. Откройте: https://sentry.io/settings/$SENTRY_ORG/projects/$SENTRY_PROJECT/keys/"
echo "2. Скопируйте DSN (Client Keys - DSN)"
echo "3. Добавьте в Vercel Environment Variables:"
echo "   - SENTRY_DSN=<ваш-dsn>"
echo "   - NEXT_PUBLIC_SENTRY_DSN=<ваш-dsn>"
echo ""
echo "Или получите через API:"
echo "curl -H \"Authorization: Bearer $SENTRY_TOKEN\" \\"
echo "  https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/keys/"
echo ""

echo "✅ Sentry токен сохранен!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Получите DSN из Sentry Dashboard"
echo "2. Добавьте DSN в Vercel Environment Variables"
echo "3. Настройте алерты (см. docs/SENTRY_ALERTS.md)"


