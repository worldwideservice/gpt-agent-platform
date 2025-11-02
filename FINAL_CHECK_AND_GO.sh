#!/bin/bash
# ФИНАЛЬНАЯ ПРОВЕРКА И ЗАПУСК ПРОДАКШЕНА

echo "🎯 ФИНАЛЬНАЯ ПРОВЕРКА ПРОДАКШЕНА"
echo "================================="
echo ""

echo "📋 Выполнено:"
echo "✅ Переменные в Vercel исправлены"
echo "✅ Redirect URLs в Supabase добавлены"
echo ""

echo "🔍 Запускаю проверку..."
echo ""

# Проверка Vercel
echo "🌐 Проверка Vercel..."
VERCEL_CHECK=$(curl -s -w "%{http_code}" -o /dev/null https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app/api/health)

if [ "$VERCEL_CHECK" = "200" ]; then
    echo "✅ Vercel: OK (HTTP $VERCEL_CHECK)"
else
    echo "❌ Vercel: Ошибка (HTTP $VERCEL_CHECK)"
    echo "   Подождите еще 2-3 минуты пока передеплой завершится"
    exit 1
fi

# Проверка Supabase
echo ""
echo "🗄️ Проверка Supabase..."
SUPABASE_CHECK=$(curl -s "https://rpzchsgutabxeabbnwas.supabase.co/rest/v1/" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjMzMzgsImV4cCI6MjA3NTEzOTMzOH0.aDEY7EQQLf8kd-H4cOWJbFzalkG9pjHkhOo6pkVDlLI" \
  -w "%{http_code}" 2>/dev/null | tail -1)

if [ "$SUPABASE_CHECK" = "200" ]; then
    echo "✅ Supabase: OK (HTTP $SUPABASE_CHECK)"
else
    echo "❌ Supabase: Ошибка (HTTP $SUPABASE_CHECK)"
    exit 1
fi

echo ""
echo "🎉 ВСЁ РАБОТАЕТ!"
echo ""
echo "🚀 Production URL: https://gpt-agent-kwid-5rtehrrok-world-wide-services-62780b79.vercel.app"
echo ""
echo "📋 Что делать:"
echo "1. Перейдите на сайт"
echo "2. Зарегистрируйтесь (/register)"
echo "3. Создайте организацию"
echo "4. Настройте AI агентов (/manage/[org-id]/ai-agents)"
echo ""
echo "🎊 ВАШ GPT AGENT PLATFORM ГОТОВ К РАБОТЕ!"
