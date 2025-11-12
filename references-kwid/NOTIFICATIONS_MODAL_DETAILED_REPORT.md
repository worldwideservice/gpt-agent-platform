# Детальный отчет по уведомлениям (Модальное окно)

## Расположение
В Header (верхняя панель), справа, рядом с меню пользователя

## Элемент активации
- **Тип:** button (ref=e187, e171)
- **ARIA Label:** "Открыть уведомления 9"
- **Содержимое:**
  - **Иконка:** img (ref=e189, e173) - иконка уведомлений (Bell icon)
  - **Бейдж:** generic (ref=e194, e178) - показывает количество непрочитанных уведомлений ("9")
- **Функция:** Открытие/закрытие модального окна уведомлений
- **Состояние:** `active` когда модальное окно открыто

---

## Структура Модального окна

### 1. Заголовок модального окна
- **Тип:** heading (предположительно)
- **Текст:** "Уведомления" (предположительно)
- **Расположение:** Вверху модального окна
- **Функция:** Заголовок списка уведомлений

### 2. Список уведомлений
- **Тип:** list (предположительно)
- **Структура:** listitem для каждого уведомления
- **Элементы уведомления:**
  - **Тип уведомления** (иконка)
  - **Заголовок** уведомления
  - **Текст** уведомления
  - **Время** создания
  - **Статус:** прочитано/непрочитано
  - **Действия:** кнопки (если есть)

### 3. Пустое состояние
- **Текст:** "У вас нет уведомлений" (предположительно)
- **Отображается:** Когда список уведомлений пуст

### 4. Кнопки действий
- **"Отметить все как прочитанные"** (предположительно)
- **"Очистить все"** (предположительно)
- **"Настройки уведомлений"** (предположительно)

---

## Layout и Spacing

### Модальное окно Container
- **Тип:** dialog (ref указывает на dialog элемент)
- **Позиционирование:** Fixed, центрирован на экране
- **Ширина:** 400px (desktop), 90% (mobile)
- **Max-height:** 600px
- **Background:** Modal background с overlay
- **Border-radius:** 12px
- **Box-shadow:** Modal shadow
- **Z-index:** 2000 (выше dropdown меню)

### Overlay
- **Background:** rgba(0, 0, 0, 0.5) - затемнение фона
- **Позиционирование:** Fixed, покрывает весь экран
- **Z-index:** 1999

### Элементы внутри
- **Header:**
  - Padding: 16px
  - Border-bottom: 1px solid border color
  - Display: flex
  - Justify-content: space-between
  - Align-items: center

- **Список уведомлений:**
  - Max-height: 400px
  - Overflow-y: auto
  - Padding: 8px

- **Notification Item:**
  - Padding: 12px
  - Border-bottom: 1px solid border color (последний без border)
  - Cursor: pointer
  - Hover: background highlight

---

## Состояния компонентов и взаимодействия

### Кнопка уведомлений
- **Default:** Иконка + бейдж с количеством
- **Active:** Подсветка, когда модальное окно открыто
- **Hover:** Подсветка фона
- **Click:** Открытие/закрытие модального окна

### Бейдж
- **Отображается:** Когда есть непрочитанные уведомления
- **Скрывается:** Когда все уведомления прочитаны
- **Цвет:** Primary color (красный для привлечения внимания)
- **Размер:** Маленький круг с числом

### Модальное окно
- **Закрыто:** Не видно
- **Открыто:** Видно, overlay затемняет фон
- **Анимация открытия:** Fade-in + scale-up
- **Анимация закрытия:** Fade-out + scale-down

### Notification Item
- **Непрочитано:** Подсветка фона, жирный шрифт для заголовка
- **Прочитано:** Обычный фон, обычный шрифт
- **Hover:** Подсветка фона
- **Click:** Открытие деталей уведомления или выполнение действия

---

## Компонентная карта

### Компоненты для реализации

1. **NotificationsButton** - кнопка активации
   - Props: `unreadCount: number`, `onClick: () => void`, `isOpen: boolean`
   - Тип: Button + Badge (shadcn/ui)

2. **NotificationsModal** - модальное окно
   - Props: `isOpen: boolean`, `onClose: () => void`, `notifications: Notification[]`
   - Тип: Dialog (shadcn/ui)

3. **NotificationList** - список уведомлений
   - Props: `notifications: Notification[]`, `onNotificationClick: (id: string) => void`
   - Тип: Custom component

4. **NotificationItem** - элемент уведомления
   - Props: `notification: Notification`, `onClick: () => void`, `onMarkAsRead: () => void`
   - Тип: Custom component

5. **EmptyNotifications** - пустое состояние
   - Props: None
   - Тип: EmptyState component

---

## API спецификации

### Endpoints

#### GET /api/v1/notifications
Получение списка уведомлений

**Query Parameters:**
- `page?: number` (default: 1)
- `limit?: number` (default: 20)
- `unreadOnly?: boolean` (default: false)

**Response:**
```typescript
{
  notifications: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    actionUrl?: string;
    metadata?: Record<string, any>;
  }>;
  total: number;
  unreadCount: number;
}
```

#### PUT /api/v1/notifications/:id/read
Отметить уведомление как прочитанное

**Response:**
```typescript
{
  notification: {
    id: string;
    isRead: true;
  };
}
```

#### PUT /api/v1/notifications/read-all
Отметить все уведомления как прочитанные

**Response:**
```typescript
{
  message: string;
  updatedCount: number;
}
```

#### DELETE /api/v1/notifications/:id
Удалить уведомление

**Response:**
```typescript
{
  message: string;
}
```

#### DELETE /api/v1/notifications
Удалить все уведомления

**Response:**
```typescript
{
  message: string;
  deletedCount: number;
}
```

---

## Responsive Design

### Breakpoints
- **Mobile:** < 768px
  - Модальное окно: 90% ширины экрана
  - Max-height: 80vh
  - Full-screen на очень маленьких экранах

- **Desktop:** > 768px
  - Модальное окно: 400px ширина
  - Max-height: 600px

---

## Accessibility

### ARIA Labels
- NotificationsButton: `aria-label="Открыть уведомления {count}"`, `aria-expanded={isOpen}`
- NotificationsModal: `aria-label="Уведомления"`, `role="dialog"`
- NotificationItem: `aria-label="{title}"`, `aria-read={isRead}`
- Badge: `aria-label="{count} непрочитанных уведомлений"`

### Keyboard Navigation
- **Enter/Space:** Открытие/закрытие модального окна
- **Escape:** Закрытие модального окна
- **Arrow Up/Down:** Навигация по списку уведомлений
- **Tab:** Переход между элементами внутри модального окна

---

## Валидация и обработка ошибок

### Валидация
- Не требуется (только чтение данных)

### Обработка ошибок
- **Ошибка загрузки:** Toast notification с кнопкой "Повторить"
- **Ошибка обновления:** Toast notification с деталями ошибки
- **Сетевые ошибки:** Retry механизм

---

## Схема данных

### Notification
```typescript
interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}
```

---

## Цветовая палитра

### Основные цвета
- **Modal Background:** `#ffffff` (light), `#1a1a1a` (dark)
- **Overlay:** `rgba(0, 0, 0, 0.5)`
- **Border:** `#e5e7eb` (light), `#374151` (dark)
- **Text Primary:** `#111827` (light), `#f9fafb` (dark)
- **Text Secondary:** `#6b7280` (light), `#9ca3af` (dark)
- **Badge Background:** `#ef4444` (red)
- **Badge Text:** `#ffffff` (white)
- **Unread Background:** `#eff6ff` (light), `#1e3a8a` (dark)
- **Hover Background:** `#f3f4f6` (light), `#374151` (dark)

### Типы уведомлений
- **Info:** `#3b82f6` (blue)
- **Success:** `#10b981` (green)
- **Warning:** `#f59e0b` (yellow)
- **Error:** `#ef4444` (red)

---

## Типографика

### Заголовки
- **Modal Title:** `font-size: 20px`, `font-weight: 600`, `line-height: 1.5`
- **Notification Title:** `font-size: 16px`, `font-weight: 600` (unread), `font-weight: 400` (read)

### Текст
- **Notification Message:** `font-size: 14px`, `font-weight: 400`, `line-height: 1.5`
- **Time:** `font-size: 12px`, `font-weight: 400`, `color: text-secondary`
- **Badge:** `font-size: 12px`, `font-weight: 600`

---

## Иконки

### Используемые иконки
- **Notifications Button:** Bell icon (Lucide)
- **Info:** Info icon (Lucide)
- **Success:** CheckCircle icon (Lucide)
- **Warning:** AlertTriangle icon (Lucide)
- **Error:** XCircle icon (Lucide)
- **Close:** X icon (Lucide)

### Размеры
- **16px** для иконок в кнопке
- **20px** для иконок типов уведомлений
- **16px** для иконок действий

---

## Анимации и переходы

### Transitions
- **Modal открытие:** `transition: opacity 0.2s ease, transform 0.2s ease`
- **Notification Item hover:** `transition: background-color 0.2s ease`
- **Badge обновление:** Pulse animation при новом уведомлении
- **Mark as read:** Fade-out анимация для непрочитанного состояния

---

## Пустые состояния

### Нет уведомлений
- **Текст:** "У вас нет уведомлений"
- **Иконка:** Bell icon (outline)
- **Стиль:** Центрирован, серый цвет

---

## Real-time обновления

### WebSocket/SSE
- **Подключение:** При открытии модального окна
- **События:** Новое уведомление, обновление статуса
- **Обновление:** Автоматическое обновление списка и счетчика

---

## Производительность

### Оптимизации
- **Виртуализация списка** при большом количестве уведомлений (> 50)
- **Lazy loading** уведомлений при прокрутке
- **Debounce** для частых обновлений
- **Кэширование** уведомлений в localStorage

---

## Безопасность

### Валидация
- **Проверка прав доступа** к уведомлениям пользователя
- **Sanitization** HTML контента в уведомлениях
- **CSRF защита** для PUT/DELETE запросов

---

## Тестирование

### Unit Tests
- Компоненты NotificationsButton, NotificationItem
- Обработка кликов
- Обновление статуса

### Integration Tests
- Загрузка уведомлений
- Отметка как прочитанное
- Удаление уведомления

### E2E Tests
- Полный flow: открытие → просмотр → отметка как прочитанное → закрытие

---

## Примеры кода

### NotificationsButton Component
```typescript
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationsButtonProps {
  unreadCount: number;
  onClick: () => void;
  isOpen: boolean;
}

export const NotificationsButton = ({ unreadCount, onClick, isOpen }: NotificationsButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label={`Открыть уведомления ${unreadCount}`}
      aria-expanded={isOpen}
      className="relative"
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          variant="destructive"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
};
```

---

**Дата создания отчета:** 2025-01-26
**Версия:** 1.0

