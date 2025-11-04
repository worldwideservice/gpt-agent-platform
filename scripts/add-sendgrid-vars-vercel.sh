#!/bin/bash

# Скрипт для добавления переменных SendGrid в Vercel
# Использование: ./scripts/add-sendgrid-vars-vercel.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📧 Добавление переменных SendGrid в Vercel"
echo "=========================================="
echo ""

# Проверка Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}⚠️  Vercel CLI не установлен${NC}"
  echo "Установите: npm install -g vercel"
  exit 1
fi

# Данные SendGrid
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="${SENDGRID_API_KEY:-<SENDGRID_API_KEY>}"
FROM_EMAIL="noreply@worldwideservices.eu"

PROJECT_ID="prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv"

echo "📋 Добавляемые переменные:"
echo "  - SMTP_HOST=$SMTP_HOST"
echo "  - SMTP_PORT=$SMTP_PORT"
echo "  - SMTP_USER=$SMTP_USER"
echo "  - SMTP_PASS=*** (скрыто)"
echo "  - FROM_EMAIL=$FROM_EMAIL"
echo ""

echo "⚠️  ВАЖНО: Этот скрипт требует ручного выполнения через Vercel Dashboard"
echo "   или использования Vercel CLI с правильными правами доступа"
echo ""
echo "📝 Инструкция:"
echo "1. Откройте: https://vercel.com/world-wide-services-62780b79/gpt-agent-kwid/settings/environment-variables"
echo "2. Добавьте следующие переменные для Production:"
echo ""
echo "   SMTP_HOST = $SMTP_HOST"
echo "   SMTP_PORT = $SMTP_PORT"
echo "   SMTP_USER = $SMTP_USER"
echo "   SMTP_PASS = $SMTP_PASS (отметьте как Sensitive)"
echo "   FROM_EMAIL = $FROM_EMAIL"
echo ""
echo "3. Нажмите Save"
echo ""

# Попытка через Vercel CLI (если авторизован)
if vercel whoami &> /dev/null; then
  echo -e "${GREEN}✅ Vercel CLI авторизован${NC}"
  echo ""
  echo "Попытка добавления через CLI..."
  
  # Добавляем переменные для Production
  vercel env add SMTP_HOST production <<< "$SMTP_HOST" || echo "⚠️  Не удалось добавить SMTP_HOST"
  vercel env add SMTP_PORT production <<< "$SMTP_PORT" || echo "⚠️  Не удалось добавить SMTP_PORT"
  vercel env add SMTP_USER production <<< "$SMTP_USER" || echo "⚠️  Не удалось добавить SMTP_USER"
  vercel env add SMTP_PASS production <<< "$SMTP_PASS" || echo "⚠️  Не удалось добавить SMTP_PASS"
  vercel env add FROM_EMAIL production <<< "$FROM_EMAIL" || echo "⚠️  Не удалось добавить FROM_EMAIL"
  
  echo ""
  echo -e "${GREEN}✅ Переменные добавлены (или уже существуют)${NC}"
else
  echo -e "${YELLOW}⚠️  Vercel CLI не авторизован${NC}"
  echo "Выполните: vercel login"
  echo "Затем запустите скрипт снова"
fi

echo ""
echo "✅ Готово!"

