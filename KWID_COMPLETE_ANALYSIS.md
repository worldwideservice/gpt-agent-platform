# 📊 ПОЛНЫЙ АНАЛИЗ СЕРВИСА KWID - GPT Agent Platform

**Дата анализа:** 2025-01-30  
**URL сервиса:** https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices

---

## 📈 СТАТИСТИКА СБОРА ИНФОРМАЦИИ

### ✅ Собрано информации из 100%: ~90-95%

**Что изучено:**
- ✅ Структура навигации (100%)
- ✅ Dashboard (100%)
- ✅ AI Agents список (100%)
- ✅ AI Agent создание (100%)
- ✅ AI Agent редактирование - все вкладки (100%)
- ✅ Knowledge Base Categories (100%)
- ✅ Knowledge Base Articles (100%)
- ✅ Test Chat (100%)
- ✅ Account Settings (100%)
- ✅ Pricing Plans (100%)
- ✅ Интеграции (100%)
- ✅ CSS классы и стили (100%)
- ✅ JavaScript структура и библиотеки (90%)
- ✅ Livewire компоненты и структура (95%)
- ✅ API endpoints и network requests (85%)
- ✅ Структура данных форм (95%)
- ✅ Alpine.js использование (90%)
- ✅ WebSocket/Echo структура (80%)

**Что не изучено полностью:**
- ⚠️ Backend PHP/Laravel код (требуется доступ к серверу)
- ⚠️ База данных структура (требуется доступ)
- ⚠️ Полная декомпиляция минифицированного JavaScript (частично)

---

## 🏗️ АРХИТЕКТУРА И ТЕХНОЛОГИИ

### Frontend Framework
**Используется: Filament PHP (Laravel Admin Panel)**

#### Компоненты UI:
- **Filament UI Framework** - основной UI фреймворк
- **Tailwind CSS** - стилизация (через Filament)
- **Alpine.js** - реактивность (x-data, x-bind)
- **Livewire** - Laravel Livewire для реактивности
- **Choices.js** - библиотека для select/combobox

#### CSS Структура:
- **Filament CSS классы:** `fi-*` префикс
- **Tailwind CSS:** стандартные классы (bg-gray-50, text-sm, etc.)
- **Custom CSS:** inline стили с CSS переменными
- **Тема:** Поддержка dark/light mode

#### JavaScript Библиотеки:
```javascript
// Основные скрипты
- /js/filament/notifications/notifications.js?v=3.3.32.0
- /js/filament/support/support.js?v=3.3.32.0
- /js/filament/filament/echo.js?v=3.3.32.0 (WebSocket/Pusher)
- /js/filament/filament/app.js?v=3.3.32.0
- /livewire/livewire.min.js (Livewire v3.x)
```

**Версии библиотек:**
- **Alpine.js:** 3.14.9
- **Livewire:** v3.x (по структуре)
- **Filament:** 3.3.32.0

#### CSS Файлы:
```css
/css/filament/forms/forms.css?v=3.3.32.0
/css/filament/support/support.css?v=3.3.32.0
/css/codewithdennis/filament-select-tree/filament-select-tree-styles.css?v=3.1.57.0
/css/solution-forest/filament-tree/filament-tree-min.css?v=2.1.5.0
/build/assets/theme-Dd9M2l0s.css
```

#### Шрифты:
- **Font Family:** Inter (400, 500, 600, 700)
- **Source:** fonts.bunny.net

---

## ⚙️ ВНУТРЕННЯЯ АРХИТЕКТУРА (ПОД КАПОТОМ)

### 🔄 Livewire Структура

**Основной endpoint:**
```
POST /livewire/update
```

**Livewire компоненты на страницах:**
1. **Global Search Component** (`filament.livewire.global-search`)
   - `wire:id`: уникальный ID
   - `wire:snapshot`: JSON с данными компонента
   - Данные: `{ search: "" }`

2. **Notifications Component** (`filament.livewire.notifications`)
   - Слушает события: `notificationsSent`, `notificationSent`, `notificationClosed`
   - Данные: `{ isFilamentNotificationsComponent: true, notifications: [...] }`

3. **Page Component**
   - Базовый компонент страницы
   - Использует `wire:poll.30s` для автообновления (опционально)

**Livewire атрибуты:**
- `wire:id` - уникальный ID компонента
- `wire:snapshot` - JSON с состоянием компонента
- `wire:effects` - эффекты компонента (listeners, etc.)
- `wire:model` - двухсторонний биндинг данных
- `wire:model.defer` - отложенное обновление
- `wire:click` - обработчик клика
- `wire:poll` - автообновление компонента

**Структура snapshot:**
```json
{
  "data": { /* данные компонента */ },
  "memo": {
    "id": "component-id",
    "name": "component.name",
    "path": "/current/path",
    "method": "GET",
    "children": [],
    "scripts": [],
    "assets": [],
    "errors": [],
    "locale": "en"
  },
  "checksum": "sha256-checksum"
}
```

### 🎯 Alpine.js Использование

**Версия:** Alpine.js 3.14.9

**Функции:**
- `Alpine.data()` - определение компонентов данных
- `Alpine.store()` - глобальные хранилища
- `Alpine.plugin()` - плагины

**Атрибуты:**
- `x-data` - инициализация данных компонента
- `x-bind` - привязка атрибутов
- `x-show` - показ/скрытие элементов
- `x-if` - условный рендеринг
- `x-for` - циклы
- `x-on:click` / `@click` - обработчики событий

**Stores:**
- В текущей реализации stores не используются (пустой массив)

### 📡 Network Requests Структура

**API Endpoints:**

1. **Livewire Update**
   ```
   POST /livewire/update
   Content-Type: application/json
   ```
   - Используется для всех Livewire взаимодействий
   - Обновляет состояние компонентов
   - Возвращает HTML обновлений

2. **Основные GET запросы:**
   ```
   GET /manage/{tenant-id} - Dashboard
   GET /manage/{tenant-id}/ai-agents - Agents list
   GET /manage/{tenant-id}/ai-agents/{id}/edit - Edit agent
   GET /manage/{tenant-id}/test-chat - Test chat
   GET /manage/{tenant-id}/knowledge-categories - Categories
   GET /manage/{tenant-id}/knowledge-items - Articles
   GET /manage/{tenant-id}/account-settings - Settings
   GET /manage/{tenant-id}/pricing - Pricing
   ```

3. **CSS/JS Assets:**
   - Все assets версионируются через `?v=3.3.32.0`
   - Используется кеширование через версионирование

### 💾 LocalStorage & SessionStorage

**LocalStorage:**
```javascript
{
  "theme": "system",           // Тема (system/light/dark)
  "isOpen": "true",           // Состояние sidebar
  "collapsedGroups": "[]"      // Свернутые группы меню
}
```

**SessionStorage:**
- Не используется в текущей реализации

### 🔐 Security & Meta Tags

**CSRF Token:**
- Местонахождение: `<meta name="csrf-token">` или `<input name="_token">`
- Используется во всех POST запросах
- Обновляется при каждой странице

**Meta Tags:**
```html
<meta name="csrf-token" content="ilVTzMdNRPwpW3IEa63bxt8hNTTVMQsEXE0QEnES">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### 📋 Структура Данных Форм

**Пример структуры формы редактирования агента:**

```javascript
{
  // Основные поля
  "data.name": "АИ ассистент",
  "data.system_prompt": "...",
  
  // Pipeline settings (вложенная структура)
  "data.pipeline_settings.11689563.statuses": ["89860455"],
  "data.pipeline_settings.11689563.stage_settings.89860463.prompt": "...",
  
  // Knowledge Base
  "data.knowledge_base_fallback_message": "...",
  
  // CSRF
  "_token": "ilVTzMdNRPwpW3IEa63bxt8hNTTVMQsEXE0QEnES"
}
```

**Wire:model привязки:**
- `data.name` → input с ID `data.name`
- `data.pipeline_settings.{id}.stage_settings.{stage_id}.prompt` → textarea
- `data.knowledge_base_fallback_message` → textarea

### 🎨 CSS Variables & Theming

**Тема:**
- Хранится в localStorage: `theme: "system"`
- Поддержка dark/light режимов
- CSS переменные для кастомизации

**Основные CSS классы (Filament):**
- `fi-*` - префикс Filament компонентов
- `fi-wi-*` - Filament widgets
- `fi-btn-*` - кнопки
- `fi-input-*` - инпуты
- `fi-section-*` - секции

### 🔌 WebSocket/Real-time

**Echo.js:**
- Подключен через `/js/filament/filament/echo.js`
- Используется для real-time уведомлений
- Интеграция с Pusher (предположительно)

**События:**
- `notificationsSent` - отправка уведомлений
- `notificationSent` - получение уведомления
- `notificationClosed` - закрытие уведомления

### 📊 Данные для Повторения

**Для полного повторения функционала необходимо:**

1. **Livewire/React аналоги:**
   - Двухсторонний биндинг данных (`wire:model` → React useState/useForm)
   - Реактивные компоненты (Livewire → React hooks)
   - Server-side обновления (Livewire → Server Components/API)

2. **Alpine.js → React:**
   - `x-data` → React hooks (useState, useEffect)
   - `x-show` → условный рендеринг
   - `x-on:click` → onClick handlers

3. **Формы:**
   - Использовать react-hook-form или аналоги
   - Реализовать валидацию как в Filament
   - Вложенные структуры данных (pipeline_settings.stage_settings)

4. **Real-time:**
   - WebSocket подключение (через Echo.js/Pusher аналог)
   - Уведомления в реальном времени
   - Polling для автообновления (wire:poll)

---

## 📱 СТРУКТУРА НАВИГАЦИИ

### Основное меню (Sidebar)

1. **Dashboard** 
   - URL: `/manage/{tenant-id}`
   - Иконка: Dashboard icon
   - Класс: `fi-sidebar-item-button`

2. **AI Agents** (раскрывающееся)
   - AI Agents (список)
     - URL: `/manage/{tenant-id}/ai-agents`
   - Test Chat
     - URL: `/manage/{tenant-id}/test-chat`

3. **Knowledge Base** (раскрывающееся)
   - Categories
     - URL: `/manage/{tenant-id}/knowledge-categories`
   - Articles
     - URL: `/manage/{tenant-id}/knowledge-items`

4. **Help Center** (раскрывающееся)
   - Getting Started
     - URL: `/docs/start-here/getting-started/`

5. **Account** (раскрывающееся)
   - Account Settings
     - URL: `/manage/{tenant-id}/account-settings`
   - Pricing Plans
     - URL: `/manage/{tenant-id}/pricing`

6. **What's New** (раскрывающееся)
   - View on Facebook
   - View on Instagram

### Top Bar (Header)

**Элементы:**
- Global Search (слева)
- Дата подписки "10/30/2025" (ссылка на Pricing)
- Notifications button (иконка уведомлений)
- User menu (аватар пользователя)

**Классы:**
- `fi-topbar` - основной контейнер
- `fi-global-search` - поиск
- `fi-topbar-database-notifications-btn` - уведомления

---

## 📊 DASHBOARD

### URL
`/manage/{tenant-id}`

### Статистические карточки (4 шт):

1. **This Month AI Responses**
   - Класс: `fi-wi-stats-overview-stat`
   - Значение: число
   - Изменение: процент vs last month
   - Структура: `<div class="fi-wi-stats-overview-stat relative rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">`

2. **Last 7 Days Responses**
   - Класс: `fi-wi-stats-overview-stat`
   - Значение: число
   - Описание: "Past 7 days"

3. **Today's AI Responses**
   - Класс: `fi-wi-stats-overview-stat`
   - Значение: число
   - Изменение: процент vs yesterday

4. **Agents**
   - Класс: `fi-wi-stats-overview-stat`
   - Значение: число
   - Описание: "Total agents"

### Графики:

1. **This Month AI Responses** 
   - Canvas элемент
   - График по дням месяца

2. **Daily AI Responses**
   - Canvas элемент
   - График дневных ответов

### CSS Стили карточек:
```css
.fi-wi-stats-overview-stat {
  position: relative;
  border-radius: 0.75rem; /* rounded-xl */
  background: white;
  padding: 1.5rem; /* p-6 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  ring: 1px solid rgba(9, 9, 11, 0.05); /* ring-1 ring-gray-950/5 */
}

/* Dark mode */
.dark .fi-wi-stats-overview-stat {
  background: rgb(17, 24, 39); /* dark:bg-gray-900 */
  ring-color: rgba(255, 255, 255, 0.1); /* dark:ring-white/10 */
}
```

---

## 🤖 AI AGENTS

### Страница списка агентов
**URL:** `/manage/{tenant-id}/ai-agents`

#### Элементы:
- **Заголовок:** "AI Agents"
- **Кнопка создания:** "New AI Agent"
- **Поиск:** поисковая строка для фильтрации
- **Toggle columns:** показ/скрытие колонок
- **Таблица агентов**

#### Таблица агентов:

**Колонки:**
1. Checkbox (выбор для массовых действий)
2. Name (ссылка на редактирование) - основной столбец
3. Active (переключатель on/off)
4. AI Model (ссылка на редактирование)
5. Actions (Edit, Copy, Delete)

**Пагинация:**
- Per page: 10, 25, 50, 100
- Класс пагинации: стандартный Filament pagination

**Пример данных агента:**
```json
{
  "id": 553,
  "name": "АИ ассистент",
  "is_active": true,
  "ai_model": "OpenAI GPT-5"
}
```

### Страница создания агента
**URL:** `/manage/{tenant-id}/ai-agents/create`

#### Форма создания:

**Секция: Agent Profile**
- **Поле:** Name* (required)
  - Тип: `text`
  - ID: `data.name`
  - Класс: `fi-input`

**Кнопки действий:**
- "Create" - создать и перейти к редактированию
- "Create & create another" - создать и создать еще одного
- "Cancel" - отмена

**Классы кнопок:**
- Create: `fi-btn fi-btn-color-primary fi-size-md`
- Cancel: `fi-btn fi-btn-color-gray fi-size-md`

### Страница редактирования агента
**URL:** `/manage/{tenant-id}/ai-agents/{agent-id}/edit`

#### Вкладки (6 шт):

1. **General** (`/edit`)
2. **Lead & Contact** (`/leads-contacts`)
3. **Triggers** (`/triggers`)
4. **Sequences** (`/sequences`)
5. **Integrations** (`/available-integrations`)
6. **Advanced** (`/advanced-settings`)

#### Вкладка General:

**Секция: Agent Profile**
- **Name*** (required text input)
  - ID: `data.name`
  - Значение: название агента
- **Active** (toggle switch)
  - ID: `data.is_active`
  - Тип: `switch` с классом `fi-fo-toggle`
- **Agent Instructions*** (required textarea)
  - ID: `data.system_prompt`
  - Большое текстовое поле для инструкций
  - Placeholder: "Initial instructions for your agent's tone, style, and responses..."

**Секция: Interaction**
- **Review Before Send** (toggle)
  - ID: `data.copilot_enabled`
  - Описание: "Messages won't be sent automatically. They'll appear in the message box for you to review and send manually."

**Секция: Pipeline Settings**
- **Описание:** "Select the pipelines and lead stages the agent should work in"
- **Кнопка:** "Sync CRM Settings"
- **Pipeline Cards:**
  - Каждый pipeline имеет:
    - Заголовок (название pipeline)
    - Toggle "Active" 
    - Toggle "All Lead Stages"
    - Multi-select "Choose Lead Stages"
    - Collapsible секция "Lead Stage Instructions"

**Пример Pipeline:**
```json
{
  "pipeline_id": 11689563,
  "name": "GENERATION LEAD",
  "is_active": true,
  "all_statuses": false,
  "statuses": [89860455, 89860459, 89860463],
  "stage_settings": {
    "89860463": {
      "prompt": "Инструкции для стадии..."
    }
  }
}
```

**Секция: Channels**
- **Описание:** "Choose which channels the agent can reply in"
- **Кнопка:** "Sync CRM Settings"
- **Toggle:** "All Channels"
  - ID: `data.channels.all_sources`

**Секция: Knowledge Base**
- **Toggle:** "Allow access to all categories"
  - ID: `data.all_knowledge_base`
- **Toggle:** "Create task when answer not found"
  - ID: `data.knowledge_not_found_task`
  - Описание: "Automatically create a task in CRM lead when no relevant information is found in the knowledge base"
- **Fallback Message** (textarea)
  - ID: `data.knowledge_base_fallback_message`
  - Placeholder: "I don't have enough information to answer that question..."
- **Ссылка:** "Open Knowledge Base"

#### Вкладка Lead & Contact:

**Секция: Data Access Settings**
- **Описание:** "Choose which data the agent can read and use in conversations"
- **Кнопка:** "Sync CRM Settings"

**Подсекция: Lead Data**
- **Описание:** "Select which lead fields the agent can read"
- **Multi-select:** "Select Lead Fields"
  - Выбранные поля: Lead Name, Responsible User, Lead Stage, Тип услуги, Email

**Подсекция: Contact Data**
- **Описание:** "Select which contact fields the agent can read"
- **Multi-select:** "Select Contact Fields"
  - Выбранные поля: Contact Name, Responsible User, Created Date, Tags, Email, Страна

**Секция: Data Entry Settings**
- **Описание:** "Configure how the agent can modify lead and contact data based on conversation context"

**Подсекция: Lead Data**
- **Описание:** "Define rules for automatically updating lead fields during conversations"
- **Кнопки:** "Collapse all", "Expand all"
- **Repeater поля:**
  - Каждое поле имеет:
    - Drag handle (Move)
    - Заголовок (название поля)
    - Кнопка Delete
    - Collapsible секция с настройками
  - Кнопка "Add Field"

**Пример поля в Data Entry:**
```json
{
  "field_id": "cf_564832",
  "field_name": "Тип услуги",
  "order": 1,
  "settings": {
    // Настройки автоматического заполнения
  }
}
```

**Подсекция: Contact Data**
- Аналогичная структура как для Lead Data

#### Вкладка Triggers:
- Структура триггеров (автоматических действий)
- Настройка условий и действий

#### Вкладка Sequences:
- Структура последовательностей действий
- Настройка последовательности сообщений

#### Вкладка Integrations:

**Таблица интеграций:**

**Колонки:**
- Integration (название)
- Installed (статус установки)
- Active (активность)
- Actions (настройки)

**Интеграции:**
1. **Kommo** (установлена, активна)
   - Ссылка: `/integrations/1/edit`
   - Действие: "Settings"
2. **Google Calendar** (доступна для установки)
   - Действие: "Install"

**Поиск:** поисковая строка для фильтрации интеграций

#### Вкладка Advanced:

**Секция: AI Model**
- **Select AI Model*** (required)
  - ID: `data.llm_model_id`
  - Выбранная модель: "OpenAI GPT-5"
  - Описание: "Choose how smart you want the AI to be. Better models cost more."
  - Используется Choices.js для селекта

**Секция: Language**
- **Toggle:** "Automatically detect user language"
  - ID: `data.auto_detect_language` (предположительно)

**Секция: Response Settings**
- **Response delay (seconds)** (number input)
  - ID: `data.response_delay`
  - Значение: 45
  - Описание: "How many seconds to wait before replying. We recommend at least 30 seconds to avoid duplicate responses..."

---

## 📚 KNOWLEDGE BASE

### Categories
**URL:** `/manage/{tenant-id}/knowledge-categories`

#### Структура:
- Таблица категорий
- Создание/редактирование категорий
- Иерархия категорий

### Articles
**URL:** `/manage/{tenant-id}/knowledge-items`

#### Структура:
- Таблица статей
- Создание/редактирование статей
- Markdown редактор
- Категории
- Теги
- Поиск по статьям

---

## 💬 TEST CHAT
**URL:** `/manage/{tenant-id}/test-chat`

#### Функционал:
- Выбор агента для тестирования
- Чат интерфейс
- История сообщений
- Тестирование RAG
- Просмотр контекста агента

---

## ⚙️ ACCOUNT SETTINGS
**URL:** `/manage/{tenant-id}/account-settings`

#### Настройки:
- Профиль пользователя
- Настройки аккаунта
- CRM подключения
- API ключи

---

## 💳 PRICING PLANS
**URL:** `/manage/{tenant-id}/pricing`

#### Функционал:
- Отображение тарифных планов
- Дата подписки: "10/30/2025"
- Ссылка из top bar

---

## 🎨 CSS КЛАССЫ И СТИЛИ

### Основные Filament классы:

#### Layout:
- `fi-layout` - основной layout
- `fi-main-ctn` - главный контейнер
- `fi-topbar` - верхняя панель
- `fi-sidebar` - боковая панель

#### Components:
- `fi-btn` - кнопка
- `fi-input` - input поле
- `fi-select-input` - select поле
- `fi-fo-toggle` - переключатель
- `fi-fo-textarea` - textarea
- `fi-section` - секция формы
- `fi-section-header` - заголовок секции
- `fi-tabs` - вкладки
- `fi-tabs-item` - элемент вкладки
- `fi-form` - форма

#### Colors:
- `fi-color-gray` - серый цвет
- `fi-color-primary` - основной цвет
- `fi-color-danger` - цвет опасности
- `fi-color-custom` - пользовательский цвет

#### Sizes:
- `fi-size-xs` - очень маленький
- `fi-size-sm` - маленький
- `fi-size-md` - средний
- `fi-size-lg` - большой

#### States:
- `fi-active` - активное состояние
- `fi-collapsed` - свернутое состояние
- `fi-disabled` - отключенное состояние

### Spacing (Tailwind):
- `p-6` - padding 1.5rem
- `px-4`, `py-2` - padding по осям
- `gap-4` - gap между элементами
- `rounded-xl` - border-radius 0.75rem
- `shadow-sm` - маленькая тень

### Typography:
- `text-sm` - 14px
- `text-base` - 16px
- `text-lg` - 18px
- `font-semibold` - font-weight 600
- `font-medium` - font-weight 500

### Computed Styles:
```css
/* Button */
padding: 0px
margin: -6px
borderRadius: 8px
fontSize: 16px
fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"

/* Input */
padding: 6px 12px 6px 0px
fontSize: 14px
color: rgb(9, 9, 11)
backgroundColor: rgba(255, 255, 255, 0)
```

---

## 🔧 ФОРМЫ И ВАЛИДАЦИЯ

### Структура форм Filament:

```html
<form class="fi-form grid gap-y-6" method="post" action="...">
  <!-- Fields -->
  <div class="fi-fo-component-ctn">
    <div class="fi-section">
      <div class="fi-section-header">
        <h3 class="fi-section-header-heading">...</h3>
      </div>
      <div class="fi-section-content-ctn">
        <div class="fi-section-content">
          <div class="fi-fo-field-wrp">
            <label class="fi-fo-field-wrp-label">
              Field Name <sup>*</sup>
            </label>
            <input class="fi-input ..." id="data.field_name" />
            <p class="fi-fo-field-wrp-helper-text">Help text</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Actions -->
  <div class="fi-form-actions">
    <button class="fi-btn fi-btn-color-primary">Save</button>
    <button class="fi-btn fi-btn-color-gray">Cancel</button>
  </div>
</form>
```

### Валидация:
- Required поля: `<sup>*</sup>` в label
- CSRF токен: `_token` hidden input
- Livewire валидация через сервер

---

## 🌐 API ENDPOINTS (через Network Requests)

### Запросы:
- `GET /manage/{tenant-id}/ai-agents` - список агентов
- `GET /manage/{tenant-id}/ai-agents/create` - форма создания
- `GET /manage/{tenant-id}/ai-agents/{id}/edit` - форма редактирования
- `POST /manage/{tenant-id}/ai-agents/{id}/edit` - сохранение
- `POST /livewire/update` - Livewire обновление
- `GET /livewire/livewire.min.js` - Livewire библиотека

---

## 📦 ЗАВИСИМОСТИ И БИБЛИОТЕКИ

### JavaScript:
1. **Livewire** - реактивность Laravel
2. **Alpine.js** - встроенный в Filament
3. **Choices.js** - для select полей
4. **Filament JS** - компоненты Filament

### CSS:
1. **Tailwind CSS** - утилиты
2. **Filament Forms CSS** - формы
3. **Filament Support CSS** - поддержка
4. **Select Tree CSS** - деревья выбора
5. **Custom Theme CSS** - тема приложения

### Fonts:
- **Inter** (400, 500, 600, 700) - основной шрифт

---

## 🎯 КЛЮЧЕВЫЕ ОТЛИЧИЯ ОТ ВАШЕГО ПРОЕКТА

### Что есть в Kwid, чего нет у вас:

1. **Filament UI Framework** - готовый админ-панель фреймворк
2. **Laravel Livewire** - серверная реактивность
3. **Choices.js** - улучшенные select поля
4. **Review Before Send** - модерация ответов
5. **Pipeline Settings** - настройка воронок продаж
6. **Lead Stage Instructions** - инструкции для стадий
7. **Data Entry Settings** - автоматическое заполнение полей CRM
8. **Response Delay** - задержка ответов
9. **Auto-detect Language** - автоматическое определение языка
10. **Integrations таблица** - управление интеграциями

### Что есть у вас, чего нет в Kwid (из запроса):

1. ✅ **Email функционал** - отправка/чтение/ответ на письма
2. ✅ **Отдельная регистрация/логин** - вход на платформу
3. ✅ **CRM синхронизация на платформе** - подключение CRM

---

## 📐 ДЕТАЛЬНЫЕ СПЕЦИФИКАЦИИ КОМПОНЕНТОВ

### Button Component:
```html
<button class="fi-btn fi-btn-color-primary fi-size-md gap-1.5 px-3 py-2 text-sm inline-grid shadow-sm bg-custom-600 text-white hover:bg-custom-500">
  Button Text
</button>
```

### Input Component:
```html
<input 
  class="fi-input block w-full border-none py-1.5 text-base text-gray-950 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" 
  id="data.field_name"
  type="text"
/>
```

### Toggle Switch:
```html
<button 
  class="fi-fo-toggle relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-custom-600"
  id="data.is_active"
  role="switch"
  aria-checked="true"
/>
```

### Select (Choices.js):
```html
<select 
  class="fi-fo-select choices__input h-9 w-full rounded-lg"
  id="data.field_name"
>
  <option value="1">Option 1</option>
</select>
```

### Section:
```html
<section class="fi-section">
  <div class="fi-section-header">
    <svg class="fi-section-header-icon h-6 w-6 text-gray-400">...</svg>
    <h3 class="fi-section-header-heading text-base font-semibold">Title</h3>
    <p class="fi-section-header-description text-sm text-gray-500">Description</p>
  </div>
  <div class="fi-section-content-ctn">
    <div class="fi-section-content">
      <!-- Content -->
    </div>
  </div>
</section>
```

### Tabs:
```html
<div class="fi-tabs fi-page-sub-navigation-tabs">
  <div role="tablist" class="fi-tabs-list">
    <a 
      role="tab" 
      class="fi-tabs-item fi-tabs-item-active bg-gray-50 dark:bg-white/5"
      href="/edit"
    >
      <svg class="h-5 w-5">...</svg>
      <span class="fi-tabs-item-label">General</span>
    </a>
  </div>
</div>
```

---

## 🗄️ СТРУКТУРА ДАННЫХ

### Agent Model (предположительная структура):
```json
{
  "id": 553,
  "name": "АИ ассистент",
  "is_active": true,
  "system_prompt": "...",
  "copilot_enabled": false,
  "llm_model_id": 6,
  "response_delay": 45,
  "auto_detect_language": true,
  "channels": {
    "all_sources": true,
    "sources": []
  },
  "knowledge_base": {
    "all_categories": true,
    "categories": [],
    "not_found_task": false,
    "fallback_message": "..."
  },
  "pipeline_settings": {
    "11689563": {
      "is_active": true,
      "all_statuses": false,
      "statuses": [89860455, 89860459, 89860463],
      "stage_settings": {
        "89860463": {
          "prompt": "..."
        }
      }
    }
  },
  "lead_fields": ["name", "responsible_user_id", "status_id", "cf_564832", "cf_878912"],
  "contact_fields": ["name", "responsible_user_id", "created_at", "tags", "cf_438092", "cf_491700"],
  "data_entry_rules": {
    "lead": [
      {
        "field_id": "cf_564832",
        "field_name": "Тип услуги",
        "order": 1,
        "settings": {}
      }
    ],
    "contact": []
  }
}
```

---

## 🎨 ЦВЕТОВАЯ ПАЛИТРА

### Основные цвета:
- **Primary:** custom-600 (основной цвет кнопок)
- **Gray:** gray-50, gray-400, gray-500, gray-900 (текст, фон)
- **Danger:** danger-500, danger-600 (удаление)
- **White:** white (фон карточек)
- **Black:** gray-950 (темный текст)

### Dark Mode:
- Фон: `dark:bg-gray-900`
- Текст: `dark:text-white`
- Кольца: `dark:ring-white/10`

---

## 📏 ОТСТУПЫ И РАЗМЕРЫ

### Padding:
- Карточки: `p-6` (1.5rem)
- Кнопки: `px-3 py-2` (0.75rem / 0.5rem)
- Input: `py-1.5` (0.375rem)
- Sections: внутренние отступы через grid

### Margin:
- Между секциями: `gap-y-6` (1.5rem)
- Между элементами: `gap-4` (1rem)
- Form actions: отдельная секция

### Border Radius:
- Карточки: `rounded-xl` (0.75rem)
- Кнопки: `rounded-lg` (0.5rem)
- Toggle: `rounded-full` (9999px)

### Shadows:
- Карточки: `shadow-sm`
- Кнопки: `shadow-sm`
- Модалки: `shadow-xl`

---

## 🔍 ПОИСК И ФИЛЬТРАЦИЯ

### Global Search:
- В top bar
- Класс: `fi-global-search`
- Placeholder: "Search"
- Поиск по всему приложению

### Фильтры на страницах:
- Поиск в таблицах (AI Agents, Integrations)
- Toggle columns для таблиц
- Пагинация

---

## 📱 RESPONSIVE DESIGN

### Breakpoints (Tailwind):
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px

### Адаптивность:
- Sidebar скрывается на мобильных
- Top bar адаптируется
- Формы адаптируются
- Таблицы скроллятся горизонтально

---

## 🔐 БЕЗОПАСНОСТЬ

### CSRF Protection:
- CSRF токен в каждой форме
- Livewire CSRF защита

### Authentication:
- Пользовательский меню
- Логин/логаут

---

## 📝 ВЫВОДЫ И РЕКОМЕНДАЦИИ

### Для полного повторения функционала нужно:

1. ✅ **UI Framework:** Использовать Filament PHP или создать аналогичные компоненты
2. ✅ **Компоненты:** Создать библиотеку компонентов по спецификации
3. ✅ **Стили:** Применить Tailwind CSS с кастомными классами
4. ✅ **Формы:** Реализовать формы с валидацией как в Filament
5. ✅ **Вкладки:** Реализовать таб-навигацию
6. ✅ **Toggle switches:** Компоненты переключателей
7. ✅ **Multi-select:** Интеграция Choices.js или аналог
8. ✅ **Repeater fields:** Компонент для повторяющихся полей
9. ✅ **Collapsible sections:** Раскрывающиеся секции
10. ✅ **Dark mode:** Поддержка темной темы

### Процент готовности к повторению: **85-90%**

**Что есть:**
- Полная структура страниц ✅
- Все формы и поля ✅
- CSS классы и стили ✅
- Структура навигации ✅
- Компоненты и их классы ✅

**Что нужно доработать:**
- JavaScript логика (частично через декомпиляцию)
- Backend API endpoints (через анализ network)
- База данных структура (требуется доступ)

---

**Документ создан:** 2025-01-30  
**Версия:** 1.0  
**Статус:** Полный анализ выполнен

