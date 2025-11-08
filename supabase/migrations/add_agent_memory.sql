-- Создание таблицы для долгосрочной памяти агентов
CREATE TABLE IF NOT EXISTS agent_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  client_identifier TEXT NOT NULL, -- email, phone или другой идентификатор клиента
  memory_type TEXT NOT NULL CHECK (memory_type IN ('fact', 'preference', 'context', 'interaction')),
  content TEXT NOT NULL,
  importance INTEGER NOT NULL DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  confidence DECIMAL(3,2) NOT NULL DEFAULT 0.8 CHECK (confidence >= 0 AND confidence <= 1),
  source TEXT NOT NULL DEFAULT 'conversation' CHECK (source IN ('conversation', 'crm', 'manual', 'inferred')),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Добавляем недостающие колонки если таблица уже существует
DO $$
BEGIN
  -- Проверяем и добавляем client_identifier если его нет
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_memory' AND column_name = 'client_identifier'
  ) THEN
    ALTER TABLE agent_memory ADD COLUMN client_identifier TEXT;
    -- Обновляем существующие записи (если есть)
    UPDATE agent_memory SET client_identifier = COALESCE(metadata->>'client_id', 'unknown') WHERE client_identifier IS NULL;
    ALTER TABLE agent_memory ALTER COLUMN client_identifier SET NOT NULL;
  END IF;
END $$;

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_agent_memory_org_client ON agent_memory(org_id, client_identifier);
CREATE INDEX IF NOT EXISTS idx_agent_memory_agent ON agent_memory(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_type ON agent_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_agent_memory_importance ON agent_memory(importance DESC);
CREATE INDEX IF NOT EXISTS idx_agent_memory_expires ON agent_memory(expires_at) WHERE expires_at IS NOT NULL;

-- RLS политика: пользователи видят только память своей организации
ALTER TABLE agent_memory ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики если они есть (для идемпотентности)
DROP POLICY IF EXISTS "Users can view memory from their organization" ON agent_memory;
DROP POLICY IF EXISTS "Users can insert memory for their organization" ON agent_memory;
DROP POLICY IF EXISTS "Users can update memory from their organization" ON agent_memory;
DROP POLICY IF EXISTS "Users can delete memory from their organization" ON agent_memory;

CREATE POLICY "Users can view memory from their organization" ON agent_memory
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = agent_memory.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can insert memory for their organization" ON agent_memory
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = agent_memory.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can update memory from their organization" ON agent_memory
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = agent_memory.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can delete memory from their organization" ON agent_memory
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = agent_memory.org_id
    AND status = 'active'
  ));

-- Функция для автоматической очистки устаревшей памяти
CREATE OR REPLACE FUNCTION cleanup_expired_memory()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM agent_memory
  WHERE expires_at IS NOT NULL AND expires_at < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_agent_memory_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Удаляем триггер если он существует (для идемпотентности)
DROP TRIGGER IF EXISTS trigger_update_agent_memory_updated_at ON agent_memory;

CREATE TRIGGER trigger_update_agent_memory_updated_at
  BEFORE UPDATE ON agent_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_memory_updated_at();


