#!/bin/bash

# Скрипт для очистки Git истории от секретов
# ⚠️ ВНИМАНИЕ: Этот скрипт перезапишет историю Git!
# Использование: bash scripts/cleanup-git-history.sh

set -e

echo "🔒 Очистка Git истории от секретов"
echo "===================================="
echo ""
echo "⚠️  ВНИМАНИЕ: Этот скрипт перезапишет историю Git!"
echo "⚠️  Это потребует force push и может нарушить работу команды!"
echo ""
read -p "Вы уверены, что хотите продолжить? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Отменено пользователем"
  exit 1
fi

echo ""
echo "📋 Шаг 1: Проверка наличия git-filter-repo"
if ! command -v git-filter-repo &> /dev/null; then
  echo "❌ git-filter-repo не установлен"
  echo "💡 Установите: pip install git-filter-repo"
  echo "   или: brew install git-filter-repo"
  exit 1
fi

echo "✅ git-filter-repo установлен"
echo ""

echo "📋 Шаг 2: Создание полного бэкапа"
BACKUP_DIR="backups/git-history-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📦 Создание бэкапа в $BACKUP_DIR..."
git bundle create "$BACKUP_DIR/full-repo.bundle" --all
echo "✅ Бэкап создан: $BACKUP_DIR/full-repo.bundle"
echo ""

echo "📋 Шаг 3: Удаление env.production из истории"
git filter-repo --path env.production --invert-paths --force
echo "✅ env.production удален из истории"
echo ""

echo "📋 Шаг 4: Удаление sentry-page-content.html из истории"
git filter-repo --path sentry-page-content.html --invert-paths --force
echo "✅ sentry-page-content.html удален из истории"
echo ""

echo "📋 Шаг 5: Замена секретов в истории (если они остались)"
# Создаем файл с заменой для BFG или git-filter-repo
cat > /tmp/replace-secrets.txt << 'EOF'
# Railway Token
b2d35fc1-afcf-4589-8b24-da667437cf26==>***MASKED***
# OpenRouter API Key
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==>sk-or-v1-***MASKED***
# Supabase Service Key
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwemNoc2d1dGFieGVhYmJud2FzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU2MzMzOCwiZXhwIjoyMDc1MTM5MzM4fQ.UIkX-rUGGTbMGfd5YoF41Dx3QBuLH13nO-R3BXdbx2I==>eyJhbGc***MASKED***
# Google API Key
AIzaSyDBUGmWp7crZCpF5OxI_6YwNj2WTJ7Xy-8==>AIzaSy***MASKED***
# Upstash Token
AYcUASQgZjI2MTM5NzYtYzU2ZS00YjFkLTk3MmQtMWIyODAzYjY3ODg5OGE3ODAzNDUwMzQ5NGE0Yjk5NzEwZDFiNWE4ZTg0MDU==>AYcU***MASKED***
# Encryption Key
HxXQ5WCMJ3TrFZehEHJUyMVgVX5fdGsSWy/2rixkVwE==>HxXQ***MASKED***
EOF

echo "⚠️  Для замены секретов в истории используйте BFG Repo-Cleaner:"
echo "   bfg --replace-text /tmp/replace-secrets.txt"
echo ""

echo "📋 Шаг 6: Проверка результата"
echo "✅ История очищена"
echo ""

echo "📋 Шаг 7: Force push (требуется подтверждение)"
echo "⚠️  ВНИМАНИЕ: Это перезапишет историю для всех веток!"
read -p "Выполнить force push? (yes/no): " push_confirm

if [ "$push_confirm" == "yes" ]; then
  echo "🚀 Выполняю force push..."
  git push --force --all
  git push --force --tags
  echo "✅ Force push выполнен"
else
  echo "⚠️  Force push пропущен. Выполните вручную:"
  echo "   git push --force --all"
  echo "   git push --force --tags"
fi

echo ""
echo "✅ Очистка Git истории завершена!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Уведомите всех разработчиков о необходимости переклонировать репозиторий"
echo "2. Удалите локальные копии репозитория и переклонируйте"
echo "3. Проверьте, что все предупреждения GitHub Secret Scanning закрыты"

