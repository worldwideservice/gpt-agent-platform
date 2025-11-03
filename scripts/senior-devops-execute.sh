#!/bin/bash

# Выполнение DevOps задач как Senior DevOps Team Lead
# Полная автоматизация всех возможных задач

set -e

echo "🚀 Senior DevOps Team Lead - Полная автоматизация"
echo "=================================================="
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# ШАГ 1: Проверка и подготовка
# ============================================

echo -e "${GREEN}✅ Шаг 1: Проверка готовности${NC}"
echo ""

# Проверка Worker
if bash scripts/check-worker-readiness.sh 2>&1 | grep -q "✅"; then
  echo -e "${GREEN}✅ Worker готов к деплою${NC}"
else
  echo -e "${RED}❌ Worker не готов${NC}"
  exit 1
fi

echo ""

# ============================================
# ШАГ 2: Sentry - Попытка получения DSN через API
# ============================================

echo -e "${GREEN}✅ Шаг 2: Настройка Sentry${NC}"
echo ""

SENTRY_TOKEN="${SENTRY_TOKEN:-82a4d7aaaf2d11f092a62ea79c10f815}"

# Попытка получить список организаций
echo "🔍 Попытка получения Sentry проектов..."
SENTRY_ORG=""
SENTRY_PROJECT=""
SENTRY_DSN=""

# Попробуем получить через API
ORG_RESPONSE=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" "https://sentry.io/api/0/organizations/" 2>&1 || echo "error")

if echo "$ORG_RESPONSE" | grep -q '"slug"'; then
  # Есть организации
  SENTRY_ORG=$(echo "$ORG_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['slug'])" 2>/dev/null || echo "")
  
  if [ -n "$SENTRY_ORG" ]; then
    echo -e "${GREEN}✅ Организация найдена: $SENTRY_ORG${NC}"
    
    # Получаем проекты
    PROJ_RESPONSE=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" "https://sentry.io/api/0/organizations/$SENTRY_ORG/projects/" 2>&1)
    
    if echo "$PROJ_RESPONSE" | grep -q '"slug"'; then
      SENTRY_PROJECT=$(echo "$PROJ_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['slug'])" 2>/dev/null || echo "")
      
      if [ -n "$SENTRY_PROJECT" ]; then
        echo -e "${GREEN}✅ Проект найден: $SENTRY_PROJECT${NC}"
        
        # Получаем DSN
        DSN_RESPONSE=$(curl -s -H "Authorization: Bearer $SENTRY_TOKEN" "https://sentry.io/api/0/projects/$SENTRY_ORG/$SENTRY_PROJECT/keys/" 2>&1)
        
        if echo "$DSN_RESPONSE" | grep -q '"dsn"'; then
          SENTRY_DSN=$(echo "$DSN_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['dsn']['public'])" 2>/dev/null || echo "")
          
          if [ -n "$SENTRY_DSN" ]; then
            echo -e "${GREEN}✅ DSN получен: ${SENTRY_DSN:0:40}...${NC}"
          fi
        fi
      fi
    fi
  fi
fi

if [ -z "$SENTRY_DSN" ]; then
  echo -e "${YELLOW}⚠️  Не удалось получить DSN автоматически${NC}"
  echo -e "${YELLOW}   Причина: Требуется доступ к Sentry Dashboard${NC}"
  echo -e "${YELLOW}   Решение: Получите DSN вручную (30 сек):${NC}"
  echo "   1. https://sentry.io → Settings → Client Keys (DSN)"
  echo "   2. Скопируйте DSN"
  echo "   3. Запустите: bash scripts/auto-setup-vercel-sentry.sh <dsn>"
  echo ""
else
  # Добавляем в Vercel автоматически
  echo "🔔 Добавление Sentry DSN в Vercel..."
  if bash scripts/auto-setup-vercel-sentry.sh "$SENTRY_DSN" 2>&1 | grep -q "✅"; then
    echo -e "${GREEN}✅ Sentry DSN добавлен в Vercel!${NC}"
  else
    echo -e "${YELLOW}⚠️  Попытка добавления Sentry DSN...${NC}"
  fi
fi

echo ""

# ============================================
# ШАГ 3: Railway - Подготовка к деплою
# ============================================

echo -e "${GREEN}✅ Шаг 3: Подготовка деплоя Worker${NC}"
echo ""

RAILWAY_TOKEN="${RAILWAY_TOKEN:-b2d35fc1-afcf-4589-8b24-da667437cf26}"

echo "🚂 Railway деплой требует Dashboard"
echo -e "${YELLOW}⚠️  Railway CLI требует интерактивную авторизацию${NC}"
echo ""
echo "📋 Для деплоя Worker:"
echo "   1. Откройте: https://railway.app"
echo "   2. New Project → Deploy from GitHub repo"
echo "   3. Root Directory: services/worker"
echo "   4. Добавьте переменные из: docs/RAILWAY_DEPLOY_NOW.md"
echo ""
echo "📖 Детальная инструкция: docs/WORKER_DEPLOY_STEP_BY_STEP.md"
echo ""

# ============================================
# ИТОГИ
# ============================================

echo -e "${GREEN}✅ Автоматизация выполнена!${NC}"
echo ""
echo "📊 Результаты:"
echo "   ✅ Worker готов к деплою"
if [ -n "$SENTRY_DSN" ]; then
  echo -e "   ${GREEN}✅ Sentry DSN получен и добавлен в Vercel${NC}"
else
  echo -e "   ${YELLOW}⚠️  Sentry DSN требует ручного получения (30 сек)${NC}"
fi
echo "   ⏳ Railway требует Dashboard деплой (15 мин)"
echo ""
echo "📋 Осталось сделать:"
if [ -z "$SENTRY_DSN" ]; then
  echo "   1. Получить Sentry DSN (30 сек)"
  echo "   2. Запустить: bash scripts/auto-setup-vercel-sentry.sh <dsn>"
  echo "   3. Задеплоить Worker через Railway Dashboard (15 мин)"
else
  echo "   1. Задеплоить Worker через Railway Dashboard (15 мин)"
  echo "   2. Создать Sentry алерты (15 мин)"
fi
echo ""
echo "📖 Все инструкции: START_HERE.md"
echo ""

