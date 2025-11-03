#!/bin/bash

# Скрипт для проверки готовности Worker к деплою
# Использование: bash scripts/check-worker-readiness.sh

set -e

echo "🔍 Проверка готовности Worker к деплою"
echo "====================================="
echo ""

# Проверка структуры файлов
echo "📁 Проверка файлов Worker..."

REQUIRED_FILES=(
  "services/worker/Dockerfile"
  "services/worker/package.json"
  "services/worker/railway.json"
  "services/worker/src/index.ts"
  "services/worker/src/health.ts"
)

MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file - ОТСУТСТВУЕТ"
    MISSING_FILES+=("$file")
  fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
  echo ""
  echo "❌ Отсутствуют необходимые файлы!"
  exit 1
fi

echo ""
echo "✅ Все необходимые файлы присутствуют"
echo ""

# Проверка переменных окружения
echo "🔐 Проверка переменных окружения..."
echo ""

REQUIRED_VARS=(
  "REDIS_URL"
  "SUPABASE_URL"
  "SUPABASE_SERVICE_ROLE_KEY"
  "ENCRYPTION_KEY"
  "OPENROUTER_API_KEY"
)

echo "Необходимые переменные для Worker:"
for var in "${REQUIRED_VARS[@]}"; do
  echo "  - $var"
done

echo ""
echo "📋 Эти переменные нужно добавить в Railway Dashboard:"
echo "   Settings → Variables"
echo ""
echo "📖 Детальные инструкции: docs/RAILWAY_DEPLOY_NOW.md"
echo ""

# Проверка Dockerfile
echo "🐳 Проверка Dockerfile..."
if grep -q "HEALTHCHECK" services/worker/Dockerfile; then
  echo "  ✅ Health check настроен"
else
  echo "  ⚠️  Health check не найден в Dockerfile"
fi

if grep -q "PORT" services/worker/Dockerfile || grep -q "3001" services/worker/Dockerfile; then
  echo "  ✅ Порт настроен"
else
  echo "  ⚠️  Порт не указан явно"
fi

echo ""

# Проверка package.json
echo "📦 Проверка package.json..."
if [ -f "services/worker/package.json" ]; then
  if grep -q '"build"' services/worker/package.json; then
    echo "  ✅ Build script найден"
  else
    echo "  ⚠️  Build script не найден"
  fi
  
  if grep -q '"start"' services/worker/package.json; then
    echo "  ✅ Start script найден"
  else
    echo "  ⚠️  Start script не найден"
  fi
fi

echo ""
echo "✅ Проверка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Откройте Railway Dashboard: https://railway.app"
echo "2. Следуйте инструкциям: docs/QUICK_START_DEVOPS.md"
echo "3. Добавьте переменные окружения из: docs/RAILWAY_DEPLOY_NOW.md"
echo ""


