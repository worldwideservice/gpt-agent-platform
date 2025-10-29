-- ============================================
-- ВКЛЮЧЕНИЕ RLS И СОЗДАНИЕ ПОЛИТИК БЕЗОПАСНОСТИ
-- Исправляет проблемы Security Advisor
-- ============================================

-- ============================================
-- Включение RLS на всех таблицах
-- ============================================

-- CRM таблицы
ALTER TABLE IF EXISTS public.crm_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.crm_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.crm_pipeline_stages ENABLE ROW LEVEL SECURITY;

-- Агенты
ALTER TABLE IF EXISTS public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.agent_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.agent_pipeline_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.agent_memory ENABLE ROW LEVEL SECURITY;

-- База знаний
ALTER TABLE IF EXISTS public.knowledge_base_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.company_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sales_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.objection_responses ENABLE ROW LEVEL SECURITY;

-- Пользователи и организации (если RLS еще не включен)
ALTER TABLE IF EXISTS public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.organization_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS ПОЛИТИКИ: Организации
-- ============================================

-- Пользователи могут видеть только свои организации
DROP POLICY IF EXISTS "Users can view their own organizations" ON public.organizations;
CREATE POLICY "Users can view their own organizations"
ON public.organizations FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Пользователи могут обновлять свои организации
DROP POLICY IF EXISTS "Users can update their organizations" ON public.organizations;
CREATE POLICY "Users can update their organizations"
ON public.organizations FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: Агенты
-- ============================================

-- Пользователи могут видеть агентов своей организации
DROP POLICY IF EXISTS "Users can view agents in their org" ON public.agents;
CREATE POLICY "Users can view agents in their org"
ON public.agents FOR SELECT
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Пользователи могут создавать агентов в своей организации
DROP POLICY IF EXISTS "Users can create agents in their org" ON public.agents;
CREATE POLICY "Users can create agents in their org"
ON public.agents FOR INSERT
TO authenticated
WITH CHECK (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Пользователи могут обновлять агентов своей организации
DROP POLICY IF EXISTS "Users can update agents in their org" ON public.agents;
CREATE POLICY "Users can update agents in their org"
ON public.agents FOR UPDATE
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Пользователи могут удалять агентов своей организации
DROP POLICY IF EXISTS "Users can delete agents in their org" ON public.agents;
CREATE POLICY "Users can delete agents in their org"
ON public.agents FOR DELETE
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: Agent Assets
-- ============================================

DROP POLICY IF EXISTS "Users can view agent assets in their org" ON public.agent_assets;
CREATE POLICY "Users can view agent assets in their org"
ON public.agent_assets FOR SELECT
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can manage agent assets in their org" ON public.agent_assets;
CREATE POLICY "Users can manage agent assets in their org"
ON public.agent_assets FOR ALL
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: Agent Pipeline Settings
-- ============================================

DROP POLICY IF EXISTS "Users can manage pipeline settings in their org" ON public.agent_pipeline_settings;
CREATE POLICY "Users can manage pipeline settings in their org"
ON public.agent_pipeline_settings FOR ALL
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: Company Knowledge
-- ============================================

DROP POLICY IF EXISTS "Users can manage knowledge in their org" ON public.company_knowledge;
CREATE POLICY "Users can manage knowledge in their org"
ON public.company_knowledge FOR ALL
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: Sales Scripts
-- ============================================

DROP POLICY IF EXISTS "Users can manage sales scripts in their org" ON public.sales_scripts;
CREATE POLICY "Users can manage sales scripts in their org"
ON public.sales_scripts FOR ALL
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: Objection Responses
-- ============================================

DROP POLICY IF EXISTS "Users can manage objections in their org" ON public.objection_responses;
CREATE POLICY "Users can manage objections in their org"
ON public.objection_responses FOR ALL
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: Agent Memory
-- ============================================

DROP POLICY IF EXISTS "Users can manage agent memory in their org" ON public.agent_memory;
CREATE POLICY "Users can manage agent memory in their org"
ON public.agent_memory FOR ALL
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: Knowledge Chunks
-- ============================================

DROP POLICY IF EXISTS "Users can view knowledge chunks in their org" ON public.knowledge_chunks;
CREATE POLICY "Users can view knowledge chunks in their org"
ON public.knowledge_chunks FOR SELECT
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can manage knowledge chunks in their org" ON public.knowledge_chunks;
CREATE POLICY "Users can manage knowledge chunks in their org"
ON public.knowledge_chunks FOR INSERT
TO authenticated
WITH CHECK (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: CRM Connections
-- ============================================

DROP POLICY IF EXISTS "Users can manage CRM connections in their org" ON public.crm_connections;
CREATE POLICY "Users can manage CRM connections in their org"
ON public.crm_connections FOR ALL
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: CRM Pipelines
-- ============================================

DROP POLICY IF EXISTS "Users can view CRM pipelines in their org" ON public.crm_pipelines;
CREATE POLICY "Users can view CRM pipelines in their org"
ON public.crm_pipelines FOR SELECT
TO authenticated
USING (
  connection_id IN (
    SELECT id FROM public.crm_connections 
    WHERE org_id IN (
      SELECT org_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: CRM Pipeline Stages
-- ============================================

DROP POLICY IF EXISTS "Users can view CRM pipeline stages in their org" ON public.crm_pipeline_stages;
CREATE POLICY "Users can view CRM pipeline stages in their org"
ON public.crm_pipeline_stages FOR SELECT
TO authenticated
USING (
  pipeline_id IN (
    SELECT id FROM public.crm_pipelines
    WHERE connection_id IN (
      SELECT id FROM public.crm_connections 
      WHERE org_id IN (
        SELECT org_id FROM public.organization_members 
        WHERE user_id = auth.uid()
      )
    )
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: Agent Conversations
-- ============================================

DROP POLICY IF EXISTS "Users can manage conversations in their org" ON public.agent_conversations;
CREATE POLICY "Users can manage conversations in their org"
ON public.agent_conversations FOR ALL
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- RLS ПОЛИТИКИ: Knowledge Base Articles
-- ============================================

DROP POLICY IF EXISTS "Users can manage KB articles in their org" ON public.knowledge_base_articles;
CREATE POLICY "Users can manage KB articles in their org"
ON public.knowledge_base_articles FOR ALL
TO authenticated
USING (
  org_id IN (
    SELECT org_id FROM public.organization_members 
    WHERE user_id = auth.uid()
  )
);

-- ============================================
-- Проверка: RLS включен на всех таблицах
-- ============================================

SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN (
  'crm_pipeline_stages',
  'crm_connections',
  'crm_pipelines',
  'agents',
  'agent_assets',
  'agent_pipeline_settings',
  'agent_conversations',
  'knowledge_base_articles',
  'agent_memory',
  'knowledge_chunks',
  'sales_scripts',
  'company_knowledge',
  'objection_responses'
)
ORDER BY tablename;

