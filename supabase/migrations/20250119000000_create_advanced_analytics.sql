-- Advanced Analytics System
-- Aggregated metrics and dashboard data

-- Agent analytics table - daily aggregated metrics
CREATE TABLE IF NOT EXISTS agent_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,

  -- Time period
  date DATE NOT NULL,
  hour INTEGER, -- 0-23, NULL for daily aggregates

  -- Request metrics
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  avg_response_time_ms DECIMAL,

  -- Token usage
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,

  -- Cost (in cents)
  total_cost_cents DECIMAL DEFAULT 0,

  -- Quality metrics
  avg_rating DECIMAL,
  total_ratings INTEGER DEFAULT 0,
  thumbs_up INTEGER DEFAULT 0,
  thumbs_down INTEGER DEFAULT 0,

  -- Conversation metrics
  total_conversations INTEGER DEFAULT 0,
  avg_messages_per_conversation DECIMAL,
  avg_conversation_duration_seconds DECIMAL,

  -- Conversion metrics
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL,

  -- Error metrics
  error_rate DECIMAL,
  timeout_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Unique constraint for time-series data
  CONSTRAINT unique_agent_analytics UNIQUE (org_id, agent_id, date, hour)
);

-- Organization analytics table
CREATE TABLE IF NOT EXISTS org_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Time period
  date DATE NOT NULL,
  hour INTEGER,

  -- Aggregate metrics (sum of all agents)
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  avg_response_time_ms DECIMAL,

  total_tokens INTEGER DEFAULT 0,
  total_cost_cents DECIMAL DEFAULT 0,

  avg_rating DECIMAL,
  total_conversations INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,

  -- Active users
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_org_analytics UNIQUE (org_id, date, hour)
);

-- User activity tracking
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,

  -- Activity details
  event_type TEXT NOT NULL, -- page_view, chat_message, conversion, etc.
  event_metadata JSONB,

  -- Agent context
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT user_activity_event_check CHECK (event_type IN (
    'page_view', 'chat_message', 'conversion', 'rating',
    'document_upload', 'search', 'experiment_assign', 'custom'
  ))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agent_analytics_org_date ON agent_analytics(org_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_agent_analytics_agent_date ON agent_analytics(agent_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_agent_analytics_date ON agent_analytics(date DESC);

CREATE INDEX IF NOT EXISTS idx_org_analytics_org_date ON org_analytics(org_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_org_analytics_date ON org_analytics(date DESC);

CREATE INDEX IF NOT EXISTS idx_user_activity_org_id ON user_activity(org_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_session_id ON user_activity(session_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_event_type ON user_activity(event_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_agent_id ON user_activity(agent_id);

-- RLS Policies
ALTER TABLE agent_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY agent_analytics_org_isolation ON agent_analytics
  FOR ALL
  USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY org_analytics_org_isolation ON org_analytics
  FOR ALL
  USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY user_activity_org_isolation ON user_activity
  FOR ALL
  USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Function to get dashboard summary
CREATE OR REPLACE FUNCTION get_dashboard_summary(
  p_org_id UUID,
  p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  metric_name TEXT,
  current_value DECIMAL,
  previous_value DECIMAL,
  change_percentage DECIMAL
)
LANGUAGE plpgsql
AS $$
DECLARE
  period_days INTEGER;
BEGIN
  period_days := (p_end_date - p_start_date);

  RETURN QUERY
  WITH current_period AS (
    SELECT
      SUM(total_requests) as requests,
      SUM(total_tokens) as tokens,
      SUM(total_cost_cents) / 100.0 as cost,
      AVG(avg_rating) as rating,
      SUM(conversions) as conversions
    FROM org_analytics
    WHERE org_id = p_org_id
      AND date BETWEEN p_start_date AND p_end_date
  ),
  previous_period AS (
    SELECT
      SUM(total_requests) as requests,
      SUM(total_tokens) as tokens,
      SUM(total_cost_cents) / 100.0 as cost,
      AVG(avg_rating) as rating,
      SUM(conversions) as conversions
    FROM org_analytics
    WHERE org_id = p_org_id
      AND date BETWEEN (p_start_date - period_days) AND (p_end_date - period_days)
  )
  SELECT 'total_requests'::TEXT,
         cp.requests::DECIMAL,
         pp.requests::DECIMAL,
         CASE WHEN pp.requests > 0
           THEN ((cp.requests - pp.requests) / pp.requests * 100)
           ELSE 0
         END
  FROM current_period cp, previous_period pp
  UNION ALL
  SELECT 'total_tokens'::TEXT,
         cp.tokens::DECIMAL,
         pp.tokens::DECIMAL,
         CASE WHEN pp.tokens > 0
           THEN ((cp.tokens - pp.tokens) / pp.tokens * 100)
           ELSE 0
         END
  FROM current_period cp, previous_period pp
  UNION ALL
  SELECT 'total_cost'::TEXT,
         cp.cost,
         pp.cost,
         CASE WHEN pp.cost > 0
           THEN ((cp.cost - pp.cost) / pp.cost * 100)
           ELSE 0
         END
  FROM current_period cp, previous_period pp
  UNION ALL
  SELECT 'avg_rating'::TEXT,
         cp.rating,
         pp.rating,
         CASE WHEN pp.rating > 0
           THEN ((cp.rating - pp.rating) / pp.rating * 100)
           ELSE 0
         END
  FROM current_period cp, previous_period pp
  UNION ALL
  SELECT 'conversions'::TEXT,
         cp.conversions::DECIMAL,
         pp.conversions::DECIMAL,
         CASE WHEN pp.conversions > 0
           THEN ((cp.conversions - pp.conversions) / pp.conversions * 100)
           ELSE 0
         END
  FROM current_period cp, previous_period pp;
END;
$$;

-- Function to get time series data
CREATE OR REPLACE FUNCTION get_time_series_data(
  p_org_id UUID,
  p_metric TEXT, -- 'requests', 'tokens', 'cost', 'rating'
  p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date DATE DEFAULT CURRENT_DATE,
  p_granularity TEXT DEFAULT 'day' -- 'hour', 'day', 'week', 'month'
)
RETURNS TABLE (
  timestamp TIMESTAMPTZ,
  value DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_granularity = 'hour' THEN
    RETURN QUERY
    SELECT
      (date + (COALESCE(hour, 0) || ' hours')::INTERVAL)::TIMESTAMPTZ as timestamp,
      CASE p_metric
        WHEN 'requests' THEN SUM(total_requests)
        WHEN 'tokens' THEN SUM(total_tokens)
        WHEN 'cost' THEN SUM(total_cost_cents) / 100.0
        WHEN 'rating' THEN AVG(avg_rating)
        ELSE 0
      END as value
    FROM org_analytics
    WHERE org_id = p_org_id
      AND date BETWEEN p_start_date AND p_end_date
    GROUP BY date, hour
    ORDER BY date, hour;
  ELSE
    -- Daily and above
    RETURN QUERY
    SELECT
      date::TIMESTAMPTZ as timestamp,
      CASE p_metric
        WHEN 'requests' THEN SUM(total_requests)
        WHEN 'tokens' THEN SUM(total_tokens)
        WHEN 'cost' THEN SUM(total_cost_cents) / 100.0
        WHEN 'rating' THEN AVG(avg_rating)
        ELSE 0
      END as value
    FROM org_analytics
    WHERE org_id = p_org_id
      AND date BETWEEN p_start_date AND p_end_date
      AND hour IS NULL -- Daily aggregates only
    GROUP BY date
    ORDER BY date;
  END IF;
END;
$$;

-- Function to get top agents
CREATE OR REPLACE FUNCTION get_top_agents(
  p_org_id UUID,
  p_metric TEXT DEFAULT 'requests', -- 'requests', 'conversions', 'rating'
  p_limit INTEGER DEFAULT 10,
  p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  agent_id UUID,
  agent_name TEXT,
  metric_value DECIMAL,
  total_requests INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    aa.agent_id,
    a.name as agent_name,
    CASE p_metric
      WHEN 'requests' THEN SUM(aa.total_requests)
      WHEN 'conversions' THEN SUM(aa.conversions)
      WHEN 'rating' THEN AVG(aa.avg_rating)
      ELSE SUM(aa.total_requests)
    END as metric_value,
    SUM(aa.total_requests)::INTEGER as total_requests
  FROM agent_analytics aa
  JOIN agents a ON a.id = aa.agent_id
  WHERE aa.org_id = p_org_id
    AND aa.date BETWEEN p_start_date AND p_end_date
    AND aa.agent_id IS NOT NULL
  GROUP BY aa.agent_id, a.name
  ORDER BY metric_value DESC
  LIMIT p_limit;
END;
$$;

-- Function to calculate retention
CREATE OR REPLACE FUNCTION calculate_retention(
  p_org_id UUID,
  p_cohort_date DATE
)
RETURNS TABLE (
  day INTEGER,
  users_retained INTEGER,
  retention_rate DECIMAL
)
LANGUAGE plpgsql
AS $$
DECLARE
  cohort_size INTEGER;
BEGIN
  -- Get cohort size (users who started on cohort_date)
  SELECT COUNT(DISTINCT user_id) INTO cohort_size
  FROM user_activity
  WHERE org_id = p_org_id
    AND DATE(created_at) = p_cohort_date
    AND user_id IS NOT NULL;

  RETURN QUERY
  SELECT
    (DATE(ua.created_at) - p_cohort_date)::INTEGER as day,
    COUNT(DISTINCT ua.user_id)::INTEGER as users_retained,
    (COUNT(DISTINCT ua.user_id)::DECIMAL / NULLIF(cohort_size, 0)) as retention_rate
  FROM user_activity ua
  WHERE ua.org_id = p_org_id
    AND ua.user_id IN (
      SELECT DISTINCT user_id
      FROM user_activity
      WHERE org_id = p_org_id
        AND DATE(created_at) = p_cohort_date
        AND user_id IS NOT NULL
    )
    AND DATE(ua.created_at) >= p_cohort_date
  GROUP BY DATE(ua.created_at)
  ORDER BY day;
END;
$$;

-- Comments
COMMENT ON TABLE agent_analytics IS 'Time-series analytics data for agents';
COMMENT ON TABLE org_analytics IS 'Time-series analytics data for organizations';
COMMENT ON TABLE user_activity IS 'User activity event tracking';
COMMENT ON FUNCTION get_dashboard_summary IS 'Get dashboard metrics with period-over-period comparison';
COMMENT ON FUNCTION get_time_series_data IS 'Get time-series data for charts';
COMMENT ON FUNCTION get_top_agents IS 'Get top performing agents by metric';
COMMENT ON FUNCTION calculate_retention IS 'Calculate user retention rates';
