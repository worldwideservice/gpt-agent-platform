# 🎨 Компонентная библиотека GPT Agent

## 📦 Доступные компоненты

### 🔧 Базовые компоненты (существующие)
- **Button** - кнопки с вариантами стилей
- **Card** - карточки с заголовком, контентом и футером
- **Input** - поля ввода текста
- **Select** - выпадающие списки
- **Textarea** - многострочные поля ввода
- **Table** - таблицы с сортировкой
- **Modal** - модальные окна
- **Badge** - бейджи для статусов
- **Tabs** - табы для навигации

### 🎨 Shadcn UI компоненты
- **Button** - расширенная кнопка с вариантами
- **Card** - карточка с header/content/footer
- **Input** - стилизованное поле ввода
- **Textarea** - стилизованное многострочное поле
- **Badge** - бейдж с вариантами цветов
- **Select** - стилизованный селект
- **Table** - полная таблица с header/body/footer

### ✨ Magic UI компоненты (21st.dev)
- **Modal** - модальное окно с backdrop
- **Tabs** - табы с контекстом
- **Dropdown** - выпадающее меню
- **Tooltip** - всплывающие подсказки
- **Progress** - прогресс-бар
- **Spinner** - индикатор загрузки

---

## 🚀 Использование компонентов

### Импорт всех компонентов
```typescript
import { Button, Card, Modal, Tabs } from '@/components/ui'
```

### Импорт конкретной библиотеки
```typescript
// Только Shadcn
import { Button, Card } from '@/components/ui/shadcn'

// Только Magic
import { Modal, Tooltip } from '@/components/ui/magic'
```

### Импорт отдельного компонента
```typescript
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/magic/modal'
```

---

## 💡 Примеры использования

### Shadcn Button
```typescript
import { Button } from '@/components/ui/shadcn'

<Button variant="default" size="lg">
  Primary Button
</Button>

<Button variant="outline" size="sm">
  Outline Button
</Button>

<Button variant="destructive">
  Delete
</Button>
```

### Magic Modal
```typescript
import { Modal } from '@/components/ui/magic'

const [isOpen, setIsOpen] = useState(false)

<Modal 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Создать агента"
  size="lg"
>
  <p>Содержимое модального окна</p>
</Modal>
```

### Magic Tabs
```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/magic'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Настройки</TabsTrigger>
    <TabsTrigger value="tab2">Интеграции</TabsTrigger>
  </TabsList>
  
  <TabsContent value="tab1">
    Содержимое первой вкладки
  </TabsContent>
  
  <TabsContent value="tab2">
    Содержимое второй вкладки
  </TabsContent>
</Tabs>
```

### Magic Tooltip
```typescript
import { Tooltip } from '@/components/ui/magic'

<Tooltip content="Это подсказка" side="top">
  <Button>Наведите курсор</Button>
</Tooltip>
```

### Magic Progress
```typescript
import { Progress } from '@/components/ui/magic'

<Progress 
  value={75} 
  max={100} 
  showLabel 
  size="lg" 
/>
```

### Magic Spinner
```typescript
import { Spinner } from '@/components/ui/magic'

<Spinner size="lg" color="primary" />
```

---

## 🎯 Выбор компонентов для задач

### Для форм:
- **Input** (Shadcn) - поля ввода
- **Textarea** (Shadcn) - многострочный ввод
- **Select** (Shadcn) - выпадающие списки
- **Button** (Shadcn) - кнопки отправки

### Для модальных окон:
- **Modal** (Magic) - с backdrop и анимацией

### Для навигации:
- **Tabs** (Magic) - с контекстом
- **Dropdown** (Magic) - выпадающие меню

### Для обратной связи:
- **Tooltip** (Magic) - подсказки
- **Progress** (Magic) - прогресс
- **Spinner** (Magic) - загрузка
- **Badge** (Shadcn) - статусы

### Для данных:
- **Table** (Shadcn) - таблицы
- **Card** (Shadcn) - карточки

---

## 🔧 Настройка и кастомизация

### CSS переменные
Все компоненты используют CSS переменные для цветов:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}
```

### Tailwind классы
Компоненты используют утилиту `cn()` для объединения классов:

```typescript
import { cn } from "@/lib/utils"

className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)}
```

---

## 📚 Документация по MCP серверам

### Shadcn MCP
- **Назначение:** Генерация Shadcn UI компонентов
- **Команды:** `npx @shadcn/mcp-server`
- **Возможности:** Создание компонентов по шаблонам

### Magic MCP (21st.dev)
- **Назначение:** Генерация Magic UI компонентов
- **Команды:** `npx @21st-dev/magic-mcp`
- **Возможности:** Создание интерактивных компонентов

---

## 🎨 Дизайн-система

### Цветовая палитра
- **Primary:** Blue (#3B82F6)
- **Secondary:** Gray (#6B7280)
- **Success:** Green (#10B981)
- **Warning:** Yellow (#F59E0B)
- **Error:** Red (#EF4444)

### Размеры
- **sm:** 0.875rem (14px)
- **md:** 1rem (16px)
- **lg:** 1.125rem (18px)
- **xl:** 1.25rem (20px)

### Отступы
- **xs:** 0.25rem (4px)
- **sm:** 0.5rem (8px)
- **md:** 1rem (16px)
- **lg:** 1.5rem (24px)
- **xl:** 2rem (32px)

---

## ✅ Готово к использованию!

**Всего компонентов:** 20+  
**Библиотек:** 3 (Base, Shadcn, Magic)  
**MCP серверов:** 9 (включая Shadcn и Magic)

**Теперь вы можете выбирать компоненты и говорить какие нужно использовать! 🎉**
