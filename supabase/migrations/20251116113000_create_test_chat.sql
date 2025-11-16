-- =============================================
-- Migration: Create Test Chat System
-- Date: 2025-11-16
-- Description: Создание таблиц для тестового чата с AI агентами
-- =============================================

-- 1. Создаем таблицу test_conversations (тестовые беседы)
CREATE TABLE IF NOT EXISTS test_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Test Chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Создаем таблицу test_messages (сообщения в тестовых чатах)
CREATE TABLE IF NOT EXISTS test_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES test_conversations(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Создаем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_test_conversations_org_id ON test_conversations(org_id);
CREATE INDEX IF NOT EXISTS idx_test_conversations_created_by ON test_conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_test_conversations_agent_id ON test_conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_test_messages_conversation_id ON test_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_test_messages_created_at ON test_messages(created_at);

-- Композитный индекс для основных запросов
CREATE INDEX IF NOT EXISTS idx_test_conversations_org_user_created
  ON test_conversations(org_id, created_by, created_at DESC);

-- 4. Включаем Row Level Security
ALTER TABLE test_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_messages ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policy для test_conversations: пользователь может управлять своими чатами
CREATE POLICY "Users can manage their own test conversations"
  ON test_conversations
  FOR ALL
  USING (
    created_by = auth.uid()
    AND org_id IN (
      SELECT om.org_id
      FROM organization_members om
      WHERE om.user_id = auth.uid()
    )
  )
  WITH CHECK (
    created_by = auth.uid()
    AND org_id IN (
      SELECT om.org_id
      FROM organization_members om
      WHERE om.user_id = auth.uid()
    )
  );

-- 6. RLS Policy для test_messages: пользователь может управлять сообщениями в своих чатах
CREATE POLICY "Users can manage messages in their own test conversations"
  ON test_messages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM test_conversations tc
      WHERE tc.id = test_messages.conversation_id
        AND tc.created_by = auth.uid()
        AND tc.org_id = test_messages.org_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM test_conversations tc
      WHERE tc.id = test_messages.conversation_id
        AND tc.created_by = auth.uid()
        AND tc.org_id = test_messages.org_id
    )
  );

-- 7. Создаем функцию для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_test_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Создаем триггер для автоматического обновления updated_at
CREATE TRIGGER trigger_update_test_conversations_updated_at
  BEFORE UPDATE ON test_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_test_conversations_updated_at();

-- 9. Комментарии для документации
COMMENT ON TABLE test_conversations IS 'Тестовые беседы с AI агентами';
COMMENT ON TABLE test_messages IS 'Сообщения в тестовых беседах';
COMMENT ON COLUMN test_conversations.org_id IS 'ID организации для tenant isolation';
COMMENT ON COLUMN test_conversations.agent_id IS 'ID агента, который тестируется (nullable)';
COMMENT ON COLUMN test_conversations.created_by IS 'ID пользователя-создателя чата';
COMMENT ON COLUMN test_messages.role IS 'Роль отправителя: user, assistant, system';
COMMENT ON COLUMN test_messages.metadata IS 'Метаданные: токены, стоимость, модель и т.д.';
