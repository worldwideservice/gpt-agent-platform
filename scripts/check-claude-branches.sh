#!/bin/bash
# Скрипт для проверки всех веток Claude
# Использование: ./scripts/check-claude-branches.sh

echo "📋 Все Claude ветки и их изменения:"
echo "===================================="
echo ""

# Обновить информацию о remote ветках
git fetch origin --prune > /dev/null 2>&1

# Проверить все Claude ветки
git branch -r | grep "origin/claude" | sed 's|origin/||' | while read branch; do
    echo "🌳 Ветка: $branch"
    commits=$(git log origin/main..origin/$branch --oneline 2>/dev/null | wc -l)

    if [ "$commits" -eq 0 ]; then
        echo "   ✅ Нет новых коммитов (можно удалить)"
    else
        echo "   📝 Коммитов: $commits"
        git log origin/main..origin/$branch --oneline --pretty=format:"      - %h %s" 2>/dev/null
        echo ""
        echo "   📁 Изменённые файлы:"
        git diff --stat origin/main..origin/$branch 2>/dev/null | sed 's/^/      /'
    fi
    echo ""
    echo "---"
    echo ""
done

echo ""
echo "💡 Команды для управления:"
echo "   • Удалить локальную ветку: git branch -d <branch-name>"
echo "   • Удалить удаленную ветку: git push origin --delete <branch-name>"
echo "   • Очистить кеш remote: git remote prune origin"
