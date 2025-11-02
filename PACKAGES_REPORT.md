# 📦 Отчет по установленным пакетам проекта

## 📊 Общая статистика
- **Дата анализа**: 2025-01-02
- **Менеджер пакетов**: npm
- **Всего зависимостей**: см. ниже по категориям

---

## 🎨 Frontend UI & Стилизация

### Core UI Frameworks
- **next**: ^14.2.5 - Next.js фреймворк (App Router)
- **react**: ^18.3.1 - React библиотека
- **react-dom**: ^18.3.1 - React DOM рендерер

### UI Components & Styling
- **@radix-ui/react-*** - Компоненты Radix UI (без стилей):
  - `@radix-ui/react-accordion`
  - `@radix-ui/react-dialog`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-label`
  - `@radix-ui/react-popover`
  - `@radix-ui/react-select`
  - `@radix-ui/react-separator`
  - `@radix-ui/react-slot`
  - `@radix-ui/react-switch`
  - `@radix-ui/react-tabs`
  - `@radix-ui/react-toast`
  - `@radix-ui/react-tooltip`
- **tailwindcss**: ^3.4.1 - Utility-first CSS framework
- **tailwindcss-animate**: ^1.0.7 - Tailwind анимации
- **class-variance-authority**: ^0.7.0 - Утилита для вариантов компонентов
- **clsx**: ^2.1.1 - Утилита для условных CSS классов
- **tailwind-merge**: ^2.3.0 - Утилита для слияния Tailwind классов

### Icons
- **lucide-react**: ^0.344.0 - Иконки Lucide для React

---

## 🔧 TypeScript & Development Tools

- **typescript**: ^5.4.5 - TypeScript компилятор
- **@types/node**: ^20.11.24 - TypeScript типы для Node.js
- **@types/react**: ^18.2.55 - TypeScript типы для React
- **@types/react-dom**: ^18.2.19 - TypeScript типы для React DOM

---

## 🔐 Authentication & Security

- **next-auth**: ^5.0.0-beta.22 - Next.js аутентификация (Auth.js v5)
- **@auth/supabase-adapter**: ^2.4.3 - Supabase адаптер для NextAuth

---

## 🗄️ Database & Backend

### Supabase (PostgreSQL)
- **@supabase/supabase-js**: ^2.39.0 - Supabase JavaScript клиент
- **@supabase/ssr**: ^0.0.10 - Supabase SSR утилиты

### Database Tools
- **postgres**: ^3.4.3 - PostgreSQL клиент
- **pgvector**: ^0.2.3 - pgvector расширение для векторного поиска

---

## 🔄 State Management & Data Fetching

- **zustand**: ^4.5.0 - Легковесная библиотека управления состоянием
- **swr**: ^2.2.5 - React хуки для удаленных данных (Stale-While-Revalidate)

---

## 📡 HTTP & API

- **axios**: ^1.6.5 - HTTP клиент
- **openai**: ^4.20.1 - OpenAI API клиент (для OpenRouter интеграции)

---

## 🌐 Internationalization (i18n)

- **next-intl**: ^3.6.2 - Интернационализация для Next.js

---

## 📊 Charts & Visualization

- **recharts**: ^2.11.0 - React библиотека для графиков
- **date-fns**: ^3.3.1 - Утилиты для работы с датами

---

## 🔧 Utilities

### Form Handling
- **zod**: ^3.22.4 - TypeScript-first валидация схем
- **react-hook-form**: ^7.50.0 - Формы для React

### Code Quality
- **eslint**: ^8.57.0 - Линтер для JavaScript/TypeScript
- **eslint-config-next**: ^14.2.5 - ESLint конфигурация для Next.js

### File Handling
- **multer**: ^1.4.5-lts.1 - Middleware для загрузки файлов
- **@types/multer**: ^1.4.11 - TypeScript типы для multer

### Other Utilities
- **nanoid**: ^5.0.6 - Генератор уникальных ID
- **uuid**: ^10.0.0 - Генератор UUID
- **@types/uuid**: ^10.0.0 - TypeScript типы для uuid

---

## 🚀 Build & Development Tools

### Build Tools
- **next**: ^14.2.5 - Next.js сборщик
- **postcss**: ^8.4.35 - CSS постпроцессор
- **autoprefixer**: ^10.4.17 - Автопрефиксы для CSS

---

## 📝 Documentation & Testing

*(В devDependencies могут быть дополнительные инструменты)*

---

## 🔍 Queue & Background Jobs

- **bullmq**: ^5.10.2 - Очередь задач на Redis
- **ioredis**: ^5.3.2 - Redis клиент для Node.js

---

## 📦 Группировка по назначению

### 🎯 Core Dependencies (критичные)
- Next.js, React, TypeScript
- Authentication (NextAuth)
- Database (Supabase)

### 🎨 UI Layer
- Radix UI компоненты
- Tailwind CSS
- Lucide иконки
- Recharts (графики)

### 🔧 Development Tools
- ESLint
- TypeScript

### 📡 External Services
- OpenAI/OpenRouter
- Supabase

### 🔄 State & Data
- Zustand (state)
- SWR (data fetching)

### 🛠️ Utilities
- Zod (validation)
- React Hook Form
- date-fns
- nanoid/uuid

---

## 📋 Рекомендации по оптимизации

1. **Проверить дубликаты**: Убедиться, что нет конфликтующих версий
2. **Tree-shaking**: Убедиться что неиспользуемые пакеты удалены
3. **Размер бандла**: Проверить размер финального бандла
4. **Обновления**: Проверить наличие критичных обновлений безопасности

---

## 🔗 Полезные команды

```bash
# Посмотреть установленные пакеты
npm list --depth=0

# Проверить устаревшие пакеты
npm outdated

# Обновить все пакеты (осторожно!)
npm update

# Проверить размер пакетов
npx bundlephobia [package-name]

# Аудит безопасности
npm audit
```

