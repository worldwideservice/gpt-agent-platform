#!/bin/bash

# ПОЛНАЯ АВТОМАТИЧЕСКАЯ НАСТРОЙКА ПРОДАКШЕНА
# Запуск: bash scripts/setup-production.sh

set -e

echo "🚀 ПОЛНАЯ НАСТРОЙКА ПРОДАКШЕНА"
echo "================================"
echo ""
echo "Этот скрипт поможет настроить:"
echo "✅ Supabase проект и базу данных"
echo "✅ Upstash Redis для background jobs"
echo "✅ OpenRouter API для ИИ"
echo "✅ Все переменные окружения"
echo "✅ Финальную проверку"
echo ""

# Проверка зависимостей
echo "🔍 Проверка зависимостей..."
command -v curl >/dev/null 2>&1 || { echo "❌ curl не найден! Установите curl."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js не найден! Установите Node.js."; exit 1; }

echo "✅ Зависимости проверены!"
echo ""

# Шаг 1: Генерация секретов
echo "🔐 ШАГ 1: ГЕНЕРАЦИЯ ПРОДАКШЕН СЕКРЕТОВ"
echo "======================================"

if [ ! -f "env.production" ]; then
    if [ -f "env.production.example" ]; then
        echo "📋 Копирую env.production.example в env.production..."
        cp env.production.example env.production
        
        # Генерируем случайные секреты
        node -e "
        const crypto = require('crypto');
        const fs = require('fs');
        let content = fs.readFileSync('env.production', 'utf8');
        
        // Заменяем placeholder-значения на сгенерированные
        content = content.replace(/NEXTAUTH_SECRET=your_secure_random_secret_32_chars_minimum/, 
            'NEXTAUTH_SECRET=' + crypto.randomBytes(32).toString('hex'));
        content = content.replace(/JWT_SECRET=your_secure_random_secret_32_chars_minimum/, 
            'JWT_SECRET=' + crypto.randomBytes(32).toString('hex'));
        content = content.replace(/ENCRYPTION_KEY=your_32_char_encryption_key/, 
            'ENCRYPTION_KEY=' + crypto.randomBytes(32).toString('base64').substring(0, 32));
        
        fs.writeFileSync('env.production', content);
        console.log('✅ env.production создан из шаблона с автоматически сгенерированными секретами!');
        "
    else
        echo "❌ env.production.example не найден, создаю базовый файл..."
        node -e "
        const crypto = require('crypto');
        const fs = require('fs');
        const baseConfig = \`# === ПРОДАКШЕН КОНФИГУРАЦИЯ ===
# 🔐 СКОПИРУЙТЕ ЭТИ ЗНАЧЕНИЯ В VERCEL DASHBOARD

# === АУТЕНТИФИКАЦИЯ ===
NEXTAUTH_SECRET=\${crypto.randomBytes(32).toString('hex')}
NEXTAUTH_URL=https://your-production-domain.vercel.app

# === ПРОДАКШЕН НАСТРОЙКИ ===
NODE_ENV=production
DEMO_MODE=false
E2E_ONBOARDING_FAKE=false

# === ДОПОЛНИТЕЛЬНЫЕ СЕКРЕТЫ ===
JWT_SECRET=\${crypto.randomBytes(32).toString('hex')}
ENCRYPTION_KEY=\${crypto.randomBytes(32).toString('base64').substring(0, 32)}

# === ЗАПОЛНИТЕ СЛЕДУЮЩИЕ ЗНАЧЕНИЯ ===
# SUPABASE_URL=https://your-project-ref.supabase.co
# SUPABASE_ANON_KEY=your_supabase_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# UPSTASH_REDIS_REST_URL=https://your-redis-id.upstash.io
# UPSTASH_REDIS_REST_TOKEN=your_upstash_token
# OPENROUTER_API_KEY=sk-or-v1-your-openrouter-api-key
\`;
        fs.writeFileSync('env.production', baseConfig);
        console.log('✅ env.production создан!');
        "
    fi
else
    echo "⚠️  env.production уже существует, пропускаем генерацию секретов"
fi

echo ""

# Шаг 2: Настройка Supabase
echo "🗄️  ШАГ 2: НАСТРОЙКА SUPABASE"
echo "============================"

read -p "❓ Хотите автоматически создать Supabase проект? (y/n): " SETUP_SUPABASE

if [[ $SETUP_SUPABASE =~ ^[Yy]$ ]]; then
    echo "🚀 Запуск настройки Supabase..."
    bash scripts/setup-supabase.sh

    if [ $? -eq 0 ]; then
        echo "✅ Supabase настроен успешно!"
    else
        echo "❌ Ошибка настройки Supabase"
        echo "Вы можете настроить его вручную позже"
    fi
else
    echo "⏭️  Пропускаем автоматическую настройку Supabase"
    echo "📋 Ручная настройка:"
    echo "   1. Создайте проект в https://supabase.com"
    echo "   2. Выполните SQL из scripts/setup-production-database.sql"
    echo "   3. Добавьте ключи в env.production"
fi

echo ""

# Шаг 3: Настройка Redis
echo "🔴 ШАГ 3: НАСТРОЙКА REDIS (UPSTASH)"
echo "==================================="

read -p "❓ Хотите настроить Upstash Redis? (y/n): " SETUP_REDIS

if [[ $SETUP_REDIS =~ ^[Yy]$ ]]; then
    echo "🚀 Запуск настройки Redis..."
    bash scripts/setup-redis.sh

    if [ $? -eq 0 ]; then
        echo "✅ Redis настроен успешно!"
    else
        echo "❌ Ошибка настройки Redis"
        echo "Вы можете настроить его вручную позже"
    fi
else
    echo "⏭️  Пропускаем настройку Redis"
    echo "📋 Ручная настройка:"
    echo "   1. Создайте Redis в https://upstash.com"
    echo "   2. Добавьте REST URL и Token в env.production"
fi

echo ""

# Шаг 4: Настройка OpenRouter
echo "🤖 ШАГ 4: НАСТРОЙКА OPENROUTER API"
echo "==================================="

read -p "❓ Хотите настроить OpenRouter API? (y/n): " SETUP_OPENROUTER

if [[ $SETUP_OPENROUTER =~ ^[Yy]$ ]]; then
    echo "🚀 Запуск настройки OpenRouter..."
    bash scripts/setup-openrouter.sh

    if [ $? -eq 0 ]; then
        echo "✅ OpenRouter настроен успешно!"
    else
        echo "❌ Ошибка настройки OpenRouter"
        echo "Вы можете настроить его вручную позже"
    fi
else
    echo "⏭️  Пропускаем настройку OpenRouter"
    echo "📋 Ручная настройка:"
    echo "   1. Получите ключ на https://openrouter.ai/keys"
    echo "   2. Добавьте OPENROUTER_API_KEY в env.production"
fi

echo ""

# Шаг 5: Финальная проверка
echo "🔍 ШАГ 5: ФИНАЛЬНАЯ ПРОВЕРКА"
echo "============================"

if [ -f "env.production" ]; then
    echo "📋 Содержимое env.production:"
    echo "============================"
    cat env.production
    echo "============================"
    echo ""

    echo "🔍 Запуск проверки переменных..."
    npm run verify:env

    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 ВСЕ ПРОВЕРКИ ПРОШЛИ УСПЕШНО!"
        echo "==============================="
        echo ""
        echo "🚀 ГОТОВ К ДЕПЛОЮ В ПРОДАКШЕН!"
        echo ""
        echo "📋 ПОСЛЕДНИЕ ШАГИ:"
        echo "=================="
        echo "1️⃣  Скопируйте все переменные из env.production в Vercel Dashboard"
        echo "   👉 https://vercel.com/dashboard"
        echo ""
        echo "2️⃣  Нажмите 'Deploy' в Vercel для применения изменений"
        echo ""
        echo "3️⃣  Проверьте работу приложения:"
        echo "   🌐 https://gpt-agent-kwid-1i1j7zlgl-world-wide-services-62780b79.vercel.app"
        echo ""
        echo "4️⃣  Запустите background worker (опционально):"
        echo "   - Настройте Railway/Heroku/VPS для worker"
        echo "   - Используйте те же переменные окружения"
        echo ""
        echo "🎯 ПРОДАКШЕН ГОТОВ К ИСПОЛЬЗОВАНИЮ!"
    else
        echo ""
        echo "⚠️  ЕСТЬ ПРОБЛЕМЫ С КОНФИГУРАЦИЕЙ!"
        echo "==================================="
        echo "Исправьте ошибки и запустите проверку снова:"
        echo "npm run verify:env"
    fi
else
    echo "❌ Файл env.production не найден!"
    echo "Запустите скрипт заново"
    exit 1
fi
