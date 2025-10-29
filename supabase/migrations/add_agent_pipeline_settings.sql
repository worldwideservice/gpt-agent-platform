-- Таблица для настроек воронок агента
create table if not exists agent_pipeline_settings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  pipeline_id text not null, -- ID воронки из CRM
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


