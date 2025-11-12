# Полная структура проекта GPT Agent AI

> Документ создан на основе детального анализа всех страниц и функциональности сервиса через MCP Playwright

## 📁 Корневая структура проекта

```
.
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Группа маршрутов аутентификации
│   ├── (public)/                 # Публичные страницы
│   ├── api/                      # API Routes
│   ├── docs/                     # Документация
│   ├── manage/                   # Защищенные страницы управления
│   ├── pricing/                  # Публичная страница тарифов
│   ├── privacy/                  # Политика конфиденциальности
│   ├── support/                  # Поддержка
│   ├── terms/                   # Условия использования
│   ├── globals.css               # Глобальные стили
│   ├── layout.tsx                # Корневой layout
│   ├── page.tsx                  # Главная страница (Landing)
│   ├── error.tsx                 # Error boundary
│   ├── global-error.tsx          # Global error boundary
│   ├── not-found.tsx             # 404 страница
│   └── sitemap.ts                # Sitemap генератор
│
├── components/                   # React компоненты
│   ├── auth/                    # Компоненты аутентификации
│   ├── features/                # Feature-специфичные компоненты
│   ├── layout/                  # Layout компоненты
│   ├── pricing/                 # Компоненты тарифов
│   ├── providers/               # Context providers
│   └── ui/                      # Базовые UI компоненты (shadcn/ui)
│
├── lib/                          # Утилиты и библиотеки
│   ├── admin.ts                 # Админ функции
│   ├── analytics.ts             # Аналитика
│   ├── backend/                 # Backend утилиты
│   ├── browser-connector/       # Browser connector
│   ├── cache.ts                 # Кэширование
│   ├── crm/                     # CRM интеграции
│   ├── env/                     # Environment variables
│   ├── feature-flags.tsx        # Feature flags
│   ├── graphql/                 # GraphQL клиент
│   ├── lib/                     # Дополнительные библиотеки
│   ├── onboarding/              # Onboarding логика
│   ├── providers/               # Провайдеры
│   ├── queue.ts                 # Очереди задач
│   ├── rate-limit.ts            # Rate limiting
│   ├── repositories/            # Data repositories
│   ├── services/                # Бизнес-логика сервисов
│   ├── supabase/                # Supabase клиент
│   ├── utils/                   # Утилиты
│   ├── utils.ts                 # Основные утилиты
│   └── websocket/               # WebSocket клиент
│
├── hooks/                        # React hooks
│   ├── use-mobile.ts
│   ├── use-toast.ts
│   ├── useLoading.ts
│   ├── useServiceWorker.ts
│   └── useWebVitals.ts
│
├── types/                        # TypeScript типы
│   ├── crm.ts
│   ├── index.ts
│   ├── kommo.ts
│   ├── next-auth.d.ts
│   ├── storybook.d.ts
│   ├── supabase.ts
│   ├── swagger-jsdoc.d.ts
│   └── user.ts
│
├── messages/                     # i18n переводы
│   ├── en.json
│   └── ru.json
│
├── public/                       # Статические файлы
│   ├── api-spec.json
│   ├── favicon.ico
│   ├── logo_transparent.png
│   ├── logo_transparent white.png
│   ├── logo.jpg
│   ├── manifest.json
│   ├── robots.txt
│   └── sw.js                      # Service Worker
│
├── scripts/                      # Скрипты
│   ├── migrations/              # Миграции БД
│   ├── seed/                    # Seed скрипты
│   └── *.sh, *.js               # Различные скрипты
│
├── services/                     # Внешние сервисы
│   ├── api/                     # API сервисы
│   └── worker/                  # Background workers
│
├── supabase/                     # Supabase конфигурация
│   ├── config.toml
│   ├── migrations/               # SQL миграции
│   ├── schema.sql
│   └── seed.sql
│
├── tests/                        # Тесты
│   ├── components/               # Компонентные тесты
│   ├── e2e/                      # E2E тесты
│   ├── hooks/                   # Тесты хуков
│   ├── integration/             # Интеграционные тесты
│   ├── lib/                      # Тесты библиотек
│   └── unit/                    # Юнит тесты
│
├── monitoring/                    # Мониторинг
│   ├── alertmanager/
│   ├── grafana/
│   └── prometheus/
│
├── references-kwid/               # Референсная документация
│   └── *.md                      # Детальные отчеты по страницам
│
├── .env.example                  # Пример переменных окружения
├── .gitignore
├── auth.ts                       # NextAuth конфигурация
├── components.json               # shadcn/ui конфигурация
├── docker-compose.yml
├── Dockerfile
├── middleware.ts                 # Next.js middleware
├── next.config.js
├── package.json
├── playwright.config.ts
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.test.json
├── vercel.json
└── vitest.config.ts
```

---

## 📂 Детальная структура app/ директории

### app/(auth)/ - Аутентификация

```
app/(auth)/
├── layout.tsx                    # Layout для страниц аутентификации
├── login/
│   ├── page.tsx                  # Страница входа
│   └── components/               # Компоненты страницы входа
├── register/
│   ├── page.tsx                  # Страница регистрации
│   └── components/
└── reset-password/
    ├── page.tsx                  # Страница сброса пароля
    └── components/
```

### app/(public)/ - Публичные страницы

```
app/(public)/
├── layout.tsx                    # Layout для публичных страниц
├── page.tsx                       # Landing page
├── pricing/
│   └── page.tsx                  # Публичная страница тарифов
├── privacy/
│   └── page.tsx                  # Политика конфиденциальности
├── terms/
│   └── page.tsx                  # Условия использования
└── support/
    └── page.tsx                  # Страница поддержки
```

### app/manage/[workspaceId]/ - Защищенные страницы управления

```
app/manage/[workspaceId]/
├── layout.tsx                    # Layout с Sidebar и Header
├── page.tsx                      # Dashboard (Инфопанель)
│
├── ai-agents/                    # Агенты ИИ
│   ├── page.tsx                  # Список агентов
│   ├── create/
│   │   └── page.tsx              # Создание агента
│   └── [id]/
│       ├── edit/
│       │   ├── page.tsx          # Редактирование (Основные)
│       │   ├── leads-contacts/
│       │   │   └── page.tsx      # Сделки и контакты
│       │   ├── triggers/
│       │   │   └── page.tsx      # Триггеры
│       │   ├── sequences/
│       │   │   └── page.tsx      # Цепочки
│       │   ├── available-integrations/
│       │   │   └── page.tsx      # Интеграции
│       │   └── advanced-settings/
│       │       └── page.tsx      # Дополнительно
│       └── components/           # Компоненты редактирования
│
├── test-chat/                    # Тестовый чат
│   ├── page.tsx
│   └── components/
│
├── knowledge-categories/         # Категории базы знаний
│   ├── page.tsx                  # Список категорий
│   ├── create/
│   │   └── page.tsx              # Создание категории
│   └── [id]/
│       ├── edit/
│       │   └── page.tsx          # Редактирование категории
│       └── components/
│
├── knowledge-items/              # Статьи базы знаний
│   ├── page.tsx                  # Список статей
│   ├── create/
│   │   └── page.tsx              # Создание статьи
│   └── [id]/
│       ├── edit/
│       │   └── page.tsx          # Редактирование статьи
│       └── components/
│
├── account-settings/             # Настройки аккаунта
│   ├── page.tsx
│   └── components/
│
└── pricing/                      # Тарифные планы (внутренняя)
    ├── page.tsx
    └── components/
```

### app/api/ - API Routes

```
app/api/
├── v1/                          # API версия 1
│   ├── agents/                  # Агенты ИИ
│   │   ├── route.ts             # GET, POST /api/v1/agents
│   │   └── [id]/
│   │       ├── route.ts         # GET, PUT, DELETE /api/v1/agents/[id]
│   │       ├── copy/
│   │       │   └── route.ts     # POST /api/v1/agents/[id]/copy
│   │       └── sync-crm/
│   │           └── route.ts     # POST /api/v1/agents/[id]/sync-crm
│   │
│   ├── auth/                    # Аутентификация
│   │   ├── login/
│   │   │   └── route.ts         # POST /api/v1/auth/login
│   │   ├── register/
│   │   │   └── route.ts         # POST /api/v1/auth/register
│   │   ├── logout/
│   │   │   └── route.ts         # POST /api/v1/auth/logout
│   │   ├── refresh/
│   │   │   └── route.ts         # POST /api/v1/auth/refresh
│   │   └── verify/
│   │       └── route.ts         # POST /api/v1/auth/verify
│   │
│   ├── chat/                    # Чат
│   │   ├── route.ts             # POST /api/v1/chat
│   │   └── [chatId]/
│   │       └── route.ts         # GET, DELETE /api/v1/chat/[chatId]
│   │
│   ├── crm/                      # CRM интеграции
│   │   ├── kommo/
│   │   │   ├── oauth/
│   │   │   │   └── route.ts     # GET /api/v1/crm/kommo/oauth
│   │   │   ├── callback/
│   │   │   │   └── route.ts     # GET /api/v1/crm/kommo/callback
│   │   │   ├── sync/
│   │   │   │   └── route.ts     # POST /api/v1/crm/kommo/sync
│   │   │   └── webhooks/
│   │   │       └── route.ts     # POST /api/v1/crm/kommo/webhooks
│   │   └── pipelines/
│   │       └── route.ts         # GET /api/v1/crm/pipelines
│   │
│   ├── dashboard/                # Dashboard
│   │   ├── stats/
│   │   │   └── route.ts         # GET /api/v1/dashboard/stats
│   │   ├── monthly-chart/
│   │   │   └── route.ts         # GET /api/v1/dashboard/monthly-chart
│   │   └── daily-chart/
│   │       └── route.ts         # GET /api/v1/dashboard/daily-chart
│   │
│   ├── knowledge-base/          # База знаний
│   │   ├── categories/
│   │   │   ├── route.ts         # GET, POST /api/v1/knowledge-base/categories
│   │   │   └── [id]/
│   │   │       └── route.ts     # GET, PUT, DELETE /api/v1/knowledge-base/categories/[id]
│   │   └── items/
│   │       ├── route.ts         # GET, POST /api/v1/knowledge-base/items
│   │       └── [id]/
│   │           └── route.ts     # GET, PUT, DELETE /api/v1/knowledge-base/items/[id]
│   │
│   ├── notifications/            # Уведомления
│   │   ├── route.ts             # GET, POST /api/v1/notifications
│   │   ├── [id]/
│   │   │   ├── route.ts         # GET, DELETE /api/v1/notifications/[id]
│   │   │   └── read/
│   │   │       └── route.ts     # PUT /api/v1/notifications/[id]/read
│   │   └── read-all/
│   │       └── route.ts         # PUT /api/v1/notifications/read-all
│   │
│   ├── pricing/                 # Тарифы
│   │   ├── current-plan/
│   │   │   └── route.ts         # GET /api/v1/pricing/current-plan
│   │   └── plans/
│   │       └── route.ts         # GET /api/v1/pricing/plans
│   │
│   ├── search/                   # Глобальный поиск
│   │   └── route.ts             # GET /api/v1/search
│   │
│   ├── test-chat/                # Тестовый чат
│   │   ├── chats/
│   │   │   ├── route.ts         # GET, POST /api/v1/test-chat/chats
│   │   │   └── [chatId]/
│   │   │       ├── route.ts     # GET, DELETE /api/v1/test-chat/chats/[chatId]
│   │   │       └── messages/
│   │   │           └── route.ts # POST /api/v1/test-chat/chats/[chatId]/messages
│   │   └── agents/
│   │       └── route.ts         # GET /api/v1/test-chat/agents
│   │
│   ├── triggers/                 # Триггеры
│   │   ├── route.ts             # GET, POST /api/v1/triggers
│   │   └── [id]/
│   │       └── route.ts         # GET, PUT, DELETE /api/v1/triggers/[id]
│   │
│   ├── sequences/                # Цепочки
│   │   ├── route.ts             # GET, POST /api/v1/sequences
│   │   └── [id]/
│   │       └── route.ts         # GET, PUT, DELETE /api/v1/sequences/[id]
│   │
│   ├── user/                     # Пользователь
│   │   ├── me/
│   │   │   └── route.ts         # GET /api/v1/user/me
│   │   ├── license/
│   │   │   └── route.ts         # GET /api/v1/user/license
│   │   └── preferences/
│   │       └── theme/
│   │           └── route.ts     # PUT /api/v1/user/preferences/theme
│   │
│   └── account/                  # Настройки аккаунта
│       └── settings/
│           └── route.ts         # GET, PUT /api/v1/account/settings
│
├── health/                       # Health check
│   └── route.ts                 # GET /api/health
│
└── webhooks/                     # Webhooks
    └── kommo/
        └── route.ts             # POST /api/webhooks/kommo
```

### app/docs/ - Документация

```
app/docs/
├── layout.tsx                    # Layout документации
├── [locale]/                     # Локализация (ru, en)
│   └── start-here/
│       └── getting-started/
│           └── page.tsx          # Начало работы
└── components/                   # Компоненты документации
```

---

## 📂 Детальная структура components/

```
components/
├── auth/                         # Компоненты аутентификации
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ResetPasswordForm.tsx
│
├── features/                     # Feature-специфичные компоненты
│   ├── agents/                   # Агенты ИИ
│   │   ├── AgentList.tsx
│   │   ├── AgentForm.tsx
│   │   ├── AgentCard.tsx
│   │   ├── AgentTabs.tsx
│   │   ├── BasicSettings.tsx
│   │   ├── LeadsContactsSettings.tsx
│   │   ├── TriggersSettings.tsx
│   │   ├── SequencesSettings.tsx
│   │   ├── IntegrationsSettings.tsx
│   │   ├── AdvancedSettings.tsx
│   │   ├── FunnelConfig.tsx
│   │   ├── ChannelConfig.tsx
│   │   ├── KnowledgeBaseConfig.tsx
│   │   ├── DataAccessConfig.tsx
│   │   ├── DataInputConfig.tsx
│   │   └── components/           # Подкомпоненты
│   │
│   ├── dashboard/                # Dashboard
│   │   ├── DashboardStats.tsx
│   │   ├── MonthlyChart.tsx
│   │   ├── DailyChart.tsx
│   │   └── StatisticsCard.tsx
│   │
│   ├── knowledge-base/           # База знаний
│   │   ├── CategoryList.tsx
│   │   ├── CategoryForm.tsx
│   │   ├── CategoryTree.tsx
│   │   ├── ArticleList.tsx
│   │   ├── ArticleForm.tsx
│   │   └── ArticleEditor.tsx
│   │
│   ├── test-chat/               # Тестовый чат
│   │   ├── ChatList.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── MessageInput.tsx
│   │   └── MessageBubble.tsx
│   │
│   ├── triggers/                 # Триггеры
│   │   ├── TriggerList.tsx
│   │   ├── TriggerForm.tsx
│   │   └── TriggerConditions.tsx
│   │
│   ├── sequences/                # Цепочки
│   │   ├── SequenceList.tsx
│   │   ├── SequenceForm.tsx
│   │   └── SequenceSteps.tsx
│   │
│   └── notifications/            # Уведомления
│       ├── NotificationsButton.tsx
│       ├── NotificationsModal.tsx
│       └── NotificationItem.tsx
│
├── layout/                       # Layout компоненты
│   ├── Header.tsx                # Верхняя панель
│   │   ├── GlobalSearch.tsx
│   │   ├── LicenseWarning.tsx
│   │   ├── NotificationsButton.tsx
│   │   └── UserMenu.tsx
│   │
│   ├── Sidebar.tsx               # Боковая панель
│   │   ├── SidebarNav.tsx
│   │   ├── WorkspaceSelector.tsx
│   │   └── NavItem.tsx
│   │
│   ├── Breadcrumbs.tsx           # Навигационная цепочка
│   └── MainLayout.tsx            # Основной layout
│
├── pricing/                      # Компоненты тарифов
│   ├── PricingPlans.tsx
│   ├── CurrentPlanCard.tsx
│   ├── PricingPlanCard.tsx
│   ├── ResponseSelector.tsx
│   ├── PeriodToggle.tsx
│   └── FAQAccordion.tsx
│
├── providers/                    # Context providers
│   ├── ThemeProvider.tsx
│   ├── QueryProvider.tsx
│   └── AuthProvider.tsx
│
└── ui/                          # Базовые UI компоненты (shadcn/ui)
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── textarea.tsx
    ├── select.tsx
    ├── combobox.tsx
    ├── switch.tsx
    ├── checkbox.tsx
    ├── radio-group.tsx
    ├── tabs.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── popover.tsx
    ├── tooltip.tsx
    ├── toast.tsx
    ├── table.tsx
    ├── pagination.tsx
    ├── badge.tsx
    ├── skeleton.tsx
    ├── spinner.tsx
    ├── progress.tsx
    ├── accordion.tsx
    ├── tree-select.tsx
    ├── searchbox.tsx
    └── ...                       # Другие shadcn/ui компоненты
```

---

## 📂 Детальная структура lib/

```
lib/
├── admin.ts                      # Админ функции
├── analytics.ts                  # Аналитика
│
├── backend/                     # Backend утилиты
│   └── api-client.ts
│
├── browser-connector/           # Browser connector
│   └── index.ts
│
├── cache.ts                     # Кэширование (Redis)
│
├── crm/                         # CRM интеграции
│   ├── kommo/
│   │   ├── client.ts            # Kommo API клиент
│   │   ├── oauth.ts             # OAuth flow
│   │   ├── sync.ts              # Синхронизация
│   │   ├── pipelines.ts         # Воронки
│   │   ├── channels.ts          # Каналы
│   │   ├── fields.ts            # Поля сделок/контактов
│   │   └── webhooks.ts          # Webhooks обработка
│   └── types.ts                 # CRM типы
│
├── env/                         # Environment variables
│   ├── client.ts
│   ├── server.ts
│   └── validation.ts
│
├── feature-flags.tsx            # Feature flags
│
├── graphql/                     # GraphQL клиент
│   ├── client.ts
│   └── queries.ts
│
├── lib/                         # Дополнительные библиотеки
│   └── ...                      # Различные утилиты
│
├── onboarding/                  # Onboarding логика
│   └── index.ts
│
├── providers/                   # Провайдеры
│   ├── query.ts
│   └── auth.ts
│
├── queue.ts                     # Очереди задач (BullMQ)
│
├── rate-limit.ts                # Rate limiting
│
├── repositories/                 # Data repositories
│   ├── agent.repository.ts
│   ├── category.repository.ts
│   ├── article.repository.ts
│   ├── trigger.repository.ts
│   ├── sequence.repository.ts
│   ├── notification.repository.ts
│   └── user.repository.ts
│
├── services/                    # Бизнес-логика сервисов
│   ├── agent.service.ts
│   ├── ai/
│   │   ├── openrouter.client.ts # OpenRouter клиент
│   │   ├── openai.client.ts     # OpenAI клиент (GPT-5 Brain)
│   │   ├── embeddings.service.ts # Embeddings
│   │   ├── whisper.service.ts   # ASR (Whisper)
│   │   ├── tts.service.ts       # TTS (ElevenLabs/Azure)
│   │   └── vector.service.ts    # Векторная БД
│   ├── knowledge-base.service.ts
│   ├── crm.service.ts
│   ├── notification.service.ts
│   ├── chat.service.ts
│   └── trigger.service.ts
│
├── supabase/                    # Supabase клиент
│   ├── client.ts
│   ├── server.ts
│   └── types.ts
│
├── utils/                       # Утилиты
│   ├── date.ts
│   ├── format.ts
│   ├── validation.ts
│   └── ...                      # Другие утилиты
│
├── utils.ts                     # Основные утилиты (cn, и т.д.)
│
└── websocket/                   # WebSocket клиент
    ├── client.ts
    └── server.ts
```

---

## 📂 Детальная структура types/

```
types/
├── index.ts                     # Основные типы
├── crm.ts                       # CRM типы
├── kommo.ts                     # Kommo специфичные типы
├── user.ts                      # Пользователь типы
├── agent.ts                     # Агент типы
├── knowledge-base.ts            # База знаний типы
├── trigger.ts                   # Триггер типы
├── sequence.ts                  # Цепочка типы
├── notification.ts              # Уведомление типы
├── next-auth.d.ts               # NextAuth типы
├── supabase.ts                  # Supabase типы
├── storybook.d.ts               # Storybook типы
└── swagger-jsdoc.d.ts           # Swagger типы
```

---

## 📂 Детальная структура services/

```
services/
├── api/                         # API сервисы
│   ├── agents.api.ts
│   ├── categories.api.ts
│   ├── articles.api.ts
│   ├── triggers.api.ts
│   ├── sequences.api.ts
│   ├── chat.api.ts
│   └── dashboard.api.ts
│
└── worker/                      # Background workers
    ├── crm-sync.worker.ts       # Синхронизация CRM
    ├── agent-training.worker.ts # Обучение агента
    ├── rule-generation.worker.ts # Генерация правил
    ├── notification.worker.ts   # Уведомления
    └── queue.config.ts          # Конфигурация очередей
```

---

## 📂 Детальная структура tests/

```
tests/
├── components/                   # Компонентные тесты
│   ├── ui/                      # Тесты UI компонентов
│   └── features/                # Тесты feature компонентов
│
├── e2e/                         # E2E тесты
│   ├── auth.spec.ts
│   ├── agents.spec.ts
│   ├── knowledge-base.spec.ts
│   ├── dashboard.spec.ts
│   └── test-chat.spec.ts
│
├── hooks/                       # Тесты хуков
│   └── ...
│
├── integration/                 # Интеграционные тесты
│   ├── api/
│   ├── crm/
│   └── ai/
│
├── lib/                         # Тесты библиотек
│   └── ...
│
├── unit/                        # Юнит тесты
│   ├── services/
│   ├── repositories/
│   └── utils/
│
├── setup.ts                     # Test setup
└── helpers/                     # Test helpers
```

---

## 📂 Конфигурационные файлы

```
.
├── .env.example                 # Пример переменных окружения
├── .env.local                   # Локальные переменные (не в git)
├── .env.production              # Production переменные
├── .gitignore
├── .eslintrc.json               # ESLint конфигурация
├── .prettierrc                   # Prettier конфигурация
├── auth.ts                       # NextAuth конфигурация
├── components.json               # shadcn/ui конфигурация
├── docker-compose.yml            # Docker Compose
├── Dockerfile                    # Docker образ
├── middleware.ts                 # Next.js middleware
├── next.config.js                # Next.js конфигурация
├── package.json                  # Зависимости
├── playwright.config.ts          # Playwright конфигурация
├── postcss.config.js             # PostCSS конфигурация
├── tailwind.config.ts           # Tailwind CSS конфигурация
├── tsconfig.json                 # TypeScript конфигурация
├── tsconfig.test.json            # TypeScript для тестов
├── vercel.json                   # Vercel конфигурация
└── vitest.config.ts              # Vitest конфигурация
```

---

## 🔑 Ключевые маршруты (URL структура)

### Публичные маршруты
- `/` - Landing page
- `/pricing` - Публичная страница тарифов
- `/privacy` - Политика конфиденциальности
- `/terms` - Условия использования
- `/support` - Поддержка
- `/docs/ru/start-here/getting-started/` - Документация

### Защищенные маршруты (требуют аутентификации)
- `/manage/[workspaceId]` - Dashboard
- `/manage/[workspaceId]/ai-agents` - Список агентов
- `/manage/[workspaceId]/ai-agents/create` - Создание агента
- `/manage/[workspaceId]/ai-agents/[id]/edit` - Редактирование (Основные)
- `/manage/[workspaceId]/ai-agents/[id]/leads-contacts` - Сделки и контакты
- `/manage/[workspaceId]/ai-agents/[id]/triggers` - Триггеры
- `/manage/[workspaceId]/ai-agents/[id]/sequences` - Цепочки
- `/manage/[workspaceId]/ai-agents/[id]/available-integrations` - Интеграции
- `/manage/[workspaceId]/ai-agents/[id]/advanced-settings` - Дополнительно
- `/manage/[workspaceId]/test-chat` - Тестовый чат
- `/manage/[workspaceId]/knowledge-categories` - Категории
- `/manage/[workspaceId]/knowledge-items` - Статьи
- `/manage/[workspaceId]/knowledge-items/create` - Создание статьи
- `/manage/[workspaceId]/account-settings` - Настройки аккаунта
- `/manage/[workspaceId]/pricing` - Тарифные планы (внутренняя)

### API маршруты
- `/api/v1/agents` - CRUD агентов
- `/api/v1/agents/[id]/copy` - Копирование агента
- `/api/v1/agents/[id]/sync-crm` - Синхронизация с CRM
- `/api/v1/auth/*` - Аутентификация
- `/api/v1/dashboard/*` - Dashboard данные
- `/api/v1/knowledge-base/*` - База знаний
- `/api/v1/test-chat/*` - Тестовый чат
- `/api/v1/triggers/*` - Триггеры
- `/api/v1/sequences/*` - Цепочки
- `/api/v1/notifications/*` - Уведомления
- `/api/v1/pricing/*` - Тарифы
- `/api/v1/search` - Глобальный поиск
- `/api/v1/user/*` - Пользователь
- `/api/v1/account/*` - Настройки аккаунта
- `/api/v1/crm/kommo/*` - Kommo интеграция
- `/api/webhooks/kommo` - Kommo webhooks

---

## 📝 Примечания

### Структура основана на:
1. ✅ Детальном анализе всех страниц через MCP Playwright
2. ✅ Референсной документации в `references-kwid/`
3. ✅ Текущей структуре проекта
4. ✅ Next.js 14 App Router best practices
5. ✅ TypeScript и современным паттернам React

### Особенности:
- **App Router**: Используется Next.js 14 App Router
- **Server Components**: По умолчанию Server Components, Client Components только при необходимости
- **API Routes**: Все API endpoints в `/app/api/v1/`
- **Type Safety**: Полная типизация TypeScript
- **i18n**: Поддержка русского и английского языков
- **Responsive**: Адаптивный дизайн для всех устройств
- **Accessibility**: WCAG AA compliance

### Следующие шаги:
1. Создать Prisma schema
2. Настроить environment variables
3. Создать базовые компоненты
4. Настроить CI/CD
5. Настроить мониторинг

---

**Дата создания:** 2025-01-26  
**Версия:** 1.0  
**Основано на:** Полном анализе сервиса через MCP Playwright

