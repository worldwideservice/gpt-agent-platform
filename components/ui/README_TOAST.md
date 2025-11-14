# Toast System - Документация

## Обзор
Унифицированная система уведомлений (toast) согласно KWID референсу.

## Доступные варианты

### Success (Успех)
- Цвет: Зеленый
- Иконка: CheckCircle (галочка)
- Использование: Успешные операции

```typescript
pushToast({
  title: 'Успешно!',
  description: 'Данные сохранены',
  variant: 'success',
})
```

### Error (Ошибка)
- Цвет: Красный
- Иконка: XCircle (крестик)
- Использование: Ошибки и неудачные операции

```typescript
pushToast({
  title: 'Ошибка',
  description: 'Не удалось сохранить данные',
  variant: 'error',
})
```

### Warning (Предупреждение)
- Цвет: Оранжевый
- Иконка: AlertTriangle (треугольник с восклицательным знаком)
- Использование: Предупреждения

```typescript
pushToast({
  title: 'Внимание',
  description: 'Срок действия подписки истекает через 3 дня',
  variant: 'warning',
})
```

### Info (Информация)
- Цвет: Синий
- Иконка: Info (круг с буквой i)
- Использование: Информационные сообщения

```typescript
pushToast({
  title: 'Информация',
  description: 'Обновление доступно',
  variant: 'info',
})
```

### Default (По умолчанию)
- Цвет: Белый/серый
- Иконка: Нет
- Использование: Нейтральные сообщения

```typescript
pushToast({
  title: 'Сообщение',
  description: 'Операция выполнена',
  variant: 'default', // или не указывать variant
})
```

## Использование

### Импорт
```typescript
import { useToast } from '@/components/ui'
```

### В компоненте
```typescript
const { push: pushToast } = useToast()

// Показать уведомление
pushToast({
  title: 'Заголовок',
  description: 'Описание (опционально)',
  variant: 'success', // 'success' | 'error' | 'warning' | 'info' | 'default'
  duration: 4000, // Опционально, по умолчанию 4000ms
})
```

## Особенности

- **Позиционирование**: Верхний правый угол экрана
- **Анимация**: Плавное появление справа и исчезновение
- **Автозакрытие**: По умолчанию через 4 секунды
- **Ручное закрытие**: Кнопка X в правом верхнем углу каждого toast
- **Доступность**: Полная поддержка aria-атрибутов для screen readers

## Архитектура

### Компоненты
1. **toast-context.tsx** - Context и хук useToast
2. **toast-item.tsx** - Отдельный toast элемент с иконками
3. **toast-viewport.tsx** - Контейнер для отображения toast уведомлений

### Удаленные файлы
Для унификации были удалены следующие неиспользуемые файлы:
- `hooks/use-toast.ts` (Radix UI версия)
- `components/ui/toast.tsx` (Radix UI версия)
- `components/ui/toaster.tsx`
- `components/ui/sonner.tsx`

## Примеры использования

### Login Success
```typescript
pushToast({
  title: 'Вход выполнен! ✅',
  description: `Добро пожаловать, ${email}!`,
  variant: 'success',
})
```

### API Error
```typescript
pushToast({
  title: 'Ошибка входа',
  description: 'Неверный email или пароль',
  variant: 'error',
})
```

### Warning
```typescript
pushToast({
  title: 'Внимание',
  description: 'Некоторые поля не заполнены',
  variant: 'warning',
})
```

### Info
```typescript
pushToast({
  title: 'Новая версия',
  description: 'Доступна новая версия приложения',
  variant: 'info',
})
```
