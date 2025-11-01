# 🗺️ План Приведения Архитектуры к Kwid

## 📊 Структура URL в Kwid:

### Kwid использует структуру с tenant-id:
```
/manage/{tenant-id}                          - Dashboard
/manage/{tenant-id}/ai-agents                - Agents list
/manage/{tenant-id}/ai-agents/{id}/edit      - Edit agent
/manage/{tenant-id}/test-chat                - Test chat
/manage/{tenant-id}/knowledge-categories     - Categories
/manage/{tenant-id}/knowledge-items          - Articles
/manage/{tenant-id}/account-settings         - Settings
/manage/{tenant-id}/pricing                  - Pricing
```

### Текущая структура проекта:
```
/                              - Dashboard
/agents                        - Agents list
/agents/[id]/edit              - Edit agent
/chat                          - Test chat
/knowledge-base/categories      - Categories
/knowledge-base/articles       - Articles
/account                       - Settings
/pricing                       - Pricing
```

## 🎯 План изменений:

### 1. Создать структуру с tenant-id
- Создать `app/(protected)/manage/[tenantId]/` структуру
- Перенести все страницы под `/manage/[tenantId]/`

### 2. Обновить навигацию
- Обновить Sidebar для использования tenant-id в URL
- Обновить все Link компоненты
- Обновить router.push() вызовы

### 3. Обновить layout
- Добавить получение tenant-id из параметров
- Обновить ProtectedLayout для поддержки tenant-id

### 4. Сохранить обратную совместимость
- Можно оставить старые роуты как редиректы
- Или полностью перейти на новую структуру

