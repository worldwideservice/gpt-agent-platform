# 🔧 Настройка GitHub Workflows

**Дата:** 2025-01-26  
**Статус:** ✅ Workflows настроены и исправлены

---

## 📋 Структура Workflows

### 1. **main.yml** - Основной CI/CD Pipeline
- **Триггеры:** Push в main/develop, Pull Requests
- **Jobs:**
  - `quality` - Проверка качества кода (type-check, lint, format)
  - `test` - Тестирование (unit + e2e)
  - `build` - Сборка проекта
  - `deploy-preview` - Деплой preview для PR
  - `deploy-production` - Деплой production для main

### 2. **security.yml** - Security Scan
- **Триггеры:** Push, PR, еженедельно (воскресенье 3:00 UTC)
- **Jobs:**
  - `security-audit` - npm audit
  - `dependency-review` - Обзор зависимостей

### 3. **test.yml** - Расширенное тестирование
- **Триггеры:** Push, PR, manual
- **Jobs:**
  - `e2e-tests` - E2E тесты с запуском сервера

---

## 🔑 Необходимые GitHub Secrets

### Обязательные для деплоя:

| Secret | Описание | Где получить |
|--------|----------|--------------|
| `VERCEL_TOKEN` | Токен Vercel API | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | ID организации Vercel | Vercel Dashboard → Settings |
| `VERCEL_PROJECT_ID` | ID проекта Vercel | Vercel Dashboard → Project Settings |

### Опциональные (для тестов):

| Secret | Описание | Где получить |
|--------|----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Supabase Dashboard |
| `SUPABASE_DEFAULT_ORGANIZATION_ID` | Default Org ID | Supabase Database |

---

## ✅ Проверка Secrets

Проверьте что все secrets настроены в GitHub:

1. Откройте: https://github.com/worldwideservice/gpt-agent-platform/settings/secrets/actions
2. Убедитесь что присутствуют:
   - ✅ `VERCEL_TOKEN`
   - ✅ `VERCEL_ORG_ID`
   - ✅ `VERCEL_PROJECT_ID`
   - ✅ `NEXT_PUBLIC_SUPABASE_URL` (опционально)
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (опционально)
   - ✅ `SUPABASE_DEFAULT_ORGANIZATION_ID` (опционально)

---

## 🚀 Как работают Workflows

### При Push в main:

1. **quality** → проверка кода
2. **test** → запуск тестов
3. **build** → сборка проекта
4. **deploy-production** → деплой на Vercel Production
5. **health-check** → проверка работоспособности

### При Pull Request:

1. **quality** → проверка кода
2. **test** → запуск тестов
3. **build** → сборка проекта
4. **deploy-preview** → деплой preview версии

---

## 🔧 Troubleshooting

### Проблема: "Secret not found"

**Решение:**
1. Проверьте что secret добавлен в GitHub Settings → Secrets → Actions
2. Убедитесь что имя secret точно совпадает (чувствительно к регистру)
3. Проверьте что workflow использует правильное имя

### Проблема: "Build failed"

**Решение:**
1. Проверьте логи workflow в GitHub Actions
2. Убедитесь что все переменные окружения установлены
3. Проверьте что `npm ci` выполняется успешно

### Проблема: "Deploy failed"

**Решение:**
1. Проверьте VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
2. Убедитесь что токен не истек
3. Проверьте права доступа токена

---

## 📊 Мониторинг Workflows

- **GitHub Actions:** https://github.com/worldwideservice/gpt-agent-platform/actions
- **Vercel Deployments:** https://vercel.com/dashboard
- **Workflow Logs:** Проверьте вкладку "Actions" в репозитории

---

**Последнее обновление:** 2025-01-26  
**Статус:** ✅ Все workflows настроены и готовы к работе

