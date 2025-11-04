# 🚀 Инструкции по деплою на Railway и Vercel

**Дата:** 2025-01-26  
**Статус:** ✅ Готово к использованию

---

## 📋 Обзор

Это руководство описывает процесс деплоя:
- **Worker** на Railway
- **Frontend** на Vercel

---

## 🚂 Деплой Worker на Railway

### Вариант 1: Автоматический деплой (рекомендуется)

**Railway автоматически деплоит при push в main branch:**

1. **Закоммитьте изменения:**
   ```bash
   git add .
   git commit -m "Fix Worker metrics endpoints"
   git push origin main
   ```

2. **Railway автоматически:**
   - Обнаружит изменения
   - Соберет образ
   - Задеплоит Worker
   - Перезапустит сервис

3. **Проверьте статус:**
   - Откройте: https://railway.app
   - Выберите проект → Worker service
   - Проверьте статус деплоя

### Вариант 2: Через Railway Dashboard

1. **Откройте Railway Dashboard:**
   - https://railway.app
   - Выберите проект "athletic-unity"
   - Выберите сервис "gpt-agent-platform" (Worker)

2. **Инициируйте деплой:**
   - Нажмите "Deploy" или "Redeploy"
   - Или дождитесь автоматического деплоя

3. **Проверьте логи:**
   - Откройте вкладку "Logs"
   - Убедитесь, что Worker запустился без ошибок

### Вариант 3: Через Railway CLI

```bash
# Установить Railway CLI (если еще не установлен)
npm i -g @railway/cli

# Авторизоваться
railway login

# Перейти в директорию Worker
cd services/worker

# Деплой
railway up
```

### Вариант 4: Через скрипт

```bash
./scripts/deploy-worker-railway.sh
```

---

## 🌐 Деплой Frontend на Vercel

### Вариант 1: Автоматический деплой (рекомендуется)

**Vercel автоматически деплоит при push в main branch:**

1. **Закоммитьте изменения:**
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```

2. **Vercel автоматически:**
   - Обнаружит изменения
   - Соберет проект
   - Задеплоит Frontend
   - Создаст preview для PR

3. **Проверьте статус:**
   - Откройте: https://vercel.com/dashboard
   - Выберите проект
   - Проверьте статус деплоя

### Вариант 2: Через Vercel Dashboard

1. **Откройте Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Выберите проект

2. **Инициируйте деплой:**
   - Нажмите "Redeploy" на последнем деплое
   - Или дождитесь автоматического деплоя

### Вариант 3: Через Vercel CLI

```bash
# Установить Vercel CLI (если еще не установлен)
npm i -g vercel

# Авторизоваться
vercel login

# Production деплой
vercel --prod

# Или preview деплой
vercel
```

### Вариант 4: Через скрипт

```bash
./scripts/deploy-frontend-vercel.sh
```

---

## ✅ Проверка после деплоя

### Проверка Worker

```bash
# Health Check
curl https://gpt-agent-platform-production.up.railway.app/health

# Metrics (JSON)
curl https://gpt-agent-platform-production.up.railway.app/metrics

# Prometheus Metrics
curl https://gpt-agent-platform-production.up.railway.app/metrics/prometheus
```

Или используйте скрипт:

```bash
./scripts/verify-deployments.sh
```

### Проверка Frontend

```bash
# Health Check
curl https://gpt-agent-kwid.vercel.app/api/health

# Ready Check
curl https://gpt-agent-kwid.vercel.app/api/health/ready
```

---

## 🔧 Troubleshooting

### Worker не деплоится

1. **Проверьте логи в Railway:**
   - Откройте Railway Dashboard → Logs
   - Найдите ошибки сборки или запуска

2. **Проверьте переменные окружения:**
   - Railway Dashboard → Variables
   - Убедитесь, что все переменные установлены

3. **Проверьте Dockerfile:**
   - Убедитесь, что `services/worker/Dockerfile` корректен

### Frontend не деплоится

1. **Проверьте логи в Vercel:**
   - Откройте Vercel Dashboard → Deployments → Logs
   - Найдите ошибки сборки

2. **Проверьте переменные окружения:**
   - Vercel Dashboard → Settings → Environment Variables
   - Убедитесь, что все переменные установлены

3. **Проверьте сборку локально:**
   ```bash
   npm run build
   ```

### Worker Metrics endpoints возвращают 404

**Причина:** Worker не перезапустился после изменений в коде

**Решение:**
1. Перезапустить Worker в Railway Dashboard
2. Или сделать новый коммит и push (автоматический деплой)

**Проверка после перезапуска:**
```bash
curl https://gpt-agent-platform-production.up.railway.app/metrics
```

---

## 📊 Мониторинг деплоев

### Railway

- **Dashboard:** https://railway.app
- **Logs:** Railway Dashboard → Service → Logs
- **Metrics:** Railway Dashboard → Service → Metrics
- **Deployments:** Railway Dashboard → Service → Deployments

### Vercel

- **Dashboard:** https://vercel.com/dashboard
- **Logs:** Vercel Dashboard → Project → Deployments → Logs
- **Analytics:** Vercel Dashboard → Project → Analytics
- **Deployments:** Vercel Dashboard → Project → Deployments

---

## 🚀 Быстрый деплой всего проекта

### 1. Закоммитьте все изменения

```bash
git add .
git commit -m "Production ready: all services tested and configured"
git push origin main
```

### 2. Дождитесь автоматического деплоя

- **Railway:** автоматически задеплоит Worker
- **Vercel:** автоматически задеплоит Frontend

### 3. Проверьте деплои

```bash
./scripts/verify-deployments.sh
```

---

## ✅ Чеклист перед деплоем

- [ ] Все изменения закоммичены
- [ ] Переменные окружения установлены в Railway
- [ ] Переменные окружения установлены в Vercel
- [ ] Локальная сборка проходит успешно
- [ ] Тесты пройдены (если есть)
- [ ] Документация обновлена

---

## 📚 Дополнительные ресурсы

- **Railway Documentation:** https://docs.railway.app
- **Vercel Documentation:** https://vercel.com/docs
- **Railway CLI:** https://docs.railway.app/develop/cli
- **Vercel CLI:** https://vercel.com/docs/cli

---

**Последнее обновление:** 2025-01-26

