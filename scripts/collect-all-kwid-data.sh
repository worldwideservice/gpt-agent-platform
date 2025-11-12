#!/bin/bash

# Скрипт для массового сбора всех недостающих данных KWID
# Использование: ./scripts/collect-all-kwid-data.sh

set -e

echo "🚀 Начинаю сбор всех недостающих данных KWID..."
echo "📋 Убедитесь, что KWID открыт в браузере!"
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Сценарии для сбора всех недостающих данных
SCENARIOS=(
  # AI Agents
  "agents:toggle-manual-generation"
  "agents:copy"
  "agents:pagination"
  "agents:knowledge-task-configure"
  "agents:fallback-with-url"
  
  # База знаний
  "knowledge:item-create-success"
  "knowledge:item-delete"
  "knowledge:category-crud"
  "knowledge:bulk-delete"
  "knowledge:filters-search"
  
  # Тестовый чат
  "test-chat:new"
  "test-chat:complete-response"
  
  # Глобальные элементы
  "global:notifications"
  "global:theme-toggle"
  "global:breadcrumbs"
  "global:search"
  
  # Kommo Widget
  "kommo:widget-settings"
)

SUCCESS_COUNT=0
FAIL_COUNT=0
TOTAL=${#SCENARIOS[@]}

echo "📊 Всего сценариев: $TOTAL"
echo ""

for i in "${!SCENARIOS[@]}"; do
  scenario="${SCENARIOS[$i]}"
  num=$((i + 1))
  MAX_RETRIES=3
  attempt=1
  success=false
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📦 [$num/$TOTAL] Запускаю сценарий: $scenario"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  while [ $attempt -le $MAX_RETRIES ] && [ "$success" = false ]; do
    if [ $attempt -gt 1 ]; then
      echo -e "${YELLOW}🔄 Попытка $attempt/$MAX_RETRIES для $scenario...${NC}"
      sleep 3
    fi
    
    if npx ts-node scripts/kwid-scrape.ts --scenario "$scenario" --headed 2>&1; then
      echo -e "${GREEN}✅ $scenario - успешно${NC}"
      SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
      success=true
    else
      if [ $attempt -lt $MAX_RETRIES ]; then
        echo -e "${YELLOW}⚠️  Попытка $attempt не удалась, повторяю через 5 секунд...${NC}"
        sleep 5
        attempt=$((attempt + 1))
      else
        echo -e "${RED}❌ $scenario - ошибка после $MAX_RETRIES попыток${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        success=false
      fi
    fi
  done
  
  if [ "$success" = false ]; then
    echo -e "${YELLOW}⚠️  Продолжаю со следующим сценарием...${NC}"
  fi
  
  echo ""
  sleep 2
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Сбор данных завершен!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Успешно: $SUCCESS_COUNT${NC}"
echo -e "${RED}❌ Ошибок: $FAIL_COUNT${NC}"
echo "📁 Результаты сохранены в: kwid/raw/scrape/"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}🎊 Все сценарии выполнены успешно!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Некоторые сценарии завершились с ошибками. Проверьте логи выше.${NC}"
  exit 1
fi

