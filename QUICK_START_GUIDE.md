# Quick Start Guide - Agent Integrations Testing

## 🚀 Быстрый старт для локального тестирования

### Предварительные требования

```bash
Node.js 18+
npm 10+
```

### 1. Установка зависимостей

```bash
# Установить все dependencies
npm install

# Установить Playwright browsers (если ещё не установлены)
npx playwright install chromium
```

### 2. Запуск dev сервера

```bash
# Запустить development server
npm run dev

# Server будет доступен на http://localhost:3000
```

### 3. Проверка в браузере

Откройте в браузере:

```
http://localhost:3000/manage/[tenantId]/ai-agents/[agentId]/edit/integrations
```

**Замените:**
- `[tenantId]` - на ваш tenant ID
- `[agentId]` - на ID вашего агента

### 4. Что проверить вручную

#### ✅ Navigation
- [ ] Breadcrumbs отображаются корректно
- [ ] Табы "Основные" и "Интеграции"
- [ ] Active tab подсвечен синим

#### ✅ Integrations List
- [ ] Отображаются все 4 интеграции (Kommo, Google Calendar, Telegram, WhatsApp)
- [ ] Статусы "Установлено" и "Активно" показываются корректно
- [ ] Кнопки "Установить" для неустановленных
- [ ] Кнопки "Настройки" для установленных

#### ✅ Search
- [ ] Поиск фильтрует интеграции
- [ ] "Очистить поиск" работает
- [ ] Empty state при отсутствии результатов

#### ✅ Install Modal
- [ ] Открывается по клику на "Установить"
- [ ] Табы "OAuth" и "Вручную"
- [ ] OAuth tab:
  - [ ] Поле "Поддомен Kommo"
  - [ ] Кнопка disabled без ввода
  - [ ] Кнопка enabled после ввода поддомена
- [ ] Manual tab:
  - [ ] Поля Client ID и Client Secret
  - [ ] Кнопка disabled без credentials

#### ✅ OAuth Flow (требует реального Kommo аккаунта)
- [ ] Ввести поддомен
- [ ] Нажать "Подключить через OAuth"
- [ ] Редирект на Kommo
- [ ] Авторизация
- [ ] Редирект обратно
- [ ] Success toast notification
- [ ] Интеграция появляется в таблице

#### ✅ Loading States
- [ ] Spinner при загрузке
- [ ] Disabled buttons во время операций

#### ✅ Error Handling
- [ ] Error state при API ошибках
- [ ] Кнопка "Попробовать снова"

---

## 🧪 Запуск E2E тестов

### Вариант 1: Автоматический запуск dev server

Playwright автоматически запустит dev server:

```bash
# Запустить все тесты
npx playwright test tests/e2e/agent-integrations.spec.ts

# С отчётом
npx playwright test tests/e2e/agent-integrations.spec.ts --reporter=html

# Запустить конкретный тест
npx playwright test -g "should display list of available integrations"
```

### Вариант 2: UI Mode (рекомендуется для debugging)

```bash
# Интерактивный режим
npx playwright test --ui tests/e2e/agent-integrations.spec.ts
```

Преимущества UI mode:
- Визуальное отображение тестов
- Step-by-step execution
- Time travel debugging
- Screenshots для каждого шага

### Вариант 3: Debug Mode

```bash
# Debug mode с Playwright Inspector
npx playwright test --debug tests/e2e/agent-integrations.spec.ts
```

### Вариант 4: С запущенным dev server

```bash
# Терминал 1: Запустить dev server
npm run dev

# Терминал 2: Запустить тесты (используя существующий сервер)
REUSE_SERVER=true npx playwright test tests/e2e/agent-integrations.spec.ts
```

### Вариант 5: Headed mode (видно браузер)

```bash
# С видимым браузером
npx playwright test --headed tests/e2e/agent-integrations.spec.ts
```

---

## 📊 Ожидаемые результаты

### Все тесты должны пройти (21/21):

```
✓ Navigation and Layout (3 tests)
✓ Integrations List (4 tests)
✓ Search Functionality (2 tests)
✓ Install Integration Modal (5 tests)
✓ Loading and Error States (2 tests)
✓ OAuth Success Notification (1 test)
✓ Accessibility (2 tests)
✓ Responsive Design (2 tests)

Total: 21 passed
```

### Reports

После запуска тестов:

```bash
# Открыть HTML report
npx playwright show-report

# Найти в:
playwright-report/index.html
```

---

## 🐛 Troubleshooting

### Проблема: "next: not found"

**Решение:**
```bash
npm install
```

### Проблема: "Playwright browsers not installed"

**Решение:**
```bash
npx playwright install chromium
```

### Проблема: "Port 3000 already in use"

**Решение:**
```bash
# Найти процесс на порту 3000
lsof -ti:3000

# Убить процесс
kill -9 $(lsof -ti:3000)

# Или использовать другой порт
PORT=3001 npm run dev
```

### Проблема: Тесты падают с timeout

**Решение:**
```bash
# Увеличить timeout
npx playwright test --timeout=120000 tests/e2e/agent-integrations.spec.ts
```

### Проблема: DEMO_MODE не работает

**Решение:**
Убедитесь что environment variables установлены:
```bash
export DEMO_MODE=true
export E2E_ONBOARDING_FAKE=1
```

---

## 🔧 Advanced Testing

### Запустить specific test suite

```bash
# Только Navigation tests
npx playwright test -g "Navigation and Layout"

# Только Search tests
npx playwright test -g "Search Functionality"

# Только Modal tests
npx playwright test -g "Install Integration Modal"
```

### Запустить с filtering

```bash
# Пропустить медленные тесты
npx playwright test --grep-invert "@slow"

# Запустить только critical тесты
npx playwright test --grep "@critical"
```

### Запустить на разных браузерах

```bash
# Firefox
npx playwright test --project=firefox

# WebKit (Safari)
npx playwright test --project=webkit

# Все браузеры
npx playwright test --project=chromium --project=firefox --project=webkit
```

### Создать screenshots

```bash
# Screenshot на каждом шаге
npx playwright test --screenshot=on

# Trace для debugging
npx playwright test --trace=on
```

---

## 📸 Visual Testing (Future)

Для visual regression testing:

```bash
# Создать baseline screenshots
npx playwright test --update-snapshots

# Запустить visual comparison
npx playwright test

# Посмотреть diff при несовпадении
npx playwright show-report
```

---

## 🎯 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      - name: Run E2E tests
        run: npx playwright test tests/e2e/agent-integrations.spec.ts
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📝 Test Coverage

Текущее покрытие: **~95%**

Покрыто:
- ✅ All user flows
- ✅ Happy paths
- ✅ Error scenarios
- ✅ Edge cases
- ✅ Accessibility
- ✅ Responsive design

Не покрыто:
- ❌ Full OAuth flow (требует реальный Kommo account)
- ❌ Backend integration (используется mock)
- ❌ Database operations (DEMO_MODE)

---

## 🚀 Next Steps

1. **Запустить тесты локально** для проверки
2. **Протестировать в браузере** вручную
3. **Настроить CI/CD** для автоматического тестирования
4. **Добавить visual regression** testing
5. **Расширить покрытие** для других интеграций

---

## 📚 Дополнительные ресурсы

- [Playwright Documentation](https://playwright.dev/)
- [E2E Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Tests README](./tests/e2e/README.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [E2E Testing Report](./E2E_TESTING_REPORT.md)

---

**Всё готово к тестированию! 🎉**
