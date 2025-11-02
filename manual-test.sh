#!/bin/bash

echo "🎯 РУЧНОЙ ТЕСТ АУТЕНТИФИКАЦИИ"
echo "================================"

# Запускаем сервер
npm run dev &
SERVER_PID=$!

# Ждем запуска сервера
sleep 5

# Определяем порт сервера
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  PORT=3000
elif curl -s http://localhost:3001 > /dev/null 2>&1; then
  PORT=3001
elif curl -s http://localhost:3002 > /dev/null 2>&1; then
  PORT=3002
else
  echo "❌ Сервер не запущен"
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

echo "✅ Сервер работает на порту $PORT"

# Тестируем API аутентификации
echo ""
echo "🔍 Тестируем API аутентификации..."
curl -s -X POST "http://localhost:$PORT/api/test-authorize" \
  -H "Content-Type: application/json" \
  -d '{"email": "valid-test@example.com", "password": "Test123456!"}' | jq '.success'

# Тестируем NextAuth напрямую
echo ""
echo "🔍 Тестируем NextAuth сессию..."
curl -s "http://localhost:$PORT/api/auth/session" | jq '.'

# Тестируем вход через NextAuth
echo ""
echo "🔍 Тестируем вход через NextAuth..."
CSRF_TOKEN=$(curl -s "http://localhost:$PORT/api/auth/csrf" | jq -r '.csrfToken')
echo "CSRF Token: ${CSRF_TOKEN:0:20}..."

curl -s -X POST "http://localhost:$PORT/api/auth/callback/credentials" \
  -d "email=valid-test@example.com&password=Test123456!&csrfToken=$CSRF_TOKEN&redirect=false" \
  -c cookies.txt > /dev/null

# Проверяем сессию после входа
echo ""
echo "🔍 Проверяем сессию после входа..."
curl -s "http://localhost:$PORT/api/auth/session" | jq '.user.name // "No session"'

# Останавливаем сервер
kill $SERVER_PID 2>/dev/null
echo ""
echo "✅ Тест завершен"
