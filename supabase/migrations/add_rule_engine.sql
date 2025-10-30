-- Создание таблиц для Rule Engine

-- Таблица правил автоматизации
CREATE TABLE automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('lead_created', 'lead_updated', 'message_received', 'stage_changed', 'time_based', 'manual')),
  conditions JSONB NOT NULL DEFAULT '[]',
  actions JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 10,
  cooldown_minutes INTEGER,
  max_executions_per_day INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Таблица выполнений правил
CREATE TABLE rule_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES automation_rules(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id TEXT,
  execution_context JSONB NOT NULL,
  action_results JSONB NOT NULL,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX idx_automation_rules_org ON automation_rules(org_id);
CREATE INDEX idx_automation_rules_agent ON automation_rules(agent_id);
CREATE INDEX idx_automation_rules_trigger ON automation_rules(trigger_type);
CREATE INDEX idx_automation_rules_active ON automation_rules(is_active) WHERE is_active = true;
CREATE INDEX idx_automation_rules_priority ON automation_rules(priority);

CREATE INDEX idx_rule_executions_rule ON rule_executions(rule_id);
CREATE INDEX idx_rule_executions_org ON rule_executions(org_id);
CREATE INDEX idx_rule_executions_lead ON rule_executions(lead_id);
CREATE INDEX idx_rule_executions_time ON rule_executions(executed_at);

-- RLS политики для automation_rules
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rules from their organization" ON automation_rules
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = automation_rules.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can insert rules for their organization" ON automation_rules
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = automation_rules.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can update rules from their organization" ON automation_rules
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = automation_rules.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can delete rules from their organization" ON automation_rules
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = automation_rules.org_id
    AND status = 'active'
  ));

-- RLS политики для rule_executions
ALTER TABLE rule_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view executions from their organization" ON rule_executions
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = rule_executions.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can insert executions for their organization" ON rule_executions
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = rule_executions.org_id
    AND status = 'active'
  ));

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_automation_rules_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_automation_rules_updated_at
  BEFORE UPDATE ON automation_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_automation_rules_updated_at();


