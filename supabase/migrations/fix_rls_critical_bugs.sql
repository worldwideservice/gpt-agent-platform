-- ============================================
-- CRITICAL FIX: Replace 'members' with 'organization_members' in RLS policies
-- Date: 2025-11-17
-- Priority: P0 - BLOCKS PRODUCTION DEPLOYMENT
--
-- PROBLEM: 7+ migrations use wrong table name 'members' instead of 'organization_members'
-- IMPACT: RLS policies FAIL with "relation 'members' does not exist" error
-- AFFECTED TABLES: 10+ tables have broken RLS policies
-- ============================================

-- ============================================
-- Fix analytics_metrics
-- ============================================

DROP POLICY IF EXISTS "Users can view their organization metrics" ON analytics_metrics;
DROP POLICY IF EXISTS "Users can insert their organization metrics" ON analytics_metrics;

CREATE POLICY "Users can view their organization metrics" ON analytics_metrics
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = analytics_metrics.org_id AND status = 'active'
  ));

CREATE POLICY "Users can insert their organization metrics" ON analytics_metrics
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = analytics_metrics.org_id AND status = 'active'
  ));

-- ============================================
-- Fix analytics_reports
-- ============================================

DROP POLICY IF EXISTS "Users can view their organization reports" ON analytics_reports;
DROP POLICY IF EXISTS "Users can manage their organization reports" ON analytics_reports;

CREATE POLICY "Users can view their organization reports" ON analytics_reports
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = analytics_reports.org_id AND status = 'active'
  ));

CREATE POLICY "Users can manage their organization reports" ON analytics_reports
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = analytics_reports.org_id AND status = 'active'
  ));

-- ============================================
-- Fix agent_memory
-- ============================================

DROP POLICY IF EXISTS "Users can view memory from their organization" ON agent_memory;
DROP POLICY IF EXISTS "Users can insert memory for their organization" ON agent_memory;
DROP POLICY IF EXISTS "Users can update memory from their organization" ON agent_memory;
DROP POLICY IF EXISTS "Users can delete memory from their organization" ON agent_memory;

CREATE POLICY "Users can view memory from their organization" ON agent_memory
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = agent_memory.org_id AND status = 'active'
  ));

CREATE POLICY "Users can insert memory for their organization" ON agent_memory
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = agent_memory.org_id AND status = 'active'
  ));

CREATE POLICY "Users can update memory from their organization" ON agent_memory
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = agent_memory.org_id AND status = 'active'
  ));

CREATE POLICY "Users can delete memory from their organization" ON agent_memory
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = agent_memory.org_id AND status = 'active'
  ));

-- ============================================
-- Fix email_templates
-- ============================================

DROP POLICY IF EXISTS "Users can view email templates from their organization" ON email_templates;
DROP POLICY IF EXISTS "Users can create email templates in their organization" ON email_templates;
DROP POLICY IF EXISTS "Users can update email templates in their organization" ON email_templates;
DROP POLICY IF EXISTS "Users can delete email templates in their organization" ON email_templates;

CREATE POLICY "Users can view email templates from their organization" ON email_templates
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = email_templates.org_id AND status = 'active'
  ));

CREATE POLICY "Users can create email templates in their organization" ON email_templates
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = email_templates.org_id AND status = 'active'
  ));

CREATE POLICY "Users can update email templates in their organization" ON email_templates
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = email_templates.org_id AND status = 'active'
  ));

CREATE POLICY "Users can delete email templates in their organization" ON email_templates
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = email_templates.org_id AND status = 'active'
  ));

-- ============================================
-- Fix subscriptions (billing)
-- ============================================

DROP POLICY IF EXISTS "Users can view their organization subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can manage their organization subscriptions" ON subscriptions;

-- NOTE: subscriptions table appears twice in schema.sql and add_billing.sql
-- This migration fixes the billing version which has the broken policy
CREATE POLICY "Users can view their organization subscriptions" ON subscriptions
  FOR SELECT USING (
    -- Handle both versions of subscriptions table
    -- Version 1: org_id is primary key (schema.sql)
    -- Version 2: org_id is foreign key (add_billing.sql)
    CASE
      WHEN EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'subscriptions'
        AND column_name = 'stripe_subscription_id'
      )
      THEN auth.uid() IN (
        SELECT user_id FROM organization_members
        WHERE org_id = subscriptions.org_id AND status = 'active'
      )
      ELSE auth.uid() IN (
        SELECT user_id FROM organization_members
        WHERE org_id = subscriptions.org_id AND status = 'active'
      )
    END
  );

CREATE POLICY "Users can manage their organization subscriptions" ON subscriptions
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = subscriptions.org_id AND status = 'active'
  ));

-- ============================================
-- Fix usage_records
-- ============================================

DROP POLICY IF EXISTS "Users can view their organization usage" ON usage_records;

CREATE POLICY "Users can view their organization usage" ON usage_records
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = usage_records.org_id AND status = 'active'
  ));

-- ============================================
-- Fix sequences
-- ============================================

DROP POLICY IF EXISTS "Users can view sequences from their organization" ON sequences;
DROP POLICY IF EXISTS "Users can insert sequences for their organization" ON sequences;
DROP POLICY IF EXISTS "Users can update sequences from their organization" ON sequences;
DROP POLICY IF EXISTS "Users can delete sequences from their organization" ON sequences;

CREATE POLICY "Users can view sequences from their organization" ON sequences
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = sequences.org_id AND status = 'active'
  ));

CREATE POLICY "Users can insert sequences for their organization" ON sequences
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = sequences.org_id AND status = 'active'
  ));

CREATE POLICY "Users can update sequences from their organization" ON sequences
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = sequences.org_id AND status = 'active'
  ));

CREATE POLICY "Users can delete sequences from their organization" ON sequences
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = sequences.org_id AND status = 'active'
  ));

-- ============================================
-- Fix sequence_steps
-- ============================================

DROP POLICY IF EXISTS "Users can view sequence steps from their organization" ON sequence_steps;
DROP POLICY IF EXISTS "Users can manage sequence steps from their organization" ON sequence_steps;

CREATE POLICY "Users can view sequence steps from their organization" ON sequence_steps
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members m
    JOIN sequences s ON s.id = sequence_steps.sequence_id
    WHERE m.org_id = s.org_id AND m.status = 'active'
  ));

CREATE POLICY "Users can manage sequence steps from their organization" ON sequence_steps
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM organization_members m
    JOIN sequences s ON s.id = sequence_steps.sequence_id
    WHERE m.org_id = s.org_id AND m.status = 'active'
  ));

-- ============================================
-- Fix sequence_executions
-- ============================================

DROP POLICY IF EXISTS "Users can view sequence executions from their organization" ON sequence_executions;
DROP POLICY IF EXISTS "Users can manage sequence executions from their organization" ON sequence_executions;

CREATE POLICY "Users can view sequence executions from their organization" ON sequence_executions
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = sequence_executions.org_id AND status = 'active'
  ));

CREATE POLICY "Users can manage sequence executions from their organization" ON sequence_executions
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM organization_members
    WHERE org_id = sequence_executions.org_id AND status = 'active'
  ));

-- ============================================
-- CRITICAL FIX: Add RLS to crm_credentials
-- Contains sensitive API secrets!
-- ============================================

ALTER TABLE crm_credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their org CRM credentials" ON crm_credentials;
DROP POLICY IF EXISTS "Admins can manage CRM credentials" ON crm_credentials;

-- Пользователи могут видеть только credentials своей организации
CREATE POLICY "Users can view their org CRM credentials" ON crm_credentials
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Только admin и owner могут управлять credentials
CREATE POLICY "Admins can manage CRM credentials" ON crm_credentials
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
      AND status = 'active'
    )
  );

-- ============================================
-- HIGH PRIORITY: Add RLS to password_resets
-- ============================================

ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own password resets" ON password_resets;
DROP POLICY IF EXISTS "Users can create their own password resets" ON password_resets;
DROP POLICY IF EXISTS "Service role can manage password resets" ON password_resets;

-- Пользователи могут видеть только свои password resets
CREATE POLICY "Users can view their own password resets" ON password_resets
  FOR SELECT USING (user_id = auth.uid());

-- Пользователи могут создавать password reset для себя (через публичный endpoint)
-- Service role будет создавать через bypass RLS
CREATE POLICY "Allow password reset creation" ON password_resets
  FOR INSERT WITH CHECK (true);

-- Service role может управлять всеми password resets (через bypass RLS)
-- Эта policy на всякий случай, но service_role должен bypass RLS
CREATE POLICY "Service role can manage password resets" ON password_resets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- MEDIUM PRIORITY: Add RLS to other tables
-- ============================================

-- oauth_states
ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage OAuth states for their org" ON oauth_states;

CREATE POLICY "Users can manage OAuth states for their org" ON oauth_states
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- organization_invites
ALTER TABLE organization_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view invites for their org" ON organization_invites;
DROP POLICY IF EXISTS "Admins can manage invites for their org" ON organization_invites;
DROP POLICY IF EXISTS "Allow invite token validation" ON organization_invites;

-- Пользователи могут видеть invites для своей организации
CREATE POLICY "Users can view invites for their org" ON organization_invites
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Admins могут управлять invites для своей организации
CREATE POLICY "Admins can manage invites for their org" ON organization_invites
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
      AND status = 'active'
    )
  );

-- Разрешаем проверку токена для anon users (для accept invite flow)
CREATE POLICY "Allow invite token validation" ON organization_invites
  FOR SELECT
  TO anon
  USING (expires_at > NOW() AND accepted_at IS NULL);

-- usage_daily
ALTER TABLE usage_daily ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view usage for their org" ON usage_daily;

CREATE POLICY "Users can view usage for their org" ON usage_daily
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM organization_members
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Service role может писать usage metrics
CREATE POLICY "Service role can manage usage" ON usage_daily
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- Verification queries
-- ============================================

-- Check RLS is enabled on all critical tables
DO $$
DECLARE
  missing_rls RECORD;
  has_errors BOOLEAN := FALSE;
BEGIN
  RAISE NOTICE 'Checking RLS status on critical tables...';

  FOR missing_rls IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN (
      'analytics_metrics', 'analytics_reports', 'agent_memory',
      'email_templates', 'subscriptions', 'usage_records',
      'sequences', 'sequence_steps', 'sequence_executions',
      'crm_credentials', 'password_resets', 'oauth_states',
      'organization_invites', 'usage_daily'
    )
    AND rowsecurity = false
  LOOP
    RAISE WARNING 'Table % does NOT have RLS enabled!', missing_rls.tablename;
    has_errors := TRUE;
  END LOOP;

  IF NOT has_errors THEN
    RAISE NOTICE 'SUCCESS: All critical tables have RLS enabled';
  ELSE
    RAISE EXCEPTION 'FAILED: Some tables are missing RLS!';
  END IF;
END $$;

-- Check policies exist
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
  AND tablename IN (
    'analytics_metrics', 'analytics_reports', 'agent_memory',
    'email_templates', 'subscriptions', 'usage_records',
    'sequences', 'sequence_steps', 'sequence_executions',
    'crm_credentials', 'password_resets', 'oauth_states',
    'organization_invites', 'usage_daily'
  );

  RAISE NOTICE 'Total RLS policies on critical tables: %', policy_count;

  IF policy_count < 20 THEN
    RAISE WARNING 'Expected at least 20 policies, found only %', policy_count;
  ELSE
    RAISE NOTICE 'SUCCESS: RLS policies look good (% policies)', policy_count;
  END IF;
END $$;

-- ============================================
-- Migration complete
-- ============================================

RAISE NOTICE '============================================';
RAISE NOTICE 'RLS Critical Bugs Fix Migration Complete';
RAISE NOTICE 'Date: 2025-11-17';
RAISE NOTICE '============================================';
RAISE NOTICE 'Fixed:';
RAISE NOTICE '  - 10+ tables with wrong table name (members -> organization_members)';
RAISE NOTICE '  - Added RLS to crm_credentials (CRITICAL - API secrets)';
RAISE NOTICE '  - Added RLS to password_resets';
RAISE NOTICE '  - Added RLS to oauth_states';
RAISE NOTICE '  - Added RLS to organization_invites';
RAISE NOTICE '  - Added RLS to usage_daily';
RAISE NOTICE '============================================';
RAISE NOTICE 'Next steps:';
RAISE NOTICE '  1. Test on staging environment';
RAISE NOTICE '  2. Run cross-org access tests';
RAISE NOTICE '  3. Deploy to production';
RAISE NOTICE '============================================';
