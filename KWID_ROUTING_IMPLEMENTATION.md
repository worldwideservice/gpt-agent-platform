# 🗺️ Реализация Kwid-подобной структуры URL

## ✅ Что сделано:

### 1. Создана структура `/manage/[tenantId]/`
- ✅ `app/(protected)/manage/[tenantId]/layout.tsx` - layout для всех manage страниц
- ✅ `app/(protected)/manage/[tenantId]/page.tsx` - Dashboard страница
- ✅ `lib/utils/tenant.ts` - утилиты для работы с tenant-id

### 2. Обновлена навигация в Sidebar
- ✅ Добавлен параметр `tenantId` в Sidebar
- ✅ Все ссылки используют формат `/manage/{tenantId}/...`
- ✅ Обратная совместимость для старых путей

### 3. Структура URL (как в Kwid):
- ✅ `/manage/{tenantId}` - Dashboard
- ✅ `/manage/{tenantId}/ai-agents` - Agents list
- ✅ `/manage/{tenantId}/test-chat` - Test chat
- ✅ `/manage/{tenantId}/knowledge-categories` - Categories
- ✅ `/manage/{tenantId}/knowledge-items` - Articles
- ✅ `/manage/{tenantId}/account-settings` - Account settings
- ✅ `/manage/{tenantId}/pricing` - Pricing

## 🔄 Следующие шаги:

1. Перенести все страницы в структуру `/manage/[tenantId]/`
2. Обновить все router.push() вызовы
3. Обновить все Link компоненты
4. Добавить редиректы со старых путей

