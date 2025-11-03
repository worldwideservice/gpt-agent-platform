#!/bin/bash
# Скрипт для автоматического закрытия браузера Playwright/MCP

echo "🧹 Очистка процессов браузера..."

# Закрываем процессы MCP Chrome
pkill -f "mcp-chrome" 2>/dev/null && echo "✅ Закрыт mcp-chrome"
pkill -f "playwright" 2>/dev/null && echo "✅ Закрыт playwright"
pkill -f "chromium.*mcp" 2>/dev/null && echo "✅ Закрыт chromium mcp"

# Ждем завершения процессов
sleep 2

# Проверяем, остались ли процессы
REMAINING=$(ps aux | grep -E "mcp-chrome|playwright.*chrome" | grep -v grep | wc -l)
if [ "$REMAINING" -gt 0 ]; then
    echo "⚠️  Осталось процессов: $REMAINING"
    # Принудительное завершение
    killall -9 chromium 2>/dev/null || true
    killall -9 chrome 2>/dev/null || true
else
    echo "✅ Все процессы браузера закрыты"
fi


