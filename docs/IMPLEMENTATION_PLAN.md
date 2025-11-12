# План реализации GPT Agent AI Platform

> Подготовлено: 2025-02-14  
> Ответственный: Codex (assistant)

Документ фиксирует последовательность задач для превращения текущего репозитория
в полнофункциональную платформу (UI + AI + CRM + инфраструктура).  
Цель – обеспечить прозрачный фронт работ для команды разработчиков/дизайнеров/DevOps.

---

## 1. UI / App Router

### 1.1 Каркас `app/manage`
- [x] Создать `app/manage/layout.tsx` с Header + Sidebar.
- [ ] Вынести глобальные токены (цвета, типографика, spacing) в отдельный модуль
      (`design-tokens.ts` + обновление `tailwind.config.ts`).
- [ ] Создать контекст `TenantContext` (tenantId, org info) + хук `useTenant`.
- [ ] Прописать skeleton states и мобильное меню (бургер) для sidebar.

### 1.2 Страницы и маршруты
- [x] `/manage/[tenantId]/dashboard`
- [x] `/manage/[tenantId]/ai-agents` (каркас)
- [ ] `/manage/[tenantId]/ai-agents` – подключить Supabase данные, фильтры, действия (create/edit/delete).
- [ ] `/manage/[tenantId]/ai-agents/[id]` (вкладки с настройками + формы).
- [x] `/manage/[tenantId]/knowledge-base` (каркас)
- [ ] `/manage/[tenantId]/knowledge-base` – загрузка файлов, статусы обработки, связка с воркерами.
- [x] `/manage/[tenantId]/integrations` (каркас)
- [ ] `/manage/[tenantId]/integrations` – реальные статусы Kommo/Slack, кнопки OAuth.
- [x] `/manage/[tenantId]/test-chat`
- [x] `/manage/[tenantId]/settings` (каркас)
- [ ] `/manage/[tenantId]/settings` – формы обновления workspace, feature flags.
- [ ] Общие компоненты: Breadcrumbs, таблицы, карточки, формы (Storybook + unit tests).

### 1.3 Хуки и клиентские сервисы
- [x] `useTenantId`.
- [ ] `useCRMData`, `useFeatureFlags`, `useWorkspace`.
- [ ] API-клиент (`lib/api/client.ts`) для fetch-вызовов с обработкой ошибок + React Query.
- [ ] Toast + статусные индикаторы для всех потоков (обработчик глобальных ошибок).
- [ ] Supabase RSC data-fetching helpers (`getTenantAgents`, `getKnowledgeStats`, …).

---

## 2. AI слой

### 2.1 Клиенты
- [x] `lib/services/ai/openrouter.client.ts` (chat + embeddings).
- [x] `lib/services/ai/openai-brain.client.ts` (GPT-5 Brain, tools).
- [x] Конфигурация per-org (таблица `organization_settings`, resolver + env fallback).
- [ ] Кеширование клиентов/моделей в Redis + health-check эндпоинт.

### 2.2 Контекст и память
- [ ] Завершить `agent-context-builder` (knowledge graph, vector search, memory) + unit-тесты.
- [x] Исправить MemoryService (убрать `dummy-org`, заменить similarity на embeddings).
- [ ] Добавить кеширование инструкций агента (Redis).
- [ ] Интегрировать context builder в `/api/chat`, Test Chat, Rule Engine.

### 2.3 Worker задачи
- [ ] Вынести общий пакет `packages/shared-ai` (embedding utils, chunking).
- [ ] Обновить `process-asset` и `extract-knowledge-graph` до shared пакета.
- [ ] Настроить расписание для переиндексации, контроль токенов, retries.

---

## 3. CRM / Integrations

### 3.1 Kommo OAuth/Webhooks
- [ ] Избавиться от жёстко прошитого callback в Next (`app/api/.../callback`).
- [ ] Использовать Fastify сервис (`services/api`) как единую точку OAuth.
- [ ] Реализовать проверку подписи webhook (HMAC) + retry/TTL.
- [ ] UI-индикаторы статуса интеграции + повторное подключение.

### 3.2 Синхронизация
- [ ] `services/api` задачи sync pipelines/channels/fields → Supabase.
- [ ] Worker job `crm:sync:*` + мониторинг прогресса.
- [ ] API `/api/kommo/status` + UI метрики (последний sync, ошибки).

### 3.3 Rule Engine / Sequences
- [ ] Закончить действия (Kommo API вызовы).
- [ ] Очередь BullMQ для шагов (`sequence:step` job).
- [ ] UI редактор правил и последовательностей.
- [ ] Тестовые сценарии и симулятор в Test Chat.

---

## 4. Инфраструктура и DevOps

### 4.1 Docker / Compose
- [ ] Новый `docker-compose.dev.yml` (Next + Fastify + Worker + Supabase CLI + Redis).
- [ ] Описание запуска в README + сценарии `npm run dev:all`.
- [ ] Отдельный compose для staging/production (с Auto SSL, scaling).

### 4.2 ENV и секреты
- [ ] Консолидация `.env.*` (один `env.example`).
- [ ] Скрипт `scripts/verify-env.js` → обновить под новый список переменных.
- [ ] Настроить secrets management (1Password/Vault/GitHub Environments).

### 4.3 Мониторинг
- [ ] Экспорт метрик (Prometheus endpoint) для Fastify и Worker.
- [ ] Настроить Alertmanager + Sentry DSN (через env).
- [ ] Дашборды (LLM latency, Kommo sync показатели, очередь BullMQ).

---

## 5. Тестирование и качество

### 5.1 Vitest
- [ ] Исправить/создать тесты для новых хуков/репозиториев.
- [ ] Добавить unit-тесты Rule Engine / Sequence Engine / AI клиентов.
- [ ] Покрыть context builder + memory heuristics.

### 5.2 Playwright
- [ ] Обновить сценарии под реальные страницы `/manage`.
- [ ] Добавить smoke-тесты интеграций (OAuth flow → mock).
- [ ] Добавить визуальные тесты (скриншоты) для новых макетов.

### 5.3 CI/CD
- [ ] Включить `npm run test` в `.github/workflows/main.yml`.
- [ ] Артефакты (coverage, playwright-report) как uploads в Actions.
- [ ] Деплой staging/production (Vercel + Railway/Fly для API/worker).

---

## 6. Приоритет на первую итерацию (MVP)
1. Каркас `/manage` (layout + базовые страницы) + хуки.
2. AI клиенты и обновлённый `agent-context-builder`.
3. Kommo OAuth/Webhook (безопасный flow).
4. Инфраструктура (docker-compose, env, rate limiting).
5. Базовые тесты/CI для новых модулей.

После завершения MVP – переход к Rule Engine, Sequence Engine, UI-редакторам
и расширенному мониторингу.

---

**Следующие шаги:**  
- Подтвердить приоритеты с продуктовой командой.  
- Создать задачи в issue tracker по блокам (UI, AI, CRM, Infra).  
- Начать разработку с пункта 1 (каркас `/manage`).  
