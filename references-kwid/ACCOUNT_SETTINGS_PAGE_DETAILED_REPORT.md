# Детальный отчет по странице "Настройки аккаунта"

## URL
`https://aai.widgets.wearekwid.com/manage/1000373-worldwideservices/account-settings`

## Title (Заголовок страницы)
"Настройки аккаунта - GPT Агент"

---

## Общая структура страницы

### Header (Верхняя панель)
- **Глобальный поиск** (ref=e16)
- **Ссылка на тарифы** "30.10.2025" (ref=e18) → `/pricing`
- **Кнопка уведомлений** "Открыть уведомления 9" (ref=e171) - показывает количество непрочитанных уведомлений (9)
- **Меню пользователя** (ref=e24) - аватар пользователя "Admin"

### Sidebar (Боковая панель)
- Полная структура описана в `SIDEBAR_DETAILED_REPORT.md`
- Активный раздел: "Аккаунт" > "Настройки аккаунта"

### Main Content (Основной контент)

#### 1. Заголовок страницы
- **Heading** "Настройки аккаунта" (level=1, ref=e31)

#### 2. Раздел "Общие"

##### 2.1. Заголовок раздела
- **Heading** "Общие" (level=3, ref=e41)

##### 2.2. Настройка "Останавливать агентов ИИ при ответе человека"
- **Тип:** Switch (ref=e50)
- **Label:** "Останавливать агентов ИИ при ответе человека" (generic, ref=e51)
- **Описание:** "Если включено, агенты ИИ перестанут отвечать в этом чате после того, как человек отправит сообщение." (generic, ref=e53)
- **Состояние:** `checked` / `unchecked`
- **Функция:** Включение/выключение автоматической остановки агентов при ответе человека
- **Расположение:** Под заголовком раздела

#### 3. Кнопка "Сохранить изменения"
- **Тип:** button (ref=e56)
- **Текст:** "Сохранить изменения" (generic, ref=e57)
- **Функция:** Сохранение всех изменений настроек
- **Расположение:** Внизу страницы, справа

---

## Layout и Spacing

### Общая структура страницы
- **Максимальная ширина контента:** 800px (центрирован)
- **Отступы от краев:** 24px (desktop), 16px (tablet), 12px (mobile)
- **Отступ между Header и Main Content:** 24px
- **Отступ между Sidebar и Main Content:** 24px

### Разделение секций
- **Заголовок страницы:**
  - Margin-bottom: 24px
  
- **Раздел "Общие":**
  - Padding: 24px
  - Background: card background
  - Border-radius: 8px
  - Border: 1px solid border color
  - Margin-bottom: 24px

- **Switch настройка:**
  - Display: flex
  - Align-items: center
  - Gap: 12px
  - Margin-bottom: 8px

- **Описание:**
  - Margin-top: 4px
  - Margin-left: 44px (для выравнивания с label)
  - Font-size: 14px
  - Color: text-secondary

---

## Компонентная карта страницы

### Компоненты для реализации

1. **PageHeader** - заголовок страницы
   - Props: `title: string`
   - Тип: Heading (h1)

2. **SettingsSection** - секция настроек
   - Props: `title: string`, `children: ReactNode`
   - Тип: Card (shadcn/ui)

3. **SettingSwitch** - переключатель настройки
   - Props: `label: string`, `description?: string`, `checked: boolean`, `onChange: (checked: boolean) => void`
   - Тип: Switch (shadcn/ui) + Label

4. **SaveButton** - кнопка сохранения
   - Props: `onClick: () => void`, `isLoading: boolean`, `disabled: boolean`
   - Тип: Button (shadcn/ui)

---

## Состояния компонентов и взаимодействия

### SettingSwitch
- **Unchecked:** Switch выключен, серый цвет
- **Checked:** Switch включен, primary цвет
- **Hover:** Подсветка switch
- **Click:** Переключение состояния

### SaveButton
- **Default:** Активная кнопка
- **Loading:** Disabled, spinner внутри
- **Success:** Временное сообщение об успехе (toast)
- **Error:** Toast с ошибкой

---

## API спецификации

### Endpoints

#### GET /api/v1/account/settings
Получение настроек аккаунта

**Response:**
```typescript
{
  settings: {
    stopAiAgentsOnManualMessage: boolean;
    // другие настройки...
  };
}
```

#### PUT /api/v1/account/settings
Обновление настроек аккаунта

**Request:**
```typescript
{
  stopAiAgentsOnManualMessage?: boolean;
  // другие настройки...
}
```

**Response:**
```typescript
{
  settings: {
    stopAiAgentsOnManualMessage: boolean;
    // другие настройки...
  };
  message: string;
}
```

---

## Responsive Design

### Breakpoints
- **Mobile:** < 768px
  - Максимальная ширина: 100%
  - Padding: 16px
  - Switch: полная ширина

- **Tablet:** 768px - 1024px
  - Максимальная ширина: 600px
  - Padding: 20px

- **Desktop:** > 1024px
  - Максимальная ширина: 800px
  - Padding: 24px

---

## Accessibility

### ARIA Labels
- PageHeader: `aria-label="Настройки аккаунта"`
- SettingsSection: `aria-label="Общие настройки"`
- SettingSwitch: `aria-label="Останавливать агентов ИИ при ответе человека"`, `aria-checked={checked}`
- SaveButton: `aria-label="Сохранить изменения"`

### Keyboard Navigation
- **Tab:** Переход между элементами
- **Space/Enter:** Переключение switch, нажатие кнопки
- **Escape:** Отмена изменений (если реализовано)

---

## Валидация и обработка ошибок

### Валидация
- Все настройки валидируются на сервере
- Клиентская валидация не требуется (boolean значения)

### Обработка ошибок
- **Ошибка загрузки:** Toast notification с кнопкой "Повторить"
- **Ошибка сохранения:** Toast notification с деталями ошибки
- **Сетевые ошибки:** Retry механизм

---

## Схема данных

### AccountSettings
```typescript
interface AccountSettings {
  stopAiAgentsOnManualMessage: boolean;
  // другие настройки...
}
```

---

## Цветовая палитра

### Основные цвета
- **Background:** `#ffffff` (light), `#1a1a1a` (dark)
- **Card Background:** `#f9fafb` (light), `#111827` (dark)
- **Border:** `#e5e7eb` (light), `#374151` (dark)
- **Text Primary:** `#111827` (light), `#f9fafb` (dark)
- **Text Secondary:** `#6b7280` (light), `#9ca3af` (dark)
- **Primary:** `#3b82f6` (blue)
- **Switch Checked:** Primary color
- **Switch Unchecked:** `#9ca3af` (gray)

---

## Типографика

### Заголовки
- **H1 "Настройки аккаунта":** `font-size: 32px`, `font-weight: 700`, `line-height: 1.2`
- **H3 "Общие":** `font-size: 20px`, `font-weight: 600`, `line-height: 1.5`

### Текст
- **Label:** `font-size: 16px`, `font-weight: 500`, `line-height: 1.5`
- **Description:** `font-size: 14px`, `font-weight: 400`, `color: text-secondary`
- **Button:** `font-size: 16px`, `font-weight: 500`

---

## Иконки

### Используемые иконки
- Не используются на этой странице

---

## Анимации и переходы

### Transitions
- **Switch toggle:** `transition: background-color 0.2s ease, transform 0.2s ease`
- **Button hover:** `transition: background-color 0.2s ease`
- **Save success:** Toast notification с fade-in/fade-out

---

## Пустые состояния

### Нет настроек
- Не применимо (всегда есть хотя бы одна настройка)

---

## Производительность

### Оптимизации
- **Debounce** для сохранения (опционально, если auto-save)
- **Optimistic updates** при переключении switch
- **Кэширование** настроек в localStorage

---

## Безопасность

### Валидация
- **Проверка прав доступа** к настройкам аккаунта
- **CSRF защита** для PUT запросов
- **Rate limiting** на обновление настроек

---

## Тестирование

### Unit Tests
- Компоненты SettingSwitch, SaveButton
- Валидация данных
- Обработка ошибок

### Integration Tests
- Загрузка настроек
- Сохранение настроек
- Обновление switch

### E2E Tests
- Полный flow: загрузка → изменение → сохранение

---

## Примеры кода

### SettingSwitch Component
```typescript
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SettingSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const SettingSwitch = ({ label, description, checked, onChange }: SettingSwitchProps) => {
  return (
    <div className="flex items-center gap-3">
      <Switch
        id={label}
        checked={checked}
        onCheckedChange={onChange}
        aria-label={label}
      />
      <div className="flex flex-col">
        <Label htmlFor={label} className="font-medium">
          {label}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};
```

---

**Дата создания отчета:** 2025-01-26
**Версия:** 1.0

