#!/bin/bash

# Скрипт-помощник для ротации всех секретов
# Использование: bash scripts/rotate-all-secrets.sh

set -e

echo "🔄 Ротация секретов - Интерактивный помощник"
echo "=============================================="
echo ""

# Проверка наличия необходимых переменных
check_env_var() {
  local var_name=$1
  if [ -z "${!var_name}" ]; then
    echo "❌ $var_name не установлена"
    return 1
  else
    echo "✅ $var_name установлена"
    return 0
  fi
}

echo "📋 Шаг 1: Проверка переменных окружения"
echo ""

# Railway Token
echo "🔍 Railway Token:"
if check_env_var "RAILWAY_TOKEN"; then
  echo "   ✅ Токен найден: ${RAILWAY_TOKEN:0:8}...${RAILWAY_TOKEN: -4}"
else
  echo "   ⚠️  Токен не найден. Получите новый в: https://railway.app/account/tokens"
fi
echo ""

# OpenRouter API Key
echo "🔍 OpenRouter API Key:"
if check_env_var "OPENROUTER_API_KEY"; then
  echo "   ✅ Ключ найден: ${OPENROUTER_API_KEY:0:12}...${OPENROUTER_API_KEY: -4}"
else
  echo "   ⚠️  Ключ не найден. Получите новый в: https://openrouter.ai/keys"
fi
echo ""

# Supabase Service Key
echo "🔍 Supabase Service Role Key:"
if check_env_var "SUPABASE_SERVICE_ROLE_KEY"; then
  echo "   ✅ Ключ найден: ${SUPABASE_SERVICE_ROLE_KEY:0:12}...${SUPABASE_SERVICE_ROLE_KEY: -4}"
else
  echo "   ⚠️  Ключ не найден. Получите новый в: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/settings/api"
fi
echo ""

# Upstash Redis Token
echo "🔍 Upstash Redis REST Token:"
if check_env_var "UPSTASH_REDIS_REST_TOKEN"; then
  echo "   ✅ Токен найден: ${UPSTASH_REDIS_REST_TOKEN:0:8}...${UPSTASH_REDIS_REST_TOKEN: -4}"
else
  echo "   ⚠️  Токен не найден. Получите новый в: https://console.upstash.com/redis"
fi
echo ""

# Encryption Key
echo "🔍 Encryption Key:"
if check_env_var "ENCRYPTION_KEY"; then
  echo "   ✅ Ключ найден: ${ENCRYPTION_KEY:0:8}...${ENCRYPTION_KEY: -4}"
else
  echo "   ⚠️  Ключ не найден. Сгенерируйте новый: openssl rand -base64 32"
fi
echo ""

echo "📋 Шаг 2: Инструкции по ротации"
echo ""
echo "🔗 Ссылки для ротации секретов:"
echo ""
echo "1. Railway Token:"
echo "   https://railway.app/account/tokens"
echo "   - Создайте новый токен"
echo "   - Удалите старый токен"
echo "   - Обновите переменную: export RAILWAY_TOKEN='новый_токен'"
echo ""
echo "2. OpenRouter API Key:"
echo "   https://openrouter.ai/keys"
echo "   - Создайте новый ключ"
echo "   - Удалите старый ключ"
echo "   - Обновите в Railway: railway variables --set OPENROUTER_API_KEY='новый_ключ'"
echo ""
echo "3. Supabase Service Role Key:"
echo "   https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/settings/api"
echo "   - Сгенерируйте новый Service Role Key"
echo "   - Обновите в Railway и Vercel"
echo ""
echo "4. Upstash Redis REST Token:"
echo "   https://console.upstash.com/redis"
echo "   - Откройте вашу базу данных"
echo "   - Settings → Rotate Token"
echo "   - Обновите в Railway: railway variables --set UPSTASH_REDIS_REST_TOKEN='новый_токен'"
echo ""
echo "5. Encryption Key:"
echo "   - Сгенерируйте новый: openssl rand -base64 32"
echo "   - ⚠️  ВНИМАНИЕ: Это перешифрует все данные!"
echo "   - Обновите в Railway и Vercel"
echo ""
echo "6. Google API Key (если используется):"
echo "   https://console.cloud.google.com/apis/credentials"
echo "   - Создайте новый API Key"
echo "   - Удалите старый ключ"
echo ""

echo "📋 Шаг 3: Обновление переменных в Railway"
echo ""
read -p "Обновить переменные в Railway? (yes/no): " update_railway

if [ "$update_railway" == "yes" ]; then
  echo "🔧 Обновление переменных в Railway..."
  
  if [ -n "$UPSTASH_REDIS_REST_URL" ]; then
    railway variables --set "UPSTASH_REDIS_REST_URL=$UPSTASH_REDIS_REST_URL" --service gpt-agent-platform --environment production || echo "⚠️  Ошибка обновления UPSTASH_REDIS_REST_URL"
  fi
  
  if [ -n "$UPSTASH_REDIS_REST_TOKEN" ]; then
    railway variables --set "UPSTASH_REDIS_REST_TOKEN=$UPSTASH_REDIS_REST_TOKEN" --service gpt-agent-platform --environment production || echo "⚠️  Ошибка обновления UPSTASH_REDIS_REST_TOKEN"
  fi
  
  if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    railway variables --set "SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY" --service gpt-agent-platform --environment production || echo "⚠️  Ошибка обновления SUPABASE_SERVICE_ROLE_KEY"
  fi
  
  if [ -n "$ENCRYPTION_KEY" ]; then
    railway variables --set "ENCRYPTION_KEY=$ENCRYPTION_KEY" --service gpt-agent-platform --environment production || echo "⚠️  Ошибка обновления ENCRYPTION_KEY"
  fi
  
  if [ -n "$OPENROUTER_API_KEY" ]; then
    railway variables --set "OPENROUTER_API_KEY=$OPENROUTER_API_KEY" --service gpt-agent-platform --environment production || echo "⚠️  Ошибка обновления OPENROUTER_API_KEY"
  fi
  
  echo "✅ Переменные обновлены в Railway"
else
  echo "⚠️  Пропущено. Обновите переменные вручную в Railway Dashboard"
fi

echo ""
echo "✅ Ротация секретов завершена!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Проверьте работу всех сервисов после ротации"
echo "2. Проверьте логи на ошибки аутентификации"
echo "3. Закройте предупреждения GitHub Secret Scanning (если они не закрылись автоматически)"

