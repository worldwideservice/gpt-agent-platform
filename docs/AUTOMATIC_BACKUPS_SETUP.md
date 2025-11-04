# 💾 Настройка автоматических бэкапов Supabase

**Дата создания:** 2025-01-26  
**Версия:** 1.0

---

## 📋 Обзор

Это руководство описывает настройку автоматических ежедневных бэкапов базы данных Supabase с использованием cron.

---

## 🚀 Быстрая настройка

### Шаг 1: Убедитесь, что скрипт готов

```bash
# Проверить права на выполнение
chmod +x scripts/backup-database-cron.sh

# Проверить, что скрипт работает (тестовый запуск)
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
./scripts/backup-database-cron.sh
```

### Шаг 2: Настройка cron

#### macOS/Linux:

```bash
# Открыть crontab
crontab -e

# Добавить задачу (ежедневно в 2:00)
0 2 * * * cd /path/to/project && export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key && ./scripts/backup-database-cron.sh >> /var/log/backup.log 2>&1
```

#### Windows (используя Task Scheduler):

1. Откройте Task Scheduler
2. Create Basic Task
3. Настройте:
   - Trigger: Daily at 2:00 AM
   - Action: Start a program
   - Program: `bash` (или `wsl` если используете WSL)
   - Arguments: `-c "cd /path/to/project && export SUPABASE_SERVICE_ROLE_KEY=your-key && ./scripts/backup-database-cron.sh"`

---

## 🔐 Безопасное хранение секретов

### Вариант 1: Использование переменных окружения системы

**macOS/Linux:**

```bash
# Добавить в ~/.bashrc или ~/.zshrc
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# В crontab использовать без export:
0 2 * * * cd /path/to/project && ./scripts/backup-database-cron.sh >> /var/log/backup.log 2>&1
```

### Вариант 2: Использование файла с секретами

**Создайте файл `scripts/.backup-secrets.sh`:**

```bash
#!/bin/bash
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Установите права:**

```bash
chmod 600 scripts/.backup-secrets.sh  # Только для чтения владельцем
```

**Обновите crontab:**

```bash
0 2 * * * cd /path/to/project && source scripts/.backup-secrets.sh && ./scripts/backup-database-cron.sh >> /var/log/backup.log 2>&1
```

**Важно:** Добавьте `scripts/.backup-secrets.sh` в `.gitignore`!

---

## 📊 Мониторинг бэкапов

### Проверка статуса бэкапов

```bash
# Проверить последний бэкап
./scripts/check-backup-status.sh
```

### Просмотр логов

```bash
# Просмотр логов cron (macOS)
tail -f /var/log/cron.log

# Просмотр логов бэкапов
tail -f /var/log/backup.log
```

### Настройка уведомлений при ошибках

**Создайте скрипт `scripts/backup-with-notification.sh`:**

```bash
#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/var/log/backup.log"
EMAIL="admin@yourdomain.com"

# Запустить бэкап
if ./scripts/backup-database-cron.sh >> "$LOG_FILE" 2>&1; then
  echo "✅ Бэкап успешно создан" | mail -s "Backup Success" "$EMAIL"
else
  echo "❌ Ошибка при создании бэкапа. Проверьте логи: $LOG_FILE" | mail -s "Backup Failed" "$EMAIL"
  exit 1
fi
```

**Обновите crontab:**

```bash
0 2 * * * cd /path/to/project && ./scripts/backup-with-notification.sh
```

---

## 🧹 Автоматическая очистка старых бэкапов

### Настройка автоматической очистки

Добавьте в crontab (после создания бэкапа):

```bash
# Ежедневно в 2:00 создавать бэкап, затем в 2:30 очищать старые
0 2 * * * cd /path/to/project && export SUPABASE_SERVICE_ROLE_KEY=your-key && ./scripts/backup-database-cron.sh >> /var/log/backup.log 2>&1
30 2 * * * cd /path/to/project && ./scripts/cleanup-old-backups.sh 30 >> /var/log/backup.log 2>&1
```

Или объедините в один скрипт `scripts/backup-and-cleanup.sh`:

```bash
#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Создать бэкап
./scripts/backup-database-cron.sh

# Очистить старые бэкапы (старше 30 дней)
./scripts/cleanup-old-backups.sh 30
```

**Обновите crontab:**

```bash
0 2 * * * cd /path/to/project && export SUPABASE_SERVICE_ROLE_KEY=your-key && ./scripts/backup-and-cleanup.sh >> /var/log/backup.log 2>&1
```

---

## ☁️ Развертывание на облачных сервисах

### Railway

**Вариант 1: Использование Railway Cron Jobs**

1. Откройте Railway Dashboard
2. Создайте новый сервис "backup-cron"
3. Используйте Dockerfile:

```dockerfile
FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    postgresql-client \
    cron \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY scripts/ ./scripts/
RUN chmod +x ./scripts/*.sh

# Настроить cron
RUN echo "0 2 * * * cd /app && export SUPABASE_SERVICE_ROLE_KEY=\$SUPABASE_SERVICE_ROLE_KEY && ./scripts/backup-database-cron.sh >> /var/log/backup.log 2>&1" | crontab -

CMD ["cron", "-f"]
```

**Вариант 2: Использование Railway Scheduled Tasks**

1. Создайте новый сервис
2. Настройте Schedule: `0 2 * * *` (ежедневно в 2:00)
3. Command: `./scripts/backup-database-cron.sh`

### Vercel Cron Jobs

**Создайте `vercel.json`:**

```json
{
  "crons": [
    {
      "path": "/api/backup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Создайте API route `app/api/backup/route.ts`:**

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout, stderr } = await execAsync('./scripts/backup-database-cron.sh');
    return Response.json({ success: true, output: stdout });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

---

## 📊 Мониторинг и отчеты

### Еженедельный отчет

**Создайте скрипт `scripts/backup-weekly-report.sh`:**

```bash
#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
EMAIL="admin@yourdomain.com"

# Собрать статистику
TOTAL_BACKUPS=$(find "$BACKUP_DIR" -name "supabase_backup_*.dump" -o -name "supabase_backup_*.sql" 2>/dev/null | wc -l | tr -d ' ')
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
LATEST_BACKUP=$(find "$BACKUP_DIR" -name "supabase_backup_*.dump" -o -name "supabase_backup_*.sql" -type f -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | cut -d' ' -f2-)

REPORT="
📊 Еженедельный отчет по бэкапам
================================

Всего бэкапов: $TOTAL_BACKUPS
Общий размер: $TOTAL_SIZE
Последний бэкап: $(basename "$LATEST_BACKUP")

Статус: ✅ Все бэкапы создаются регулярно
"

echo "$REPORT" | mail -s "Weekly Backup Report" "$EMAIL"
```

**Добавьте в crontab (каждый понедельник в 9:00):**

```bash
0 9 * * 1 cd /path/to/project && ./scripts/backup-weekly-report.sh
```

---

## 🔄 Тестирование восстановления

### Регулярное тестирование

**Создайте скрипт `scripts/test-backup-restore.sh`:**

```bash
#!/bin/bash

# Создать тестовый бэкап
./scripts/backup-database.sh

# Восстановить в тестовую БД (требует настройки тестового проекта Supabase)
# PGPASSWORD="$TEST_SUPABASE_SERVICE_ROLE_KEY" pg_restore \
#   -h test-db.supabase.co \
#   -p 5432 \
#   -U postgres \
#   -d postgres \
#   -c \
#   latest_backup.dump

echo "✅ Тест восстановления завершен"
```

**Добавьте в crontab (раз в месяц):**

```bash
0 3 1 * * cd /path/to/project && ./scripts/test-backup-restore.sh >> /var/log/backup-test.log 2>&1
```

---

## 📚 Дополнительные ресурсы

- [Supabase Backups Documentation](https://supabase.com/docs/guides/platform/backups)
- [PostgreSQL Backup Best Practices](https://www.postgresql.org/docs/current/backup.html)
- [Cron Documentation](https://man7.org/linux/man-pages/man5/crontab.5.html)

---

## ✅ Чеклист настройки

- [ ] Скрипт `backup-database-cron.sh` проверен и работает
- [ ] Cron задача настроена
- [ ] Секреты хранятся безопасно
- [ ] Логи настроены
- [ ] Уведомления при ошибках настроены (опционально)
- [ ] Автоматическая очистка старых бэкапов настроена
- [ ] Еженедельный отчет настроен (опционально)
- [ ] Тестирование восстановления настроено (опционально)

---

**Последнее обновление:** 2025-01-26

