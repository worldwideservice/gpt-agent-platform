#!/bin/bash

# SessionStart Hook для GPT Agent Platform
# Выполняется автоматически при запуске новой сессии Claude Code

echo "🚀 Инициализация GPT Agent Platform..."
echo ""

# Проверка Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js $(node --version)"
else
    echo "⚠️  Node.js не установлен"
fi

# Проверка npm
if command -v npm &> /dev/null; then
    echo "✅ npm $(npm --version)"
else
    echo "⚠️  npm не установлен"
fi

# Проверка наличия node_modules
if [ -d "node_modules" ]; then
    echo "✅ Зависимости установлены"
else
    echo "📦 Зависимости не установлены. Запустите: npm install"
fi

# Проверка .env файлов
if [ -f ".env.local" ]; then
    echo "✅ .env.local найден"
else
    echo "⚠️  .env.local не найден. Скопируйте из env.local.example"
fi

echo ""
echo "📋 Доступные команды:"
echo "   /test        - Запустить тесты"
echo "   /build       - Собрать проект"
echo "   /lint        - Проверить код"
echo "   /dev         - Запустить dev окружение"
echo "   /db-migrate  - Применить миграции БД"
echo "   /type-check  - Проверить типы TypeScript"
echo ""
echo "📚 Документация: README.md | PROJECT_STRUCTURE.md"
echo "🌿 Текущая ветка: $(git branch --show-current)"
echo ""
