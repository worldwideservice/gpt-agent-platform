# Database Schema Documentation

> Полная документация схемы базы данных GPT Agent AI Platform
> 
> **База данных:** Supabase (PostgreSQL с расширениями)
> **Версия:** 1.0
> **Дата обновления:** 2025-01-26

## 📋 Содержание

1. [Расширения PostgreSQL](#расширения-postgresql)
2. [Основные таблицы](#основные-таблицы)
3. [CRM интеграции](#crm-интеграции)
4. [AI Agents](#ai-agents)
5. [База знаний](#база-знаний)
6. [Автоматизация](#автоматизация)
7. [Биллинг и подписки](#биллинг-и-подписки)
8. [Аналитика и метрики](#аналитика-и-метрики)
9. [Индексы и производительность](#индексы-и-производительность)
10. [RLS (Row Level Security)](#rls-row-level-security)

---

## Расширения PostgreSQL

```sql
-- UUID генерация
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Криптография
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Векторные поиски (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## Основные таблицы

### Organizations (Организации)

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Поля:**
- `id` - UUID организации
- `name` - Название организации
- `slug` - Уникальный slug для URL
- `country` - Страна организации
- `settings` - JSON настройки организации
- `created_at` - Дата создания
- `updated_at` - Дата обновления

### Users (Пользователи)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  password_hash TEXT,
  default_org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en',
  invited_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Поля:**
- `id` - UUID пользователя
- `email` - Email (уникальный)
- `full_name` - Полное имя
- `password_hash` - Хеш пароля (bcrypt)
- `default_org_id` - Организация по умолчанию
- `avatar_url` - URL аватара
- `locale` - Локаль пользователя
- `invited_at` - Дата приглашения
- `last_sign_in_at` - Последний вход
- `created_at` - Дата создания
- `updated_at` - Дата обновления

### Organization Members (Участники организации)

```sql
CREATE TABLE organization_members (
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  status TEXT NOT NULL DEFAULT 'active',
  invited_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (org_id, user_id)
);
```

**Роли:**
- `owner` - Владелец организации
- `admin` - Администратор
- `member` - Участник

**Статусы:**
- `active` - Активный
- `inactive` - Неактивный
- `suspended` - Приостановлен

---

## CRM интеграции

### CRM Connections (Подключения CRM)

```sql
CREATE TABLE crm_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'kommo',
  base_domain TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scope TEXT[],
  account_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (org_id, provider, base_domain)
);
```

**Провайдеры:**
- `kommo` - Kommo (amoCRM)

### CRM Credentials (Учетные данные CRM)

```sql
CREATE TABLE crm_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'kommo',
  client_id TEXT NOT NULL,
  client_secret TEXT NOT NULL, -- Зашифрован
  redirect_uri TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (org_id, provider)
);
```

### CRM Pipelines (Воронки CRM)

```sql
CREATE TABLE crm_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES crm_connections(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (connection_id, external_id)
);
```

### CRM Pipeline Stages (Этапы воронок)

```sql
CREATE TABLE crm_pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES crm_pipelines(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (pipeline_id, external_id)
);
```

---

## AI Agents

### Agents (Агенты ИИ)

```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  connection_id UUID REFERENCES crm_connections(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  default_model TEXT,
  owner_name TEXT,
  messages_total INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  temperature NUMERIC(3,2) NOT NULL DEFAULT 0.70,
  max_tokens INTEGER DEFAULT 2048,
  instructions TEXT,
  system_prompt TEXT,
  response_delay_seconds INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Статусы:**
- `draft` - Черновик
- `active` - Активен
- `inactive` - Неактивен
- `archived` - Архивирован

**Settings JSON структура:**
```json
{
  "checkBeforeSending": boolean,
  "funnelConfigs": FunnelConfig[],
  "channelConfigs": ChannelConfig,
  "knowledgeBaseConfig": KnowledgeBaseConfig,
  "dataAccessConfig": DataAccessConfig,
  "dataInputConfig": DataInputConfig,
  "advancedSettings": AdvancedSettings
}
```

### Agent Assets (Ресурсы агента)

```sql
CREATE TABLE agent_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  source_name TEXT,
  storage_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
```

**Типы:**
- `document` - Документ
- `pdf` - PDF файл
- `text` - Текстовый файл
- `url` - URL ресурс

**Статусы:**
- `pending` - Ожидает обработки
- `processing` - Обрабатывается
- `completed` - Завершено
- `failed` - Ошибка

---

## База знаний

### Knowledge Base Categories (Категории базы знаний)

```sql
CREATE TABLE knowledge_base_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES knowledge_base_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Knowledge Base Articles (Статьи базы знаний)

```sql
CREATE TABLE knowledge_base_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category_id UUID REFERENCES knowledge_base_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Knowledge Chunks (Чанки знаний)

```sql
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  asset_id UUID REFERENCES agent_assets(id) ON DELETE CASCADE,
  article_id UUID REFERENCES knowledge_base_articles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding VECTOR(1536), -- OpenAI text-embedding-3-large
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Функция поиска по сходству:**
```sql
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  query_embedding VECTOR(1536),
  org_uuid UUID,
  agent_uuid UUID DEFAULT NULL,
  article_uuid UUID DEFAULT NULL,
  match_count INTEGER DEFAULT 5,
  similarity_threshold DOUBLE PRECISION DEFAULT 0.3
)
RETURNS TABLE (
  id UUID,
  org_id UUID,
  agent_id UUID,
  article_id UUID,
  content TEXT,
  metadata JSONB,
  embedding VECTOR(1536),
  similarity DOUBLE PRECISION
)
```

---

## Автоматизация

### Automation Rules (Правила автоматизации)

```sql
CREATE TABLE automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  conditions JSONB DEFAULT '[]'::jsonb,
  actions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  priority INTEGER NOT NULL DEFAULT 0,
  cooldown_minutes INTEGER,
  max_executions_per_day INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Типы триггеров:**
- `lead_created` - Сделка создана
- `lead_updated` - Сделка обновлена
- `message_received` - Сообщение получено
- `stage_changed` - Этап изменен
- `time_based` - По времени
- `manual` - Вручную

### Sequences (Цепочки)

```sql
CREATE TABLE sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  trigger_conditions JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Sequence Steps (Шаги цепочки)

```sql
CREATE TABLE sequence_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  delay_minutes INTEGER NOT NULL DEFAULT 0,
  action_type TEXT NOT NULL,
  template TEXT,
  recipient TEXT,
  webhook_url TEXT,
  ai_prompt TEXT,
  task_title TEXT,
  task_description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Типы действий:**
- `send_message` - Отправить сообщение
- `create_task` - Создать задачу
- `send_email` - Отправить email
- `webhook` - Webhook
- `ai_response` - AI ответ
- `wait` - Ожидание

---

## Биллинг и подписки

### Subscriptions (Подписки)

```sql
CREATE TABLE subscriptions (
  org_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'trialing',
  token_quota BIGINT NOT NULL DEFAULT 0,
  token_used BIGINT NOT NULL DEFAULT 0,
  renews_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Планы:**
- `starter` - Стартовый
- `scale` - Масштабный
- `enterprise` - Корпоративный

**Статусы:**
- `trialing` - Пробный период
- `active` - Активна
- `canceled` - Отменена
- `past_due` - Просрочена
- `incomplete` - Не завершена

### Usage Daily (Ежедневное использование)

```sql
CREATE TABLE usage_daily (
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL,
  agent_responses INTEGER NOT NULL DEFAULT 0,
  tokens_consumed BIGINT NOT NULL DEFAULT 0,
  interactions INTEGER NOT NULL DEFAULT 0,
  errors INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (org_id, usage_date)
);
```

---

## Аналитика и метрики

### Activity Logs (Логи активности)

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Job Status (Статусы задач)

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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Типы задач:**
- `file_processing` - Обработка файла
- `report_generation` - Генерация отчета
- `bulk_processing` - Массовая обработка
- `model_finetuning` - Дообучение модели

**Статусы:**
- `pending` - Ожидает
- `processing` - Обрабатывается
- `completed` - Завершено
- `failed` - Ошибка

---

## Индексы и производительность

### Основные индексы

```sql
-- Organizations
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_default_org ON users(default_org_id);

-- Agents
CREATE INDEX IF NOT EXISTS idx_agents_org ON agents(org_id);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);

-- Knowledge chunks
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_agent ON knowledge_chunks(agent_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_article ON knowledge_chunks(article_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding ON knowledge_chunks USING ivfflat (embedding);

-- CRM
CREATE INDEX IF NOT EXISTS idx_crm_pipelines_connection ON crm_pipelines(connection_id);
CREATE INDEX IF NOT EXISTS idx_crm_pipeline_stages_pipeline ON crm_pipeline_stages(pipeline_id);

-- Activity logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_org ON activity_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
```

---

## RLS (Row Level Security)

### Включение RLS

```sql
-- Включить RLS для всех таблиц
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
-- ... и т.д.
```

### Примеры политик

```sql
-- Пользователи могут видеть только свои организации
CREATE POLICY "Users can view their organizations" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Пользователи могут видеть только агентов своей организации
CREATE POLICY "Users can view their org agents" ON agents
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );
```

---

## Миграции

Все миграции находятся в `supabase/migrations/`:

1. `000_init_migration_system.sql` - Система миграций
2. `add_agent_pipeline_settings.sql` - Настройки воронок агентов
3. `add_agent_memory.sql` - Память агентов
4. `add_agent_integrations.sql` - Интеграции агентов
5. `add_rule_engine.sql` - Движок правил
6. `add_sequences.sql` - Цепочки
7. `add_billing.sql` - Биллинг
8. `add_analytics.sql` - Аналитика
9. `add_company_knowledge.sql` - База знаний компании
10. `add_crm_tasks_and_calls.sql` - Задачи и звонки CRM
11. `add_email_templates.sql` - Шаблоны email
12. `add_job_processing.sql` - Обработка задач
13. `add_activity_logs.sql` - Логи активности
14. `enable_rls_policies.sql` - Политики RLS

---

## Примечания

- Все таблицы используют `TIMESTAMPTZ` для временных меток
- UUID используются для всех первичных ключей
- JSONB используется для гибких настроек и метаданных
- Векторные поиски используют pgvector расширение
- RLS включен для всех таблиц с пользовательскими данными

---

**Дата создания:** 2025-01-26  
**Версия:** 1.0  
**База данных:** Supabase (PostgreSQL 15+)

