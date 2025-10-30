-- ============================================
-- ПОЛНАЯ НАСТРОЙКА БД И STORAGE
-- Скопируйте весь файл в Supabase Dashboard -> SQL Editor
-- ============================================

-- ============================================
-- ЧАСТЬ 1: Таблицы для знаний компании
-- ============================================

CREATE TABLE IF NOT EXISTS company_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  category text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  pipeline_stage_id uuid REFERENCES crm_pipeline_stages(id) ON DELETE SET NULL,
  is_global boolean DEFAULT true,
  priority integer DEFAULT 0,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_company_knowledge_org ON company_knowledge(org_id);
CREATE INDEX IF NOT EXISTS idx_company_knowledge_agent ON company_knowledge(agent_id);
CREATE INDEX IF NOT EXISTS idx_company_knowledge_category ON company_knowledge(category);
CREATE INDEX IF NOT EXISTS idx_company_knowledge_stage ON company_knowledge(pipeline_stage_id);
CREATE INDEX IF NOT EXISTS idx_company_knowledge_priority ON company_knowledge(priority DESC);

-- ============================================
-- ЧАСТЬ 2: Скрипты продаж
-- ============================================

CREATE TABLE IF NOT EXISTS sales_scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  pipeline_stage_id uuid REFERENCES crm_pipeline_stages(id) ON DELETE SET NULL,
  title text NOT NULL,
  script_type text NOT NULL DEFAULT 'greeting',
  content text NOT NULL,
  variables jsonb DEFAULT '{}'::jsonb,
  conditions jsonb DEFAULT '{}'::jsonb,
  effectiveness_score numeric(3,2) DEFAULT 0.5,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sales_scripts_org ON sales_scripts(org_id);
CREATE INDEX IF NOT EXISTS idx_sales_scripts_stage ON sales_scripts(pipeline_stage_id);
CREATE INDEX IF NOT EXISTS idx_sales_scripts_type ON sales_scripts(script_type);

-- ============================================
-- ЧАСТЬ 3: Ответы на возражения
-- ============================================

CREATE TABLE IF NOT EXISTS objection_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  objection_type text NOT NULL,
  objection_text text,
  response_script text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  effectiveness_score numeric(3,2) DEFAULT 0.5,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_objection_responses_org ON objection_responses(org_id);
CREATE INDEX IF NOT EXISTS idx_objection_responses_type ON objection_responses(objection_type);

-- ============================================
-- ЧАСТЬ 4: Память агента (обновленная версия)
-- ============================================

CREATE TABLE IF NOT EXISTS agent_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  client_identifier text NOT NULL, -- email, phone или другой идентификатор клиента
  memory_type text NOT NULL CHECK (memory_type IN ('fact', 'preference', 'context', 'interaction')),
  content text NOT NULL,
  importance integer NOT NULL DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  confidence decimal(3,2) NOT NULL DEFAULT 0.8 CHECK (confidence >= 0 AND confidence <= 1),
  source text NOT NULL DEFAULT 'conversation' CHECK (source IN ('conversation', 'crm', 'manual', 'inferred')),
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_memory_org_client ON agent_memory(org_id, client_identifier);
CREATE INDEX IF NOT EXISTS idx_agent_memory_agent ON agent_memory(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_type ON agent_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_agent_memory_importance ON agent_memory(importance DESC);
CREATE INDEX IF NOT EXISTS idx_agent_memory_expires ON agent_memory(expires_at) WHERE expires_at IS NOT NULL;

-- ============================================
-- ЧАСТЬ 5: Настройки воронок агента
-- ============================================

CREATE TABLE IF NOT EXISTS agent_pipeline_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  pipeline_id text NOT NULL,
  is_active boolean DEFAULT false,
  all_stages boolean DEFAULT false,
  selected_stages text[] DEFAULT '{}',
  stage_instructions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (agent_id, pipeline_id)
);

CREATE INDEX IF NOT EXISTS idx_agent_pipeline_settings_agent ON agent_pipeline_settings(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_pipeline_settings_org ON agent_pipeline_settings(org_id);

-- ============================================
-- ЧАСТЬ 6: Rule Engine - Правила автоматизации
-- ============================================

CREATE TABLE IF NOT EXISTS automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL CHECK (trigger_type IN ('lead_created', 'lead_updated', 'message_received', 'stage_changed', 'time_based', 'manual')),
  conditions jsonb NOT NULL DEFAULT '[]',
  actions jsonb NOT NULL DEFAULT '[]',
  is_active boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 10,
  cooldown_minutes integer,
  max_executions_per_day integer,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rule_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid NOT NULL REFERENCES automation_rules(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id text,
  execution_context jsonb NOT NULL,
  action_results jsonb NOT NULL,
  executed_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- ЧАСТЬ 7: Sequences - Последовательные действия
-- ============================================

CREATE TABLE IF NOT EXISTS sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES agents(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL CHECK (trigger_type IN ('manual', 'lead_created', 'stage_changed', 'subscription', 'event')),
  trigger_conditions jsonb DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sequence_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  step_order integer NOT NULL,
  delay_minutes integer NOT NULL DEFAULT 0,
  action_type text NOT NULL CHECK (action_type IN ('send_message', 'create_task', 'send_email', 'webhook', 'ai_response', 'wait')),
  template text,
  recipient text,
  webhook_url text,
  ai_prompt text,
  task_title text,
  task_description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sequence_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id uuid NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  lead_id text NOT NULL,
  contact_id text,
  current_step integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'paused', 'failed')),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  next_execution_at timestamptz,
  execution_data jsonb DEFAULT '{}',
  error_message text
);

-- ============================================
-- ЧАСТЬ 8: Billing - Подписки и платежи
-- ============================================

ALTER TABLE organizations ADD COLUMN IF NOT EXISTS stripe_customer_id text;

CREATE TABLE IF NOT EXISTS billing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  stripe_price_id text NOT NULL UNIQUE,
  price_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  interval text NOT NULL CHECK (interval IN ('month', 'year')),
  features jsonb DEFAULT '{}',
  limits jsonb NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL,
  plan_id uuid NOT NULL REFERENCES billing_plans(id),
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete', 'trialing')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  usage_limits jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('tokens', 'messages', 'storage', 'agents')),
  amount decimal(10,2) NOT NULL,
  cost_cents integer,
  description text,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- ============================================
-- ЧАСТЬ 9: Analytics - Расширенная аналитика
-- ============================================

CREATE TABLE IF NOT EXISTS analytics_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  value decimal(10,2) NOT NULL,
  dimensions jsonb DEFAULT '{}',
  timestamp timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS analytics_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type IN ('usage', 'performance', 'engagement', 'revenue')),
  title text NOT NULL,
  description text,
  date_range jsonb NOT NULL,
  data jsonb NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- ============================================
-- ЧАСТЬ 10: Расширение knowledge_chunks
-- ============================================

ALTER TABLE knowledge_chunks ADD COLUMN IF NOT EXISTS company_knowledge_id uuid REFERENCES company_knowledge(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_company_knowledge ON knowledge_chunks(company_knowledge_id);

-- ============================================
-- ЧАСТЬ 11: Создание Storage Bucket
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'agent-assets',
  'agent-assets',
  false,
  52428800, -- 50 MB
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/html',
    'text/markdown'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ЧАСТЬ 12: RLS политики
-- ============================================

-- RLS для automation_rules
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view rules from their organization" ON automation_rules
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = automation_rules.org_id
    AND status = 'active'
  ));

CREATE POLICY IF NOT EXISTS "Users can insert rules for their organization" ON automation_rules
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = automation_rules.org_id
    AND status = 'active'
  ));

CREATE POLICY IF NOT EXISTS "Users can update rules from their organization" ON automation_rules
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = automation_rules.org_id
    AND status = 'active'
  ));

CREATE POLICY IF NOT EXISTS "Users can delete rules from their organization" ON automation_rules
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = automation_rules.org_id
    AND status = 'active'
  ));

-- RLS для sequences
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view sequences from their organization" ON sequences
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = sequences.org_id
    AND status = 'active'
  ));

CREATE POLICY IF NOT EXISTS "Users can manage sequences from their organization" ON sequences
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = sequences.org_id
    AND status = 'active'
  ));

-- RLS для billing
ALTER TABLE billing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Anyone can view active billing plans" ON billing_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS "Users can view their organization subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = subscriptions.org_id
    AND status = 'active'
  ));

-- RLS для analytics
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their organization metrics" ON analytics_metrics
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = analytics_metrics.org_id
    AND status = 'active'
  ));

CREATE POLICY IF NOT EXISTS "Users can view their organization reports" ON analytics_reports
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = analytics_reports.org_id
    AND status = 'active'
  ));

-- RLS для storage bucket
CREATE POLICY IF NOT EXISTS "Users can upload files to agent-assets bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'agent-assets' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY IF NOT EXISTS "Users can read files from agent-assets bucket"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'agent-assets' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY IF NOT EXISTS "Users can delete files from agent-assets bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'agent-assets' AND
  auth.uid() IS NOT NULL
);

-- ============================================
-- ЧАСТЬ 13: Вспомогательные функции
-- ============================================

-- Функция для получения топ агентов по производительности
CREATE OR REPLACE FUNCTION get_top_agents_performance(
  p_org_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz,
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  agent_id uuid,
  name text,
  conversations_count bigint,
  messages_count bigint,
  tokens_used bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id as agent_id,
    a.name,
    COUNT(DISTINCT ac.id) as conversations_count,
    COUNT(cm.id) as messages_count,
    COALESCE(SUM(mt.tokens_used), 0) as tokens_used
  FROM agents a
  LEFT JOIN agent_conversations ac ON ac.agent_id = a.id
    AND ac.org_id = p_org_id
    AND ac.created_at >= p_start_date
    AND ac.created_at <= p_end_date
  LEFT JOIN conversation_messages cm ON cm.conversation_id = ac.id
  LEFT JOIN message_tokens mt ON mt.conversation_id = ac.id
  WHERE a.org_id = p_org_id
  GROUP BY a.id, a.name
  ORDER BY conversations_count DESC, messages_count DESC
  LIMIT p_limit;
END;
$$;

-- Функция для расчета метрик вовлеченности
CREATE OR REPLACE FUNCTION calculate_engagement_metrics(
  p_org_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  total_conversations bigint;
  avg_messages_per_conversation decimal;
  avg_session_duration interval;
  return_visitor_rate decimal;
BEGIN
  -- Общее количество разговоров
  SELECT COUNT(*) INTO total_conversations
  FROM agent_conversations
  WHERE org_id = p_org_id
    AND created_at >= p_start_date
    AND created_at <= p_end_date;

  -- Среднее количество сообщений на разговор
  SELECT AVG(message_count) INTO avg_messages_per_conversation
  FROM (
    SELECT COUNT(*) as message_count
    FROM conversation_messages cm
    JOIN agent_conversations ac ON ac.id = cm.conversation_id
    WHERE ac.org_id = p_org_id
      AND ac.created_at >= p_start_date
      AND ac.created_at <= p_end_date
    GROUP BY cm.conversation_id
  ) sub;

  -- Средняя продолжительность сессии
  SELECT AVG(ac.updated_at - ac.created_at) INTO avg_session_duration
  FROM agent_conversations ac
  WHERE ac.org_id = p_org_id
    AND ac.created_at >= p_start_date
    AND ac.created_at <= p_end_date;

  -- Коэффициент возврата посетителей (упрощенная версия)
  SELECT 0.0 INTO return_visitor_rate;

  result := jsonb_build_object(
    'total_conversations', total_conversations,
    'avg_messages_per_conversation', COALESCE(avg_messages_per_conversation, 0),
    'avg_session_duration_seconds', EXTRACT(EPOCH FROM COALESCE(avg_session_duration, INTERVAL '0 seconds')),
    'return_visitor_rate', return_visitor_rate
  );

  RETURN result;
END;
$$;

-- ============================================
-- ЧАСТЬ 14: Тестовые данные для планов подписки
-- ============================================

INSERT INTO billing_plans (name, description, stripe_price_id, price_cents, currency, interval, features, limits, sort_order) VALUES
('Starter', 'Идеально для небольших команд', 'price_starter_dev', 2900, 'usd', 'month', '{
  "agents": 2,
  "tokens_per_month": 100000,
  "messages_per_month": 1000,
  "storage_gb": 5
}', '{
  "agents": 2,
  "tokens_per_month": 100000,
  "messages_per_month": 1000,
  "storage_gb": 5
}', 1),
('Professional', 'Для растущих компаний', 'price_professional_dev', 7900, 'usd', 'month', '{
  "agents": 10,
  "tokens_per_month": 500000,
  "messages_per_month": 5000,
  "storage_gb": 25
}', '{
  "agents": 10,
  "tokens_per_month": 500000,
  "messages_per_month": 5000,
  "storage_gb": 25
}', 2),
('Enterprise', 'Полный контроль и масштабирование', 'price_enterprise_dev', 19900, 'usd', 'month', '{
  "agents": -1,
  "tokens_per_month": -1,
  "messages_per_month": -1,
  "storage_gb": -1
}', '{
  "agents": -1,
  "tokens_per_month": -1,
  "messages_per_month": -1,
  "storage_gb": -1
}', 3)
ON CONFLICT (stripe_price_id) DO NOTHING;

-- ============================================
-- ПРОВЕРКА: Должны быть созданы все таблицы
-- ============================================

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'agent_pipeline_settings',
  'company_knowledge',
  'sales_scripts',
  'objection_responses',
  'agent_memory',
  'automation_rules',
  'rule_executions',
  'sequences',
  'sequence_steps',
  'sequence_executions',
  'billing_plans',
  'subscriptions',
  'usage_records',
  'analytics_metrics',
  'analytics_reports'
)
ORDER BY table_name;

-- ============================================
-- ПРОВЕРКА: Bucket создан
-- ============================================

SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'agent-assets';

-- ============================================
-- ПРОВЕРКА: Планы подписки созданы
-- ============================================

SELECT name, stripe_price_id, price_cents, limits
FROM billing_plans
ORDER BY sort_order;

-- ============================================
-- ЧАСТЬ 9: Шаблоны email
-- ============================================

-- Создание таблицы шаблонов email
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  text TEXT,
  variables JSONB DEFAULT '[]', -- массив названий переменных
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS политика
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view email templates from their organization" ON email_templates;
CREATE POLICY "Users can view email templates from their organization" ON email_templates
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = email_templates.org_id
    AND status = 'active'
  ));

DROP POLICY IF EXISTS "Users can create email templates in their organization" ON email_templates;
CREATE POLICY "Users can create email templates in their organization" ON email_templates
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = email_templates.org_id
    AND status = 'active'
  ));

DROP POLICY IF EXISTS "Users can update email templates in their organization" ON email_templates;
CREATE POLICY "Users can update email templates in their organization" ON email_templates
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = email_templates.org_id
    AND status = 'active'
  ));

DROP POLICY IF EXISTS "Users can delete email templates in their organization" ON email_templates;
CREATE POLICY "Users can delete email templates in their organization" ON email_templates
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = email_templates.org_id
    AND status = 'active'
  ));

-- Индексы
CREATE INDEX IF NOT EXISTS idx_email_templates_org_id ON email_templates(org_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(org_id, is_active);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ЧАСТЬ 10: Поле lead_id в agent_conversations
-- ============================================

-- Добавление поля lead_id в таблицу agent_conversations
ALTER TABLE agent_conversations
ADD COLUMN IF NOT EXISTS lead_id INTEGER;

-- Индекс для быстрого поиска по lead_id
CREATE INDEX IF NOT EXISTS idx_agent_conversations_lead_id ON agent_conversations(lead_id);

-- Комментарий к полю
COMMENT ON COLUMN agent_conversations.lead_id IS 'ID сделки в Kommo CRM';

-- ============================================
-- ЧАСТЬ 11: Настройки CRM интеграций
-- ============================================

-- Создание таблицы для настроек CRM интеграций
CREATE TABLE IF NOT EXISTS crm_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  crm_type VARCHAR(50) NOT NULL, -- 'kommo', 'bitrix24', etc.
  config JSONB NOT NULL, -- encrypted configuration
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(org_id, crm_type)
);

-- RLS политика
ALTER TABLE crm_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view crm settings from their organization" ON crm_settings;
CREATE POLICY "Users can view crm settings from their organization" ON crm_settings
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = crm_settings.org_id
    AND status = 'active'
  ));

DROP POLICY IF EXISTS "Users can create crm settings in their organization" ON crm_settings;
CREATE POLICY "Users can create crm settings in their organization" ON crm_settings
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = crm_settings.org_id
    AND status = 'active'
  ));

DROP POLICY IF EXISTS "Users can update crm settings in their organization" ON crm_settings;
CREATE POLICY "Users can update crm settings in their organization" ON crm_settings
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = crm_settings.org_id
    AND status = 'active'
  ));

DROP POLICY IF EXISTS "Users can delete crm settings in their organization" ON crm_settings;
CREATE POLICY "Users can delete crm settings in their organization" ON crm_settings
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = crm_settings.org_id
    AND status = 'active'
  ));

-- Индексы
CREATE INDEX IF NOT EXISTS idx_crm_settings_org_id ON crm_settings(org_id);
CREATE INDEX IF NOT EXISTS idx_crm_settings_type ON crm_settings(crm_type);
CREATE INDEX IF NOT EXISTS idx_crm_settings_active ON crm_settings(org_id, crm_type, is_active);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS update_crm_settings_updated_at ON crm_settings;
CREATE TRIGGER update_crm_settings_updated_at
  BEFORE UPDATE ON crm_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();