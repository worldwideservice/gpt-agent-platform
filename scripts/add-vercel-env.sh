#!/bin/bash

# СКРИПТ ДЛЯ ДОБАВЛЕНИЯ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ В VERCEL
# Запуск: bash scripts/add-vercel-env.sh

set -e

echo "🚀 ДОБАВЛЕНИЕ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ В VERCEL"
echo "=========================================="

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

# Проверяем наличие env.production файла
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
        echo "Запустите скрипт настройки сначала"
        exit 1
    fi
fi

echo "📋 ЧИТАЕМ ПЕРЕМЕННЫЕ ИЗ env.production..."

# Читаем переменные из файла
declare -A env_vars

while IFS='=' read -r key value; do
    # Пропускаем комментарии и пустые строки
    [[ $key =~ ^[[:space:]]*# ]] && continue
    [[ -z "$key" ]] && continue

    # Убираем пробелы и кавычки
    key=$(echo "$key" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
    value=$(echo "$value" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | sed 's/^["\']//' | sed 's/["\']$//')

    # Пропускаем переменные со значениями по умолчанию
    if [[ $value == *"your-"* ]] || [[ $value == *"change-me"* ]] || [[ -z "$value" ]]; then
        echo "⚠️  Пропускаем $key (не настроена)"
        continue
    fi

    env_vars["$key"]="$value"
    echo "✅ Найдена переменная: $key"
done < env.production

echo ""
echo "🔧 ДОБАВЛЯЕМ ПЕРЕМЕННЫЕ В VERCEL..."
echo ""

# Добавляем каждую переменную
for key in "${!env_vars[@]}"; do
    value="${env_vars[$key]}"

    echo "📝 Добавляем $key..."
    if vercel env add "$key" production 2>/dev/null << EOF
$value
EOF
    then
        echo "✅ $key добавлена успешно"
    else
        echo "⚠️  Не удалось добавить $key автоматически"
        echo "   Добавьте вручную в Vercel Dashboard:"
        echo "   Key: $key"
        echo "   Value: $value"
    fi
done

echo ""
echo "🎉 НАСТРОЙКА VERCEL ЗАВЕРШЕНА!"
echo "==============================="
echo ""
echo "📋 СЛЕДУЮЩИЕ ШАГИ:"
echo "=================="
echo "1️⃣  Проверьте переменные в Vercel Dashboard:"
echo "   👉 https://vercel.com/dashboard"
echo ""
echo "2️⃣  Запустите деплой:"
echo "   vercel --prod"
echo ""
echo "3️⃣  Или используйте npm скрипт:"
echo "   npm run vercel:deploy"
echo ""
echo "4️⃣  Проверьте работу приложения:"
echo "   🌐 https://gpt-agent-kwid-1i1j7zlgl-world-wide-services-62780b79.vercel.app"