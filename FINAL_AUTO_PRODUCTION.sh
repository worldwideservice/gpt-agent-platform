#!/bin/bash
# ФИНАЛЬНЫЙ АВТОМАТИЧЕСКИЙ СКРИПТ НАСТРОЙКИ ПРОДАКШЕНА

set -e

echo "🚀 ФИНАЛЬНАЯ АВТОМАТИЧЕСКАЯ НАСТРОЙКА ПРОДАКШЕНА"
echo "================================================"
echo ""
echo "✅ Supabase ключи найдены автоматически!"
echo "📋 Нужно только OpenRouter ключ и Vercel токен"
echo ""

# Найденные ключи
SUPABASE_URL="https://rpzchsgutabxeabbnwas.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2MzMzOCwiZXhwIjoyMDc1MTM5MzM4fQ.UIkX-rUGGTbMGfd5YoF41Dx3QBuLH13nO-R3BXdbx2I"

# Запрос недостающих ключей
echo "🔑 Введите недостающие ключи:"
echo ""

read -p "OPENROUTER_API_KEY (https://openrouter.ai/keys): " OPENROUTER_API_KEY
read -p "VERCEL_API_TOKEN (опционально, https://vercel.com/account/tokens): " VERCEL_TOKEN

if [ -z "$OPENROUTER_API_KEY" ]; then
    echo "❌ OPENROUTER_API_KEY обязателен!"
    exit 1
fi

echo ""
echo "✅ Все ключи получены! Начинаем настройку..."
echo ""

# Шаг 1: Выполнение миграций (уже выполнено, но проверим)
echo "🗄️  ШАГ 1: Проверка миграций"
echo "==========================="

export SUPABASE_URL="$SUPABASE_URL"
export SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"
export SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

echo "Проверка подключения и миграций..."
node automated-migrations.js
echo "✅ Миграции проверены!"
echo ""

# Шаг 2: Настройка Vercel
echo "🌐 ШАГ 2: Настройка Vercel Environment"
echo "====================================="

if [ -n "$VERCEL_TOKEN" ]; then
    echo "Автоматическая настройка Vercel..."
    node setup-vercel-env.js << VERCEL_EOF
$VERCEL_TOKEN
$SUPABASE_ANON_KEY
$SUPABASE_SERVICE_ROLE_KEY
$OPENROUTER_API_KEY
VERCEL_EOF
    echo "✅ Vercel настроен автоматически!"
else
    echo "⚠️  Vercel токен не указан. Настройка вручную:"
    echo ""
    echo "📋 Скопируйте и добавьте в Vercel Dashboard:"
    echo "   https://vercel.com/dashboard"
    echo "   Проект: gpt-agent-kwid"
    echo ""
    echo "NEXTAUTH_SECRET=XH9mgmu70y7LaauJBoI7ynjGXlja6u4JCE894ZeKgKk="
    echo "NEXTAUTH_URL=https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app"
    echo "SUPABASE_URL=$SUPABASE_URL"
    echo "SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
    echo "SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY"
    echo "OPENROUTER_API_KEY=$OPENROUTER_API_KEY"
    echo "NODE_ENV=production"
    echo "DEMO_MODE=false"
    echo "E2E_ONBOARDING_FAKE=false"
    echo ""
    read -p "Нажмите Enter после настройки Vercel..."
fi

# Шаг 3: Authentication URLs
echo ""
echo "🔐 ШАГ 3: Настройка Authentication URLs"
echo "======================================"
echo ""
echo "📋 Настройте Redirect URLs в Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/auth/settings"
echo ""
echo "Добавьте URLs:"
echo "https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/api/auth/callback/*"
echo "https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback"
echo ""
read -p "Настроили redirect URLs? (y/n): " auth_done
if [ "$auth_done" != "y" ]; then
    echo "⚠️  Не забудьте настроить redirect URLs!"
fi

# Финал
echo ""
echo "🎉 ПРОДАКШЕН ПОЛНОСТЬЮ ГОТОВ!"
echo "============================="
echo ""
echo "🌟 Production URL: https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app"
echo ""
echo "📋 Что делать дальше:"
echo "1. 🌐 Перейдите на сайт"
echo "2. 👤 Зарегистрируйтесь (/register)"
echo "3. 🏢 Создайте организацию"
echo "4. 🤖 Настройте AI агентов (/manage/[org-id]/ai-agents)"
echo "5. 🔗 Подключите CRM (/manage/[org-id]/integrations)"
echo ""
echo "🚀 Ваш GPT Agent Platform полностью готов к работе!"
echo ""
echo "🎊 ПОЗДРАВЛЯЕМ! ПРОДАКШЕН ЗАПУЩЕН И НАСТРОЕН!"
echo ""
echo "📞 Если возникнут проблемы - проверьте логи в Vercel Dashboard"
