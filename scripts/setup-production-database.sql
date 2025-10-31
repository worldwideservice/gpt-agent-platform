-- ПРОДАКШЕН НАСТРОЙКА SUPABASE БАЗЫ ДАННЫХ
-- Выполните этот скрипт в Supabase SQL Editor

-- ============================================================================
-- 1. ВКЛЮЧИТЬ RLS (Row Level Security) ДЛЯ ВСЕХ ТАБЛИЦ
-- ============================================================================

-- Таблица пользователей
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Таблица агентов
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Таблица знаний
ALTER TABLE knowledge ENABLE ROW LEVEL SECURITY;

-- Таблица интеграций
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Таблица подписок
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. СОЗДАТЬ ПОЛИТИКИ RLS
-- ============================================================================

-- Пользователи могут видеть только свои данные
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
FOR UPDATE USING (auth.uid() = id);

-- Агенты: пользователи видят только свои агенты
CREATE POLICY "Users can view own agents" ON agents
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create agents" ON agents
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agents" ON agents
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own agents" ON agents
FOR DELETE USING (auth.uid() = user_id);

-- Знания: пользователи видят знания своих агентов
CREATE POLICY "Users can view agent knowledge" ON knowledge
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM agents
    WHERE agents.id = knowledge.agent_id
    AND agents.user_id = auth.uid()
  )
);

-- Интеграции: пользователи видят свои интеграции
CREATE POLICY "Users can view own integrations" ON integrations
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own integrations" ON integrations
FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- 3. СОЗДАТЬ НЕОБХОДИМЫЕ ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- ============================================================================

-- Индекс для быстрого поиска пользователей по email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Индекс для поиска агентов по пользователю
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);

-- Индекс для поиска агентов по имени
CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);

-- Индекс для поиска знаний по агенту
CREATE INDEX IF NOT EXISTS idx_knowledge_agent_id ON knowledge(agent_id);

-- Индекс для поиска интеграций по пользователю и типу
CREATE INDEX IF NOT EXISTS idx_integrations_user_type ON integrations(user_id, type);

-- ============================================================================
-- 4. СОЗДАТЬ НЕОБХОДИМЫЕ ФУНКЦИИ
-- ============================================================================

-- Функция для получения tier пользователя
CREATE OR REPLACE FUNCTION get_user_tier(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_tier TEXT;
BEGIN
  SELECT COALESCE(tier, 'free') INTO user_tier
  FROM users
  WHERE id = user_uuid;

  RETURN user_tier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для проверки лимитов по tier
CREATE OR REPLACE FUNCTION check_user_limits(user_uuid UUID, action_type TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_tier TEXT;
  daily_limit INTEGER;
  current_usage INTEGER;
BEGIN
  -- Получить tier пользователя
  SELECT get_user_tier(user_uuid) INTO user_tier;

  -- Определить лимиты по tier и типу действия
  CASE
    WHEN user_tier = 'vip' THEN
      CASE
        WHEN action_type = 'chat' THEN daily_limit := 10000;
        WHEN action_type = 'api' THEN daily_limit := 50000;
        WHEN action_type = 'upload' THEN daily_limit := 1000;
        ELSE daily_limit := 1000;
      END CASE;
    WHEN user_tier = 'premium' THEN
      CASE
        WHEN action_type = 'chat' THEN daily_limit := 1000;
        WHEN action_type = 'api' THEN daily_limit := 10000;
        WHEN action_type = 'upload' THEN daily_limit := 100;
        ELSE daily_limit := 500;
      END CASE;
    ELSE -- free
      CASE
        WHEN action_type = 'chat' THEN daily_limit := 100;
        WHEN action_type = 'api' THEN daily_limit := 1000;
        WHEN action_type = 'upload' THEN daily_limit := 10;
        ELSE daily_limit := 50;
      END CASE;
  END CASE;

  -- Проверить текущее использование за сегодня
  SELECT COUNT(*) INTO current_usage
  FROM user_activity
  WHERE user_id = user_uuid
    AND action = action_type
    AND created_at >= CURRENT_DATE;

  RETURN current_usage < daily_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 5. СОЗДАТЬ ТАБЛИЦЫ ДЛЯ ПРОДАКШЕН ФУНКЦИОНАЛА
-- ============================================================================

-- Таблица для отслеживания активности пользователей
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица для background jobs
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  data JSONB DEFAULT '{}',
  result JSONB DEFAULT '{}',
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица для логов jobs
CREATE TABLE IF NOT EXISTS job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  level TEXT NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица для тарифных планов
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT NOT NULL UNIQUE,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features JSONB DEFAULT '[]',
  limits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. ДОБАВИТЬ ИНДЕКСЫ ДЛЯ НОВЫХ ТАБЛИЦ
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_activity_user_action ON user_activity(user_id, action);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_user_status ON jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_type_status ON jobs(type, status);
CREATE INDEX IF NOT EXISTS idx_job_logs_job_id ON job_logs(job_id);

-- ============================================================================
-- 7. ВСТАВИТЬ БАЗОВЫЕ ДАННЫЕ
-- ============================================================================

-- Вставить базовые тарифные планы
INSERT INTO plans (name, tier, price_monthly, price_yearly, features, limits) VALUES
('Бесплатный', 'free', 0, 0,
 '["5 агентов", "100 сообщений в день", "Базовая поддержка"]'::jsonb,
 '{"agents": 5, "messages": 100, "storage": "1GB"}'::jsonb)
ON CONFLICT (tier) DO NOTHING;

INSERT INTO plans (name, tier, price_monthly, price_yearly, features, limits) VALUES
('Премиум', 'premium', 29.99, 299.99,
 '["25 агентов", "1000 сообщений в день", "Приоритетная поддержка", "Расширенная аналитика"]'::jsonb,
 '{"agents": 25, "messages": 1000, "storage": "10GB"}'::jsonb)
ON CONFLICT (tier) DO NOTHING;

INSERT INTO plans (name, tier, price_monthly, price_yearly, features, limits) VALUES
('VIP', 'vip', 99.99, 999.99,
 '["Неограниченное количество агентов", "10000 сообщений в день", "Персональный менеджер", "API доступ", "Кастомные интеграции"]'::jsonb,
 '{"agents": -1, "messages": 10000, "storage": "100GB"}'::jsonb)
ON CONFLICT (tier) DO NOTHING;

-- ============================================================================
-- 8. ВКЛЮЧИТЬ RLS ДЛЯ НОВЫХ ТАБЛИЦ
-- ============================================================================

ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Пользователи видят только свою активность
CREATE POLICY "Users can view own activity" ON user_activity
FOR SELECT USING (auth.uid() = user_id);

-- Пользователи видят только свои jobs
CREATE POLICY "Users can view own jobs" ON jobs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create jobs" ON jobs
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own jobs" ON jobs
FOR UPDATE USING (auth.uid() = user_id);

-- Job logs доступны только через jobs политику
CREATE POLICY "Users can view own job logs" ON job_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = job_logs.job_id
    AND jobs.user_id = auth.uid()
  )
);

-- Планы доступны всем для чтения
CREATE POLICY "Everyone can view plans" ON plans
FOR SELECT USING (true);

-- ============================================================================
-- 9. СОЗДАТЬ ТРИГГЕРЫ ДЛЯ АВТОМАТИЧЕСКОГО ОБНОВЛЕНИЯ
-- ============================================================================

-- Триггер для обновления updated_at в jobs
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. ДОБАВИТЬ КОММЕНТАРИИ К ТАБЛИЦАМ
-- ============================================================================

COMMENT ON TABLE users IS 'Пользователи системы';
COMMENT ON TABLE agents IS 'AI агенты пользователей';
COMMENT ON TABLE knowledge IS 'База знаний для агентов';
COMMENT ON TABLE integrations IS 'Интеграции пользователей с внешними сервисами';
COMMENT ON TABLE subscriptions IS 'Подписки пользователей на тарифные планы';
COMMENT ON TABLE user_activity IS 'Активность пользователей для аналитики и лимитов';
COMMENT ON TABLE jobs IS 'Background jobs для обработки тяжелых операций';
COMMENT ON TABLE job_logs IS 'Логи выполнения background jobs';
COMMENT ON TABLE plans IS 'Тарифные планы с лимитами и функциями';

-- ============================================================================
-- ГОТОВО! БАЗА ДАННЫХ НАСТРОЕНА ДЛЯ ПРОДАКШЕНА
-- ============================================================================

-- Проверьте что все таблицы созданы:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
