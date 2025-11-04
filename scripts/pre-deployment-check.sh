#!/bin/bash

# Pre-deployment validation script
# Проверяет готовность к production деплою
# Использование: ./scripts/pre-deployment-check.sh [environment]

set -euo pipefail

# Цвета для вывода
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ENVIRONMENT="${1:-production}"
ERRORS=0
WARNINGS=0

echo -e "${BLUE}🚀 Pre-deployment Validation${NC}"
echo -e "${BLUE}Environment: $ENVIRONMENT${NC}"
echo ""

# Функция для проверки и вывода результата
check() {
  local name="$1"
  local command="$2"
  local required="${3:-true}"
  
  echo -n "Checking $name... "
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
    return 0
  else
    if [ "$required" = "true" ]; then
      echo -e "${RED}❌ FAILED${NC}"
      ERRORS=$((ERRORS + 1))
      return 1
    else
      echo -e "${YELLOW}⚠️  WARNING${NC}"
      WARNINGS=$((WARNINGS + 1))
      return 0
    fi
  fi
}

# 1. Проверка TypeScript компиляции
echo "📦 Checking TypeScript compilation..."
if npm run type-check > /dev/null 2>&1; then
  echo -e "${GREEN}✅ TypeScript compilation OK${NC}"
else
  echo -e "${RED}❌ TypeScript compilation FAILED${NC}"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# 2. Проверка ESLint
echo "🔍 Checking ESLint..."
if npm run lint > /dev/null 2>&1; then
  echo -e "${GREEN}✅ ESLint OK${NC}"
else
  echo -e "${YELLOW}⚠️  ESLint warnings found${NC}"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 3. Проверка переменных окружения Frontend
echo "🔐 Checking Frontend environment variables..."
FRONTEND_VARS=(
  "NEXTAUTH_SECRET"
  "NEXTAUTH_URL"
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "ENCRYPTION_KEY"
)

for var in "${FRONTEND_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo -e "${RED}❌ Missing: $var${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}✅ $var is set${NC}"
  fi
done
echo ""

# 4. Проверка переменных окружения Worker
echo "🔐 Checking Worker environment variables..."
WORKER_VARS=(
  "UPSTASH_REDIS_REST_URL"
  "UPSTASH_REDIS_REST_TOKEN"
  "SUPABASE_URL"
  "SUPABASE_SERVICE_ROLE_KEY"
  "ENCRYPTION_KEY"
  "JOB_QUEUE_NAME"
  "JOB_CONCURRENCY"
)

for var in "${WORKER_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo -e "${RED}❌ Missing: $var${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}✅ $var is set${NC}"
  fi
done
echo ""

# 5. Проверка длины ENCRYPTION_KEY
if [ -n "${ENCRYPTION_KEY:-}" ]; then
  if [ ${#ENCRYPTION_KEY} -lt 32 ]; then
    echo -e "${RED}❌ ENCRYPTION_KEY must be at least 32 characters${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}✅ ENCRYPTION_KEY length OK${NC}"
  fi
fi
echo ""

# 6. Проверка наличия критичных файлов
echo "📁 Checking critical files..."
CRITICAL_FILES=(
  "services/worker/railway.json"
  "services/worker/Dockerfile"
  "services/worker/src/index.ts"
  "app/api/health/route.ts"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ $file exists${NC}"
  else
    echo -e "${RED}❌ Missing: $file${NC}"
    ERRORS=$((ERRORS + 1))
  fi
done
echo ""

# 7. Проверка Railway конфигурации
if [ -f "services/worker/railway.json" ]; then
  echo "🚂 Checking Railway configuration..."
  
  if grep -q '"numReplicas": 2' services/worker/railway.json; then
    echo -e "${GREEN}✅ numReplicas is set to 2${NC}"
  else
    echo -e "${YELLOW}⚠️  numReplicas should be 2 for high availability${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
  
  if grep -q '"restartPolicyType": "ON_FAILURE"' services/worker/railway.json; then
    echo -e "${GREEN}✅ restartPolicyType is ON_FAILURE${NC}"
  else
    echo -e "${YELLOW}⚠️  restartPolicyType should be ON_FAILURE${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
echo ""

# 8. Проверка Dockerfile
if [ -f "services/worker/Dockerfile" ]; then
  echo "🐳 Checking Dockerfile..."
  
  if grep -q "HEALTHCHECK" services/worker/Dockerfile; then
    echo -e "${GREEN}✅ HEALTHCHECK is configured${NC}"
  else
    echo -e "${YELLOW}⚠️  HEALTHCHECK not found in Dockerfile${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
echo ""

# 9. Проверка секретов в коде (базовая проверка)
echo "🔒 Checking for secrets in code..."
if grep -r "sk-or-v1-" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . > /dev/null 2>&1; then
  echo -e "${RED}❌ Potential API keys found in code${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ No obvious secrets found${NC}"
fi
echo ""

# 10. Проверка health check endpoints (если доступны)
if [ "$ENVIRONMENT" = "production" ]; then
  echo "🏥 Checking health endpoints..."
  
  if curl -s -f "https://gpt-agent-kwid.vercel.app/api/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend health check OK${NC}"
  else
    echo -e "${YELLOW}⚠️  Frontend health check failed (may be normal if not deployed yet)${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
  
  if curl -s -f "https://gpt-agent-platform-production.up.railway.app/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Worker health check OK${NC}"
  else
    echo -e "${YELLOW}⚠️  Worker health check failed (may be normal if not deployed yet)${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
echo ""

# Итоговый результат
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Validation Summary:"
echo "   Errors: $ERRORS"
echo "   Warnings: $WARNINGS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ]; then
  if [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for deployment.${NC}"
    exit 0
  else
    echo -e "${YELLOW}⚠️  Checks passed with warnings. Review warnings before deployment.${NC}"
    exit 0
  fi
else
  echo -e "${RED}❌ Validation failed! Fix errors before deployment.${NC}"
  exit 1
fi

