# Логика переходов между страницами платформы

## ПОСЛЕДОВАТЕЛЬНОСТЬ ПОСЛЕ ВХОДА

### 1. Пользователь на `/login`
- Вводит email и password
- Нажимает "Войти"
- Вызывается `signIn('credentials', ...)`

### 2. После успешного signIn
- **Ожидание 500ms** - даем время на обновление сессии
- **router.refresh()** - обновляем сессию на клиенте
- **Ожидание еще 500ms** - дополнительное время на синхронизацию

### 3. Получение tenant-id
- Вызывается `/api/auth/get-tenant-redirect` (GET)
- **Retry логика:** до 3 попыток с интервалом 1 секунда
- API использует `getTenantIdFromSession()`:
  1. Получает сессию через `auth()`
  2. Проверяет наличие `session.user.orgId`
  3. Получает список организаций пользователя
  4. Находит активную организацию по `orgId`
  5. Получает или генерирует slug организации
  6. Генерирует tenant-id в формате `{numericId}-{slug}`
  7. Возвращает tenant-id

### 4. Редирект на дашборд
- Если tenant-id получен: `window.location.href = /manage/${tenantId}`
- Используется `window.location.href` вместо `router.push` для гарантированного полного редиректа
- Это обновляет всю страницу и гарантирует корректную работу сессии

### 5. На странице `/manage/[tenantId]` (layout)
- Проверка авторизации: если нет сессии → редирект на `/login`
- Получение списка организаций пользователя
- Поиск организации по tenantId:
  1. Парсинг tenantId для получения slug
  2. Поиск организации по slug
  3. Если не найдена → поиск по `orgId` из сессии
  4. Если не найдена → используем первую доступную
- Проверка соответствия tenantId:
  - Если tenantId не соответствует организации → редирект на правильный tenantId
- Если организация без slug → получение slug из БД и редирект
- Отображение страницы с правильным tenantId

### 6. Проверка онбординга (на дашборде)
- Проверяется `onboardingState.isCompleted`
- Если не завершен → редирект на `/onboarding`
- **Временно отключено для отладки**

### 7. Отображение дашборда
- Показываются метрики, графики, обновления

---

## ПЕРЕХОДЫ МЕЖДУ СТРАНИЦАМИ ПЛАТФОРМЫ

### Все страницы используют формат `/manage/[tenantId]/...`

#### Навигация через Sidebar:
- **Дашборд** → `/manage/[tenantId]`
- **Агенты ИИ** → `/manage/[tenantId]/ai-agents`
- **Тестовый чат** → `/manage/[tenantId]/test-chat`
- **Категории** → `/manage/[tenantId]/knowledge-categories`
- **Статьи** → `/manage/[tenantId]/knowledge-items`
- **Настройки аккаунта** → `/manage/[tenantId]/account-settings`
- **Тарифные планы** → `/manage/[tenantId]/pricing`

#### Внутренние переходы:
- **Создать агента** → `/manage/[tenantId]/ai-agents/create`
- **Редактировать агента** → `/manage/[tenantId]/ai-agents/[id]/edit`
- **Воронки агента** → `/manage/[tenantId]/ai-agents/[id]/pipelines`
- **Обучение агента** → `/manage/[tenantId]/ai-agents/[id]/training`

---

## СТАРЫЕ ПУТИ (АВТОМАТИЧЕСКИЕ РЕДИРЕКТЫ)

Все старые пути автоматически редиректят на новые:

- `/` (защищенная) → `/manage/[tenantId]`
- `/agents` → `/manage/[tenantId]/ai-agents`
- `/chat` → `/manage/[tenantId]/test-chat`
- `/knowledge-base` → `/manage/[tenantId]/knowledge-categories`
- `/knowledge-base/categories` → `/manage/[tenantId]/knowledge-categories`
- `/knowledge-base/articles` → `/manage/[tenantId]/knowledge-items`
- `/account` → `/manage/[tenantId]/account-settings`
- `/pricing` → `/manage/[tenantId]/pricing`

**Логика редиректа:**
- Используется `redirectToTenantPath(newPath)` в server component
- Получается tenant-id из сессии
- Выполняется server-side редирект на правильный путь

---

## ОБРАБОТКА ОШИБОК

### Если tenant-id не получен после логина:
- Показывается ошибка пользователю
- Fallback редирект на `/` (публичная страница)

### Если организация не найдена:
- Layout редиректит на `/login`

### Если tenantId не соответствует организации:
- Layout автоматически редиректит на правильный tenantId

### Если slug отсутствует:
- Генерируется slug автоматически
- Сохраняется в БД
- Происходит редирект на правильный tenantId

---

## КРИТИЧЕСКИЕ ТОЧКИ

1. **Сессия должна быть обновлена после signIn** - добавлены задержки и refresh
2. **Tenant-id должен быть валидным** - проверка и автоматическая коррекция
3. **Организация должна существовать** - проверка в layout
4. **Пользователь должен иметь доступ** - проверка принадлежности организации

---

## ЛОГИРОВАНИЕ

Все критичные операции логируются:
- `[getTenantIdFromSession]` - получение tenant-id
- `[get-tenant-redirect]` - API endpoint
- `[manage layout]` - обработка в layout
- `[LoginClient]` - процесс логина на клиенте

Логи помогают отладить проблемы с переходами.

