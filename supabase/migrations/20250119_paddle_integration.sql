-- Migration: Add Paddle integration to subscriptions table
-- Created: 2025-01-19
-- Description: Додає поля для інтеграції з Paddle замість Lemon Squeezy

-- Додати нові колонки для Paddle
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS paddle_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS paddle_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS price_id TEXT;

-- Видалити або перейменувати Lemon Squeezy колонки (на випадок якщо вони існують)
-- Безпечний спосіб: перейменовуємо старі колонки замість видалення
DO $$
BEGIN
  -- Перейменовуємо lemon_squeezy колонки для збереження історичних даних
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'lemon_squeezy_subscription_id'
  ) THEN
    ALTER TABLE subscriptions RENAME COLUMN lemon_squeezy_subscription_id TO legacy_ls_subscription_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'lemon_squeezy_customer_id'
  ) THEN
    ALTER TABLE subscriptions RENAME COLUMN lemon_squeezy_customer_id TO legacy_ls_customer_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'variant_id'
  ) THEN
    ALTER TABLE subscriptions RENAME COLUMN variant_id TO legacy_ls_variant_id;
  END IF;
END
$$;

-- Додати індекси для швидкого пошуку Paddle даних
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_subscription_id
  ON subscriptions(paddle_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_customer_id
  ON subscriptions(paddle_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_price_id
  ON subscriptions(price_id);

-- Видалити старі Lemon Squeezy індекси якщо існують
DROP INDEX IF EXISTS idx_subscriptions_lemon_squeezy_id;
DROP INDEX IF EXISTS idx_subscriptions_lemon_customer_id;
DROP INDEX IF EXISTS idx_subscriptions_variant_id;

-- Додати коментарі для документації
COMMENT ON COLUMN subscriptions.paddle_subscription_id IS 'ID підписки в Paddle';
COMMENT ON COLUMN subscriptions.paddle_customer_id IS 'ID клієнта в Paddle';
COMMENT ON COLUMN subscriptions.paddle_transaction_id IS 'ID останньої транзакції в Paddle';
COMMENT ON COLUMN subscriptions.price_id IS 'ID ціни (price) в Paddle';

-- Додати підтримку нового статусу 'paused' для Paddle
-- Оновлюємо тип поля status якщо він enum
DO $$
BEGIN
  -- Перевіряємо чи існує enum type
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    -- Змінюємо тип на TEXT для підтримки всіх статусів
    ALTER TABLE subscriptions ALTER COLUMN status TYPE TEXT;
    -- Видаляємо enum type
    DROP TYPE IF EXISTS subscription_status;
  END IF;
END
$$;

-- RLS policies (вже існують, але перевіримо і оновимо якщо потрібно)
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
        SELECT org_id
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

-- Оновлення існуючих записів (опціонально)
-- Якщо потрібно зберегти старі Lemon Squeezy дані, вони вже перейменовані в legacy_ls_* колонки
-- Нові підписки будуть створюватись через Paddle webhook з новими полями
