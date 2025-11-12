# Детальный отчет по странице "Тестовый чат"

## URL
`https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/test-chat`

## Title (Заголовок страницы)
"Test Chat Page - GPT Агент"

---

## Общая структура страницы

### Header (Верхняя панель)
- **Глобальный поиск** (ref=e16)
- **Ссылка на тарифы** "30.10.2025" (ref=e18) → `/pricing`
- **Кнопка уведомлений** "Открыть уведомления 9" (ref=e187) - показывает количество непрочитанных уведомлений (9)
- **Меню пользователя** (ref=e24) - аватар пользователя "Admin"

### Sidebar (Боковая панель)
- Полная структура описана в `SIDEBAR_DETAILED_REPORT.md`
- Активный раздел: "Агенты ИИ" > "Тестовый чат"

### Main Content (Основной контент)

#### 1. Левая панель - Список чатов

##### 1.1. Заголовок и кнопка "Новый чат"
- **Heading** "Чаты" (level=2, ref=e34)
- **Кнопка "Новый чат"** (ref=e35)
  - **Тип:** button
  - **Состояние:** может быть `active` (когда выбран новый чат)
  - **Функция:** Создание нового чата для тестирования
  - **Расположение:** Справа от заголовка "Чаты"

##### 1.2. Список чатов
- **Тип:** list (ref=e36)
- **Структура:** listitem (ref=e37, e41, e45)
- **Элементы чатов:**
  - **Кнопка чата** (ref=e38, e42, e46)
    - **Тип:** button
    - **Содержимое:**
      - **Текст сообщения** (generic, ref=e39, e43, e47) - первое сообщение из чата
      - **Время** (generic, ref=e40, e44, e48) - относительное время (например, "3 часа назад", "4 дня назад", "3 месяца назад")
    - **Функция:** Выбор чата для просмотра/продолжения
    - **Поведение:** При клике чат открывается в правой панели

**Примеры чатов:**
1. "Hello! My name is Maksym, I'm a personal assistant at World Wide Services. I'm here to help you connect with your immigration advisor. Before we move forward, may I ask what service you're interested in? 3 часа назад"
2. "Got it. I'll ignore this message. 4 дня назад"
3. "Thank you for your interest! A personal consultant will contact you soon and provide all the details about partnership costs and conditions. If you have any other questions, feel free to ask! 3 месяца назад"

#### 2. Правая панель - Область чата

##### 2.1. Пустое состояние
- **Текст:** "Выберите чат или начните новый" (generic, ref=e51)
- **Отображается:** Когда чат не выбран

##### 2.2. Форма отправки сообщения

###### 2.2.1. Выбор агента ИИ
- **Тип:** combobox (ref=e62)
- **Label:** "Агент ИИ" (generic, ref=e57)
- **Опции:**
  - "Выберите агента ИИ" (selected по умолчанию)
  - "АИ ассистент"
  - "Менеджер по продажам"
- **Функция:** Выбор агента для тестирования
- **Расположение:** Вверху формы

###### 2.2.2. Поле ввода сообщения
- **Тип:** textbox (ref=e71)
- **Label:** "Сообщение" (generic, ref=e65)
- **Placeholder:** "Введите сообщение здесь..."
- **Функция:** Ввод сообщения для отправки агенту
- **Расположение:** Под выбором агента

###### 2.2.3. Кнопка "Отправить"
- **Тип:** button (ref=e72)
- **Текст:** "Отправить" (generic, ref=e73)
- **Функция:** Отправка сообщения выбранному агенту
- **Расположение:** Под полем ввода сообщения

---

## Layout и Spacing

### Общая структура страницы
- **Максимальная ширина контента:** 100% (двухколоночный layout)
- **Отступы от краев:** 24px (desktop), 16px (tablet), 12px (mobile)
- **Отступ между Header и Main Content:** 24px
- **Отступ между Sidebar и Main Content:** 24px

### Разделение секций
- **Левая панель (список чатов):**
  - Ширина: 300px (desktop), 100% (mobile)
  - Padding: 16px
  - Border-right: 1px solid (разделитель)
  
- **Правая панель (область чата):**
  - Ширина: calc(100% - 300px) (desktop), 100% (mobile)
  - Padding: 24px
  - Min-height: 400px

---

## Компонентная карта страницы

### Компоненты для реализации

1. **ChatList** - список чатов
   - Props: `chats: Chat[]`, `onSelectChat: (chatId: string) => void`, `onNewChat: () => void`
   - Состояния: `selectedChatId: string | null`, `isLoading: boolean`

2. **ChatItem** - элемент списка чатов
   - Props: `chat: Chat`, `isSelected: boolean`, `onClick: () => void`
   - Состояния: `hover: boolean`

3. **ChatArea** - область чата
   - Props: `chat: Chat | null`, `agentId: string | null`, `onSendMessage: (message: string) => void`
   - Состояния: `isLoading: boolean`, `isSending: boolean`

4. **AgentSelector** - выбор агента
   - Props: `agents: Agent[]`, `selectedAgentId: string | null`, `onSelect: (agentId: string) => void`
   - Тип: Combobox (shadcn/ui)

5. **MessageInput** - поле ввода сообщения
   - Props: `placeholder: string`, `onSend: (message: string) => void`, `disabled: boolean`
   - Тип: Textarea (shadcn/ui)

6. **SendButton** - кнопка отправки
   - Props: `disabled: boolean`, `isLoading: boolean`, `onClick: () => void`
   - Тип: Button (shadcn/ui)

---

## Состояния компонентов и взаимодействия

### ChatList
- **Пустое состояние:** Показывается текст "Нет чатов"
- **Загрузка:** Skeleton loader для списка чатов
- **Ошибка:** Сообщение об ошибке загрузки

### ChatItem
- **Hover:** Подсветка фона
- **Selected:** Активный фон и border
- **Click:** Выбор чата и загрузка сообщений

### ChatArea
- **Пустое состояние:** Текст "Выберите чат или начните новый"
- **Загрузка сообщений:** Skeleton loader
- **Отправка сообщения:** Disabled состояние кнопки и поля ввода

### AgentSelector
- **Открыт:** Dropdown с опциями
- **Выбран:** Отображается выбранный агент
- **Пусто:** "Выберите агента ИИ"

---

## API спецификации

### Endpoints

#### GET /api/v1/test-chat/chats
Получение списка чатов для тестирования

**Response:**
```typescript
{
  chats: Array<{
    id: string;
    agentId: string | null;
    lastMessage: string;
    lastMessageTime: string; // ISO 8601
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
}
```

#### GET /api/v1/test-chat/chats/:chatId
Получение сообщений чата

**Response:**
```typescript
{
  chat: {
    id: string;
    agentId: string | null;
    messages: Array<{
      id: string;
      role: 'user' | 'assistant';
      content: string;
      createdAt: string;
    }>;
  };
}
```

#### POST /api/v1/test-chat/chats
Создание нового чата

**Request:**
```typescript
{
  agentId?: string;
}
```

**Response:**
```typescript
{
  chat: {
    id: string;
    agentId: string | null;
    messages: [];
  };
}
```

#### POST /api/v1/test-chat/chats/:chatId/messages
Отправка сообщения в чат

**Request:**
```typescript
{
  content: string;
  agentId: string;
}
```

**Response:**
```typescript
{
  message: {
    id: string;
    role: 'user';
    content: string;
    createdAt: string;
  };
  assistantMessage?: {
    id: string;
    role: 'assistant';
    content: string;
    createdAt: string;
  };
}
```

---

## Responsive Design

### Breakpoints
- **Mobile:** < 768px
  - Двухколоночный layout → одноколоночный
  - Левая панель скрывается, показывается кнопка для открытия
  - Правая панель занимает 100% ширины

- **Tablet:** 768px - 1024px
  - Левая панель: 250px
  - Правая панель: calc(100% - 250px)

- **Desktop:** > 1024px
  - Левая панель: 300px
  - Правая панель: calc(100% - 300px)

---

## Accessibility

### ARIA Labels
- ChatList: `aria-label="Список чатов"`
- ChatItem: `aria-label="Чат от {время}"`, `aria-selected={isSelected}`
- ChatArea: `aria-label="Область чата"`
- AgentSelector: `aria-label="Выберите агента ИИ"`
- MessageInput: `aria-label="Введите сообщение"`
- SendButton: `aria-label="Отправить сообщение"`

### Keyboard Navigation
- **Tab:** Переход между элементами
- **Enter:** Отправка сообщения (когда фокус на поле ввода)
- **Arrow Up/Down:** Навигация по списку чатов
- **Escape:** Закрытие dropdown выбора агента

---

## Валидация и обработка ошибок

### Валидация формы
- **AgentSelector:** Обязательное поле при отправке сообщения
- **MessageInput:** Минимум 1 символ, максимум 5000 символов

### Обработка ошибок
- **Ошибка загрузки чатов:** Toast notification с кнопкой "Повторить"
- **Ошибка отправки сообщения:** Toast notification с деталями ошибки
- **Ошибка выбора агента:** Валидационное сообщение под полем

---

## Схема данных

### Chat
```typescript
interface Chat {
  id: string;
  agentId: string | null;
  lastMessage: string;
  lastMessageTime: string;
  createdAt: string;
  updatedAt: string;
}
```

### Message
```typescript
interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}
```

### Agent
```typescript
interface Agent {
  id: string;
  name: string;
  isActive: boolean;
}
```

---

## Цветовая палитра

### Основные цвета
- **Background:** `#ffffff` (light), `#1a1a1a` (dark)
- **Border:** `#e5e7eb` (light), `#374151` (dark)
- **Text Primary:** `#111827` (light), `#f9fafb` (dark)
- **Text Secondary:** `#6b7280` (light), `#9ca3af` (dark)
- **Primary:** `#3b82f6` (blue)
- **Hover:** `#f3f4f6` (light), `#374151` (dark)
- **Selected:** `#eff6ff` (light), `#1e3a8a` (dark)

---

## Типографика

### Заголовки
- **H2 "Чаты":** `font-size: 24px`, `font-weight: 600`, `line-height: 1.5`

### Текст
- **Сообщение в списке:** `font-size: 14px`, `font-weight: 400`, `line-height: 1.5`
- **Время:** `font-size: 12px`, `font-weight: 400`, `color: text-secondary`
- **Placeholder:** `font-size: 14px`, `color: text-secondary`

---

## Иконки

### Используемые иконки
- **Новый чат:** Plus icon (Lucide)
- **Отправка:** Send icon (Lucide)

### Размеры
- **16px** для иконок в кнопках
- **20px** для иконок в списке

---

## Анимации и переходы

### Transitions
- **Hover на ChatItem:** `transition: background-color 0.2s ease`
- **Открытие dropdown:** `transition: opacity 0.2s ease, transform 0.2s ease`
- **Отправка сообщения:** Loading spinner с `animation: spin 1s linear infinite`

---

## Пустые состояния

### Нет чатов
- **Текст:** "У вас пока нет чатов. Создайте новый чат для тестирования."
- **Кнопка:** "Создать новый чат"

### Чат не выбран
- **Текст:** "Выберите чат или начните новый"
- **Форма:** Видима, но неактивна до выбора чата

---

## Производительность

### Оптимизации
- **Виртуализация списка чатов** при большом количестве (> 50)
- **Debounce** для поиска (300ms)
- **Lazy loading** сообщений при прокрутке
- **Optimistic updates** при отправке сообщения

---

## Безопасность

### Валидация
- **Sanitization** пользовательского ввода
- **Rate limiting** на отправку сообщений (10 сообщений в минуту)
- **Проверка прав доступа** к агенту перед отправкой

---

## Тестирование

### Unit Tests
- Компоненты ChatList, ChatItem, ChatArea
- Валидация формы
- Обработка ошибок

### Integration Tests
- Создание чата
- Отправка сообщения
- Получение ответа от агента

### E2E Tests
- Полный flow: создание чата → выбор агента → отправка сообщения → получение ответа

---

## Примеры кода

### ChatList Component
```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChatItem } from './ChatItem';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export const ChatList = ({ chats, selectedChatId, onSelectChat, onNewChat }: ChatListProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-2xl font-semibold">Чаты</h2>
        <Button onClick={onNewChat}>Новый чат</Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isSelected={chat.id === selectedChatId}
            onClick={() => onSelectChat(chat.id)}
          />
        ))}
      </div>
    </div>
  );
};
```

---

**Дата создания отчета:** 2025-01-26
**Версия:** 1.0

