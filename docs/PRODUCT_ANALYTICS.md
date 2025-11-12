# Product Analytics Guide — Segment & PostHog

> Описывает текущую схему продуктовой аналитики, события и метрики для TON 18.
>
> **Версия:** 1.0
> **Дата обновления:** 2025-02-18

## 1. Архитектура трекинга

| Зона | Инструменты | Реализация | Статус |
| --- | --- | --- | --- |
| Публичный сайт (`app/layout.tsx`) | Segment + PostHog | `ProductAnalyticsProvider` инициирует page view события | ✅ В продакшене |
| Кабинет (`app/manage/[tenantId]/layout.tsx`) | Segment + PostHog | Тот же провайдер с контекстом `app` | ✅ В продакшене |
| API/Backend события | Segment (HTTP API) | Планируется после подключения сервисных хендлеров | ⏳ В планах |

**Основные переменные окружения**

- `NEXT_PUBLIC_SEGMENT_WRITE_KEY` — ключ рабочей workspace в Segment.
- `NEXT_PUBLIC_POSTHOG_KEY` — project API key для PostHog.
- `NEXT_PUBLIC_POSTHOG_HOST` — кастомный домен (по умолчанию `https://app.posthog.com`).

## 2. События и свойства

### 2.1 Page view (по умолчанию)

| Источник | Событие | Свойства |
| --- | --- | --- |
| Segment | `page` | `name`, `url`, `context` (`public` \| `app`) |
| PostHog | `$pageview` | `url`, `context` |

### 2.2 Ключевые продуктовые события (запланировано)

| Событие | Когда срабатывает | Обязательные свойства | Ответственный |
| --- | --- | --- | --- |
| `signup_completed` | Пользователь завершил регистрацию | `plan`, `source`, `workspace_id` | Auth squad |
| `onboarding_completed` | Пройден онбординг-чеклист | `duration_minutes`, `tenant_id`, `touchpoints` | CS |
| `agent_published` | Создан и активирован AI-агент | `agent_id`, `channel`, `llm_model`, `knowledge_items` | Product |
| `knowledge_uploaded` | Загружен новый файл/статья в базу знаний | `tenant_id`, `type`, `size_kb`, `chunk_count` | Product |
| `integration_connected` | Подключена внешняя интеграция | `integration`, `tenant_id`, `status` | Integrations team |

## 3. Метрики и дашборды

| Метрика | Формула | Источник данных | Где смотреть |
| --- | --- | --- | --- |
| Активация | % пользователей, завершивших онбординг в течение 7 дней | `signup_completed`, `onboarding_completed` | Segment Personas (journey) |
| Retention (4 недели) | Cohort retention по активным диалогам | `agent_published`, события чатов (позже) | PostHog cohorts |
| Time-to-First-Agent | Среднее время от регистрации до `agent_published` | Segment SQL warehouse | Internal BI |
| Usage Intensity | Среднее # диалогов на активного агента | PostHog (когда появятся события чатов) | PostHog dashboards |
| Support Load | Кол-во обращений в поддержку по тарифам | Zendesk/Email + `support_request_created` (план) | Customer Success Notion |

## 4. Процессы и алерты

1. **Мониторинг page view**: сравниваем PostHog и Vercel Analytics ежедневно, отклонение >15% — заводим тикет.
2. **Сегментация**: аудитория делится по `plan`, `company_size`, `industry` — поля берем из регистрации.
3. **Алерты**: в PostHog настраиваем алерт при падении активации <25% за неделю, в Segment — алерт на всплеск `support_request_created`.

## 5. Следующие шаги

- Подключить `identify` / `group` вызовы после интеграции с auth API.
- Свести события из бекенда (обработчики очередей) через Segment HTTP API.
- Настроить экспорт `agent_published` → Slack канал #product-insights.
- Согласовать единые названия свойств с аналитиками (Data Dictionary).

