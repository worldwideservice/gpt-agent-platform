#!/bin/bash

# Скрипт для тестирования платформы
# Проверяет доступность основных страниц и функционала

set -e

PORT=${PORT:-3000}
BASE_URL="http://localhost:${PORT}"
DEMO_MODE=${DEMO_MODE:-true}

echo "🧪 Тестирование GPT Agent Platform"
echo "=================================="
echo ""
echo "🌐 URL: ${BASE_URL}"
echo "🎮 Демо-режим: ${DEMO_MODE}"
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для проверки страницы
check_page() {
    local url=$1
    local name=$2
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "${BASE_URL}${url}" 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
        echo -e "${GREEN}✓${NC} ${name}: HTTP ${response}"
        return 0
    else
        echo -e "${RED}✗${NC} ${name}: HTTP ${response}"
        return 1
    fi
}

# Функция для проверки API
check_api() {
    local url=$1
    local name=$2
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "${BASE_URL}${url}" 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ] || [ "$response" = "401" ] || [ "$response" = "503" ]; then
        echo -e "${GREEN}✓${NC} ${name}: HTTP ${response}"
        return 0
    else
        echo -e "${RED}✗${NC} ${name}: HTTP ${response}"
        return 1
    fi
}

# Проверка доступности сервера
echo "1️⃣ Проверка доступности сервера..."
if ! curl -s --max-time 5 "${BASE_URL}" > /dev/null 2>&1; then
    echo -e "${RED}✗${NC} Сервер не доступен на ${BASE_URL}"
    echo ""
    echo "Запустите сервер:"
    echo "  DEMO_MODE=true npm run dev"
    exit 1
fi
echo -e "${GREEN}✓${NC} Сервер доступен"
echo ""

# Проверка публичных страниц
echo "2️⃣ Публичные страницы..."
check_page "/" "Главная страница (Landing)"
check_page "/login" "Страница логина"
check_page "/register" "Страница регистрации"
check_page "/pricing" "Тарифы"
check_page "/support" "Поддержка"
check_page "/demo" "Демо"
echo ""

# Проверка API endpoints
echo "3️⃣ API Endpoints..."
check_api "/api/health" "Health Check"
check_api "/api/health/ready" "Health Ready"
check_api "/api/docs" "API Docs"
check_api "/api/test-kommo" "Test Kommo API"
echo ""

# Проверка статических файлов
echo "4️⃣ Статические файлы..."
check_page "/favicon.ico" "Favicon"
check_page "/manifest.json" "PWA Manifest"
check_page "/robots.txt" "Robots.txt"
check_page "/sitemap.xml" "Sitemap"
echo ""

# Проверка сборки
echo "5️⃣ Проверка сборки..."
if [ -d ".next" ]; then
    echo -e "${GREEN}✓${NC} Директория .next существует"
    
    if [ -f ".next/server/pages-manifest.json" ]; then
        echo -e "${GREEN}✓${NC} pages-manifest.json создан"
    else
        echo -e "${YELLOW}⚠${NC} pages-manifest.json не найден"
    fi
    
    if [ -f ".next/server/app/page_client-reference-manifest.js" ]; then
        echo -e "${GREEN}✓${NC} App Router манифест создан"
    else
        echo -e "${YELLOW}⚠${NC} App Router манифест не найден"
    fi
else
    echo -e "${YELLOW}⚠${NC} Директория .next не найдена (запустите сборку)"
fi
echo ""

# Проверка TypeScript и линтера
echo "6️⃣ Проверка качества кода..."
if npm run type-check > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} TypeScript проверка пройдена"
else
    echo -e "${RED}✗${NC} TypeScript проверка не пройдена"
fi

if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} ESLint проверка пройдена"
else
    echo -e "${YELLOW}⚠${NC} ESLint предупреждения"
fi
echo ""

# Итоговая статистика
echo "=================================="
echo -e "${GREEN}✅ Тестирование завершено${NC}"
echo ""
echo "🌐 Откройте в браузере: ${BASE_URL}"
echo "🎮 Демо-режим активен: ${DEMO_MODE}"
echo ""
echo "Доступные страницы:"
echo "  - ${BASE_URL}/          - Главная"
echo "  - ${BASE_URL}/login     - Вход"
echo "  - ${BASE_URL}/register  - Регистрация"
echo "  - ${BASE_URL}/api-docs  - API документация"
echo ""

