-- Миграция для добавления реальных тарифных планов Stripe
-- Планы основаны на pricingData.ts

-- Удаляем тестовые планы (если есть)
DELETE FROM billing_plans WHERE stripe_price_id LIKE '%_dev';

-- Вставляем реальные планы
-- ВАЖНО: stripe_price_id нужно заменить на реальные ID из Stripe Dashboard
INSERT INTO billing_plans (name, description, stripe_price_id, price_cents, currency, interval, features, limits, sort_order) VALUES
(
  'Launch',
  'Идеально для старта и тестирования',
  'price_launch_monthly', -- TODO: Заменить на реальный Stripe Price ID
  1800, -- $18.00
  'usd',
  'month',
  '{
    "agents": 1,
    "knowledge_articles": 500,
    "instructions_chars": 20000,
    "image_support": true,
    "audio_support": true,
    "video_support": true,
    "document_support": true,
    "incoming_images": true,
    "incoming_voice": true,
    "update_fields": false
  }'::jsonb,
  '{
    "agents": 1,
    "knowledge_articles": 500,
    "instructions_chars": 20000,
    "responses_per_month": 1000,
    "storage_gb": 1
  }'::jsonb,
  1
),
(
  'Scale',
  'Для растущих компаний и команд',
  'price_scale_monthly', -- TODO: Заменить на реальный Stripe Price ID
  57800, -- $578.00
  'usd',
  'month',
  '{
    "agents": 10,
    "knowledge_articles": 100000,
    "instructions_chars": 20000,
    "image_support": true,
    "audio_support": true,
    "video_support": true,
    "document_support": true,
    "incoming_images": true,
    "incoming_voice": true,
    "update_fields": true,
    "models": ["GPT-4.1", "GPT-5", "Gemini 2.5 Flash"]
  }'::jsonb,
  '{
    "agents": 10,
    "knowledge_articles": 100000,
    "instructions_chars": 20000,
    "responses_per_month": 5000,
    "storage_gb": 10
  }'::jsonb,
  2
),
(
  'Max',
  'Полный контроль и неограниченные возможности',
  'price_max_monthly', -- TODO: Заменить на реальный Stripe Price ID
  97300, -- $973.00
  'usd',
  'month',
  '{
    "agents": -1,
    "knowledge_articles": -1,
    "instructions_chars": 40000,
    "image_support": true,
    "audio_support": true,
    "video_support": true,
    "document_support": true,
    "incoming_images": true,
    "incoming_voice": true,
    "update_fields": true,
    "models": ["GPT-4.1", "GPT-5", "Gemini 2.5 Flash", "Claude Sonnet 4"]
  }'::jsonb,
  '{
    "agents": -1,
    "knowledge_articles": -1,
    "instructions_chars": 40000,
    "responses_per_month": -1,
    "storage_gb": -1
  }'::jsonb,
  3
)
ON CONFLICT (stripe_price_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- Комментарии
COMMENT ON TABLE billing_plans IS 'Тарифные планы подписки. stripe_price_id должен соответствовать реальному Stripe Price ID';
COMMENT ON COLUMN billing_plans.stripe_price_id IS 'Stripe Price ID - должен быть создан в Stripe Dashboard перед использованием';
COMMENT ON COLUMN billing_plans.limits IS 'Лимиты плана. -1 означает неограниченно';






