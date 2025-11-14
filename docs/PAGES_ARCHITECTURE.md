# 📄 GPT Agent Platform - Pages Architecture

> **Version:** 2.0.0
> **Based on:** KWID Platform Complete Analysis
> **Approach:** Enterprise-grade design inspired by Linear, Vercel, Notion

---

## 📑 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Layout System](#layout-system)
3. [Page Structures](#page-structures)
   - [Dashboard](#1-dashboard-инфопанель)
   - [AI Agents List](#2-ai-agents-list-агенты-ии)
   - [AI Agent Edit (6 Tabs)](#3-ai-agent-edit-редактирование-агента)
   - [Knowledge Base](#4-knowledge-base-база-знаний)
   - [Test Chat](#5-test-chat-тестовый-чат)
   - [Integrations](#6-integrations-интеграции)
   - [Account Settings](#7-account-settings-настройки-аккаунта)
   - [Pricing](#8-pricing-тарифные-планы)
4. [Responsive Behavior](#responsive-behavior)
5. [State Management](#state-management)
6. [Navigation Flows](#navigation-flows)

---

## 🏗️ Architecture Overview

### Design Philosophy

**Принципы построения страниц:**

1. **Consistent Layout** - Единый паттерн расположения элементов
2. **Progressive Disclosure** - Показываем информацию постепенно
3. **Action-Oriented** - Четкие call-to-action кнопки
4. **Data-Dense but Scannable** - Много информации, но легко сканировать
5. **Optimistic UI** - Мгновенная обратная связь на действия

### App Shell

```
┌────────────────────────────────────────────────────────────┐
│                    Header (64px)                           │
│  [Logo] [GlobalSearch]    [License] [Notifications] [User] │
├─────────────┬──────────────────────────────────────────────┤
│             │                                              │
│   Sidebar   │           Main Content Area                  │
│   (256px)   │                                              │
│             │  ┌────────────────────────────────────────┐  │
│ [Dashboard] │  │ Breadcrumbs                            │  │
│ [Agents]    │  │ ───────────────────────────────────── │  │
│ [Knowledge] │  │                                        │  │
│ [Test Chat] │  │ Page Header                            │  │
│ [Integr.]   │  │ [Title]                    [Actions]   │  │
│ [Settings]  │  │                                        │  │
│             │  │ ───────────────────────────────────── │  │
│             │  │                                        │  │
│             │  │ Content Area                           │  │
│             │  │                                        │  │
│             │  │                                        │  │
│             │  └────────────────────────────────────────┘  │
│             │                                              │
└─────────────┴──────────────────────────────────────────────┘
```

---

## 🎨 Layout System

### Standard Page Template

Каждая страница следует единой структуре:

```tsx
<PageContainer>
  {/* 1. Breadcrumbs Navigation */}
  <Breadcrumbs />

  {/* 2. Page Header */}
  <PageHeader>
    <PageTitle>Page Name</PageTitle>
    <PageDescription>Optional description</PageDescription>
    <PageActions>
      <Button>Primary Action</Button>
    </PageActions>
  </PageHeader>

  {/* 3. Filters/Toolbar (optional) */}
  <Toolbar>
    <SearchInput />
    <Filters />
  </Toolbar>

  {/* 4. Main Content */}
  <MainContent>
    {/* Content varies by page */}
  </MainContent>

  {/* 5. Pagination (if needed) */}
  <Pagination />
</PageContainer>
```

### Grid System

**Desktop (≥1024px):**
- Main content: max-width 1200px, centered
- Padding: 24px horizontal
- Grid: 12 columns, 24px gap

**Tablet (768px-1023px):**
- Sidebar collapses to icons only (64px)
- Main content: full width
- Padding: 20px horizontal
- Grid: 8 columns, 20px gap

**Mobile (<768px):**
- Sidebar becomes slide-over menu
- Main content: full width
- Padding: 16px horizontal
- Grid: 4 columns, 16px gap

---

## 📄 Page Structures

### 1. Dashboard (Инфопанель)

**URL:** `/manage/[tenantId]/dashboard`

**Purpose:** Обзор ключевых метрик и активности платформы

#### Wireframe Structure

```
┌──────────────────────────────────────────────────────────┐
│ Breadcrumbs: Главная                                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Инфопанель                                               │
│ ─────────────────────────────────────────────────────── │
│                                                          │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────┐│
│ │📊 Всего    │ │✅ Активных │ │💬 Диалогов │ │⏱️ Время││
│ │  агентов   │ │  агентов   │ │  сегодня   │ │ ответа ││
│ │            │ │            │ │            │ │        ││
│ │    24      │ │     18     │ │   1,247    │ │  1.2s  ││
│ │  +12% ↗️   │ │   +5% ↗️   │ │  +23% ↗️   │ │ -15% ↘️││
│ └────────────┘ └────────────┘ └────────────┘ └────────┘│
│                                                          │
│ ┌──────────────────────────┐ ┌──────────────────────────┐│
│ │📈 Активность по месяцам  │ │📊 Активность по дням    ││
│ │                          │ │                         ││
│ │  [Line Chart]            │ │  [Bar Chart]            ││
│ │                          │ │                         ││
│ │  Jan  Feb  Mar  Apr  May │ │  Mon Tue Wed Thu Fri    ││
│ └──────────────────────────┘ └──────────────────────────┘│
│                                                          │
│ ┌──────────────────────────────────────────────────────┐│
│ │📋 Последние события                                  ││
│ │                                                      ││
│ │ • Агент "Поддержка" запущен          2 мин назад    ││
│ │ • Новый диалог в канале Telegram     5 мин назад    ││
│ │ • База знаний обновлена              15 мин назад   ││
│ │ • Агент "Продажи" остановлен         1 час назад    ││
│ └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

#### Components Breakdown

**Stat Cards (4):**
```tsx
<StatsGrid>
  <StatCard
    title="Всего агентов"
    value={24}
    change={+12}
    trend="up"
    icon={<BotIcon />}
  />
  <StatCard
    title="Активных агентов"
    value={18}
    change={+5}
    trend="up"
    icon={<CheckCircleIcon />}
  />
  <StatCard
    title="Диалогов сегодня"
    value={1247}
    change={+23}
    trend="up"
    icon={<MessageSquareIcon />}
  />
  <StatCard
    title="Время ответа"
    value="1.2s"
    change={-15}
    trend="down"
    icon={<ClockIcon />}
  />
</StatsGrid>
```

**Charts (2):**
```tsx
<ChartsGrid>
  <ChartCard title="Активность по месяцам">
    <LineChart data={monthlyData} />
  </ChartCard>

  <ChartCard title="Активность по дням">
    <BarChart data={dailyData} />
  </ChartCard>
</ChartsGrid>
```

**Activity Feed:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Последние события</CardTitle>
  </CardHeader>
  <CardContent>
    <ActivityFeed items={recentEvents} />
  </CardContent>
</Card>
```

#### Data Requirements

**API Endpoints:**
- `GET /api/v1/dashboard/stats` - Статистика карточек
- `GET /api/v1/dashboard/monthly-chart` - Данные месячного графика
- `GET /api/v1/dashboard/daily-chart` - Данные дневного графика
- `GET /api/v1/dashboard/events` - Последние события

#### Responsive Behavior

**Desktop:** 4 stat cards in row, 2 charts side-by-side
**Tablet:** 2 stat cards per row, 2 charts side-by-side
**Mobile:** 1 stat card per row, 1 chart per row (stacked)

---

### 2. AI Agents List (Агенты ИИ)

**URL:** `/manage/[tenantId]/ai-agents`

**Purpose:** Управление списком AI агентов

#### Wireframe Structure

```
┌──────────────────────────────────────────────────────────┐
│ Breadcrumbs: Главная > Агенты ИИ                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Агенты ИИ                               [+ Создать]     │
│ ─────────────────────────────────────────────────────── │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 🔍 Поиск...                  [Фильтр ▼] [Столбцы] │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐│
│ │☑️ Название     │ Статус  │ Модель   │ Обновлен  │⚙️││
│ │─────────────────┼─────────┼──────────┼───────────┼──││
│ │☑️ Поддержка    │ ✅ Вкл. │ GPT-4    │ 2 мин     │⋮ ││
│ │☑️ Продажи      │ ✅ Вкл. │ GPT-4    │ 10 мин    │⋮ ││
│ │☑️ FAQ Бот      │ ⏸️ Выкл.│ GPT-3.5  │ 1 час     │⋮ ││
│ │☑️ Консультант  │ ✅ Вкл. │ Claude   │ 3 часа    │⋮ ││
│ └──────────────────────────────────────────────────────┘│
│                                                          │
│              [◀ Пред.]  1 2 3 4 5  [След. ▶]            │
└──────────────────────────────────────────────────────────┘
```

#### Components Breakdown

**Page Header:**
```tsx
<PageHeader>
  <div>
    <PageTitle>Агенты ИИ</PageTitle>
  </div>
  <PageActions>
    <Link href={`/manage/${tenantId}/ai-agents/create`}>
      <Button>
        <PlusIcon />
        Создать
      </Button>
    </Link>
  </PageActions>
</PageHeader>
```

**Toolbar:**
```tsx
<Toolbar>
  <SearchInput
    placeholder="Поиск..."
    value={search}
    onChange={setSearch}
  />
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="outline">
        Фильтр
        <ChevronDownIcon />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => setFilter('all')}>
        Все
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setFilter('active')}>
        Активные
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setFilter('inactive')}>
        Неактивные
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <ColumnsToggle
    columns={columns}
    onToggle={handleColumnToggle}
  />
</Toolbar>
```

**Agents Table:**
```tsx
<DataTable
  columns={[
    {
      id: 'select',
      header: ({ table }) => <Checkbox />,
      cell: ({ row }) => <Checkbox />,
    },
    {
      id: 'name',
      header: 'Название',
      cell: ({ row }) => (
        <Link href={`/manage/${tenantId}/ai-agents/${row.id}/edit`}>
          {row.name}
        </Link>
      ),
    },
    {
      id: 'status',
      header: 'Статус',
      cell: ({ row }) => (
        <Badge variant={row.isActive ? 'success' : 'secondary'}>
          {row.isActive ? 'Включен' : 'Выключен'}
        </Badge>
      ),
    },
    {
      id: 'model',
      header: 'Модель',
      cell: ({ row }) => row.model,
    },
    {
      id: 'updatedAt',
      header: 'Обновлен',
      cell: ({ row }) => formatRelativeTime(row.updatedAt),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Редактировать</DropdownMenuItem>
            <DropdownMenuItem>Копировать</DropdownMenuItem>
            <DropdownMenuItem>Удалить</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]}
  data={agents}
  sorting={sorting}
  onSortingChange={setSorting}
/>
```

#### Interactive Features

1. **Bulk Selection** - Выбор нескольких агентов для массовых операций
2. **Quick Toggle** - Переключатель активности прямо в таблице
3. **Inline Edit** - Быстрое редактирование имени (double-click)
4. **Smart Search** - Поиск по названию, описанию, модели
5. **Column Customization** - Показать/скрыть столбцы
6. **Persistent State** - Сохранение настроек фильтров в localStorage

#### Data Requirements

**API Endpoints:**
- `GET /api/agents?search={query}&status={filter}` - Список агентов
- `PATCH /api/agents/[id]/status` - Изменение статуса
- `DELETE /api/agents/[id]` - Удаление агента
- `POST /api/agents/[id]/copy` - Копирование агента

---

### 3. AI Agent Edit (Редактирование агента)

**URL:** `/manage/[tenantId]/ai-agents/[agentId]/edit`

**Purpose:** Полная конфигурация AI агента через 6 вкладок

#### Tab Navigation Structure

```
┌──────────────────────────────────────────────────────────┐
│ Breadcrumbs: Агенты > Поддержка                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Редактирование: Поддержка                [💾 Сохранить] │
│ ─────────────────────────────────────────────────────── │
│                                                          │
│ [Основные] [Сделки] [Триггеры] [Цепочки] [Интегр.] [+] │
│ ──────────                                               │
│                                                          │
│ {Tab Content}                                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Tab 1: Основные настройки

```
┌──────────────────────────────────────────────────────────┐
│ 📋 Основная информация                                   │
│                                                          │
│ Название агента *                                        │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Поддержка                                            │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Описание                                                 │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Агент для обработки запросов в поддержку             │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Модель AI *                                              │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ GPT-4                                            [▼] │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ✅ Активен                                               │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 💬 Приветственное сообщение                              │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Здравствуйте! Я ваш AI-ассистент.                   │ │
│ │ Чем могу помочь?                                     │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 🎯 Инструкции для агента                                 │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Ты - профессиональный агент поддержки.               │ │
│ │ Отвечай вежливо, кратко и по делу.                   │ │
│ │                                                      │ │
│ │ [Rich Text Editor]                                   │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 🗂️ База знаний                                           │
│                                                          │
│ ┌────────────────────────────────────────┐              │
│ │☑️ FAQ по продуктам                     │              │
│ │☑️ Инструкции для клиентов              │              │
│ │☐ Технические спецификации             │              │
│ └────────────────────────────────────────┘              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Components:**
- Text Input (name, description)
- Select Dropdown (AI model)
- Toggle Switch (active status)
- Textarea (welcome message)
- Rich Text Editor (instructions)
- Multi-select Checkbox (knowledge base)

#### Tab 2: Сделки и контакты

```
┌──────────────────────────────────────────────────────────┐
│ 🎯 Воронка продаж                                        │
│                                                          │
│ Воронка CRM *                                            │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Продажи 2024                                     [▼] │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Этап воронки *                                           │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Первичный контакт                                [▼] │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 📞 Каналы связи                                          │
│                                                          │
│ ☑️ Telegram                                              │
│ ☑️ WhatsApp                                              │
│ ☑️ Email                                                 │
│ ☐ Facebook Messenger                                     │
│ ☐ Instagram Direct                                       │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 📝 Поля для заполнения                                   │
│                                                          │
│ При создании сделки заполнять:                           │
│ ☑️ Имя клиента                                           │
│ ☑️ Телефон                                               │
│ ☑️ Email                                                 │
│ ☑️ Источник                                              │
│ ☐ Компания                                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Components:**
- Cascading Dropdowns (funnel → stage)
- Checkbox Group (channels, fields)
- Info tooltips для каждого поля

#### Tab 3: Триггеры

```
┌──────────────────────────────────────────────────────────┐
│ ⚡ Триггеры                              [+ Добавить]    │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 📋 Новое сообщение                             [⋮]  │ │
│ │ ─────────────────────────────────────────────────── │ │
│ │ Условие: Когда приходит новое сообщение            │ │
│ │ Действие: Отправить приветствие                    │ │
│ │ Статус: ✅ Активен                                  │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 🔄 Смена статуса сделки                        [⋮]  │ │
│ │ ─────────────────────────────────────────────────── │ │
│ │ Условие: Сделка переведена в "Закрыто"             │ │
│ │ Действие: Отправить благодарность                  │ │
│ │ Статус: ✅ Активен                                  │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ ⏰ Нет ответа 24 часа                          [⋮]  │ │
│ │ ─────────────────────────────────────────────────── │ │
│ │ Условие: Клиент не ответил 24 часа                 │ │
│ │ Действие: Отправить напоминание                    │ │
│ │ Статус: ⏸️ Неактивен                                │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Interactive Features:**
- Drag-to-reorder triggers
- Inline toggle для активации/деактивации
- Modal для создания/редактирования триггера

#### Tab 4: Цепочки (Sequences)

```
┌──────────────────────────────────────────────────────────┐
│ 🔗 Цепочки сообщений                    [+ Создать]     │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 📨 Онбординг новых клиентов                    [⋮]  │ │
│ │ ─────────────────────────────────────────────────── │ │
│ │ Шагов: 5 │ Длительность: 7 дней │ ✅ Активна       │ │
│ │                                                      │ │
│ │ 1️⃣ Приветствие (сразу)                              │ │
│ │ 2️⃣ Обучающий материал (+1 день)                     │ │
│ │ 3️⃣ Проверка понимания (+2 дня)                      │ │
│ │ 4️⃣ Предложение помощи (+4 дня)                      │ │
│ │ 5️⃣ Запрос обратной связи (+7 дней)                  │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 🎁 Реактивация                                 [⋮]  │ │
│ │ ─────────────────────────────────────────────────── │ │
│ │ Шагов: 3 │ Длительность: 14 дней │ ⏸️ Неактивна    │ │
│ │                                                      │ │
│ │ 1️⃣ "Мы скучали по вам" (сразу)                      │ │
│ │ 2️⃣ Специальное предложение (+7 дней)                │ │
│ │ 3️⃣ Последняя попытка (+14 дней)                     │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Components:**
- Sequence Cards (expandable/collapsible)
- Visual timeline для шагов
- Drag-to-reorder steps

#### Tab 5: Доступные интеграции

```
┌──────────────────────────────────────────────────────────┐
│ 🔌 Интеграции                                            │
│                                                          │
│ [CRM] [Мессенджеры] [Email] [Другое]                    │
│                                                          │
│ ┌────────────────────┐ ┌────────────────────┐           │
│ │  [Kommo Logo]      │ │ [Telegram Logo]    │           │
│ │  Kommo CRM         │ │ Telegram           │           │
│ │  ✅ Подключено     │ │ ✅ Подключено      │           │
│ │  [Настроить]       │ │ [Настроить]        │           │
│ └────────────────────┘ └────────────────────┘           │
│                                                          │
│ ┌────────────────────┐ ┌────────────────────┐           │
│ │  [WhatsApp Logo]   │ │ [Email Logo]       │           │
│ │  WhatsApp          │ │ Email (SMTP)       │           │
│ │  ⏸️ Не подключено  │ │ ⏸️ Не подключено   │           │
│ │  [Подключить]      │ │ [Подключить]       │           │
│ └────────────────────┘ └────────────────────┘           │
│                                                          │
│ ┌────────────────────┐ ┌────────────────────┐           │
│ │  [FB Logo]         │ │ [IG Logo]          │           │
│ │  Facebook          │ │ Instagram          │           │
│ │  ⏸️ Не подключено  │ │ ⏸️ Не подключено   │           │
│ │  [Подключить]      │ │ [Подключить]       │           │
│ └────────────────────┘ └────────────────────┘           │
└──────────────────────────────────────────────────────────┘
```

**Components:**
- Tab Navigation (filter by category)
- Integration Cards (grid layout)
- Connection status indicators
- Modal для настройки каждой интеграции

#### Tab 6: Дополнительно

```
┌──────────────────────────────────────────────────────────┐
│ ⚙️ Расширенные настройки                                 │
│                                                          │
│ 🤖 Поведение AI                                          │
│                                                          │
│ Temperature                                              │
│ ┌────────────────────────────────────────────────────┐   │
│ │ [■■■■■■■□□□] 0.7                                   │   │
│ └────────────────────────────────────────────────────┘   │
│ Консервативно ←→ Креативно                               │
│                                                          │
│ Max Tokens                                               │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 2048                                                 │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ ☑️ Использовать контекст предыдущих сообщений            │
│ ☑️ Разрешить внешние вызовы функций                      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 🚫 Ограничения                                           │
│                                                          │
│ Максимум диалогов в час                                  │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 100                                                  │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Максимальная длина диалога (сообщений)                   │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 50                                                   │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ 📊 Логирование                                           │
│                                                          │
│ ☑️ Сохранять все диалоги                                 │
│ ☑️ Логировать ошибки                                     │
│ ☐ Подробное логирование (debug mode)                     │
│                                                          │
│ Период хранения логов                                    │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ 90 дней                                          [▼] │ │
│ └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Components:**
- Range Sliders (temperature, tokens)
- Number Inputs (rate limits)
- Checkboxes (feature toggles)
- Select Dropdown (retention period)

#### Save Behavior

**Auto-save:**
- Debounced auto-save каждые 3 секунды при изменениях
- Toast notification: "Изменения сохранены"

**Manual Save:**
- Кнопка "Сохранить" в header
- Keyboard shortcut: Cmd/Ctrl + S
- Показывать индикатор несохраненных изменений

**Validation:**
- Real-time validation при вводе
- Блокировка сохранения при ошибках
- Highlight полей с ошибками

---

### 4. Knowledge Base (База знаний)

**URL:** `/manage/[tenantId]/knowledge-base`

**Purpose:** Управление категориями и статьями базы знаний

#### Wireframe Structure

```
┌──────────────────────────────────────────────────────────┐
│ База знаний                             [+ Добавить]    │
│                                                          │
│ [Категории] [Статьи]                                     │
│ ───────────                                              │
│                                                          │
│ ┌─────────────────┐ ┌──────────────────────────────────┐│
│ │ 📁 Категории    │ │ 📄 Статьи                        ││
│ │                 │ │                                  ││
│ │ ▼ 📘 Продукты   │ │ 🔍 Поиск статей...               ││
│ │   • Основы      │ │                                  ││
│ │   • Функции     │ │ ┌──────────────────────────────┐ ││
│ │   • Цены        │ │ │ Как начать работу            │ ││
│ │                 │ │ │ Категория: Основы            │ ││
│ │ ▼ 📗 Поддержка  │ │ │ Обновлено: 2 дня назад       │ ││
│ │   • FAQ         │ │ └──────────────────────────────┘ ││
│ │   • Контакты    │ │                                  ││
│ │                 │ │ ┌──────────────────────────────┐ ││
│ │ ▶ 📕 Интеграции │ │ │ Настройка интеграций         │ ││
│ │                 │ │ │ Категория: Интеграции        │ ││
│ │ [+ Категория]   │ │ │ Обновлено: 1 неделю назад    │ ││
│ │                 │ │ └──────────────────────────────┘ ││
│ └─────────────────┘ └──────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Components:**
- Tree View (categories hierarchy)
- Search + Filter (articles)
- Card Grid (article previews)
- Modal (create/edit category/article)

---

### 5. Test Chat (Тестовый чат)

**URL:** `/manage/[tenantId]/test-chat`

**Purpose:** Тестирование агентов в реальном времени

#### Wireframe Structure

```
┌──────────────────────────────────────────────────────────┐
│ Тестовый чат                                             │
│                                                          │
│ ┌─────────────────┐ ┌──────────────────────────────────┐│
│ │ 🤖 Агенты       │ │ 💬 Чат: Поддержка                ││
│ │                 │ │                                  ││
│ │ ● Поддержка     │ │ ╔══════════════════════════════╗ ││
│ │ ○ Продажи       │ │ ║ AI: Здравствуйте!            ║ ││
│ │ ○ FAQ Бот       │ │ ║     Чем могу помочь?         ║ ││
│ │                 │ │ ╚══════════════════════════════╝ ││
│ │                 │ │                                  ││
│ │                 │ │ ┌────────────────────────────┐   ││
│ │                 │ │ │ User: Как сбросить пароль? │   ││
│ │                 │ │ └────────────────────────────┘   ││
│ │                 │ │                                  ││
│ │                 │ │ ╔══════════════════════════════╗ ││
│ │                 │ │ ║ AI: Для сброса пароля...     ║ ││
│ │ [Новый чат]     │ │ ╚══════════════════════════════╝ ││
│ │                 │ │                                  ││
│ │                 │ │ ┌──────────────────────────────┐ ││
│ │                 │ │ │ Введите сообщение...     [→]│ ││
│ │                 │ │ └──────────────────────────────┘ ││
│ └─────────────────┘ └──────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Components:**
- Sidebar (agent selection)
- Chat Window (message history)
- Message Input (with attachments)
- Real-time WebSocket connection

---

### 6. Integrations (Интеграции)

**URL:** `/manage/[tenantId]/integrations`

**Purpose:** Управление подключенными сервисами

#### Wireframe Structure

```
┌──────────────────────────────────────────────────────────┐
│ Интеграции                                               │
│                                                          │
│ [Все] [CRM] [Мессенджеры] [Email] [Другое]              │
│                                                          │
│ ┌──────────────────────┐ ┌──────────────────────┐       │
│ │  [Kommo]             │ │ [Telegram]           │       │
│ │  Kommo CRM           │ │ Telegram Bot         │       │
│ │  ✅ Подключено       │ │ ✅ Подключено        │       │
│ │  3 агента исп.       │ │ 5 агентов исп.       │       │
│ │  [Управление]        │ │ [Управление]         │       │
│ └──────────────────────┘ └──────────────────────┘       │
│                                                          │
│ ┌──────────────────────┐ ┌──────────────────────┐       │
│ │  [WhatsApp]          │ │ [Email]              │       │
│ │  WhatsApp Business   │ │ SMTP Email           │       │
│ │  ⏸️ Доступно         │ │ ⏸️ Доступно          │       │
│ │  [Подключить]        │ │ [Подключить]         │       │
│ └──────────────────────┘ └──────────────────────┘       │
└──────────────────────────────────────────────────────────┘
```

---

### 7. Account Settings (Настройки аккаунта)

**URL:** `/manage/[tenantId]/settings`

#### Wireframe Structure

```
┌──────────────────────────────────────────────────────────┐
│ Настройки                                                │
│                                                          │
│ [Профиль] [Безопасность] [Уведомления] [Тема]            │
│ ────────                                                 │
│                                                          │
│ 👤 Личная информация                                     │
│                                                          │
│ Имя                                                      │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Admin User                                           │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Email                                                    │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ admin@example.com                                    │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Аватар                                                   │
│ ┌────┐                                                   │
│ │ 👤 │ [Загрузить] [Удалить]                            │
│ └────┘                                                   │
│                                                          │
│                                  [Отменить] [Сохранить] │
└──────────────────────────────────────────────────────────┘
```

---

### 8. Pricing (Тарифные планы)

**URL:** `/manage/[tenantId]/pricing`

#### Wireframe Structure

```
┌──────────────────────────────────────────────────────────┐
│ Тарифные планы                                           │
│                                                          │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Ваш текущий план: Professional                       │ │
│ │ Действует до: 30.10.2025                             │ │
│ │ [Управление подпиской]                               │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Количество ответов: ●1000 ○5000 ○10000 ○Безлимит        │
│ Период оплаты: ●Месяц ○Год (-20%)                       │
│                                                          │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│ │ Starter    │ │ Pro ⭐     │ │ Enterprise │           │
│ │            │ │            │ │            │           │
│ │ $29/мес    │ │ $99/мес    │ │ По запросу │           │
│ │            │ │            │ │            │           │
│ │ ✓ 1 агент  │ │ ✓ 10 агент.│ │ ✓ Unlimited│           │
│ │ ✓ 1000 отв.│ │ ✓ 5000 отв.│ │ ✓ Custom   │           │
│ │ ✓ Базовая  │ │ ✓ Все фичи │ │ ✓ Поддержка│           │
│ │            │ │            │ │            │           │
│ │ [Выбрать]  │ │ [Текущий]  │ │ [Связаться]│           │
│ └────────────┘ └────────────┘ └────────────┘           │
│                                                          │
│ ❓ FAQ                                                   │
│ ▼ Как работает оплата?                                  │
│ ▶ Можно ли изменить план?                               │
│ ▶ Что включено в поддержку?                             │
└──────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Behavior

### Desktop (≥1024px)

- Full sidebar (256px)
- Multi-column layouts
- Hover interactions
- Tooltips everywhere

### Tablet (768px-1023px)

- Collapsed sidebar (64px, icons only)
- 2-column layouts → 1-column for some sections
- Tap interactions
- Reduced tooltips

### Mobile (<768px)

- Slide-over sidebar
- Single column layout
- Touch-optimized (44px minimum touch targets)
- Bottom sheets instead of modals
- Simplified navigation

---

## 🔄 State Management

### Client State (React Query)

```tsx
// Agents list
const { data, isLoading } = useQuery({
  queryKey: ['agents', search, filter],
  queryFn: () => fetchAgents({ search, filter }),
  staleTime: 30000, // 30 seconds
})

// Agent detail
const { data: agent } = useQuery({
  queryKey: ['agent', agentId],
  queryFn: () => fetchAgent(agentId),
})

// Mutations
const updateAgent = useMutation({
  mutationFn: updateAgentApi,
  onSuccess: () => {
    queryClient.invalidateQueries(['agents'])
    toast.success('Агент обновлен')
  },
})
```

### Form State (React Hook Form)

```tsx
const form = useForm<AgentFormData>({
  resolver: zodResolver(agentSchema),
  defaultValues: agent,
})

const onSubmit = form.handleSubmit(async (data) => {
  await updateAgent.mutateAsync(data)
})
```

### URL State (Next.js)

```tsx
const searchParams = useSearchParams()
const router = useRouter()

// Read from URL
const page = searchParams.get('page') || '1'
const filter = searchParams.get('filter') || 'all'

// Update URL
router.push(`?page=${newPage}&filter=${newFilter}`)
```

---

## 🔗 Navigation Flows

### Primary Flows

**1. Create Agent:**
Dashboard → AI Agents → Create → Fill Form → Save → Edit Tabs

**2. Edit Agent:**
AI Agents List → Click Agent → Edit → Switch Tabs → Save

**3. Test Agent:**
Any Page → Test Chat → Select Agent → Chat

**4. Manage Integrations:**
Settings → Integrations → Select Service → Configure → Save

**5. Upgrade Plan:**
Dashboard (License Alert) → Pricing → Select Plan → Checkout

---

## ✅ Implementation Checklist

### Phase 1: Layouts
- [ ] Create base PageContainer component
- [ ] Implement responsive grid system
- [ ] Build breadcrumbs navigation
- [ ] Create page header pattern

### Phase 2: Dashboard
- [ ] Stats cards component
- [ ] Charts integration (Recharts)
- [ ] Activity feed component
- [ ] Real-time updates (WebSocket)

### Phase 3: Agents
- [ ] Agents table with sorting/filtering
- [ ] Column customization
- [ ] Bulk operations
- [ ] Create/Edit forms

### Phase 4: Agent Tabs
- [ ] Tab navigation component
- [ ] All 6 tab content areas
- [ ] Form validation
- [ ] Auto-save functionality

### Phase 5: Other Pages
- [ ] Knowledge base (tree view)
- [ ] Test chat (WebSocket)
- [ ] Integrations grid
- [ ] Settings pages

### Phase 6: Polish
- [ ] Loading states
- [ ] Error handling
- [ ] Empty states
- [ ] Responsive testing
- [ ] Accessibility audit

---

**Next Steps:**
1. Review this architecture with team
2. Create component library based on these patterns
3. Implement pages in priority order
4. Continuous testing and iteration

---

**Maintained by:** Design & Engineering Teams
**Last Updated:** 2025-11-14
**Version:** 2.0.0
