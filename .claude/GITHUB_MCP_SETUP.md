# GitHub MCP Setup Guide

## Статус установки

✅ **MCP конфигурация создана**: `.claude/mcp_config.json`
⏳ **Требуется GitHub токен** для активации

## Быстрая настройка

### Шаг 1: Создайте GitHub Personal Access Token

1. Перейдите на https://github.com/settings/tokens
2. Нажмите **"Generate new token (classic)"**
3. Дайте токену описательное имя, например: "Claude Code MCP"
4. Выберите следующие scopes (права доступа):
   - ✅ **repo** - Full control of private repositories
   - ✅ **workflow** - Update GitHub Action workflows
   - ✅ **read:org** - Read org and team membership
   - ✅ **project** - Full control of projects (optional)
5. Установите срок действия (рекомендуется 90 дней)
6. Нажмите **"Generate token"**
7. **ВАЖНО**: Скопируйте токен СРАЗУ (он больше не будет показан!)

### Шаг 2: Добавьте токен в конфигурацию

#### Вариант А: Используя скрипт (рекомендуется)

```bash
./.claude/setup-github-token.sh YOUR_GITHUB_TOKEN_HERE
```

#### Вариант Б: Вручную

Отредактируйте `.claude/mcp_config.json` и замените `PLACEHOLDER_GITHUB_TOKEN` на ваш токен:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_ВАШ_ТОКЕН_ЗДЕСЬ"
      }
    }
  }
}
```

### Шаг 3: Перезапустите сессию Claude Code

После добавления токена **перезапустите сессию Claude Code**, чтобы активировать GitHub MCP сервер.

## Проверка установки

После перезапуска сессии проверьте, что GitHub MCP активен:

```bash
# Проверить переменные окружения MCP
env | grep MCP

# Должны увидеть что-то вроде:
# GITHUB_MCP_PORT=xxxxx
# ENABLE_MCP_CLI=true
```

## Доступные команды GitHub MCP

После активации у Claude будут доступны следующие инструменты:

### Pull Requests
- `mcp__github__create_pull_request` - Создать PR
- `mcp__github__list_pull_requests` - Список PR
- `mcp__github__get_pull_request` - Информация о PR
- `mcp__github__update_pull_request` - Обновить PR
- `mcp__github__merge_pull_request` - Смержить PR

### Issues
- `mcp__github__create_issue` - Создать issue
- `mcp__github__list_issues` - Список issues
- `mcp__github__get_issue` - Информация об issue
- `mcp__github__update_issue` - Обновить issue
- `mcp__github__add_issue_comment` - Добавить комментарий

### Repositories
- `mcp__github__create_repository` - Создать репозиторий
- `mcp__github__get_file_contents` - Получить содержимое файла
- `mcp__github__push_files` - Запушить файлы
- `mcp__github__fork_repository` - Форкнуть репозиторий
- `mcp__github__create_branch` - Создать ветку

### Другое
- `mcp__github__search_repositories` - Поиск репозиториев
- `mcp__github__search_code` - Поиск по коду
- `mcp__github__search_issues` - Поиск issues

## Примеры использования

### Создание Pull Request

После настройки токена, просто скажите Claude:

```
Создай PR для текущей ветки с заголовком "Feature: Add new component"
```

Claude автоматически использует `mcp__github__create_pull_request`.

### Создание Issue

```
Создай issue с заголовком "Bug: Login form validation" и описанием "..."
```

### Поиск кода

```
Найди в репозитории все использования функции useState
```

## Безопасность

⚠️ **ВАЖНО**:

1. Файл `.claude/mcp_config.json` добавлен в `.gitignore`
2. **НИКОГДА** не коммитьте токены в репозиторий
3. Используйте токены с минимальными необходимыми правами
4. Регулярно обновляйте (rotate) токены
5. Отзывайте старые токены на https://github.com/settings/tokens

## Troubleshooting

### MCP сервер не запускается

```bash
# Проверить, установлен ли GitHub MCP пакет
npx -y @modelcontextprotocol/server-github --version

# Проверить логи (если есть)
cat ~/.claude/mcp-github.log
```

### Ошибка аутентификации

- Убедитесь, что токен правильно скопирован (без пробелов)
- Проверьте, что токен не истек
- Убедитесь, что выбраны правильные scopes

### Команды GitHub не видны

- Перезапустите сессию Claude Code
- Проверьте, что `ENABLE_MCP_CLI=true` в переменных окружения
- Проверьте формат JSON в `.claude/mcp_config.json`

## Дополнительные MCP серверы

В конфигурации также доступны:

- **sequential-thinking** - Расширенное логическое мышление
- **playwright** - Автоматизация браузера для E2E тестов
- **shadcn** - Работа с shadcn/ui компонентами
- **filesystem-project** - Расширенные операции с файлами проекта

Эти серверы не требуют токенов и работают сразу после перезапуска сессии.

## Документация

- [MCP Protocol](https://modelcontextprotocol.io)
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

---

**Дата создания**: 2025-11-15
**Версия**: 1.0
