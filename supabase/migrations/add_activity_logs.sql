-- Создание таблицы для хранения активности/обновлений
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES agent_conversations(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_activity_logs_org_id ON activity_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_activity_type ON activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_agent_id ON activity_logs(agent_id);

-- Композитный индекс для частых запросов
CREATE INDEX IF NOT EXISTS idx_activity_logs_org_created ON activity_logs(org_id, created_at DESC);

-- RLS политики
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть только логи своей организации
CREATE POLICY "Users can view activity logs of their organization"
  ON activity_logs
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- Сервисная роль может все
CREATE POLICY "Service role can do everything"
  ON activity_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Комментарии
COMMENT ON TABLE activity_logs IS 'Логи активности для Dashboard Recent Updates';
COMMENT ON COLUMN activity_logs.activity_type IS 'Тип активности: agent_created, agent_response, action_executed, lead_updated, error_occurred, etc.';
COMMENT ON COLUMN activity_logs.metadata IS 'Дополнительные данные события в формате JSON';

