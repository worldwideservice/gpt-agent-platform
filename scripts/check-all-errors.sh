#!/bin/bash

# Скрипт для проверки всех ошибок перед деплоем

echo "🔍 Проверка всех ошибок перед деплоем..."
echo ""

# 1. TypeScript проверка
echo "1️⃣ Проверка TypeScript типов..."
if npx tsc --noEmit 2>&1 | tee /tmp/ts-errors.log | grep -q "error TS"; then
  echo "❌ Найдены TypeScript ошибки:"
  npx tsc --noEmit 2>&1 | grep -E "error TS" | head -10
  echo ""
  echo "📊 Всего ошибок TypeScript:"
  grep -c "error TS" /tmp/ts-errors.log || echo "0"
else
  echo "✅ TypeScript ошибок не найдено"
fi
echo ""

# 2. Проверка сборки
echo "2️⃣ Проверка сборки Next.js..."
if npm run build 2>&1 | tee /tmp/build.log | grep -q "Failed to compile\|error\|Error"; then
  echo "❌ Найдены ошибки сборки:"
  grep -E "error|Error|Failed" /tmp/build.log | head -10
else
  echo "✅ Сборка успешна!"
fi
echo ""

# 3. Линтинг
echo "3️⃣ Проверка линтера..."
if npm run lint 2>&1 | tee /tmp/lint.log | grep -q "error\|Error"; then
  echo "❌ Найдены ошибки линтера:"
  grep -E "error|Error" /tmp/lint.log | head -10
else
  echo "✅ Линтинг пройден!"
fi
echo ""

echo "✅ Проверка завершена!"
echo ""
echo "📋 Проверьте логи выше для деталей"

