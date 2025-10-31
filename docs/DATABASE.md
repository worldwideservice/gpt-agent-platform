# Database Management

Этот документ описывает управление базой данных проекта, включая migrations и seeding.

## 🗂️ Структура базы данных

Проект использует PostgreSQL с Supabase. Основные компоненты:

- **Users**: Управление пользователями и организациями
- **AI Agents**: Конфигурация и состояние агентов
- **Knowledge Base**: Категории и статьи базы знаний
- **CRM Integration**: Подключения к CRM системам
- **Analytics**: Статистика использования и событий
- **Billing**: Подписки и платежи
- **Jobs**: Background processing задач

## 🚀 Migrations

### Создание новой migration

1. Создайте SQL файл в `supabase/migrations/`
2. Используйте формат: `description_name.sql`
3. Пример:

```sql
-- Add new feature to users table
ALTER TABLE users ADD COLUMN new_feature TEXT;
CREATE INDEX idx_users_new_feature ON users(new_feature);
```

### Запуск migrations

```bash
# Запустить все pending migrations
npm run db:migrate

# Проверить статус migrations
npm run db:migrate:status

# Полная настройка БД (migrations + seed)
npm run db:setup
```

### Структура migration файла

```sql
-- Migration: add_user_preferences
-- Description: Add user preferences table for personalization

-- Up migration
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- RLS Policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);
```

## 🌱 Seeding данных

### Запуск seeding

```bash
# Запустить все seed скрипты
npm run db:seed

# Сбросить и перезаполнить данные
npm run db:seed:reset

# Проверить статус seeding
npm run db:seed:status

# Seed только определенные данные
npm run db:seed knowledge  # Только база знаний
npm run db:seed emails     # Только email шаблоны
npm run db:seed plans      # Только тарифные планы
```

### Структура seed данных

Seed данные находятся в `scripts/seed/seed.js`. Основные категории:

- **Knowledge Base**: Категории и статьи документации
- **Email Templates**: Шаблоны email рассылок
- **Subscription Plans**: Тарифные планы и ограничения
- **Sample Data**: Примеры для демонстрации

## 📊 Background Jobs

### Управление job'ами

Проект поддерживает background processing для тяжелых операций:

- **File Processing**: Анализ, конвертация, сжатие файлов
- **Report Generation**: Создание аналитических отчетов
- **Bulk Operations**: Массовый импорт/экспорт данных
- **Model Fine-tuning**: Тонкая настройка AI моделей

### API для jobs

```typescript
// Добавить задачу в очередь
POST /api/jobs
{
  "type": "process-large-file",
  "payload": {
    "fileId": "file-123",
    "operation": "analyze"
  }
}

// Получить статус задач
GET /api/jobs/status?jobId=job-123
GET /api/jobs/status?limit=10&offset=0
```

### Таблица job_status

```sql
CREATE TABLE job_status (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  user_id TEXT NOT NULL,
  organization_id TEXT,
  payload JSONB,
  progress JSONB,
  result JSONB,
  error TEXT,
  duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Development Workflow

### Локальная разработка

1. **Настройка БД**:
   ```bash
   # Запуск PostgreSQL локально или через Docker
   npm run docker:redis  # Для Redis (jobs queue)

   # Инициализация Supabase
   supabase start
   ```

2. **Migrations & Seed**:
   ```bash
   npm run db:setup
   ```

3. **Проверка состояния**:
   ```bash
   npm run db:migrate:status
   npm run db:seed:status
   ```

### Production deployment

1. **Migrations**: Автоматически запускаются при деплое
2. **Seed**: Запускается только при первой настройке
3. **Backup**: Регулярные бэкапы через Supabase

## 📈 Мониторинг и обслуживание

### Health Checks

```bash
# Проверка состояния БД
curl https://your-app.com/api/health

# Проверка Redis
npm run check:redis

# Проверка worker'а
npm run check:worker
```

### Cleanup

```bash
# Очистка старых job'ов
# (автоматически через cron)

# Очистка логов
# (через log rotation)
```

### Performance

- **Indexes**: Проверяйте и добавляйте индексы для часто используемых запросов
- **Partitioning**: Для больших таблиц (usage_daily, job_status)
- **Archiving**: Перенос старых данных в архив

## 🚨 Troubleshooting

### Common Issues

1. **Migration failed**:
   ```bash
   # Проверить статус
   npm run db:migrate:status

   # Откатить последнюю migration (если возможно)
   npm run db:migrate rollback <version>
   ```

2. **Seed data conflict**:
   ```bash
   # Сбросить данные
   npm run db:seed:reset

   # Перезапустить seeding
   npm run db:seed
   ```

3. **Job queue stuck**:
   ```bash
   # Перезапустить worker
   npm run check:worker

   # Очистить очередь (осторожно!)
   # Manual Redis cleanup
   ```

### Logs

```bash
# Worker logs
tail -f services/worker/logs/worker.log

# API logs
tail -f logs/api.log

# Database logs (Supabase dashboard)
```

## 📚 Ссылки

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [BullMQ Docs](https://docs.bullmq.io/)
- [Migration Best Practices](https://supabase.com/docs/guides/migrations)
