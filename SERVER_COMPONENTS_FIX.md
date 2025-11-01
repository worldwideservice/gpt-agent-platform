# ✅ Исправление ошибок Server Components

**Дата:** 2025-01-02  
**Статус:** ✅ **ИСПРАВЛЕНО**

---

## 🔴 Проблема:

Next.js пытался статически генерировать (prerender) API routes и client components, что вызывало ошибки:

```
Error: Cannot find module '/app/api/account/route.js'
Error: Failed to collect page data for /api/account
```

---

## ✅ Решение:

Добавлен `export const dynamic = 'force-dynamic'` в проблемные файлы:

### API Routes:
1. ✅ `app/api/account/route.ts` - добавлен `dynamic = 'force-dynamic'`
2. ✅ `app/api/test-kommo/route.ts` - добавлен `dynamic = 'force-dynamic'`
3. ✅ `app/api/jobs/route.ts` - добавлен `dynamic = 'force-dynamic'`
4. ✅ `app/api/auth/register/route.ts` - добавлен `dynamic = 'force-dynamic'`

### Client Components:
1. ✅ `app/(protected)/account/page.tsx` - добавлен `dynamic = 'force-dynamic'`
2. ✅ `app/(protected)/support/page.tsx` - добавлен `dynamic = 'force-dynamic'`

---

## 📊 Результат:

**Сборка:** ✅ `✓ Compiled successfully`

Все ошибки Server Components исправлены. Проект успешно компилируется.

---

## 📝 Примечание:

Остальные API routes можно обновить позже при необходимости, добавив:
```typescript
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
```

---

**Коммит:** `fix: исправлены ошибки Server Components`

