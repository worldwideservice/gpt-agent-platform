#!/bin/bash

echo "🔍 ПОЛНАЯ ДИАГНОСТИКА СИСТЕМЫ"
echo "=============================="

cd "/Users/maksimgolovaty/Library/Mobile Documents/com~apple~CloudDocs/Development/AI agent"

echo "1️⃣ Проверка переменных окружения..."
source <(sed 's/^/export /' .env.local | grep -E '^export KOMMO_TEST_')
echo "✅ KOMMO_TEST_ENABLED: $KOMMO_TEST_ENABLED"
echo "✅ KOMMO_TEST_DOMAIN: $KOMMO_TEST_DOMAIN"  
echo "✅ KOMMO_TEST_CLIENT_ID: ${KOMMO_TEST_CLIENT_ID:0:20}..."
echo "✅ KOMMO_TEST_REDIRECT_URI: $KOMMO_TEST_REDIRECT_URI"

if [ -n "$KOMMO_TEST_ACCESS_TOKEN" ] && [ "$KOMMO_TEST_ACCESS_TOKEN" != "demo-access-token-replace-with-real-one" ]; then
    echo "✅ Access Token: УСТАНОВЛЕН"
else
    echo "❌ Access Token: НЕТ"
fi

echo ""
echo "2️⃣ Тестирование Next.js приложения..."
if npm run build --silent 2>/dev/null; then
    echo "✅ Next.js сборка: УСПЕШНА"
else
    echo "❌ Next.js сборка: ПРОВАЛЕНА"
fi

echo ""
echo "3️⃣ Проверка API эндпоинтов..."
# Проверяем health endpoint
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/health" | grep -q "200"; then
    echo "✅ API Health: ДОСТУПЕН"
else
    echo "❌ API Health: НЕДОСТУПЕН (нужно запустить dev сервер)"
fi

echo ""
echo "4️⃣ Тестирование Kommo интеграции..."
source <(sed 's/^/export /' .env.local | grep -E '^export KOMMO_TEST_')
if npx tsx test-kommo.ts 2>/dev/null; then
    echo "✅ Kommo API: РАБОТАЕТ"
else
    echo "❌ Kommo API: НЕ РАБОТАЕТ"
fi

echo ""
echo "5️⃣ Проверка сервисов..."
if pgrep -f "python3 -m http.server 8080" > /dev/null; then
    echo "✅ Локальный сервер: ЗАПУЩЕН (порт 8080)"
else
    echo "❌ Локальный сервер: НЕ ЗАПУЩЕН"
fi

echo ""
echo "📋 СТАТУС СИСТЕМЫ:"
echo "=================="
echo "- Локальный сервер: http://localhost:8080/oauth-helper.html"
echo "- Next.js dev сервер: npm run dev"
echo "- Тестирование Kommo: npx tsx test-kommo.ts"
echo "- Полная диагностика: ./full-system-test.sh"
echo ""
echo "🎯 ГОТОВО К РАБОТЕ!"
EOF && chmod +x full-system-test.sh && echo "" && echo "✅ Скрипт full-system-test.sh создан!" && echo "" && echo "5️⃣ ЗАПУСК ПОЛНОЙ ДИАГНОСТИКИ:" && echo "------------------------------" && ./full-system-test.sh