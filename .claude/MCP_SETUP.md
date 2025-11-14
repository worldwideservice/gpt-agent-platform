# MCP Server Configuration

Этот проект настроен с MCP (Model Context Protocol) серверами для расширения возможностей Claude Code.

## Доступные MCP серверы

### 1. GitHub (`github`)
- **Возможности**: Создание PR, работа с issues, управление репозиториями
- **Статус**: ✅ Настроен с токеном доступа
- **Использование**: Автоматически используется для git операций

### 2. Supabase (`supabase`)
- **Возможности**: Прямой доступ к базе данных проекта
- **Статус**: ✅ Настроен для проекта `rpzchsgutabxeabbnwas`
- **Использование**: Для работы с БД без API

### 3. Sequential Thinking (`sequential-thinking`)
- **Возможности**: Расширенное логическое мышление для сложных задач
- **Статус**: ✅ Активен
- **Использование**: Автоматически при решении сложных задач

### 4. Context7 (`context7`)
- **Возможности**: Расширенное управление контекстом с Upstash
- **Статус**: ✅ Настроен
- **Использование**: Для сохранения долгосрочного контекста

### 5. Magic (`magic`)
- **Возможности**: AI-powered инструменты от 21st.dev
- **Статус**: ✅ Настроен с API ключом
- **Использование**: Дополнительные AI возможности

### 6. Playwright (`playwright`)
- **Возможности**: Автоматизация браузера для тестирования
- **Статус**: ✅ Доступен
- **Использование**: E2E тесты, автоматизация веб-задач

### 7. shadcn (`shadcn`)
- **Возможности**: Работа с shadcn/ui компонентами
- **Статус**: ✅ Доступен
- **Использование**: Добавление UI компонентов

### 8. Filesystem Project (`filesystem-project`)
- **Возможности**: Расширенная работа с файлами проекта
- **Статус**: ✅ Настроен для `/home/user/gpt-agent-platform`
- **Использование**: Для сложных файловых операций

## Как это работает в веб-версии

В веб-версии Claude Code конфигурация MCP читается из файла `.claude/mcp_config.json` автоматически при запуске сессии.

### Автоматическая загрузка
MCP серверы загружаются автоматически при:
- Открытии новой сессии в проекте
- Перезапуске сессии
- После git pull с обновленной конфигурацией

### Проверка статуса
Чтобы проверить, какие MCP серверы активны:
```bash
env | grep MCP
```

## Безопасность

⚠️ **ВАЖНО**: Файл `mcp_config.json` содержит секретные токены и НЕ должен коммититься в публичный репозиторий!

Добавлено в `.gitignore`:
```
.claude/mcp_config.json
```

Для локальной разработки используйте Desktop версию Claude с конфигурацией из `~/Library/Application Support/Claude/claude_desktop_config.json`.

## Обновление конфигурации

Для обновления MCP серверов:
1. Отредактируйте `.claude/mcp_config.json`
2. Перезапустите сессию Claude Code
3. Серверы будут автоматически переподключены

## Troubleshooting

### MCP сервер не работает
```bash
# Проверить логи
cat ~/.claude/mcp-*.log

# Проверить доступность npx
which npx

# Вручную запустить сервер для проверки
npx -y @modelcontextprotocol/server-github
```

### Токены истекли
Обновите токены в `.claude/mcp_config.json`:
- GitHub: https://github.com/settings/tokens
- Supabase: https://supabase.com/dashboard/account/tokens
- Context7: https://upstash.com
- Magic: https://21st.dev

## Документация

- [MCP Protocol](https://modelcontextprotocol.io)
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [Supabase MCP Server](https://github.com/supabase/mcp-server-supabase)
- [Playwright MCP](https://github.com/microsoft/playwright-mcp)
