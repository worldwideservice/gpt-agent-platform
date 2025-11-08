# 🔐 Настройка GitHub Secrets для CI/CD

> Инструкция по настройке GitHub Secrets для автоматического деплоя через GitHub Actions

## 📋 Необходимые Secrets

Для работы CI/CD pipeline нужны следующие GitHub Secrets:

### Обязательные для деплоя:
1. `VERCEL_TOKEN` - токен доступа к Vercel API
2. `VERCEL_ORG_ID` - ID организации Vercel
3. `VERCEL_PROJECT_ID` - ID проекта Vercel
4. `RAILWAY_TOKEN` - токен доступа к Railway API (для деплоя Worker)
5. `SUPABASE_URL` - URL Supabase проекта (для миграций БД)
6. `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key Supabase (для миграций БД)

### Опциональные:
- `WORKER_HEALTH_CHECK_URL` - URL для health check Worker сервиса
- `PRODUCTION_URL` - Production URL для Lighthouse CI (если отличается от дефолтного)

---

## 🔍 Текущие значения проекта

### ✅ Найдено в проекте:

**Organization ID:**
```
world-wide-services-62780b79
```

**Organization ID (team):**
```
team_eYhYqLCO9dqINAo5SeQGntIH
```

**Project ID:**
```
prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv
```

**Project Name:**
```
gpt-agent-kwid
```

---

## 🔑 Шаг 1: Создание Vercel Token

### ✅ Токен уже создан

Vercel Token для CI/CD уже готов:
- **Токен:** `g5wBHt7TxDknUEIHchTJUHEK` (⚠️ Не коммитьте в репозиторий!)

### 📋 Если нужно создать новый токен:

1. Откройте [Vercel Dashboard](https://vercel.com/account/tokens)
2. Перейдите в **Settings** → **Tokens**
3. Нажмите **Create Token**
4. Введите название: `GitHub Actions CI/CD`
5. Выберите срок действия:
   - **No Expiration** (для production)
   - Или выберите срок (например, 1 год)
6. Нажмите **Create Token**
7. **⚠️ ВАЖНО:** Скопируйте токен сразу - он больше не будет показан!

---

## 📝 Шаг 2: Добавление Secrets в GitHub

### Через GitHub Dashboard

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **New repository secret**
4. Добавьте каждый secret:

#### Secret 1: VERCEL_TOKEN
- **Name:** `VERCEL_TOKEN`
- **Value:** `g5wBHt7TxDknUEIHchTJUHEK`
- **Add secret**

#### Secret 2: VERCEL_ORG_ID
- **Name:** `VERCEL_ORG_ID`
- **Value:** `team_eYhYqLCO9dqINAo5SeQGntIH`
- **Add secret**

#### Secret 3: VERCEL_PROJECT_ID
- **Name:** `VERCEL_PROJECT_ID`
- **Value:** `prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv`
- **Add secret**

#### Secret 4: RAILWAY_TOKEN
- **Name:** `RAILWAY_TOKEN`
- **Value:** Ваш Railway API токен
- **Как получить:**
  1. Откройте [Railway Dashboard](https://railway.app)
  2. Перейдите в **Settings** → **Tokens**
  3. Нажмите **New Token**
  4. Скопируйте токен
- **Add secret**

#### Secret 5: SUPABASE_URL
- **Name:** `SUPABASE_URL`
- **Value:** `https://rpzchsgutabxeabbnwas.supabase.co` (или ваш URL)
- **Как получить:**
  1. Откройте [Supabase Dashboard](https://app.supabase.com)
  2. Выберите ваш проект
  3. Перейдите в **Settings** → **API**
  4. Скопируйте **Project URL**
- **Add secret**

#### Secret 6: SUPABASE_SERVICE_ROLE_KEY
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Ваш Service Role Key
- **Как получить:**
  1. Откройте [Supabase Dashboard](https://app.supabase.com)
  2. Выберите ваш проект
  3. Перейдите в **Settings** → **API**
  4. Скопируйте **service_role** key (⚠️ Секретный ключ!)
- **Add secret**

#### Secret 7: WORKER_HEALTH_CHECK_URL (Опционально)
- **Name:** `WORKER_HEALTH_CHECK_URL`
- **Value:** URL вашего Worker сервиса на Railway
- **Пример:** `https://your-worker.railway.app`
- **Add secret**

### Через GitHub CLI (опционально)

Если у вас установлен GitHub CLI:

```bash
gh auth login  # Если еще не авторизованы

gh secret set VERCEL_TOKEN --body "g5wBHt7TxDknUEIHchTJUHEK"
gh secret set VERCEL_ORG_ID --body "team_eYhYqLCO9dqINAo5SeQGntIH"
gh secret set VERCEL_PROJECT_ID --body "prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv"
gh secret set RAILWAY_TOKEN --body "your-railway-token"
gh secret set SUPABASE_URL --body "https://your-project.supabase.co"
gh secret set SUPABASE_SERVICE_ROLE_KEY --body "your-service-role-key"
```

📋 **См. также:** [`docs/GITHUB_SECRETS_QUICK_SETUP.md`](./GITHUB_SECRETS_QUICK_SETUP.md) для быстрой настройки

---

## ✅ Шаг 3: Проверка настройки

### Проверка Secrets в GitHub

1. Перейдите в **Settings** → **Secrets and variables** → **Actions**
2. Убедитесь что все необходимые secrets видны:
   - ✅ `VERCEL_TOKEN`
   - ✅ `VERCEL_ORG_ID`
   - ✅ `VERCEL_PROJECT_ID`
   - ✅ `RAILWAY_TOKEN`
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ `WORKER_HEALTH_CHECK_URL` (опционально)

### Тестирование CI/CD

1. Создайте тестовый Pull Request или push в `main`
2. Перейдите в **Actions** tab в GitHub
3. Проверьте что workflow запустился
4. Убедитесь что деплой прошел успешно

---

## 🔒 Безопасность

### Best Practices:

1. ✅ Используйте отдельный токен для CI/CD (не личный)
2. ✅ Установите срок действия токена (если возможно)
3. ✅ Регулярно ротируйте токены (каждые 6-12 месяцев)
4. ✅ Не коммитьте токены в код
5. ✅ Используйте минимальные права доступа

### Если токен скомпрометирован:

1. Немедленно удалите токен в Vercel Dashboard
2. Создайте новый токен
3. Обновите `VERCEL_TOKEN` в GitHub Secrets
4. Проверьте логи на подозрительную активность

---

## 📊 Структура проекта Vercel

```
Organization: world-wide-services-62780b79
├── Team ID: team_eYhYqLCO9dqINAo5SeQGntIH
└── Projects:
    └── gpt-agent-kwid
        └── Project ID: prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv
            └── Production URL: https://gpt-agent-kwid.vercel.app
```

---

## 🐛 Troubleshooting

### Проблема: "Authentication failed"

**Решение:**
- Проверьте что `VERCEL_TOKEN` правильный
- Убедитесь что токен не истек
- Проверьте что токен имеет права на проект

### Проблема: "Project not found"

**Решение:**
- Проверьте `VERCEL_PROJECT_ID` - должен быть `prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv`
- Проверьте `VERCEL_ORG_ID` - должен быть `team_eYhYqLCO9dqINAo5SeQGntIH`
- Убедитесь что токен имеет доступ к организации

### Проблема: "Deployment failed"

**Решение:**
- Проверьте логи в GitHub Actions
- Проверьте логи в Vercel Dashboard
- Убедитесь что все переменные окружения настроены в Vercel

---

## 📝 Чеклист

### Vercel
- [ ] Vercel Token создан
- [ ] `VERCEL_TOKEN` добавлен в GitHub Secrets
- [ ] `VERCEL_ORG_ID` добавлен в GitHub Secrets (`team_eYhYqLCO9dqINAo5SeQGntIH`)
- [ ] `VERCEL_PROJECT_ID` добавлен в GitHub Secrets (`prj_oK3wwLSXPxenw9FvFZVeVp0xhGKv`)

### Railway (Worker)
- [ ] Railway Token создан
- [ ] `RAILWAY_TOKEN` добавлен в GitHub Secrets
- [ ] `WORKER_HEALTH_CHECK_URL` добавлен (опционально)

### Supabase (Миграции)
- [ ] `SUPABASE_URL` добавлен в GitHub Secrets
- [ ] `SUPABASE_SERVICE_ROLE_KEY` добавлен в GitHub Secrets

### Проверка
- [ ] Тестовый workflow запущен и прошел успешно
- [ ] Деплой на production работает автоматически
- [ ] Миграции БД выполняются автоматически
- [ ] Worker деплоится автоматически при изменении кода

---

## 🔗 Полезные ссылки

- [Vercel API Tokens](https://vercel.com/account/tokens)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)

---

**Последнее обновление:** 2025-01-XX  
**Статус:** ✅ Готово к настройке

