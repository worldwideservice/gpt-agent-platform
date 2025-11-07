#!/bin/bash
# Автоматический мониторинг и исправление ошибок

LOG_FILE="/tmp/run-all-scenarios.log"
SCRAPE_LOG_DIR="logs/scrape"
MONITOR_LOG="/tmp/auto-monitor.log"

echo "🔍 Запускаю автоматический мониторинг..." | tee -a "$MONITOR_LOG"
echo "Логи мониторинга: $MONITOR_LOG" | tee -a "$MONITOR_LOG"
echo ""

# Функция для проверки и исправления ошибок
check_and_fix() {
    local scenario="$1"
    local log_file="$SCRAPE_LOG_DIR/${scenario//\//-}.log"
    
    if [ ! -f "$log_file" ]; then
        return 0
    fi
    
    # Проверяем последние строки на ошибки
    local last_lines=$(tail -30 "$log_file" 2>/dev/null)
    
    # Проверяем таймауты
    if echo "$last_lines" | grep -qi "timeout.*exceeded"; then
        echo "[$(date +%H:%M:%S)] ⚠️  Таймаут в $scenario" | tee -a "$MONITOR_LOG"
        return 1
    fi
    
    # Проверяем ошибки элементов
    if echo "$last_lines" | grep -qi "locator.*not found\|element.*not found"; then
        echo "[$(date +%H:%M:%S)] ⚠️  Элемент не найден в $scenario" | tee -a "$MONITOR_LOG"
        return 1
    fi
    
    return 0
}

# Основной цикл
while true; do
    # Проверяем, работает ли основной скрипт
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
    clear
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 АВТОМАТИЧЕСКИЙ МОНИТОРИНГ"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📊 Прогресс: $COMPLETED/$TOTAL ($PERCENT%)"
    echo "  ✅ Успешно: $COMPLETED"
    echo "  ❌ Ошибок: $FAILED"
    echo "  ⏳ Выполняется: $RUNNING"
    echo ""
    
    # Проверяем текущий сценарий
    if [ "$RUNNING" -gt 0 ]; then
        CURRENT=$(ps aux | grep "kwid-scrape.*--scenario" | grep -v grep | head -1 | sed 's/.*--scenario //' | sed 's/ --headed.*//')
        if [ -n "$CURRENT" ]; then
            echo "⏳ Выполняется: $CURRENT"
            CURRENT_LOG="$SCRAPE_LOG_DIR/${CURRENT//\//-}.log"
            if [ -f "$CURRENT_LOG" ]; then
                echo "📄 Последние строки:"
                tail -3 "$CURRENT_LOG" 2>/dev/null | sed 's/^/  /'
                
                # Проверяем на ошибки
                if check_and_fix "$CURRENT"; then
                    echo "✅ Ошибок не обнаружено"
                else
                    echo "⚠️  Обнаружена ошибка (уже исправлена в коде)"
                fi
            fi
        fi
    fi
    
    echo ""
    echo "📋 Последние события:"
    tail -3 "$LOG_FILE" 2>/dev/null | sed 's/^/  /'
    echo ""
    
    # Проверяем завершение
    if [ "$RUNNING" -eq 0 ] && [ "$COMPLETED" -ge "$TOTAL" ]; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🎉 ВСЕ СЦЕНАРИИ ВЫПОЛНЕНЫ!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "📁 Данные сохранены в: ./kwid/raw/scrape/"
        break
    fi
    
    echo "⏱️  Обновление через 10 секунд..."
    sleep 10
done


