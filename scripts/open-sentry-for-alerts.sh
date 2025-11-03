#!/bin/bash

# Открыть Sentry Dashboard для настройки алертов
# Использование: bash scripts/open-sentry-for-alerts.sh

set -e

SENTRY_EMAIL="admin@worldwideservice.eu"
SENTRY_PASSWORD="l1tmw6u977c9!Q"
SENTRY_ORG="world-wide-services"
SENTRY_PROJECT="javascript-nextjs"
ALERT_EMAIL="admin@worldwideservices.eu"

echo "🔔 ОТКРЫТИЕ SENTRY ДЛЯ НАСТРОЙКИ АЛЕРТОВ"
echo "=========================================="
echo ""
echo "Email: $SENTRY_EMAIL"
echo "Организация: $SENTRY_ORG"
echo "Проект: $SENTRY_PROJECT"
echo ""

# Открыть страницу логина
LOGIN_URL="https://sentry.io/auth/login/"
ALERTS_URL="https://sentry.io/organizations/$SENTRY_ORG/projects/$SENTRY_PROJECT/alerts/rules/"

echo "🌐 Открытие браузера..."
echo ""

# Попробовать разные команды для открытия браузера
if command -v open &> /dev/null; then
  # macOS
  open "$LOGIN_URL"
  echo "✅ Браузер открыт на странице входа"
elif command -v xdg-open &> /dev/null; then
  # Linux
  xdg-open "$LOGIN_URL"
  echo "✅ Браузер открыт на странице входа"
else
  echo "⚠️  Не удалось автоматически открыть браузер"
  echo "   Откройте вручную: $LOGIN_URL"
fi

echo ""
echo "📋 ШАГИ ДЛЯ НАСТРОЙКИ:"
echo ""
echo "1. Войдите в Sentry:"
echo "   Email: $SENTRY_EMAIL"
echo "   Password: $SENTRY_PASSWORD"
echo ""
echo "2. После входа перейдите к алертам:"
echo "   $ALERTS_URL"
echo ""
echo "3. Создайте 4 алерта (см. SENTRY_FINAL_CHECKLIST.md):"
echo "   - Critical Errors - High Error Rate"
echo "   - Health Check Failed"
echo "   - Slow API Requests"
echo "   - New Error Types Detected"
echo ""
echo "4. Email для всех алертов: $ALERT_EMAIL"
echo ""
echo "✅ После создания всех алертов, запустите проверку:"
echo "   bash scripts/verify-sentry-complete.sh"
echo ""

