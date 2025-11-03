#!/bin/bash

# Полная настройка Sentry - финальный скрипт
# Использование: bash scripts/complete-sentry-setup.sh [dsn]

set -e

SENTRY_TOKEN="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"
DSN="${1:-}"

echo "🔔 ПОЛНАЯ НАСТРОЙКА SENTRY"
echo "=========================="
echo ""
echo "Токен: ${SENTRY_TOKEN:0:30}..."
echo "Организация: world-wide-services"
echo ""

if [ -n "$DSN" ]; then
  echo "✅ DSN предоставлен!"
  echo ""
  echo "🔔 Автоматическое добавление в Vercel..."
  bash scripts/auto-setup-vercel-sentry.sh "$DSN" 2>&1
  
  echo ""
  echo "✅ Sentry настроен!"
  echo ""
  echo "📋 Следующие шаги:"
  echo "   1. Проверьте в Vercel Dashboard что переменные добавлены"
  echo "   2. Создайте алерты: docs/SENTRY_ALERTS.md"
  exit 0
fi

# Пробуем получить через разные методы
echo "🔍 Попытка получить DSN автоматически..."
echo ""

# Метод 1: Прямой API запрос
ORG_SLUG="world-wide-services"
echo "Метод 1: API запрос..."
PROJECTS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
  "https://sentry.io/api/0/organizations/$ORG_SLUG/projects/" 2>&1)

if echo "$PROJECTS" | grep -q '"slug"'; then
  echo "✅ Проекты найдены через API"
  PROJECT_SLUG=$(echo "$PROJECTS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data and len(data) > 0:
        print(data[0]['slug'])
except:
    pass
" 2>/dev/null)
  
  if [ -n "$PROJECT_SLUG" ]; then
    KEYS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
      "https://sentry.io/api/0/projects/$ORG_SLUG/$PROJECT_SLUG/keys/")
    
    if echo "$KEYS" | grep -q '"dsn"'; then
      DSN=$(echo "$KEYS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data and len(data) > 0:
        dsn = data[0].get('dsn', {})
        if isinstance(dsn, dict):
            print(dsn.get('public', dsn.get('dsn', '')))
        else:
            print(str(dsn))
except:
    pass
" 2>/dev/null)
      
      if [ -n "$DSN" ] && [ "$DSN" != "None" ]; then
        echo "✅ DSN получен через API!"
        echo "🔔 Добавление в Vercel..."
        bash scripts/auto-setup-vercel-sentry.sh "$DSN"
        exit 0
      fi
    fi
  fi
fi

# Метод 2: Sentry CLI
echo ""
echo "Метод 2: Sentry CLI..."
if command -v sentry-cli &> /dev/null; then
  export SENTRY_AUTH_TOKEN="$SENTRY_TOKEN"
  export SENTRY_ORG="world-wide-services"
  
  CLI_PROJECTS=$(sentry-cli projects list 2>&1 || echo "")
  if echo "$CLI_PROJECTS" | grep -q "SLUG"; then
    echo "✅ Sentry CLI работает"
    echo "$CLI_PROJECTS"
  fi
fi

# Если ничего не сработало
echo ""
echo "⚠️  Автоматическое получение DSN не удалось"
echo ""
echo "📋 Получите DSN вручную (30 секунд):"
echo ""
echo "1. Откройте: https://sentry.io/organizations/world-wide-services/projects/"
echo "2. Выберите или создайте проект"
echo "3. Settings → Client Keys (DSN) → Скопируйте DSN"
echo ""
echo "4. Затем запустите:"
echo "   bash scripts/complete-sentry-setup.sh <ваш-dsn>"
echo ""
echo "Или сразу добавьте в Vercel:"
echo "   bash scripts/auto-setup-vercel-sentry.sh <dsn>"
echo ""

