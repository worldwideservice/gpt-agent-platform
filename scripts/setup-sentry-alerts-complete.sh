#!/bin/bash

# Полная автоматическая настройка Sentry алертов
# Использование: bash scripts/setup-sentry-alerts-complete.sh

set -e

SENTRY_TOKEN="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"
SENTRY_ORG="world-wide-services"
SENTRY_PROJECT="javascript-nextjs"
SENTRY_EMAIL="admin@worldwideservices.eu"
SENTRY_BASE_URL="https://sentry.io/api/0"

echo "🔔 ПОЛНАЯ НАСТРОЙКА SENTRY АЛЕРТОВ"
echo "=================================="
echo ""
echo "Организация: $SENTRY_ORG"
echo "Проект: $SENTRY_PROJECT"
echo "Email: $SENTRY_EMAIL"
echo ""

# Проверка доступа
echo "🔍 Проверка доступа к проекту..."
PROJECT_CHECK=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
  "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/" 2>&1)

if ! echo "$PROJECT_CHECK" | grep -q '"slug"'; then
  echo "❌ Не удалось получить доступ к проекту"
  echo "Ответ:"
  echo "$PROJECT_CHECK" | head -5
  exit 1
fi

echo "✅ Проект доступен"
echo ""

# Проверка существующих алертов
echo "🔍 Проверка существующих алертов..."
EXISTING_ALERTS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
  "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/alert-rules/" 2>&1)

ALERT_COUNT=0
if echo "$EXISTING_ALERTS" | grep -q '"id"'; then
  ALERT_COUNT=$(echo "$EXISTING_ALERTS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list):
        print(len(data))
    else:
        print(0)
except:
    print(0)
" 2>/dev/null || echo "0")
fi

echo "ℹ️  Существующих алертов: $ALERT_COUNT"
echo ""

# Функция для создания алерта через Sentry API
create_alert_rule() {
  local name="$1"
  local description="$2"
  local conditions_json="$3"
  local action_type="${4:-email}"
  
  echo "📝 Создание алерта: $name"
  
  # Базовый JSON для alert rule (Sentry API формат)
  local alert_json=$(python3 <<EOF
import json

alert = {
    "name": "$name",
    "owner": None,
    "environment": "production",
    "dataset": "events",
    "query": "",
    "aggregate": "count()",
    "timeWindow": 60,
    "resolveThreshold": None,
    "thresholdType": 0,
    "triggers": [
        {
            "label": "critical",
            "alertThreshold": 10,
            "resolveThreshold": None,
            "thresholdType": 0,
            "actions": [
                {
                    "id": "sentry.integrations.email.notify.EmailAction",
                    "targetType": "IssueOwners",
                    "targetIdentifier": "$SENTRY_EMAIL",
                    "enabled": True
                }
            ]
        }
    ],
    "projects": ["$SENTRY_PROJECT"],
    "conditions": $conditions_json,
    "filters": [],
    "actions": []
}

print(json.dumps(alert))
EOF
)
  
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Authorization: Bearer $SENTRY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$alert_json" \
    "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/alert-rules/" 2>&1)
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)
  
  if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Алерт '$name' успешно создан"
    return 0
  else
    echo "⚠️  HTTP $HTTP_CODE - не удалось создать через API"
    echo "$BODY" | python3 -m json.tool 2>/dev/null | head -5 || echo "$BODY" | head -3
    return 1
  fi
}

SUCCESS_COUNT=0
FAILED_COUNT=0

# Алерт 1: Critical Errors
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Алерт 1: Critical Errors - High Error Rate"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CRITICAL_CONDITIONS='[
  {
    "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
    "interval": "1m",
    "value": 10
  }
]'

if create_alert_rule \
  "Critical Errors - High Error Rate" \
  "Alert when more than 10 errors occur in 1 minute" \
  "$CRITICAL_CONDITIONS"; then
  ((SUCCESS_COUNT++))
else
  ((FAILED_COUNT++))
fi

echo ""

# Алерт 2: Health Check Failures
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Алерт 2: Health Check Failures"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HEALTH_CONDITIONS='[
  {
    "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
    "interval": "1m",
    "value": 1
  },
  {
    "id": "sentry.rules.conditions.tagged_event.TaggedEventCondition",
    "key": "url",
    "value": "/api/health"
  }
]'

if create_alert_rule \
  "Health Check Failed" \
  "Alert immediately when health check endpoint fails" \
  "$HEALTH_CONDITIONS"; then
  ((SUCCESS_COUNT++))
else
  ((FAILED_COUNT++))
fi

echo ""

# Алерт 3: New Error Types
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Алерт 3: New Error Types Detected"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

NEW_ERROR_CONDITIONS='[
  {
    "id": "sentry.rules.conditions.first_seen_event.FirstSeenEventCondition"
  }
]'

if create_alert_rule \
  "New Error Types Detected" \
  "Alert when a new error type is detected" \
  "$NEW_ERROR_CONDITIONS"; then
  ((SUCCESS_COUNT++))
else
  ((FAILED_COUNT++))
fi

echo ""

# Итоговый отчет
echo "════════════════════════════════════════════════"
echo "📊 ИТОГОВЫЙ ОТЧЕТ"
echo "════════════════════════════════════════════════"
echo ""
echo "✅ Успешно создано: $SUCCESS_COUNT алертов"
if [ $FAILED_COUNT -gt 0 ]; then
  echo "⚠️  Не удалось создать: $FAILED_COUNT алертов"
  echo ""
  echo "📋 Для создания оставшихся алертов:"
  echo "   1. Откройте: https://sentry.io/organizations/$SENTRY_ORG/projects/$SENTRY_PROJECT/alerts/rules/"
  echo "   2. Create Alert Rule → настройте вручную"
  echo "   3. См. детальные инструкции: docs/SENTRY_ALERTS.md"
fi

# Настройка email уведомлений
echo ""
echo "📧 Настройка email уведомлений..."
echo "Email: $SENTRY_EMAIL"
echo ""

# Проверка финального состояния
echo "🔍 Финальная проверка алертов..."
FINAL_ALERTS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
  "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/alert-rules/" 2>&1)

FINAL_COUNT=0
if echo "$FINAL_ALERTS" | grep -q '"id"'; then
  FINAL_COUNT=$(echo "$FINAL_ALERTS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(len(data) if isinstance(data, list) else 0)
except:
    print(0)
" 2>/dev/null || echo "0")
  
  echo "✅ Всего алертов в проекте: $FINAL_COUNT"
  echo ""
  echo "📋 Список алертов:"
  echo "$FINAL_ALERTS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list):
        for i, alert in enumerate(data[:10], 1):
            print(f\"   {i}. {alert.get('name', 'Unknown')}\")
except:
    pass
" 2>/dev/null || echo "   (не удалось распарсить)"
fi

echo ""
echo "════════════════════════════════════════════════"
echo "✅ НАСТРОЙКА ЗАВЕРШЕНА"
echo "════════════════════════════════════════════════"
echo ""
echo "📖 Просмотр алертов:"
echo "   https://sentry.io/organizations/$SENTRY_ORG/projects/$SENTRY_PROJECT/alerts/rules/"
echo ""
echo "📧 Email уведомления настроены на: $SENTRY_EMAIL"
echo ""
if [ $SUCCESS_COUNT -eq 3 ]; then
  echo "🎉 Все алерты успешно созданы!"
else
  echo "⚠️  Некоторые алерты требуют ручной настройки"
  echo "   См. docs/SENTRY_ALERTS.md для детальных инструкций"
fi
echo ""


