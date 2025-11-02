#!/bin/bash

# Скрипт для полной очистки всех Node.js процессов в проекте

echo "🧹 Очистка всех Node.js процессов..."

# Убиваем все процессы next
pkill -f "next build" 2>/dev/null
pkill -f "next dev" 2>/dev/null
pkill -f "next-server" 2>/dev/null
pkill -f "jest-worker" 2>/dev/null

# Освобождаем порт 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Убиваем npm процессы проекта
pkill -f "npm run" 2>/dev/null

# Ждём секунду
sleep 1

echo "✓ Все процессы остановлены"
echo ""
echo "Запущенные процессы Node.js:"
ps aux | grep -E "node|npm|next" | grep -v grep | head -5 || echo "Нет запущенных процессов"


