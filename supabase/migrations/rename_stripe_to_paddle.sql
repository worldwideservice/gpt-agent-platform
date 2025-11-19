-- Rename stripe_subscription_id to paddle_subscription_id
ALTER TABLE subscriptions 
RENAME COLUMN stripe_subscription_id TO paddle_subscription_id;

-- Rename stripe_price_id to paddle_price_id if it exists in plans or subscriptions
DO $$
BEGIN
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'plans' AND column_name = 'stripe_price_id') THEN
    ALTER TABLE plans RENAME COLUMN stripe_price_id TO paddle_price_id;
  END IF;
END $$;
