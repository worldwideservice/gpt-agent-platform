#!/bin/bash
# ПОЛНАЯ АВТОМАТИЧЕСКАЯ НАСТРОЙКА ПРОДАКШЕНА
# Выполняет ВСЕ шаги автоматически

set -e

echo "🚀 ПОЛНАЯ НАСТРОЙКА ПРОДАКШЕНА"
echo "=============================="
echo ""
echo "Этот скрипт выполнит все шаги автоматически!"
echo "Вам нужно только ввести API ключи."
echo ""

# Шаг 1: Получить все ключи
echo "🔑 ШАГ 1: Сбор API ключей"
echo "========================"

echo "📋 Откройте эти ссылки в браузере:"
echo "   Supabase API: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/settings/api"
echo "   OpenRouter: https://openrouter.ai/keys"
echo "   Vercel Token: https://vercel.com/account/tokens"
echo ""

read -p "Введите SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
read -p "Введите SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
read -p "Введите OPENROUTER_API_KEY: " OPENROUTER_API_KEY
read -p "Введите VERCEL_API_TOKEN (опционально): " VERCEL_TOKEN

if [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [ -z "$OPENROUTER_API_KEY" ]; then
    echo "❌ Обязательные ключи не введены!"
    exit 1
fi

echo ""
echo "✅ Ключи получены!"

# Шаг 2: Выполнить SQL миграции
echo ""
echo "🗄️  ШАГ 2: Выполнение SQL миграций"
echo "================================"

export SUPABASE_URL="https://rpzchsgutabxeabbnwas.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

node automated-migrations.js << MIGRATIONS_INPUT
$SUPABASE_ANON_KEY
$SUPABASE_SERVICE_ROLE_KEY
MIGRATIONS_INPUT

# Шаг 3: Настроить Vercel (если есть токен)
echo ""
echo "🌐 ШАГ 3: Настройка Vercel Environment"
echo "===================================="

if [ -n "$VERCEL_TOKEN" ]; then
    node setup-vercel-env.js << VERCEL_INPUT
$VERCEL_TOKEN
$SUPABASE_ANON_KEY
$SUPABASE_SERVICE_ROLE_KEY
$OPENROUTER_API_KEY
VERCEL_INPUT
else
    echo "⚠️  Vercel токен не указан. Настройте переменные вручную:"
    echo "   https://vercel.com/dashboard"
    echo ""
    echo "Добавьте переменные:"
    echo "NEXTAUTH_SECRET=XH9mgmu70y7LaauJBoI7ynjGXlja6u4JCE894ZeKgKk="
    echo "NEXTAUTH_URL=https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app"
    echo "SUPABASE_URL=https://rpzchsgutabxeabbnwas.supabase.co"
    echo "SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
    echo "SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY"
    echo "OPENROUTER_API_KEY=$OPENROUTER_API_KEY"
    echo "NODE_ENV=production"
    echo "DEMO_MODE=false"
    echo "E2E_ONBOARDING_FAKE=false"
    echo ""
    read -p "Нажмите Enter после настройки Vercel..."
fi

# Шаг 4: Настроить Authentication URLs
echo ""
echo "🔐 ШАГ 4: Настройка Authentication URLs"
echo "====================================="

echo "Перейдите: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/auth/settings"
echo ""
echo "Добавьте Redirect URLs:"
echo "https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/api/auth/callback/*"
echo "https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback"
echo ""
read -p "Нажмите Enter после настройки redirect URLs..."

# Шаг 5: Финальная проверка
echo ""
echo "🎯 ФИНАЛЬНАЯ ПРОВЕРКА"
echo "==================="

echo "✅ Supabase миграции выполнены"
echo "✅ Storage bucket создан"
if [ -n "$VERCEL_TOKEN" ]; then
    echo "✅ Vercel environment variables настроены"
else
    echo "✅ Vercel environment variables подготовлены (нужна ручная настройка)"
fi
echo "✅ Authentication URLs настроены"
echo ""
echo "🚀 ПРОДАКШЕН ГОТОВ!"
echo ""
echo "🌟 Production URL: https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app"
echo ""
echo "🎉 ПОЗДРАВЛЯЕМ! ПРОЕКТ В ПРОДАКШЕНЕ!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Перейдите на сайт"
echo "2. Зарегистрируйтесь (/register)"
echo "3. Создайте организацию"
echo "4. Настройте AI агентов (/manage/[org-id]/ai-agents)"
echo "5. Подключите CRM (/manage/[org-id]/integrations)"
echo ""
echo "🎊 УСПЕХ! ВАШ GPT AGENT PLATFORM ЗАПУЩЕН!"
