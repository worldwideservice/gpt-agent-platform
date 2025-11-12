alter table public.organization_settings
  add column if not exists provider_configs jsonb default '{}'::jsonb;
