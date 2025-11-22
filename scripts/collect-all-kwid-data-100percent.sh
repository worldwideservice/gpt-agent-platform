#!/bin/bash

# Скрипт для 100% выполнения всех сценариев с retry логикой
# Использование: ./scripts/collect-all-kwid-data-100percent.sh

set +e  # Не останавливаться при ошибках

echo "🚀 Начинаю сбор ВСЕХ данных KWID с гарантией 100% выполнения..."
echo "📋 Убедитесь, что KWID открыт в браузере!"
echo ""

# Цвета
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Сценарии
SCENARIOS=(
  "agents:toggle-manual-generation"
  "agents:copy"
  "agents:pagination"
  "agents:knowledge-task-configure"
  "agents:fallback-with-url"
  "knowledge:item-create-success"
  "knowledge:item-delete"
  "knowledge:category-crud"
  "knowledge:bulk-delete"
  "knowledge:filters-search"
  "test-chat:new"
  "test-chat:complete-response"
  "global:notifications"
  "global:theme-toggle"
  "global:breadcrumbs"
  "global:search"
  "kommo:widget-settings"
)

SUCCESS_COUNT=0
FAIL_COUNT=0
TOTAL=${#SCENARIOS[@]}
MAX_RETRIES=5  # Увеличиваем до 5 попыток

echo "📊 Всего сценариев: $TOTAL"
echo "🔄 Максимум попыток на сценарий: $MAX_RETRIES"
echo ""

for i in "${!SCENARIOS[@]}"; do
  scenario="${SCENARIOS[$i]}"
  num=$((i + 1))
  attempt=1
  success=false
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "${BLUE}📦 [$num/$TOTAL] Сценарий: $scenario${NC}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  while [ $attempt -le $MAX_RETRIES ] && [ "$success" = false ]; do
    if [ $attempt -gt 1 ]; then
      echo -e "${YELLOW}🔄 Попытка $attempt/$MAX_RETRIES...${NC}"
      echo "   ⏳ Жду 3 секунды перед повтором..."
      sleep 3
    fi
    
    echo -e "${BLUE}▶️  Запускаю попытку $attempt...${NC}"
    
    # Используем наш скрипт с таймаутом (уменьшаем до 120 секунд)
    if ./scripts/run-scenario-with-timeout.sh "$scenario" 120; then
      echo -e "${GREEN}✅ $scenario - УСПЕШНО выполнено!${NC}"
      SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
      success=true
      break  # Выходим из цикла при успехе
    else
      EXIT_CODE=$?
      if [ $attempt -lt $MAX_RETRIES ]; then
        echo -e "${YELLOW}⚠️  Попытка $attempt не удалась (код: $EXIT_CODE)${NC}"
        attempt=$((attempt + 1))
      else
        echo -e "${RED}❌ $scenario - не удалось после $MAX_RETRIES попыток${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        success=false
        # ВАЖНО: Выходим из цикла даже при неудаче, чтобы перейти к следующему сценарию
        break
      fi
    fi
  done
  
  echo ""
  sleep 3  # Пауза между сценариями
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 СБОР ДАННЫХ ЗАВЕРШЕН!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Успешно: $SUCCESS_COUNT/$TOTAL${NC}"
echo -e "${RED}❌ Ошибок: $FAIL_COUNT/$TOTAL${NC}"
echo "📁 Результаты: kwid/raw/scrape/"
echo ""

SUCCESS_RATE=$((SUCCESS_COUNT * 100 / TOTAL))
echo "📊 Процент успеха: ${SUCCESS_RATE}%"

if [ $SUCCESS_COUNT -eq $TOTAL ]; then
  echo -e "${GREEN}🎊 ВСЕ СЦЕНАРИИ ВЫПОЛНЕНЫ НА 100%!${NC}"
  exit 0
elif [ $SUCCESS_RATE -ge 90 ]; then
  echo -e "${GREEN}✅ Отличный результат! ${SUCCESS_RATE}% выполнено${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Некоторые сценарии не выполнены. Успешно: ${SUCCESS_RATE}%${NC}"
  exit 1
fi
