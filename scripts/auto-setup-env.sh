#!/bin/bash

# ============================================
# АВТОМАТИЧЕСКАЯ НАСТРОЙКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ
# Этот скрипт генерирует ключи и создает шаблоны .env файлов
# ============================================

set -e

echo "🚀 Автоматическая настройка переменных окружения..."
echo ""

# Определяем корневую директорию проекта
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# ============================================
# Генерация ключей
# ============================================

echo "📝 Генерация ключей..."

AUTH_SECRET=$(openssl rand -base64 32 | tr -d '\n' | cut -c1-32)
ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '\n')
WEBHOOK_SECRET=$(openssl rand -base64 32 | tr -d '\n' | cut -c1-32)

echo "✅ AUTH_SECRET сгенерирован: ${AUTH_SECRET}"
echo "✅ ENCRYPTION_KEY сгенерирован: ${ENCRYPTION_KEY}"
echo "✅ WEBHOOK_SECRET сгенерирован: ${WEBHOOK_SECRET}"
echo ""

# ============================================
# Создание .env.local (корень проекта)
# ============================================

echo "📝 Создание .env.local..."

if [ ! -f .env.local ]; then
  cat > .env.local << EOF
# ============================================
# ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ - АВТОМАТИЧЕСКИ СГЕНЕРИРОВАНО
# Создано: $(date)
# ============================================

# ============================================
# Supabase Configuration
# ⚠️ ЗАПОЛНИТЕ РЕАЛЬНЫМИ ЗНАЧЕНИЯМИ из Supabase Dashboard
# ============================================
NEXT_PUBLIC_SUPABASE_URL="https://<project-id>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key-здесь>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key-здесь>"
SUPABASE_DEFAULT_ORGANIZATION_ID="<uuid-организации>"

# ============================================
# Authentication (автоматически сгенерировано)
# ============================================
AUTH_SECRET="${AUTH_SECRET}"
NEXTAUTH_SECRET="${AUTH_SECRET}"

# ============================================
# Application URLs
# ============================================
BACKEND_API_URL="http://localhost:4000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ============================================
# OpenRouter (для работы с LLM)
# ⚠️ ПОЛУЧИТЕ ключ на https://openrouter.ai/keys
# ============================================
OPENROUTER_API_KEY="sk-or-v1-<ваш-ключ-здесь>"

# ============================================
# Kommo CRM (опционально)
# ============================================
KOMMO_OAUTH_REDIRECT_BASE="http://localhost:3000/integrations/kommo/oauth/callback"
KOMMO_WEBHOOK_SECRET="${WEBHOOK_SECRET}"
EOF
  echo "✅ .env.local создан"
else
  echo "⚠️  .env.local уже существует, не перезаписываем"
  echo "   Добавьте сгенерированные ключи вручную:"
  echo "   AUTH_SECRET=${AUTH_SECRET}"
  echo "   NEXTAUTH_SECRET=${AUTH_SECRET}"
fi

echo ""

# ============================================
# Создание services/api/.env
# ============================================

echo "📝 Создание services/api/.env..."

mkdir -p services/api

if [ ! -f services/api/.env ]; then
  cat > services/api/.env << EOF
# ============================================
# BACKEND API - Переменные окружения
# Создано: $(date)
# ============================================

# ============================================
# Supabase Configuration
# ⚠️ ЗАПОЛНИТЕ РЕАЛЬНЫМИ ЗНАЧЕНИЯМИ из Supabase Dashboard
# ============================================
SUPABASE_URL="https://<project-id>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key-здесь>"

# ============================================
# Redis Configuration
# ============================================
REDIS_URL="redis://localhost:6379"

# ============================================
# Encryption Key (автоматически сгенерировано)
# ============================================
ENCRYPTION_KEY="${ENCRYPTION_KEY}"

# ============================================
# OpenRouter (для LLM)
# ⚠️ ПОЛУЧИТЕ ключ на https://openrouter.ai/keys
# ============================================
OPENROUTER_API_KEY="sk-or-v1-<ваш-ключ-здесь>"

# ============================================
# Kommo CRM Configuration
# ============================================
KOMMO_OAUTH_REDIRECT_BASE="http://localhost:3000/integrations/kommo/oauth/callback"
KOMMO_WEBHOOK_SECRET="${WEBHOOK_SECRET}"
EOF
  echo "✅ services/api/.env создан"
else
  echo "⚠️  services/api/.env уже существует, не перезаписываем"
  echo "   Добавьте сгенерированный ключ вручную:"
  echo "   ENCRYPTION_KEY=${ENCRYPTION_KEY}"
fi

echo ""

# ============================================
# Создание services/worker/.env
# ============================================

echo "📝 Создание services/worker/.env..."

mkdir -p services/worker

if [ ! -f services/worker/.env ]; then
  cat > services/worker/.env << EOF
# ============================================
# WORKER - Переменные окружения
# Создано: $(date)
# ============================================

# ============================================
# Supabase Configuration
# ⚠️ ЗАПОЛНИТЕ РЕАЛЬНЫМИ ЗНАЧЕНИЯМИ из Supabase Dashboard
# ============================================
SUPABASE_URL="https://<project-id>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key-здесь>"

# ============================================
# Redis Configuration
# ============================================
REDIS_URL="redis://localhost:6379"

# ============================================
# Encryption Key (автоматически сгенерировано)
# ОДИНАКОВЫЙ с services/api/.env
# ============================================
ENCRYPTION_KEY="${ENCRYPTION_KEY}"

# ============================================
# Job Queue Configuration
# ============================================
JOB_QUEUE_NAME="agent-jobs"
JOB_CONCURRENCY="5"

# ============================================
# OpenRouter (для LLM)
# ⚠️ ПОЛУЧИТЕ ключ на https://openrouter.ai/keys
# ============================================
OPENROUTER_API_KEY="sk-or-v1-<ваш-ключ-здесь>"
EOF
  echo "✅ services/worker/.env создан"
else
  echo "⚠️  services/worker/.env уже существует, не перезаписываем"
  echo "   Добавьте сгенерированный ключ вручную:"
  echo "   ENCRYPTION_KEY=${ENCRYPTION_KEY}"
fi

echo ""

# ============================================
# Итоговая информация
# ============================================

echo "✅ Готово! Созданы файлы окружения с автогенерированными ключами"
echo ""
echo "📋 СЛЕДУЮЩИЕ ШАГИ:"
echo ""
echo "1. Заполните реальные значения в созданных файлах:"
echo "   - .env.local"
echo "   - services/api/.env"
echo "   - services/worker/.env"
echo ""
echo "2. Получите ключи из Supabase Dashboard:"
echo "   https://supabase.com/dashboard -> Settings -> API"
echo ""
echo "3. Получите OpenRouter API ключ:"
echo "   https://openrouter.ai/keys"
echo ""
echo "4. Проверьте настройку:"
echo "   npm run check:env"
echo ""
echo "5. Запустите Redis (если еще не запущен):"
echo "   docker run -d -p 6379:6379 redis"
echo "   или: redis-server"
echo ""
echo "6. Выполните миграции БД в Supabase Dashboard:"
echo "   SQL Editor -> Вставить scripts/apply-all-setup.sql -> Run"
echo ""

