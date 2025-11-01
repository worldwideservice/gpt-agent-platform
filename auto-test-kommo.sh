#!/bin/bash

echo "🔄 АВТОМАТИЧЕСКОЕ ТЕСТИРОВАНИЕ KOMMO ИНТЕГРАЦИИ"
echo "================================================"

cd "/Users/maksimgolovaty/Library/Mobile Documents/com~apple~CloudDocs/Development/AI agent"

# Загружаем переменные окружения
source <(sed 's/^/export /' .env.local | grep -E '^export KOMMO_TEST_')

echo "📋 Проверка переменных:"
echo "KOMMO_TEST_ENABLED: $KOMMO_TEST_ENABLED"
echo "KOMMO_TEST_DOMAIN: $KOMMO_TEST_DOMAIN"
echo "Access Token: $(if [ -n "$KOMMO_TEST_ACCESS_TOKEN" ] && [ "$KOMMO_TEST_ACCESS_TOKEN" != "demo-access-token-replace-with-real-one" ]; then echo '✅ УСТАНОВЛЕН'; else echo '❌ НЕТ'; fi)"

if [ -z "$KOMMO_TEST_ACCESS_TOKEN" ] || [ "$KOMMO_TEST_ACCESS_TOKEN" = "demo-access-token-replace-with-real-one" ]; then
    echo ""
    echo "❌ Токены не получены!"
    echo "Сначала получите токены через oauth-helper.html"
    exit 1
fi

echo ""
echo "🧪 Запуск теста Kommo API..."
npx tsx test-kommo.ts

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 УСПЕХ! Kommo интеграция работает!"
    echo "Теперь можно использовать AI агентов с Kommo CRM"
else
    echo ""
    echo "❌ Тест провалился. Проверьте токены и настройки."
fi
EOF && chmod +x auto-test-kommo.sh && echo "" && echo "✅ Скрипт auto-test-kommo.sh создан!"