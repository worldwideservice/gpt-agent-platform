# 🏗️ Статус Приведения Архитектуры к Kwid

## ✅ Что уже сделано:

### 1. Создана структура `/manage/[tenantId]/`
- ✅ `lib/utils/tenant.ts` - утилиты для работы с tenant-id (формат: `{id}-{slug}`)
- ✅ `app/(protected)/manage/[tenantId]/layout.tsx` - layout для manage страниц
- ✅ `app/(protected)/manage/[tenantId]/page.tsx` - Dashboard страница

### 2. Обновлена навигация
- ✅ Sidebar обновлен для использования tenant-id в URL
- ✅ Все ссылки в навигации используют формат `/manage/{tenantId}/...`

### 3. Структура URL (как в Kwid):
- ✅ `/manage/{tenantId}` - Dashboard
- ✅ `/manage/{tenantId}/ai-agents` - Agents (подготовлено)
- ✅ `/manage/{tenantId}/test-chat` - Test Chat (нужно создать)
- ✅ `/manage/{tenantId}/knowledge-categories` - Categories (нужно создать)
- ✅ `/manage/{tenantId}/knowledge-items` - Articles (нужно создать)
- ✅ `/manage/{tenantId}/account-settings` - Account (нужно создать)
- ✅ `/manage/{tenantId}/pricing` - Pricing (нужно создать)

## 📋 Следующие шаги:

1. **Перенести страницы:**
   - Agents → `/manage/[tenantId]/ai-agents/`
   - Chat → `/manage/[tenantId]/test-chat/`
   - Knowledge Base → `/manage/[tenantId]/knowledge-*/`
   - Account → `/manage/[tenantId]/account-settings/`
   - Pricing → `/manage/[tenantId]/pricing/`

2. **Обновить все router.push() и Link:**
   - Использовать tenant-id в путях
   - Создать хук `useTenantId()` для получения tenant-id

3. **Добавить редиректы:**
   - Со старых путей на новые

4. **Обновить middleware:**
   - Редирект на `/manage/{tenantId}` после логина

## 🎯 Формат tenant-id:

Kwid использует формат: `{numericId}-{slug}` (например: `1000373-worldwideservices`)

В проекте:
- `generateTenantId(organizationId, slug)` - создает tenant-id
- `parseTenantId(tenantId)` - парсит tenant-id и возвращает slug

