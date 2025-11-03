#!/bin/bash

# Скрипт для точного определения источника 501 ошибки

set -e

echo "🔍 Поиск источника 501 ошибки"
echo "════════════════════════════════════════"
echo ""

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Создаём временную директорию для логов
LOG_DIR="/tmp/nextjs-501-diagnosis-$(date +%s)"
mkdir -p "$LOG_DIR"

echo "📋 Информация о запуске проекта"
echo "────────────────────────────────────────"
echo ""

# 1. Проверка команды запуска
echo "1️⃣ Команда запуска:"
if [ -f "package.json" ]; then
    echo "   npm run start"
    START_CMD="npm run start"
else
    echo -e "${RED}✗ package.json не найден${NC}"
    exit 1
fi
echo ""

# 2. Проверка переменных окружения
echo "2️⃣ Переменные окружения:"
echo "   Проверяю наличие .env файлов..."

ENV_FILES=(
    ".env.local"
    ".env.production"
    ".env"
    "env.production"
)

ENV_VARS=""
for env_file in "${ENV_FILES[@]}"; do
    if [ -f "$env_file" ]; then
        echo -e "   ${GREEN}✓${NC} Найден: $env_file"
        ENV_VARS="$ENV_VARS $(grep -v '^#' "$env_file" | grep -v '^$' | cut -d'=' -f1 | sort -u | tr '\n' ' ')"
    fi
done

echo ""
echo "   Ключевые переменные окружения:"
echo "$ENV_VARS" | tr ' ' '\n' | grep -E "NODE_ENV|NEXT_PUBLIC|SUPABASE|REDIS|OPENROUTER" | sort -u | sed 's/^/     /'
echo ""

# 3. Очистка и сборка
echo "3️⃣ Очистка и сборка..."
rm -rf .next
echo "   Запускаю: npm run build"
npm run build > "$LOG_DIR/build.log" 2>&1
BUILD_EXIT=$?

if [ $BUILD_EXIT -eq 0 ]; then
    echo -e "   ${GREEN}✓ Сборка успешна${NC}"
else
    echo -e "   ${RED}✗ Сборка завершилась с ошибкой (код: $BUILD_EXIT)${NC}"
    echo "   Логи сохранены в: $LOG_DIR/build.log"
fi
echo ""

# 4. Проверка созданных файлов
echo "4️⃣ Проверка созданных файлов:"
echo ""

check_file() {
    local file=$1
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file"
        if [ "$file" = ".next/server/pages-manifest.json" ]; then
            echo "      Содержимое (первые 10 строк):"
            head -10 "$file" | sed 's/^/        /'
        fi
        return 0
    else
        echo -e "   ${RED}✗${NC} $file (НЕ НАЙДЕН)"
        return 1
    fi
}

MANIFEST_EXISTS=0
check_file ".next/server/pages-manifest.json" && MANIFEST_EXISTS=1
check_file ".next/server/app-paths-manifest.json"
check_file ".next/BUILD_ID"

if [ -d ".next/server/app" ]; then
    echo -e "   ${GREEN}✓${NC} .next/server/app (директория существует)"
    echo "      Файлов внутри: $(find .next/server/app -type f | wc -l | tr -d ' ')"
else
    echo -e "   ${RED}✗${NC} .next/server/app (директория не найдена)"
fi
echo ""

# 5. Запуск сервера и тестирование
echo "5️⃣ Запуск сервера и тестирование эндпоинтов..."
echo ""

# Запускаем сервер
echo "   Запускаю сервер в фоне..."
npm run start > "$LOG_DIR/server.log" 2>&1 &
SERVER_PID=$!

# Ждём запуска
echo "   Ожидание запуска (10 секунд)..."
sleep 10

# Проверяем, что сервер запустился
if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "   ${RED}✗ Сервер не запустился${NC}"
    echo "   Логи сервера:"
    tail -50 "$LOG_DIR/server.log" | sed 's/^/   /'
    exit 1
fi

echo -e "   ${GREEN}✓ Сервер запущен (PID: $SERVER_PID)${NC}"
echo ""

# Функция для тестирования эндпоинта с детальным логированием
test_endpoint_detailed() {
    local url=$1
    local method=${2:-GET}
    local name=${3:-"$method $url"}
    
    echo "   Тестирую: $name"
    
    local response
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}\nTIME:%{time_total}" \
            -H "User-Agent: NextJS-501-Diagnosis" \
            "$url" 2>&1)
    else
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}\nTIME:%{time_total}" \
            -X "$method" \
            -H "User-Agent: NextJS-501-Diagnosis" \
            "$url" 2>&1)
    fi
    
    local http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    local time_total=$(echo "$response" | grep "TIME:" | cut -d: -f2)
    local body=$(echo "$response" | sed '/HTTP_CODE:/d' | sed '/TIME:/d' | head -20)
    
    if [ -z "$http_code" ]; then
        echo -e "      ${RED}✗ Ошибка подключения${NC}"
        echo "      Ответ: $response"
        return 2
    fi
    
    if [ "$http_code" = "501" ]; then
        echo -e "      ${RED}✗ 501 НЕ РЕАЛИЗОВАНО${NC}"
        echo "      URL: $url"
        echo "      Метод: $method"
        echo "      Время ответа: ${time_total}s"
        echo "      Тело ответа (первые 500 символов):"
        echo "$body" | head -c 500 | sed 's/^/        /'
        echo ""
        echo "      ${YELLOW}════════════════════════════════════════${NC}"
        echo "      ${YELLOW}⚠️  НАЙДЕН ИСТОЧНИК 501 ОШИБКИ ⚠️${NC}"
        echo "      ${YELLOW}════════════════════════════════════════${NC}"
        echo ""
        return 1
    else
        echo -e "      ${GREEN}✓ $http_code${NC} (время: ${time_total}s)"
        if [ "$http_code" != "200" ] && [ "$http_code" != "302" ] && [ "$http_code" != "401" ]; then
            echo "      Тело: $(echo "$body" | head -c 200 | tr '\n' ' ')"
        fi
        return 0
    fi
}

# Список эндпоинтов для проверки
echo "   Тестирую основные эндпоинты:"
echo ""

ENDPOINTS=(
    "http://localhost:3000/|GET|Главная страница"
    "http://localhost:3000/api/health|GET|Health check"
    "http://localhost:3000/api/socket/io|GET|Socket.io (Pages Router)"
    "http://localhost:3000/api/socket/io|POST|Socket.io POST"
    "http://localhost:3000/api/auth/signin|GET|NextAuth signin"
    "http://localhost:3000/api/auth/callback/credentials|POST|NextAuth callback"
)

ERRORS_FOUND=0
FOUND_501_URL=""
FOUND_501_METHOD=""

for endpoint_spec in "${ENDPOINTS[@]}"; do
    IFS='|' read -r url method name <<< "$endpoint_spec"
    if test_endpoint_detailed "$url" "$method" "$name"; then
        :
    else
        ERRORS_FOUND=$((ERRORS_FOUND + 1))
        if [ -z "$FOUND_501_URL" ]; then
            FOUND_501_URL="$url"
            FOUND_501_METHOD="$method"
        fi
    fi
    sleep 1
done

# 6. Проверка логов сервера
echo ""
echo "6️⃣ Анализ логов сервера:"
echo ""

if grep -q "501" "$LOG_DIR/server.log" 2>/dev/null; then
    echo -e "   ${RED}✗ Найдены упоминания 501 в логах:${NC}"
    echo ""
    grep -B 5 -A 5 "501" "$LOG_DIR/server.log" | head -30 | sed 's/^/     /'
    ERRORS_FOUND=$((ERRORS_FOUND + 1))
else
    echo -e "   ${GREEN}✓ Упоминаний 501 в логах не найдено${NC}"
fi

if grep -q "pages-manifest" "$LOG_DIR/server.log" 2>/dev/null; then
    echo ""
    echo -e "   ${YELLOW}⚠️  Найдены упоминания pages-manifest:${NC}"
    grep -i "pages-manifest" "$LOG_DIR/server.log" | head -10 | sed 's/^/     /'
fi

if grep -q "error\|Error\|ERROR" "$LOG_DIR/server.log" 2>/dev/null; then
    echo ""
    echo -e "   ${YELLOW}⚠️  Найдены ошибки в логах:${NC}"
    grep -i "error" "$LOG_DIR/server.log" | tail -10 | sed 's/^/     /'
fi

# 7. Остановка сервера
echo ""
echo "7️⃣ Остановка сервера..."
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true
sleep 2
echo -e "   ${GREEN}✓ Сервер остановлен${NC}"
echo ""

# 8. Итоговая сводка
echo "════════════════════════════════════════"
echo "📊 ИТОГОВАЯ СВОДКА"
echo "════════════════════════════════════════"
echo ""

echo "🔧 Как запускается проект:"
echo "   Команда: $START_CMD"
echo "   Переменные окружения: см. раздел 2 выше"
echo ""

if [ $MANIFEST_EXISTS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  pages-manifest.json не был создан автоматически${NC}"
    echo "   Возможные причины:"
    echo "   - Проект использует только App Router"
    echo "   - Next.js не обнаружил routes в pages/"
    echo "   - Проблема с гибридной структурой (App + Pages Router)"
    echo ""
fi

if [ $ERRORS_FOUND -gt 0 ]; then
    echo -e "${RED}✗ Найдено проблем: $ERRORS_FOUND${NC}"
    echo ""
    
    if [ -n "$FOUND_501_URL" ]; then
        echo -e "${RED}════════════════════════════════════════${NC}"
        echo -e "${RED}🎯 ИСТОЧНИК 501 ОШИБКИ НАЙДЕН${NC}"
        echo -e "${RED}════════════════════════════════════════${NC}"
        echo ""
        echo "   URL: $FOUND_501_URL"
        echo "   Метод: $FOUND_501_METHOD"
        echo ""
        echo "   ${YELLOW}Рекомендации:${NC}"
        echo "   1. Проверьте обработчик этого маршрута"
        echo "   2. Если это Pages Router route, убедитесь что pages-manifest.json создан"
        echo "   3. Проверьте middleware.ts на наличие конфликтов"
        echo "   4. Проверьте next.config.js на корректность конфигурации"
        echo ""
        
        if [[ "$FOUND_501_URL" == *"/api/socket/io"* ]]; then
            echo "   ${BLUE}Специфичные рекомендации для /api/socket/io:${NC}"
            echo "   - Это Pages Router API route (pages/api/socket/io.ts)"
            echo "   - Next.js может возвращать 501 если pages-manifest.json отсутствует"
            echo "   - Решение: обновите postbuild.js для создания манифеста"
            echo ""
        fi
    fi
else
    echo -e "${GREEN}✓ Ошибок 501 не обнаружено в тестируемых эндпоинтах${NC}"
    echo ""
    echo "   Возможно, проблема возникает:"
    echo "   - При определённых условиях (авторизация, сессия)"
    echo "   - На других маршрутах"
    echo "   - При определённых методах HTTP"
    echo ""
    echo "   ${YELLOW}Следующие шаги:${NC}"
    echo "   1. Проверьте логи сервера в реальном использовании"
    echo "   2. Используйте инструменты разработчика браузера"
    echo "   3. Проверьте Network tab для всех запросов"
    echo ""
fi

echo "📁 Логи сохранены в:"
echo "   - Сборка: $LOG_DIR/build.log"
echo "   - Сервер: $LOG_DIR/server.log"
echo ""

if [ -f "$LOG_DIR/server.log" ]; then
    echo "   Последние 20 строк лога сервера:"
    tail -20 "$LOG_DIR/server.log" | sed 's/^/   /'
    echo ""
fi

echo "════════════════════════════════════════"
echo ""


