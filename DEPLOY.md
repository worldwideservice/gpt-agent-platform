# 🚀 Инструкция по развертыванию AI Agent Platform

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск в режиме разработки

```bash
npm run dev
```

Откройте браузер и перейдите по адресу: [http://localhost:3000](http://localhost:3000)

## 📦 Структура проекта

```
AI agent/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Главная страница (/)
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Глобальные стили
│   ├── agents/            # /agents
│   ├── knowledge-base/    # /knowledge-base
│   ├── integrations/      # /integrations
│   ├── chat/              # /chat
│   ├── account/           # /account
│   └── support/           # /support
├── components/
│   ├── ui/                # Переиспользуемые UI компоненты
│   ├── layout/            # Layout компоненты
│   ├── dashboard/         # Компоненты дашборда
│   └── agents/            # Компоненты агентов
├── lib/                   # Утилиты
├── types/                 # TypeScript типы
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── README.md
└── FEATURES.md
```

## 🌐 Маршруты приложения

| Путь | Описание |
|------|----------|
| `/` | Главная панель (Инфопанель) |
| `/agents` | Список AI-агентов |
| `/agents/new` | Создание нового агента |
| `/agents/[id]` | Редактирование агента |
| `/knowledge-base` | База знаний |
| `/integrations` | Интеграции |
| `/chat` | Тестовый чат |
| `/account` | Настройки аккаунта и тарифы |
| `/support` | Поддержка и документация |

## 🎨 Кастомизация

### Цвета

Измените цветовую схему в `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... остальные оттенки
    900: '#1e3a8a',
  },
}
```

### Шрифты

В `app/layout.tsx` можно изменить шрифт:

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })
```

## 📊 Подключение к API

### Создание API эндпоинтов

Создайте папку `app/api/` и добавьте route handlers:

```typescript
// app/api/agents/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  // Получение агентов из БД
  const agents = await db.agents.findMany()
  return NextResponse.json(agents)
}

export async function POST(request: Request) {
  const body = await request.json()
  // Создание агента
  const agent = await db.agents.create({ data: body })
  return NextResponse.json(agent)
}
```

### Использование в компонентах

```typescript
// В Server Component
const agents = await fetch('http://localhost:3000/api/agents').then(r => r.json())

// В Client Component
'use client'
const [agents, setAgents] = useState([])

useEffect(() => {
  fetch('/api/agents')
    .then(r => r.json())
    .then(setAgents)
}, [])
```

## 🗄 Подключение базы данных

### Prisma (рекомендуется)

1. Установите Prisma:
```bash
npm install @prisma/client
npm install -D prisma
```

2. Инициализируйте Prisma:
```bash
npx prisma init
```

3. Настройте схему в `prisma/schema.prisma`

4. Создайте миграцию:
```bash
npx prisma migrate dev --name init
```

### Пример схемы Prisma

```prisma
model Agent {
  id        String   @id @default(cuid())
  name      String
  status    String
  model     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔐 Аутентификация

### Next-Auth.js

```bash
npm install next-auth
```

Создайте `app/api/auth/[...nextauth]/route.ts`

## 🚀 Деплой в продакшен

### Vercel (рекомендуется для Next.js)

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Выполните деплой:
```bash
vercel
```

### Сборка для продакшена

```bash
npm run build
npm start
```

### Docker

Создайте `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Соберите и запустите:

```bash
docker build -t ai-agent-platform .
docker run -p 3000:3000 ai-agent-platform
```

## 🧪 Тестирование

### Unit тесты

```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
```

### E2E тесты

```bash
npm install -D @playwright/test
npx playwright install
```

## 📈 Мониторинг и аналитика

### Vercel Analytics

```bash
npm install @vercel/analytics
```

В `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🔧 Переменные окружения

Создайте `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aiagent

# OpenAI
OPENAI_API_KEY=sk-...

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

## ⚡ Оптимизация производительности

1. **Используйте Server Components** где возможно
2. **Динамические импорты** для тяжелых компонентов:
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Загрузка...</p>
})
```

3. **Image optimization** - используйте Next.js Image:
```typescript
import Image from 'next/image'
<Image src="/logo.png" width={100} height={100} alt="Logo" />
```

4. **Кэширование** - используйте revalidate в fetch:
```typescript
fetch('https://api.example.com/data', { 
  next: { revalidate: 3600 } // кэш на 1 час
})
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте документацию Next.js: [nextjs.org/docs](https://nextjs.org/docs)
2. Проверьте Issues на GitHub
3. Свяжитесь с командой поддержки

---

**Версия:** 1.0.0  
**Последнее обновление:** Октябрь 2024

