-- Улучшение таблицы webhook_events для поддержки retry и расширенной обработки

-- Добавляем поля для retry механизма и статуса обработки
ALTER TABLE webhook_events 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'retrying')),
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_retries INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS event_subtype TEXT, -- 'task_created', 'message_sent', 'call_started' и т.д.
ADD COLUMN IF NOT EXISTS entity_id TEXT, -- ID сущности (lead_id, contact_id, task_id и т.д.)
ADD COLUMN IF NOT EXISTS entity_type TEXT, -- 'lead', 'contact', 'task', 'message', 'call'
ADD COLUMN IF NOT EXISTS execution_context JSONB DEFAULT '{}', -- Контекст для Rule Engine

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON webhook_events(status) WHERE status IN ('pending', 'failed', 'retrying');
CREATE INDEX IF NOT EXISTS idx_webhook_events_org_status ON webhook_events(org_id, status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_next_retry ON webhook_events(next_retry_at) WHERE next_retry_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_webhook_events_entity ON webhook_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created ON webhook_events(created_at DESC);

-- Обновляем существующие записи
UPDATE webhook_events 
SET status = 'completed', processed_at = created_at
WHERE processed_at IS NOT NULL AND status IS NULL;

UPDATE webhook_events 
SET status = 'pending'
WHERE status IS NULL;

-- Комментарии для документации
COMMENT ON COLUMN webhook_events.status IS 'Статус обработки webhook: pending, processing, completed, failed, retrying';
COMMENT ON COLUMN webhook_events.retry_count IS 'Количество попыток повторной обработки';
COMMENT ON COLUMN webhook_events.max_retries IS 'Максимальное количество попыток';
COMMENT ON COLUMN webhook_events.next_retry_at IS 'Время следующей попытки retry';
COMMENT ON COLUMN webhook_events.event_subtype IS 'Подтип события (task_created, message_sent, call_started и т.д.)';
COMMENT ON COLUMN webhook_events.entity_id IS 'ID сущности из CRM (lead_id, contact_id, task_id)';
COMMENT ON COLUMN webhook_events.entity_type IS 'Тип сущности: lead, contact, task, message, call';
COMMENT ON COLUMN webhook_events.execution_context IS 'Контекст для выполнения Rule Engine';

