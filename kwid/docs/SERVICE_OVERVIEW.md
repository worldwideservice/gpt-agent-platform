# Реплика сервиса KWID для World Wide Services

> Исходный сервис: https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices  
> Цель: Полностью воспроизвести UI, маршрутизацию и интерактивное поведение в нашем приложении (Next.js/Filament реплика).

Документ объединяет основные сведения о продукте, навигации, страницах, модалках, Livewire-взаимодействиях и внешних зависимостях. Используйте его как точку входа при разработке клон‑функционала.

---

## 1. Что делает сервис

KWID предоставляет SaaS‑панель управления «GPT агентами» для Kommo CRM. Клиент (World Wide Services) через кабинет:
- создаёт и настраивает агентов (инструкции, интеграции, триггеры, сценарии цепочек);
- управляет наполнением базы знаний (категории + статьи);
- тестирует ответы агента через встроенный чат;
- следит за использованием (метрики, лимиты);
- управляет тарифом, доступом и настройками аккаунта;
- подключает Kommo‑виджет (OAuth + синхронизация каналов/воронок).

Фронтенд построен на Filament + Livewire (Laravel). Все динамические действия идут через Livewire-запросы с payload-ами, сохранёнными в `../raw/scrape/actions/`.

---

## 2. Глобальная оболочка интерфейса

### Header
- **Глобальный поиск** (`input[placeholder="Глобальный поиск"]`).
- **Дата окончания подписки** (ссылка на страницу `pricing`).
- **Индикатор уведомлений** (badge + модалка; необходимо дозаснять API см. TODO).
- **Меню пользователя / переключатель темы**: светлая / тёмная / системная темы + `logout`.

### Sidebar (см. `components/layout/Sidebar.tsx`)
```
GPT Агент
├─ Инфопанель (/manage/[tenantId])
├─ Агенты ИИ
│  ├─ Агенты ИИ (/ai-agents)
│  └─ Тестовый чат (/test-chat)
├─ База знаний
│  ├─ Категории (/knowledge-categories)
│  └─ Статьи (/knowledge-items)
├─ Поддержка → Начало работы (внешняя ссылка)
├─ Аккаунт
│  ├─ Настройки аккаунта (/account-settings)
│  └─ Тарифные планы (/pricing)
└─ Что нового → соц. сети (внешние ссылки)
```

### Общие UI‑паттерны
- Filament табы (`nav[role="tablist"]`), breadcrumbs, карточки StatOverview.
- Все формы используют Filament Form Builder -> Livewire `save`/`create` экшены.
- Таблицы — Filament Table (`tableAction`, `bulkAction`, `perPage` селектор).

---

## 3. Карта страниц и функционала

Ниже — краткий выжим по ключевым страницам. Полные DOM/HTML/JSON снапшоты — в `../raw/scrape/`. Детальный анализ по вкладкам/полям — в `./KWID_ARCHITECTURE*.md`.

### 3.1 Dashboard (`/manage/[tenantId]`)
- 4 KPI карточки: ответы за месяц / 7 дней / сегодня / количество агентов.
- Два графика (month/day) — данные подгружаются через internal API (см. `services/statistics`).
- Нет пользовательских действий, только просмотр.

### 3.2 AI Agents List (`/ai-agents`)
- Таблица агентов с колонками: checkbox, Название, Активно, Модель, Actions.
- Row actions: `Изменить`, `Копировать`, `Удалить` (Livewire `tableAction`).
- Toolbar: поиск, переключатель столбцов.
- TODO: поймать payload для `copy` и пагинации (см. `KWID_SCRAPE_STATUS.md`).

### 3.3 Create Agent (`/ai-agents/create`)
- Простая форма: `name` (обяз.), кнопки `Создать`, `Создать и Создать ещё`, `Отмена`.
- Livewire запросы: `ai_agent_create*.json` фиксируют структуру payload и ответ.

### 3.4 Edit Agent (`/ai-agents/[id]/edit`)
Главная точка сложности. Вкладки:
1. **Основные** — название, `is_active`, инструкции, ручная отправка, fallback сообщения, knowledge toggles.
2. **Сделки и контакты** — синхронизация воронок/каналов Kommo, выбор полей, маршрутизация сделки.
3. **Триггеры** — условия запуска (часы, дни, источники).
4. **Цепочки** — step builder (пока заглушка в реальном аккаунте).
5. **Интеграции** — настройки подключения Kommo, переключатели.
6. **Дополнительно** — смежные настройки (язык, тон, эксперименты).

Полная структура формы находится в `../raw/scrape/forms/ai-agent-edit.fields.json` и `./KWID_AGENT_DETAILED.md`.

**Модальные окна / действия внутри редактирования:**
- `sync_pipelines` и `sync_channels` — Livewire действия, ответы сохранены.
- `knowledge_not_found_task` toggles — данные есть, не хватает payload с заполненной задачей.
- `fallback_message` — есть update/revert.
- Breadcrumb навигация между вкладками → требуется записать `filament.navigate` (TODO).

### 3.5 Test Chat (`/test-chat`)
- Livewire компонент с историей сообщений + textarea.
- Имеется payload `test_chat_select` (инициализация) и `test_chat_send` (отправка).
- Не хватает сценария `newChat` и успешного ответа ассистента (см. TODO).

### 3.6 Knowledge Base (`/knowledge-categories`, `/knowledge-items`)
- Таблицы категорий и статей: снапшоты HTML/JSON в `../raw/scrape/`.
- Формы создания (HTML/fields.json) собраны.
- TODO: успешные payload для создания/удаления записей, bulk actions.

### 3.7 Account Settings (`/account-settings`)
- Вкладки `Профиль`, `Рабочее пространство`, `Оплата`, `Пользователи` (реализованы в нашем коде).
- UI собран (html/png/txt). Используются API `/api/account`, `/api/workspace`, `/api/billing` и т.п. См. `services/account`.

### 3.8 Pricing (`/pricing`)
- Таблица тарифов (cards). Формулы цен завязаны на данным из KWID (см. `./KWID_PRICING_ANALYSIS.md`, `./PRICING_FORMULA_CALCULATION.md`).
- Важные элементы: текущий план, CTA `Оплатить`, модалка выбора тарифа.

### 3.9 Notifications & User menu
- В шапке: всплывающее окно с фильтрами, лентой уведомлений, кнопкой `Отметить все прочитанными` → нужно дописать логи (TODO).
- Темная/светлая темы переключаются без перезагрузки. Точки интеграции находятся в `components/theme/`.

### 3.10 Kommo Widget (внешний)
- Настройки виджета находятся в Kommo: `scripts/kwid-login.ts` делает скриншоты в `../raw/scrape/screenshots/`.
- Для полной реплики требуется зафиксировать DOM каждого блока (`Интеграция`, `Webhook`, `Поля`) и сетевые запросы (`widgets/settings`).

---

## 4. Карта Livewire взаимодействий

| Категория | Файл | Назначение |
|-----------|------|------------|
| Создание агента | `../raw/scrape/actions/ai_agent_create*.json` | Payload формы создания (модели, валидация ошибок).
| Удаление агента | `../raw/scrape/actions/ai_agent_delete_*` | Действие `tableAction('delete')`.
| Тогглы знаний | `agent_toggle_*`, `all_knowledge_base.*`, `knowledge_not_found_task.*` | Управление источниками знаний и fallback.
| Fallback сообщение | `fallback_message.*` | Обновление/откат текста fallback.
| Сохранение профиля | `save_original.*`, `save_modified.*` | Сравнение payload до/после изменений.
| Kommo синхронизация | `sync_channels.*`, `sync_pipelines.*` | Подтягивание сущностей CRM.
| Knowledge база | `knowledge_category_create.*`, `knowledge_item_create.*` | Черновики payloadов для создания (TODO: успешные ответы/удаления).
| Тестовый чат | `test_chat_select.*`, `test_chat_send.*` | Инициализация и отправка сообщений.

Расшифровки Livewire (`parsed/*.json`) содержат готовые структуры (соответствие нашим TypeScript типам).

---

## 5. Что ещё нужно доснять (high priority)

1. **AI Agents:**
   - `manual_generation` toggle (ручная отправка).
   - Payload `tableAction('copy')`, пагинация, breadcrumbs events.
2. **База знаний:**
   - Успешные create/delete + bulk actions для категорий и статей.
3. **Тестовый чат:**
   - Сценарий `newChat`, ответ ассистента, возможный streaming log.
4. **Уведомления и темы:**
   - DOM+API уведомлений, Livewire событие переключения темы.
5. **Kommo widget:**
   - Полный DOM настроек, JSON конфигурации, сетевые запросы при сохранении.

Подробный чеклист дублирован в `./KWID_SCRAPE_STATUS.md`.

---

## 6. Playwright / MSP сценарии

- **Базовые скрипты:** `tests/e2e/*.spec.ts`, `scripts/kwid-login.ts` — используют Playwright для логина в Kommo и снятия UI.
- **Рекомендуемое расширение:** добавить `scripts/capture-livewire.ts` (через Playwright) с перехватом `livewire` XHR и сохранением в `../raw/scrape/actions/`.
- **Шаблон:**
  ```ts
  page.route('**/livewire/message/**', async (route, request) => {
    const body = request.postDataJSON()
    // сохранить body/response в actions/
  })
  ```
- **Сессия:** получать свежий magic link перед входом (см. TODO в `KWID_SCRAPE_STATUS.md`).

---

## 7. Дополнительно

- `./KWID_AGENT_DETAILED.md` — полное состояние агента `id=553` (World Wide Services).
- `./KWID_PRICING_ANALYSIS.md` — тарифные планы, лимиты, formula.
- `./KWID_ROUTING_ANALYSIS.md` — сопоставление маршрутов Filament vs. оригинал.
- `../raw/scrape/**/*.png` — визуальные эталоны UI.

С этими материалами разработчик может воспроизвести оригинальный сервис «один в один», включая UX-паттерны, тексты и сетевые протоколы.
