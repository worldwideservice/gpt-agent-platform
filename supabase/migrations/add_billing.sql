-- Создание таблиц для биллинга и подписок

-- Таблица планов подписки
CREATE TABLE billing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  paddle_price_id TEXT NOT NULL UNIQUE,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  features JSONB DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Таблица подписок
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  paddle_subscription_id TEXT NOT NULL UNIQUE,
  paddle_customer_id TEXT NOT NULL,
  plan_id UUID NOT NULL REFERENCES billing_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  usage_limits JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Таблица записей использования
CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('tokens', 'messages', 'storage', 'agents')),
  amount DECIMAL(10,2) NOT NULL,
  cost_cents INTEGER,
  description TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Добавляем поле paddle_customer_id в organizations
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS paddle_customer_id TEXT;

-- Индексы для производительности
CREATE INDEX idx_billing_plans_active ON billing_plans(is_active) WHERE is_active = true;
CREATE INDEX idx_billing_plans_sort ON billing_plans(sort_order);

CREATE INDEX idx_subscriptions_org ON subscriptions(org_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(paddle_subscription_id);
CREATE INDEX idx_subscriptions_customer ON subscriptions(paddle_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period ON subscriptions(current_period_end);

CREATE INDEX idx_usage_records_org ON usage_records(org_id);
CREATE INDEX idx_usage_records_subscription ON usage_records(subscription_id);
CREATE INDEX idx_usage_records_type ON usage_records(resource_type);
CREATE INDEX idx_usage_records_date ON usage_records(recorded_at);

-- RLS политики
ALTER TABLE billing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

-- Планы доступны всем для чтения
CREATE POLICY "Anyone can view active billing plans" ON billing_plans
  FOR SELECT USING (is_active = true);

-- Пользователи могут видеть свои подписки
CREATE POLICY "Users can view their organization subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = subscriptions.org_id
    AND status = 'active'
  ));

-- Пользователи могут управлять своими подписками
CREATE POLICY "Users can manage their organization subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = subscriptions.org_id
    AND status = 'active'
  ));

-- Пользователи могут видеть использование своей организации
CREATE POLICY "Users can view their organization usage" ON usage_records
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = usage_records.org_id
    AND status = 'active'
  ));

-- Триггеры для обновления updated_at
CREATE OR REPLACE FUNCTION update_billing_plans_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_billing_plans_updated_at
  BEFORE UPDATE ON billing_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_billing_plans_updated_at();

CREATE TRIGGER trigger_update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();

-- Вставляем тестовые планы (для разработки)
INSERT INTO billing_plans (name, description, paddle_price_id, price_cents, currency, interval, features, limits) VALUES
('Starter', 'Идеально для небольших команд', 'pri_starter_dev', 2900, 'usd', 'month', '{
  "agents": 2,
  "tokens_per_month": 100000,
  "messages_per_month": 1000,
  "storage_gb": 5
}', '{
  "agents": 2,
  "tokens_per_month": 100000,
  "messages_per_month": 1000,
  "storage_gb": 5
}'),
('Professional', 'Для растущих компаний', 'pri_professional_dev', 7900, 'usd', 'month', '{
  "agents": 10,
  "tokens_per_month": 500000,
  "messages_per_month": 5000,
  "storage_gb": 25
}', '{
  "agents": 10,
  "tokens_per_month": 500000,
  "messages_per_month": 5000,
  "storage_gb": 25
}'),
('Enterprise', 'Полный контроль и масштабирование', 'pri_enterprise_dev', 19900, 'usd', 'month', '{
  "agents": -1,
  "tokens_per_month": -1,
  "messages_per_month": -1,
  "storage_gb": -1
}', '{
  "agents": -1,
  "tokens_per_month": -1,
  "messages_per_month": -1,
  "storage_gb": -1
}');

-- Обновляем sort_order
UPDATE billing_plans SET sort_order = 1 WHERE name = 'Starter';
UPDATE billing_plans SET sort_order = 2 WHERE name = 'Professional';
UPDATE billing_plans SET sort_order = 3 WHERE name = 'Enterprise';


