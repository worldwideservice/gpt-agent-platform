#!/bin/bash

# Автоматическая настройка Sentry с персональным токеном
# Использование: bash scripts/auto-sentry-complete.sh

set -e

SENTRY_TOKEN="${SENTRY_TOKEN:-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}"
ORG_SLUG="world-wide-services"

echo "🔔 АВТОМАТИЧЕСКАЯ НАСТРОЙКА SENTRY"
echo "==================================="
echo ""

# Проверка Vercel
if ! vercel whoami &> /dev/null; then
  echo "❌ Vercel не авторизован"
  exit 1
fi

echo "✅ Vercel авторизован"
echo ""

# Получение списка организаций
echo "🔍 Получение организаций..."
ORGS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
  "https://sentry.io/api/0/organizations/" 2>&1)

if echo "$ORGS" | grep -q '"slug"'; then
  echo "✅ Организации получены"
  
  # Ищем нужную организацию
  ORG_FOUND=$(echo "$ORGS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for org in data:
        if org.get('slug') == '$ORG_SLUG':
            print(org.get('slug'))
            break
except:
    pass
" 2>/dev/null || echo "")
  
  if [ -z "$ORG_FOUND" ]; then
    # Используем первую доступную
    ORG_SLUG=$(echo "$ORGS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data and len(data) > 0:
        print(data[0]['slug'])
except:
    print('')
" 2>/dev/null || echo "$ORG_SLUG")
    echo "⚠️  Используем организацию: $ORG_SLUG"
  else
    echo "✅ Организация найдена: $ORG_SLUG"
  fi
else
  echo "⚠️  Не удалось получить организации через API"
  echo "Ответ:"
  echo "$ORGS" | head -5
  echo ""
  echo "Используем: $ORG_SLUG"
fi

echo ""

# Получение проектов
echo "🔍 Получение проектов организации: $ORG_SLUG"
PROJECTS=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
  "https://sentry.io/api/0/organizations/$ORG_SLUG/projects/" 2>&1)

if echo "$PROJECTS" | grep -q '"slug"'; then
  echo "✅ Проекты получены"
  
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
    if data and len(data) > 0:
        dsn_obj = data[0].get('dsn', {})
        if isinstance(dsn_obj, dict):
            print(dsn_obj.get('public', dsn_obj.get('dsn', '')))
        elif isinstance(dsn_obj, str):
            print(dsn_obj)
        else:
            print('')
except Exception as e:
    print('')
" 2>/dev/null || echo "")
      
      if [ -n "$DSN" ] && [ "$DSN" != "None" ]; then
        echo "✅ DSN получен: ${DSN:0:60}..."
        echo ""
        
        # Автоматически добавляем в Vercel
        echo "🔔 Автоматическое добавление в Vercel..."
        bash scripts/auto-setup-vercel-sentry.sh "$DSN" 2>&1
        
        echo ""
        echo "════════════════════════════════════════════════"
        echo "✅ SENTRY НАСТРОЕН АВТОМАТИЧЕСКИ!"
        echo "════════════════════════════════════════════════"
        echo ""
        echo "📋 Информация:"
        echo "   Организация: $ORG_SLUG"
        echo "   Проект: $PROJECT_SLUG"
        echo "   DSN: $DSN"
        echo ""
        echo "✅ DSN добавлен в Vercel для:"
        echo "   - Production"
        echo "   - Preview"
        echo "   - Development"
        echo ""
        echo "📋 Следующие шаги:"
        echo "   1. Проверьте в Vercel Dashboard что переменные добавлены"
        echo "   2. Создайте алерты: docs/SENTRY_ALERTS.md"
        echo ""
        exit 0
      else
        echo "⚠️  DSN не найден в ответе"
        echo "Ответ API:"
        echo "$KEYS" | python3 -m json.tool 2>/dev/null | head -20 || echo "$KEYS" | head -10
      fi
    else
      echo "⚠️  Не удалось получить ключи проекта"
      echo "Ответ:"
      echo "$KEYS" | head -10
    fi
  else
    echo "⚠️  Проекты не найдены"
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
fi

echo ""
echo "📋 Если автоматизация не сработала:"
echo "   1. Откройте: https://sentry.io/organizations/$ORG_SLUG/projects/"
echo "   2. Settings → Client Keys (DSN) → Копируйте DSN"
echo "   3. Запустите: bash scripts/complete-sentry-setup.sh <dsn>"
echo ""


