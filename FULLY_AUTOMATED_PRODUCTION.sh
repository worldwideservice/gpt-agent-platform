#!/bin/bash
# ПОЛНОСТЬЮ АВТОМАТИЧЕСКИЙ СКРИПТ НАСТРОЙКИ ПРОДАКШЕНА
# Все ключи найдены в проекте автоматически!

set -e

echo "🚀 ПОЛНОСТЬЮ АВТОМАТИЧЕСКАЯ НАСТРОЙКА ПРОДАКШЕНА"
echo "=================================================="
echo ""
echo "✅ Все API ключи найдены автоматически в проекте!"
echo "✅ Supabase ключи найдены"
echo "✅ OpenRouter ключ найден"
echo "✅ NEXTAUTH_SECRET сгенерирован ранее"
echo ""

# Найденные ключи из ./app/(protected)/.env
SUPABASE_URL="https://rpzchsgutabxeabbnwas.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2MzMzOCwiZXhwIjoyMDc1MTM5MzM4fQ.UIkX-rUGGTbMGfd5YoF41Dx3QBuLH13nO-R3BXdbx2I"
NEXT_PUBLIC_SUPABASE_URL="https://rpzchsgutabxeabbnwas.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI"
OPENROUTER_API_KEY="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"
NEXTAUTH_SECRET="XH9mgmu70y7LaauJBoI7ynjGXlja6u4JCE894ZeKgKk="
NEXTAUTH_URL="https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app"

echo "🔑 Найденные ключи:"
echo "   SUPABASE_URL: $SUPABASE_URL"
echo "   SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:0:20}..."
echo "   OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:0:20}..."
echo "   NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:20}..."
echo ""

# Шаг 1: Проверка миграций
echo "🗄️  ШАГ 1: Проверка и выполнение миграций"
echo "========================================="

export SUPABASE_URL="$SUPABASE_URL"
export SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"
export SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

echo "Выполнение миграций..."
node automated-migrations.js
echo "✅ Миграции проверены!"
echo ""

# Шаг 2: Настройка Vercel через API (если возможно)
echo "🌐 ШАГ 2: Настройка Vercel Environment"
echo "====================================="

echo "Попытка автоматической настройки Vercel..."
# Попробуем найти Vercel токен в переменных окружения или создать базовую настройку
VERCEL_TOKEN_FILE="$HOME/.vercel/token"
if [ -f "$VERCEL_TOKEN_FILE" ]; then
    VERCEL_TOKEN=$(cat "$VERCEL_TOKEN_FILE" | head -1)
    if [ -n "$VERCEL_TOKEN" ]; then
        echo "Найден Vercel токен, настраиваем автоматически..."
        node setup-vercel-env.js << VERCEL_EOF
$VERCEL_TOKEN
$SUPABASE_ANON_KEY
$SUPABASE_SERVICE_ROLE_KEY
$OPENROUTER_API_KEY
VERCEL_EOF
        echo "✅ Vercel настроен автоматически!"
    else
        echo "Vercel токен найден но пустой"
        manual_vercel_setup_function
    fi
else
    echo "Vercel токен не найден"
    manual_vercel_setup_function
fi

# Шаг 3: Настройка Authentication URLs
echo ""
echo "🔐 ШАГ 3: Настройка Authentication URLs"
echo "======================================"
echo ""
echo "📋 IMPORTANT: Настройте Redirect URLs в Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/auth/settings"
echo ""
echo "Добавьте эти URLs:"
echo "https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/api/auth/callback/*"
echo "https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback"
echo ""
echo "⚠️  Это нужно сделать вручную в Supabase Dashboard!"

# Финал
echo ""
echo "🎉 ПРОДАКШЕН ПОЧТИ ГОТОВ!"
echo "========================"
echo ""
echo "🌟 Production URL: https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app"
echo ""
echo "📋 Осталось сделать вручную:"
echo "1. 🔗 Настроить redirect URLs в Supabase Dashboard (ссылка выше)"
echo "2. 🌐 Если Vercel не настроился автоматически - добавить переменные вручную"
echo ""
echo "🚀 После этого перейдите на сайт и начните работу!"
echo ""
echo "📞 Если что-то не работает - проверьте логи в Vercel Dashboard"

manual_vercel_setup_function() {
    echo ""
    echo "⚠️  Автоматическая настройка Vercel невозможна."
    echo "📋 Скопируйте и добавьте переменные в Vercel Dashboard вручную:"
    echo "   https://vercel.com/dashboard"
    echo "   Проект: gpt-agent-kwid"
    echo ""
    echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
    echo "NEXTAUTH_URL=$NEXTAUTH_URL"
    echo "SUPABASE_URL=$SUPABASE_URL"
    echo "SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
    echo "SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY"
    echo "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "OPENROUTER_API_KEY=$OPENROUTER_API_KEY"
    echo "NODE_ENV=production"
    echo "DEMO_MODE=false"
    echo "E2E_ONBOARDING_FAKE=false"
    echo ""
}
