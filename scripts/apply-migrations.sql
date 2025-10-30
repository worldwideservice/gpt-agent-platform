-- Скрипт для применения миграций в Supabase SQL Editor
-- Скопируйте и выполните в Supabase Dashboard -> SQL Editor

-- ============================================
-- 1. Миграция: add_company_knowledge.sql
-- ============================================

-- Таблица знаний о компании (структурированные знания)
create table if not exists company_knowledge (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid references agents(id) on delete set null,
  category text not null,
  title text not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  pipeline_stage_id uuid references crm_pipeline_stages(id) on delete set null,
  is_global boolean default true,
  priority integer default 0,
  usage_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_company_knowledge_org on company_knowledge(org_id);
create index if not exists idx_company_knowledge_agent on company_knowledge(agent_id);
create index if not exists idx_company_knowledge_category on company_knowledge(category);
create index if not exists idx_company_knowledge_stage on company_knowledge(pipeline_stage_id);
create index if not exists idx_company_knowledge_priority on company_knowledge(priority desc);

create trigger company_knowledge_updated_at
before update on company_knowledge
for each row execute procedure trigger_set_timestamp();

-- Скрипты продаж для этапов воронки
create table if not exists sales_scripts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid references agents(id) on delete set null,
  pipeline_stage_id uuid references crm_pipeline_stages(id) on delete set null,
  title text not null,
  script_type text not null default 'greeting',
  content text not null,
  variables jsonb default '{}'::jsonb,
  conditions jsonb default '{}'::jsonb,
  effectiveness_score numeric(3,2) default 0.5,
  usage_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_sales_scripts_org on sales_scripts(org_id);
create index if not exists idx_sales_scripts_stage on sales_scripts(pipeline_stage_id);
create index if not exists idx_sales_scripts_type on sales_scripts(script_type);

create trigger sales_scripts_updated_at
before update on sales_scripts
for each row execute procedure trigger_set_timestamp();

-- Обработка возражений клиентов
create table if not exists objection_responses (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  objection_type text not null,
  objection_text text,
  response_script text not null,
  context jsonb default '{}'::jsonb,
  effectiveness_score numeric(3,2) default 0.5,
  usage_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_objection_responses_org on objection_responses(org_id);
create index if not exists idx_objection_responses_type on objection_responses(objection_type);

create trigger objection_responses_updated_at
before update on objection_responses
for each row execute procedure trigger_set_timestamp();

-- Долгосрочная память агента
create table if not exists agent_memory (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  conversation_id uuid references agent_conversations(id) on delete set null,
  memory_type text not null,
  content text not null,
  context jsonb default '{}'::jsonb,
  importance numeric(3,2) default 0.5,
  validated boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  expires_at timestamptz
);

create index if not exists idx_agent_memory_org on agent_memory(org_id);
create index if not exists idx_agent_memory_agent on agent_memory(agent_id);
create index if not exists idx_agent_memory_type on agent_memory(memory_type);
create index if not exists idx_agent_memory_importance on agent_memory(importance desc);
create index if not exists idx_agent_memory_expires on agent_memory(expires_at);

create trigger agent_memory_updated_at
before update on agent_memory
for each row execute procedure trigger_set_timestamp();

-- Связь знаний с этапами воронки
create table if not exists knowledge_pipeline_mapping (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  knowledge_id uuid references company_knowledge(id) on delete cascade,
  script_id uuid references sales_scripts(id) on delete cascade,
  pipeline_stage_id uuid not null references crm_pipeline_stages(id) on delete cascade,
  priority integer default 0,
  auto_include boolean default true,
  created_at timestamptz default now()
);

create index if not exists idx_knowledge_pipeline_mapping_stage on knowledge_pipeline_mapping(pipeline_stage_id);
create index if not exists idx_knowledge_pipeline_mapping_knowledge on knowledge_pipeline_mapping(knowledge_id);

-- Расширение knowledge_chunks
alter table knowledge_chunks add column if not exists company_knowledge_id uuid references company_knowledge(id) on delete set null;
create index if not exists idx_knowledge_chunks_company_knowledge on knowledge_chunks(company_knowledge_id);

-- ============================================
-- 2. Миграция: add_agent_pipeline_settings.sql
-- ============================================

create table if not exists agent_pipeline_settings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  pipeline_id text not null,
  is_active boolean default false,
  all_stages boolean default false,
  selected_stages text[] default '{}',
  stage_instructions jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (agent_id, pipeline_id)
);

create trigger agent_pipeline_settings_updated_at
before update on agent_pipeline_settings
for each row execute procedure trigger_set_timestamp();

create index if not exists idx_agent_pipeline_settings_agent on agent_pipeline_settings(agent_id);
create index if not exists idx_agent_pipeline_settings_org on agent_pipeline_settings(org_id);

-- ============================================
-- 3. Создание Storage bucket
-- ============================================

-- Проверка и создание bucket через SQL (если есть права)
-- Если нет прав, создайте через Supabase Dashboard -> Storage

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'agent-assets',
  'agent-assets',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/html',
    'text/markdown'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- RLS политика для bucket (только авторизованные пользователи могут загружать)
CREATE POLICY "Users can upload agent assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'agent-assets');

CREATE POLICY "Users can read own organization assets"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'agent-assets');

CREATE POLICY "Users can delete own organization assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'agent-assets');






