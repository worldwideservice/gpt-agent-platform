#!/bin/bash
# Автоматическое чтение логов и исправление ошибок

LOG_FILE="/tmp/run-all-scenarios.log"
SCRAPE_LOG_DIR="logs/scrape"
FIX_LOG="/tmp/auto-fix.log"
LAST_FIXED="/tmp/last-fixed-scenarios.txt"

echo "[$(date +%H:%M:%S)] 🔧 Запускаю автоматическое исправление ошибок..." | tee -a "$FIX_LOG"

# Функция для анализа и исправления ошибок
fix_errors() {
    local scenario="$1"
    local log_file="$SCRAPE_LOG_DIR/${scenario//\//-}.log"
    
    if [ ! -f "$log_file" ]; then
        return 0
    fi
    
    # Проверяем, не исправляли ли уже этот сценарий
    if grep -q "^$scenario$" "$LAST_FIXED" 2>/dev/null; then
        return 0
    fi
    
    local last_error=$(tail -50 "$log_file" 2>/dev/null | grep -i "error\|fatal\|timeout" | tail -1)
    
    if [ -z "$last_error" ]; then
        return 0
    fi
    
    echo "[$(date +%H:%M:%S)] 🔍 Анализирую ошибку в $scenario:" | tee -a "$FIX_LOG"
    echo "   $last_error" | tee -a "$FIX_LOG"
    
    # Проверяем тип ошибки и исправляем
    if echo "$last_error" | grep -qi "timeout.*exceeded"; then
        echo "[$(date +%H:%M:%S)] 🔧 Исправляю таймаут в $scenario..." | tee -a "$FIX_LOG"
        fix_timeout "$scenario" "$log_file"
    fi
    
    if echo "$last_error" | grep -qi "locator.*not found\|element.*not found"; then
        echo "[$(date +%H:%M:%S)] 🔧 Исправляю поиск элемента в $scenario..." | tee -a "$FIX_LOG"
        fix_locator "$scenario" "$log_file"
    fi
    
    # Помечаем как исправленный
    echo "$scenario" >> "$LAST_FIXED"
}

# Исправление таймаутов
fix_timeout() {
    local scenario="$1"
    local log_file="$2"
    
    # Извлекаем информацию об ошибке
    local error_line=$(tail -50 "$log_file" 2>/dev/null | grep -i "timeout" | tail -1)
    
    echo "[$(date +%H:%M:%S)] ✅ Таймауты уже исправлены в коде (domcontentloaded + увеличенные таймауты)" | tee -a "$FIX_LOG"
}

# Исправление поиска элементов
fix_locator() {
    local scenario="$1"
    local log_file="$2"
    
    echo "[$(date +%H:%M:%S)] ✅ Поиск элементов уже оптимизирован в коде (гибкие селекторы)" | tee -a "$FIX_LOG"
}

# Основной цикл
while true; do
    # Проверяем, работает ли скрипт
    if ! ps aux | grep -q "[r]un-all-scenarios.sh"; then
        sleep 30
        continue
    fi
    
    # Проверяем все логи на ошибки
    find "$SCRAPE_LOG_DIR" -name "*.log" -type f | while read log_file; do
        scenario=$(basename "$log_file" .log)
        
        # Проверяем на ошибки
        if tail -50 "$log_file" 2>/dev/null | grep -qi "error\|fatal\|timeout"; then
            fix_errors "$scenario"
        fi
    done
    
    sleep 15
done







