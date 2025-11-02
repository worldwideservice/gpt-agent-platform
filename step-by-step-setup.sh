#!/bin/bash
# ПОШАГОВАЯ НАСТРОЙКА ПРОДАКШЕНА

set -e

echo "🚀 ПОШАГОВАЯ НАСТРОЙКА ПРОДАКШЕНА"
echo "================================="
echo ""
echo "Этот скрипт проведет вас через все шаги по очереди."
echo ""

# Шаг 1: Сбор ключей
echo "🔑 ШАГ 1: Получение API ключей"
echo "=============================="
echo ""
echo "📋 Вам нужно получить эти ключи:"
echo ""
echo "1. SUPABASE_ANON_KEY и SUPABASE_SERVICE_ROLE_KEY:"
echo "   Перейдите: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/settings/api"
echo "   Скопируйте 'anon public' и 'service_role secret'"
echo ""
echo "2. OPENROUTER_API_KEY:"
echo "   Перейдите: https://openrouter.ai/keys"
echo "   Создайте новый API ключ"
echo ""
echo "3. VERCEL_API_TOKEN (опционально):"
echo "   Перейдите: https://vercel.com/account/tokens"
echo "   Создайте новый токен"
echo ""
read -p "Готовы продолжить? (y/n): " ready
if [ "$ready" != "y" ]; then
    echo "Настройка отменена."
    exit 0
fi

# Шаг 2: Выполнение миграций
echo ""
echo "🗄️  ШАГ 2: Выполнение SQL миграций"
echo "================================="
echo ""
echo "Сейчас будет запущен скрипт automated-migrations.js"
echo "Он запросит ваши Supabase ключи и выполнит все миграции автоматически."
echo ""

read -p "Запустить миграции? (y/n): " run_migrations
if [ "$run_migrations" = "y" ]; then
    echo "Запуск automated-migrations.js..."
    node automated-migrations.js
    echo "✅ Миграции завершены!"
else
    echo "⚠️  Миграции пропущены. Выполните их вручную в Supabase Dashboard -> SQL Editor"
    echo "Используйте файл: scripts/apply-all-setup.sql"
fi

# Шаг 3: Настройка Vercel
echo ""
echo "🌐 ШАГ 3: Настройка Vercel Environment"
echo "====================================="
echo ""
echo "Сейчас будет запущен скрипт setup-vercel-env.js"
echo "Он запросит ваши ключи и настроит Vercel автоматически."
echo ""

read -p "Запустить настройку Vercel? (y/n): " run_vercel
if [ "$run_vercel" = "y" ]; then
    echo "Запуск setup-vercel-env.js..."
    node setup-vercel-env.js
    echo "✅ Vercel настроен!"
else
    echo "⚠️  Vercel настройка пропущена."
    echo ""
    echo "📋 Ручная настройка Vercel Environment Variables:"
    echo "   Перейдите: https://vercel.com/dashboard"
    echo "   Проект: gpt-agent-kwid"
    echo "   Добавьте переменные из файла production-env-template.sh"
fi

# Шаг 4: Authentication URLs
echo ""
echo "🔐 ШАГ 4: Настройка Authentication URLs"
echo "======================================"
echo ""
echo "📋 Настройте Redirect URLs в Supabase:"
echo "   Перейдите: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/auth/settings"
echo ""
echo "Добавьте эти URLs:"
echo "https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/api/auth/callback/*"
echo "https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/integrations/kommo/oauth/callback"
echo ""
read -p "Настроили redirect URLs? (y/n): " auth_done
if [ "$auth_done" != "y" ]; then
    echo "⚠️  Не забудьте настроить redirect URLs!"
fi

# Финал
echo ""
echo "🎉 НАСТРОЙКА ЗАВЕРШЕНА!"
echo "======================"
echo ""
echo "🌟 Production URL: https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app"
echo ""
echo "📋 Следующие шаги:"
echo "1. Перейдите на сайт"
echo "2. Зарегистрируйтесь (/register)"
echo "3. Создайте организацию"
echo "4. Настройте AI агентов (/manage/[org-id]/ai-agents)"
echo "5. Подключите CRM (/manage/[org-id]/integrations)"
echo ""
echo "🚀 Ваш GPT Agent Platform готов к работе!"
