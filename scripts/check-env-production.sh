#!/bin/bash

# Скрипт для проверки переменных окружения в production
# Использование: ./scripts/check-env-production.sh

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🔍 Проверка переменных окружения для production"
echo "================================================"
echo ""

# Список обязательных переменных для Frontend (Vercel)
FRONTEND_VARS=(
  "NEXTAUTH_SECRET"
  "NEXTAUTH_URL"
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "UPSTASH_REDIS_REST_URL"
  "UPSTASH_REDIS_REST_TOKEN"
  "ENCRYPTION_KEY"
  "SENTRY_DSN"
  "NEXT_PUBLIC_SENTRY_DSN"
  "NODE_ENV"
)

# Список обязательных переменных для Worker (Railway)
WORKER_VARS=(
  "UPSTASH_REDIS_REST_URL"
  "UPSTASH_REDIS_REST_TOKEN"
  "SUPABASE_URL"
  "SUPABASE_SERVICE_ROLE_KEY"
  "ENCRYPTION_KEY"
  "JOB_QUEUE_NAME"
  "JOB_CONCURRENCY"
  "PORT"
  "NODE_ENV"
)

# Опциональные переменные
OPTIONAL_VARS=(
  "OPENROUTER_API_KEY"
  "SENTRY_DSN"
)

echo "📋 Инструкции по проверке:"
echo ""
echo "1. **Vercel (Frontend):**"
echo "   Откройте: https://vercel.com/dashboard → Ваш проект → Settings → Environment Variables"
echo ""
echo "2. **Railway (Worker):**"
echo "   Откройте: https://railway.app → Ваш проект → Worker Service → Variables"
echo ""
echo "================================================"
echo ""

# Проверка Frontend переменных
echo "🌐 Frontend (Vercel) - Обязательные переменные:"
echo ""

MISSING_FRONTEND=0
for var in "${FRONTEND_VARS[@]}"; do
  echo -n "  - $var: "
  echo -e "${YELLOW}[Проверьте вручную в Vercel Dashboard]${NC}"
done

echo ""
echo "📝 Опциональные переменные (рекомендуется):"
for var in "${OPTIONAL_VARS[@]}"; do
  echo -n "  - $var: "
  echo -e "${YELLOW}[Проверьте вручную в Vercel Dashboard]${NC}"
done

echo ""
echo "================================================"
echo ""

# Проверка Worker переменных
echo "⚙️  Worker (Railway) - Обязательные переменные:"
echo ""

MISSING_WORKER=0
for var in "${WORKER_VARS[@]}"; do
  echo -n "  - $var: "
  echo -e "${YELLOW}[Проверьте вручную в Railway Dashboard]${NC}"
done

echo ""
echo "📝 Опциональные переменные (рекомендуется):"
for var in "${OPTIONAL_VARS[@]}"; do
  echo -n "  - $var: "
  echo -e "${YELLOW}[Проверьте вручную в Railway Dashboard]${NC}"
done

echo ""
echo "================================================"
echo ""

# Проверка endpoints
echo "🔗 Проверка endpoints:"
echo ""

check_endpoint() {
  local url=$1
  local name=$2
  
  echo -n "  - $name ($url): "
  if curl -s -f -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|404"; then
    echo -e "${GREEN}✅ Доступен${NC}"
    return 0
  else
    echo -e "${RED}❌ Недоступен${NC}"
    return 1
  fi
}

# Проверка Frontend Health Check
check_endpoint "https://gpt-agent-kwid.vercel.app/api/health" "Frontend Health Check" || true

# Проверка Worker Health Check
check_endpoint "https://gpt-agent-platform-production.up.railway.app/health" "Worker Health Check" || true

# Проверка Worker Metrics
check_endpoint "https://gpt-agent-platform-production.up.railway.app/metrics" "Worker Metrics" || true

echo ""
echo "================================================"
echo ""

# Важные замечания
echo "⚠️  Важные замечания:"
echo ""
echo "1. ENCRYPTION_KEY должен быть минимум 32 символа"
echo "2. JOB_CONCURRENCY должен быть установлен в 25 для высокой нагрузки"
echo "3. NODE_ENV должен быть 'production'"
echo "4. PORT для Worker должен быть 3001"
echo "5. SENTRY_DSN опционально, но рекомендуется для мониторинга"
echo ""

echo "================================================"
echo ""
echo -e "${GREEN}✅ Проверка завершена${NC}"
echo ""
echo "💡 Следующие шаги:"
echo "1. Проверьте все переменные в Vercel Dashboard"
echo "2. Проверьте все переменные в Railway Dashboard"
echo "3. Убедитесь, что все endpoints доступны"
echo "4. Проверьте логи Worker для ошибок подключения"
echo ""

