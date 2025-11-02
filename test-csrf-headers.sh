#!/bin/bash

echo "🔍 Тест CSRF в headers..."

# Запускаем сервер
npm run dev &
SERVER_PID=$!

# Ждем запуска сервера
sleep 5

# Определяем порт
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  PORT=3000
else
  echo "❌ Сервер не найден"
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

echo "✅ Сервер на порту $PORT"

# Получаем CSRF токен
CSRF_TOKEN=$(curl -s "http://localhost:$PORT/api/auth/csrf" | jq -r '.csrfToken')
echo "CSRF Token: ${CSRF_TOKEN:0:20}..."

# Пробуем отправить с токеном в headers
echo ""
echo "🔍 Отправляем с CSRF в headers..."
curl -s -X POST "http://localhost:$PORT/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -d "email=valid-test@example.com&password=Test123456!&redirect=false" \
  -c cookies.txt > /dev/null

# Проверяем сессию
echo ""
echo "🔍 Сессия после входа:"
curl -s "http://localhost:$PORT/api/auth/session" | jq '.user.name // "No session"'

# Останавливаем сервер
kill $SERVER_PID 2>/dev/null
echo ""
echo "✅ Тест завершен"
