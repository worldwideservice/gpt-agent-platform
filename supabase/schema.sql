-- Supabase schema for GPT Agent platform

-- Extensions ---------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;
create extension if not exists vector;

-- Helper function ----------------------------------------------------------
create or replace function trigger_set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Organizations ------------------------------------------------------------
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country text,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger organizations_updated_at
before update on organizations
for each row execute procedure trigger_set_timestamp();

-- Users & membership -------------------------------------------------------
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  password_hash text,
  default_org_id uuid references organizations(id) on delete set null,
  avatar_url text,
  locale text default 'en',
  invited_at timestamptz,
  last_sign_in_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger users_updated_at
before update on users
for each row execute procedure trigger_set_timestamp();

create table if not exists organization_members (
  org_id uuid references organizations(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  role text not null default 'member',
  status text not null default 'active',
  invited_by uuid references users(id),
  created_at timestamptz default now(),
  primary key (org_id, user_id)
);

create table if not exists organization_invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  role text not null default 'member',
  invited_by uuid references users(id),
  token text not null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz default now(),
  unique (org_id, email)
);

create table if not exists password_resets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz default now(),
  unique (user_id, token_hash)
);

create index if not exists idx_password_resets_token on password_resets(token_hash);
create index if not exists idx_password_resets_user on password_resets(user_id);

-- Subscriptions & usage ----------------------------------------------------
create table if not exists subscriptions (
  org_id uuid primary key references organizations(id) on delete cascade,
  plan text not null,
  status text not null default 'trialing',
  token_quota bigint not null default 0,
  token_used bigint not null default 0,
  renews_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger subscriptions_updated_at
before update on subscriptions
for each row execute procedure trigger_set_timestamp();

create table if not exists usage_daily (
  org_id uuid not null references organizations(id) on delete cascade,
  usage_date date not null,
  agent_responses integer not null default 0,
  tokens_consumed bigint not null default 0,
  interactions integer not null default 0,
  errors integer not null default 0,
  primary key (org_id, usage_date)
);

-- Organization AI Settings -------------------------------------------------
create table if not exists organization_settings (
  org_id uuid primary key references organizations(id) on delete cascade,
  ai_provider text not null default 'openrouter',
  openrouter_api_key text,
  openrouter_default_model text,
  openrouter_embedding_model text,
  openai_api_key text,
  openai_model text,
  provider_configs jsonb default '{}'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger organization_settings_updated_at
before update on organization_settings
for each row execute procedure trigger_set_timestamp();

-- CRM Connections ----------------------------------------------------------
create table if not exists crm_connections (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  provider text not null default 'kommo',
  base_domain text not null,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  scope text[],
  account_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, provider, base_domain)
);

create trigger crm_connections_updated_at
before update on crm_connections
for each row execute procedure trigger_set_timestamp();

create table if not exists crm_credentials (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  provider text not null default 'kommo',
  client_id text not null,
  client_secret text not null,
  redirect_uri text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, provider)
);

create trigger crm_credentials_updated_at
before update on crm_credentials
for each row execute procedure trigger_set_timestamp();

create table if not exists crm_pipelines (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references crm_connections(id) on delete cascade,
  external_id text not null,
  name text not null,
  is_active boolean default true,
  sort_order integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (connection_id, external_id)
);

create trigger crm_pipelines_updated_at
before update on crm_pipelines
for each row execute procedure trigger_set_timestamp();

create index if not exists idx_crm_pipelines_connection on crm_pipelines(connection_id);

create table if not exists crm_pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references crm_pipelines(id) on delete cascade,
  external_id text not null,
  name text not null,
  sort_order integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (pipeline_id, external_id)
);

create trigger crm_pipeline_stages_updated_at
before update on crm_pipeline_stages
for each row execute procedure trigger_set_timestamp();

create index if not exists idx_crm_pipeline_stages_pipeline on crm_pipeline_stages(pipeline_id);

create table if not exists oauth_states (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  provider text not null default 'kommo',
  state text not null,
  redirect_uri text not null,
  base_domain text not null,
  created_at timestamptz default now(),
  expires_at timestamptz not null default (now() + interval '15 minutes'),
  unique (provider, state)
);

create index if not exists idx_oauth_states_expires_at on oauth_states (expires_at);

-- Agents -------------------------------------------------------------------
create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  connection_id uuid references crm_connections(id) on delete set null,
  name text not null,
  status text not null default 'draft',
  default_model text,
  owner_name text,
  messages_total integer default 0,
  last_activity_at timestamptz,
  temperature numeric(3,2) not null default 0.70,
  max_tokens integer default 2048,
  instructions text,
  system_prompt text,
  response_delay_seconds integer default 0,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger agents_updated_at
before update on agents
for each row execute procedure trigger_set_timestamp();

create index if not exists idx_agents_org on agents(org_id);

-- Agent assets / knowledge --------------------------------------------------
create table if not exists agent_assets (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  type text not null,
  source_name text,
  storage_path text,
  status text not null default 'pending',
  error text,
  created_at timestamptz default now(),
  processed_at timestamptz
);

create index if not exists idx_agent_assets_agent on agent_assets(agent_id);

create table if not exists knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  asset_id uuid references agent_assets(id) on delete cascade,
  article_id uuid references knowledge_base_articles(id) on delete cascade,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz default now()
);

create index if not exists idx_knowledge_chunks_agent on knowledge_chunks(agent_id);
create index if not exists idx_knowledge_chunks_article on knowledge_chunks(article_id);
create index if not exists idx_knowledge_chunks_embedding on knowledge_chunks using ivfflat (embedding);

create or replace function match_knowledge_chunks(
  query_embedding vector(1536),
  org_uuid uuid,
  agent_uuid uuid default null,
  article_uuid uuid default null,
  match_count integer default 5,
  similarity_threshold double precision default 0.3
)
returns table (
  id uuid,
  org_id uuid,
  agent_id uuid,
  article_id uuid,
  content text,
  metadata jsonb,
  embedding vector(1536),
  similarity double precision
)
language sql
stable
as $$
  select
    kc.id,
    kc.org_id,
    kc.agent_id,
    kc.article_id,
    kc.content,
    kc.metadata,
    kc.embedding,
    1 - (kc.embedding <=> query_embedding) as similarity
  from knowledge_chunks kc
  where kc.org_id = org_uuid
    and kc.embedding is not null
    and (agent_uuid is null or kc.agent_id = agent_uuid)
    and (article_uuid is null or kc.article_id = article_uuid)
    and 1 - (kc.embedding <=> query_embedding) >= similarity_threshold
  order by kc.embedding <-> query_embedding
  limit match_count;
$$;

-- Knowledge Base ------------------------------------------------------------
create table if not exists knowledge_base_categories (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  description text,
  parent_id uuid references knowledge_base_categories(id) on delete cascade,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, name, parent_id)
);

create trigger knowledge_base_categories_updated_at
before update on knowledge_base_categories
for each row execute procedure trigger_set_timestamp();

create index if not exists idx_kb_categories_org on knowledge_base_categories(org_id);
create index if not exists idx_kb_categories_parent on knowledge_base_categories(parent_id);

create table if not exists knowledge_base_articles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  category_id uuid references knowledge_base_categories(id) on delete set null,
  title text not null,
  content text not null,
  slug text,
  is_published boolean default true,
  views_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, slug)
);

create trigger knowledge_base_articles_updated_at
before update on knowledge_base_articles
for each row execute procedure trigger_set_timestamp();

create index if not exists idx_kb_articles_org on knowledge_base_articles(org_id);
create index if not exists idx_kb_articles_category on knowledge_base_articles(category_id);
create index if not exists idx_kb_articles_slug on knowledge_base_articles(slug);

create table if not exists agent_sequences (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean default true,
  sort_order integer default 0,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger agent_sequences_updated_at
before update on agent_sequences
for each row execute procedure trigger_set_timestamp();

create index if not exists idx_agent_sequences_agent on agent_sequences(agent_id);

create table if not exists agent_sequence_steps (
  id uuid primary key default gen_random_uuid(),
  sequence_id uuid not null references agent_sequences(id) on delete cascade,
  step_type text not null,
  payload jsonb default '{}'::jsonb,
  delay_seconds integer default 0,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger agent_sequence_steps_updated_at
before update on agent_sequence_steps
for each row execute procedure trigger_set_timestamp();

create index if not exists idx_agent_sequence_steps_sequence on agent_sequence_steps(sequence_id, sort_order);

create table if not exists agent_channels (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  channel text not null,
  is_enabled boolean default false,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(org_id, agent_id, channel)
);

create trigger agent_channels_updated_at
before update on agent_channels
for each row execute procedure trigger_set_timestamp();

create index if not exists idx_agent_channels_agent on agent_channels(agent_id);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_audit_logs_org_created on audit_logs(org_id, created_at desc);
create index if not exists idx_audit_logs_entity on audit_logs(org_id, entity, entity_id);

-- Pipelines and stages -----------------------------------------------------
create table if not exists agent_pipelines (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  pipeline_external_id text not null,
  name text not null,
  is_active boolean default true,
  metadata jsonb default '{}'::jsonb
);

create table if not exists agent_pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references agent_pipelines(id) on delete cascade,
  stage_external_id text not null,
  name text not null,
  order_index integer not null,
  metadata jsonb default '{}'::jsonb
);

create table if not exists agent_channels (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  channel_key text not null,
  is_enabled boolean not null default true,
  settings jsonb default '{}'::jsonb
);

-- Stage specific behaviour -------------------------------------------------
create table if not exists agent_stage_policies (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  stage_id uuid not null references agent_pipeline_stages(id) on delete cascade,
  instructions text,
  auto_advance boolean default false,
  followup_delay interval,
  followup_template text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (agent_id, stage_id)
);

create trigger agent_stage_policies_updated_at
before update on agent_stage_policies
for each row execute procedure trigger_set_timestamp();

-- Triggers -----------------------------------------------------------------
create table if not exists agent_triggers (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger agent_triggers_updated_at
before update on agent_triggers
for each row execute procedure trigger_set_timestamp();

create table if not exists agent_trigger_conditions (
  id uuid primary key default gen_random_uuid(),
  trigger_id uuid not null references agent_triggers(id) on delete cascade,
  condition_type text not null,
  payload jsonb not null,
  ordering integer not null default 0
);

create table if not exists agent_trigger_actions (
  id uuid primary key default gen_random_uuid(),
  trigger_id uuid not null references agent_triggers(id) on delete cascade,
  action_type text not null,
  payload jsonb not null,
  ordering integer not null default 0
);

-- Sequences (follow-ups) ---------------------------------------------------
create table if not exists agent_sequences (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  name text not null,
  description text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger agent_sequences_updated_at
before update on agent_sequences
for each row execute procedure trigger_set_timestamp();

create table if not exists agent_sequence_steps (
  id uuid primary key default gen_random_uuid(),
  sequence_id uuid not null references agent_sequences(id) on delete cascade,
  step_index integer not null,
  wait_interval interval not null default interval '0 minutes',
  channel text not null,
  template text not null,
 metadata jsonb default '{}'::jsonb
);

-- Automation Rules --------------------------------------------------------
create table if not exists automation_rules (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid references agents(id) on delete set null,
  name text not null,
  description text,
  trigger_type text not null,
  conditions jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  is_active boolean default true,
  priority integer default 10,
  cooldown_minutes integer,
  max_executions_per_day integer,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger automation_rules_updated_at
before update on automation_rules
for each row execute procedure trigger_set_timestamp();

create index if not exists idx_automation_rules_org on automation_rules(org_id);
create index if not exists idx_automation_rules_agent on automation_rules(agent_id);
create index if not exists idx_automation_rules_trigger on automation_rules(trigger_type);

create table if not exists rule_executions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  rule_id uuid not null references automation_rules(id) on delete cascade,
  agent_id uuid references agents(id) on delete set null,
  lead_id text,
  trigger_type text,
  execution_context jsonb not null,
  action_results jsonb not null,
  success boolean default true,
  error text,
  executed_at timestamptz default now()
);

create index if not exists idx_rule_executions_rule on rule_executions(rule_id);
create index if not exists idx_rule_executions_org on rule_executions(org_id);
create index if not exists idx_rule_executions_agent on rule_executions(agent_id);
create index if not exists idx_rule_executions_lead on rule_executions(lead_id);
create index if not exists idx_rule_executions_executed_at on rule_executions(executed_at desc);

create table if not exists sequence_executions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  sequence_id uuid not null references agent_sequences(id) on delete cascade,
  agent_id uuid references agents(id) on delete set null,
  lead_id text,
  contact_id text,
  status text not null default 'running',
  current_step integer default 0,
  execution_context jsonb not null default '{}'::jsonb,
  error text,
  started_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger sequence_executions_updated_at
before update on sequence_executions
for each row execute procedure trigger_set_timestamp();

create index if not exists idx_sequence_executions_org on sequence_executions(org_id);
create index if not exists idx_sequence_executions_sequence on sequence_executions(sequence_id);
create index if not exists idx_sequence_executions_agent on sequence_executions(agent_id);
create index if not exists idx_sequence_executions_lead on sequence_executions(lead_id);

-- Conversations / messages -------------------------------------------------
create table if not exists agent_conversations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  external_conversation_id text,
  deal_id text,
  contact_id text,
  channel text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger agent_conversations_updated_at
before update on agent_conversations
for each row execute procedure trigger_set_timestamp();

create table if not exists conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references agent_conversations(id) on delete cascade,
  role text not null,
  content text not null,
  tokens integer default 0,
  meta jsonb default '{}'::jsonb,
  occurred_at timestamptz default now()
);

create index if not exists idx_messages_conversation on conversation_messages(conversation_id);

-- Activity log -------------------------------------------------------------
create table if not exists agent_activity_logs (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  type text not null,
  payload jsonb not null,
  created_at timestamptz default now()
);

create table if not exists agent_activity_metrics (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  activity_date date not null,
  messages_count integer not null default 0,
  created_at timestamptz default now(),
  unique(agent_id, activity_date)
);

create index if not exists idx_agent_activity_metrics_org_date on agent_activity_metrics(org_id, activity_date);

-- Webhook events -----------------------------------------------------------
create table if not exists webhook_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  provider text not null,
  event_type text not null,
  payload jsonb not null,
  status text not null default 'pending',
  error text,
  created_at timestamptz default now(),
  processed_at timestamptz
);

-- Notifications -------------------------------------------------------------
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  type text not null default 'info',
  title text not null,
  message text,
  link_url text,
  link_text text,
  is_read boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_notifications_org on notifications(org_id);
create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_notifications_read on notifications(is_read);
create index if not exists idx_notifications_created on notifications(created_at desc);

-- Knowledge Graph для связей между сущностями --------------------------------
create table if not exists knowledge_graph_entities (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid references agents(id) on delete set null,
  article_id uuid references knowledge_base_articles(id) on delete set null,
  entity_type text not null, -- 'person', 'organization', 'product', 'service', 'event', 'concept'
  entity_name text not null,
  entity_value text,
  metadata jsonb default '{}'::jsonb,
  confidence numeric(3,2) default 1.0,
  source_chunk_id uuid references knowledge_chunks(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_kg_entities_org on knowledge_graph_entities(org_id);
create index if not exists idx_kg_entities_agent on knowledge_graph_entities(agent_id);
create index if not exists idx_kg_entities_type on knowledge_graph_entities(entity_type);
create index if not exists idx_kg_entities_name on knowledge_graph_entities(entity_name);

create trigger knowledge_graph_entities_updated_at
before update on knowledge_graph_entities
for each row execute procedure trigger_set_timestamp();

create table if not exists knowledge_graph_relationships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  source_entity_id uuid not null references knowledge_graph_entities(id) on delete cascade,
  target_entity_id uuid not null references knowledge_graph_entities(id) on delete cascade,
  relationship_type text not null, -- 'works_for', 'provides', 'uses', 'related_to', 'part_of', etc.
  metadata jsonb default '{}'::jsonb,
  confidence numeric(3,2) default 1.0,
  source_chunk_id uuid references knowledge_chunks(id) on delete set null,
  created_at timestamptz default now(),
  unique (source_entity_id, target_entity_id, relationship_type)
);

create index if not exists idx_kg_relationships_org on knowledge_graph_relationships(org_id);
create index if not exists idx_kg_relationships_source on knowledge_graph_relationships(source_entity_id);
create index if not exists idx_kg_relationships_target on knowledge_graph_relationships(target_entity_id);
create index if not exists idx_kg_relationships_type on knowledge_graph_relationships(relationship_type);

-- Улучшение таблицы agent_assets для поддержки различных типов файлов --------
alter table agent_assets add column if not exists file_size bigint;
alter table agent_assets add column if not exists mime_type text;
alter table agent_assets add column if not exists chunks_count integer default 0;
alter table agent_assets add column if not exists processing_error text;

create index if not exists idx_agent_assets_status on agent_assets(status);
create index if not exists idx_agent_assets_type on agent_assets(type);

-- Применяем миграцию для обучения агентов
-- Все таблицы для company_knowledge, sales_scripts, objection_responses, agent_memory
-- См. supabase/migrations/add_company_knowledge.sql
