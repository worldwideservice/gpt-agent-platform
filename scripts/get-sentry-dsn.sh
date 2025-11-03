#!/bin/bash

# Скрипт для получения Sentry DSN через API
# Использование: bash scripts/get-sentry-dsn.sh [org-slug] [project-slug]

set -e

SENTRY_TOKEN="${SENTRY_TOKEN:-82a4d7aaaf2d11f092a62ea79c10f815}"
SENTRY_ORG="${1:-}"
SENTRY_PROJECT="${2:-}"

if [ -z "$SENTRY_ORG" ] || [ -z "$SENTRY_PROJECT" ]; then
  echo "⚠️  Использование: bash scripts/get-sentry-dsn.sh <org-slug> <project-slug>"
  echo ""
  echo "📋 Альтернатива: Получите DSN через Sentry Dashboard"
  echo "1. Откройте: https://sentry.io"
  echo "2. Settings → Client Keys (DSN)"
  echo "3. Скопируйте DSN"
  echo ""
  exit 1
fi

echo "🔍 Получение Sentry DSN для проекта: $SENTRY_ORG/$SENTRY_PROJECT"
echo ""

# Получаем список ключей проекта
RESPONSE=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" \
  "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/keys/")

# Проверяем что запрос успешен
if echo "$RESPONSE" | grep -q "dsn"; then
  # Извлекаем первый DSN
  DSN=$(echo "$RESPONSE" | grep -o '"dsn":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  if [ -n "$DSN" ]; then
    echo "✅ DSN получен:"
    echo ""
    echo "$DSN"
    echo ""
    echo "📝 Добавьте в Vercel Environment Variables:"
    echo "   SENTRY_DSN=$DSN"
    echo "   NEXT_PUBLIC_SENTRY_DSN=$DSN"
  else
    echo "❌ Не удалось извлечь DSN из ответа"
    echo "Ответ API:"
    echo "$RESPONSE"
  fi
else
  echo "❌ Ошибка при получении DSN"
  echo "Проверьте:"
  echo "1. Правильность org-slug и project-slug"
  echo "2. Токен имеет права на проект"
  echo ""
  echo "Ответ API:"
  echo "$RESPONSE"
  exit 1
fi


