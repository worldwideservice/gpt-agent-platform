# RLS Fix Migration - Deployment Guide

**Created**: 2025-11-17
**Priority**: 🔴 **CRITICAL - BLOCKS PRODUCTION**
**Estimated Time**: 1.5 hours (30m staging + 30m testing + 15m production + 15m verification)

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Step 1: Apply Migration on Staging](#step-1-apply-migration-on-staging-30-minutes)
3. [Step 2: Test on Staging](#step-2-test-on-staging-30-minutes)
4. [Step 3: Apply Migration on Production](#step-3-apply-migration-on-production-15-minutes)
5. [Step 4: Verify Production](#step-4-verify-production-15-minutes)
6. [Rollback Plan](#rollback-plan)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before starting, ensure you have:

- [ ] **Access to Supabase Dashboard**
  - Staging project: https://supabase.com/dashboard/project/[staging-project-id]
  - Production project: https://supabase.com/dashboard/project/[production-project-id]

- [ ] **Database Credentials**
  - Staging: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
  - Production: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

- [ ] **Backup Created** (optional but recommended)
  ```bash
  # For production, create a backup first
  bash scripts/backup-supabase.sh
  ```

- [ ] **Read Migration Files**
  - Review: `supabase/migrations/fix_rls_critical_bugs.sql`
  - Review: `docs/RLS_VERIFICATION_RESULTS.md`

- [ ] **Team Notification**
  - [ ] Notify team about planned maintenance
  - [ ] Schedule deployment window (recommend off-peak hours)
  - [ ] Prepare rollback plan

---

## Step 1: Apply Migration on Staging (30 minutes)

### Option A: Using Supabase Dashboard (Recommended)

1. **Navigate to Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/[staging-project-id]/sql/new
   ```

2. **Open Migration File**
   - Open `supabase/migrations/fix_rls_critical_bugs.sql` in your editor
   - Copy the entire contents (550+ lines)

3. **Paste into SQL Editor**
   - Paste the SQL into Supabase SQL Editor
   - The migration includes:
     - Fixes for 10+ broken RLS policies
     - New RLS policies for 5 sensitive tables
     - Verification queries at the end

4. **Execute Migration**
   - Click "Run" button
   - Wait for execution (should take 5-10 seconds)
   - Check for errors in the output

5. **Verify Success**
   - Look for success messages in output:
     ```
     NOTICE:  SUCCESS: All critical tables have RLS enabled
     NOTICE:  SUCCESS: RLS policies look good (XX policies)
     NOTICE:  ============================================
     NOTICE:  RLS Critical Bugs Fix Migration Complete
     ```

### Option B: Using psql Command Line

1. **Get Database Connection String**
   ```bash
   # From Supabase Dashboard → Settings → Database
   # Connection string format:
   # postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
   ```

2. **Set Environment Variable**
   ```bash
   export STAGING_DATABASE_URL="postgresql://postgres.[project-ref]:[password]@..."
   ```

3. **Apply Migration**
   ```bash
   psql $STAGING_DATABASE_URL -f supabase/migrations/fix_rls_critical_bugs.sql
   ```

4. **Check Output**
   - Should see NOTICE messages indicating success
   - No ERROR messages should appear

### Option C: Using Supabase CLI

1. **Install Supabase CLI** (if not installed)
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link Project**
   ```bash
   supabase link --project-ref [staging-project-ref]
   ```

4. **Push Migration**
   ```bash
   supabase db push
   ```

---

## Step 2: Test on Staging (30 minutes)

### 2.1 Verify RLS is Enabled

Run this SQL query in Supabase Dashboard → SQL Editor:

```sql
-- Check RLS is enabled on all critical tables
SELECT
  tablename,
  rowsecurity as rls_enabled
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
```

**Expected Result**: All tables should show `rls_enabled = true`

❌ **If any table shows `false`, the migration failed! Do NOT proceed to production.**

### 2.2 Verify RLS Policies Exist

```sql
-- Check RLS policies exist
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
```

**Expected Result**: Each table should have 1-4 policies

❌ **If any table has 0 policies, investigate before proceeding.**

### 2.3 Test Cross-Organization Access (CRITICAL!)

**Setup Test Data:**

```sql
-- Create 2 test organizations
INSERT INTO organizations (id, name, slug) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Test Org 1', 'test-org-1'),
  ('00000000-0000-0000-0000-000000000002', 'Test Org 2', 'test-org-2');

-- Create 2 test users
-- (Assumes users table accepts direct inserts, adjust if using auth.users)
INSERT INTO users (id, email, full_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'user1@test.com', 'User 1'),
  ('22222222-2222-2222-2222-222222222222', 'user2@test.com', 'User 2');

-- Add users to their respective organizations
INSERT INTO organization_members (org_id, user_id, role, status) VALUES
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'owner', 'active'),
  ('00000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'owner', 'active');

-- Create test data in a sensitive table (e.g., agent_memory)
INSERT INTO agent_memory (org_id, client_identifier, memory_type, content) VALUES
  ('00000000-0000-0000-0000-000000000001', 'client1@test.com', 'fact', 'Sensitive data for Org 1'),
  ('00000000-0000-0000-0000-000000000002', 'client2@test.com', 'fact', 'Sensitive data for Org 2');
```

**Test RLS Isolation:**

```sql
-- Set session to User 1 (from Org 1)
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub": "11111111-1111-1111-1111-111111111111"}';

-- Try to access agent_memory
SELECT org_id, content FROM agent_memory;

-- Expected: Should ONLY see data for Org 1
-- Should return 1 row: "Sensitive data for Org 1"
```

```sql
-- Set session to User 2 (from Org 2)
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub": "22222222-2222-2222-2222-222222222222"}';

-- Try to access agent_memory
SELECT org_id, content FROM agent_memory;

-- Expected: Should ONLY see data for Org 2
-- Should return 1 row: "Sensitive data for Org 2"
```

**Clean Up Test Data:**

```sql
DELETE FROM agent_memory WHERE org_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002'
);
DELETE FROM organization_members WHERE org_id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002'
);
DELETE FROM users WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222'
);
DELETE FROM organizations WHERE id IN (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002'
);
```

### 2.4 Smoke Test Application Features

Test these features in staging environment:

- [ ] **Analytics Dashboard**
  - Create a test metric
  - View metrics dashboard
  - Should work without errors

- [ ] **Email Templates**
  - Create a new email template
  - Edit an existing template
  - Should save successfully

- [ ] **Billing/Subscriptions**
  - View subscription page
  - Check usage stats
  - Should load without errors

- [ ] **Sequences**
  - Create a new sequence
  - Add sequence steps
  - Should work normally

- [ ] **Agent Memory**
  - View agent memory entries
  - Create new memory
  - Should function correctly

- [ ] **CRM Credentials**
  - View CRM settings page
  - Should load (only for admins)

**If ANY of these tests fail, DO NOT proceed to production!**

---

## Step 3: Apply Migration on Production (15 minutes)

⚠️ **ONLY proceed if ALL staging tests passed!**

### Pre-Production Checklist

- [ ] All staging tests passed
- [ ] Team notified about deployment
- [ ] Backup created (if not done already)
- [ ] Deployment window scheduled
- [ ] Rollback plan ready

### Production Deployment

**Use the SAME method you used for staging (Dashboard/psql/CLI)**

1. **Create Database Backup** (Recommended)
   ```bash
   # From Supabase Dashboard → Settings → Database → Backups
   # Or use backup script:
   bash scripts/backup-supabase.sh production
   ```

2. **Apply Migration**
   - **Dashboard**: Navigate to Production project → SQL Editor
   - **psql**: Use production DATABASE_URL
   - **CLI**: Link to production project and push

3. **Execute Migration**
   - Same steps as staging
   - Monitor for errors
   - Check success messages

4. **Immediate Verification**
   ```sql
   -- Quick check that RLS is enabled
   SELECT COUNT(*) as tables_with_rls
   FROM pg_tables
   WHERE schemaname = 'public'
   AND rowsecurity = true
   AND tablename IN (
     'analytics_metrics', 'crm_credentials', 'agent_memory',
     'email_templates', 'subscriptions', 'sequences'
   );
   ```

   **Expected**: Should return `tables_with_rls = 6` (or more)

---

## Step 4: Verify Production (15 minutes)

### 4.1 RLS Verification

Run the same SQL queries from Step 2.1 and 2.2 in production:

1. Verify RLS enabled on all tables ✅
2. Verify RLS policies exist ✅
3. Check policy counts ✅

### 4.2 Application Smoke Test

Test these critical paths in production:

- [ ] **User Login** - Should work normally
- [ ] **Dashboard** - Should load without errors
- [ ] **Analytics** - Can view metrics
- [ ] **Agent Creation** - Can create/edit agents
- [ ] **Settings** - Can access settings pages

### 4.3 Monitor Application Logs

```bash
# If using Vercel
vercel logs --prod

# If using Railway/other
# Check application logs for errors
```

**Look for**:
- ❌ Any RLS-related errors
- ❌ Database query failures
- ❌ Permission denied errors
- ✅ Normal application activity

### 4.4 Monitor Database Performance

In Supabase Dashboard → Reports:

- Check Query Performance
- Check for slow queries
- Monitor connection pool usage

**Expected**: No significant performance degradation

---

## Rollback Plan

⚠️ **If anything goes wrong, use this rollback procedure:**

### Immediate Rollback (< 5 minutes)

If you encounter critical errors, you can disable RLS temporarily:

```sql
-- EMERGENCY ONLY: Temporarily disable RLS on affected tables
-- This restores previous behavior but removes security!

ALTER TABLE analytics_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE agent_memory DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates DISABLE ROW LEVEL SECURITY;
-- ... etc for all affected tables
```

⚠️ **WARNING**: This removes security protections! Only use in emergency.

### Full Rollback (< 30 minutes)

1. **Restore from Backup**
   ```bash
   # From Supabase Dashboard → Settings → Database → Backups
   # Click "Restore" on the backup created before migration
   ```

2. **Or Manually Revert Policies**
   ```sql
   -- Drop new policies
   DROP POLICY IF EXISTS "Users can view their organization metrics" ON analytics_metrics;
   -- ... etc

   -- Recreate old (broken) policies
   -- (Not recommended, but included for completeness)
   ```

### Post-Rollback Actions

- [ ] Notify team about rollback
- [ ] Investigate root cause
- [ ] Fix migration script
- [ ] Re-test on staging
- [ ] Schedule new deployment

---

## Troubleshooting

### Issue: Migration fails with "relation 'members' does not exist"

**Cause**: The old broken policies are still trying to reference the wrong table.

**Solution**: This shouldn't happen with our fix migration. If it does:
1. Drop the old broken policies first
2. Re-run the migration

```sql
-- Drop all policies on affected table
DROP POLICY IF EXISTS "Users can view their organization metrics" ON analytics_metrics;
-- ... repeat for all policies on that table

-- Then re-run migration
```

### Issue: RLS verification shows some tables with rls_enabled = false

**Cause**: The `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` didn't execute.

**Solution**: Manually enable RLS:
```sql
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;
```

### Issue: Cross-org test shows data from other organization

**Cause**: RLS policies not working correctly.

**Solution**:
1. Check the policy SQL carefully
2. Verify `organization_members` table exists and has data
3. Check user is in `organization_members` table
4. Verify JWT claims are set correctly

### Issue: Application returns "permission denied" errors

**Cause**: RLS policies too restrictive, or missing INSERT/UPDATE policies.

**Solution**:
1. Check which operation is failing (SELECT, INSERT, UPDATE, DELETE)
2. Verify policy exists for that operation
3. Check policy conditions are correct
4. Test with service_role key (bypasses RLS) to confirm it's RLS-related

### Issue: Performance degradation after migration

**Cause**: RLS policies can add overhead to queries.

**Solution**:
1. Check if policies are using indexes
2. Add indexes on frequently checked columns:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_table_org_id ON table_name(org_id);
   ```
3. Monitor slow query log
4. Optimize policy conditions

### Issue: Some tables still reference 'members' table

**Cause**: Migration didn't update all policies.

**Solution**: Find and fix remaining broken policies:
```sql
-- Find policies still using 'members'
SELECT
  schemaname,
  tablename,
  policyname,
  pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) AS using_expression
FROM pg_policies
WHERE pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) LIKE '%members%'
  AND pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) NOT LIKE '%organization_members%';
```

---

## Success Criteria

Deployment is successful when:

- ✅ All critical tables have RLS enabled
- ✅ All RLS policies use `organization_members` (not `members`)
- ✅ Cross-organization access tests pass
- ✅ Application smoke tests pass
- ✅ No errors in application logs
- ✅ No performance degradation
- ✅ All features working normally

---

## Post-Deployment

After successful deployment:

1. **Update Documentation**
   - [ ] Mark RLS issues as resolved in PRODUCTION_READINESS_SUMMARY.md
   - [ ] Update production readiness score to 95/100

2. **Notify Team**
   - [ ] Send success notification
   - [ ] Share any lessons learned

3. **Monitor for 24 Hours**
   - [ ] Check error logs daily
   - [ ] Monitor performance metrics
   - [ ] Watch for user-reported issues

4. **Follow-Up Tasks**
   - [ ] Add automated RLS tests to CI/CD
   - [ ] Create RLS policy linting tool
   - [ ] Schedule security audit

---

## Additional Resources

- **Full Analysis**: `docs/RLS_VERIFICATION_RESULTS.md`
- **Migration SQL**: `supabase/migrations/fix_rls_critical_bugs.sql`
- **RLS Guide**: `docs/SUPABASE_RLS_VERIFICATION_GUIDE.md`
- **Critical Fixes Summary**: `docs/CRITICAL_FIXES_SUMMARY.md`

---

## Support

If you encounter issues during deployment:

1. Check [Troubleshooting](#troubleshooting) section
2. Review RLS_VERIFICATION_RESULTS.md for detailed analysis
3. Use rollback plan if needed
4. Document any new issues found

---

**Deployment Status**: 🔄 **PENDING**
**Last Updated**: 2025-11-17
**Next Action**: Apply migration on staging

