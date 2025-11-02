#!/bin/bash

# Диагностический скрипт для поиска источника 501 ошибки

set -e

echo "🔍 Диагностика проблемы с 501 ошибкой и pages-manifest.json"
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Проверка структуры проекта
echo "1️⃣ Проверка структуры проекта..."
echo ""

if [ -d "pages" ]; then
    echo -e "${YELLOW}⚠️  Найдена папка pages/ (Pages Router)${NC}"
    find pages -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" | head -10
    echo ""
else
    echo -e "${GREEN}✓ Папка pages/ не найдена${NC}"
    echo ""
fi

if [ -d "app" ]; then
    echo -e "${GREEN}✓ Найдена папка app/ (App Router)${NC}"
    echo ""
fi

# 2. Очистка предыдущей сборки
echo "2️⃣ Очистка предыдущей сборки..."
rm -rf .next
echo -e "${GREEN}✓ Очищено${NC}"
echo ""

# 3. Запуск сборки с подробным выводом
echo "3️⃣ Запуск сборки Next.js..."
echo "Команда: npm run build"
echo ""

# Сохраняем вывод сборки
BUILD_LOG="/tmp/next-build-$(date +%s).log"
npm run build 2>&1 | tee "$BUILD_LOG"

echo ""
echo -e "${GREEN}✓ Сборка завершена${NC}"
echo ""

# 4. Проверка созданных файлов манифестов
echo "4️⃣ Проверка созданных манифестов..."
echo ""

MANIFEST_FOUND=0

if [ -f ".next/server/pages-manifest.json" ]; then
    echo -e "${GREEN}✓ .next/server/pages-manifest.json существует${NC}"
    echo "Содержимое:"
    cat .next/server/pages-manifest.json | head -20
    echo ""
    MANIFEST_FOUND=1
else
    echo -e "${RED}✗ .next/server/pages-manifest.json НЕ НАЙДЕН${NC}"
    echo ""
fi

if [ -f ".next/server/app-paths-manifest.json" ]; then
    echo -e "${GREEN}✓ .next/server/app-paths-manifest.json существует${NC}"
    MANIFEST_FOUND=1
else
    echo -e "${YELLOW}⚠️  .next/server/app-paths-manifest.json не найден${NC}"
fi

if [ -d ".next/server/app" ]; then
    echo -e "${GREEN}✓ Папка .next/server/app существует${NC}"
    echo "Найдено файлов в .next/server/app:"
    find .next/server/app -type f | head -10
    echo ""
fi

# 5. Создание тестового сервера для проверки эндпоинтов
echo "5️⃣ Запуск тестового сервера для проверки эндпоинтов..."
echo ""

# Запускаем сервер в фоне
npm run start > /tmp/next-server.log 2>&1 &
SERVER_PID=$!

# Ждём запуска сервера
echo "Ожидание запуска сервера..."
sleep 10

# Проверяем, что сервер запустился
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${RED}✗ Сервер не запустился${NC}"
    echo "Логи сервера:"
    cat /tmp/next-server.log
    exit 1
fi

echo -e "${GREEN}✓ Сервер запущен (PID: $SERVER_PID)${NC}"
echo ""

# 6. Тестирование различных эндпоинтов
echo "6️⃣ Тестирование эндпоинтов..."
echo ""

test_endpoint() {
    local url=$1
    local method=${2:-GET}
    
    echo -n "Тестирую $method $url ... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$url" 2>&1 || echo "ERROR")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" 2>&1 || echo "ERROR")
    fi
    
    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "501" ]; then
        echo -e "${RED}✗ 501 НЕ РЕАЛИЗОВАНО${NC}"
        echo "  URL: $url"
        echo "  Метод: $method"
        echo "  Тело ответа: $body"
        echo ""
        return 1
    elif [ "$http_code" = "ERROR" ]; then
        echo -e "${YELLOW}⚠️  Ошибка подключения${NC}"
        return 2
    else
        echo -e "${GREEN}✓ $http_code${NC}"
        return 0
    fi
}

# Список эндпоинтов для тестирования
ENDPOINTS=(
    "http://localhost:3000/"
    "http://localhost:3000/api/health"
    "http://localhost:3000/api/socket/io"
    "http://localhost:3000/api/auth/signin"
    "http://localhost:3000/_next/static/chunks"
)

ERRORS_FOUND=0

for endpoint in "${ENDPOINTS[@]}"; do
    if ! test_endpoint "$endpoint"; then
        ERRORS_FOUND=$((ERRORS_FOUND + 1))
    fi
    sleep 1
done

# Проверяем специфичные маршруты
echo ""
echo "Проверка специфичных маршрутов Pages Router..."
if test_endpoint "http://localhost:3000/api/socket/io" "GET"; then
    # Проверяем POST тоже
    test_endpoint "http://localhost:3000/api/socket/io" "POST"
fi

# 7. Проверка логов сервера на наличие 501
echo ""
echo "7️⃣ Проверка логов сервера на наличие 501..."
echo ""

if grep -q "501" /tmp/next-server.log 2>/dev/null; then
    echo -e "${RED}✗ Найдены упоминания 501 в логах сервера:${NC}"
    grep -i "501" /tmp/next-server.log | head -10
    ERRORS_FOUND=$((ERRORS_FOUND + 1))
else
    echo -e "${GREEN}✓ Упоминаний 501 в логах не найдено${NC}"
fi

# 8. Остановка сервера
echo ""
echo "8️⃣ Остановка тестового сервера..."
kill $SERVER_PID 2>/dev/null || true
sleep 2

# 9. Итоговая сводка
echo ""
echo "════════════════════════════════════════"
echo "📊 ИТОГОВАЯ СВОДКА"
echo "════════════════════════════════════════"
echo ""

if [ $MANIFEST_FOUND -eq 0 ]; then
    echo -e "${YELLOW}⚠️  pages-manifest.json не был создан${NC}"
    echo "   Это нормально для проектов только с App Router"
    echo "   Но если есть routes в pages/, это может быть проблемой"
    echo ""
fi

if [ $ERRORS_FOUND -gt 0 ]; then
    echo -e "${RED}✗ Найдено проблем: $ERRORS_FOUND${NC}"
    echo ""
    echo "Рекомендации:"
    echo "1. Проверьте логи выше для определения конкретного эндпоинта"
    echo "2. Если 501 на /api/socket/io, проблема может быть в Pages Router"
    echo "3. Проверьте next.config.js на наличие конфликтов"
    echo ""
else
    echo -e "${GREEN}✓ Ошибок 501 не обнаружено${NC}"
    echo ""
fi

echo "Логи сохранены в:"
echo "  - Сборка: $BUILD_LOG"
echo "  - Сервер: /tmp/next-server.log"
echo ""


