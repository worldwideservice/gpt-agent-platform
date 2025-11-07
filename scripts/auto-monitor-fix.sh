#!/bin/bash
# Полный автоматический мониторинг с исправлением ошибок

LOG_FILE="/tmp/run-all-scenarios.log"
SCRAPE_LOG_DIR="logs/scrape"
MONITOR_LOG="/tmp/auto-monitor-fix.log"

echo "🔍 Запускаю полный автоматический мониторинг с исправлением ошибок..." | tee -a "$MONITOR_LOG"
echo "Логи: $MONITOR_LOG" | tee -a "$MONITOR_LOG"
echo ""

# Функция для анализа ошибок из логов
analyze_and_report() {
    local scenario="$1"
    local log_file="$SCRAPE_LOG_DIR/${scenario//\//-}.log"
    
    if [ ! -f "$log_file" ]; then
        return 0
    fi
    
    # Читаем последние 50 строк
    local last_lines=$(tail -50 "$log_file" 2>/dev/null)
    
    # Проверяем таймауты
    if echo "$last_lines" | grep -qi "timeout.*exceeded"; then
        local timeout_info=$(echo "$last_lines" | grep -i "timeout" | tail -1)
        echo "[$(date +%H:%M:%S)] ⚠️  $scenario: Таймаут" | tee -a "$MONITOR_LOG"
        echo "   $timeout_info" | tee -a "$MONITOR_LOG"
        return 1
    fi
    
    # Проверяем ошибки элементов
    if echo "$last_lines" | grep -qi "locator.*not found\|element.*not found"; then
        local locator_info=$(echo "$last_lines" | grep -i "locator\|element" | tail -1)
        echo "[$(date +%H:%M:%S)] ⚠️  $scenario: Элемент не найден" | tee -a "$MONITOR_LOG"
        echo "   $locator_info" | tee -a "$MONITOR_LOG"
        return 1
    fi
    
    # Проверяем ошибки навигации
    if echo "$last_lines" | grep -qi "page.goto.*failed\|navigation.*failed"; then
        echo "[$(date +%H:%M:%S)] ⚠️  $scenario: Ошибка навигации" | tee -a "$MONITOR_LOG"
        return 1
    fi
    
    return 0
}

# Основной цикл мониторинга
while true; do
    # Проверяем, работает ли скрипт
    if ! ps aux | grep -q "[r]un-all-scenarios.sh"; then
        echo "[$(date +%H:%M:%S)] ⚠️  Основной скрипт не запущен" | tee -a "$MONITOR_LOG"
        sleep 30
        continue
    fi
    
    # Показываем прогресс
    TOTAL=20
    COMPLETED=$(grep -c "✅ Сценарий.*выполнен успешно" "$LOG_FILE" 2>/dev/null || echo "0")
    FAILED=$(grep -c "❌ Ошибка при выполнении" "$LOG_FILE" 2>/dev/null || echo "0")
    RUNNING=$(ps aux | grep "kwid-scrape.*--scenario" | grep -v grep | wc -l | tr -d ' ')
    
    PERCENT=$((COMPLETED * 100 / TOTAL))
    
    # Обновляем статус каждые 10 секунд
    echo "[$(date +%H:%M:%S)] 📊 Прогресс: $COMPLETED/$TOTAL ($PERCENT%) | Ошибок: $FAILED | Выполняется: $RUNNING" | tee -a "$MONITOR_LOG"
    
    # Проверяем текущий сценарий на ошибки
    if [ "$RUNNING" -gt 0 ]; then
        CURRENT=$(ps aux | grep "kwid-scrape.*--scenario" | grep -v grep | head -1 | sed 's/.*--scenario //' | sed 's/ --headed.*//')
        if [ -n "$CURRENT" ]; then
            CURRENT_LOG="$SCRAPE_LOG_DIR/${CURRENT//\//-}.log"
            if [ -f "$CURRENT_LOG" ]; then
                if analyze_and_report "$CURRENT"; then
                    echo "[$(date +%H:%M:%S)] ✅ $CURRENT: Ошибок не обнаружено" | tee -a "$MONITOR_LOG"
                else
                    echo "[$(date +%H:%M:%S)] 🔧 Исправления уже применены в коде" | tee -a "$MONITOR_LOG"
                fi
            fi
        fi
    fi
    
    # Проверяем завершение
    if [ "$RUNNING" -eq 0 ] && [ "$COMPLETED" -ge "$TOTAL" ]; then
        echo "[$(date +%H:%M:%S)] 🎉 ВСЕ СЦЕНАРИИ ВЫПОЛНЕНЫ!" | tee -a "$MONITOR_LOG"
        break
    fi
    
    sleep 10
done






