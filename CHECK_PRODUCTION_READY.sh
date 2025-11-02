#!/bin/bash
# ПРОВЕРКА ГОТОВНОСТИ ПРОДАКШЕНА

echo "🔍 ПРОВЕРКА ГОТОВНОСТИ ПРОДАКШЕНА"
echo "=================================="
echo ""

echo "📋 Проверяю подключение к сервисам..."
echo ""

# Проверка Vercel deployment
echo "🌐 Проверка Vercel deployment..."
VERCEL_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/api/health)
if [ "$VERCEL_RESPONSE" = "200" ]; then
    echo "✅ Vercel: Доступен (HTTP $VERCEL_RESPONSE)"
else
    echo "❌ Vercel: Недоступен (HTTP $VERCEL_RESPONSE)"
fi

# Проверка Supabase подключения
echo ""
echo "🗄️ Проверка Supabase подключения..."
SUPABASE_TEST=$(curl -s "https://rpzchsgutabxeabbnwas.supabase.co/rest/v1/" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI" \
  -w "%{http_code}" \
  2>/dev/null | tail -1)

if [ "$SUPABASE_TEST" = "200" ]; then
    echo "✅ Supabase: Доступен (HTTP $SUPABASE_TEST)"
else
    echo "❌ Supabase: Недоступен (HTTP $SUPABASE_TEST)"
fi

echo ""
echo "🎯 РЕЗУЛЬТАТ ПРОВЕРКИ:"
echo "======================"

if [ "$VERCEL_RESPONSE" = "200" ] && [ "$SUPABASE_TEST" = "200" ]; then
    echo "🎉 ПРОДАКШЕН ГОТОВ!"
    echo ""
    echo "🌟 Production URL: https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app"
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Перейдите на сайт"
    echo "2. Зарегистрируйтесь (/register)"
    echo "3. Создайте организацию"
    echo "4. Настройте AI агентов"
    echo ""
    echo "🚀 ВАШ GPT AGENT PLATFORM РАБОТАЕТ!"
else
    echo "⚠️  Есть проблемы с подключением."
    echo ""
    echo "📋 Возможные причины:"
    echo "- Переменные окружения не добавлены в Vercel"
    echo "- Redirect URLs не настроены в Supabase"
    echo "- Vercel еще передеплоит приложение"
    echo ""
    echo "🔄 Подождите 2-3 минуты и проверьте снова"
fi
