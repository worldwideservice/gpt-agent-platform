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
BUILD_OUTPUT=$(npm run build 2>&1 | tee /tmp/build.log)
BUILD_EXIT_CODE=${PIPESTATUS[0]}

# Проверяем код выхода сборки
if [ $BUILD_EXIT_CODE -ne 0 ]; then
  echo "❌ Сборка завершилась с ошибкой (код: $BUILD_EXIT_CODE)"
  grep -E "Failed to compile|error TS|Error:|Build error|failed" /tmp/build.log | grep -v "/_error" | head -15
else
  # Проверяем логи на наличие реальных ошибок (исключаем false positives)
  if grep -E "Failed to compile|error TS|Error:|Build error|failed" /tmp/build.log | grep -v "/_error" | grep -v "pages-manifest.json with routes" | grep -qv "No ESLint warnings"; then
    echo "❌ Найдены ошибки сборки:"
    grep -E "Failed to compile|error TS|Error:|Build error|failed" /tmp/build.log | grep -v "/_error" | grep -v "pages-manifest.json with routes" | grep -v "No ESLint warnings" | head -15
  else
    echo "✅ Сборка успешна!"
  fi
fi
echo ""

# 3. Линтинг
echo "3️⃣ Проверка линтера..."
LINT_OUTPUT=$(npm run lint 2>&1 | tee /tmp/lint.log)
LINT_EXIT_CODE=${PIPESTATUS[0]}

if [ $LINT_EXIT_CODE -ne 0 ]; then
  echo "❌ Линтинг завершился с ошибкой (код: $LINT_EXIT_CODE)"
  grep -E "error|Error|✖|✗" /tmp/lint.log | head -15
else
  # Проверяем на наличие реальных ошибок (исключаем сообщения об успехе)
  if grep -E "✖|✗|error" /tmp/lint.log | grep -v "No ESLint warnings" | grep -v "✔" | grep -qv "problems"; then
    echo "❌ Найдены ошибки линтера:"
    grep -E "✖|✗|error" /tmp/lint.log | grep -v "No ESLint warnings" | grep -v "✔" | head -15
  else
    echo "✅ Линтинг пройден!"
  fi
fi
echo ""

echo "✅ Проверка завершена!"
echo ""
echo "📋 Проверьте логи выше для деталей"

