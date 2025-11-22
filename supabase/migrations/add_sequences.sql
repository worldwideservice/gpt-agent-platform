-- Создание таблиц для Sequences

-- Таблица последовательностей
CREATE TABLE sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('manual', 'lead_created', 'stage_changed', 'subscription', 'event')),
  trigger_conditions JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Таблица шагов последовательностей
CREATE TABLE sequence_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  delay_minutes INTEGER NOT NULL DEFAULT 0,
  action_type TEXT NOT NULL CHECK (action_type IN ('send_message', 'create_task', 'send_email', 'webhook', 'ai_response', 'wait')),
  template TEXT,
  recipient TEXT,
  webhook_url TEXT,
  ai_prompt TEXT,
  task_title TEXT,
  task_description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Таблица выполнений последовательностей
CREATE TABLE sequence_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id TEXT NOT NULL,
  contact_id TEXT,
  current_step INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'paused', 'failed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  next_execution_at TIMESTAMPTZ,
  execution_data JSONB DEFAULT '{}',
  error_message TEXT
);

-- Индексы для производительности
CREATE INDEX idx_sequences_org ON sequences(org_id);
CREATE INDEX idx_sequences_agent ON sequences(agent_id);
CREATE INDEX idx_sequences_trigger ON sequences(trigger_type);
CREATE INDEX idx_sequences_active ON sequences(is_active) WHERE is_active = true;

CREATE INDEX idx_sequence_steps_sequence ON sequence_steps(sequence_id);
CREATE INDEX idx_sequence_steps_order ON sequence_steps(sequence_id, step_order);

CREATE INDEX idx_sequence_executions_sequence ON sequence_executions(sequence_id);
CREATE INDEX idx_sequence_executions_org ON sequence_executions(org_id);
CREATE INDEX idx_sequence_executions_lead ON sequence_executions(lead_id);
CREATE INDEX idx_sequence_executions_status ON sequence_executions(status);
CREATE INDEX idx_sequence_executions_next ON sequence_executions(next_execution_at) WHERE next_execution_at IS NOT NULL;

-- RLS политики для sequences
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sequences from their organization" ON sequences
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = sequences.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can insert sequences for their organization" ON sequences
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = sequences.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can update sequences from their organization" ON sequences
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = sequences.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can delete sequences from their organization" ON sequences
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = sequences.org_id
    AND status = 'active'
  ));

-- RLS политики для sequence_steps
ALTER TABLE sequence_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sequence steps from their organization" ON sequence_steps
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members m
    JOIN sequences s ON s.id = sequence_steps.sequence_id
    WHERE m.org_id = s.org_id AND m.status = 'active'
  ));

CREATE POLICY "Users can manage sequence steps from their organization" ON sequence_steps
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM members m
    JOIN sequences s ON s.id = sequence_steps.sequence_id
    WHERE m.org_id = s.org_id AND m.status = 'active'
  ));

-- RLS политики для sequence_executions
ALTER TABLE sequence_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sequence executions from their organization" ON sequence_executions
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = sequence_executions.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can manage sequence executions from their organization" ON sequence_executions
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = sequence_executions.org_id
    AND status = 'active'
  ));

-- Триггеры для обновления updated_at
CREATE OR REPLACE FUNCTION update_sequences_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_sequences_updated_at
  BEFORE UPDATE ON sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_sequences_updated_at();


