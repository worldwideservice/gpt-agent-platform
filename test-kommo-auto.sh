#!/bin/bash
# Автоматический тест Kommo интеграции
echo '🚀 ЗАПУСК ПОЛНОГО ТЕСТА KOMMO...'
echo ''

# Проверяем переменные
echo '📋 Проверка переменных окружения:'
grep KOMMO_TEST .env.local || echo '❌ Переменные не найдены'

echo ''
echo '🧪 Запуск теста API:'
DOTENV_CONFIG_PATH=./.env.local npx tsx test-kommo.ts

echo ''
echo '✅ Тест завершен!'

