# ✅ Deployment Checklist

**Дата:** 2025-01-26  
**Статус:** Готово к деплою

## 🔍 Преддеплойные проверки

### 1. Локальные проверки

```bash
# ✅ TypeScript проверка
npm run type-check

# ✅ Linter проверка
npm run lint

# ✅ Unit тесты
npm run test:unit:light

# ✅ E2E тесты
npm run test:e2e:light

# ✅ Production build
npm run build
```

### 2. Переменные окружения

**Проверка переменных:**
```bash
npm run check:env
npm run verify:env
```

**Обязательные переменные для production:**
- ✅ `NEXTAUTH_SECRET` - минимум 32 символа
- ✅ `NEXTAUTH_URL` - production URL
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase Anon Key
- ✅ `SUPABASE_URL` - Supabase URL
- ✅ `SUPABASE_ANON_KEY` - Supabase Anon Key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Supabase Service Role Key
- ✅ `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- ✅ `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis Token
- ✅ `OPENROUTER_API_KEY` - OpenRouter API Key

## 🚀 Деплой на Vercel

### Автоматический деплой (через GitHub Actions)

**Триггеры:**
- Push в `main` ветку → автоматический деплой в production
- Pull Request → автоматический деплой preview

**Требуемые GitHub Secrets:**
- `VERCEL_TOKEN` - Vercel API токен
- `VERCEL_ORG_ID` - Vercel Organization ID
- `VERCEL_PROJECT_ID` - Vercel Project ID

**Workflow файлы:**
- `.github/workflows/main.yml` - основной CI/CD pipeline
- `.github/workflows/deploy-vercel.yml` - деплой на Vercel
- `.github/workflows/test.yml` - расширенные E2E тесты
- `.github/workflows/security.yml` - security audit

### Ручной деплой (через CLI)

```bash
# 1. Установка Vercel CLI (если не установлен)
npm install -g vercel

# 2. Авторизация
vercel login

# 3. Деплой
npm run deploy:vercel
# или
bash scripts/deploy-to-vercel.sh
```

## 🚂 Деплой на Railway

### Автоматический деплой (через GitHub Actions)

**Требуемые GitHub Secrets:**
- `RAILWAY_TOKEN` - Railway API токен

**Workflow:**
- `.github/workflows/deploy.yml` - деплой на Railway

### Ручной деплой

```bash
# 1. Установка Railway CLI
npm install -g @railway/cli

# 2. Авторизация
railway login

# 3. Деплой
railway up
```

## ✅ CI/CD Pipeline

### Основной Pipeline (`.github/workflows/main.yml`)

**Jobs:**
1. **Quality Check** - TypeScript, ESLint, Format
2. **Tests** - Unit + E2E тесты (не блокируют деплой)
3. **Build** - Production build
4. **Deploy Preview** - для PR
5. **Deploy Production** - для main

### Расширенные тесты (`.github/workflows/test.yml`)

- Полный набор E2E тестов
- Production build + server
- Upload артефактов

### Security Scan (`.github/workflows/security.yml`)

- npm audit
- Dependency review
- Еженедельный запуск

## 🔧 Конфигурация деплоя

### Vercel (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Railway (`railway.json`)

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## 📊 Мониторинг после деплоя

### Health Checks

```bash
# Production URL
curl https://gpt-agent-kwid-1i1j7zlgl-world-wide-services-62780b79.vercel.app/api/health
```

### Dashboards

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Upstash Dashboard:** https://upstash.com
- **Sentry Dashboard:** https://sentry.io (если настроен)

## 🐛 Troubleshooting

### Проблемы с билдом

1. Проверьте TypeScript ошибки: `npm run type-check`
2. Проверьте ESLint ошибки: `npm run lint`
3. Проверьте переменные окружения: `npm run check:env`

### Проблемы с деплоем

1. Проверьте GitHub Secrets
2. Проверьте логи в GitHub Actions
3. Проверьте логи в Vercel Dashboard

### Проблемы с тестами

1. Тесты могут пропускаться в демо-режиме (это нормально)
2. Проверьте что все зависимости установлены
3. Проверьте переменные окружения для тестов

## ✅ Чеклист перед деплоем

- [ ] Все изменения закоммичены
- [ ] TypeScript проверка прошла
- [ ] ESLint проверка прошла (warnings допустимы)
- [ ] Unit тесты прошли (некоторые могут падать)
- [ ] E2E тесты прошли (многие пропускаются в демо-режиме)
- [ ] Production build успешен
- [ ] Переменные окружения проверены
- [ ] GitHub Secrets настроены
- [ ] Health check работает

## 🎯 Production URLs

- **Production:** https://gpt-agent-kwid-1i1j7zlgl-world-wide-services-62780b79.vercel.app
- **Health Check:** https://gpt-agent-kwid-1i1j7zlgl-world-wide-services-62780b79.vercel.app/api/health

## 📝 Примечания

- Тесты не блокируют деплой (`continue-on-error: true`)
- В демо-режиме многие тесты пропускаются (это нормально)
- TypeScript ошибки блокируют деплой
- ESLint warnings не блокируют деплой

