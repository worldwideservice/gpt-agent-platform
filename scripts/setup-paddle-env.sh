#!/bin/bash

echo "=================================================="
echo "ИНСТРУКЦИЯ: Настройка Paddle Environment Variables"
echo "=================================================="
echo ""
echo "Выполните следующие команды вручную или через Vercel Dashboard:"
echo ""
echo "1. NEXT_PUBLIC_PADDLE_CLIENT_TOKEN (production):"
echo "   vercel env add NEXT_PUBLIC_PADDLE_CLIENT_TOKEN production"
echo "   Значение: Получите из Paddle Dashboard → Developer tools → Authentication"
echo ""
echo "2. NEXT_PUBLIC_PADDLE_ENVIRONMENT (production):"
echo "   vercel env add NEXT_PUBLIC_PADDLE_ENVIRONMENT production"
echo "   Значение: sandbox (для тестирования) или production (для продакшна)"
echo ""
echo "3. Или добавьте через Vercel Dashboard:"
echo "   https://vercel.com/world-wide-services-62780b79/ton-18-platform/settings/environment-variables"
echo ""
echo "=================================================="
echo "БЫСТРАЯ НАСТРОЙКА ДЛЯ ТЕСТИРОВАНИЯ"
echo "=================================================="
echo ""
echo "Если у вас уже есть Paddle токен, добавьте в .env.local:"
echo ""
cat << 'ENVEOF'
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_ваш_токен_здесь
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
ENVEOF
echo ""
echo "Затем запустите:"
echo "  npm run dev"
echo ""
echo "=================================================="
