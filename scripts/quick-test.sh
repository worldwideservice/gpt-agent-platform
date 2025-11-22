#!/bin/bash

# Быстрый тест платформы без запуска сервера
# Проверяет сборку, типы, линтер и создаёт отчёт

set -e

echo "🧪 Быстрое тестирование GPT Agent Platform"
echo "=========================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# 1. TypeScript проверка
echo "1️⃣ Проверка TypeScript..."
if npm run type-check > /tmp/typecheck.log 2>&1; then
    echo -e "${GREEN}✓${NC} TypeScript: ошибок нет"
else
    echo -e "${RED}✗${NC} TypeScript: найдены ошибки"
    cat /tmp/typecheck.log | tail -10
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 2. ESLint проверка
echo "2️⃣ Проверка ESLint..."
if npm run lint > /tmp/lint.log 2>&1; then
    echo -e "${GREEN}✓${NC} ESLint: ошибок нет"
else
    if grep -q "✖" /tmp/lint.log; then
        echo -e "${RED}✗${NC} ESLint: найдены ошибки"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${YELLOW}⚠${NC} ESLint: есть предупреждения"
        WARNINGS=$((WARNINGS + 1))
    fi
fi
echo ""

# 3. Проверка сборки
echo "3️⃣ Проверка сборки..."
if DEMO_MODE=true npm run build > /tmp/build.log 2>&1; then
    echo -e "${GREEN}✓${NC} Сборка: успешна"
    
    # Проверка манифестов
    if [ -f ".next/server/pages-manifest.json" ]; then
        echo -e "${GREEN}✓${NC} pages-manifest.json создан"
        ROUTES=$(cat .next/server/pages-manifest.json | grep -o '"[^"]*"' | wc -l | tr -d ' ')
        echo "   Найдено маршрутов: ${ROUTES}"
    else
        echo -e "${RED}✗${NC} pages-manifest.json не найден"
        ERRORS=$((ERRORS + 1))
    fi
    
    if [ -f ".next/server/app/page_client-reference-manifest.js" ]; then
        echo -e "${GREEN}✓${NC} App Router манифест создан"
    else
        echo -e "${YELLOW}⚠${NC} App Router манифест не найден"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} Сборка: ошибка"
    tail -20 /tmp/build.log
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 4. Проверка структуры проекта
echo "4️⃣ Проверка структуры проекта..."
MISSING=0

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1 - не найдено"
        MISSING=$((MISSING + 1))
    fi
}

check_dir "app"
check_dir "app/(auth)"
check_dir "app/(protected)"
check_dir "app/api"
check_dir "components"
check_dir "lib/services"
check_dir "lib/repositories"
check_dir "docs"

if [ $MISSING -gt 0 ]; then
    ERRORS=$((ERRORS + MISSING))
fi
echo ""

# 5. Проверка документации
echo "5️⃣ Проверка документации..."
DOCS_OK=0

check_doc() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        DOCS_OK=$((DOCS_OK + 1))
    else
        echo -e "${YELLOW}⚠${NC} $1 - не найдено"
    fi
}

check_doc "README.md"
check_doc "docs/PLATFORM_OVERVIEW.md"
check_doc "docs/IN_PROGRESS.md"
check_doc "docs/ARCHITECTURE.md"
check_doc "PROJECT_AUDIT.md"
echo ""

# 6. Проверка основных файлов
echo "6️⃣ Проверка основных файлов..."
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1 - не найден"
        ERRORS=$((ERRORS + 1))
    fi
}

check_file "next.config.js"
check_file "package.json"
check_file "tsconfig.json"
check_file "tailwind.config.ts"
check_file "auth.ts"
echo ""

# Итоги
echo "=========================================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Все проверки пройдены успешно!${NC}"
    echo ""
    echo "Платформа готова к использованию:"
    echo "  1. Запустите сервер: DEMO_MODE=true npm run dev"
    echo "  2. Откройте в браузере: http://localhost:3000"
    echo "  3. Используйте демо-режим для тестирования"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Предупреждения: ${WARNINGS}${NC}"
    echo -e "${GREEN}✓ Критических ошибок нет${NC}"
    echo ""
    echo "Платформа готова к использованию с предупреждениями"
    exit 0
else
    echo -e "${RED}✗ Найдено ошибок: ${ERRORS}${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ Предупреждений: ${WARNINGS}${NC}"
    fi
    echo ""
    echo "Исправьте ошибки перед использованием"
    exit 1
fi

