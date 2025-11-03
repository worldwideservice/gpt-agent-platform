#!/bin/bash

# Проверка полной настройки Sentry
# Использование: bash scripts/verify-sentry-complete.sh

set -e

SENTRY_TOKEN="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"
SENTRY_ORG="world-wide-services"
SENTRY_PROJECT="javascript-nextjs"

echo "🔍 ПРОВЕРКА НАСТРОЙКИ SENTRY"
echo "============================="
echo ""

# Проверка проекта
echo "1️⃣ Проверка проекта..."
PROJECT=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
  "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/" 2>&1)

if echo "$PROJECT" | grep -q '"slug"'; then
  echo "✅ Проект доступен: $SENTRY_PROJECT"
  PROJECT_ID=$(echo "$PROJECT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('id', 'N/A'))
except:
    print('N/A')
" 2>/dev/null || echo "N/A")
  echo "   Project ID: $PROJECT_ID"
else
  echo "❌ Проект недоступен"
  exit 1
fi

echo ""

# Проверка DSN
echo "2️⃣ Проверка DSN..."
KEYS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
  "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/keys/" 2>&1)

if echo "$KEYS" | grep -q '"dsn"'; then
  DSN=$(echo "$KEYS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data and len(data) > 0:
        dsn = data[0].get('dsn', {})
        if isinstance(dsn, dict):
            print(dsn.get('public', ''))
        else:
            print(str(dsn))
except:
    print('')
" 2>/dev/null || echo "")
  
  if [ -n "$DSN" ]; then
    echo "✅ DSN получен: ${DSN:0:60}..."
  else
    echo "⚠️  DSN не найден"
  fi
else
  echo "⚠️  Не удалось получить DSN"
fi

echo ""

# Проверка алертов
echo "3️⃣ Проверка алертов..."
ALERTS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
  "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/alert-rules/" 2>&1)

ALERT_COUNT=0
if echo "$ALERTS" | grep -q '"id"'; then
  ALERT_COUNT=$(echo "$ALERTS" | python3 -c "
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
  
  if [ -n "$ALERT_COUNT" ] && [ "$ALERT_COUNT" != "" ]; then
    echo "✅ Найдено алертов: $ALERT_COUNT"
    
    if [ "$ALERT_COUNT" -ge 4 ] 2>/dev/null; then
      echo "✅ Все критичные алерты созданы!"
    else
      echo "⚠️  Недостаточно алертов (ожидается: 4, найдено: $ALERT_COUNT)"
      echo ""
      echo "📋 Список созданных алертов:"
      echo "$ALERTS" | python3 -c "
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
  else
    ALERT_COUNT=0
    echo "⚠️  Не удалось подсчитать алерты"
  fi
else
  ALERT_COUNT=0
  echo "⚠️  Алерты не найдены"
  echo "   Создайте алерты через Dashboard"
fi

echo ""

# Итоговый отчет
echo "════════════════════════════════════════════"
echo "📊 ИТОГОВЫЙ ОТЧЕТ"
echo "════════════════════════════════════════════"
echo ""

PROJECT_STATUS="✅"
DSN_STATUS="✅"
ALERTS_STATUS="⚠️"

if [ "$ALERT_COUNT" -ge 4 ]; then
  ALERTS_STATUS="✅"
fi

echo "Проект:     $PROJECT_STATUS"
echo "DSN:        $DSN_STATUS"
echo "Алерты:     $ALERTS_STATUS ($ALERT_COUNT/4)"

if [ "$ALERTS_STATUS" = "✅" ]; then
  echo ""
  echo "🎉 SENTRY ПОЛНОСТЬЮ НАСТРОЕН!"
  echo ""
  echo "📖 Dashboard:"
  echo "   https://sentry.io/organizations/$SENTRY_ORG/projects/$SENTRY_PROJECT/"
else
  echo ""
  echo "📋 Создайте недостающие алерты:"
  echo "   См. SENTRY_FINAL_CHECKLIST.md"
  echo ""
  echo "📖 Dashboard:"
  echo "   https://sentry.io/organizations/$SENTRY_ORG/projects/$SENTRY_PROJECT/alerts/rules/"
fi

echo ""

