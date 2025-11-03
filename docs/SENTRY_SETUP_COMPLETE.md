# ✅ Полная настройка Sentry

> Инструкция с вашим Sentry токеном

## 🔑 Ваш Sentry токен

```
82a4d7aaaf2d11f092a62ea79c10f815
```

---

## 🚀 Шаг 1: Получить DSN

### Вариант A: Через Sentry Dashboard (Рекомендуется)

1. Откройте: https://sentry.io
2. Войдите в ваш аккаунт
3. Перейдите в ваш проект (или создайте новый)
4. **Settings** → **Client Keys (DSN)**
5. Скопируйте **DSN** (выглядит как: `https://xxx@sentry.io/xxx`)

### Вариант B: Через API (используя токен)

```bash
# Установите Sentry CLI
npm install -g @sentry/cli

# Получите список проектов
export SENTRY_AUTH_TOKEN="82a4d7aaaf2d11f092a62ea79c10f815"
export SENTRY_ORG="your-org-slug"  # Замените на ваш org slug

# Получите DSN через API
curl -H "Authorization: Bearer 82a4d7aaaf2d11f092a62ea79c10f815" \
  https://sentry.io/api/0/projects/{org-slug}/{project-slug}/keys/
```

---

## 🚀 Шаг 2: Добавить DSN в Vercel

1. Откройте: https://vercel.com/dashboard
2. Выберите ваш проект
3. **Settings** → **Environment Variables**
4. Добавьте переменные:

```
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

5. Выберите **Production**, **Preview**, **Development**
6. **Save**

---

## 🚀 Шаг 3: Настройка алертов

Следуйте инструкции в `docs/SENTRY_ALERTS.md`

**Быстрый старт:**

1. Sentry Dashboard → **Alerts** → **Create Alert Rule**
2. Создайте алерт "Critical Errors" (см. `SENTRY_ALERTS.md`)
3. Настройте интеграции (Slack/Email)

---

## 🔧 Использование токена

### Через Sentry CLI

```bash
export SENTRY_AUTH_TOKEN="82a4d7aaaf2d11f092a62ea79c10f815"
export SENTRY_ORG="your-org-slug"

# Просмотр проектов
sentry-cli projects list

# Загрузка source maps (для production)
sentry-cli sourcemaps inject ./dist
sentry-cli sourcemaps upload ./dist --release "$VERSION"
```

### Через API

```bash
# Пример: Получение списка проектов
curl -H "Authorization: Bearer 82a4d7aaaf2d11f092a62ea79c10f815" \
  https://sentry.io/api/0/organizations/

# Пример: Создание release
curl -X POST \
  -H "Authorization: Bearer 82a4d7aaaf2d11f092a62ea79c10f815" \
  -H "Content-Type: application/json" \
  -d '{"version":"1.0.0"}' \
  https://sentry.io/api/0/organizations/{org-slug}/releases/
```

---

## ✅ Чеклист

- [ ] Sentry проект создан
- [ ] DSN получен
- [ ] DSN добавлен в Vercel Environment Variables
- [ ] SENTRY_DSN добавлен
- [ ] NEXT_PUBLIC_SENTRY_DSN добавлен
- [ ] Тестовая ошибка отправлена (проверить в Sentry)
- [ ] Алерты настроены (см. `SENTRY_ALERTS.md`)
- [ ] Интеграции настроены (Slack/Email)

---

## 🧪 Тестирование

### Проверка что Sentry работает

1. Откройте страницу с ошибкой (в development)
2. Или добавьте тестовую ошибку:

```typescript
// В любом компоненте (для теста)
import * as Sentry from '@sentry/nextjs'

Sentry.captureException(new Error('Test error from Sentry setup'))
```

3. Проверьте в Sentry Dashboard → **Issues** что ошибка появилась

---

## 🔗 Полезные ссылки

- Sentry Dashboard: https://sentry.io
- Sentry API: https://docs.sentry.io/api/
- Sentry CLI: https://docs.sentry.io/cli/

---

**Sentry Token:** `82a4d7aaaf2d11f092a62ea79c10f815`  
**Последнее обновление:** 2025-01-XX  
**Статус:** ✅ Готово к настройке


