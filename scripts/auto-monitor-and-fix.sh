#!/bin/bash
# Полный автоматический мониторинг с чтением логов и исправлением ошибок

LOG_FILE="/tmp/run-all-scenarios.log"
SCRAPE_LOG_DIR="logs/scrape"
MONITOR_LOG="/tmp/auto-monitor-fix.log"
CODE_FILE="scripts/kwid-scrape.ts"

echo "🔍 Запускаю полный автоматический мониторинг с исправлением ошибок..." | tee -a "$MONITOR_LOG"
echo "Логи: $MONITOR_LOG" | tee -a "$MONITOR_LOG"
echo ""

# Функция для анализа ошибок из логов
analyze_error() {
    local scenario="$1"
    local log_file="$SCRAPE_LOG_DIR/${scenario//\//-}.log"
    
    if [ ! -f "$log_file" ]; then
        return 0
    fi
    
    local last_lines=$(tail -50 "$log_file" 2>/dev/null)
    
    # Проверяем таймауты
    if echo "$last_lines" | grep -qi "timeout.*exceeded"; then
        local timeout_line=$(echo "$last_lines" | grep -i "timeout" | tail -1)
        echo "[$(date +%H:%M:%S)] ⚠️  $scenario: Таймаут" | tee -a "$MONITOR_LOG"
        echo "   $timeout_line" | tee -a "$MONITOR_LOG"
        
        # Проверяем, исправлен ли код
        if grep -q "'$scenario':" "$CODE_FILE" 2>/dev/null; then
            # Проверяем, есть ли domcontentloaded и увеличенные таймауты
            local scenario_code=$(grep -A 50 "'$scenario':" "$CODE_FILE" 2>/dev/null | head -50)
            if echo "$scenario_code" | grep -q "domcontentloaded\|timeout: 1[0-9]000"; then
                echo "[$(date +%H:%M:%S)] ✅ Код уже исправлен" | tee -a "$MONITOR_LOG"
            else
                echo "[$(date +%H:%M:%S)] 🔧 Нужно исправить код" | tee -a "$MONITOR_LOG"
                # Запускаем автоматическое исправление
                node scripts/auto-fix-code.js 2>&1 | tee -a "$MONITOR_LOG"
            fi
        fi
        return 1
    fi
    
    return 0
}

# Основной цикл
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
    
    echo "[$(date +%H:%M:%S)] 📊 Прогресс: $COMPLETED/$TOTAL ($PERCENT%) | Ошибок: $FAILED | Выполняется: $RUNNING" | tee -a "$MONITOR_LOG"
    
    # Проверяем текущий сценарий на ошибки
    if [ "$RUNNING" -gt 0 ]; then
        CURRENT=$(ps aux | grep "kwid-scrape.*--scenario" | grep -v grep | head -1 | sed 's/.*--scenario //' | sed 's/ --headed.*//')
        if [ -n "$CURRENT" ]; then
            CURRENT_LOG="$SCRAPE_LOG_DIR/${CURRENT//\//-}.log"
            if [ -f "$CURRENT_LOG" ]; then
                analyze_error "$CURRENT"
            fi
        fi
    fi
    
    # Проверяем все логи на новые ошибки
    find "$SCRAPE_LOG_DIR" -name "*.log" -type f -mmin -2 | while read log_file; do
        scenario=$(basename "$log_file" .log)
        analyze_error "$scenario"
    done
    
    # Проверяем завершение
    if [ "$RUNNING" -eq 0 ] && [ "$COMPLETED" -ge "$TOTAL" ]; then
        echo "[$(date +%H:%M:%S)] 🎉 ВСЕ СЦЕНАРИИ ВЫПОЛНЕНЫ!" | tee -a "$MONITOR_LOG"
        break
    fi
    
    sleep 10
done






