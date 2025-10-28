# 🎯 Cursor Rules для GPT Agent

## ✅ Что было сделано

### 1. Установлены зависимости проекта
```bash
npm install
```

### 2. Создан файл `.cursorrules`
Добавлены оптимизированные правила для работы Cursor IDE с вашим проектом.

Источник: [cursor.directory](https://cursor.directory/)

---

## 📋 Включенные правила

### Технологический стек
- **Next.js 14+** с App Router
- **React 18** с Server Components  
- **TypeScript** - строгая типизация (БЕЗ `any`)
- **Tailwind CSS** - только Tailwind для стилей
- **Lucide React** - иконки

### Основные принципы кода

#### TypeScript
- ❌ НИКОГДА не используйте тип `any`
- ✅ Всегда явные типы для props, state, функций
- ✅ Используйте `import type` когда возможно
- ✅ Экспортируйте типы с компонентами

#### Next.js
- ✅ App Router (НЕ Pages Router)
- ✅ Server Components по умолчанию
- ✅ `'use client'` только при необходимости
- ✅ `metadata` или `generateMetadata` на каждой странице
- ✅ Next.js `Image` компонент для всех изображений

#### React
- ✅ `const` для компонентов (НЕ `function`)
- ✅ Named exports (НЕ default)
- ✅ Один компонент на файл
- ✅ PascalCase для имен файлов компонентов
- ✅ Префикс `handle` для обработчиков событий

#### Tailwind CSS
- ✅ ТОЛЬКО Tailwind классы
- ❌ НЕ inline styles (`style={{}}`)
- ✅ `cn()` для условных классов

#### Организация импортов
1. React и Next.js
2. Сторонние библиотеки
3. Локальные компоненты
4. Type imports
5. Утилиты

#### Async операции
- ✅ `async/await` (НЕ `.then()`)
- ✅ Всегда `try/catch` блоки
- ✅ Loading состояния
- ✅ User-friendly ошибки

#### Accessibility
- ✅ `aria-label` для иконок
- ✅ `role` для кастомных элементов
- ✅ `tabIndex={0}` для интерактивных элементов
- ✅ Обработка `Enter` и `Space` клавиш
- ✅ Семантический HTML

### Именование

```typescript
// Components
UserProfile.tsx         // PascalCase

// Functions/Variables  
const getUserData       // camelCase
const handleClick       // handle + CamelCase

// Constants
const API_ENDPOINT      // UPPER_SNAKE_CASE

// Types/Interfaces
interface UserData      // PascalCase

// Props callbacks
onClick, onSubmit       // on + CamelCase
```

---

## 🎨 Стилизация проекта

### Цветовая схема
```typescript
// Primary (основной)
className="bg-primary-600 text-primary-600"

// Success (успех)
className="bg-green-600 text-green-600"

// Warning (предупреждение)  
className="bg-yellow-600 text-yellow-600"

// Danger (опасность)
className="bg-red-600 text-red-600"

// Gray (нейтральный)
className="bg-gray-50 text-gray-900"
```

### Иконки (Lucide React)
```typescript
import { User, Settings, Search } from 'lucide-react'

<User className="w-5 h-5" />
<Settings className="w-5 h-5 text-gray-600" />
```

### Условные классы
```typescript
import { cn } from '@/lib/utils'

<button
  className={cn(
    'px-4 py-2 rounded-lg',
    isActive && 'bg-primary-600 text-white',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
/>
```

---

## 📁 Структура компонентов

### Правильная структура компонента

```typescript
import { useState } from 'react'
import { User } from 'lucide-react'

import { Button } from '@/components/ui/Button'

import type { UserData } from '@/types'

import { cn } from '@/lib/utils'

interface UserProfileProps {
  user: UserData
  onUpdate: (data: UserData) => void
}

export const UserProfile = ({ user, onUpdate }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <User className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold">{user.name}</h2>
      </div>
      <Button onClick={handleEdit}>Edit Profile</Button>
    </div>
  )
}
```

### Server Component
```typescript
// app/users/page.tsx
const UsersPage = async () => {
  const users = await fetchUsers()
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

export default UsersPage
```

### Client Component
```typescript
// components/UserCard.tsx
'use client'

import { useState } from 'react'

interface UserCardProps {
  user: User
}

export const UserCard = ({ user }: UserCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      {/* ... */}
    </div>
  )
}
```

---

## 🚀 Примеры кода

### Fetch с обработкой ошибок

```typescript
const fetchData = async () => {
  setLoading(true)
  setError(null)
  
  try {
    const response = await fetch('/api/data')
    
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    
    const data = await response.json()
    setData(data)
  } catch (error) {
    const message = error instanceof Error 
      ? error.message 
      : 'Unknown error'
    setError(message)
    console.error('Fetch error:', error)
  } finally {
    setLoading(false)
  }
}
```

### Форма с валидацией

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
})

type FormData = z.infer<typeof schema>

export const LoginForm = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await login(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register('email')} 
        placeholder="Email"
        className="w-full px-4 py-2 border rounded-lg"
      />
      {errors.email && (
        <span className="text-sm text-red-600">
          {errors.email.message}
        </span>
      )}
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Custom Hook

```typescript
export const useLocalStorage = <T,>(
  key: string, 
  initialValue: T
) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue)
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  return [value, setStoredValue] as const
}
```

### Context Provider

```typescript
import { createContext, useContext, type ReactNode } from 'react'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    try {
      const userData = await authenticateUser(email, password)
      setUser(userData)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

---

## 🎓 Как использовать Cursor Rules

### 1. Автоматическое применение
Cursor IDE автоматически считывает файл `.cursorrules` и применяет правила при:
- Генерации кода
- Автодополнении
- Рефакторинге
- Объяснении кода

### 2. В чате Cursor
Когда вы пишете промпт в Cursor Chat, AI будет следовать правилам из `.cursorrules`:

```
Промпт: "Создай компонент карточки пользователя"

✅ Cursor создаст:
- TypeScript компонент
- С правильной типизацией
- Используя Tailwind CSS
- С accessibility атрибутами
- Named export
- Следуя всем правилам проекта
```

### 3. При редактировании
При использовании `Cmd+K` (редактирование кода), Cursor будет:
- Следовать стилю проекта
- Использовать правильные импорты
- Применять TypeScript типы
- Использовать Tailwind классы

---

## 📊 Проверка правил

### Команды проекта
```bash
# Проверка TypeScript
npm run build

# Проверка ESLint
npm run lint

# Запуск в dev режиме
npm run dev
```

### Что проверять при code review

#### ✅ TypeScript
- [ ] Нет использования `any`
- [ ] Все props типизированы
- [ ] Используется `import type`

#### ✅ React
- [ ] Компоненты через `const`
- [ ] Named exports
- [ ] Правильные имена обработчиков

#### ✅ Next.js
- [ ] Server Components где возможно
- [ ] Есть metadata на страницах
- [ ] Используется Next Image

#### ✅ Styling
- [ ] Только Tailwind классы
- [ ] Нет inline styles
- [ ] Используется `cn()` для условий

#### ✅ Accessibility
- [ ] aria-label на иконках
- [ ] Семантический HTML
- [ ] Keyboard navigation

---

## 🔄 Обновление правил

Если нужно обновить правила:

1. Отредактируйте файл `.cursorrules`
2. Перезапустите Cursor IDE (или перезагрузите окно)
3. Новые правила применятся автоматически

---

## 📚 Полезные ссылки

- [Cursor Directory](https://cursor.directory/) - коллекция правил
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## ✅ Итог

Теперь Cursor IDE будет:
- ✅ Генерировать код согласно правилам проекта
- ✅ Следовать TypeScript best practices
- ✅ Использовать правильную структуру компонентов
- ✅ Применять Tailwind CSS стили
- ✅ Соблюдать accessibility требования
- ✅ Писать чистый, типобезопасный код

**Просто пишите промпты - Cursor сделает всё правильно! 🚀**

---

**Дата создания:** 28 октября 2024  
**Проект:** GPT Agent - Trainable virtual employee  
**Статус:** ✅ Активно


