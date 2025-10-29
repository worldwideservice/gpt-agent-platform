# GPT Agent Platform

Бэкенд/фронтенд проект для обучения и управления AI-агентами, синхронизированными с Kommo CRM.

## Стек
- **Next.js 14 (App Router)** — UI, страницы админки
- **React 18, TypeScript, Tailwind CSS** — компоненты, строгая типизация
- **Supabase (PostgreSQL + Storage + pgvector)** — данные, знания, usage
- **Fastify API (`services/api`)** — OAuth Kommo, REST endpoints, Supabase service role
- **BullMQ + Redis** — очередь задач
- **Worker (`services/worker`)** — обработка вебхуков, синхронизация, отправка сообщений
- **OpenRouter** — LLM-провайдер (подключается токеном пользователя)

## Основные возможности (текущий статус)
- Инфопанель и список агентов читают реальные данные из Supabase
- UI настройки Kommo: ввод Client ID/Secret, запуск OAuth, проверка статуса
- Backend хранит шифрованные секреты, обновляет токены, пишет вебхуки
- Worker синхронизирует воронки, логирует события, учитывает токены

План дальнейшей реализации см. в [`IMPLEMENTATION_STATUS.md`](./IMPLEMENTATION_STATUS.md) и [`REALITY_CHECK.md`](./REALITY_CHECK.md).

## Документация
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — целевая архитектура
- [`docs/SETUP.md`](./docs/SETUP.md) — шаги развёртывания (Supabase, Backend, Worker)
- [`docs/OPENROUTER_SETUP.md`](./docs/OPENROUTER_SETUP.md) — настройка OpenRouter для работы с LLM
- [`docs/TOKENS.md`](./docs/TOKENS.md) — переменные окружения и токены
- [`.cursor/mcp.json`](./.cursor/mcp.json) — актуальная конфигурация MCP (секреты добавляйте локально)

## Запуск

### Требования
- Node.js 20+
- Redis (локально или Docker)
- Supabase проект
- OpenRouter API ключ (для работы чата с LLM)

### Настройка окружения

1. Скопируйте переменные окружения (см. `docs/SETUP.md`)
2. Получите OpenRouter API ключ: [Инструкции](./docs/OPENROUTER_SETUP.md)

### Запуск сервисов

```bash
# Frontend
npm install
npm run dev

# Backend API
cd services/api
npm install
npm run dev

# Worker
cd services/worker
npm install
npm run dev
```

Redis и Supabase должны быть доступны; переменные окружения описаны в `docs/SETUP.md`.

## Структура
```
app/                # Next.js маршруты и API-прокси
components/         # UI-компоненты
lib/                # утилиты фронтенда (Supabase, backend fetch, organization)
services/api/       # Fastify API (Kommo OAuth, webhooks, очередь)
services/worker/    # BullMQ worker (синхронизация Kommo, usage)
supabase/           # schema.sql и seed.sql
docs/               # инструкции и документация
```

## Лицензия
Проект внутренний, лицензия не задана.
