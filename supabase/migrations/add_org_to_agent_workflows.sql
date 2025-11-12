-- Миграция: добавление org_id к таблицам рабочих процессов агентов
-- Обеспечивает многотенантность для сущностей, связанных с пайплайнами, триггерами и последовательностями

-- agent_pipelines -----------------------------------------------------------
alter table if exists agent_pipelines
  add column if not exists org_id uuid references organizations(id) on delete cascade;

update agent_pipelines ap
set org_id = agents.org_id
from agents
where ap.agent_id = agents.id
  and ap.org_id is null;

alter table if exists agent_pipelines
  alter column org_id set not null;

create index if not exists idx_agent_pipelines_org on agent_pipelines(org_id);

-- agent_pipeline_stages -----------------------------------------------------
alter table if exists agent_pipeline_stages
  add column if not exists org_id uuid references organizations(id) on delete cascade;

update agent_pipeline_stages aps
set org_id = ap.org_id
from agent_pipelines ap
where aps.pipeline_id = ap.id
  and aps.org_id is null;

alter table if exists agent_pipeline_stages
  alter column org_id set not null;

create index if not exists idx_agent_pipeline_stages_org on agent_pipeline_stages(org_id);
create index if not exists idx_agent_pipeline_stages_pipeline_org on agent_pipeline_stages(pipeline_id, org_id);

-- agent_stage_policies ------------------------------------------------------
alter table if exists agent_stage_policies
  add column if not exists org_id uuid references organizations(id) on delete cascade;

update agent_stage_policies asp
set org_id = ag.org_id
from agents ag
where asp.agent_id = ag.id
  and asp.org_id is null;

alter table if exists agent_stage_policies
  alter column org_id set not null;

create index if not exists idx_agent_stage_policies_org on agent_stage_policies(org_id);
create index if not exists idx_agent_stage_policies_stage_org on agent_stage_policies(stage_id, org_id);

-- agent_triggers ------------------------------------------------------------
alter table if exists agent_triggers
  add column if not exists org_id uuid references organizations(id) on delete cascade;

update agent_triggers at
set org_id = ag.org_id
from agents ag
where at.agent_id = ag.id
  and at.org_id is null;

alter table if exists agent_triggers
  alter column org_id set not null;

create index if not exists idx_agent_triggers_org on agent_triggers(org_id);

-- agent_trigger_conditions --------------------------------------------------
alter table if exists agent_trigger_conditions
  add column if not exists org_id uuid references organizations(id) on delete cascade;

update agent_trigger_conditions atc
set org_id = at.org_id
from agent_triggers at
where atc.trigger_id = at.id
  and atc.org_id is null;

alter table if exists agent_trigger_conditions
  alter column org_id set not null;

create index if not exists idx_agent_trigger_conditions_org on agent_trigger_conditions(org_id);
create index if not exists idx_agent_trigger_conditions_trigger_org on agent_trigger_conditions(trigger_id, org_id);

-- agent_trigger_actions -----------------------------------------------------
alter table if exists agent_trigger_actions
  add column if not exists org_id uuid references organizations(id) on delete cascade;

update agent_trigger_actions ata
set org_id = at.org_id
from agent_triggers at
where ata.trigger_id = at.id
  and ata.org_id is null;

alter table if exists agent_trigger_actions
  alter column org_id set not null;

create index if not exists idx_agent_trigger_actions_org on agent_trigger_actions(org_id);
create index if not exists idx_agent_trigger_actions_trigger_org on agent_trigger_actions(trigger_id, org_id);

-- agent_sequences -----------------------------------------------------------
alter table if exists agent_sequences
  add column if not exists org_id uuid references organizations(id) on delete cascade;

update agent_sequences sq
set org_id = ag.org_id
from agents ag
where sq.agent_id = ag.id
  and sq.org_id is null;

alter table if exists agent_sequences
  alter column org_id set not null;

create index if not exists idx_agent_sequences_org on agent_sequences(org_id);

-- agent_sequence_steps ------------------------------------------------------
alter table if exists agent_sequence_steps
  add column if not exists org_id uuid references organizations(id) on delete cascade;

update agent_sequence_steps ss
set org_id = sq.org_id
from agent_sequences sq
where ss.sequence_id = sq.id
  and ss.org_id is null;

alter table if exists agent_sequence_steps
  alter column org_id set not null;

create index if not exists idx_agent_sequence_steps_org on agent_sequence_steps(org_id);
create index if not exists idx_agent_sequence_steps_sequence_org on agent_sequence_steps(sequence_id, org_id);

-- agent_channels ------------------------------------------------------------
alter table if exists agent_channels
  add column if not exists org_id uuid references organizations(id) on delete cascade;

update agent_channels ac
set org_id = ag.org_id
from agents ag
where ac.agent_id = ag.id
  and ac.org_id is null;

alter table if exists agent_channels
  alter column org_id set not null;

create index if not exists idx_agent_channels_org on agent_channels(org_id);

