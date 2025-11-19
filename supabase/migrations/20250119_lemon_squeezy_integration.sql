-- Migration: Add Lemon Squeezy integration to subscriptions table
-- Created: 2025-01-19
-- Description: Додає поля для інтеграції з Lemon Squeezy замість Stripe

-- Додати нові колонки для Lemon Squeezy
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS lemon_squeezy_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS lemon_squeezy_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS variant_id TEXT,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS renews_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ;

-- Оновити тип поля status для підтримки нових статусів
-- ALTER TABLE subscriptions ALTER COLUMN status TYPE TEXT;
-- Якщо поле status має enum, потрібно спочатку видалити enum:
DO $$
BEGIN
  -- Перевіряємо чи існує enum type
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    -- Змінюємо тип на TEXT
    ALTER TABLE subscriptions ALTER COLUMN status TYPE TEXT;
    -- Видаляємо enum type
    DROP TYPE IF EXISTS subscription_status;
  END IF;
END
$$;

-- Додати індекси для швидкого пошуку
CREATE INDEX IF NOT EXISTS idx_subscriptions_lemon_squeezy_id
  ON subscriptions(lemon_squeezy_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_lemon_customer_id
  ON subscriptions(lemon_squeezy_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_variant_id
  ON subscriptions(variant_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON subscriptions(status);

-- Оновити таблицю billing_plans для Lemon Squeezy variant_id
ALTER TABLE billing_plans
  ADD COLUMN IF NOT EXISTS variant_id TEXT;

-- Додати коментарі для документації
COMMENT ON COLUMN subscriptions.lemon_squeezy_subscription_id IS 'ID підписки в Lemon Squeezy';
COMMENT ON COLUMN subscriptions.lemon_squeezy_customer_id IS 'ID клієнта в Lemon Squeezy';
COMMENT ON COLUMN subscriptions.variant_id IS 'ID варіанту продукту в Lemon Squeezy';
COMMENT ON COLUMN subscriptions.trial_ends_at IS 'Дата закінчення пробного періоду';
COMMENT ON COLUMN subscriptions.renews_at IS 'Дата наступного продовження підписки';
COMMENT ON COLUMN subscriptions.ends_at IS 'Дата закінчення підписки (якщо скасована)';

-- Опціонально: Видалити старі Stripe колонки (закоментовано для безпеки)
-- Розкоментуйте тільки якщо впевнені, що Stripe більше не використовується
-- ALTER TABLE subscriptions DROP COLUMN IF EXISTS stripe_subscription_id CASCADE;
-- ALTER TABLE subscriptions DROP COLUMN IF EXISTS stripe_customer_id CASCADE;
-- ALTER TABLE subscriptions DROP COLUMN IF EXISTS stripe_price_id CASCADE;
-- ALTER TABLE billing_plans DROP COLUMN IF EXISTS stripe_price_id CASCADE;

-- Додати RLS policies для безпечного доступу до підписок
-- Користувачі можуть бачити тільки підписки своєї організації
DO $$
BEGIN
  -- Видалити існуючу policy якщо є
  DROP POLICY IF EXISTS "Users can view own organization subscriptions" ON subscriptions;

  -- Створити нову policy
  CREATE POLICY "Users can view own organization subscriptions"
    ON subscriptions
    FOR SELECT
    USING (
      org_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE user_id = auth.uid()
      )
    );

  -- Policy для оновлення (тільки система може оновлювати)
  DROP POLICY IF EXISTS "Only system can update subscriptions" ON subscriptions;

  CREATE POLICY "Only system can update subscriptions"
    ON subscriptions
    FOR UPDATE
    USING (false); -- Тільки через service role

EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Skipping RLS policies (insufficient privileges)';
END
$$;
