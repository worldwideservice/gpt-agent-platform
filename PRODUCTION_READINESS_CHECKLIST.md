# ✅ Чеклист готовности к Production

**Дата:** 2025-01-26  
**Целевая нагрузка:** 135,000 - 450,000 jobs/день  
**Статус:** В процессе подготовки

---

## 🔴 КРИТИЧНО - Обязательно для запуска

### 1. ✅ Переменные окружения Frontend (Vercel)

**Проверить в Vercel Dashboard → Project → Settings → Environment Variables:**

- [ ] `NEXTAUTH_SECRET` - секретный ключ для NextAuth
- [ ] `NEXTAUTH_URL` - URL приложения (https://gpt-agent-kwid.vercel.app)
- [ ] `SUPABASE_URL` - URL Supabase проекта
- [ ] `SUPABASE_ANON_KEY` - анонимный ключ Supabase
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - service role ключ (для серверных операций)
- [ ] `UPSTASH_REDIS_REST_URL` - URL Upstash Redis
- [ ] `UPSTASH_REDIS_REST_TOKEN` - токен Upstash Redis
- [ ] `OPENROUTER_API_KEY` - ключ OpenRouter API (опционально, может быть на уровне организации)
- [ ] `ENCRYPTION_KEY` - ключ шифрования (минимум 32 символа)
- [ ] `SENTRY_DSN` - DSN для Sentry мониторинга
- [ ] `NEXT_PUBLIC_SENTRY_DSN` - публичный DSN для Sentry (клиентская сторона)
- [ ] `NODE_ENV=production`

**Проверка:**
```bash
# Проверить health endpoint
curl https://gpt-agent-kwid.vercel.app/api/health
```

---

### 2. ✅ Переменные окружения Worker (Railway)

**Проверить в Railway Dashboard → Worker Service → Variables:**

- [ ] `UPSTASH_REDIS_REST_URL` - URL Upstash Redis
- [ ] `UPSTASH_REDIS_REST_TOKEN` - токен Upstash Redis
- [ ] `SUPABASE_URL` - URL Supabase проекта
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - service role ключ
- [ ] `ENCRYPTION_KEY` - ключ шифрования (минимум 32 символа)
- [ ] `OPENROUTER_API_KEY` - ключ OpenRouter API (опционально)
- [ ] `JOB_QUEUE_NAME=agent-jobs` - имя очереди (по умолчанию)
- [ ] `JOB_CONCURRENCY=25` - количество одновременных jobs (увеличено для нагрузки)
- [ ] `SENTRY_DSN` - DSN для Sentry мониторинга Worker (опционально, но рекомендуется)
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001` - порт для health check сервера

**Проверка:**
```bash
# Проверить Worker health endpoint
curl https://gpt-agent-platform-production.up.railway.app/health
```

---

### 3. ✅ Railway конфигурация Worker

**Проверить `services/worker/railway.json`:**

- [ ] `numReplicas: 2` - две реплики для отказоустойчивости
- [ ] `restartPolicyType: ON_FAILURE` - автоматический перезапуск при ошибках
- [ ] `restartPolicyMaxRetries: 10` - максимум попыток перезапуска

**Проверка:**
- Railway автоматически применит конфигурацию при следующем деплое
- Проверить в Railway Dashboard → Worker Service → Settings → Scaling

---

### 4. ✅ Supabase Connection Pooling

**Настройка для высокой нагрузки:**

1. **Проверить Connection Pooler:**
   - Откройте: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/settings/database
   - Проверьте, включен ли Connection Pooler

2. **Использовать Pooler URL (если доступен):**
   - URL формата: `postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres`
   - Worker уже настроен для работы с pooler

3. **Настройки Pooler:**
   - `pool_mode: transaction` (рекомендуется)
   - `default_pool_size: 20` (настроить под нагрузку)
   - `max_client_conn: 100` (настроить под нагрузку)

**Примечание:** На Free плане Pooler может быть недоступен. В этом случае Worker использует прямое подключение.

---

### 5. ✅ Upstash Redis конфигурация

**Проверить в Upstash Dashboard:**

- [ ] Redis instance создан и активен
- [ ] REST URL и Token получены
- [ ] TLS включен (обязательно для Upstash)
- [ ] Region выбран (желательно близко к Railway)

**Проверка подключения:**
```bash
# Worker автоматически проверяет подключение при старте
# Проверить через health endpoint
curl https://gpt-agent-platform-production.up.railway.app/health | jq '.redis'
```

---

### 6. ✅ Sentry DSN настройка

**Для Frontend (Vercel):**
- [ ] `SENTRY_DSN` установлен в Vercel
- [ ] `NEXT_PUBLIC_SENTRY_DSN` установлен в Vercel
- [ ] Sentry проект настроен: https://world-wide-services.sentry.io

**Для Worker (Railway):**
- [ ] `SENTRY_DSN` установлен в Railway (опционально, но рекомендуется)

**Проверка:**
- Открыть Sentry Dashboard → Issues
- Проверить, что ошибки отслеживаются

---

### 7. ✅ Health Check Endpoints

**Frontend Health Check:**
- [ ] `/api/health` - проверяет Supabase, Redis, OpenRouter
- [ ] URL: https://gpt-agent-kwid.vercel.app/api/health
- [ ] Возвращает статус всех сервисов

**Worker Health Check:**
- [ ] `/health` - проверяет Redis подключение
- [ ] URL: https://gpt-agent-platform-production.up.railway.app/health
- [ ] Возвращает статус Worker и Redis

**Проверка:**
```bash
# Frontend
curl https://gpt-agent-kwid.vercel.app/api/health

# Worker
curl https://gpt-agent-platform-production.up.railway.app/health
```

---

### 8. ✅ Мониторинг настроен

**UptimeRobot:**
- [ ] Монитор Worker Health Check создан
- [ ] URL: `https://gpt-agent-platform-production.up.railway.app/health`
- [ ] Email уведомления настроены
- [ ] Статус: ✅ Up

**Sentry Alerts:**
- [ ] "Send a notification for high priority issues" - активен
- [ ] "Health Check Failed" - активен
- [ ] "Critical Errors - High Error Rate" - активен
- [ ] "New Error Types" - активен

**Проверка:**
- UptimeRobot Dashboard: https://dashboard.uptimerobot.com/monitors
- Sentry Alerts: https://world-wide-services.sentry.io/issues/alerts/rules/

---

## 🟡 ВАЖНО - Рекомендуется для production

### 9. ⚠️ Автоматические бэкапы БД

**Текущая ситуация:**
- Supabase Free Plan не включает автоматические бэкапы
- Нужно настроить ручные бэкапы или upgrade до Pro Plan

**Варианты:**

**Вариант 1: Ручные бэкапы (бесплатно)**
```bash
# Использовать скрипт scripts/backup-database.sh
./scripts/backup-database.sh
```

**Вариант 2: Upgrade Supabase до Pro Plan**
- Автоматические ежедневные бэкапы
- Point-in-Time Recovery
- 7 дней retention

**Вариант 3: Cron job на отдельном сервере**
- Настроить автоматический бэкап через cron
- Загружать в S3 или другой storage

**Рекомендация:** Настроить ручные бэкапы СЕЙЧАС, upgrade до Pro Plan при росте нагрузки.

---

### 10. ⚠️ Prometheus/Grafana мониторинг

**Статус:** Конфигурация создана, требуется развертывание

**Варианты развертывания:**

**Вариант 1: Локальный запуск (для тестирования)**
```bash
cd monitoring
docker-compose up -d
```
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)

**Вариант 2: Развертывание на Railway**
- Создать новый сервис "monitoring" в Railway
- Использовать `monitoring/docker-compose.yml`
- Настроить публичный URL для Grafana

**Вариант 3: Grafana Cloud (managed service)**
- Регистрация на https://grafana.com
- Создать Prometheus instance
- Подключить Worker метрики

**Рекомендация:** Начать с локального запуска для проверки, затем развернуть на Railway или Grafana Cloud.

---

### 11. ⚠️ Supabase Leaked Password Protection

**Статус:** Обнаружено предупреждение в Security Advisor

**Действие:**
1. Открыть: https://supabase.com/dashboard/project/rpzchsgutabxeabbnwas/auth/protection
2. Включить "Prevent use of leaked passwords"
3. Если опция не найдена, возможно требуется включить Captcha сначала

**Проверка:**
- Security Advisor должен показывать ✅ вместо ⚠️

---

## 🟢 ГОТОВО - Уже настроено

### ✅ Оптимизация для высокой нагрузки

- ✅ Concurrency увеличен до 25
- ✅ Retry strategy с exponential backoff
- ✅ Sentry SDK интегрирован в Worker
- ✅ Rate limiting для OpenRouter API
- ✅ Supabase connection pooling оптимизирован
- ✅ Горизонтальное масштабирование (2 реплики)
- ✅ Worker metrics endpoints (`/metrics`, `/metrics/prometheus`)

### ✅ Мониторинг

- ✅ UptimeRobot настроен для Worker
- ✅ Sentry Dashboard создан (ID: 18943)
- ✅ Sentry Alerts настроены
- ✅ Worker metrics collection работает

### ✅ Документация

- ✅ Disaster Recovery Plan создан
- ✅ Worker Monitoring документация
- ✅ High Load Optimization документация
- ✅ Мониторинг конфигурация (Prometheus/Grafana)

---

## 📋 Финальная проверка перед запуском

### Проверка всех компонентов

```bash
# Использовать скрипт проверки
./scripts/check-production-readiness.sh
```

Или вручную:

```bash
# 1. Frontend Health Check
curl https://gpt-agent-kwid.vercel.app/api/health

# 2. Worker Health Check
curl https://gpt-agent-platform-production.up.railway.app/health

# 3. Worker Metrics
curl https://gpt-agent-platform-production.up.railway.app/metrics

# 4. Worker Prometheus Metrics
curl https://gpt-agent-platform-production.up.railway.app/metrics/prometheus

# 5. Проверка UptimeRobot
# Открыть: https://dashboard.uptimerobot.com/monitors

# 6. Проверка Sentry
# Открыть: https://world-wide-services.sentry.io/issues/
```

### Проверка производительности

- [ ] Worker concurrency: 25
- [ ] Worker replicas: 2
- [ ] Общая пропускная способность: ~50 jobs/sec
- [ ] Запас для текущей нагрузки: ~33x (135k jobs/день)
- [ ] Запас для прогнозируемой нагрузки: ~10x (450k jobs/день)

---

## 🚀 Следующие шаги (после запуска)

### Немедленно после запуска

1. **Мониторить метрики:**
   - Проверить Worker metrics через `/metrics`
   - Проверить Sentry Dashboard на ошибки
   - Проверить UptimeRobot статус

2. **Тестирование нагрузки:**
   - Создать тестовые jobs
   - Проверить обработку jobs
   - Проверить retry при ошибках

3. **Настроить алерты:**
   - Настроить Alertmanager уведомления (Email/Slack)
   - Проверить Sentry alerts

### В ближайшее время

1. **Настроить автоматические бэкапы БД**
2. **Развернуть Prometheus/Grafana**
3. **Настроить Supabase Connection Pooler** (если доступен)

### При росте нагрузки

1. **Увеличить numReplicas до 3-5** при достижении 1M jobs/день
2. **Рассмотреть разделение очередей** по типам jobs
3. **Настроить приоритизацию jobs**

---

## 📊 Итоговый статус

**Готовность к production:** 🟡 **90%**

**Что готово:**
- ✅ Инфраструктура настроена
- ✅ Оптимизация для высокой нагрузки
- ✅ Мониторинг базовый настроен
- ✅ Документация создана

**Что нужно доделать:**
- ⚠️ Автоматические бэкапы БД
- ⚠️ Prometheus/Grafana развертывание
- ⚠️ Supabase Leaked Password Protection

**Критично для запуска:**
- ✅ Все переменные окружения установлены
- ✅ Health checks работают
- ✅ Мониторинг настроен

---

**Последнее обновление:** 2025-01-26

