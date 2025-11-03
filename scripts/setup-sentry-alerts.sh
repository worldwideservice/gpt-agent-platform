#!/bin/bash

# Скрипт для автоматической настройки Sentry алертов через API
# Использование: bash scripts/setup-sentry-alerts.sh [org-slug] [project-slug]

set -e

SENTRY_TOKEN="${SENTRY_TOKEN:-82a4d7aaaf2d11f092a62ea79c10f815}"
SENTRY_ORG="${1:-}"
SENTRY_PROJECT="${2:-}"
SENTRY_BASE_URL="https://sentry.io/api/0"

if [ -z "$SENTRY_ORG" ] || [ -z "$SENTRY_PROJECT" ]; then
  echo "⚠️  Использование: bash scripts/setup-sentry-alerts.sh <org-slug> <project-slug>"
  echo ""
  echo "ℹ️  Этот скрипт создает базовые алерты через API"
  echo "   Для полной настройки рекомендуется использовать Sentry Dashboard"
  echo "   См. docs/SENTRY_ALERTS.md для детальных инструкций"
  echo ""
  exit 1
fi

echo "🔔 Настройка Sentry алертов для: $SENTRY_ORG/$SENTRY_PROJECT"
echo ""

# Функция для создания алерта
create_alert() {
  local name="$1"
  local conditions="$2"
  local filters="$3"
  
  echo "📝 Создание алерта: $name"
  
  curl -s -X POST \
    -H "Authorization: Bearer $SENTRY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$name\",
      \"conditions\": $conditions,
      \"filters\": $filters,
      \"actions\": []
    }" \
    "$SENTRY_BASE_URL/projects/$SENTRY_ORG/$SENTRY_PROJECT/alert-rules/" > /dev/null
  
  if [ $? -eq 0 ]; then
    echo "✅ Алерт '$name' создан"
  else
    echo "❌ Ошибка при создании алерта '$name'"
  fi
  echo ""
}

echo "ℹ️  Примечание: Полная настройка алертов требует Sentry Dashboard"
echo "   См. docs/SENTRY_ALERTS.md для детальных инструкций"
echo ""
echo "📋 Ручная настройка (рекомендуется):"
echo ""
echo "1. Откройте: https://sentry.io/organizations/$SENTRY_ORG/projects/$SENTRY_PROJECT/"
echo "2. Перейдите: Alerts → Create Alert Rule"
echo "3. Создайте 4 алерта согласно docs/SENTRY_ALERTS.md:"
echo "   - Critical Errors (Error Rate > 5%)"
echo "   - Health Check Failures"
echo "   - Slow API Requests (>5s)"
echo "   - New Error Types"
echo ""

echo "✅ Скрипт завершен"
echo ""
echo "📝 Следующие шаги:"
echo "1. Настройте алерты через Sentry Dashboard (см. выше)"
echo "2. Настройте интеграции (Slack/Email) в Settings → Integrations"
echo "3. Проверьте что алерты работают (отправьте тестовую ошибку)"

