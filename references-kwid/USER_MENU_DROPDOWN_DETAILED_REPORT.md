# Детальный отчет по меню пользователя (Dropdown)

## Расположение
В Header (верхняя панель), справа

## Элемент активации
- **Тип:** button (ref=e24)
- **Содержимое:** img "Аватар Admin" (ref=e25)
- **Функция:** Открытие/закрытие dropdown меню пользователя
- **ARIA:** `aria-label="Меню пользователя"`

---

## Структура Dropdown

### 1. Информация о пользователе
- **Тип:** generic (ref=e196)
- **Содержимое:**
  - **Аватар:** img (ref=e197)
  - **Имя:** "Admin" (generic, ref=e199)
- **Расположение:** Вверху dropdown
- **Функция:** Отображение текущего пользователя

### 2. Переключение темы

#### 2.1. Кнопка "Включить светлый режим"
- **Тип:** button (ref=e202)
- **Содержимое:** img (ref=e203) - иконка светлой темы
- **Функция:** Переключение на светлую тему
- **Состояние:** Активна, если текущая тема = light

#### 2.2. Кнопка "Включить темный режим"
- **Тип:** button (ref=e205)
- **Содержимое:** img (ref=e206) - иконка темной темы
- **Функция:** Переключение на темную тему
- **Состояние:** Активна, если текущая тема = dark

#### 2.3. Кнопка "Включить системный режим"
- **Тип:** button (ref=e208)
- **Содержимое:** img (ref=e209) - иконка системной темы
- **Функция:** Переключение на системную тему (следует настройкам ОС)
- **Состояние:** Активна, если текущая тема = system

### 3. Кнопка "Выйти"
- **Тип:** button (ref=e213)
- **Содержимое:**
  - **Иконка:** img (ref=e214) - иконка выхода
  - **Текст:** "Выйти" (generic, ref=e217)
- **Функция:** Выход из аккаунта
- **Расположение:** Внизу dropdown
- **Стиль:** Вероятно, красный цвет для предупреждения

---

## Layout и Spacing

### Dropdown Container
- **Позиционирование:** Absolute, справа от кнопки активации
- **Ширина:** 200px (примерно)
- **Padding:** 8px
- **Background:** Card background
- **Border:** 1px solid border color
- **Border-radius:** 8px
- **Box-shadow:** Dropdown shadow
- **Z-index:** 1000 (выше основного контента)

### Элементы внутри
- **User Info:**
  - Padding: 12px
  - Border-bottom: 1px solid border color
  - Margin-bottom: 8px

- **Theme Switcher:**
  - Display: flex
  - Flex-direction: column
  - Gap: 4px
  - Padding: 8px 0

- **Logout Button:**
  - Padding: 12px
  - Border-top: 1px solid border color
  - Margin-top: 8px

---

## Состояния компонентов и взаимодействия

### Dropdown
- **Закрыт:** Не виден
- **Открыт:** Виден, overlay затемняет фон
- **Анимация открытия:** Fade-in + slide-down
- **Анимация закрытия:** Fade-out + slide-up

### Theme Buttons
- **Активная тема:** Подсветка фона или border
- **Hover:** Подсветка фона
- **Click:** Переключение темы, закрытие dropdown

### Logout Button
- **Hover:** Подсветка фона (красный оттенок)
- **Click:** Подтверждение выхода (модальное окно или toast), затем редирект на страницу входа

---

## Компонентная карта

### Компоненты для реализации

1. **UserMenu** - основной компонент dropdown
   - Props: `user: User`, `currentTheme: 'light' | 'dark' | 'system'`, `onThemeChange: (theme: string) => void`, `onLogout: () => void`
   - Тип: DropdownMenu (shadcn/ui)

2. **UserInfo** - информация о пользователе
   - Props: `user: User`
   - Тип: Custom component

3. **ThemeSwitcher** - переключатель темы
   - Props: `currentTheme: string`, `onChange: (theme: string) => void`
   - Тип: RadioGroup (shadcn/ui) или отдельные кнопки

4. **LogoutButton** - кнопка выхода
   - Props: `onClick: () => void`
   - Тип: Button (shadcn/ui)

---

## API спецификации

### Endpoints

#### POST /api/v1/auth/logout
Выход из аккаунта

**Request:**
```typescript
// Пустое тело или CSRF token
```

**Response:**
```typescript
{
  message: string;
}
```

#### PUT /api/v1/user/preferences/theme
Обновление темы пользователя

**Request:**
```typescript
{
  theme: 'light' | 'dark' | 'system';
}
```

**Response:**
```typescript
{
  theme: 'light' | 'dark' | 'system';
}
```

---

## Responsive Design

### Breakpoints
- **Mobile:** < 768px
  - Dropdown: полная ширина экрана (drawer)
  - Позиционирование: снизу экрана

- **Desktop:** > 768px
  - Dropdown: фиксированная ширина 200px
  - Позиционирование: справа от кнопки

---

## Accessibility

### ARIA Labels
- UserMenu: `aria-label="Меню пользователя"`, `aria-expanded={isOpen}`
- Theme Buttons: `aria-label="Включить {theme} режим"`, `aria-pressed={isActive}`
- Logout Button: `aria-label="Выйти из аккаунта"`

### Keyboard Navigation
- **Enter/Space:** Открытие/закрытие dropdown
- **Arrow Up/Down:** Навигация по элементам
- **Escape:** Закрытие dropdown
- **Tab:** Переход между элементами внутри dropdown

---

## Валидация и обработка ошибок

### Валидация
- Не требуется (только действия)

### Обработка ошибок
- **Ошибка смены темы:** Toast notification
- **Ошибка выхода:** Toast notification с кнопкой "Повторить"

---

## Схема данных

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
```

### Theme
```typescript
type Theme = 'light' | 'dark' | 'system';
```

---

## Цветовая палитра

### Основные цвета
- **Dropdown Background:** `#ffffff` (light), `#1a1a1a` (dark)
- **Border:** `#e5e7eb` (light), `#374151` (dark)
- **Text Primary:** `#111827` (light), `#f9fafb` (dark)
- **Hover Background:** `#f3f4f6` (light), `#374151` (dark)
- **Active Theme:** Primary color background
- **Logout Button:** `#ef4444` (red) на hover

---

## Типографика

### Текст
- **User Name:** `font-size: 16px`, `font-weight: 500`
- **Button Text:** `font-size: 14px`, `font-weight: 400`

---

## Иконки

### Используемые иконки
- **Light Theme:** Sun icon (Lucide)
- **Dark Theme:** Moon icon (Lucide)
- **System Theme:** Monitor icon (Lucide)
- **Logout:** LogOut icon (Lucide)

### Размеры
- **16px** для всех иконок

---

## Анимации и переходы

### Transitions
- **Dropdown открытие:** `transition: opacity 0.2s ease, transform 0.2s ease`
- **Button hover:** `transition: background-color 0.2s ease`
- **Theme switch:** Instant (без анимации)

---

## Производительность

### Оптимизации
- **Lazy loading** dropdown контента
- **Кэширование** темы в localStorage
- **Debounce** для частых переключений темы (если нужно)

---

## Безопасность

### Валидация
- **CSRF защита** для logout запроса
- **Проверка сессии** перед выходом
- **Очистка токенов** при выходе

---

## Тестирование

### Unit Tests
- Компоненты UserMenu, ThemeSwitcher, LogoutButton
- Переключение темы
- Обработка logout

### Integration Tests
- Открытие/закрытие dropdown
- Смена темы и сохранение в localStorage
- Выход из аккаунта

### E2E Tests
- Полный flow: открытие меню → смена темы → выход

---

## Примеры кода

### UserMenu Component
```typescript
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LogoutButton } from './LogoutButton';

interface UserMenuProps {
  user: User;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onLogout: () => void;
}

export const UserMenu = ({ user, currentTheme, onThemeChange, onLogout }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full"
          aria-label="Меню пользователя"
          aria-expanded={isOpen}
        >
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 border-b">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
            </Avatar>
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        </div>
        <ThemeSwitcher
          currentTheme={currentTheme}
          onChange={onThemeChange}
        />
        <div className="border-t">
          <LogoutButton onClick={onLogout} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

---

**Дата создания отчета:** 2025-01-26
**Версия:** 1.0

