-- ПРИМЕНИТЕ ЭТОТ SQL В SUPABASE DASHBOARD -> SQL EDITOR
-- Копируйте весь файл и выполняйте по частям если возникают ошибки

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

CREATE TRIGGER company_knowledge_updated_at
BEFORE UPDATE ON company_knowledge
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

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

CREATE TRIGGER sales_scripts_updated_at
BEFORE UPDATE ON sales_scripts
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

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

CREATE TRIGGER objection_responses_updated_at
BEFORE UPDATE ON objection_responses
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- ============================================
-- ЧАСТЬ 4: Память агента
-- ============================================

CREATE TABLE IF NOT EXISTS agent_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES agent_conversations(id) ON DELETE SET NULL,
  memory_type text NOT NULL,
  content text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  importance numeric(3,2) DEFAULT 0.5,
  validated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_agent_memory_org ON agent_memory(org_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_agent ON agent_memory(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_type ON agent_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_agent_memory_importance ON agent_memory(importance DESC);
CREATE INDEX IF NOT EXISTS idx_agent_memory_expires ON agent_memory(expires_at);

CREATE TRIGGER agent_memory_updated_at
BEFORE UPDATE ON agent_memory
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- ============================================
-- ЧАСТЬ 5: Связь знаний с этапами
-- ============================================

CREATE TABLE IF NOT EXISTS knowledge_pipeline_mapping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  knowledge_id uuid REFERENCES company_knowledge(id) ON DELETE CASCADE,
  script_id uuid REFERENCES sales_scripts(id) ON DELETE CASCADE,
  pipeline_stage_id uuid NOT NULL REFERENCES crm_pipeline_stages(id) ON DELETE CASCADE,
  priority integer DEFAULT 0,
  auto_include boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_pipeline_mapping_stage ON knowledge_pipeline_mapping(pipeline_stage_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_pipeline_mapping_knowledge ON knowledge_pipeline_mapping(knowledge_id);

-- Расширение knowledge_chunks
ALTER TABLE knowledge_chunks ADD COLUMN IF NOT EXISTS company_knowledge_id uuid REFERENCES company_knowledge(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_company_knowledge ON knowledge_chunks(company_knowledge_id);

-- ============================================
-- ЧАСТЬ 6: Настройки воронок агента
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

CREATE TRIGGER agent_pipeline_settings_updated_at
BEFORE UPDATE ON agent_pipeline_settings
FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

CREATE INDEX IF NOT EXISTS idx_agent_pipeline_settings_agent ON agent_pipeline_settings(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_pipeline_settings_org ON agent_pipeline_settings(org_id);

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
  'agent_memory'
)
ORDER BY table_name;













