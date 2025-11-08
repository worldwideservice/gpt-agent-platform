-- Initial migration system setup
-- This migration must run first to create the migration tracking infrastructure

-- Table for migration tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checksum TEXT
);

-- RLS Policies for schema_migrations (service role only)
ALTER TABLE schema_migrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Service role can manage schema migrations" ON schema_migrations;

CREATE POLICY "Service role can manage schema migrations" ON schema_migrations
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to safely execute migration
CREATE OR REPLACE FUNCTION execute_migration(
  migration_version TEXT,
  migration_name TEXT,
  migration_sql TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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
  VALUES (
    migration_version,
    migration_name,
    encode(digest(migration_sql, 'sha256'), 'hex')
  );

  RAISE NOTICE 'Migration % executed successfully', migration_version;
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Migration % failed: %', migration_version, SQLERRM;
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION execute_migration(TEXT, TEXT, TEXT) TO service_role;

-- Record this migration itself (if not already recorded)
INSERT INTO schema_migrations (version, name, checksum)
VALUES (
  '000_init_migration_system',
  '000_init_migration_system.sql',
  encode(digest('-- Initial migration system setup', 'sha256'), 'hex')
)
ON CONFLICT (version) DO NOTHING;


