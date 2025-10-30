-- Добавление поля lead_id в таблицу agent_conversations
-- для связи с сделками Kommo CRM

ALTER TABLE agent_conversations
ADD COLUMN IF NOT EXISTS lead_id INTEGER;

-- Индекс для быстрого поиска по lead_id
CREATE INDEX IF NOT EXISTS idx_agent_conversations_lead_id ON agent_conversations(lead_id);

-- Комментарий к полю
COMMENT ON COLUMN agent_conversations.lead_id IS 'ID сделки в Kommo CRM';
