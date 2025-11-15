# GPT Agent AI Platform

[![Test Coverage](https://github.com/worldwideservice/gpt-agent-platform/actions/workflows/test-coverage.yml/badge.svg)](https://github.com/worldwideservice/gpt-agent-platform/actions/workflows/test-coverage.yml)
[![codecov](https://codecov.io/gh/worldwideservice/gpt-agent-platform/branch/main/graph/badge.svg)](https://codecov.io/gh/worldwideservice/gpt-agent-platform)
![Coverage](https://img.shields.io/badge/coverage-80%25-green)

> Платформа для создания и управления AI агентами с интеграцией CRM (Kommo/amoCRM)

## 🚀 Быстрый старт

### Требования

- Node.js 20+
- npm или yarn
- Redis (локально или Upstash)
- Supabase аккаунт
- OpenRouter API ключ (или OpenAI API ключ)

### Установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd gpt-agent-ai

# Установить зависимости
npm install

# Настроить переменные окружения
cp env.example .env.local
# Отредактировать .env.local с вашими настройками

# Проверить заполнение шаблонов
npm run verify:env

# Запустить все сервисы (Next.js, Fastify, Worker, Redis, Supabase)
make dev

# Остановить dev-окружение
make dev-down
```

Приложение будет доступно на `http://localhost:3000`

## 📚 Документация

### Основная документация

- [Структура проекта](./PROJECT_STRUCTURE.md) - Полная структура папок и файлов
- [Схема базы данных](./docs/DATABASE_SCHEMA.md) - Документация по схеме БД
- [Переменные окружения](./docs/ENVIRONMENT_VARIABLES.md) - Полный список env переменных
- [Docker Setup](./docs/DOCKER_SETUP.md) - Настройка Docker для разработки

### Интеграции

- [AI интеграции](./docs/AI_INTEGRATIONS.md) - OpenRouter, OpenAI GPT-5 Brain
- [Kommo CRM интеграция](./docs/KOMMO_CRM_INTEGRATION.md) - OAuth, API, Webhooks
- [BullMQ Setup](./docs/BULLMQ_SETUP.md) - Очереди задач
- [WebSocket/SSE Setup](./docs/WEBSOCKET_SSE_SETUP.md) - Real-time обновления

### DevOps & Infrastructure

- [Инфраструктура и мониторинг](./docs/INFRASTRUCTURE_CHECKLIST.md) - Docker, env, monitoring
- [Project Improvements](./docs/PROJECT_IMPROVEMENTS.md) - Последние улучшения (2025-11-13)
- [DevOps Improvements](./docs/DEVOPS_IMPROVEMENTS_REPORT.md) - Отчет по улучшениям

### Frontend Development

- [Frontend Analysis Report](./docs/FRONTEND_ANALYSIS_REPORT.md) - Полный анализ текущего состояния фронтенда (65-70% готовности)
- [Frontend Action Plan](./docs/FRONTEND_ACTION_PLAN.md) - Детальный план развития UI (8 недель, с примерами кода)
- [Frontend Documentation Audit](./docs/FRONTEND_DOCUMENTATION_AUDIT.md) - Аудит документации и реальной готовности (95%)
- [Design System](./docs/design-system.md) - Дизайн-система и токены

### Claude Code & MCP Integration

- [Web Version Setup](./.claude/WEB_VERSION_SETUP.md) - **Настройка для веб-версии Claude Code** (claude.ai)
- [MCP Setup](./.claude/MCP_SETUP.md) - Общая документация по MCP серверам
- [MCP Final Configuration](./.claude/MCP_FINAL_CONFIG.md) - Финальная конфигурация 7 серверов
- [GitHub MCP Setup](./.claude/GITHUB_MCP_SETUP.md) - Настройка GitHub интеграции

**Быстрый старт для веб-версии:**
1. Откройте [claude.ai](https://claude.ai) → вкладка "Code"
2. Подключите этот репозиторий
3. MCP серверы загрузятся автоматически из `.mcp.json`
4. Настройте токены в Settings → Integrations

### Референсная документация (KWID)

Все детальные отчеты по страницам референс-сервиса находятся в `references-kwid/`:

- [AI Agents Page](./references-kwid/AI_AGENTS_PAGE_DETAILED_REPORT.md)
- [Dashboard Page](./references-kwid/DASHBOARD_PAGE_DETAILED_REPORT.md)
- [Categories Page](./references-kwid/CATEGORIES_PAGE_DETAILED_REPORT.md)
- [Articles Page](./references-kwid/ARTICLES_PAGE_DETAILED_REPORT.md)
- [Pricing Page](./references-kwid/PRICING_PAGE_DETAILED_REPORT.md)
- [Header](./references-kwid/HEADER_DETAILED_REPORT.md)
- [Sidebar](./references-kwid/SIDEBAR_DETAILED_REPORT.md)
- [Test Chat Page](./references-kwid/TEST_CHAT_PAGE_DETAILED_REPORT.md)
- [Notifications Modal](./references-kwid/NOTIFICATIONS_MODAL_DETAILED_REPORT.md)
- И другие...

## 🛠️ Разработка

### Команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск production
npm start

# Тесты
npm run test              # Все тесты
npm run test:unit         # Юнит тесты
npm run test:e2e          # E2E тесты

# Линтинг
npm run lint

# Type checking
npm run type-check
```

### Структура проекта

```
.
├── app/                    # Next.js App Router
├── components/            # React компоненты
├── lib/                   # Утилиты и сервисы
├── services/              # Background workers
├── supabase/              # Миграции БД
└── tests/                 # Тесты
```

Подробнее: [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🔧 Конфигурация

### Обязательные переменные окружения

```bash
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENROUTER_API_KEY=...
REDIS_URL=redis://localhost:6379
```

Полный список: [ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md)

## 🧪 Тестирование

```bash
# Юнит тесты
npm run test:unit

# E2E тесты
npm run test:e2e

# Компонентные тесты
npm run test:components
```

## 📦 Деплой

### Vercel

```bash
npm run vercel:deploy
```

### Docker

```bash
# Локальное окружение разработки
docker compose -f docker-compose.dev.yml up --build

# Staging песочница
docker compose -f docker-compose.staging.yml up --build
```

### Мониторинг

```bash
docker compose -f monitoring/docker-compose.yml up -d
```

## 🤝 Вклад

1. Fork проекта
2. Создать feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменений (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Открыть Pull Request

## 📄 Лицензия

Private - Все права защищены

---

**Версия:** 1.0.5  
**Дата обновления:** 2025-01-26
