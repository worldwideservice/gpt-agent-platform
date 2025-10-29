# Статус реализации: GPT Agent — Trainable Virtual Employee

## 📊 Общий прогресс (MVP): ~35%

### Что сделано
- **Данные и инфраструктура**
  - Supabase: схема организаций/агентов/воронок/векторного стора, сид с demo-данными.
  - Usage-метрики: таблица `usage_daily`, учёт токенов/ответов.
- **Backend слой**
  - Fastify API (`services/api`): Supabase service role, шифрование секретов, OAuth Kommo, Redis очередь, REST endpoints для UI.
  - Worker (`services/worker`): BullMQ + Redis, синхронизация воронок Kommo, запись вебхуков, отправка заметок, продление токенов.
- **Коммуникация**
  - Глобальный `backendFetch`, `getDefaultOrganizationId`.
  - Очередь jobs для webhook/sync/send-message.
- **Frontend**
  - UI разделов дашборда и агентов подключены к Supabase.
  - Настройка Kommo через UI: сохранение clientId/secret, запуск OAuth, статус подключения.
  - Обновлённый компонент `KommoSetup`, страница callback.
- **Документация**
  - `ARCHITECTURE.md`, `docs/SETUP.md`, актуализирован `REALITY_CHECK.md`.

### Что в работе / TODO
- Авторизация пользователей и мульти-tenant управление.
- AI пайплайн (чат, LLM, vector search) и реальный тестовый чат.
- Расширение Kommo: email/чат каналы, перенос стадий, задачи, синхронизация контактов, хранение логов.
- UI-консоль мониторинга usage и биллинга.
- DevOps: Docker, CI/CD, observability, секрет-менеджмент.
- Unit/E2E тесты для нового API и worker.

### Текущие ограничения
- Используется дефолтная организация (нет auth).
- Секреты хранятся в Supabase без Vault/KMS.
- AI-часть и база знаний пока не подключены.
- Нет production logging/metrics/alerts.

### Следующие шаги
1. Внедрить auth + RLS, подготовить UI для выбора организации.
2. Подключить OpenRouter моделирование (чат, генерация, память).
3. Реализовать полную логику Kommo (стадии, задачи, рассылки, двустороннее обновление).
4. Настроить DevOps pipeline, контейнеризацию и мониторинг.
5. Покрыть критические модули тестами.
