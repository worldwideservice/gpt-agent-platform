# UI/UX Спецификация: GPT Агент - Полная репликация интерфейса

## Общая структура приложения

### 1. Глобальная навигация и layout

#### 1.1. Верхний Header (глобальный)
- **Расположение**: Фиксированная панель вверху всей страницы
- **Компоненты**:
  - **Поле поиска**: 
    - Иконка лупы слева
    - Placeholder: "Поиск"
    - Стиль: rounded corners, light border
    - Ширина: max-width на больших экранах
  - **Чип с датой**:
    - Формат: "30.10.2025" или "чтв, окт 16"
    - Иконка календаря слева
    - Цвет фона: светло-зеленый/серый (chip style)
    - Rounded corners
  - **Уведомления**:
    - Иконка колокольчика
    - Красный badge с числом (например, "76")
    - Dropdown при клике с:
      - Заголовок "Уведомления" и число
      - Кнопки "Отметить как прочитанное" и "Удалить"
      - Список уведомлений с:
        - Заголовок уведомления
        - Описание
        - Время (например, "21 минуту назад")
        - Действие (например, "Обновить план")
        - Кнопка закрытия (X) справа
  - **Переключатель темы**:
    - Иконка солнца/луны
    - Rounded button style
  - **Аватар пользователя**:
    - Круглая иконка с инициалами (например, "A" или "GA")
    - Темный фон, белый текст
    - При клике - dropdown меню:
      - Имя пользователя
      - Email
      - Опции темы (Светлая, Темная)
      - Разделитель
      - Кнопка "Выйти" (красная)

#### 1.2. Левая боковая панель (Sidebar)
- **Расположение**: Фиксированная панель слева, ширина ~280px (xl:w-80)
- **Стиль**: Белый фон, border справа, shadow
- **Компоненты**:
  - **Брендинг** (верх):
    - Логотип/инициалы организации в круглом контейнере
      - Размер: 44px (h-11 w-11)
      - Фон: primary-600 (синий)
      - Текст: белый, font-semibold
    - Текст "GPT Агент" (font-semibold, text-lg)
    - Подзаголовок "Trainable virtual employee" (text-xs, text-slate-500)
  
  - **Селектор организации**:
    - Контейнер с rounded corners и border
    - Верхняя строка: "ОРГАНИЗАЦИЯ" (uppercase, text-xs, text-slate-400)
    - Нижняя строка: Название организации (font-semibold, text-slate-900)
    - Иконка ChevronDown справа
    - Hover: border-primary-200, bg-primary-50
  
  - **Навигация** (по секциям):
    - Секции имеют заголовки (uppercase, text-xs, font-semibold, text-slate-400)
    - Пункты меню:
      - Rounded corners (rounded-xl)
      - Padding: px-3 py-2
      - Gap между иконкой и текстом: gap-3
      - Иконка: h-5 w-5, text-slate-400
      - Активное состояние:
        - bg-primary-50
        - text-primary-700
        - shadow-sm
      - Неактивное: text-slate-600, hover:bg-slate-100
  
  - **Структура навигации**:
    ```
    - Инфопанель (LayoutDashboard icon)
    
    - АГЕНТЫ ИИ (section title)
      - Агенты ИИ (Bot icon)
      - Тестовый чат (MessageSquare icon)
    
    - БАЗА ЗНАНИЙ (section title)
      - Категории (Folder icon)
      - Статьи (FileText icon)
    
    - ПОДДЕРЖКА (section title)
      - Начало работы (HelpCircle icon)
    
    - АККАУНТ (section title)
      - Настройки аккаунта (Settings icon)
      - Тарифные планы (CreditCard icon)
    
    - ЧТО НОВОГО (section title)
      - Смотреть на Facebook (Sparkles icon, external)
      - Смотреть в Instagram (Sparkles icon, external)
    ```

### 2. Основная область контента

#### 2.1. Dashboard (Инфопанель) - `/`

**Верхний ряд - KPI карточки (4 карточки в ряд)**:
- Grid: `grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6`
- Каждая карточка (StatCard):
  - Стиль: `rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`
  - Структура:
    - Заголовок: `text-sm font-medium text-slate-500`
    - Основное значение и изменение в одной строке:
      - Значение: `text-3xl font-bold text-slate-900`
      - Изменение: inline-flex рядом со значением
        - Если положительное: `text-green-600` с ArrowUpRight icon
        - Если отрицательное: `text-red-600` с ArrowDownRight icon
        - Формат: "+2.7%" или "-2.7%"
    - Подзаголовок (если есть): `text-sm text-slate-500 mt-2`
    - Иконка справа (если есть):
      - Контейнер: `h-10 w-10 rounded-lg bg-primary-50`
      - Иконка: `h-6 w-6 text-primary-600`

- **Карточки**:
  1. **"Ответы ИИ за этот месяц"**
     - Значение: динамическое число
     - Изменение: процент к прошлому месяцу (красное/зеленое)
     - Подзаголовок: "к прошлому месяцу"
     - Иконка: MessageSquare
  
  2. **"Ответы ИИ за последние 7 дней"**
     - Значение: динамическое число
     - Подзаголовок: "Последние 7 дней"
     - Иконка: CalendarCheck2
  
  3. **"Ответы ИИ сегодня"**
     - Значение: динамическое число
     - Иконка: Sparkles
  
  4. **"Агенты"**
     - Значение: динамическое число
     - Подзаголовок: "Всего агентов"
     - Иконка: Bot

**Нижний ряд - Графики (2 карточки в ряд)**:
- Grid: `grid-cols-1 lg:grid-cols-2 gap-6`

- **Столбчатая диаграмма (BarChartCard) - "Активность за последние 7 дней"**:
  - Стиль карточки: `rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`
  - Заголовок: `text-lg font-semibold text-slate-900`
  - Структура данных:
    - Каждая строка:
      - Название дня недели слева (например, "Понедельник"): `w-24 text-sm font-medium text-slate-600`
      - Горизонтальный столбец:
        - Фон: `h-8 rounded-lg bg-slate-100`
        - Заполнение: `bg-primary-600`, ширина в процентах
        - Число справа на столбце: `absolute inset-y-0 right-3 text-sm font-semibold text-slate-700`
      - Выравнивание: `flex items-center gap-4`
  
- **Список "Последние обновления" (RecentUpdates)**:
  - Стиль карточки: `rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`
  - Заголовок: `text-lg font-semibold text-slate-900 mb-6`
  - Список элементов:
    - Каждый элемент:
      - Цветная точка слева:
        - green-500
        - blue-500
        - purple-500
        - yellow-500
      - Текст:
        - Заголовок: `text-sm font-medium text-slate-900`
        - Время: `text-xs text-slate-500`
      - Разделитель (кроме последнего): `border-b border-slate-100 pb-4`
  
  - **Примерные элементы**:
    1. "Агент 'Консультант' активирован" - зеленый, "2 часа назад"
    2. "Добавлена новая интеграция с Kommo CRM" - синий, "5 часов назад"
    3. "База знаний обновлена: +15 статей" - фиолетовый, "1 день назад"
    4. "Создан новый агент 'Поддержка'" - желтый, "2 дня назад"

#### 2.2. Страница агентов - `/agents`

**Заголовок страницы**:
- Заголовок: "Агенты ИИ" (text-2xl font-bold)
- Подзаголовок: "Управление агентами" (text-sm text-slate-600)
- Кнопка "Создать агента" справа (Button с иконкой Plus)

**Поиск**:
- Расположение: справа, max-width: max-w-xs
- Input с иконкой Search слева
- Placeholder: "Поиск агентов..."

**Таблица агентов (AgentTable)**:
- Стиль контейнера: `rounded-2xl border border-slate-200 bg-white shadow-sm`
- Заголовки колонок:
  - Название
  - Статус (Toggle)
  - Модель
  - Сообщений
  - Последняя активность
  - Создан
  - Обновлён
  - Действия (text-right)
  
- Ячейки:
  - Название: Link с `text-primary-600 hover:underline`
  - Статус: Toggle компонент с текстом "Активен"/"Неактивен"
  - Действия:
    - Button ghost с иконкой Edit
    - Button ghost с иконкой Copy
    - Button ghost с иконкой Trash2 (красный цвет при hover)

**Пагинация/Информация**:
- Текст: "Показано X из Y агентов"
- Статус загрузки: "Обновление..." при isPending

#### 2.3. Страница редактирования агента - `/agents/[id]` или `/agents/[id]/edit`

**Верхняя секция**:
- Кнопка "Назад" (ArrowLeft icon) слева
- Заголовок: "Редактирование агента" или "Создание агента" (text-3xl font-bold)
- Подзаголовок: "Настройте параметры и поведение AI-агента"
- Действия справа:
  - Кнопка "Удалить агента" (destructive, если не новый)
  - Кнопка "Сохранить" (primary)

**Callout блок** (если не настроены воронки):
- Стиль: `rounded-2xl border border-blue-200 bg-blue-50 p-4`
- Текст: "Настройка воронок и этапов"
- Описание: "Выберите воронки и этапы сделок, где агент должен работать"
- Кнопка: "Настроить воронки" (outline, ссылка на /agents/[id]/pipelines)

**Табы навигации (Tabs)**:
- Стиль контейнера: `flex w-full justify-start overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1 shadow-sm`
- Табы: `flex-1 rounded-xl px-4 py-2 text-sm`
- Активный: `bg-primary-50 text-primary-700`
- Список табов:
  1. "Основные" (Settings icon)
  2. "Инструкции" (FileText icon)
  3. "Сделки и контакты" (Users icon)
  4. "Триггеры" (Zap icon)
  5. "Цепочки" (Clock icon)
  6. "Интеграции" (PuzzlePiece icon)
  7. "Дополнительно" (Settings2 icon)

**Содержимое табов**:

**Таб "Основные"**:
- Grid layout: `grid gap-4 lg:grid-cols-[1fr,280px]`
- Левая колонка:
  - Поле "Название агента" (Input, required)
  - "Инструкции для агента" (Textarea, required, rows=6)
  - "Приветственное сообщение" (Textarea, rows=4)
- Правая колонка (bg-slate-50, rounded-2xl, p-4):
  - Select "Модель ИИ"
  - Select "Рабочий язык"
  - Textarea "Описание" (rows=3)

- Карточки внизу (grid-cols-2):
  - "Вовлеченность" (статистика)
  - "Ответственные сотрудники"

**Таб "Инструкции"**:
- Grid (2 колонки):
  - Textarea "Стратегия общения" (rows=8)
  - Textarea "Запрещено" (rows=8)
- Select "Методология диалога"
- Textarea "Завершение диалога" (rows=5)

**Таб "Сделки и контакты"**:
- InteractionSettings компонент:
  - Toggle "Проверять сообщения перед отправкой"
  - Toggle "Автоматическое создание сделок"
  - Toggle "Синхронизация контактов"
  - Toggle "Передача менеджеру"
  
- Select "Рабочая воронка"
- Textarea "Инструкции по работе со стадией сделки"
- Grid карточек этапов (StageCard):
  - Каждая карточка:
    - `rounded-2xl border border-slate-200 bg-white p-4 shadow-sm`
    - Название этапа
    - Toggle справа
    - Описание внизу

- Callout "Доступные данные сделки":
  - Стиль: `rounded-2xl border border-dashed border-slate-200 p-4`
  - Описание
  - Теги выбранных полей (chips)

**Таб "Триггеры"**:
- TriggerManager компонент
- Заголовок: "Триггеры"
- Описание: "Выполняйте мгновенные действия при соблюдении определённых условий"
- Кнопка "Создать"
- Поиск
- Таблица триггеров:
  - Колонки: Название, Активно (Toggle), Условие, Действия
  - Строки с данными

**Таб "Цепочки"**:
- Заголовок: "Цепочки сообщений"
- Кнопка "Создать цепочку"
- Empty state:
  - Описание
  - Кнопка "Создать первую цепочку"

**Таб "Интеграции"**:
- ChannelsSettings компонент
- Список интеграций:
  - Каждая интеграция:
    - Иконка/логотип (rounded-lg, bg-primary-50)
    - Название и статус
    - Кнопка "Настроить"/"Подключить"

**Таб "Дополнительно"**:
- Заголовок: "Расширенные настройки"
- Grid (2 колонки):
  - Range input "Температура (creativity)"
  - Input "Задержка ответа (сек)"
- Input "Максимальная длина ответа (токены)"
- KnowledgeBaseSettings (Toggle)
- Toggle "Сохранять историю диалогов"

#### 2.4. Страница триггеров - `/agents/[id]/triggers`

**Модальное окно "Создать Триггер"**:
- Расположение: Правая сторона экрана (slide-in modal)
- Ширина: ~600px
- Стиль: `bg-white shadow-xl border border-slate-200`

- Поля формы:
  - **Название** (Input, required):
    - Placeholder: "Например, запрос оплаты"
    - Border: blue когда фокус
  
  - **Активно** (Toggle):
    - По умолчанию: включен (blue)
  
  - **Условие** (Textarea):
    - Placeholder: "Например, если клиент просит оплатить"
    - Helper text: "Укажите, когда этот триггер должен срабатывать"
  
  - **Действия** (Section):
    - Заголовок: "Действия"
    - Иконки стрелок вверх/вниз (reorder)
    - Select "Выберите действие"
    - Иконка корзины (удалить действие)
    - Кнопка "Добавить действие"
  
  - **Ответное сообщение** (Textarea):
    - Placeholder: "Например, я обработал ваш запрос..."
    - Helper text: "Сообщение, возвращаемое при выполнении триггера"
  
  - **Лимит запусков** (Input number):
    - Значение: 0
    - Unit: "раз"
    - Helper text: "Максимальное количество запусков..."

- Кнопки внизу:
  - "Создать" (primary, blue)
  - "Создать и создать еще один" (secondary)
  - "Отменить" (secondary)

#### 2.5. Страница базы знаний - `/knowledge-base/categories`

**Заголовок**:
- Breadcrumbs: "Категории > Список"
- Заголовок: "Категории"
- Кнопка "Создать" (primary)

**Фильтры**:
- Поиск
- Иконка фильтра с badge "0" или "1"

**Таблица категорий**:
- Колонки:
  - Checkbox (bulk selection)
  - Заголовок (sortable)
  - Подкатегории
  - Статьи
  - Действия (folder icon, edit, delete)

**Пагинация**: "Показано с X по Y из Z"

#### 2.6. Страница статей - `/knowledge-base/articles`

**Форма создания/редактирования статьи**:
- Заголовок: "Создать Статья"
- Поля:
  - **Заголовок** (Input, required, * красная)
  - **Активно** (Toggle)
  - **Категории** (Multi-select с тегами):
    - Выбранные отображаются как chips с X
    - Placeholder: "Выберите категории"
  - **Связанные статьи** (Multi-select):
    - Placeholder: "Найдите и выберите связанные статьи..."
    - Helper text: "Когда агент находит эту статью..."
  - **Содержимое** (Textarea, required, * красная, большое поле)
  - **Отправить файлы** (File upload area):
    - Стиль: `border-dashed border-slate-200`
    - Текст: "Перетащите файлы или выберите"
    - Helper text: "Эти файлы будут отправлены клиентам..."

- Кнопки:
  - "Создать" (primary)
  - "Создать и Создать еще" (secondary)
  - "Отмена" (secondary)

#### 2.7. Страница настроек аккаунта - `/account`

**Заголовок**: "Настройки аккаунта"

**Секция "Общие"**:
- Card стиль: `rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`
- Toggle "Останавливать агентов ИИ при ответе человека"
- Описание под toggle
- Кнопка "Сохранить изменения" (primary, внизу)

#### 2.8. Страница тарифных планов - `/pricing`

**Заголовок**: "Тарифные планы"

**Текущий план** (если есть):
- Информация: "Ваш текущий план: Scale (15,000 ответов ИИ в месяц)"
- Детали:
  - "Активно до: 31.10.2025"
  - "Платежный цикл: Ежемесячно"
  - Ссылка "Перейти на годовой"
- Прогресс бар:
  - "100% использовано"
  - "Использовано: 15,002 из 15,000"
  - "Сбросится: окт 30"
- Кнопка "Управление подпиской"

**Селектор**:
- Dropdown "Ответов ИИ: 15,000"
- Toggle buttons: "Ежемесячно" (active), "Ежегодно"

**Карточки планов** (3 колонки):
- Стиль карточки: `rounded-2xl border bg-white p-6 shadow-sm`
- Карточка "Текущий план": зеленый border и badge "Текущий план"

- Каждая карточка:
  - Иконка плана (Flag/Star/Trophy)
  - Название плана
  - Цена: "$X /месяц"
  - Статус (если недоступно)
  - Список "Что включено" (checkmarks):
    - Количество агентов
    - Статьи базы знаний
    - Ответов/месяц
    - Инструкции агента
    - Дополнительные функции
  - Модели ИИ (если есть):
    - Список доступных моделей
  - Кнопка "Выбрать план →" или "Недоступно"

**Гарантия**:
- Секция внизу:
  - Иконка checkmark (green)
  - Заголовок: "30-дневная гарантия возврата денег"
  - Описание

#### 2.9. Страница интеграций - `/integrations`

**Таблица интеграций**:
- Колонки:
  - Интеграция
  - Установлено (иконка: checkmark/x)
  - Активно (иконка: checkmark/x)
  - Действия (кнопка "Настройки"/"Установить")

**Строки**:
- Kommo CRM: установлено ✓, активно ✓
- Google Calendar: не установлено ✗, не активно ✗

### 3. Компоненты дизайн-системы

#### 3.1. Button (Кнопка)
- Размеры: sm, md, lg
- Варианты:
  - primary: `bg-primary-600 text-white hover:bg-primary-700`
  - secondary: `bg-white border text-primary-600`
  - destructive: `bg-red-600 text-white hover:bg-red-700`
  - ghost: `text-slate-600 hover:bg-slate-100`
  - outline: `border border-slate-200`
- Закругление: `rounded-xl`
- Padding: `px-4 py-2` (md)
- Иконки: всегда с gap-2

#### 3.2. Input (Поле ввода)
- Стиль: `rounded-xl border border-slate-200 bg-white`
- Focus: `focus:border-primary-500 focus:ring-2 focus:ring-primary-100`
- Placeholder: `text-slate-400`
- Размеры: `py-2.5 px-4 text-sm`

#### 3.3. Textarea
- Те же стили что Input
- Resize: vertical или none
- Min rows: 3-4

#### 3.4. Select
- Кастомный стиль (не нативный)
- Dropdown с опциями
- Иконка chevron справа

#### 3.5. Toggle (Переключатель)
- Стиль: `h-6 w-11 rounded-full`
- Активный: `bg-primary-600`
- Неактивный: `bg-gray-200`
- Handle: белый круг, анимированное движение
- С текстом:
  - Layout: `flex items-start space-x-3`
  - Label и description слева
  - Toggle справа

#### 3.6. Card
- Стиль: `rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`
- Hover: `hover:shadow-lg` (если интерактивна)

#### 3.7. Table
- Контейнер: `rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden`
- Header: `bg-slate-50` (светлый фон)
- Строки: `border-b border-slate-100` (кроме последней)
- Hover строки: `hover:bg-slate-50`

#### 3.8. Badge
- Стили:
  - Info: `bg-blue-50 text-blue-600`
  - Success: `bg-green-50 text-green-600`
  - Warning: `bg-yellow-50 text-yellow-600`
  - Error: `bg-red-50 text-red-600`
- Размер: `px-3 py-1 text-xs font-semibold rounded-full`

#### 3.9. Modal/Dialog
- Overlay: полупрозрачный темный фон
- Контейнер: `bg-white rounded-2xl shadow-xl`
- Header: заголовок и кнопка закрытия (X)
- Footer: кнопки действий

#### 3.10. Tabs
- Контейнер: `rounded-2xl border border-slate-200 bg-white p-1 shadow-sm`
- Таб: `rounded-xl px-4 py-2 text-sm`
- Активный: `bg-primary-50 text-primary-700`
- Неактивный: `text-slate-600`

### 4. Цветовая палитра

```
Primary: 
- primary-50: #eff6ff
- primary-100: #dbeafe
- primary-600: #2563eb
- primary-700: #1d4ed8

Slate:
- slate-50: #f8fafc
- slate-100: #f1f5f9
- slate-200: #e2e8f0
- slate-400: #94a3b8
- slate-500: #64748b
- slate-600: #475569
- slate-700: #334155
- slate-900: #0f172a

Green (positive):
- green-50: #f0fdf4
- green-600: #16a34a

Red (negative/destructive):
- red-50: #fef2f2
- red-600: #dc2626

Yellow (warning):
- yellow-500: #eab308

Purple:
- purple-500: #a855f7
```

### 5. Типографика

```
Заголовки:
- h1: text-3xl font-bold text-slate-900
- h2: text-2xl font-bold text-slate-900
- h3: text-lg font-semibold text-slate-900

Основной текст:
- body: text-sm text-slate-600
- muted: text-xs text-slate-500

Секции:
- section title: text-xs font-semibold uppercase tracking-wider text-slate-400
```

### 6. Spacing и Layout

```
Контейнеры:
- page padding: p-6
- section spacing: space-y-8
- card spacing: gap-6

Grid:
- responsive: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

### 7. Интерактивность и анимации

- Hover эффекты на всех интерактивных элементах
- Плавные переходы (transition-colors, transition-all)
- Focus состояния с ring (focus:ring-2 focus:ring-primary-100)
- Loading состояния для async операций

### 8. Адаптивность

- Mobile: вертикальный layout, скрытый sidebar (drawer)
- Tablet: 2 колонки для карточек
- Desktop: полный layout с видимым sidebar

### 9. Обязательные функции

1. **Аутентификация**: логин, регистрация, сброс пароля
2. **Многоорганизационность**: переключение между организациями
3. **CRUD операции**: для всех сущностей (агенты, триггеры, статьи и т.д.)
4. **Поиск**: глобальный и локальный (в таблицах)
5. **Фильтрация**: в списках и таблицах
6. **Сортировка**: в таблицах
7. **Пагинация**: везде где есть списки
8. **Валидация форм**: с отображением ошибок
9. **Уведомления**: система уведомлений
10. **Интеграции**: подключение внешних сервисов (Kommo CRM и т.д.)

### 10. Критерии качества репликации

✅ Все компоненты должны быть визуально идентичны
✅ Все тексты на русском языке
✅ Все иконки из одного набора (Lucide React)
✅ Цветовая схема соответствует спецификации
✅ Типографика и spacing идентичны
✅ Интерактивность (hover, focus, active states) реализована
✅ Адаптивный дизайн работает на всех разрешениях
✅ Все функции из оригинального сервиса реализованы
✅ Производительность: плавные анимации, быстрая загрузка

---

## Структура файлов для реализации

```
app/
├── (protected)/
│   ├── page.tsx                    # Dashboard
│   ├── agents/
│   │   ├── page.tsx               # Список агентов
│   │   ├── new/page.tsx           # Создание агента
│   │   └── [id]/
│   │       ├── page.tsx           # Редактирование агента
│   │       ├── triggers/page.tsx  # Триггеры
│   │       └── pipelines/page.tsx # Воронки
│   ├── knowledge-base/
│   │   ├── categories/
│   │   └── articles/
│   ├── account/page.tsx
│   └── pricing/page.tsx

components/
├── dashboard/
│   ├── StatCard.tsx
│   ├── BarChartCard.tsx
│   └── RecentUpdates.tsx
├── agents/
│   ├── AgentTable.tsx
│   └── TriggerManager.tsx
└── ui/
    ├── Button.tsx
    ├── Input.tsx
    ├── Select.tsx
    ├── Toggle.tsx
    └── ...
```

---

**Этот документ является живым спецификацией и должен обновляться по мере реализации компонентов.**



