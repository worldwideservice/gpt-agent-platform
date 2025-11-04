#!/bin/bash

# Скрипт мониторинга глубины очереди Redis
# Предупреждает о переполнении очереди jobs
# Использование: ./scripts/monitor-redis-queue.sh [threshold]

set -euo pipefail

# Цвета для вывода
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Параметры по умолчанию
QUEUE_NAME="${JOB_QUEUE_NAME:-agent-jobs}"
THRESHOLD="${1:-1000}"  # Порог по умолчанию: 1000 jobs
WARNING_THRESHOLD="${2:-500}"  # Предупреждение: 500 jobs

# Проверка переменных окружения
if [ -z "${UPSTASH_REDIS_REST_URL:-}" ] || [ -z "${UPSTASH_REDIS_REST_TOKEN:-}" ]; then
  echo -e "${RED}❌ Ошибка: UPSTASH_REDIS_REST_URL и UPSTASH_REDIS_REST_TOKEN должны быть установлены${NC}"
  exit 1
fi

# Извлекаем endpoint из URL
REDIS_ENDPOINT=$(echo "$UPSTASH_REDIS_REST_URL" | sed 's|https://||' | cut -d'/' -f1)

echo "📊 Мониторинг очереди Redis: $QUEUE_NAME"
echo "🔗 Endpoint: $REDIS_ENDPOINT"
echo "⚠️  Порог предупреждения: $WARNING_THRESHOLD jobs"
echo "🚨 Порог критической ошибки: $THRESHOLD jobs"
echo ""

# Функция для получения длины очереди через Upstash REST API
get_queue_length() {
  local queue_key="bull:$QUEUE_NAME:wait"
  
  # Используем Upstash REST API для получения длины списка
  local response=$(curl -s -X GET \
    "$UPSTASH_REDIS_REST_URL/llen/$queue_key" \
    -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN")
  
  # Парсим JSON ответ
  local length=$(echo "$response" | grep -o '"result":[0-9]*' | cut -d':' -f2)
  
  if [ -z "$length" ]; then
    echo "0"
  else
    echo "$length"
  fi
}

# Функция для получения активных jobs
get_active_jobs() {
  local queue_key="bull:$QUEUE_NAME:active"
  
  local response=$(curl -s -X GET \
    "$UPSTASH_REDIS_REST_URL/llen/$queue_key" \
    -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN")
  
  local length=$(echo "$response" | grep -o '"result":[0-9]*' | cut -d':' -f2)
  
  if [ -z "$length" ]; then
    echo "0"
  else
    echo "$length"
  fi
}

# Функция для получения failed jobs
get_failed_jobs() {
  local queue_key="bull:$QUEUE_NAME:failed"
  
  local response=$(curl -s -X GET \
    "$UPSTASH_REDIS_REST_URL/llen/$queue_key" \
    -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN")
  
  local length=$(echo "$response" | grep -o '"result":[0-9]*' | cut -d':' -f2)
  
  if [ -z "$length" ]; then
    echo "0"
  else
    echo "$length"
  fi
}

# Получаем метрики
WAIT_QUEUE=$(get_queue_length)
ACTIVE_JOBS=$(get_active_jobs)
FAILED_JOBS=$(get_failed_jobs)
TOTAL_PENDING=$((WAIT_QUEUE + ACTIVE_JOBS))

# Выводим статус
echo "📈 Текущие метрики:"
echo "   ⏳ Ожидающих: $WAIT_QUEUE"
echo "   🔄 Активных: $ACTIVE_JOBS"
echo "   ❌ Неудачных: $FAILED_JOBS"
echo "   📊 Всего в очереди: $TOTAL_PENDING"
echo ""

# Проверка критических порогов
if [ "$TOTAL_PENDING" -ge "$THRESHOLD" ]; then
  echo -e "${RED}🚨 КРИТИЧЕСКАЯ ОШИБКА: Очередь переполнена!${NC}"
  echo -e "${RED}   Текущее значение: $TOTAL_PENDING (порог: $THRESHOLD)${NC}"
  echo ""
  echo "Рекомендуемые действия:"
  echo "1. Проверить статус Worker: https://railway.app"
  echo "2. Проверить логи Worker на ошибки"
  echo "3. Увеличить JOB_CONCURRENCY в Railway"
  echo "4. Проверить Redis подключение"
  exit 2
elif [ "$TOTAL_PENDING" -ge "$WARNING_THRESHOLD" ]; then
  echo -e "${YELLOW}⚠️  ПРЕДУПРЕЖДЕНИЕ: Очередь растет!${NC}"
  echo -e "${YELLOW}   Текущее значение: $TOTAL_PENDING (предупреждение: $WARNING_THRESHOLD)${NC}"
  echo ""
  echo "Рекомендуется мониторить очередь и проверить Worker"
  exit 1
elif [ "$FAILED_JOBS" -gt 100 ]; then
  echo -e "${YELLOW}⚠️  ПРЕДУПРЕЖДЕНИЕ: Много неудачных jobs!${NC}"
  echo -e "${YELLOW}   Неудачных jobs: $FAILED_JOBS${NC}"
  echo ""
  echo "Рекомендуется проверить логи ошибок в Sentry"
  exit 1
else
  echo -e "${GREEN}✅ Очередь в норме${NC}"
  exit 0
fi

