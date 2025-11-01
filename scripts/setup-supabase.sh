#!/bin/bash

# АВТОМАТИЧЕСКАЯ НАСТРОЙКА SUPABASE ПРОЕКТА
# Запуск: bash scripts/setup-supabase.sh

set -e

echo "🚀 НАЧИНАЕМ НАСТРОЙКУ SUPABASE ПРОЕКТА..."
echo "=========================================="

# Проверка наличия Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI не установлен!"
    echo "📦 Установите: npm install -g supabase"
    echo "   или: brew install supabase"
    exit 1
fi

# Проверка авторизации
echo "🔐 Проверка авторизации в Supabase..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Вы не авторизованы в Supabase CLI!"
    echo "🔑 Авторизуйтесь: supabase login"
    exit 1
fi

# Запрос информации о проекте
read -p "🏷️  Введите имя проекта (например: ai-agent-prod): " PROJECT_NAME
read -p "🌍 Выберите регион (us-east-1, eu-west-1, ap-southeast-1): " REGION
read -p "🗝️  Введите пароль базы данных (минимум 8 символов): " DB_PASSWORD

# Создание проекта
echo "🏗️  Создание Supabase проекта..."
PROJECT_OUTPUT=$(supabase projects create "$PROJECT_NAME" \
    --region "$REGION" \
    --password "$DB_PASSWORD" \
    --yes 2>&1)

# Извлечение project_id из вывода
PROJECT_ID=$(echo "$PROJECT_OUTPUT" | grep -oP 'ID:\s+\K[^\s]+' | head -1)

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Ошибка создания проекта!"
    echo "Вывод команды:"
    echo "$PROJECT_OUTPUT"
    exit 1
fi

echo "✅ Проект создан! ID: $PROJECT_ID"

# Ожидание готовности проекта (обычно занимает 2-3 минуты)
echo "⏳ Ожидание готовности проекта..."
sleep 30

# Проверка статуса
STATUS=$(supabase projects list | grep "$PROJECT_ID" | awk '{print $3}')

while [ "$STATUS" != "ACTIVE" ]; do
    echo "📊 Статус проекта: $STATUS (ожидание ACTIVE)..."
    sleep 30
    STATUS=$(supabase projects list | grep "$PROJECT_ID" | awk '{print $3}')
done

echo "🎉 Проект активен!"

# Подключение к проекту
echo "🔗 Подключение к проекту..."
supabase link --project-ref "$PROJECT_ID"

# Запуск базы данных локально для применения миграций
echo "🗄️  Запуск локальной базы данных..."
supabase start

# Применение миграций
echo "📝 Применение миграций..."
supabase db push

# Запуск seeding
echo "🌱 Запуск seeding..."
supabase seed

# Получение API ключей
echo "🔑 Получение API ключей..."
API_KEYS=$(supabase status --json 2>/dev/null || echo "{}")

# Извлечение ключей
ANON_KEY=$(echo "$API_KEYS" | grep -oP '"anon_key":\s*"\K[^"]+' | head -1)
SERVICE_ROLE_KEY=$(echo "$API_KEYS" | grep -oP '"service_role_key":\s*"\K[^"]+' | head -1)

if [ -n "$ANON_KEY" ] && [ -n "$SERVICE_ROLE_KEY" ]; then
    echo "✅ Ключи получены!"
else
    echo "⚠️  Не удалось получить ключи автоматически."
    echo "Получите их в Supabase Dashboard > Settings > API"
fi

# Создание .env.production файла
echo "📝 Создание env.production файла..."
cat > env.production << EOF
# === ПРОДАКШЕН КОНФИГУРАЦИЯ SUPABASE ===
SUPABASE_URL=https://$PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY
EOF

echo ""
echo "🎯 НАСТРОЙКА SUPABASE ЗАВЕРШЕНА!"
echo "=================================="
echo ""
echo "📋 ВАШИ ДАННЫЕ:"
echo "🏷️  Project Name: $PROJECT_NAME"
echo "🆔 Project ID: $PROJECT_ID"
echo "🌐 Supabase URL: https://$PROJECT_ID.supabase.co"
echo "🔑 Anon Key: $ANON_KEY"
echo "🔐 Service Role Key: $SERVICE_ROLE_KEY"
echo ""
echo "📁 Файл env.production создан с вашими ключами!"
echo ""
echo "🚀 ДАЛЕЕ:"
echo "1. Скопируйте значения из env.production в Vercel Dashboard"
echo "2. Настройте Redis в Upstash"
echo "3. Добавьте OpenRouter API ключ"
echo "4. Запустите: npm run verify:env"

echo ""
echo "🔗 Ссылки:"
echo "- Supabase Dashboard: https://supabase.com/dashboard/project/$PROJECT_ID"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
