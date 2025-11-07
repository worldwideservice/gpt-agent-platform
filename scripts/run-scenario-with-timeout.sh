#!/bin/bash
# Запуск сценария с таймаутом (работает на macOS)

SCENARIO="$1"
TIMEOUT="${2:-180}"  # По умолчанию 3 минуты

# Запускаем скрипт в фоне
npx ts-node scripts/kwid-scrape.ts --scenario "$SCENARIO" --headed > "/tmp/kwid-${SCENARIO//\//-}.log" 2>&1 &
SCRAPE_PID=$!

# Ждем завершения или таймаут
elapsed=0
while [ $elapsed -lt $TIMEOUT ]; do
  if ! kill -0 $SCRAPE_PID 2>/dev/null; then
    # Процесс завершился
    wait $SCRAPE_PID
    EXIT_CODE=$?
    exit $EXIT_CODE
  fi
  sleep 2
  elapsed=$((elapsed + 2))
done

# Таймаут - убиваем процесс
if kill -0 $SCRAPE_PID 2>/dev/null; then
  echo "⚠️  Таймаут ($TIMEOUT сек), завершаю процесс..."
  kill -9 $SCRAPE_PID 2>/dev/null
  wait $SCRAPE_PID 2>/dev/null  # Ждем завершения
  exit 124  # Код выхода для таймаута
fi

exit 0
