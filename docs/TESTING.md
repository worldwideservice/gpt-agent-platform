# 🧪 Тестирование

**Дата:** 2025-01-26  
**Статус:** ✅ Настроено и работает

---

## 📋 Обзор

Проект использует **Vitest** для unit и integration тестов, и **Playwright** для E2E тестов.

### Типы тестов

1. **Unit тесты** (`tests/unit/`) - тестирование отдельных функций и модулей
2. **Integration тесты** (`tests/integration/`) - тестирование API endpoints
3. **E2E тесты** (`tests/*.spec.ts`) - тестирование через Playwright

---

## 🚀 Запуск тестов

### Все unit и integration тесты

```bash
npm run test:unit
```

### С покрытием кода

```bash
npm run test:unit:coverage
```

### Watch режим (для разработки)

```bash
npm run test:unit:watch
```

### E2E тесты (Playwright)

```bash
npm run test:e2e
```

---

## 📁 Структура тестов

```
tests/
├── unit/                    # Unit тесты
│   ├── utils/              # Тесты утилит
│   │   ├── cache.test.ts
│   │   ├── error-handler.test.ts
│   │   └── retry.test.ts
│   └── services/           # Тесты сервисов
│       ├── llm.test.ts
│       └── agent-memory.test.ts
│
└── integration/            # Integration тесты
    └── api/                # API endpoints
        ├── agents.test.ts
        └── chat.test.ts
```

---

## ✅ Покрытие кода

### Основные модули

| Модуль | Покрытие | Статус |
|--------|----------|--------|
| `error-handler.ts` | ~84% | ✅ Хорошо |
| `retry.ts` | ~76% | ✅ Хорошо |
| `agents/route.ts` | ~79% | ✅ Хорошо |
| `cache.ts` | ~39% | ⚠️ Требует улучшения |
| `llm.ts` | ~10% | ⚠️ Требует улучшения |

### Общее покрытие: ~19-20%

---

## 🔧 Конфигурация

### Vitest (`vitest.config.ts`)

- **Environment:** Node.js
- **Projects:**
  - `unit` - unit тесты
  - `integration` - integration тесты
  - `storybook` - Storybook тесты (временно отключен)

### Алиасы

Алиасы `@/` настроены через `resolve.alias` в `vitest.config.ts`:

```typescript
resolve: {
  alias: {
    '@': dirname, // Корень проекта
  },
}
```

---

## 📝 Написание тестов

### Пример unit теста

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('My Function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should do something', () => {
    const result = myFunction()
    expect(result).toBe(expected)
  })
})
```

### Пример integration теста

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

describe('API: /api/endpoint', () => {
  it('should return 401 if not authenticated', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue(null)

    const route = await import('@/app/api/endpoint/route')
    const request = new NextRequest('http://localhost:3000/api/endpoint')
    const response = await route.GET(request)

    expect(response.status).toBe(401)
  })
})
```

### Мокирование

#### Supabase

```typescript
const mockSupabaseClient = {
  from: vi.fn(() => mockSupabaseClient),
  select: vi.fn(() => mockSupabaseClient),
  // ... другие методы
}

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseServiceRoleClient: vi.fn(() => mockSupabaseClient),
}))
```

#### Fetch API

```typescript
const mockFetch = vi.fn()
global.fetch = mockFetch

mockFetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ data: 'result' }),
})
```

---

## ⚠️ Известные проблемы

### 1. Storybook тесты

Storybook тесты временно отключены для ускорения unit/integration тестов. Чтобы включить:

```typescript
// vitest.config.ts
plugins: [
  storybookTest({ configDir: path.join(dirname, '.storybook') }),
]
```

### 2. Supabase Query Builder

Мокирование Supabase query builder с цепочкой вызовов (`select().eq().order()...`) сложно. Для сложных запросов рекомендуется использовать интеграционные тесты.

### 3. Playwright .spec.ts файлы

Playwright тесты (`.spec.ts`) исключены из Vitest. Запускаются отдельно через `npm run test:e2e`.

---

## 🎯 Следующие шаги

1. ✅ Настроены unit и integration тесты
2. ✅ Исправлены алиасы и импорты
3. ✅ Добавлены тесты для `llm.ts` и `agent-memory.ts`
4. ⏳ Улучшить покрытие для `cache.ts` и других модулей
5. ⏳ Добавить больше integration тестов для API endpoints
6. ⏳ Включить Storybook тесты (после решения проблем с зависанием)

---

## 📚 Полезные ссылки

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)

---

**Обновлено:** 2025-01-26

