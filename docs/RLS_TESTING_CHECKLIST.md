# RLS Fix - Testing Checklist

**Date**: 2025-11-17
**Migration**: `fix_rls_critical_bugs.sql`
**Environment**: [ ] Staging  [ ] Production

---

## Pre-Deployment

- [ ] **Backup Created**
  - [ ] Database backup completed
  - [ ] Backup verified and accessible
  - [ ] Backup location documented: ___________________

- [ ] **Team Notified**
  - [ ] Deployment window communicated
  - [ ] Team members on standby
  - [ ] Rollback plan shared

- [ ] **Migration Reviewed**
  - [ ] Read `fix_rls_critical_bugs.sql`
  - [ ] Read `RLS_VERIFICATION_RESULTS.md`
  - [ ] Understood changes and impact

---

## Migration Deployment

**Start Time**: ___________
**Deployed By**: ___________

- [ ] **Migration Applied**
  - Method used: [ ] Dashboard  [ ] psql  [ ] Supabase CLI
  - [ ] Migration completed without errors
  - [ ] Success messages displayed
  - [ ] No ERROR messages in output

- [ ] **Initial Verification**
  - [ ] Ran `verify_rls_fix.sql`
  - [ ] All checks passed
  - [ ] No broken policies found

**End Time**: ___________
**Duration**: ___________ minutes

---

## SQL Verification Tests

### Test 1: RLS Status Check

**Query:**
```sql
SELECT tablename, rowsecurity
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

- [ ] **All tables show `rowsecurity = true`**
- [ ] **0 tables show `rowsecurity = false`**

**Result**: ✅ Pass / ❌ Fail

**Notes**: ___________________________________________

---

### Test 2: Policy Count Check

**Query:**
```sql
SELECT tablename, COUNT(*) as policy_count
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

- [ ] **Each table has at least 1 policy**
- [ ] **Total policies >= 20**

**Result**: ✅ Pass / ❌ Fail

**Policy Count**: _________

**Notes**: ___________________________________________

---

### Test 3: Broken Policies Check

**Query:**
```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
AND pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) LIKE '%FROM members%'
AND pg_get_expr(qual, (schemaname || '.' || tablename)::regclass) NOT LIKE '%organization_members%';
```

- [ ] **0 policies found (empty result)**
- [ ] **No policies reference 'members' table**

**Result**: ✅ Pass / ❌ Fail

**Broken Policies Found**: _________

**Notes**: ___________________________________________

---

### Test 4: Organization Members Table Check

**Query:**
```sql
SELECT COUNT(*) as member_count FROM organization_members;
```

- [ ] **Table exists**
- [ ] **Has data (count > 0)**

**Result**: ✅ Pass / ❌ Fail

**Member Count**: _________

**Notes**: ___________________________________________

---

## Cross-Organization Access Tests

### Test Setup

- [ ] **Created 2 test organizations**
  - Org 1 ID: ___________________________________________
  - Org 2 ID: ___________________________________________

- [ ] **Created 2 test users**
  - User 1 ID: ___________________________________________
  - User 2 ID: ___________________________________________

- [ ] **Added users to organizations**
  - User 1 → Org 1
  - User 2 → Org 2

- [ ] **Created test data in sensitive tables**
  - [ ] `agent_memory`
  - [ ] `analytics_metrics`
  - [ ] `sequences`

### Test Execution

#### Test 5: User 1 Can ONLY See Org 1 Data

**Query:**
```sql
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub": "[user-1-id]"}';
SELECT org_id, COUNT(*) FROM agent_memory GROUP BY org_id;
```

- [ ] **Returns ONLY Org 1 data**
- [ ] **Does NOT return Org 2 data**

**Result**: ✅ Pass / ❌ Fail

**Org IDs Returned**: ___________________________________________

**Notes**: ___________________________________________

---

#### Test 6: User 2 Can ONLY See Org 2 Data

**Query:**
```sql
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub": "[user-2-id]"}';
SELECT org_id, COUNT(*) FROM agent_memory GROUP BY org_id;
```

- [ ] **Returns ONLY Org 2 data**
- [ ] **Does NOT return Org 1 data**

**Result**: ✅ Pass / ❌ Fail

**Org IDs Returned**: ___________________________________________

**Notes**: ___________________________________________

---

#### Test 7: User 1 Cannot INSERT for Org 2

**Query:**
```sql
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub": "[user-1-id]"}';
INSERT INTO agent_memory (org_id, client_identifier, memory_type, content)
VALUES ('[org-2-id]', 'test@test.com', 'fact', 'Should fail');
```

- [ ] **Insert FAILS with permission denied error**
- [ ] **Data NOT inserted into Org 2**

**Result**: ✅ Pass / ❌ Fail

**Error Message**: ___________________________________________

**Notes**: ___________________________________________

---

### Test Cleanup

- [ ] **Deleted test data**
- [ ] **Deleted test users**
- [ ] **Deleted test organizations**
- [ ] **Verified cleanup successful**

---

## Application Smoke Tests

**Test Environment URL**: ___________________________________________

### Test 8: User Authentication

- [ ] **Can login successfully**
- [ ] **Dashboard loads without errors**
- [ ] **No permission denied errors**

**Result**: ✅ Pass / ❌ Fail

**Notes**: ___________________________________________

---

### Test 9: Analytics Features

- [ ] **Can view analytics dashboard**
- [ ] **Can create new metric**
- [ ] **Can edit existing metric**
- [ ] **Metrics save successfully**

**Result**: ✅ Pass / ❌ Fail

**Notes**: ___________________________________________

---

### Test 10: Email Templates

- [ ] **Can view email templates list**
- [ ] **Can create new template**
- [ ] **Can edit existing template**
- [ ] **Templates save successfully**

**Result**: ✅ Pass / ❌ Fail

**Notes**: ___________________________________________

---

### Test 11: Billing/Subscriptions

- [ ] **Can view subscription page**
- [ ] **Usage stats display correctly**
- [ ] **No errors loading subscription data**

**Result**: ✅ Pass / ❌ Fail

**Notes**: ___________________________________________

---

### Test 12: Sequences

- [ ] **Can view sequences list**
- [ ] **Can create new sequence**
- [ ] **Can add sequence steps**
- [ ] **Sequence saves successfully**

**Result**: ✅ Pass / ❌ Fail

**Notes**: ___________________________________________

---

### Test 13: Agent Memory

- [ ] **Can view agent memory entries**
- [ ] **Can create new memory entry**
- [ ] **Memory saves successfully**
- [ ] **Can only see own org's memory**

**Result**: ✅ Pass / ❌ Fail

**Notes**: ___________________________________________

---

### Test 14: CRM Credentials (Admin Only)

- [ ] **Admin can view CRM settings**
- [ ] **Credentials page loads**
- [ ] **Non-admin users blocked (if applicable)**

**Result**: ✅ Pass / ❌ Fail

**Notes**: ___________________________________________

---

## Performance Tests

### Test 15: Query Performance

- [ ] **Dashboard loads in < 3 seconds**
- [ ] **Analytics queries complete in < 2 seconds**
- [ ] **No slow query warnings in logs**

**Result**: ✅ Pass / ❌ Fail

**Average Load Time**: _________ seconds

**Notes**: ___________________________________________

---

### Test 16: Database Connection Pool

- [ ] **Connection pool usage normal**
- [ ] **No connection pool exhaustion**
- [ ] **Max connections not exceeded**

**Result**: ✅ Pass / ❌ Fail

**Active Connections**: _________

**Notes**: ___________________________________________

---

## Error Monitoring

### Test 17: Application Logs (15 minutes)

**Monitor for**:
- [ ] **No RLS-related errors**
- [ ] **No "relation 'members' does not exist" errors**
- [ ] **No permission denied errors**
- [ ] **No unexpected query failures**

**Result**: ✅ Pass / ❌ Fail

**Errors Found**: _________

**Notes**: ___________________________________________

---

### Test 18: Database Logs (15 minutes)

**Monitor for**:
- [ ] **No policy violation errors**
- [ ] **No syntax errors in policies**
- [ ] **No slow queries**

**Result**: ✅ Pass / ❌ Fail

**Warnings Found**: _________

**Notes**: ___________________________________________

---

## Final Verification

### Summary

**Total Tests**: 18
**Tests Passed**: _____ / 18
**Tests Failed**: _____ / 18
**Pass Rate**: _____ %

### Overall Status

- [ ] **All SQL verification tests passed (Tests 1-4)**
- [ ] **All cross-org access tests passed (Tests 5-7)**
- [ ] **All application smoke tests passed (Tests 8-14)**
- [ ] **All performance tests passed (Tests 15-16)**
- [ ] **All error monitoring checks passed (Tests 17-18)**

---

## Decision

### Staging Deployment

- [ ] ✅ **APPROVED**: All tests passed, proceed to production
- [ ] ❌ **REJECTED**: Tests failed, rollback and fix

**Decision Made By**: ___________________________________________
**Date/Time**: ___________________________________________

**Reason (if rejected)**: ___________________________________________

---

### Production Deployment

- [ ] ✅ **APPROVED**: Staging tests passed, deployed to production
- [ ] ❌ **REJECTED**: Issues found, rollback

**Decision Made By**: ___________________________________________
**Date/Time**: ___________________________________________

**Reason (if rejected)**: ___________________________________________

---

## Post-Deployment Actions

- [ ] **Updated PRODUCTION_READINESS_SUMMARY.md**
- [ ] **Updated production readiness score to 95/100**
- [ ] **Sent success notification to team**
- [ ] **Scheduled 24-hour monitoring**
- [ ] **Created post-mortem document (if issues occurred)**

---

## Sign-Off

**Tested By**: ___________________________________________

**Reviewed By**: ___________________________________________

**Approved By**: ___________________________________________

**Date**: ___________________________________________

---

## Rollback (If Needed)

**Rollback Executed**: [ ] Yes  [ ] No

**Rollback Method**: ___________________________________________

**Rollback Time**: ___________________________________________

**Rollback Successful**: [ ] Yes  [ ] No

**Root Cause**: ___________________________________________

**Next Steps**: ___________________________________________

---

## Notes and Observations

___________________________________________
___________________________________________
___________________________________________
___________________________________________
___________________________________________

---

**Checklist Completed**: [ ] Yes  [ ] No
**Date**: ___________________________________________
