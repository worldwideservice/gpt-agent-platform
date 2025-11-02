-- Миграция: Добавление таблицы agent_integrations
-- Связывает агентов с интеграциями (Kommo, Google Calendar и т.д.)

create table if not exists agent_integrations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  integration_type text not null, -- 'kommo', 'google_calendar', etc
  is_installed boolean not null default false,
  is_active boolean not null default false,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (agent_id, integration_type)
);

create trigger agent_integrations_updated_at
before update on agent_integrations
for each row execute procedure trigger_set_timestamp();

create index if not exists idx_agent_integrations_agent on agent_integrations(agent_id);
create index if not exists idx_agent_integrations_org on agent_integrations(org_id);
create index if not exists idx_agent_integrations_type on agent_integrations(integration_type);

-- RLS политики для agent_integrations
alter table agent_integrations enable row level security;

-- Политика SELECT: пользователи видят интеграции своих агентов
create policy "Users can view agent integrations"
on agent_integrations
for select
to authenticated
using (
  org_id in (
    select org_id from organization_members
    where user_id = auth.uid() and status = 'active'
  )
);

-- Политика INSERT: пользователи могут создавать интеграции для своих агентов
create policy "Users can create agent integrations"
on agent_integrations
for insert
to authenticated
with check (
  org_id in (
    select org_id from organization_members
    where user_id = auth.uid() and status = 'active'
  )
);

-- Политика UPDATE: пользователи могут обновлять интеграции своих агентов
create policy "Users can update agent integrations"
on agent_integrations
for update
to authenticated
using (
  org_id in (
    select org_id from organization_members
    where user_id = auth.uid() and status = 'active'
  )
);

-- Политика DELETE: пользователи могут удалять интеграции своих агентов
create policy "Users can delete agent integrations"
on agent_integrations
for delete
to authenticated
using (
  org_id in (
    select org_id from organization_members
    where user_id = auth.uid() and status = 'active'
  )
);

-- Политика для service_role: полный доступ
create policy "Service role can manage agent integrations"
on agent_integrations
for all
to service_role
using (true) with check (true);

