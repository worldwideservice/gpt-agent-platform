# E2E Tests для Agent Integrations

## Обзор

Comprehensive E2E тесты для системы управления интеграциями агентов с использованием Playwright.

## Запуск тестов

```bash
# Запустить все E2E тесты
npx playwright test tests/e2e/agent-integrations.spec.ts

# UI mode (интерактивный)
npx playwright test --ui tests/e2e/agent-integrations.spec.ts

# Debug mode
npx playwright test --debug tests/e2e/agent-integrations.spec.ts
```

## Покрытие

- ✅ Navigation and Layout (breadcrumbs, tabs, active states)
- ✅ Integrations List (display, install/settings buttons)
- ✅ Search Functionality (filter, clear)
- ✅ Install Modal (OAuth/Manual tabs, validation)
- ✅ Loading/Error States
- ✅ OAuth Success Notifications
- ✅ Accessibility (ARIA, keyboard navigation)
- ✅ Responsive Design (mobile, tablet)

## Test Data IDs

```
integrations-search      - Поле поиска
integrations-table       - Таблица интеграций
install-button           - Кнопка установки
settings-button          - Кнопка настроек
loader                   - Loading indicator
error-state              - Error state
empty-state              - Empty state
```

См. полную документацию в файле.
