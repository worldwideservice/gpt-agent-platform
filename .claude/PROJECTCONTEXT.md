# GPT Agent AI Platform - Контекст проекта для Claude Code

## О проекте

Платформа для создания и управления AI агентами с интеграцией CRM (Kommo/amoCRM).

**Версия:** 1.0.5
**Дата обновления:** 2025-11-14

## Технологический стек

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **UI:** Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Fastify
- **Database:** Supabase (PostgreSQL)
- **Cache/Queue:** Redis, BullMQ
- **AI:** OpenRouter, OpenAI GPT-5 Brain
- **CRM:** Kommo/amoCRM интеграция
- **Testing:** Vitest, Playwright
- **Deployment:** Vercel, Docker

## Структура проекта

```
app/                    # Next.js App Router
  ├── (auth)/          # Аутентификация
  ├── (public)/        # Публичные страницы
  ├── manage/          # Защищенные страницы
  └── api/v1/          # API endpoints

components/            # React компоненты
  ├── features/        # Feature-специфичные
  ├── layout/          # Layout компоненты
  ├── ui/              # shadcn/ui базовые компоненты
  └── providers/       # Context providers

lib/                   # Утилиты и сервисы
  ├── services/        # Бизнес-логика
  ├── repositories/    # Data access
  ├── crm/            # CRM интеграции
  └── ai/             # AI сервисы

types/                # TypeScript типы
tests/                # Тесты
  ├── unit/
  ├── integration/
  └── e2e/
```

## Стиль кода

### TypeScript
- Используем strict mode
- Все компоненты типизированы
- Избегаем `any`, используем `unknown` где необходимо
- Интерфейсы для props, типы для unions/utilities

### React
- Server Components по умолчанию
- Client Components только с `"use client"`
- Хуки в начале компонента
- Именование: PascalCase для компонентов, camelCase для функций

### Импорты
- Абсолютные импорты через `@/` для app-specific
- Относительные только для соседних файлов
- Группировка: React, libraries, components, utils, types

### CSS
- Tailwind CSS для стилизации
- shadcn/ui для базовых компонентов
- CSS modules только для специфичных случаев

## Правила разработки

1. **Тестирование**
   - Юнит тесты для utils и сервисов
   - Интеграционные для API
   - E2E для критичных flow

2. **API Routes**
   - Валидация входных данных
   - Обработка ошибок
   - Rate limiting где необходимо
   - Логирование всех запросов

3. **Безопасность**
   - Никогда не коммитим .env файлы
   - Санитизация пользовательских данных
   - CSRF защита для форм
   - XSS защита

4. **Performance**
   - Lazy loading для heavy компонентов
   - Image optimization через next/image
   - API response caching
   - Database query optimization

## Переменные окружения

### Критичные переменные
- `NEXTAUTH_SECRET` - NextAuth секрет
- `SUPABASE_URL` - URL Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role ключ
- `OPENROUTER_API_KEY` - OpenRouter API
- `REDIS_URL` - Redis connection

См. `env.example` для полного списка.

## Команды разработки

```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Все тесты
npm run lint         # ESLint
npm run type-check   # TypeScript проверка
make dev             # Docker dev окружение
```

## Интеграции

### Kommo CRM
- OAuth 2.0 авторизация
- Webhook для событий
- Синхронизация пайплайнов, воронок, полей
- Real-time обновления

### AI Сервисы
- OpenRouter для различных моделей
- OpenAI GPT-5 Brain для продвинутых задач
- Embeddings для базы знаний
- Whisper для ASR
- TTS (ElevenLabs/Azure)

## Особенности архитектуры

1. **Multi-tenant** - Workspaces для изоляции данных
2. **Real-time** - WebSocket/SSE для обновлений
3. **Queue System** - BullMQ для фоновых задач
4. **Vector DB** - Для RAG и semantic search
5. **Monitoring** - Prometheus + Grafana

## Полезные ссылки

- [README.md](./README.md) - Основная документация
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Детальная структура
- [docs/](./docs/) - Техническая документация
- [docs/FRONTEND_ANALYSIS_REPORT.md](./docs/FRONTEND_ANALYSIS_REPORT.md) - Анализ фронтенда
- [docs/FRONTEND_ACTION_PLAN.md](./docs/FRONTEND_ACTION_PLAN.md) - План развития фронтенда
- [docs/PROJECT_IMPROVEMENTS.md](./docs/PROJECT_IMPROVEMENTS.md) - Последние улучшения
- [references-kwid/](./references-kwid/) - Референсная документация KWID

## Workflow для разработки

1. Создать feature branch от `main`
2. Внести изменения
3. Запустить тесты (`npm test`)
4. Проверить типы (`npm run type-check`)
5. Запустить линтер (`npm run lint`)
6. Создать коммит с описательным сообщением
7. Создать Pull Request
8. После ревью - мерж в `main`

## Текущий статус

**Frontend:** 65-70% готовности (см. FRONTEND_ANALYSIS_REPORT.md)
**Backend:** 75-80% готовности (см. PROJECT_IMPROVEMENTS.md)
**Production Ready:** P0 блокеры решены (Redis rate limiting, structured logging)

## Известные проблемы

- См. [TODO_ISSUES.md](./TODO_ISSUES.md) для актуального списка (4 открытых)
- См. [docs/FRONTEND_ACTION_PLAN.md](./docs/FRONTEND_ACTION_PLAN.md) для плана развития UI

## Контакты и поддержка

- GitHub: worldwideservice/gpt-agent-platform
- Документация: ./docs/
