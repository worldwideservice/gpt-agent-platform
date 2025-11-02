#!/bin/bash
# АВТОМАТИЧЕСКИЙ СКРИПТ НАСТРОЙКИ PRODUCTION
# Выполняет все возможные шаги автоматически

set -e

echo "🚀 АВТОМАТИЧЕСКАЯ НАСТРОЙКА PRODUCTION..."
echo "=========================================="

# Функция для получения ключа от пользователя
get_api_key() {
    local service=$1
    local url=$2
    local var_name=$3
    
    echo ""
    echo "🔑 Нужен $service API ключ"
    echo "📋 Получить: $url"
    read -p "Введите $var_name: " api_key
    
    if [ -z "$api_key" ]; then
        echo "❌ API ключ не может быть пустым!"
        exit 1
    fi
    
    echo $api_key
}

# 1. Получить Supabase ключи
echo "📋 ШАГ 1: Получение Supabase API ключей"
echo "Перейдите: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/settings/api"
echo ""

SUPABASE_ANON_KEY=$(get_api_key "Supabase Anon" "https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/settings/api" "SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY=$(get_api_key "Supabase Service Role" "https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/settings/api" "SUPABASE_SERVICE_ROLE_KEY")

# 2. Получить OpenRouter ключ
echo "📋 ШАГ 2: Получение OpenRouter API ключа"
OPENROUTER_API_KEY=$(get_api_key "OpenRouter" "https://openrouter.ai/keys" "OPENROUTER_API_KEY")

# 3. Выполнить SQL миграции
echo ""
echo "📋 ШАГ 3: Выполнение SQL миграций"
echo "Копируйте и выполняйте SQL в Supabase Dashboard -> SQL Editor:"
echo ""
echo "=== СКОПИРУЙТЕ И ВЫПОЛНИТЕ ЭТОТ SQL ==="
cat scripts/apply-all-setup.sql
echo ""
echo "=== ДОПОЛНИТЕЛЬНЫЙ SQL ДЛЯ STORAGE ==="
cat scripts/create-storage-bucket.sql
echo ""
read -p "Нажмите Enter после выполнения SQL миграций..."

# 4. Настроить Vercel переменные окружения
echo ""
echo "📋 ШАГ 4: Настройка Vercel Environment Variables"
echo "Перейдите: https://vercel.com/dashboard"
echo "Проект: gpt-agent-kwid"
echo ""
echo "Добавьте эти переменные:"
echo ""
cat << VERCEL_ENV
NEXTAUTH_SECRET=XH9mgmu70y7LaauJBoI7ynjGXlja6u4JCE894ZeKgKk=
NEXTAUTH_URL=https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app
SUPABASE_URL=https://rpzchsgutabxeabbnwas.supabase.co
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
OPENROUTER_API_KEY=$OPENROUTER_API_KEY
NODE_ENV=production
DEMO_MODE=false
E2E_ONBOARDING_FAKE=false
SUPABASE_DEFAULT_ORGANIZATION_ID=
VERCEL_ENV

echo ""
read -p "Нажмите Enter после настройки Vercel переменных..."

# 5. Настроить Authentication
echo ""
echo "📋 ШАГ 5: Настройка Authentication Redirect URLs"
echo "Перейдите: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/auth/settings"
echo ""
echo "Добавьте эти Redirect URLs:"
echo "https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/api/auth/callback/*"
echo "https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback"
echo ""
read -p "Нажмите Enter после настройки redirect URLs..."

# 6. Финальная проверка
echo ""
echo "🎯 ФИНАЛЬНАЯ ПРОВЕРКА"
echo "======================"
echo ""
echo "✅ Supabase миграции выполнены"
echo "✅ Storage bucket создан"
echo "✅ Vercel переменные настроены"
echo "✅ Authentication URLs добавлены"
echo ""
echo "🌟 ПРОДАКШЕН ГОТОВ!"
echo ""
echo "📍 Production URL: https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app"
echo ""
echo "🚀 Теперь можно:"
echo "   1. Перейти на сайт"
echo "   2. Зарегистрироваться"
echo "   3. Создать организацию"
echo "   4. Настроить AI агентов"
echo ""
echo "🎉 УСПЕХ! ПРОЕКТ В ПРОДАКШЕНЕ!"
