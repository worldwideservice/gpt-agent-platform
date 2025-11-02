#!/bin/bash

# Скрипт для настройки переменных окружения Kommo

echo "🔧 Настройка переменных окружения для тестирования Kommo API"
echo ""

# Проверка наличия .env.local
if [ ! -f ".env.local" ]; then
    echo "📝 Создание файла .env.local..."
    cat > .env.local << 'EOF'
# === KOMMO CRM TESTING (DEV ONLY) ===
KOMMO_TEST_ENABLED=0
KOMMO_TEST_DOMAIN=
KOMMO_TEST_CLIENT_ID=
KOMMO_TEST_CLIENT_SECRET=
KOMMO_TEST_REDIRECT_URI=http://localhost:3000/api/auth/kommo/callback
KOMMO_TEST_ACCESS_TOKEN=
KOMMO_TEST_REFRESH_TOKEN=
EOF
    echo "✅ Файл .env.local создан"
else
    echo "ℹ️  Файл .env.local уже существует"
fi

echo ""
echo "📋 Для настройки Kommo вам нужно:"
echo ""
echo "1. Зарегистрироваться или войти в Kommo: https://www.kommo.com/"
echo "2. Создать интеграцию в настройках аккаунта"
echo "3. Заполнить следующие переменные в .env.local:"
echo ""
echo "   KOMMO_TEST_ENABLED=1"
echo "   KOMMO_TEST_DOMAIN=ваш-домен-kommo"
echo "   KOMMO_TEST_CLIENT_ID=ваш-client-id"
echo "   KOMMO_TEST_CLIENT_SECRET=ваш-client-secret"
echo "   KOMMO_TEST_ACCESS_TOKEN=ваш-access-token"
echo "   KOMMO_TEST_REFRESH_TOKEN=ваш-refresh-token"
echo ""
echo "4. Перезапустите dev-сервер после обновления .env.local."
echo "5. Войдите в админку и продолжите подключение Kommo через встроенный мастер."
