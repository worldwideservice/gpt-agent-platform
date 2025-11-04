#!/bin/bash

# Проверка переменных окружения в Vercel и Railway
# Использование: ./scripts/check-env-vercel-railway.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "🔍 Проверка переменных окружения"
echo "================================="
echo ""

# Проверка Vercel CLI
if command -v vercel &> /dev/null; then
  echo -e "${GREEN}✅ Vercel CLI найден${NC}"
  echo ""
  echo "Проверка переменных окружения в Vercel..."
  echo "Для просмотра переменных выполните:"
  echo "  vercel env ls"
  echo ""
else
  echo -e "${YELLOW}⚠️  Vercel CLI не установлен${NC}"
  echo "Установите: npm install -g vercel"
  echo ""
fi

# Проверка Railway CLI
if command -v railway &> /dev/null; then
  echo -e "${GREEN}✅ Railway CLI найден${NC}"
  echo ""
  echo "Проверка переменных окружения в Railway..."
  echo "Для просмотра переменных выполните:"
  echo "  railway variables"
  echo ""
else
  echo -e "${YELLOW}⚠️  Railway CLI не установлен${NC}"
  echo "Установите: npm install -g @railway/cli"
  echo ""
fi

echo "📋 Обязательные переменные для проверки:"
echo ""
echo "VERCEL (Frontend):"
echo "  - NEXTAUTH_SECRET"
echo "  - NEXTAUTH_URL"
echo "  - SUPABASE_URL"
echo "  - SUPABASE_ANON_KEY"
echo "  - SUPABASE_SERVICE_ROLE_KEY"
echo "  - UPSTASH_REDIS_REST_URL"
echo "  - UPSTASH_REDIS_REST_TOKEN"
echo "  - OPENROUTER_API_KEY"
echo "  - ENCRYPTION_KEY"
echo "  - SENTRY_DSN"
echo "  - NEXT_PUBLIC_SENTRY_DSN"
echo ""
echo "RAILWAY (Worker):"
echo "  - UPSTASH_REDIS_REST_URL"
echo "  - UPSTASH_REDIS_REST_TOKEN"
echo "  - SUPABASE_URL"
echo "  - SUPABASE_SERVICE_ROLE_KEY"
echo "  - ENCRYPTION_KEY"
echo "  - JOB_QUEUE_NAME"
echo "  - JOB_CONCURRENCY"
echo "  - PORT"
echo "  - NODE_ENV"
echo ""

echo "📚 Инструкции:"
echo "  Vercel: https://vercel.com/dashboard → Ваш проект → Settings → Environment Variables"
echo "  Railway: https://railway.app → Ваш проект → Worker Service → Variables"
echo ""

