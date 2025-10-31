-- Job processing tables for background tasks

-- Table for tracking job status
CREATE TABLE IF NOT EXISTS job_status (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'file_processing', 'report_generation', 'bulk_processing', 'model_finetuning'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  user_id TEXT NOT NULL,
  organization_id TEXT,
  payload JSONB, -- Job parameters
  progress JSONB, -- Current progress (current, total, message)
  result JSONB, -- Job result data
  error TEXT, -- Error message if failed
  duration INTEGER, -- Duration in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for job_status
CREATE INDEX IF NOT EXISTS idx_job_status_user_id ON job_status(user_id);
CREATE INDEX IF NOT EXISTS idx_job_status_organization_id ON job_status(organization_id);
CREATE INDEX IF NOT EXISTS idx_job_status_type ON job_status(type);
CREATE INDEX IF NOT EXISTS idx_job_status_status ON job_status(status);
CREATE INDEX IF NOT EXISTS idx_job_status_created_at ON job_status(created_at DESC);

-- Table for migration tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checksum TEXT
);

-- Table for seed data tracking
CREATE TABLE IF NOT EXISTS seed_data (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_count INTEGER DEFAULT 0,
  seeded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checksum TEXT
);

-- RLS Policies for job_status
ALTER TABLE job_status ENABLE ROW LEVEL SECURITY;

-- Users can only see their own jobs
CREATE POLICY "Users can view their own jobs" ON job_status
  FOR SELECT USING (auth.uid()::text = user_id);

-- Users can only create jobs for themselves
CREATE POLICY "Users can create their own jobs" ON job_status
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can only update their own jobs
CREATE POLICY "Users can update their own jobs" ON job_status
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Service role can manage all jobs
CREATE POLICY "Service role can manage all jobs" ON job_status
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for schema_migrations (service role only)
ALTER TABLE schema_migrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage schema migrations" ON schema_migrations
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for seed_data (service role only)
ALTER TABLE seed_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage seed data" ON seed_data
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to safely execute migration
CREATE OR REPLACE FUNCTION execute_migration(migration_version TEXT, migration_name TEXT, migration_sql TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if migration was already executed
  IF EXISTS (SELECT 1 FROM schema_migrations WHERE version = migration_version) THEN
    RAISE NOTICE 'Migration % already executed', migration_version;
    RETURN FALSE;
  END IF;

  -- Execute the migration
  EXECUTE migration_sql;

  -- Record the migration
  INSERT INTO schema_migrations (version, name, checksum)
  VALUES (migration_version, migration_name, encode(sha256(migration_sql::bytea), 'hex'));

  RAISE NOTICE 'Migration % executed successfully', migration_version;
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Migration % failed: %', migration_version, SQLERRM;
END;
$$;
