# Карта интерфейсов и соответствие страниц проекта

Документ связывает экраны референсного сервиса (см. предоставленные скриншоты) с реализацией в репозитории. Для каждого экрана указан основной маршрут, ключевые компоненты, а также текущие пробелы, которые нужно закрыть.

## 1. Инфопанель (Dashboard)
- **Маршрут:** `app/(protected)/page.tsx`
- **Компоненты:** `components/dashboard/StatCard.tsx`, `LineChartCard.tsx`, `BarChartCard.tsx`, `RecentUpdates.tsx`
- **Поддерживающие слои:** `lib/repositories/agents.ts` (`getDashboardStats`, `getMonthlyResponsesSeries`, `getDailyResponsesSeries`, `getWeeklyBarChartData`)
- **Заметки:** графики и метрики запрашиваются из Supabase; список "Недавние обновления" пока пустой (нужна реализация источника данных).

## 2. Список агентов
- **Маршрут:** `app/(protected)/agents/page.tsx`
- **UI:** `app/(protected)/agents/_components/AgentsClient.tsx`, таблица `components/agents/AgentTable.tsx`
- **API:** `app/api/agents/route.ts`, `app/api/agents/[id]/status/route.ts`, `.../route.ts` (CRUD)
- **Заметки:** поддерживаются поиск, массовое выделение, переключение статуса, копирование и удаление; нужно убедиться, что API маршруты доведены до конца (обработчики `DELETE`, `PATCH` и т.д. пока частично заглушены).

## 3. Создание агента
- **Маршрут:** `app/(protected)/agents/create/page.tsx`
- **Ожидаемый UX:** форма с полем названия и кнопками «Создать», «Создать и создать ещё», «Отмена».
- **Факт:** кнопки вызывают `setTimeout` и переходят на жёстко зашитый `/agents/553/edit` — требуется заменить на реальный вызов `POST /api/agents` и обработку ответа.

## 4. Редактирование агента — Основные
- **Маршрут:** `app/(protected)/agents/[id]/page.tsx`
- **UI:** `AgentEditForm.tsx` + вкладка `basic`
- **Компоненты:** `components/ui/Tabs.tsx`, `Input`, `Textarea`, `Toggle`, `Select`
- **API:** `app/api/agents/[id]/route.ts` (`GET`, `PATCH`), `lib/repositories/agents.ts`
- **Заметки:** поддерживаются поля имени, статуса, модели, инструкций, температур, задержки; всё соответствует референсу.

## 5. Редактирование агента — Сделки и контакты
- **Вкладка:** `AgentEditForm` → `deals`
- **Компоненты:** `StageCard.tsx`, `CalloutPipelines.tsx`
- **API:** `app/api/agents/[id]/fields/route.ts`, `app/api/agents/[id]/pipeline-settings/route.ts`, `lib/repositories/agents.ts` (методы `getAgentPipelineSettings`, `updateAgentPipelineSettings`)
- **Заметки:** UI соответствует скриншоту (списки полей для сделок/контактов, выбор этапов); требуется завершить загрузку данных с Kommo и сохранение в Supabase.

## 6. Редактирование агента — Триггеры
- **Компоненты:** `components/agents/TriggerManager.tsx`
- **API:** `app/api/agents/[id]/triggers/route.ts`, `.../[triggerId]/route.ts`, `lib/repositories/triggers.ts`
- **Заметки:** CRUD интерфейс совпадает с референсом. Нужно проверить полноценность API (создание/редактирование `condition`, `actions` на стороне Supabase).

## 7. Редактирование агента — Цепочки (Sequences)
- **Компоненты:** `AgentSequencesManager.tsx`
- **API:** `app/api/agents/[id]/sequences/route.ts`, `.../[sequenceId]/route.ts`, `lib/repositories/agent-sequences.ts`
- **Заметки:** UI соответствует (список, создание, редактирование шагов). Обязательно реализовать сохранение шагов (payload, задержки) и привязку к BullMQ worker.

## 8. Редактирование агента — Интеграции
- **Компоненты:** `components/crm/ChannelsSettings.tsx`, `KnowledgeBaseSettings.tsx`, `InteractionSettings.tsx`
- **API:** `app/api/agents/[id]/channels/route.ts`, `/knowledge`, `/crm-connection`
- **Заметки:** переключатели каналов и доступ к базе знаний соответствуют референсу. Нужна фактическая синхронизация с CRM и обновление настроек агента в Supabase.

## 9. Редактирование агента — Дополнительно
- **UI:** блок выбора модели, настройки языка и задержки, отмеченные на скриншотах.
- **Реализация:** `AgentEditForm` вкладка `advanced`; настройки сохраняются через `PATCH /api/agents/[id]`.
- **Заметки:** соответствует макету. Следует сверить список моделей с `lib/services/llm.ts` -> `fetchAvailableModels`.

## 10. Тестовый чат
- **Маршрут:** `app/(protected)/chat/page.tsx`
- **API:** `app/api/chat/route.ts`
- **Логика:** загрузка диалогов, сообщения, отправка запросов к LLM (через `lib/services/agent-context-builder.ts` и `lib/services/llm.ts`)
- **Заметки:** интерфейс соответствует референсу; необходимо проверить опору на реальный agentId и поток сообщений.

## 11. База знаний — Категории
- **Маршрут:** `app/(protected)/knowledge-base/categories/page.tsx`
- **Компоненты:** `CategoriesClient.tsx`, `components/ui/Table.tsx`
- **API:** `app/api/knowledge-base/categories/route.ts`, `.../[id]/route.ts`, `lib/repositories/knowledge-base.ts`
- **Заметки:** поведение соответствует (список, удаление, переход). Требуется реализовать формы `new` и `edit` (маршруты уже есть).

## 12. База знаний — Создать категорию
- **Маршрут:** `app/(protected)/knowledge-base/categories/[id]/page.tsx` (с id=`new`)
- **Компонент:** `CategoryForm.tsx`
- **Заметки:** набор полей соответствует скриншоту «Создать категорию». Нужно подключить валидацию и уведомления об ошибках.

## 13. База знаний — Статьи
- **Маршрут:** `app/(protected)/knowledge-base/articles/page.tsx`
- **Компоненты:** `ArticlesClient.tsx`
- **API:** `app/api/knowledge-base/articles/route.ts`, `.../[id]/route.ts`
- **Заметки:** таблица выдаёт статьи + фильтры и кнопка «Создать». Соответствует референсу.

## 14. База знаний — Создать статью
- **Маршрут:** `app/(protected)/knowledge-base/articles/[id]/page.tsx` (id=`new`)
- **Компонент:** `ArticleForm.tsx`
- **Функции:** загрузка файлов (`components/knowledge/ArticleAttachments.tsx`), выбор категории
- **Заметки:** верстка соответствует; необходимо внедрить генерацию эмбеддингов (`lib/services/embeddings.ts`) при сохранении.

## 15. Интеграции
- **Маршрут:** `app/(protected)/integrations/page.tsx`
- **Компонент:** `components/crm/KommoSetup.tsx`
- **API:** `/api/integrations/kommo/*`, backend `services/api/src/routes/kommo.ts`
- **Заметки:** UI совпадает со скриншотом. Следует закончить обработку callback, хранение токенов (`crm_connections`) и отображение статуса.

## 16. Триггеры (модалка «Создать триггер»)
- **Компонент:** `TriggerManager.tsx` (диалог Radix), `components/ui/dialog.tsx`
- **API:** см. п.6
- **Заметки:** поля формы соответствуют референсу; нужно реализовать справочник действий (пока список пунктов статичен).

## 17. Уведомления
- **Компонент:** `components/layout/Header.tsx` (панель справа)
- **API:** `/api/notifications`, `/api/notifications/actions`, `lib/repositories/notifications.ts`
- **Заметки:** UI совпадает с референсом (список уведомлений, переключатель темы). Нужен реальный источник уведомлений в Supabase/Redis.

## 18. Тарифные планы
- **Маршрут:** `app/(protected)/pricing/page.tsx`
- **Компоненты:** карточки планов, FAQ аккордеон `components/ui/magic/dropdown.tsx`
- **API:** `/api/subscriptions/route.ts`, `lib/repositories/subscriptions.ts`
- **Заметки:** интерфейс соответствует; требуется интеграция с биллингом (Stripe) и обновление лимитов в Supabase.

## 19. Настройки аккаунта
- **Маршрут:** `app/(protected)/account/page.tsx`
- **API:** `/api/account/route.ts`, `/api/organization/settings/route.ts`
- **Заметки:** реализован переключатель «останавливать агентов при ответе человека» — нужно хранить флаг в `organizations.settings`.

## 20. Справка / Документация (раздел «Начало работы»)
- **Маршрут:** `app/support/page.tsx` (лендинг) + `docs/` Markdown-файлы
- **Заметки:** для полного соответствия необходимо добавить реальные статьи и навигацию, аналогичную референсному knowledge center.

## 21. Онбординг
- **Маршрут:** `app/(protected)/onboarding/page.tsx`
- **Компонент:** `OnboardingClient.tsx`
- **API:** `lib/onboarding/server.ts` (`getOnboardingState`, `completeOnboardingStep`)
- **Заметки:** текущая реализация содержит пошаговый UI; нужно синхронизировать статусы с Supabase.

## 22. Системные сервисы
- **Backend API:** `services/api/src` (Fastify) — отвечает за Kommo OAuth, очереди, REST endpoints.
- **Worker:** `services/worker/src` — обработка задач BullMQ, синхронизация CRM, индексация базы знаний.
- **Supabase:** `supabase/schema.sql`, `supabase/seed.sql` — полностью описывают структуры данных в соответствии с макетами.

## Основные пробелы, требующие реализации
1. **Форма создания агента** (`app/(protected)/agents/create/page.tsx`) — заменить мок на реальный POST + роутинг на созданного агента.
2. **Данные для триггеров, цепочек, каналов** — убедиться, что API-роуты CRUD сохраняют данные в Supabase и возвращают их в UI.
3. **Интеграция Kommo OAuth** — завершить обмен токенов, хранение секретов (`crm_connections`, `crm_credentials`) и синхронизацию воронок.
4. **Уведомления и лог действий** — реализовать генерацию уведомлений (worker → Supabase) и отображение во фронтенде.
5. **Биллинг / лимиты** — связка `/api/subscriptions` с реальным биллинговым провайдером и обновлением usage (`usage_daily`).
6. **Индексирование базы знаний** — обеспечить вызов `generateEmbeddingsForDocument` после сохранения статьи и хранение в `knowledge_chunks`.
7. **Пайплайн воркера** — убедиться, что `services/worker` получает задания от Fastify/BullMQ и обновляет таблицы (статусы, usage).
8. **Документация раздела Support** — добавить маршруты/страницы под структуры как на референсе (меню слева, контент справа).

Этот документ будет обновляться по мере закрытия пробелов и синхронизации функциональности с референсным продуктом.
