-- ============================================
-- RLS Fix Verification Script
-- Run this AFTER applying fix_rls_critical_bugs.sql
-- ============================================

-- ============================================
-- 1. Verify RLS is enabled on all critical tables
-- ============================================

DO $$
DECLARE
  total_tables INT;
  enabled_tables INT;
  missing_rls TEXT[];
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE '1. Checking RLS Status on Critical Tables';
  RAISE NOTICE '============================================';

  SELECT COUNT(*) INTO total_tables
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename IN (
    'analytics_metrics', 'analytics_reports', 'agent_memory',
    'email_templates', 'subscriptions', 'usage_records',
    'sequences', 'sequence_steps', 'sequence_executions',
    'crm_credentials', 'password_resets', 'oauth_states',
    'organization_invites', 'usage_daily'
  );

  SELECT COUNT(*) INTO enabled_tables
  FROM pg_tables
  WHERE schemaname = 'public'
  AND rowsecurity = true
  AND tablename IN (
    'analytics_metrics', 'analytics_reports', 'agent_memory',
    'email_templates', 'subscriptions', 'usage_records',
    'sequences', 'sequence_steps', 'sequence_executions',
    'crm_credentials', 'password_resets', 'oauth_states',
    'organization_invites', 'usage_daily'
  );

  SELECT array_agg(tablename) INTO missing_rls
  FROM pg_tables
  WHERE schemaname = 'public'
  AND rowsecurity = false
  AND tablename IN (
    'analytics_metrics', 'analytics_reports', 'agent_memory',
    'email_templates', 'subscriptions', 'usage_records',
    'sequences', 'sequence_steps', 'sequence_executions',
    'crm_credentials', 'password_resets', 'oauth_states',
    'organization_invites', 'usage_daily'
  );

  RAISE NOTICE 'Total critical tables: %', total_tables;
  RAISE NOTICE 'Tables with RLS enabled: %', enabled_tables;

  IF enabled_tables = total_tables THEN
    RAISE NOTICE '✅ SUCCESS: All critical tables have RLS enabled!';
  ELSE
    RAISE WARNING '❌ FAILED: % tables missing RLS:', (total_tables - enabled_tables);
    IF missing_rls IS NOT NULL THEN
      RAISE WARNING 'Missing RLS on: %', array_to_string(missing_rls, ', ');
    END IF;
  END IF;
END $$;

-- Display detailed RLS status
SELECT
  tablename,
  CASE WHEN rowsecurity THEN '✅ Enabled' ELSE '❌ Disabled' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'analytics_metrics', 'analytics_reports', 'agent_memory',
  'email_templates', 'subscriptions', 'usage_records',
  'sequences', 'sequence_steps', 'sequence_executions',
  'crm_credentials', 'password_resets', 'oauth_states',
  'organization_invites', 'usage_daily'
)
ORDER BY tablename;

-- ============================================
-- 2. Verify RLS policies exist
-- ============================================

DO $$
DECLARE
  total_policies INT;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE '2. Checking RLS Policies';
  RAISE NOTICE '============================================';

  SELECT COUNT(*) INTO total_policies
  FROM pg_policies
  WHERE schemaname = 'public'
  AND tablename IN (
    'analytics_metrics', 'analytics_reports', 'agent_memory',
    'email_templates', 'subscriptions', 'usage_records',
    'sequences', 'sequence_steps', 'sequence_executions',
    'crm_credentials', 'password_resets', 'oauth_states',
    'organization_invites', 'usage_daily'
  );

  RAISE NOTICE 'Total RLS policies on critical tables: %', total_policies;

  IF total_policies >= 20 THEN
    RAISE NOTICE '✅ SUCCESS: RLS policies look good (% policies)', total_policies;
  ELSE
    RAISE WARNING '⚠️  WARNING: Expected at least 20 policies, found only %', total_policies;
  END IF;
END $$;

-- Display policy counts per table
SELECT
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN (
  'analytics_metrics', 'analytics_reports', 'agent_memory',
  'email_templates', 'subscriptions', 'usage_records',
  'sequences', 'sequence_steps', 'sequence_executions',
  'crm_credentials', 'password_resets', 'oauth_states',
  'organization_invites', 'usage_daily'
)
GROUP BY tablename
ORDER BY tablename;

-- ============================================
-- 3. Verify NO policies reference 'members' table
-- ============================================

DO $$
DECLARE
  broken_policies INT;
  broken_list TEXT;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE '3. Checking for Broken Policies (using "members")';
  RAISE NOTICE '============================================';

  SELECT COUNT(*) INTO broken_policies
  FROM pg_policies
  WHERE schemaname = 'public'
  AND pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) LIKE '%FROM members%'
  AND pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) NOT LIKE '%organization_members%';

  IF broken_policies = 0 THEN
    RAISE NOTICE '✅ SUCCESS: No policies reference wrong "members" table';
  ELSE
    RAISE WARNING '❌ FAILED: Found % policies still using "members" table!', broken_policies;

    SELECT string_agg(tablename || '.' || policyname, ', ')
    INTO broken_list
    FROM pg_policies
    WHERE schemaname = 'public'
    AND pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) LIKE '%FROM members%'
    AND pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) NOT LIKE '%organization_members%';

    RAISE WARNING 'Broken policies: %', broken_list;
  END IF;
END $$;

-- ============================================
-- 4. Verify organization_members table exists
-- ============================================

DO $$
DECLARE
  table_exists BOOLEAN;
  member_count INT;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE '4. Checking organization_members Table';
  RAISE NOTICE '============================================';

  SELECT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'organization_members'
  ) INTO table_exists;

  IF table_exists THEN
    RAISE NOTICE '✅ Table "organization_members" exists';

    EXECUTE 'SELECT COUNT(*) FROM organization_members' INTO member_count;
    RAISE NOTICE 'Members in table: %', member_count;
  ELSE
    RAISE WARNING '❌ CRITICAL: Table "organization_members" does NOT exist!';
    RAISE WARNING 'This will cause ALL RLS policies to fail!';
  END IF;
END $$;

-- ============================================
-- 5. Test RLS Policy Structure
-- ============================================

DO $$
DECLARE
  policy_rec RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE '5. Detailed Policy Review';
  RAISE NOTICE '============================================';

  FOR policy_rec IN
    SELECT
      tablename,
      policyname,
      cmd as command,
      CASE
        WHEN pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) LIKE '%organization_members%' THEN '✅'
        WHEN pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) LIKE '%FROM members%' THEN '❌'
        ELSE '⚠️ '
      END as status
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN (
      'analytics_metrics', 'analytics_reports', 'agent_memory',
      'email_templates', 'crm_credentials'
    )
    ORDER BY tablename, policyname
  LOOP
    RAISE NOTICE '% [%] % - %', policy_rec.status, policy_rec.tablename, policy_rec.policyname, policy_rec.command;
  END LOOP;
END $$;

-- ============================================
-- 6. Summary
-- ============================================

DO $$
DECLARE
  all_checks_passed BOOLEAN := TRUE;
  rls_enabled_count INT;
  total_tables INT := 14;
  policy_count INT;
  broken_count INT;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'VERIFICATION SUMMARY';
  RAISE NOTICE '============================================';

  -- Check RLS enabled
  SELECT COUNT(*) INTO rls_enabled_count
  FROM pg_tables
  WHERE schemaname = 'public'
  AND rowsecurity = true
  AND tablename IN (
    'analytics_metrics', 'analytics_reports', 'agent_memory',
    'email_templates', 'subscriptions', 'usage_records',
    'sequences', 'sequence_steps', 'sequence_executions',
    'crm_credentials', 'password_resets', 'oauth_states',
    'organization_invites', 'usage_daily'
  );

  IF rls_enabled_count < total_tables THEN
    all_checks_passed := FALSE;
    RAISE NOTICE '❌ RLS Status: FAILED (% / % tables)', rls_enabled_count, total_tables;
  ELSE
    RAISE NOTICE '✅ RLS Status: PASSED (% / % tables)', rls_enabled_count, total_tables;
  END IF;

  -- Check policy count
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

  IF policy_count < 20 THEN
    all_checks_passed := FALSE;
    RAISE NOTICE '❌ Policy Count: WARNING (% policies, expected >= 20)', policy_count;
  ELSE
    RAISE NOTICE '✅ Policy Count: PASSED (% policies)', policy_count;
  END IF;

  -- Check broken policies
  SELECT COUNT(*) INTO broken_count
  FROM pg_policies
  WHERE schemaname = 'public'
  AND pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) LIKE '%FROM members%'
  AND pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) NOT LIKE '%organization_members%';

  IF broken_count > 0 THEN
    all_checks_passed := FALSE;
    RAISE NOTICE '❌ Broken Policies: FAILED (% broken policies)', broken_count;
  ELSE
    RAISE NOTICE '✅ Broken Policies: PASSED (0 broken policies)';
  END IF;

  RAISE NOTICE '============================================';

  IF all_checks_passed THEN
    RAISE NOTICE '🎉 OVERALL STATUS: ✅ ALL CHECKS PASSED';
    RAISE NOTICE '';
    RAISE NOTICE 'The RLS fix migration was applied successfully!';
    RAISE NOTICE 'You can proceed to application testing.';
  ELSE
    RAISE WARNING '⚠️  OVERALL STATUS: ❌ SOME CHECKS FAILED';
    RAISE WARNING '';
    RAISE WARNING 'Review the failures above and fix before proceeding.';
    RAISE WARNING 'DO NOT deploy to production until all checks pass!';
  END IF;

  RAISE NOTICE '============================================';
END $$;
