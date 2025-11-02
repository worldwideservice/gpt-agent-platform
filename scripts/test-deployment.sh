#!/bin/bash

echo "🧪 ТЕСТИРОВАНИЕ ДЕПЛОЯ ПОСЛЕ ЗАВЕРШЕНИЯ"
echo ""

PROD_URL="${1:-https://gpt-agent-kwid.vercel.app}"

echo "📋 Тестирую: ${PROD_URL}"
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local endpoint=$1
    local method=${2:-GET}
    local url="${PROD_URL}${endpoint}"
    
    echo -n "Testing ${method} ${endpoint}... "
    
    if [ "$method" = "GET" ]; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${url}" 2>/dev/null || echo "000")
        RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "${url}" 2>/dev/null || echo "0")
    else
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "${url}" 2>/dev/null || echo "000")
        RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" -X "$method" "${url}" 2>/dev/null || echo "0")
    fi
    
    if [ "${HTTP_CODE}" = "200" ] || [ "${HTTP_CODE}" = "201" ]; then
        echo -e "${GREEN}✅ ${HTTP_CODE}${NC} (${RESPONSE_TIME}s)"
        return 0
    elif [ "${HTTP_CODE}" = "401" ] || [ "${HTTP_CODE}" = "302" ] || [ "${HTTP_CODE}" = "404" ]; then
        echo -e "${YELLOW}⚠️  ${HTTP_CODE}${NC} (ожидаемо)"
        return 0
    elif [ "${HTTP_CODE}" = "000" ]; then
        echo -e "${RED}❌ Connection failed${NC}"
        return 1
    else
        echo -e "${RED}❌ ${HTTP_CODE}${NC}"
        return 1
    fi
}

echo "1️⃣ Основные endpoints:"
test_endpoint "/"
test_endpoint "/api/health"
test_endpoint "/login"
test_endpoint "/pricing"

echo ""
echo "2️⃣ API endpoints:"
test_endpoint "/api/auth/signin"
test_endpoint "/api/integrations/kommo/status"
test_endpoint "/api/crm/kommo?action=pipelines"
test_endpoint "/api/subscriptions"

echo ""
echo "3️⃣ Коммо интеграция:"
test_endpoint "/integrations/kommo/oauth/callback"

echo ""
echo "4️⃣ Проверка health endpoint подробно:"
HEALTH_RESPONSE=$(curl -s "${PROD_URL}/api/health" 2>/dev/null)
if [ -n "$HEALTH_RESPONSE" ]; then
    echo "$HEALTH_RESPONSE" | head -20
else
    echo "⚠️ Health endpoint не отвечает"
fi

echo ""
echo "✅ Тестирование завершено"
echo ""
echo "💡 Для полной проверки:"
echo "   1. Откройте ${PROD_URL} в браузере"
echo "   2. Проверьте логи в Vercel Dashboard"
echo "   3. Протестируйте авторизацию и основные функции"

