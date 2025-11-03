#!/bin/bash

# Ожидание создания алертов и проверка статуса
# Использование: bash scripts/wait-and-check-sentry.sh

set -e

SENTRY_TOKEN="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"
SENTRY_ORG="world-wide-services"
SENTRY_PROJECT="javascript-nextjs"

echo "🔍 ОЖИДАНИЕ И ПРОВЕРКА SENTRY АЛЕРТОВ"
echo "======================================="
echo ""
echo "Проверяю каждые 10 секунд..."
echo "Нажмите Ctrl+C для остановки"
echo ""

CHECK_COUNT=0
MAX_CHECKS=30

while [ $CHECK_COUNT -lt $MAX_CHECKS ]; do
  CHECK_COUNT=$((CHECK_COUNT + 1))
  
  echo "[$CHECK_COUNT/$MAX_CHECKS] Проверка алертов..."
  
  # Проверка алертов
  ALERTS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
    "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/alert-rules/" 2>&1)
  
  ALERT_COUNT=0
  if echo "$ALERTS" | grep -q '"id"'; then
    ALERT_COUNT=$(echo "$ALERTS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(len(data) if isinstance(data, list) else 0)
except:
    print(0)
" 2>/dev/null || echo "0")
    
    if [ "$ALERT_COUNT" -ge 4 ] 2>/dev/null; then
      echo ""
      echo "════════════════════════════════════════════════"
      echo "🎉 ВСЕ АЛЕРТЫ СОЗДАНЫ!"
      echo "════════════════════════════════════════════════"
      echo ""
      echo "✅ Найдено алертов: $ALERT_COUNT"
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
      
      echo ""
      echo "✅ SENTRY ПОЛНОСТЬЮ НАСТРОЕН (100%)!"
      exit 0
    else
      echo "   ⏳ Найдено алертов: $ALERT_COUNT/4 (ожидаю создания всех...)"
    fi
  else
    echo "   ⏳ Алерты еще не созданы..."
  fi
  
  sleep 10
done

echo ""
echo "⚠️  Достигнуто максимальное количество проверок"
echo "   Проверьте алерты вручную:"
echo "   https://sentry.io/organizations/$SENTRY_ORG/projects/$SENTRY_PROJECT/alerts/rules/"
echo ""

