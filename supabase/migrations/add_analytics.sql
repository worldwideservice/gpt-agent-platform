-- Создание таблиц для расширенной аналитики

-- Таблица метрик аналитики
CREATE TABLE analytics_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  dimensions JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Таблица отчетов аналитики
CREATE TABLE analytics_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('usage', 'performance', 'engagement', 'revenue')),
  title TEXT NOT NULL,
  description TEXT,
  date_range JSONB NOT NULL,
  data JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Индексы для производительности
CREATE INDEX idx_analytics_metrics_org ON analytics_metrics(org_id);
CREATE INDEX idx_analytics_metrics_type ON analytics_metrics(metric_type);
CREATE INDEX idx_analytics_metrics_timestamp ON analytics_metrics(timestamp);
CREATE INDEX idx_analytics_metrics_dimensions ON analytics_metrics USING GIN(dimensions);

CREATE INDEX idx_analytics_reports_org ON analytics_reports(org_id);
CREATE INDEX idx_analytics_reports_type ON analytics_reports(report_type);
CREATE INDEX idx_analytics_reports_generated ON analytics_reports(generated_at);

-- RLS политики
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organization metrics" ON analytics_metrics
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = analytics_metrics.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can insert their organization metrics" ON analytics_metrics
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = analytics_metrics.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can view their organization reports" ON analytics_reports
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = analytics_reports.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can manage their organization reports" ON analytics_reports
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = analytics_reports.org_id
    AND status = 'active'
  ));

-- Полезные функции для аналитики

-- Функция для получения топ агентов по производительности
CREATE OR REPLACE FUNCTION get_top_agents_performance(
  p_org_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  agent_id UUID,
  name TEXT,
  conversations_count BIGINT,
  messages_count BIGINT,
  tokens_used BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id as agent_id,
    a.name,
    COUNT(DISTINCT ac.id) as conversations_count,
    COUNT(cm.id) as messages_count,
    COALESCE(SUM(mt.tokens_used), 0) as tokens_used
  FROM agents a
  LEFT JOIN agent_conversations ac ON ac.agent_id = a.id
    AND ac.org_id = p_org_id
    AND ac.created_at >= p_start_date
    AND ac.created_at <= p_end_date
  LEFT JOIN conversation_messages cm ON cm.conversation_id = ac.id
  LEFT JOIN message_tokens mt ON mt.conversation_id = ac.id
  WHERE a.org_id = p_org_id
  GROUP BY a.id, a.name
  ORDER BY conversations_count DESC, messages_count DESC
  LIMIT p_limit;
END;
$$;

-- Функция для получения использования по периодам
CREATE OR REPLACE FUNCTION get_usage_by_period(
  p_org_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_period TEXT DEFAULT 'day'
)
RETURNS TABLE (
  period TEXT,
  conversations BIGINT,
  messages BIGINT,
  tokens BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_period = 'day' THEN
    RETURN QUERY
    SELECT
      DATE(ac.created_at)::TEXT as period,
      COUNT(DISTINCT ac.id) as conversations,
      COUNT(cm.id) as messages,
      COALESCE(SUM(mt.tokens_used), 0) as tokens
    FROM agent_conversations ac
    LEFT JOIN conversation_messages cm ON cm.conversation_id = ac.id
    LEFT JOIN message_tokens mt ON mt.conversation_id = ac.id
    WHERE ac.org_id = p_org_id
      AND ac.created_at >= p_start_date
      AND ac.created_at <= p_end_date
    GROUP BY DATE(ac.created_at)
    ORDER BY DATE(ac.created_at);
  ELSIF p_period = 'week' THEN
    RETURN QUERY
    SELECT
      EXTRACT(WEEK FROM ac.created_at)::TEXT as period,
      COUNT(DISTINCT ac.id) as conversations,
      COUNT(cm.id) as messages,
      COALESCE(SUM(mt.tokens_used), 0) as tokens
    FROM agent_conversations ac
    LEFT JOIN conversation_messages cm ON cm.conversation_id = ac.id
    LEFT JOIN message_tokens mt ON mt.conversation_id = ac.id
    WHERE ac.org_id = p_org_id
      AND ac.created_at >= p_start_date
      AND ac.created_at <= p_end_date
    GROUP BY EXTRACT(WEEK FROM ac.created_at)
    ORDER BY EXTRACT(WEEK FROM ac.created_at);
  ELSIF p_period = 'month' THEN
    RETURN QUERY
    SELECT
      TO_CHAR(ac.created_at, 'YYYY-MM') as period,
      COUNT(DISTINCT ac.id) as conversations,
      COUNT(cm.id) as messages,
      COALESCE(SUM(mt.tokens_used), 0) as tokens
    FROM agent_conversations ac
    LEFT JOIN conversation_messages cm ON cm.conversation_id = ac.id
    LEFT JOIN message_tokens mt ON mt.conversation_id = ac.id
    WHERE ac.org_id = p_org_id
      AND ac.created_at >= p_start_date
      AND ac.created_at <= p_end_date
    GROUP BY TO_CHAR(ac.created_at, 'YYYY-MM')
    ORDER BY TO_CHAR(ac.created_at, 'YYYY-MM');
  END IF;
END;
$$;

-- Функция для расчета метрик вовлеченности
CREATE OR REPLACE FUNCTION calculate_engagement_metrics(
  p_org_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  total_conversations BIGINT;
  avg_messages_per_conversation DECIMAL;
  avg_session_duration INTERVAL;
  return_visitor_rate DECIMAL;
BEGIN
  -- Общее количество разговоров
  SELECT COUNT(*) INTO total_conversations
  FROM agent_conversations
  WHERE org_id = p_org_id
    AND created_at >= p_start_date
    AND created_at <= p_end_date;

  -- Среднее количество сообщений на разговор
  SELECT AVG(message_count) INTO avg_messages_per_conversation
  FROM (
    SELECT COUNT(*) as message_count
    FROM conversation_messages cm
    JOIN agent_conversations ac ON ac.id = cm.conversation_id
    WHERE ac.org_id = p_org_id
      AND ac.created_at >= p_start_date
      AND ac.created_at <= p_end_date
    GROUP BY cm.conversation_id
  ) sub;

  -- Средняя продолжительность сессии
  SELECT AVG(ac.updated_at - ac.created_at) INTO avg_session_duration
  FROM agent_conversations ac
  WHERE ac.org_id = p_org_id
    AND ac.created_at >= p_start_date
    AND ac.created_at <= p_end_date;

  -- Коэффициент возврата посетителей (упрощенная версия)
  -- TODO: улучшить логику определения повторных посетителей
  SELECT 0.0 INTO return_visitor_rate;

  result := jsonb_build_object(
    'total_conversations', total_conversations,
    'avg_messages_per_conversation', COALESCE(avg_messages_per_conversation, 0),
    'avg_session_duration_seconds', EXTRACT(EPOCH FROM COALESCE(avg_session_duration, INTERVAL '0 seconds')),
    'return_visitor_rate', return_visitor_rate
  );

  RETURN result;
END;
$$;


