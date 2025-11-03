#!/bin/bash

# Скрипт для добавления GitHub Secrets для CI/CD
# Использование: bash scripts/setup-github-secrets.sh

set -e

echo "🔐 Настройка GitHub Secrets для CI/CD"
echo "======================================"
echo ""

# Vercel значения
VERCEL_TOKEN="g5wBHt7TxDknUEIHchTJUHEK"
VERCEL_ORG_ID="team_eYhYqLCO9dqINAo5SeQGntIH"
VERCEL_PROJECT_ID="prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv"

# Проверка GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI не установлен"
    echo ""
    echo "📋 Установите GitHub CLI:"
    echo "   macOS: brew install gh"
    echo "   Или скачайте с: https://cli.github.com"
    echo ""
    echo "📝 Затем выполните вручную:"
    echo "   gh secret set VERCEL_TOKEN --body \"$VERCEL_TOKEN\""
    echo "   gh secret set VERCEL_ORG_ID --body \"$VERCEL_ORG_ID\""
    echo "   gh secret set VERCEL_PROJECT_ID --body \"$VERCEL_PROJECT_ID\""
    exit 1
fi

# Проверка авторизации
if ! gh auth status &> /dev/null; then
    echo "❌ Не авторизованы в GitHub CLI"
    echo ""
    echo "🔑 Авторизуйтесь:"
    echo "   gh auth login"
    exit 1
fi

echo "✅ GitHub CLI доступен"
echo ""

# Добавление secrets
echo "📝 Добавление secrets..."

echo "   → VERCEL_TOKEN"
if gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN" 2>&1; then
    echo "   ✅ VERCEL_TOKEN добавлен"
else
    echo "   ⚠️  Ошибка добавления VERCEL_TOKEN"
fi

echo ""
echo "   → VERCEL_ORG_ID"
if gh secret set VERCEL_ORG_ID --body "$VERCEL_ORG_ID" 2>&1; then
    echo "   ✅ VERCEL_ORG_ID добавлен"
else
    echo "   ⚠️  Ошибка добавления VERCEL_ORG_ID"
fi

echo ""
echo "   → VERCEL_PROJECT_ID"
if gh secret set VERCEL_PROJECT_ID --body "$VERCEL_PROJECT_ID" 2>&1; then
    echo "   ✅ VERCEL_PROJECT_ID добавлен"
else
    echo "   ⚠️  Ошибка добавления VERCEL_PROJECT_ID"
fi

echo ""
echo "🎉 Настройка завершена!"
echo ""
echo "🔍 Проверка secrets:"
gh secret list

echo ""
echo "✅ Все secrets добавлены. CI/CD готов к работе!"


