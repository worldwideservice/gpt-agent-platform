#!/bin/bash

# Скрипт для генерации структуры папок проекта
# Использование: ./scripts/generate-project-structure.sh

set -e

echo "🚀 Генерация структуры проекта GPT Agent AI..."

# Создание основных директорий
echo "📁 Создание основных директорий..."

# app/ структура
mkdir -p app/\(auth\)/login/components
mkdir -p app/\(auth\)/register/components
mkdir -p app/\(auth\)/reset-password/components
mkdir -p app/\(public\)/pricing
mkdir -p app/\(public\)/privacy
mkdir -p app/\(public\)/terms
mkdir -p app/\(public\)/support

# app/manage/[workspaceId] структура
mkdir -p app/manage/\[workspaceId\]/ai-agents/create
mkdir -p app/manage/\[workspaceId\]/ai-agents/\[id\]/edit/leads-contacts
mkdir -p app/manage/\[workspaceId\]/ai-agents/\[id\]/edit/triggers
mkdir -p app/manage/\[workspaceId\]/ai-agents/\[id\]/edit/sequences
mkdir -p app/manage/\[workspaceId\]/ai-agents/\[id\]/edit/available-integrations
mkdir -p app/manage/\[workspaceId\]/ai-agents/\[id\]/edit/advanced-settings
mkdir -p app/manage/\[workspaceId\]/ai-agents/\[id\]/components

mkdir -p app/manage/\[workspaceId\]/test-chat/components

mkdir -p app/manage/\[workspaceId\]/knowledge-categories/create
mkdir -p app/manage/\[workspaceId\]/knowledge-categories/\[id\]/edit/components

mkdir -p app/manage/\[workspaceId\]/knowledge-items/create
mkdir -p app/manage/\[workspaceId\]/knowledge-items/\[id\]/edit/components

mkdir -p app/manage/\[workspaceId\]/account-settings/components
mkdir -p app/manage/\[workspaceId\]/pricing/components

# app/api/v1 структура
mkdir -p app/api/v1/agents/\[id\]/copy
mkdir -p app/api/v1/agents/\[id\]/sync-crm
mkdir -p app/api/v1/auth/login
mkdir -p app/api/v1/auth/register
mkdir -p app/api/v1/auth/logout
mkdir -p app/api/v1/auth/refresh
mkdir -p app/api/v1/auth/verify
mkdir -p app/api/v1/chat/\[chatId\]
mkdir -p app/api/v1/crm/kommo/oauth
mkdir -p app/api/v1/crm/kommo/callback
mkdir -p app/api/v1/crm/kommo/sync
mkdir -p app/api/v1/crm/kommo/webhooks
mkdir -p app/api/v1/crm/pipelines
mkdir -p app/api/v1/dashboard/stats
mkdir -p app/api/v1/dashboard/monthly-chart
mkdir -p app/api/v1/dashboard/daily-chart
mkdir -p app/api/v1/knowledge-base/categories/\[id\]
mkdir -p app/api/v1/knowledge-base/items/\[id\]
mkdir -p app/api/v1/notifications/\[id\]/read
mkdir -p app/api/v1/notifications/read-all
mkdir -p app/api/v1/pricing/current-plan
mkdir -p app/api/v1/pricing/plans
mkdir -p app/api/v1/test-chat/chats/\[chatId\]/messages
mkdir -p app/api/v1/test-chat/agents
mkdir -p app/api/v1/triggers/\[id\]
mkdir -p app/api/v1/sequences/\[id\]
mkdir -p app/api/v1/user/me
mkdir -p app/api/v1/user/license
mkdir -p app/api/v1/user/preferences/theme
mkdir -p app/api/v1/account/settings

mkdir -p app/api/health
mkdir -p app/api/webhooks/kommo

# app/docs структура
mkdir -p app/docs/\[locale\]/start-here/getting-started
mkdir -p app/docs/components

# components/ структура
mkdir -p components/auth
mkdir -p components/features/agents/components
mkdir -p components/features/dashboard
mkdir -p components/features/knowledge-base
mkdir -p components/features/test-chat
mkdir -p components/features/triggers
mkdir -p components/features/sequences
mkdir -p components/features/notifications
mkdir -p components/layout
mkdir -p components/pricing
mkdir -p components/providers
mkdir -p components/ui

# lib/ структура
mkdir -p lib/backend
mkdir -p lib/browser-connector
mkdir -p lib/crm/kommo
mkdir -p lib/env
mkdir -p lib/graphql
mkdir -p lib/lib
mkdir -p lib/onboarding
mkdir -p lib/providers
mkdir -p lib/repositories
mkdir -p lib/services/ai
mkdir -p lib/supabase
mkdir -p lib/utils
mkdir -p lib/websocket

# types/
mkdir -p types

# hooks/
mkdir -p hooks

# messages/
mkdir -p messages

# services/ структура
mkdir -p services/api
mkdir -p services/worker

# tests/ структура
mkdir -p tests/components/ui
mkdir -p tests/components/features
mkdir -p tests/e2e
mkdir -p tests/hooks
mkdir -p tests/integration/api
mkdir -p tests/integration/crm
mkdir -p tests/integration/ai
mkdir -p tests/lib
mkdir -p tests/unit/services
mkdir -p tests/unit/repositories
mkdir -p tests/unit/utils
mkdir -p tests/helpers

# scripts/ структура
mkdir -p scripts/migrations
mkdir -p scripts/seed

echo "✅ Структура папок создана!"

# Создание базовых файлов
echo "📝 Создание базовых файлов..."

# .gitkeep файлы для пустых директорий
find . -type d -empty -exec touch {}/.gitkeep \;

echo "✅ Базовые файлы созданы!"

echo ""
echo "🎉 Структура проекта успешно создана!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Создать Prisma schema (prisma/schema.prisma)"
echo "2. Настроить environment variables (.env.example)"
echo "3. Создать базовые компоненты"
echo "4. Настроить API routes"
echo "5. Настроить сервисы и репозитории"
echo ""

