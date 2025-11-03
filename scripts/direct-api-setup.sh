#!/bin/bash

# Прямая настройка через API - максимальная автоматизация
set -e

echo "🎯 Прямая настройка через API"
echo "=============================="
echo ""

VERCEL_TOKEN="${VERCEL_TOKEN:-g5wBHt7TxDknUEIHchTJUHEK}"
VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv}"
VERCEL_ORG_ID="${VERCEL_ORG_ID:-team_eYhYqLCO9dqINAo5SeQGntIH}"

# Попытка получить Sentry DSN через API
echo "🔍 Попытка получить Sentry DSN..."
SENTRY_TOKEN="82a4d7aaaf2d11f092a62ea79c10f815"

# Пробуем разные варианты получения проекта
ORG_SLUG=""
PROJECT_SLUG=""
DSN=""

# Попробуем список организаций
echo "Получение списка организаций..."
ORGS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" "https://sentry.io/api/0/organizations/" 2>&1)

if echo "$ORGS" | grep -q '"slug"'; then
  ORG_SLUG=$(echo "$ORGS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['slug'] if data else '')" 2>/dev/null || echo "")
  
  if [ -n "$ORG_SLUG" ]; then
    echo "✅ Организация найдена: $ORG_SLUG"
    
    # Получаем проекты
    PROJECTS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" "https://sentry.io/api/0/organizations/$ORG_SLUG/projects/")
    
    if echo "$PROJECTS" | grep -q '"slug"'; then
      PROJECT_SLUG=$(echo "$PROJECTS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['slug'] if data else '')" 2>/dev/null || echo "")
      
      if [ -n "$PROJECT_SLUG" ]; then
        echo "✅ Проект найден: $PROJECT_SLUG"
        
        # Получаем DSN
        KEYS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" "https://sentry.io/api/0/projects/$ORG_SLUG/$PROJECT_SLUG/keys/")
        
        if echo "$KEYS" | grep -q '"dsn"'; then
          DSN=$(echo "$KEYS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['dsn']['public'] if data and len(data) > 0 and 'dsn' in data[0] else '')" 2>/dev/null || echo "")
          
          if [ -n "$DSN" ] && [ "$DSN" != "None" ]; then
            echo "✅ DSN получен: ${DSN:0:40}..."
            
            # Автоматически добавляем в Vercel
            echo ""
            echo "🔔 Добавление в Vercel..."
            bash scripts/auto-setup-vercel-sentry.sh "$DSN" 2>&1
            
            echo ""
            echo "✅ Sentry настроен автоматически!"
          else
            echo "⚠️  DSN не найден в ответе API"
          fi
        else
          echo "⚠️  Не удалось получить ключи проекта"
        fi
      else
        echo "⚠️  Проект не найден, возможно нужно создать через Dashboard"
      fi
    else
      echo "⚠️  Проекты не найдены"
    fi
  else
    echo "⚠️  Организация не найдена"
  fi
else
  echo "⚠️  Токен невалидный или требуется авторизация через Dashboard"
fi

echo ""
echo "📋 Если автоматизация не сработала:"
echo "   1. Откройте: https://sentry.io"
echo "   2. Settings → Client Keys (DSN)"
echo "   3. Запустите: bash scripts/auto-setup-vercel-sentry.sh <dsn>"


