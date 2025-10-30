-- Создание таблицы для настроек CRM интеграций
CREATE TABLE crm_settings (
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

CREATE POLICY "Users can view crm settings from their organization" ON crm_settings
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = crm_settings.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can create crm settings in their organization" ON crm_settings
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = crm_settings.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can update crm settings in their organization" ON crm_settings
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = crm_settings.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can delete crm settings in their organization" ON crm_settings
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = crm_settings.org_id
    AND status = 'active'
  ));

-- Индексы
CREATE INDEX idx_crm_settings_org_id ON crm_settings(org_id);
CREATE INDEX idx_crm_settings_type ON crm_settings(crm_type);
CREATE INDEX idx_crm_settings_active ON crm_settings(org_id, crm_type, is_active);

-- Триггер для updated_at
CREATE TRIGGER update_crm_settings_updated_at
  BEFORE UPDATE ON crm_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
