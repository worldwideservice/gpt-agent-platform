-- Миграция для добавления таблиц кастомных полей и действий CRM
-- Дата: 2025-01-22

-- Таблица для хранения кастомных полей сделок и контактов
CREATE TABLE IF NOT EXISTS crm_custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES crm_connections(id) ON DELETE CASCADE,
  external_id TEXT NOT NULL, -- ID поля в CRM
  entity_type TEXT NOT NULL, -- 'lead', 'contact', 'company', 'customer'
  name TEXT NOT NULL,
  field_type TEXT NOT NULL, -- 'text', 'numeric', 'checkbox', 'select', 'multiselect', 'date', 'url', 'textarea', etc.
  code TEXT, -- Системный код поля (PHONE, EMAIL и т.д.)
  is_required BOOLEAN DEFAULT false,
  is_editable BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  is_deletable BOOLEAN DEFAULT true,
  is_api_only BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  enums JSONB, -- Для полей типа select/multiselect: {"value_id": "Label"}
  settings JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (connection_id, external_id, entity_type)
);

-- Триггер для updated_at
CREATE TRIGGER crm_custom_fields_updated_at
  BEFORE UPDATE ON crm_custom_fields
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_crm_custom_fields_connection ON crm_custom_fields(connection_id);
CREATE INDEX IF NOT EXISTS idx_crm_custom_fields_entity_type ON crm_custom_fields(connection_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_crm_custom_fields_code ON crm_custom_fields(connection_id, code) WHERE code IS NOT NULL;

-- Таблица для хранения доступных действий CRM (для автоматизаций)
CREATE TABLE IF NOT EXISTS crm_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID NOT NULL REFERENCES crm_connections(id) ON DELETE CASCADE,
  action_code TEXT NOT NULL, -- 'create_task', 'add_note', 'add_tag', 'change_responsible', 'send_email', etc.
  action_name TEXT NOT NULL,
  description TEXT,
  entity_types TEXT[], -- К каким сущностям применимо: ['lead', 'contact', 'company']
  required_params JSONB DEFAULT '[]'::jsonb, -- Обязательные параметры
  optional_params JSONB DEFAULT '[]'::jsonb, -- Опциональные параметры
  is_enabled BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (connection_id, action_code)
);

-- Триггер для updated_at
CREATE TRIGGER crm_actions_updated_at
  BEFORE UPDATE ON crm_actions
  FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();

-- Индексы
CREATE INDEX IF NOT EXISTS idx_crm_actions_connection ON crm_actions(connection_id);
CREATE INDEX IF NOT EXISTS idx_crm_actions_code ON crm_actions(connection_id, action_code);
CREATE INDEX IF NOT EXISTS idx_crm_actions_enabled ON crm_actions(connection_id, is_enabled) WHERE is_enabled = true;

-- Комментарии к таблицам
COMMENT ON TABLE crm_custom_fields IS 'Кастомные поля сделок, контактов и компаний из CRM';
COMMENT ON TABLE crm_actions IS 'Доступные действия для автоматизации в CRM';

-- Комментарии к важным полям
COMMENT ON COLUMN crm_custom_fields.entity_type IS 'Тип сущности: lead (сделка), contact (контакт), company (компания), customer (покупатель)';
COMMENT ON COLUMN crm_custom_fields.field_type IS 'Тип поля: text, numeric, checkbox, select, multiselect, date, url, textarea, radiobutton, streetaddress, birthday, etc.';
COMMENT ON COLUMN crm_custom_fields.code IS 'Системный код поля (PHONE, EMAIL, и т.д.) - для стандартных полей';
COMMENT ON COLUMN crm_custom_fields.enums IS 'Для select/multiselect полей: объект {id: "значение"}';

COMMENT ON COLUMN crm_actions.action_code IS 'Код действия: create_task, add_note, add_tag, change_responsible, send_email, update_field, run_salesbot';
COMMENT ON COLUMN crm_actions.entity_types IS 'Массив типов сущностей, к которым применимо действие';
COMMENT ON COLUMN crm_actions.required_params IS 'JSON массив обязательных параметров действия';
COMMENT ON COLUMN crm_actions.optional_params IS 'JSON массив опциональных параметров действия';
