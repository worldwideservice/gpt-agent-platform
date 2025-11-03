#!/bin/bash

# АВТОМАТИЧЕСКАЯ НАСТРОЙКА VERCEL ENVIRONMENT VARIABLES
# Запуск: bash scripts/setup-vercel-env.sh

set -e

echo "🚀 НАСТРОЙКА VERCEL ENVIRONMENT VARIABLES..."
echo "==========================================="

# Проверка наличия env.production
if [ ! -f "env.production" ]; then
    if [ -f "env.production.example" ]; then
        echo "⚠️  Файл env.production не найден!"
        echo "📋 Создаю env.production из шаблона..."
        cp env.production.example env.production
        echo "✅ Файл env.production создан из шаблона!"
        echo "⚠️  ВАЖНО: Заполните реальными значениями перед использованием!"
        echo "📝 Отредактируйте env.production и запустите скрипт снова"
        exit 1
    else
        echo "❌ Файл env.production не найден и шаблон env.production.example отсутствует!"
        echo "Запустите сначала: npm run setup:production"
        exit 1
    fi
fi

# Проверка Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI не установлен!"
    echo "Установите: npm i -g vercel"
    exit 1
fi

# Проверка авторизации в Vercel
echo "🔐 Проверка авторизации в Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "❌ Вы не авторизованы в Vercel CLI!"
    echo "Авторизуйтесь: vercel login"
    exit 1
fi

echo "✅ Vercel CLI готов!"

# Функция для настройки переменной окружения
setup_env_var() {
    local var_name=$1
    local var_value=$2

    if [ -z "$var_value" ]; then
        echo "⚠️  Переменная $var_name пустая, пропускаем..."
        return
    fi

    echo "📝 Настройка $var_name..."

    # Используем printf для автоматического ввода значения
    printf "$var_value\n" | vercel env add "$var_name" production --yes 2>/dev/null || {
        echo "⚠️  Переменная $var_name уже существует или ошибка настройки"
    }
}

# Чтение переменных из env.production и настройка в Vercel
echo "🔧 Настройка переменных окружения в Vercel..."

# Аутентификация
NEXTAUTH_SECRET=$(grep "^NEXTAUTH_SECRET=" env.production | cut -d'=' -f2-)
NEXTAUTH_URL=$(grep "^NEXTAUTH_URL=" env.production | cut -d'=' -f2-)

setup_env_var "NEXTAUTH_SECRET" "$NEXTAUTH_SECRET"
setup_env_var "NEXTAUTH_URL" "$NEXTAUTH_URL"

# Supabase
SUPABASE_URL=$(grep "^SUPABASE_URL=" env.production | cut -d'=' -f2-)
SUPABASE_ANON_KEY=$(grep "^SUPABASE_ANON_KEY=" env.production | cut -d'=' -f2-)
SUPABASE_SERVICE_ROLE_KEY=$(grep "^SUPABASE_SERVICE_ROLE_KEY=" env.production | cut -d'=' -f2-)
SUPABASE_DEFAULT_ORGANIZATION_ID=$(grep "^SUPABASE_DEFAULT_ORGANIZATION_ID=" env.production | cut -d'=' -f2-)

setup_env_var "SUPABASE_URL" "$SUPABASE_URL"
setup_env_var "SUPABASE_ANON_KEY" "$SUPABASE_ANON_KEY"
setup_env_var "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_ROLE_KEY"
setup_env_var "SUPABASE_DEFAULT_ORGANIZATION_ID" "$SUPABASE_DEFAULT_ORGANIZATION_ID"

# Client-side Supabase
NEXT_PUBLIC_SUPABASE_URL=$(grep "^NEXT_PUBLIC_SUPABASE_URL=" env.production | cut -d'=' -f2-)
NEXT_PUBLIC_SUPABASE_ANON_KEY=$(grep "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" env.production | cut -d'=' -f2-)

setup_env_var "NEXT_PUBLIC_SUPABASE_URL" "$NEXT_PUBLIC_SUPABASE_URL"
setup_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$NEXT_PUBLIC_SUPABASE_ANON_KEY"

# Redis
UPSTASH_REDIS_REST_URL=$(grep "^UPSTASH_REDIS_REST_URL=" env.production | cut -d'=' -f2-)
UPSTASH_REDIS_REST_TOKEN=$(grep "^UPSTASH_REDIS_REST_TOKEN=" env.production | cut -d'=' -f2-)

setup_env_var "UPSTASH_REDIS_REST_URL" "$UPSTASH_REDIS_REST_URL"
setup_env_var "UPSTASH_REDIS_REST_TOKEN" "$UPSTASH_REDIS_REST_TOKEN"

# OpenRouter
OPENROUTER_API_KEY=$(grep "^OPENROUTER_API_KEY=" env.production | cut -d'=' -f2-)

setup_env_var "OPENROUTER_API_KEY" "$OPENROUTER_API_KEY"

# Продакшен настройки
NODE_ENV=$(grep "^NODE_ENV=" env.production | cut -d'=' -f2-)
DEMO_MODE=$(grep "^DEMO_MODE=" env.production | cut -d'=' -f2-)
E2E_ONBOARDING_FAKE=$(grep "^E2E_ONBOARDING_FAKE=" env.production | cut -d'=' -f2-)

setup_env_var "NODE_ENV" "$NODE_ENV"
setup_env_var "DEMO_MODE" "$DEMO_MODE"
setup_env_var "E2E_ONBOARDING_FAKE" "$E2E_ONBOARDING_FAKE"

# Админ доступ
ADMIN_USERS=$(grep "^ADMIN_USERS=" env.production | cut -d'=' -f2-)

setup_env_var "ADMIN_USERS" "$ADMIN_USERS"

# Дополнительные секреты
JWT_SECRET=$(grep "^JWT_SECRET=" env.production | cut -d'=' -f2-)
ENCRYPTION_KEY=$(grep "^ENCRYPTION_KEY=" env.production | cut -d'=' -f2-)

setup_env_var "JWT_SECRET" "$JWT_SECRET"
setup_env_var "ENCRYPTION_KEY" "$ENCRYPTION_KEY"

# Backend API
BACKEND_API_URL=$(grep "^BACKEND_API_URL=" env.production | cut -d'=' -f2-)

setup_env_var "BACKEND_API_URL" "$BACKEND_API_URL"

# Kommo integration
KOMMO_OAUTH_REDIRECT_BASE=$(grep "^KOMMO_OAUTH_REDIRECT_BASE=" env.production | cut -d'=' -f2-)
KOMMO_WEBHOOK_SECRET=$(grep "^KOMMO_WEBHOOK_SECRET=" env.production | cut -d'=' -f2-)

setup_env_var "KOMMO_OAUTH_REDIRECT_BASE" "$KOMMO_OAUTH_REDIRECT_BASE"
setup_env_var "KOMMO_WEBHOOK_SECRET" "$KOMMO_WEBHOOK_SECRET"

echo ""
echo "🎉 VERCEL ENVIRONMENT VARIABLES НАСТРОЕНЫ!"
echo "=========================================="
echo ""
echo "📋 ПРОВЕРКА НАСТРОЙКИ:"
echo "vercel env ls"
echo ""
echo "🚀 ГОТОВ К ДЕПЛОЮ:"
echo "npm run vercel:deploy"
echo ""
echo "🌐 ПРОДАКШЕН URL:"
echo "https://gpt-agent-kwid-1i1j7zlgl-world-wide-services-62780b79.vercel.app"
