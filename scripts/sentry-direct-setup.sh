#!/bin/bash

# Прямая настройка Sentry используя токен
# Использование: bash scripts/sentry-direct-setup.sh [dsn]

set -e

SENTRY_TOKEN="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"
DSN="${1:-}"

echo "🔔 Настройка Sentry"
echo "==================="
echo ""

# Если DSN предоставлен, сразу добавляем в Vercel
if [ -n "$DSN" ]; then
  echo "✅ DSN предоставлен: ${DSN:0:50}..."
  echo ""
  echo "🔔 Добавление в Vercel..."
  bash scripts/auto-setup-vercel-sentry.sh "$DSN" 2>&1
  exit 0
fi

# Пробуем получить через API
ORG_SLUG="world-wide-services"
echo "🔍 Попытка получить DSN через API..."
echo "Организация: $ORG_SLUG"
echo ""

# Пробуем разные варианты получения проектов
PROJECTS_RESPONSE=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
  "https://sentry.io/api/0/organizations/$ORG_SLUG/projects/" 2>&1)

if echo "$PROJECTS_RESPONSE" | grep -q '"slug"'; then
  echo "✅ Проекты получены"
  
  # Извлекаем первый проект
  PROJECT_SLUG=$(echo "$PROJECTS_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data and len(data) > 0:
        print(data[0]['slug'])
except:
    pass
" 2>/dev/null)
  
  if [ -n "$PROJECT_SLUG" ]; then
    echo "✅ Проект: $PROJECT_SLUG"
    
    # Получаем DSN
    KEYS_RESPONSE=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
      "https://sentry.io/api/0/projects/$ORG_SLUG/$PROJECT_SLUG/keys/")
    
    if echo "$KEYS_RESPONSE" | grep -q '"dsn"'; then
      DSN=$(echo "$KEYS_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data and len(data) > 0:
        dsn_obj = data[0].get('dsn', {})
        if isinstance(dsn_obj, dict):
            print(dsn_obj.get('public', ''))
        elif isinstance(dsn_obj, str):
            print(dsn_obj)
except:
    pass
" 2>/dev/null)
      
      if [ -n "$DSN" ]; then
        echo "✅ DSN получен!"
        echo ""
        echo "🔔 Добавление в Vercel..."
        bash scripts/auto-setup-vercel-sentry.sh "$DSN"
        exit 0
      fi
    fi
  fi
fi

# Если не получилось через API
echo "⚠️  Не удалось получить DSN через API"
echo ""
echo "📋 Получите DSN вручную:"
echo "   1. Откройте: https://sentry.io/organizations/$ORG_SLUG/projects/"
echo "   2. Выберите проект"
echo "   3. Settings → Client Keys (DSN) → Копируйте DSN"
echo "   4. Затем запустите:"
echo "      bash scripts/sentry-direct-setup.sh <ваш-dsn>"
echo ""


