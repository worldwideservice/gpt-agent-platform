#!/bin/bash

# ФИНАЛЬНЫЙ ДЕПЛОЙ В VERCEL С АВТОМАТИЧЕСКОЙ НАСТРОЙКОЙ
# Запуск: bash scripts/deploy-to-vercel.sh

set -e

echo "🚀 ФИНАЛЬНЫЙ ПРОДАКШЕН ДЕПЛОЙ"
echo "=============================="

# Проверяем наличие Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI не установлен!"
    echo "📦 Установите: npm install -g vercel"
    exit 1
fi

# Проверяем авторизацию
if ! vercel whoami &> /dev/null; then
    echo "❌ Вы не авторизованы в Vercel CLI!"
    echo "🔑 Авторизуйтесь: vercel login"
    exit 1
fi

# Проверяем наличие env.production
if [ ! -f "env.production" ]; then
    echo "❌ Файл env.production не найден!"
    echo "Запустите настройку: npm run setup:production"
    exit 1
fi

echo "🔍 Проверяем переменные окружения..."
if ! npm run verify:env > /dev/null 2>&1; then
    echo "❌ Переменные окружения не настроены корректно!"
    echo "Запустите: npm run verify:env"
    exit 1
fi

echo "✅ Переменные окружения корректны"

# Добавляем переменные окружения в Vercel
echo ""
echo "🔧 ДОБАВЛЯЕМ ПЕРЕМЕННЫЕ В VERCEL..."

while IFS='=' read -r key value; do
    # Пропускаем комментарии и пустые строки
    [[ $key =~ ^[[:space:]]*# ]] && continue
    [[ -z "$key" ]] && continue

    # Убираем пробелы и кавычки
    key=$(echo "$key" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
    value=$(echo "$value" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | sed 's/^["\']//' | sed 's/["\']$//')

    # Пропускаем переменные со значениями по умолчанию
    if [[ $value == *"your-"* ]] || [[ $value == *"change-me"* ]] || [[ -z "$value" ]]; then
        continue
    fi

    echo "📝 Добавляем $key..."

    # Проверяем, существует ли уже переменная
    if vercel env ls production | grep -q "^$key"; then
        echo "⚠️  Переменная $key уже существует, обновляем..."
        # Обновляем существующую переменную
        echo "$value" | vercel env rm "$key" production -y >/dev/null 2>&1
    fi

    # Добавляем переменную
    if echo "$value" | vercel env add "$key" production >/dev/null 2>&1; then
        echo "✅ $key добавлена успешно"
    else
        echo "❌ Ошибка добавления $key"
        echo "   Добавьте вручную в Vercel Dashboard:"
        echo "   Key: $key"
        echo "   Value: $value"
    fi

done < env.production

echo ""
echo "🚀 ЗАПУСКАЕМ ПРОДАКШЕН ДЕПЛОЙ..."

# Деплой в продакшен
if vercel --prod --yes; then
    echo ""
    echo "🎉 ПРОДАКШЕН ДЕПЛОЙ УСПЕШЕН!"
    echo "=============================="
    echo ""
    echo "🌐 ПРОДАКШЕН URL:"
    echo "https://gpt-agent-kwid-1i1j7zlgl-world-wide-services-62780b79.vercel.app"
    echo ""
    echo "🔍 ПРОВЕРКА ЗДОРОВЬЯ:"
    echo "curl https://gpt-agent-kwid-1i1j7zlgl-world-wide-services-62780b79.vercel.app/api/health"
    echo ""
    echo "📊 МОНИТОРИНГ:"
    echo "- Vercel Dashboard: https://vercel.com/dashboard"
    echo "- Supabase Dashboard: https://supabase.com/dashboard"
    echo "- Upstash Dashboard: https://upstash.com"
    echo ""
    echo "🎯 ГОТОВО К ИСПОЛЬЗОВАНИЮ КЛИЕНТАМИ!"
else
    echo ""
    echo "❌ ОШИБКА ДЕПЛОЯ!"
    echo "=================="
    echo ""
    echo "🔍 ПРОВЕРЬТЕ ЛОГИ:"
    echo "vercel logs"
    echo ""
    echo "🔧 ВОЗМОЖНЫЕ ПРОБЛЕМЫ:"
    echo "- Переменные окружения не добавлены"
    echo "- Билд ошибки в коде"
    echo "- Проблемы с зависимостями"
    echo ""
    echo "📞 ПОДДЕРЖКА:"
    echo "- Vercel Logs: vercel logs --follow"
    echo "- Build Logs: Проверьте в Vercel Dashboard"
fi
