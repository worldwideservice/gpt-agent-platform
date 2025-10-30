#!/bin/bash

# Полное сканирование всех страниц с скриншотами

echo "🚀 Начинаю полное сканирование всех страниц..."

# Создаем директории
mkdir -p test-screenshots
mkdir -p test-results

# Запускаем тесты
echo "📸 Запуск тестов с полными скриншотами..."
npm run test -- tests/full-scan.spec.ts --project=chromium --workers=1 --reporter=list,html

echo ""
echo "✅ Сканирование завершено!"
echo "📁 Скриншоты сохранены в: test-screenshots/"
echo "📊 Отчет сохранен в: playwright-report/index.html"





