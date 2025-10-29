# Архитектура GPT Agent Platform

## 1. Обзор

Платформа позволяет компаниям подключать собственную CRM (на старте Kommo), обучать AI-агента и делегировать ему работу с лидами: переписку во всех каналах, обновление сделок, создание задач и триггеров. Решение построено на **Next.js App Router** и разделено на UI, API-слой и воркеры. Все данные и конфигурации хранятся в **Supabase (PostgreSQL + Storage + pgvector)**, фоновые процессы используют **Redis + BullMQ**.

```
┌────────────────────┐      ┌────────────────────────────┐
│  Web App (Next.js) │◀────▶│  API Gateway (Next.js RSC) │
└────────────────────┘      └────────────────────────────┘
           ▲                          │
           │                          ▼
           │               ┌────────────────────┐
           │               │   Worker Service   │
           │               └────────────────────┘
           │                          │
           ▼                          ▼
┌───────────────────┐      ┌────────────────────┐
│  Supabase (DB)    │      │ Redis / Message Bus│
└───────────────────┘      └────────────────────┘
```

## 2. Компоненты

### 2.1 Web App (Next.js)
- App Router, React Server Components.
- Авторизация и организация рабочих пространств (multi-tenant).
- UI аналога Kommo: страницы агентов, настройки воронок, триггеры, цепочки, интеграции, база знаний.
- Загрузка файлов для знания → Supabase Storage.
- Управление секретами (Kommo Client ID/Secret, OpenRouter token) через защищённые формы — сохраняем в Supabase Vault.

### 2.2 API Gateway (Route Handlers / Server Actions)
- Фасад для UI → Supabase и внутреннего backend.
- Kommo OAuth flow: авторизация, callback, refresh токенов.
- Прокси к OpenRouter (выбор моделей, лимиты, биллинг токенов).
- REST/GraphQL API для внешней автоматизации (в перспективе).

### 2.3 Worker Service
- Node.js (Fastify/Nest) или отдельный Next.js edge runtime с cron.
- Обработка событий Kommo webhook → сохранение в Supabase, публикация задач в Redis.
- Выполнение шагов агента: генерация ответов, обновление сделок, отправка email/чат сообщений через Kommo API.
- Индексация файлов (адаптер OpenAI embeddings или собственного провайдера из OpenRouter) и запись в pgvector.

### 2.4 MCP Servers
- Используются для внутренних тулов (например, документация, консультанты и т. д.).
- Секреты для MCP задаются через Supabase Vault или Vercel env.
- Настроим health-check и fallback на случай недоступности сервера.

## 3. Данные в Supabase

| Таблица | Назначение |
| --- | --- |
| `organizations` | Компании/аккаунты. |
| `users` | Пользователи платформы, связь с организациями/ролями. |
| `profiles` | Настройки пользователя. |
| `agents` | Конфигурация AI-агентов. |
| `agent_versions` | История инструкций/моделей (для откатов). |
| `agent_channels` | Каналы (email, WhatsApp, Kommo Chat). |
| `pipelines` | Воронки CRM, импортированные из Kommo. |
| `pipeline_stages` | Этапы воронок. |
| `agent_stage_policies` | Настройка, как агент реагирует на этап. |
| `triggers` | Условия и действия. |
| `sequences` | Автоматизации (follow-up). |
| `knowledge_files` | Метаданные загруженных файлов. |
| `knowledge_chunks` | Разбивка контента. |
| `knowledge_embeddings` | Векторные представления (pgvector). |
| `kommo_connections` | OAuth токены, домен клиента, настройка прав. |
| `kommo_events` | Журнал событий/webhook. |
| `message_logs` | История общения агента. |
| `billing_usage` | Учёт токенов, стоимости, лимитов. |

## 4. Интеграция с Kommo

1. **OAuth**: пользователь вводит `client_id`/`client_secret` → сохраняем в Supabase Vault → инициируем OAuth → сохраняем `access_token`, `refresh_token`, `base_domain`, `expires_at`.
2. **Webhook**: регистрируем подписки на события (создание/изменение сделок, контактов, сообщения, задачи). Коллектор вебхуков → Supabase → Redis queue.
3. **API провайдер** (`lib/crm/providers/KommoProvider.ts`):
   - `syncPipelines()`, `syncStages()`
   - `listDeals()`, `updateDealStage()`
   - `sendEmail()`, `sendChatMessage()`
   - `listTasks()`, `createTask()`
   - `listNotes()`, `createNote()`
4. **Действия агента**:
   - Определяем intent (тип услуги) → выбираем соответствующую воронку/этап.
   - Обновляем сделку (POST `/api/v4/leads`), добавляем примечания.
   - Отправляем письмо/сообщения через Kommo (`/api/v4/contacts/send_message`, интеграции каналов Kommo).

## 5. AI и знаниевая база

- Платформа даёт выбор модели через OpenRouter (GPT‑4/5, Claude, Llama и др.). Пользователь добавляет собственный `OPENROUTER_API_KEY`.
- Файлы (PDF/Docs/HTML) попадают в Supabase Storage → воркер парсит → делит на чанки → записывает в `knowledge_chunks` + embeddings в `knowledge_embeddings` (pgvector 1536/3072 в зависимости от модели).
- `agent_memory_graph` (опционально) — связи между сущностями (клиенты, услуги, события).
- Контекст генерации: системные инструкции + векторный поиск + короткосрочная память (history из `message_logs`).

## 6. Безопасность

- Все секреты (Kommo, OpenRouter, MCP) храним в Supabase Vault или внешнем KMS.
- Для serverless деплоя на Vercel — используем Encrypted KV/Edge Config.
- RLS-политики на таблицах Supabase (organization_id).
- Audit log (`audit_logs`): кто и когда изменил настройки агента.
- HTTPS, подпись вебхуков Kommo, проверка IP.

## 7. Биллинг и метрики

- Логи использования токенов (`billing_usage`).
- Dashboards: количество ответов, стоимость, SLA.
- Лимиты тарифов (таблица `subscriptions`).

## 8. Планы развития

1. **Фаза 1** — базовая платформа: onboarding, Supabase schema, OAuth Kommo, UI для инструкций, тестовый чат c реальными ответами.
2. **Фаза 2** — полнофункциональный агент: триггеры, stage policies, отправка email/чатов через Kommo, запросы к OpenRouter, учёт токенов.
3. **Фаза 3** — интеграции каналов (Telegram, WhatsApp), rule engine, sequences, A/B‑тестирование.
4. **Фаза 4** — DevOps: Docker, CI/CD, Observability, rate limiting, SSO.

---
Документ служит основой для разработки и будет дополняться по мере реализации. Следующий шаг — подготовить структуру БД и seed-данные в Supabase.
