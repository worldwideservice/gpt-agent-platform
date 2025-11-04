#!/bin/bash

# Скрипт для мониторинга Worker метрик
# Использование: bash scripts/monitor-worker.sh

set -e

WORKER_URL="${WORKER_URL:-http://localhost:3001}"

echo "🔍 Worker Monitoring"
echo "==================="
echo ""

# Проверка health
echo "📊 Health Check:"
HEALTH=$(curl -s "${WORKER_URL}/health" || echo "{}")
STATUS=$(echo "$HEALTH" | jq -r '.status // "unknown"')
REDIS_CONNECTED=$(echo "$HEALTH" | jq -r '.redis.connected // false')
UPTIME=$(echo "$HEALTH" | jq -r '.uptime // 0')

if [ "$STATUS" = "ok" ]; then
  echo "  ✅ Status: $STATUS"
else
  echo "  ❌ Status: $STATUS"
fi

if [ "$REDIS_CONNECTED" = "true" ]; then
  echo "  ✅ Redis: Connected"
else
  echo "  ❌ Redis: Disconnected"
  REDIS_ERROR=$(echo "$HEALTH" | jq -r '.redis.error // "Unknown error"')
  echo "     Error: $REDIS_ERROR"
fi

echo "  ⏱️  Uptime: ${UPTIME}s"
echo ""

# Получение метрик
echo "📈 Metrics:"
METRICS=$(curl -s "${WORKER_URL}/metrics" || echo "{}")

if [ "$METRICS" = "{}" ]; then
  echo "  ❌ Failed to fetch metrics"
  exit 1
fi

TOTAL=$(echo "$METRICS" | jq -r '.jobs.total // 0')
COMPLETED=$(echo "$METRICS" | jq -r '.jobs.completed // 0')
FAILED=$(echo "$METRICS" | jq -r '.jobs.failed // 0')
PROCESSING=$(echo "$METRICS" | jq -r '.jobs.processing // 0')

if [ "$TOTAL" -gt 0 ]; then
  FAIL_RATE=$(echo "scale=2; $FAILED * 100 / $TOTAL" | bc)
  echo "  📦 Jobs:"
  echo "     Total: $TOTAL"
  echo "     Completed: $COMPLETED"
  echo "     Failed: $FAILED ($FAIL_RATE%)"
  echo "     Processing: $PROCESSING"
else
  echo "  📦 Jobs: No jobs processed yet"
fi

AVG_TIME=$(echo "$METRICS" | jq -r '.performance.avgProcessingTime // 0')
MAX_TIME=$(echo "$METRICS" | jq -r '.performance.maxProcessingTime // 0')
MIN_TIME=$(echo "$METRICS" | jq -r '.performance.minProcessingTime // 0')

if [ "$AVG_TIME" != "0" ]; then
  echo "  ⚡ Performance:"
  echo "     Avg Time: ${AVG_TIME}ms"
  echo "     Max Time: ${MAX_TIME}ms"
  echo "     Min Time: ${MIN_TIME}ms"
fi

# Статистика по типам jobs
echo ""
echo "📋 Jobs by Type:"
JOBS_BY_TYPE=$(echo "$METRICS" | jq -r '.jobs.byType // {}')

if [ "$JOBS_BY_TYPE" != "{}" ]; then
  echo "$METRICS" | jq -r '.jobs.byType | to_entries[] | "  \(.key):\n    Completed: \(.value.completed)\n    Failed: \(.value.failed)\n    Avg Time: \(.value.avgTime)ms"' || echo "  No job type statistics"
else
  echo "  No job type statistics"
fi

echo ""
echo "✅ Monitoring complete"

