#!/bin/bash

# Скрипт для добавления переменных окружения в Vercel
# Использует значения из .env.local

set -e

ENV_FILE=".env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Файл $ENV_FILE не найден!"
  exit 1
fi

echo "🚀 Добавляю переменные окружения в Vercel..."
echo ""

# Функция для получения значения из .env.local
get_env_value() {
  grep "^$1=" "$ENV_FILE" | sed "s/^$1=//" | sed 's/^"//' | sed 's/"$//' | head -1
}

# Функция для добавления переменной в Vercel (Production)
add_vercel_env() {
  local var_name=$1
  local var_value=$2
  
  if [ -z "$var_value" ]; then
    echo "⚠️  Пропускаю $var_name (пустое значение)"
    return
  fi
  
  echo "➕ Добавляю $var_name..."
  echo "$var_value" | vercel env add "$var_name" production
  echo "✅ $var_name добавлена"
  echo ""
}

# Добавляем переменные
add_vercel_env "NEXT_PUBLIC_SUPABASE_URL" "$(get_env_value NEXT_PUBLIC_SUPABASE_URL)"
add_vercel_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$(get_env_value NEXT_PUBLIC_SUPABASE_ANON_KEY)"
add_vercel_env "SUPABASE_SERVICE_ROLE_KEY" "$(get_env_value SUPABASE_SERVICE_ROLE_KEY)"
add_vercel_env "SUPABASE_DEFAULT_ORGANIZATION_ID" "$(get_env_value SUPABASE_DEFAULT_ORGANIZATION_ID)"
add_vercel_env "OPENROUTER_API_KEY" "$(get_env_value OPENROUTER_API_KEY)"
add_vercel_env "AUTH_SECRET" "$(get_env_value AUTH_SECRET)"
add_vercel_env "NEXTAUTH_SECRET" "$(get_env_value AUTH_SECRET)"  # Используем AUTH_SECRET для NEXTAUTH_SECRET

# NEXT_PUBLIC_APP_URL для продакшена
add_vercel_env "NEXT_PUBLIC_APP_URL" "https://gpt-agent-platform.vercel.app"

echo "✅ Все переменные добавлены!"
echo ""
echo "📋 Проверьте: vercel env ls"

