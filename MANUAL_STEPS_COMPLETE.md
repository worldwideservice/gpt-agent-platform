# ✅ Выполнение ручных шагов - Инструкции

**Дата:** 2025-01-26  
**Статус:** Скрипты созданы для автоматизации ручных шагов

---

## 🎯 Два ручных шага

### 1. Настройка cron для бэкапов

**Требуется:** `SUPABASE_SERVICE_ROLE_KEY`

#### Вариант A: Автоматически через Vercel CLI (если авторизован)

```bash
./scripts/setup-cron-from-vercel.sh
```

#### Вариант B: Вручную через браузер

1. Откройте: https://vercel.com/world-wide-services-62780b79/gpt-agent-kwid/settings/environment-variables
2. Найдите `SUPABASE_SERVICE_ROLE_KEY` для **Production**
3. Нажмите **"Click to reveal"** и скопируйте значение
4. Выполните:

```bash
export SUPABASE_SERVICE_ROLE_KEY=your-key-here
./scripts/setup-backup-cron-auto.sh
```

#### Вариант C: Из локального .env.local

```bash
# Если ключ уже в .env.local
source .env.local
./scripts/setup-backup-cron-auto.sh
```

---

### 2. Добавление RAILWAY_TOKEN в GitHub Secrets

**Требуется:** Railway API Token

#### Вариант A: Автоматически через скрипт

1. Получите токен:
   - Откройте: https://railway.app/account/tokens
   - Нажмите на **"Railway API Token - Production 2025"**
   - Скопируйте полный токен (не только ****-ef8a)

2. Выполните:

```bash
./scripts/add-railway-token-to-github.sh <your-token>
```

Или:

```bash
export RAILWAY_TOKEN=your-token-here
./scripts/add-railway-token-to-github.sh
```

#### Вариант B: Вручную через GitHub Dashboard

1. Откройте: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions
2. Нажмите **"New repository secret"**
3. Name: `RAILWAY_TOKEN`
4. Value: вставьте токен из Railway
5. Нажмите **"Add secret"**

---

## 📋 Созданные скрипты

1. **`scripts/setup-cron-from-vercel.sh`**
   - Автоматически получает `SUPABASE_SERVICE_ROLE_KEY` из Vercel
   - Настраивает cron для бэкапов

2. **`scripts/add-railway-token-to-github.sh`**
   - Добавляет Railway Token в GitHub Secrets
   - Использует GitHub CLI

3. **`scripts/setup-backup-cron-auto.sh`**
   - Настраивает cron для автоматических бэкапов
   - Требует `SUPABASE_SERVICE_ROLE_KEY` в переменных окружения

---

## ✅ Проверка после выполнения

### Проверка cron:

```bash
crontab -l | grep backup
```

Должно быть:
```
0 2 * * * cd /path/to/project && source scripts/.backup-secrets.sh && ./scripts/backup-database-cron.sh >> logs/backup.log 2>&1
```

### Проверка GitHub Secrets:

```bash
gh secret list | grep RAILWAY_TOKEN
```

Должно быть:
```
RAILWAY_TOKEN  Updated less than a minute ago
```

---

## 🎯 Следующие шаги

После выполнения обоих шагов:

1. ✅ Cron настроен - бэкапы будут создаваться ежедневно в 2:00 AM
2. ✅ RAILWAY_TOKEN добавлен - CI/CD pipeline может использовать Railway API

---

**Примечание:** Если возникают проблемы, используйте ручной вариант (Вариант B) для обоих шагов.

