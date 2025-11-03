#!/bin/bash

# Получить Sentry DSN и автоматически добавить в Vercel
# Использование: bash scripts/get-sentry-dsn-and-setup.sh

set -e

SENTRY_TOKEN="${SENTRY_TOKEN:-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}"

echo "🔔 Получение Sentry DSN и настройка"
echo "===================================="
echo ""

# Проверка Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "📦 Установка Vercel CLI..."
  npm install -g vercel@latest || {
    echo "❌ Не удалось установить Vercel CLI"
    exit 1
  }
fi

if ! vercel whoami &> /dev/null; then
  echo "❌ Vercel не авторизован"
  exit 1
fi

echo "✅ Vercel авторизован"
echo ""

# Получение организации из токена (base64 decode)
echo "🔍 Получение информации о проекте..."
ORG_SLUG="world-wide-services"

# Пробуем получить список проектов
echo "Получение проектов организации: $ORG_SLUG"
PROJECTS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
  "https://sentry.io/api/0/organizations/$ORG_SLUG/projects/" 2>&1)

if echo "$PROJECTS" | grep -q '"slug"'; then
  echo "✅ Проекты найдены"
  
  # Извлекаем первый проект
  PROJECT_SLUG=$(echo "$PROJECTS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data and len(data) > 0:
        print(data[0]['slug'])
    else:
        print('')
except:
    print('')
" 2>/dev/null || echo "")
  
  if [ -n "$PROJECT_SLUG" ]; then
    echo "✅ Проект найден: $PROJECT_SLUG"
    echo ""
    
    # Получаем DSN
    echo "🔑 Получение DSN..."
    KEYS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
      "https://sentry.io/api/0/projects/$ORG_SLUG/$PROJECT_SLUG/keys/" 2>&1)
    
    if echo "$KEYS" | grep -q '"dsn"'; then
      DSN=$(echo "$KEYS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data and len(data) > 0 and 'dsn' in data[0]:
        if isinstance(data[0]['dsn'], dict) and 'public' in data[0]['dsn']:
            print(data[0]['dsn']['public'])
        elif isinstance(data[0]['dsn'], str):
            print(data[0]['dsn'])
        else:
            print('')
    else:
        print('')
except Exception as e:
    print('')
" 2>/dev/null || echo "")
      
      if [ -n "$DSN" ] && [ "$DSN" != "None" ]; then
        echo "✅ DSN получен: ${DSN:0:50}..."
        echo ""
        
        # Автоматически добавляем в Vercel
        echo "🔔 Добавление Sentry DSN в Vercel..."
        bash scripts/auto-setup-vercel-sentry.sh "$DSN" 2>&1
        
        echo ""
        echo "✅ Sentry полностью настроен!"
        echo ""
        echo "📋 DSN: $DSN"
        echo "📋 Проект: $ORG_SLUG/$PROJECT_SLUG"
      else
        echo "⚠️  DSN не найден в ответе"
        echo "Ответ API:"
        echo "$KEYS" | head -20
      fi
    else
      echo "⚠️  Не удалось получить ключи проекта"
      echo "Ответ:"
      echo "$KEYS" | head -10
    fi
  else
    echo "⚠️  Проект не найден"
    echo "Доступные проекты:"
    echo "$PROJECTS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for p in data[:5]:
        print(f\"  - {p.get('slug', 'unknown')}\")
except:
    pass
" 2>/dev/null || echo "$PROJECTS" | head -10
  fi
else
  echo "⚠️  Не удалось получить проекты"
  echo "Ответ API:"
  echo "$PROJECTS" | head -10
  echo ""
  echo "📋 Попробуйте получить DSN вручную:"
  echo "   https://sentry.io/organizations/$ORG_SLUG/projects/*/settings/keys/"
fi


