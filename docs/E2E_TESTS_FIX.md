# 🔧 Исправление E2E тестов в Test Suite

**Дата:** 2025-01-26  
**Проблема:** Test Suite падал из-за конфликта портов - Playwright пытался запустить свой сервер на порту 3000, который уже был занят

---

## ✅ Исправлено

### Проблема: `Error: http://localhost:3000 is already used`

**Причина:**  
В workflow `test.yml` сервер запускается вручную (`npm run start &`), но Playwright по умолчанию пытался запустить свой собственный сервер через `webServer.command`, потому что в CI `reuseExistingServer` был установлен в `false`.

**Решение:**  
1. Изменена логика `reuseExistingServer` в `playwright.config.ts`:
   - Было: `reuseExistingServer: !process.env.CI` (в CI всегда `false`)
   - Стало: `reuseExistingServer: process.env.REUSE_SERVER !== 'false'` (по умолчанию `true`, если не указано явно)

2. Добавлена переменная окружения `REUSE_SERVER: 'true'` в шаг "🧪 Run E2E tests" в `test.yml`

**Изменения:**

**`playwright.config.ts`:**
```typescript
// Было:
reuseExistingServer: !process.env.CI,

// Стало:
reuseExistingServer: process.env.REUSE_SERVER !== 'false', // Используем существующий сервер, если он запущен
```

**`.github/workflows/test.yml`:**
```yaml
- name: 🧪 Run E2E tests
  run: npm run test:e2e -- --project=chromium --workers=2
  env:
    CI: true
    REUSE_SERVER: 'true'  # Используем уже запущенный сервер
    E2E_ONBOARDING_FAKE: '1'
    DEMO_MODE: 'true'
    BASE_URL: 'http://localhost:3000'
```

---

## 📝 Статус

- ✅ Исправлено в `playwright.config.ts`
- ✅ Исправлено в `.github/workflows/test.yml`
- ✅ Код закоммичен и запушен
- ⏳ Ожидаем новый запуск Test Suite для проверки

---

## 🔗 Ссылки

- [Playwright webServer documentation](https://playwright.dev/docs/test-webserver)
- [Playwright reuseExistingServer option](https://playwright.dev/docs/test-webserver#reuse-existing-server)

