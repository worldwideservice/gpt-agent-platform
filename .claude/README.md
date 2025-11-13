# Claude Code Configuration

Эта директория содержит конфигурацию для Claude Code - официального AI ассистента от Anthropic.

## Структура

```
.claude/
├── README.md              # Этот файл
├── PROJECTCONTEXT.md      # Контекст проекта для Claude
├── hooks/                 # Автоматические хуки
│   └── SessionStart.sh    # Выполняется при запуске сессии
└── commands/              # Кастомные slash команды
    ├── test.md           # /test - запуск тестов
    ├── build.md          # /build - сборка проекта
    ├── lint.md           # /lint - проверка кода
    ├── dev.md            # /dev - запуск dev окружения
    ├── db-migrate.md     # /db-migrate - миграции БД
    ├── type-check.md     # /type-check - проверка TypeScript
    ├── env-check.md      # /env-check - проверка .env
    ├── docker-dev.md     # /docker-dev - запуск Docker
    └── fix-imports.md    # /fix-imports - исправление импортов
```

## Использование

### Slash Commands

После настройки Claude Code, вы можете использовать следующие команды в чате:

- `/test` - Запустить все тесты проекта
- `/build` - Собрать проект для production
- `/lint` - Проверить код линтером
- `/dev` - Запустить development сервер
- `/db-migrate` - Применить миграции базы данных
- `/type-check` - Проверить типы TypeScript
- `/env-check` - Проверить переменные окружения
- `/docker-dev` - Запустить Docker dev окружение
- `/fix-imports` - Исправить импорты и зависимости

### SessionStart Hook

Автоматически выполняется при каждом запуске новой сессии Claude Code и показывает:
- Версии Node.js и npm
- Статус зависимостей
- Наличие .env файлов
- Список доступных команд
- Текущую git ветку

## Добавление новых команд

Чтобы добавить новую команду:

1. Создайте файл в `commands/` с именем команды (например, `my-command.md`)
2. Добавьте frontmatter с описанием:
```markdown
---
description: Краткое описание команды
---

Подробные инструкции для Claude о том, что нужно сделать...
```

3. Используйте команду в чате: `/my-command`

## Кастомизация

### Hooks

Вы можете создать дополнительные хуки:
- `SessionStart.sh` - при запуске сессии
- `BeforePush.sh` - перед git push
- `AfterPull.sh` - после git pull

### Project Context

Отредактируйте `PROJECTCONTEXT.md` для добавления специфичной информации о проекте:
- Стандарты кодирования
- Архитектурные решения
- Часто используемые паттерны
- Известные проблемы

## MCP Серверы (опционально)

Для расширенной функциональности можно настроить MCP серверы:
- Database MCP - для работы с Supabase
- Docker MCP - для управления контейнерами
- GitHub MCP - для работы с issues и PR

См. [документацию Claude Code](https://docs.claude.com/en/docs/claude-code) для деталей.

## Troubleshooting

### Команды не работают
- Убедитесь, что используете Claude Code (не обычный Claude)
- Проверьте синтаксис в .md файлах
- Перезапустите сессию

### Hook не выполняется
- Проверьте права на выполнение: `chmod +x hooks/*.sh`
- Проверьте синтаксис bash скрипта
- Проверьте логи Claude Code

## Документация

- [Claude Code Docs](https://docs.claude.com/en/docs/claude-code)
- [Slash Commands Guide](https://docs.claude.com/en/docs/claude-code/slash-commands)
- [Hooks Guide](https://docs.claude.com/en/docs/claude-code/hooks)
