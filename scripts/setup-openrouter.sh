#!/bin/bash

# НАСТРОЙКА OPENROUTER API КЛЮЧА
# Запуск: bash scripts/setup-openrouter.sh

set -e

echo "🤖 НАСТРОЙКА OPENROUTER API..."
echo "=============================="

echo "📋 ИНСТРУКЦИИ ПО ПОЛУЧЕНИЮ API КЛЮЧА:"
echo "====================================="
echo ""
echo "1️⃣  Перейдите на сайт: https://openrouter.ai"
echo "2️⃣  Зарегистрируйтесь или войдите в аккаунт"
echo "3️⃣  Перейдите в раздел API Keys: https://openrouter.ai/keys"
echo "4️⃣  Нажмите 'Create Key'"
echo "5️⃣  Дайте имя ключу: 'AI Agent Platform Prod'"
echo "6️⃣  Скопируйте созданный ключ (начинается с sk-or-v1-)"
echo ""

read -p "🔑 Введите ваш OpenRouter API ключ: " API_KEY

# Проверка формата ключа
if [[ $API_KEY != sk-or-v1-* ]]; then
    echo "❌ Неверный формат ключа!"
    echo "Ключ должен начинаться с 'sk-or-v1-'"
    exit 1
fi

# Проверка работоспособности ключа (базовая проверка)
echo "🔍 Проверка API ключа..."

# Получаем список доступных моделей (легкий запрос)
RESPONSE=$(curl -s -w "%{http_code}" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    "https://openrouter.ai/api/v1/models" 2>/dev/null)

HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ API ключ валиден!"

    # Показываем доступные кредиты
    CREDITS=$(echo "$RESPONSE" | grep -o '"credits":\s*[^,}]*' | head -1 || echo "N/A")
    if [ "$CREDITS" != "N/A" ]; then
        echo "💰 Доступные кредиты: $CREDITS"
    fi
else
    echo "❌ Ошибка проверки API ключа!"
    echo "HTTP Code: $HTTP_CODE"
    echo "Возможные причины:"
    echo "- Неверный API ключ"
    echo "- Недостаточно кредитов"
    echo "- Проблемы с подключением"
    exit 1
fi

# Обновление env.production файла
echo "📝 Обновление env.production файла..."

if [ -f "env.production" ]; then
    # Удаляем старую настройку OpenRouter
    sed -i.bak '/OPENROUTER_API_KEY/d' env.production
    rm env.production.bak
fi

# Добавляем новую настройку
cat >> env.production << EOF

# === OPENROUTER API ===
OPENROUTER_API_KEY=$API_KEY
EOF

echo ""
echo "🎯 OPENROUTER НАСТРОЕН!"
echo "======================="
echo ""
echo "📋 ВАШ КЛЮЧ:"
echo "🔑 API Key: ${API_KEY:0:20}...${API_KEY: -10}"
echo ""
echo "✅ Файл env.production обновлен!"
echo ""
echo "🚀 ДАЛЕЕ:"
echo "1. Скопируйте OpenRouter ключ в Vercel Dashboard"
echo "2. Запустите финальную проверку: npm run verify:env"
echo "3. Деплой в продакшен готов!"
