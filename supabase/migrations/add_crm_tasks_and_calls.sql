-- Создание таблиц для хранения задач и звонков из CRM (Kommo)
-- Эти таблицы используются в webhook-processor.ts для сохранения данных

-- Таблица для хранения задач из CRM
CREATE TABLE IF NOT EXISTS crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL, -- ID задачи из CRM (Kommo)
  entity_id TEXT NOT NULL, -- ID связанной сущности (lead, contact, company)
  entity_type TEXT NOT NULL, -- Тип сущности: 'leads', 'contacts', 'companies'
  task_text TEXT NOT NULL, -- Текст задачи
  task_type_id INTEGER, -- ID типа задачи из CRM
  complete_till TIMESTAMPTZ, -- Дата выполнения задачи
  responsible_user_id INTEGER, -- ID ответственного пользователя из CRM
  is_completed BOOLEAN NOT NULL DEFAULT false, -- Статус выполнения
  metadata JSONB DEFAULT '{}'::jsonb, -- Дополнительные данные из CRM
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Уникальность: одна задача из CRM для организации
  UNIQUE(org_id, task_id)
);

-- Индексы для crm_tasks
CREATE INDEX IF NOT EXISTS idx_crm_tasks_org_id ON crm_tasks(org_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_entity ON crm_tasks(org_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_completed ON crm_tasks(org_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_task_id ON crm_tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_created_at ON crm_tasks(created_at DESC);

-- Таблица для хранения звонков из CRM
CREATE TABLE IF NOT EXISTS crm_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  call_id TEXT NOT NULL, -- ID звонка из CRM (Kommo)
  entity_id TEXT NOT NULL, -- ID связанной сущности (lead, contact, company)
  entity_type TEXT NOT NULL, -- Тип сущности: 'leads', 'contacts', 'companies'
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')), -- Направление звонка
  status TEXT NOT NULL, -- Статус: 'success', 'missed', 'busy', 'no_answer', etc.
  duration INTEGER, -- Длительность звонка в секундах
  source TEXT, -- Источник звонка
  uniq TEXT, -- Уникальный идентификатор звонка
  metadata JSONB DEFAULT '{}'::jsonb, -- Дополнительные данные из CRM
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Уникальность: один звонок из CRM для организации
  UNIQUE(org_id, call_id)
);

-- Индексы для crm_calls
CREATE INDEX IF NOT EXISTS idx_crm_calls_org_id ON crm_calls(org_id);
CREATE INDEX IF NOT EXISTS idx_crm_calls_entity ON crm_calls(org_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_crm_calls_status ON crm_calls(org_id, status);
CREATE INDEX IF NOT EXISTS idx_crm_calls_direction ON crm_calls(org_id, direction);
CREATE INDEX IF NOT EXISTS idx_crm_calls_call_id ON crm_calls(call_id);
CREATE INDEX IF NOT EXISTS idx_crm_calls_created_at ON crm_calls(created_at DESC);

-- Триггеры для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER crm_tasks_updated_at
  BEFORE UPDATE ON crm_tasks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER crm_calls_updated_at
  BEFORE UPDATE ON crm_calls
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- RLS политики
ALTER TABLE crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_calls ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть только задачи и звонки своей организации
CREATE POLICY "Users can view CRM tasks of their organization"
  ON crm_tasks FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view CRM calls of their organization"
  ON crm_calls FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- Сервисная роль может все
CREATE POLICY "Service role can manage CRM tasks"
  ON crm_tasks FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage CRM calls"
  ON crm_calls FOR ALL
  USING (true)
  WITH CHECK (true);

-- Комментарии
COMMENT ON TABLE crm_tasks IS 'Задачи из CRM систем (Kommo) для синхронизации и отслеживания';
COMMENT ON TABLE crm_calls IS 'Звонки из CRM систем (Kommo) для синхронизации и отслеживания';
COMMENT ON COLUMN crm_tasks.task_id IS 'ID задачи из CRM (Kommo) - внешний идентификатор';
COMMENT ON COLUMN crm_calls.call_id IS 'ID звонка из CRM (Kommo) - внешний идентификатор';

