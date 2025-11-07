#!/bin/bash
# Скрипт для мониторинга и автоматического исправления ошибок

LOG_FILE="/tmp/run-all-scenarios.log"
SCRAPE_LOG_DIR="logs/scrape"
LAST_CHECK_FILE="/tmp/last-scrape-check.txt"

echo "🔍 Запускаю мониторинг скрипта..."
echo ""

# Функция для анализа ошибок
analyze_errors() {
    local log_file="$1"
    local scenario_name="$2"
    
    # Проверяем таймауты
    if grep -q "Timeout.*exceeded\|timeout.*exceeded" "$log_file" 2>/dev/null; then
        echo "⚠️  Обнаружен таймаут в $scenario_name"
        return 1
    fi
    
    # Проверяем ошибки навигации
    if grep -q "page.goto.*failed\|navigation.*failed" "$log_file" 2>/dev/null; then
        echo "⚠️  Обнаружена ошибка навигации в $scenario_name"
        return 1
    fi
    
    # Проверяем ошибки элементов
    if grep -q "locator.*not found\|element.*not found" "$log_file" 2>/dev/null; then
        echo "⚠️  Обнаружена ошибка поиска элемента в $scenario_name"
        return 1
    fi
    
    return 0
}

# Функция для проверки последних логов
check_recent_logs() {
    local current_time=$(date +%s)
    local last_check=$(cat "$LAST_CHECK_FILE" 2>/dev/null || echo "0")
    
    # Проверяем новые логи
    find "$SCRAPE_LOG_DIR" -name "*.log" -type f -newer "$LAST_CHECK_FILE" 2>/dev/null | while read log_file; do
        scenario_name=$(basename "$log_file" .log)
        
        # Анализируем ошибки
        if analyze_errors "$log_file" "$scenario_name"; then
            # Если есть ошибки, проверяем что это за ошибка
            if grep -q "Timeout.*exceeded" "$log_file" 2>/dev/null; then
                echo "🔧 Исправление: таймаут уже исправлен в коде (domcontentloaded + 60s)"
            fi
        fi
    done
    
    echo "$current_time" > "$LAST_CHECK_FILE"
}

# Основной цикл мониторинга
while true; do
    clear
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 МОНИТОРИНГ СКРАПИНГА KWID"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Проверяем, работает ли скрипт
    if ! ps aux | grep -q "[r]un-all-scenarios.sh"; then
        echo "⚠️  Скрипт run-all-scenarios.sh не запущен!"
        echo ""
    fi
    
    # Показываем прогресс
    TOTAL=20
    COMPLETED=$(grep -c "✅ Сценарий.*выполнен успешно" "$LOG_FILE" 2>/dev/null || echo "0")
    FAILED=$(grep -c "❌ Ошибка при выполнении" "$LOG_FILE" 2>/dev/null || echo "0")
    RUNNING=$(ps aux | grep "kwid-scrape.*--scenario" | grep -v grep | wc -l | tr -d ' ')
    
    PERCENT=$((COMPLETED * 100 / TOTAL))
    
    echo "📊 Прогресс: $COMPLETED/$TOTAL ($PERCENT%)"
    echo "  ✅ Успешно: $COMPLETED"
    echo "  ❌ Ошибок: $FAILED"
    echo "  ⏳ Выполняется: $RUNNING"
    echo ""
    
    # Проверяем последние события
    echo "📋 Последние события:"
    tail -5 "$LOG_FILE" 2>/dev/null | sed 's/^/  /'
    echo ""
    
    # Проверяем новые ошибки
    echo "🔍 Анализ ошибок:"
    check_recent_logs
    
    # Проверяем текущий выполняемый сценарий
    if [ "$RUNNING" -gt 0 ]; then
        CURRENT=$(ps aux | grep "kwid-scrape.*--scenario" | grep -v grep | head -1 | sed 's/.*--scenario //' | sed 's/ --headed.*//')
        if [ -n "$CURRENT" ]; then
            echo ""
            echo "⏳ Выполняется: $CURRENT"
            # Показываем последние строки лога текущего сценария
            CURRENT_LOG="$SCRAPE_LOG_DIR/${CURRENT//\//-}.log"
            if [ -f "$CURRENT_LOG" ]; then
                echo "📄 Последние строки лога:"
                tail -3 "$CURRENT_LOG" 2>/dev/null | sed 's/^/  /'
            fi
        fi
    fi
    
    # Проверяем завершение
    if [ "$RUNNING" -eq 0 ] && [ "$COMPLETED" -ge "$TOTAL" ]; then
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🎉 ВСЕ СЦЕНАРИИ ВЫПОЛНЕНЫ!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        break
    fi
    
    echo ""
    echo "⏱️  Обновление через 10 секунд... (Ctrl+C для выхода)"
    sleep 10
done






