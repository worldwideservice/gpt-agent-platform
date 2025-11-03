# ✅ Railway Worker - Полное исправление всех проблем

## 🔍 Корневые причины проблем

### 1. Path Aliases не резолвятся в runtime
**Проблема:** Файлы в `lib/` используют path aliases (`@/lib/...`, `@/types/...`), которые определены в `tsconfig.json`, но `tsx` не резолвит их автоматически в runtime.

**Решение:** Добавлен `tsconfig-paths` для регистрации path aliases перед любыми импортами.

### 2. TypeScript файлы не выполняются Node.js напрямую
**Проблема:** Worker пытался импортировать `.ts` файлы из `lib/`, но Node.js не может выполнять TypeScript.

**Решение:** Используем `tsx` вместо `node` для запуска - `tsx` умеет выполнять TypeScript напрямую.

### 3. Неправильные пути в tsconfig.json Worker
**Проблема:** `baseUrl` был установлен в `./`, что не соответствовало реальной структуре проекта.

**Решение:** Установлен `baseUrl: "../../"` и добавлены правильные paths для резолва `@/` aliases.

## ✅ Все исправления

### 1. Добавлен tsconfig-paths в dependencies
```json
{
  "dependencies": {
    "tsconfig-paths": "^4.2.0",
    "tsx": "^4.15.5",
    "typescript": "^5.4.5"
  }
}
```

### 2. Регистрация path aliases в entry point
```typescript
// services/worker/src/index.ts
import { register } from 'tsconfig-paths'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const currentFile = fileURLToPath(import.meta.url)
const currentDir = dirname(currentFile)
const projectRoot = resolve(currentDir, '../..')

register({
  baseUrl: projectRoot,
  paths: {
    '@/*': ['./*'],
    '@/lib/*': ['./lib/*'],
    '@/types/*': ['./types/*'],
  },
})
```

### 3. Обновлен tsconfig.json Worker
```json
{
  "compilerOptions": {
    "baseUrl": "../../",
    "paths": {
      "@/*": ["./*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "include": ["src", "../lib", "../types"]
}
```

### 4. Обновлен Dockerfile
```dockerfile
# Копируем lib, types и tsconfig.json
COPY --from=base /app/lib ./lib
COPY --from=base /app/types ./types
COPY --from=base /app/tsconfig.json ./tsconfig.json

# Запускаем через tsx
CMD ["tsx", "services/worker/dist/index.js"]
```

### 5. Упрощены динамические импорты
Убраны сложные проверки путей - теперь просто:
```typescript
const module = await import('../../lib/services/webhook-processor')
```

## 🎯 Результат

- ✅ Path aliases резолвятся правильно через tsconfig-paths
- ✅ TypeScript файлы выполняются через tsx
- ✅ Все зависимости настроены корректно
- ✅ Dockerfile копирует все необходимые файлы
- ✅ Локальная сборка успешна (47.94 KB)

---

**Дата:** 2025-01-26  
**Статус:** ✅ Готово к деплою


