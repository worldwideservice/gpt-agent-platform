#!/bin/bash

# Скрипт развертывания GPT Agent Platform с Docker
# Использование: ./deploy.sh

set -e

echo "🚀 Начинаем развертывание GPT Agent Platform..."

# Проверяем наличие Docker и docker-compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose не установлен. Установите docker-compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Проверяем наличие .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  Файл .env.local не найден."
    echo "Создайте его на основе .env.example и заполните переменные окружения."
    echo ""
    echo "Критически важные переменные:"
    echo "- NEXT_PUBLIC_SUPABASE_URL"
    echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "- SUPABASE_SERVICE_ROLE_KEY"
    echo "- OPENROUTER_API_KEY"
    echo ""
    echo "Для биллинга (опционально):"
    echo "- STRIPE_SECRET_KEY"
    echo "- STRIPE_WEBHOOK_SECRET"
    echo ""
    exit 1
fi

# Проверяем наличие миграций БД
if [ ! -f scripts/apply-all-setup.sql ]; then
    echo "⚠️  Файл миграций не найден: scripts/apply-all-setup.sql"
    echo "Убедитесь, что миграции БД применены в Supabase Dashboard."
fi

echo "📦 Собираем Docker образы..."
docker-compose build --no-cache

echo "🚀 Запускаем сервисы..."
docker-compose up -d

echo "⏳ Ожидаем запуска приложения (30 сек)..."
sleep 30

echo "🔍 Проверяем здоровье сервисов..."
if curl -f http://localhost:3000/api/health &>/dev/null; then
    echo "✅ Приложение запущено и отвечает на запросы"
else
    echo "⚠️  Приложение может еще запускаться. Проверьте логи:"
    echo "   docker-compose logs app"
fi

if docker-compose ps | grep -q "redis.*Up"; then
    echo "✅ Redis запущен"
else
    echo "❌ Redis не запущен"
fi

echo ""
echo "🎉 Развертывание завершено!"
echo ""
echo "📋 Доступ к приложению:"
echo "   Frontend: http://localhost:3000"
echo "   API Docs: http://localhost:3000/api-docs"
echo ""
echo "📋 Управление:"
echo "   Просмотр логов: docker-compose logs -f"
echo "   Остановка: docker-compose down"
echo "   Перезапуск: docker-compose restart"
echo ""
echo "📋 Мониторинг:"
echo "   Статус: docker-compose ps"
echo "   Health check: curl http://localhost:3000/api/health"
echo ""
