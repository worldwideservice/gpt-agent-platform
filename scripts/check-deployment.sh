#!/bin/bash

echo "🔍 ПРОВЕРКА ДЕПЛОЯ"
echo ""

# Основные URL для проверки
PROD_URL="https://gpt-agent-kwid.vercel.app"

echo "1️⃣ Проверка доступности основного URL..."
if curl -s -f -o /dev/null "${PROD_URL}"; then
    echo "✅ Основной URL доступен: ${PROD_URL}"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${PROD_URL}")
    echo "   HTTP Status: ${HTTP_CODE}"
else
    echo "❌ Основной URL недоступен: ${PROD_URL}"
fi

echo ""
echo "2️⃣ Проверка health endpoint..."
if curl -s -f -o /dev/null "${PROD_URL}/api/health"; then
    echo "✅ Health endpoint доступен"
    curl -s "${PROD_URL}/api/health" | head -20
else
    echo "⚠️ Health endpoint недоступен или не отвечает"
fi

echo ""
echo "3️⃣ Проверка API endpoints..."
ENDPOINTS=(
    "/api/auth/signin"
    "/api/integrations/kommo/status"
)

for endpoint in "${ENDPOINTS[@]}"; do
    URL="${PROD_URL}${endpoint}"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${URL}" 2>/dev/null || echo "000")
    if [ "${HTTP_CODE}" = "200" ] || [ "${HTTP_CODE}" = "401" ] || [ "${HTTP_CODE}" = "302" ]; then
        echo "✅ ${endpoint} - ${HTTP_CODE}"
    else
        echo "⚠️ ${endpoint} - ${HTTP_CODE}"
    fi
done

echo ""
echo "✅ Проверка завершена"
