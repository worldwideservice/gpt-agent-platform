-- =============================================
-- Migration: Create Notifications System
-- Date: 2025-11-16
-- Description: Создание таблицы уведомлений с RLS
-- =============================================

-- 1. Создаем таблицу notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Связь с организацией (tenant isolation)
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Связь с пользователем
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Тип уведомления
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'lead_new',           -- Новый лид
    'lead_assigned',      -- Лид назначен
    'lead_status_changed',-- Статус лида изменен
    'message_new',        -- Новое сообщение
    'system_alert',       -- Системное уведомление
    'integration_error'   -- Ошибка интеграции
  )),

  -- Заголовок и текст
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,

  -- Метаданные (JSON для дополнительных данных)
  metadata JSONB DEFAULT '{}',

  -- Ссылка для перехода при клике
  action_url TEXT,

  -- Статус прочтения
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Создаем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_notifications_org_id ON notifications(org_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Композитный индекс для основного query (список непрочитанных уведомлений пользователя)
CREATE INDEX IF NOT EXISTS idx_notifications_user_org_read
  ON notifications(user_id, org_id, is_read, created_at DESC);

-- 3. Включаем Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Пользователи могут видеть только свои уведомления в своей организации
CREATE POLICY "Users can view their own notifications in their org"
  ON notifications
  FOR SELECT
  USING (
    user_id = auth.uid()
    AND org_id IN (
      SELECT om.org_id
      FROM organization_members om
      WHERE om.user_id = auth.uid()
    )
  );

-- 5. RLS Policy: Пользователи могут обновлять (mark as read) только свои уведомления
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  USING (
    user_id = auth.uid()
    AND org_id IN (
      SELECT om.org_id
      FROM organization_members om
      WHERE om.user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    AND org_id IN (
      SELECT om.org_id
      FROM organization_members om
      WHERE om.user_id = auth.uid()
    )
  );

-- 6. RLS Policy: Пользователи могут удалять только свои уведомления
CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  USING (
    user_id = auth.uid()
    AND org_id IN (
      SELECT om.org_id
      FROM organization_members om
      WHERE om.user_id = auth.uid()
    )
  );

-- 7. RLS Policy: Service role может создавать уведомления для любого пользователя
CREATE POLICY "Service role can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- 8. Создаем функцию для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();

  -- Если уведомление помечено как прочитанное, устанавливаем read_at
  IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
    NEW.read_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Создаем триггер для автоматического обновления updated_at
CREATE TRIGGER trigger_update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notifications_updated_at();

-- 10. Комментарии для документации
COMMENT ON TABLE notifications IS 'Таблица уведомлений с поддержкой multi-tenancy';
COMMENT ON COLUMN notifications.org_id IS 'ID организации для tenant isolation';
COMMENT ON COLUMN notifications.user_id IS 'ID пользователя-получателя';
COMMENT ON COLUMN notifications.type IS 'Тип уведомления для фильтрации и группировки';
COMMENT ON COLUMN notifications.metadata IS 'Дополнительные данные в JSON формате';
COMMENT ON COLUMN notifications.action_url IS 'URL для перехода при клике на уведомление';
COMMENT ON COLUMN notifications.is_read IS 'Статус прочтения уведомления';
