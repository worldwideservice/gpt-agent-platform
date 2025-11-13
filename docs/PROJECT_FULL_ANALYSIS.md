# Полный анализ текущего состояния GPT Agent AI Platform

> Подготовлено: Codex (assistant)  
> Дата: 2025-02-15

Документ фиксирует результат полного осмотра репозитория и собирает требования к
разработке, дизайну и DevOps чтобы довести продукт до «продакшен‑готового»
состояния. Разделы выстроены в порядке «что есть → чего не хватает →
план действий по ролям».

---

## 1. Состояние репозитория

### 1.1 UI / App Router (`app/`, `components/`, `messages/`, `stories/`)
- **Рабочие страницы `app/(public)`**: лендинг, тарифы, политика,
  условия и т.д. опубликованы; контент статичен и использует пары RU/EN.
- **Маркетинговый контур** пополнен страницей `app/faq` и единым `ProductAnalyticsProvider`
  для публичной части (Segment + PostHog), события page view уже прокидываются.
- **Личный кабинет `/manage/[tenantId]`** готов как shell:
  `layout.tsx`, `ManageSidebar`, `ManageHeader`, страницы `dashboard`,
  `ai-agents`, `knowledge-base`, `integrations`, `test-chat`, `settings`
  содержат каркас и плейсхолдеры. Данные берутся из заглушек или вообще
  отсутствуют.
- **UI-компоненты** лежат в `components/ui` (shadcn), feature-слой в
  `components/features/*`. Таблицы агентов, knowledge overview,
  список интеграций и т.д. пока работают только на mock-данных.
- **Дизайн-референсы** полностью выгружены в `references-kwid/*.md`
  (по каждой странице есть precise specs до spacing и states).
- **i18n**: `messages/en.json` и `messages/ru.json` есть, но manage‑UI
  хардкодит строки на русском.

### 1.2 Backend / Supabase (`app/api/*`, `lib/repositories/*`, `supabase/`)
- **API Next.js**: присутствуют маршруты для аутентификации и базовых
  операций, однако часть эндпоинтов (например `/api/agents`) возвращают
  заглушки. Новые manage-страницы пока не прокинуты в API.
- **Supabase**: миграции (`supabase/migrations`) покрывают сущности
  агентов, знаний, памяти, knowledge_graph, CRM-подключений. Нужна
  актуализация под новые поля (tenant context, org-level ключи).
- **Repositories**: `lib/repositories/*` содержит богато описанный слой
  (company knowledge, knowledge-search, kommo, др.), однако часть функций
  возвращает мок-данные или TODO.

### 1.3 AI слой (`lib/services/ai/*`, `lib/services/{llm,embeddings,...}`)
- **OpenRouter клиент** (`lib/services/ai/openrouter.client.ts`) готов,
  в т.ч. общие `getOpenRouterClient()`.
- **OpenAI Brain клиент** заготовлен (без consumers).
- **LLM сервис** (`lib/services/llm.ts`) вызывает OpenRouter, формирует
  системный промпт из инструкций + knowledgeContext, но не получает
  конфигурации per org.
- **Embeddings сервис** (`lib/services/embeddings.ts`) использует
  OpenRouter embeddings и простое разбиение чанков (есть стилистические
  долги по линтингу).
- **Agent context builder / memory** переписаны под новую архитектуру,
  но: (a) knowledge graph context подключен частично, (b) нет Redis
  кешей инструкций, (c) API `/api/chat` и test chat не используют новые
  поля.
- **Workers**: `services/api` + `services/worker` имеют заготовки под
  обработку знаний, но нет shared пакета и единых утилит chunking.

### 1.4 CRM / Kommo (`lib/crm`, `services/api/src/routes/kommo.ts`)
- Fastify‑сервис уже умеет:
  - сохранять OAuth креды (POST `/credentials`);
  - стартовать OAuth flow и колбэк;
  - сохранять connection и ставить задачи синка в BullMQ.
- TODO: webhooks (подпись/ретраи), sync pipelines/kanban, отправка
  сообщений, rule engine действия → Kommo API.
- Next.js часть всё ещё использует старые `app/api/...` для OAuth — надо
  переключить UI на Fastify.

### 1.5 Infra / DevOps (`docker-compose.yml`, `monitoring/`, `scripts/`)
- Базовые Dockerfile/compose есть, но:
  - нет `docker-compose.dev.yml` с Next + Fastify + Workers + Supabase CLI;
  - env-файлы дублируются (`env 2.example`, `env.production 2.example` и т.д.);
  - нет скриптов валидации env;
  - мониторинг (Prometheus/Grafana/Alertmanager) лежит заготовкой без
    конфигов сервисов.
- CI/CD не представлен (нет `.github/workflows`). Тестовые команды есть,
  но не автоматизированы.

### 1.6 Тесты (`tests/`, `playwright/`)
- Огромный набор e2e/unit/spec файлов заскэффолден, однако нет
  реализаций (многие тесты просто описания или пустые). Запуск не
  проверялся.

### 1.7 Документация (`docs/*`, `README.md`, `PROJECT_STRUCTURE.md`)
- README и PROJECT_STRUCTURE уже обновлены для нового `/manage`.
- В `docs/` лежат планы по AI, Kommo, BullMQ, websockets, env,
  implementation plan. Надо синхронизировать фактическое состояние с
  прогрессом (часть чекбоксов ещё пустые). Добавлены новые артефакты по
  поддержке (`docs/support.md`), продуктовой аналитике (`docs/PRODUCT_ANALYTICS.md`)
  и GTM (`docs/GTM_PLAYBOOK.md`) — требуется встроить их в рабочий процесс.

---

## 2. Основные проблемы и пробелы

1. **UI ↔ API разрыв**: страницы `/manage` показывают только плейсхолдеры,
   нет Supabase data fetching, нет форм.
2. **Организационные настройки AI**: ключи и выбор моделей не завязаны
   на `org_id`, всё работает через глобальные env.
3. **Контекст агента**: builder формирует текст, но не интегрирован в
   реальные чаты/tests. Нет кешей/ограничения token usage.
4. **CRM поток**: OAuth flow есть, но вебхуки/синхронизации и Rule Engine
   не подключены к UI и очередям.
5. **Инфраструктура**: нет готовой dev/preview сборки, env хаос,
   мониторинг и алерты отсутствуют.
6. **Тесты и качество**: нет проверенных юнитов для новых сервисов,
   Playwright сценарии не покрывают `/manage`.
7. **Дизайн-система**: нет единого файла дизайн-токенов, новые страницы
   используют разные шрифты/spacing; доступность не проверена.
8. **Продуктовая аналитика**: события page view завелись, но нет identify,
   кастомных ивентов (активация, retention) и связки с GTM-дашбордами.

---

## 3. План действий по ролям

### 3.1 Senior Fullstack / Platform Engineers
1. **Завершить `/manage`**
   - Подключить Supabase клиент в серверных компонентов (React Server
     Components) и передавать реальные данные (агенты, знания,
     интеграции).
   - Добавить формы создания/редактирования агентов, загрузки знаний,
     подключения интеграций.  
   - Встроить `useTenantId` (есть хук-заготовка) и общий `TenantContext`.
2. **AI слой**
   - Перевести `generateChatResponse` на org-specific конфигурацию:
     хранить ключи и модели в Supabase (`organization_settings`).  
   - Доделать `buildAgentContext`: knowledge graph из Supabase, кеш
     инструкций в Redis, добавить контроль длины промпта.  
   - Обновить `/api/chat` и test chat UI → использовать новые поля
     (`agentInstructions`, memory, knowledgeGraph).
3. **CRM/Rule Engine**
   - UI для Kommo OAuth + статус интеграции.  
   - Rule Engine/Sequences (`lib/services/rule-engine.ts`,
     `sequences.ts`) привязать к Kommo API действиям и BullMQ задачам.  
   - Обработчики вебхуков + очередь `crm:sync:*`.
4. **Docs & DX**
   - Синхронизировать `docs/IMPLEMENTATION_PLAN.md` (отметить выполненные
     пункты), описать новые API в `/docs`.
   - Привести `lib/lib/*` (дубликат) к автоматической синхронизации
     (скрипт или удалить дубликаты).
   - Интегрировать GTM/аналитику из новых документов в дорожную карту
     (identify, события конверсии, PostHog dashboard).

### 3.2 Senior DevOps / SRE
1. **Окружения**  
   - Консолидация env-файлов в `env.example` + `env.production`.  
   - Скрипт `scripts/verify-env.ts` для проверки обязательных переменных
     (AI, Kommo, Supabase, Redis, мониторинг).
2. **Docker / Compose**  
   - `docker-compose.dev.yml`: Next.js, Fastify API, Worker, Redis,
     Supabase Edge runtime (или `supabase start`), Mailhog.  
   - Makefile/ npm scripts: `npm run dev:all`, `npm run worker`, `npm run api`.
3. **CI/CD**  
   - GitHub Actions (или GitLab) pipeline: lint → test → build → deploy.  
   - Кэш npm, артефакты Playwright.  
   - Secret management (OpenRouter, Supabase) через Actions secrets.
4. **Мониторинг**  
   - Прокинуть метрики Fastify/Worker в `monitoring/prometheus`.  
   - Настроить Grafana dashboards (LLM latency, Kommo sync, очередь).  
   - Alertmanager правила (долгая очередь, 5xx API, истекающие токены).
5. **Observability/Logging**
   - Логгирование через Pino + Transport в Elasticsearch/Sentry.  
   - Трассировки (OpenTelemetry) для LLM/Kommo вызовов.

### 3.3 Senior Designer / Design Lead
1. **Дизайн-токены**  
   - Собрать глобальные цвета/типографику/spacing из `references-kwid`
     → `design-tokens.json` + Tailwind config.  
   - Определить интерактивные состояния (hover/focus/pressed) и
     распространить через shadcn/ui theme overrides.
2. **UI Kits / Storybook**  
   - Создать макеты для manage‑страниц (dashboard, agents, knowledge,
     integrations, chat, settings) с responsive состояниями согласно
     reference MD.  
   - Storybook stories для `ManageSidebar`, `ManageHeader`,
     таблиц/карт чекбоксы/модалки.  
3. **Design QA**  
   - Определить чек-лист доступности (контраст, клавиатура, focus
     outlines) и передать dev-команде.  
   - Подготовить экспорт для маркетинговых страниц (SVG/PNG/illustrations).
4. **Документация**  
   - В `references-kwid` добавить ссылки на Figma/Zeroheight, чтобы
     разработчики видели актуальные макеты.  
   - Согласовать naming меню/секций (Sidebar, Header) с продуктом.

---

## 4. Дополнительные находки

- `components/features/integrations/IntegrationsList.tsx` содержал
  хвост `*** End Patch` → удалено в рамках текущей задачи.
- `lib/services/embeddings.ts` использует нестандартное форматирование —
  ESLint/Prettier следует запустить после основного рефакторинга.
- Дублирующая структура `lib/lib/*` требует автоматического зеркалирования
  (см. README, пункт о parity) — без этого легко нарушить синхронность.
- В `references-kwid/` уже есть отчёты по Facebook/Instagram/CRM
  страницам — нужно сопоставить с настоящими маршрутами (пока не созданы).

---

## 5. Следующие шаги (кратко)

1. Утвердить дорожную карту (см. `docs/IMPLEMENTATION_PLAN.md`) и
   разделить задачи между FE/BE/DevOps/Design.
2. Начать с блока **UI Shell → реальные данные** и **AI per-org config**
   (это блокирует дальнейшие интеграции).
3. Параллельно DevOps готовит окружения и CI; дизайнер синхронизирует
   токены + макеты.
4. После MVP (UI + AI + Kommo auth) переключиться на Rule Engine /
   Sequence Engine и прогнать первые интеграционные тесты.

Документ можно расширять по мере выполнения пунктов (добавлять ссылки
на задачи, коммиты, диаграммы). Это станет единой точкой входа для
Senior инженеров и дизайнеров.
6. **Product & GTM**
   - Подключить identify/alias в ProductAnalyticsProvider и настроить
     отправку ключевых событий (signup, onboarding_completed, agent_created).
   - Импортировать тарифные планы и SLA из `docs/GTM_PLAYBOOK.md` в UI и
     коммуникационные цепочки.
   - Реализовать FAQ/Support как часть постоянного контента (RSS/ссылки в кабинете).
