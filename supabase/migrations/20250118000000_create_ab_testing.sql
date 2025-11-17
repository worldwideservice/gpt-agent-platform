-- A/B Testing System
-- Enables testing different agent configurations to optimize performance

-- Experiments table
CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Experiment metadata
  name TEXT NOT NULL,
  description TEXT,

  -- What we're testing
  hypothesis TEXT, -- e.g., "GPT-4 will have higher conversion than GPT-3.5"

  -- Experiment status
  status TEXT NOT NULL DEFAULT 'draft', -- draft, running, paused, completed

  -- Traffic allocation
  traffic_percentage INTEGER NOT NULL DEFAULT 50, -- % of traffic to experiment (0-100)

  -- Variants configuration
  control_variant JSONB NOT NULL, -- Baseline configuration
  test_variant JSONB NOT NULL,    -- New configuration to test

  -- Success metrics
  primary_metric TEXT NOT NULL, -- conversion_rate, avg_rating, response_time, etc.
  secondary_metrics TEXT[], -- Additional metrics to track

  -- Statistical settings
  confidence_level DECIMAL DEFAULT 0.95, -- 95% confidence
  min_sample_size INTEGER DEFAULT 100,   -- Minimum conversions per variant

  -- Time period
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,

  -- Results
  winner TEXT, -- control, test, or null if inconclusive
  results JSONB, -- Detailed statistical results

  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT experiments_status_check CHECK (status IN ('draft', 'running', 'paused', 'completed')),
  CONSTRAINT experiments_traffic_check CHECK (traffic_percentage >= 0 AND traffic_percentage <= 100),
  CONSTRAINT experiments_winner_check CHECK (winner IS NULL OR winner IN ('control', 'test', 'inconclusive'))
);

-- Experiment assignments table - tracks which users see which variant
CREATE TABLE IF NOT EXISTS experiment_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,

  -- User/session identification
  user_id UUID REFERENCES users(id),
  session_id TEXT,

  -- Assignment
  variant TEXT NOT NULL, -- control or test

  -- Metadata
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT experiment_assignments_variant_check CHECK (variant IN ('control', 'test')),
  -- Unique constraint: one assignment per user/session per experiment
  CONSTRAINT unique_user_experiment UNIQUE (experiment_id, user_id),
  CONSTRAINT unique_session_experiment UNIQUE (experiment_id, session_id)
);

-- Experiment events table - tracks metrics for each variant
CREATE TABLE IF NOT EXISTS experiment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES experiment_assignments(id) ON DELETE SET NULL,

  -- Event details
  event_type TEXT NOT NULL, -- conversion, rating, response_time, error, etc.
  event_value DECIMAL, -- Numeric value (rating, time in ms, etc.)
  event_metadata JSONB, -- Additional event data

  -- Variant this event belongs to
  variant TEXT NOT NULL,

  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT experiment_events_variant_check CHECK (variant IN ('control', 'test'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_experiments_org_id ON experiments(org_id);
CREATE INDEX IF NOT EXISTS idx_experiments_status ON experiments(status);
CREATE INDEX IF NOT EXISTS idx_experiments_started_at ON experiments(started_at);

CREATE INDEX IF NOT EXISTS idx_experiment_assignments_experiment_id ON experiment_assignments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_experiment_assignments_user_id ON experiment_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_experiment_assignments_session_id ON experiment_assignments(session_id);

CREATE INDEX IF NOT EXISTS idx_experiment_events_experiment_id ON experiment_events(experiment_id);
CREATE INDEX IF NOT EXISTS idx_experiment_events_assignment_id ON experiment_events(assignment_id);
CREATE INDEX IF NOT EXISTS idx_experiment_events_variant ON experiment_events(variant);
CREATE INDEX IF NOT EXISTS idx_experiment_events_event_type ON experiment_events(event_type);
CREATE INDEX IF NOT EXISTS idx_experiment_events_created_at ON experiment_events(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_experiments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER experiments_updated_at_trigger
  BEFORE UPDATE ON experiments
  FOR EACH ROW
  EXECUTE FUNCTION update_experiments_updated_at();

-- Row Level Security
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_events ENABLE ROW LEVEL SECURITY;

-- Experiments: Users can only access their organization's experiments
CREATE POLICY experiments_org_isolation ON experiments
  FOR ALL
  USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Assignments: Users can see their own assignments
CREATE POLICY experiment_assignments_policy ON experiment_assignments
  FOR ALL
  USING (
    user_id = auth.uid()
    OR
    experiment_id IN (
      SELECT id FROM experiments
      WHERE org_id IN (
        SELECT org_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Events: Accessible by organization members
CREATE POLICY experiment_events_policy ON experiment_events
  FOR ALL
  USING (
    experiment_id IN (
      SELECT id FROM experiments
      WHERE org_id IN (
        SELECT org_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Function to get experiment statistics
CREATE OR REPLACE FUNCTION get_experiment_stats(p_experiment_id UUID)
RETURNS TABLE (
  variant TEXT,
  total_users BIGINT,
  total_events BIGINT,
  conversions BIGINT,
  conversion_rate DECIMAL,
  avg_rating DECIMAL,
  avg_response_time DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH variant_stats AS (
    SELECT
      ea.variant,
      COUNT(DISTINCT ea.id) as users,
      COUNT(ee.id) as events,
      COUNT(ee.id) FILTER (WHERE ee.event_type = 'conversion') as conv,
      AVG(ee.event_value) FILTER (WHERE ee.event_type = 'rating') as rating,
      AVG(ee.event_value) FILTER (WHERE ee.event_type = 'response_time') as resp_time
    FROM experiment_assignments ea
    LEFT JOIN experiment_events ee ON ee.assignment_id = ea.id
    WHERE ea.experiment_id = p_experiment_id
    GROUP BY ea.variant
  )
  SELECT
    vs.variant,
    vs.users as total_users,
    vs.events as total_events,
    vs.conv as conversions,
    CASE WHEN vs.users > 0 THEN (vs.conv::DECIMAL / vs.users) ELSE 0 END as conversion_rate,
    vs.rating as avg_rating,
    vs.resp_time as avg_response_time
  FROM variant_stats vs;
END;
$$;

-- Function to calculate statistical significance (Chi-square test)
CREATE OR REPLACE FUNCTION calculate_significance(
  control_conversions INTEGER,
  control_total INTEGER,
  test_conversions INTEGER,
  test_total INTEGER
)
RETURNS TABLE (
  chi_square DECIMAL,
  p_value DECIMAL,
  is_significant BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
  expected_control DECIMAL;
  expected_test DECIMAL;
  chi_sq DECIMAL;
  total_conv INTEGER;
  total_users INTEGER;
BEGIN
  total_conv := control_conversions + test_conversions;
  total_users := control_total + test_total;

  -- Expected values under null hypothesis
  expected_control := (control_total::DECIMAL / total_users) * total_conv;
  expected_test := (test_total::DECIMAL / total_users) * total_conv;

  -- Chi-square statistic
  chi_sq :=
    POWER(control_conversions - expected_control, 2) / expected_control +
    POWER(test_conversions - expected_test, 2) / expected_test;

  -- Simplified p-value approximation (for df=1, critical value at 0.05 is 3.84)
  -- This is a rough approximation; in production, use a proper statistical library
  RETURN QUERY
  SELECT
    chi_sq as chi_square,
    CASE
      WHEN chi_sq > 3.84 THEN 0.05
      WHEN chi_sq > 6.63 THEN 0.01
      ELSE 0.10
    END as p_value,
    chi_sq > 3.84 as is_significant;
END;
$$;

-- Comments for documentation
COMMENT ON TABLE experiments IS 'A/B test experiments to optimize agent configurations';
COMMENT ON TABLE experiment_assignments IS 'Tracks which users are assigned to which variant';
COMMENT ON TABLE experiment_events IS 'Metrics and events tracked during experiments';
COMMENT ON FUNCTION get_experiment_stats IS 'Calculate statistics for each variant in an experiment';
COMMENT ON FUNCTION calculate_significance IS 'Test statistical significance between control and test variants';
