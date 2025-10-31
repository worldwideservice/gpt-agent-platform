#!/bin/bash

# АВТОМАТИЧЕСКАЯ НАСТРОЙКА UPSTASH REDIS
# Запуск: bash scripts/setup-redis.sh

set -e

echo "🚀 НАСТРОЙКА UPSTASH REDIS..."
echo "============================"

# Проверка наличия curl
if ! command -v curl &> /dev/null; then
    echo "❌ curl не найден!"
    exit 1
fi

echo "📋 ИНСТРУКЦИИ ПО НАСТРОЙКЕ REDIS:"
echo "=================================="
echo ""
echo "1️⃣  Перейдите в Upstash Dashboard: https://console.upstash.com"
echo "2️⃣  Нажмите 'Create Database'"
echo "3️⃣  Выберите тип: Redis"
echo "4️⃣  Заполните настройки:"
echo "   - Name: ai-agent-platform-prod"
echo "   - Region: Выберите ближайший регион"
echo "   - Type: Pay as you go (или Free tier)"
echo ""
echo "5️⃣  После создания скопируйте:"
echo "   - REST URL (например: https://xxxx.upstash.io)"
echo "   - REST Token"
echo ""

read -p "🔑 Введите REST URL из Upstash: " REST_URL
read -p "🔐 Введите REST Token из Upstash: " REST_TOKEN

# Проверка подключения
echo "🔍 Проверка подключения к Redis..."

RESPONSE=$(curl -s -w "%{http_code}" \
    -H "Authorization: Bearer $REST_TOKEN" \
    "$REST_URL" 2>/dev/null)

HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Подключение к Redis успешно!"
else
    echo "❌ Ошибка подключения к Redis!"
    echo "HTTP Code: $HTTP_CODE"
    echo "Проверьте URL и токен."
    exit 1
fi

# Обновление env.production файла
echo "📝 Обновление env.production файла..."

if [ -f "env.production" ]; then
    # Удаляем старые Redis настройки
    sed -i.bak '/UPSTASH_REDIS_REST_URL/d' env.production
    sed -i.bak '/UPSTASH_REDIS_REST_TOKEN/d' env.production
    rm env.production.bak
fi

# Добавляем новые настройки
cat >> env.production << EOF

# === REDIS НАСТРОЙКИ ===
UPSTASH_REDIS_REST_URL=$REST_URL
UPSTASH_REDIS_REST_TOKEN=$REST_TOKEN
EOF

echo ""
echo "🎯 REDIS НАСТРОЕН!"
echo "=================="
echo ""
echo "📋 ВАШИ ДАННЫЕ:"
echo "🌐 REST URL: $REST_URL"
echo "🔐 REST Token: $REST_TOKEN"
echo ""
echo "✅ Файл env.production обновлен!"
echo ""
echo "🚀 ДАЛЕЕ:"
echo "1. Скопируйте Redis настройки в Vercel Dashboard"
echo "2. Получите OpenRouter API ключ"
echo "3. Запустите финальную проверку: npm run verify:env"
