# E2E Tests Documentation

## Обзор

Этот каталог содержит End-to-End (E2E) тесты для приложения, основанные на KWID документации и логике.

## Статистика

- **Всего E2E тестовых файлов:** 32
- **KWID-специфичных тестов:** 24
- **Покрытие:** Основные workflow, edge cases, валидация, доступность, производительность, мобильная версия

## Структура тестов

### Основные Workflow (KWID)

1. **`kwid-complete-workflow.spec.ts`** - Полный цикл всех основных страниц
2. **`kwid-agent-full-workflow.spec.ts`** - Полный цикл создания и настройки агента
3. **`kwid-knowledge-base-complete.spec.ts`** - Полный цикл работы с базой знаний
4. **`kwid-chat-complete-workflow.spec.ts`** - Полный цикл работы с тестовым чатом
5. **`kwid-navigation-workflow.spec.ts`** - Навигация по приложению

### Настройки агентов

6. **`kwid-agent-basic-settings-workflow.spec.ts`** - Основные настройки агента
7. **`kwid-agent-crm-settings-workflow.spec.ts`** - Настройки CRM (сделки и контакты)
8. **`kwid-agent-advanced-settings-workflow.spec.ts`** - Дополнительные настройки (модель, язык)
9. **`kwid-agent-pipeline-settings-workflow.spec.ts`** - Настройки воронок
10. **`kwid-agent-sequences-complete-workflow.spec.ts`** - Настройки последовательностей
11. **`kwid-rules-sequences-workflow.spec.ts`** - Правила и последовательности
12. **`kwid-triggers-workflow.spec.ts`** - Триггеры
13. **`kwid-training-workflow.spec.ts`** - Обучение агента

### Страницы и компоненты

14. **`kwid-account-settings-workflow.spec.ts`** - Настройки аккаунта
15. **`kwid-pricing-complete-workflow.spec.ts`** - Тарифные планы
16. **`kwid-integrations-complete-workflow.spec.ts`** - Интеграции

### Функциональность

17. **`kwid-filters-and-search-workflow.spec.ts`** - Фильтры и поиск
18. **`kwid-pagination-and-sorting-workflow.spec.ts`** - Пагинация и сортировка
19. **`kwid-bulk-operations-workflow.spec.ts`** - Массовые операции

### Качество и надежность

20. **`kwid-error-handling-workflow.spec.ts`** - Обработка ошибок
21. **`kwid-form-validation-workflow.spec.ts`** - Валидация форм
22. **`kwid-accessibility-workflow.spec.ts`** - Доступность (WCAG)

### Производительность и UX

23. **`kwid-mobile-responsive-workflow.spec.ts`** - Мобильная версия и адаптивность
24. **`kwid-performance-workflow.spec.ts`** - Производительность

### Интеграции

25. **`kwid-integration-kommo-workflow.spec.ts`** - Интеграция с Kommo

### Другие тесты

- **`agent-workflow.spec.ts`** - Базовые workflow агентов
- **`agent-channels.spec.ts`** - Настройки каналов
- **`dashboard-workflow.spec.ts`** - Dashboard
- **`knowledge-base-workflow.spec.ts`** - База знаний
- **`crm-integration-workflow.spec.ts`** - CRM интеграция
- **`integrations-workflow.spec.ts`** - Интеграции
- **`onboarding.smoke.spec.ts`** - Smoke тесты

## Запуск тестов

### Все тесты
```bash
npm run test:e2e
```

### Легкий режим (быстрый запуск)
```bash
npm run test:e2e:light
```

### Конкретный файл
```bash
npm run test:e2e:light -- tests/e2e/kwid-complete-workflow.spec.ts
```

### С UI (headed mode)
```bash
npm run test:e2e:headed
```

## Особенности

### Обработка авторизации

Все тесты корректно обрабатывают отсутствие авторизации в демо-режиме:
- Проверяют редирект на `/login`
- Пропускают тесты через `test.skip()` если требуется авторизация
- Не падают при отсутствии данных

### Гибкие селекторы

Тесты используют гибкие селекторы для работы в разных режимах:
- Поддержка разных вариантов текста (русский/английский)
- Работа с пустыми состояниями
- Обработка отсутствующих элементов

### Покрытие

Тесты покрывают:
- ✅ Все основные страницы из KWID документации
- ✅ Все вкладки редактирования агента
- ✅ CRUD операции
- ✅ Фильтры, поиск, сортировка
- ✅ Массовые операции
- ✅ Обработка ошибок
- ✅ Валидация форм
- ✅ Доступность
- ✅ Мобильная версия
- ✅ Производительность
- ✅ Интеграции

## Зависимости

- `@playwright/test` - для E2E тестирования
- Next.js приложение для тестирования

## Конфигурация

Конфигурация Playwright находится в `playwright.config.ts`:
- Timeout: 60 секунд
- Workers: 1 (локально), 2 (CI)
- Base URL: `http://localhost:3000`

## Примечания

- В демо-режиме многие тесты пропускаются из-за отсутствия авторизации
- Для полного тестирования требуется настроенная БД и авторизация
- Тесты основаны на KWID документации и логике приложения

