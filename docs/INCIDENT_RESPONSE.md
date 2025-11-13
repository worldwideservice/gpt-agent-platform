# 🚨 Incident Response Guide - GPT Agent Platform

## Emergency Contacts

**CALL IMMEDIATELY IF:**
- Production is completely down
- Data breach suspected
- Security vulnerability exploited

### On-Call Rotation
```
Primary:   [Name] - [Phone] - [Slack: @handle]
Secondary: [Name] - [Phone] - [Slack: @handle]
Manager:   [Name] - [Phone] - [Slack: @handle]
```

### External Vendors
- **Vercel Status:** https://vercel-status.com
- **Vercel Support:** support@vercel.com
- **Supabase Support:** https://supabase.com/support/tickets
- **Upstash Support:** support@upstash.com

---

## Incident Severity Levels

### SEV 1 - Critical (Response: 15 minutes)
- **Production completely down**
- **Data breach or security incident**
- **Complete loss of core functionality**
- **Financial impact > $10k/hour**

**Actions:**
1. Page on-call immediately
2. Create incident channel
3. Start incident bridge
4. Update status page
5. Notify leadership

### SEV 2 - Major (Response: 30 minutes)
- **Partial outage affecting > 25% users**
- **Core feature degraded**
- **Severe performance degradation**
- **Data inconsistency**

**Actions:**
1. Alert on-call engineer
2. Create incident channel
3. Update status page
4. Begin investigation

### SEV 3 - Minor (Response: 1 hour)
- **Non-critical feature impaired**
- **Affecting < 10% users**
- **Performance degradation**
- **Elevated error rates**

**Actions:**
1. Create Slack thread
2. Investigate & fix
3. Update stakeholders

### SEV 4 - Low (Response: 4 hours)
- **Cosmetic issues**
- **Monitoring alerts**
- **Minor bugs**

**Actions:**
1. Create ticket
2. Schedule fix

---

## Incident Response Process

### Phase 1: Detection & Triage (0-5 min)

1. **Confirm the Incident**
   ```bash
   # Quick health check
   curl -f https://your-app.vercel.app/api/health

   # Check Vercel status
   vercel ls --prod | head -1

   # Check error rate
   curl https://your-app.vercel.app/api/metrics | grep error_rate
   ```

2. **Determine Severity**
   - What is affected?
   - How many users impacted?
   - Is data at risk?
   - What is financial impact?

3. **Create Incident Channel**
   ```
   #incident-YYYY-MM-DD-description
   ```

4. **Assign Roles**
   - **Incident Commander:** Coordinates response
   - **Tech Lead:** Makes technical decisions
   - **Communications Lead:** Updates stakeholders
   - **Scribe:** Documents timeline

### Phase 2: Mitigation (5-30 min)

**Goal: Stop the bleeding, restore service**

1. **Quick Wins**
   ```bash
   # Option 1: Rollback (fastest)
   vercel rollback <previous-deployment> --yes

   # Option 2: Emergency patch
   git revert <bad-commit>
   git push origin main

   # Option 3: Feature flag off
   vercel env add FEATURE_X_ENABLED false
   vercel --prod
   ```

2. **Verify Mitigation**
   ```bash
   # Health check
   curl -f https://your-app.vercel.app/api/health

   # Error rate check
   watch -n 5 'curl -s https://your-app.vercel.app/api/metrics | grep error_rate'
   ```

3. **Update Status Page**
   ```
   Status: Investigating
   → Identified
   → Monitoring
   → Resolved
   ```

### Phase 3: Root Cause Analysis (30 min - 2 hours)

1. **Gather Evidence**
   - Sentry error logs
   - Vercel deployment logs
   - Grafana dashboards
   - Database query logs
   - User reports

2. **Timeline Reconstruction**
   ```
   12:00 - Deploy initiated
   12:05 - Error rate spiked to 15%
   12:07 - Health checks failing
   12:10 - Rollback initiated
   12:12 - Service restored
   ```

3. **Identify Root Cause**
   - What triggered the incident?
   - Why did safeguards fail?
   - What was the blast radius?

### Phase 4: Resolution & Recovery

1. **Permanent Fix**
   - Create hotfix branch
   - Write tests for the bug
   - Deploy fix to staging
   - Verify fix works
   - Deploy to production

2. **Verify Full Recovery**
   - [ ] All services healthy
   - [ ] Error rate normal
   - [ ] Performance metrics normal
   - [ ] No user complaints
   - [ ] Monitoring shows green

3. **Close Incident**
   ```
   Post in incident channel:

   ✅ INCIDENT RESOLVED
   - Root cause: [description]
   - Fix: [description]
   - Duration: X hours
   - Impact: X users
   - Post-mortem: [link]
   ```

### Phase 5: Post-Mortem (within 48 hours)

Create post-mortem document:

```markdown
# Post-Mortem: [Incident Title]

## Summary
- **Date:** YYYY-MM-DD
- **Duration:** X hours
- **Severity:** SEV X
- **Impact:** X users affected

## Timeline
[Detailed timeline]

## Root Cause
[Technical explanation]

## What Went Well
- Quick detection
- Fast rollback
- Good communication

## What Went Wrong
- Late alerting
- No automated rollback
- Insufficient testing

## Action Items
- [ ] Add monitoring for X
- [ ] Improve tests for Y
- [ ] Update runbook for Z
```

---

## Common Incident Scenarios

### Scenario 1: Complete Outage

**Symptoms:**
- Health endpoint returns 500
- All pages timing out
- Error rate 100%

**Quick Actions:**
```bash
# 1. Immediate rollback
vercel rollback <previous-deployment> --yes

# 2. Check database
npm run db:ping

# 3. Check Vercel status
curl https://vercel-status.com/api/v2/status.json
```

**If rollback doesn't work:**
- Check Vercel platform status
- Check Supabase status
- Contact Vercel support
- Enable maintenance mode

### Scenario 2: Database Issues

**Symptoms:**
- Connection errors
- Query timeouts
- Data inconsistency

**Quick Actions:**
```bash
# 1. Check database health
curl -f https://your-project.supabase.co/rest/v1/

# 2. Check connection pool
npm run db:pool:status

# 3. Check for long-running queries
npm run db:queries:slow

# 4. If needed, restart pooler
npm run db:pool:restart
```

**Escalation:**
- Contact Supabase support
- Enable read-only mode if needed
- Restore from backup if corrupted

### Scenario 3: Worker Queue Backed Up

**Symptoms:**
- Queue length > 10,000
- Jobs not processing
- Users reporting delays

**Quick Actions:**
```bash
# 1. Check worker status
curl -f https://worker.your-app.com/health

# 2. Check queue stats
npm run queue:status

# 3. Scale workers
railway scale --replicas 5

# 4. Clear stuck jobs
npm run queue:clear:stuck
```

### Scenario 4: High Error Rate

**Symptoms:**
- Error rate 5-20%
- Some requests failing
- Intermittent issues

**Quick Actions:**
```bash
# 1. Check Sentry for patterns
open https://sentry.io/your-org/your-project

# 2. Check logs for errors
vercel logs --follow | grep ERROR

# 3. Identify failing endpoint
curl https://your-app.vercel.app/api/metrics | grep errors_by_path

# 4. Feature flag off if specific feature
vercel env add FEATURE_X_ENABLED false
vercel --prod
```

### Scenario 5: Security Incident

**Symptoms:**
- Suspicious API calls
- Unauthorized access
- Data breach alert

**CRITICAL ACTIONS:**
```bash
# 1. IMMEDIATELY: Rotate all secrets
vercel env rm NEXTAUTH_SECRET
vercel env add NEXTAUTH_SECRET <new-secret>

# 2. Invalidate all sessions
npm run auth:sessions:invalidate

# 3. Enable IP whitelist
vercel env add IP_WHITELIST_ENABLED true

# 4. Block suspicious IPs
npm run security:block-ip <IP>
```

**Escalation:**
- Contact security team IMMEDIATELY
- Preserve logs for forensics
- Notify affected users
- File incident report

### Scenario 6: Performance Degradation

**Symptoms:**
- Response times > 2s
- CPU usage > 90%
- Memory usage climbing

**Quick Actions:**
```bash
# 1. Check current metrics
curl https://your-app.vercel.app/api/metrics

# 2. Identify slow endpoints
npm run perf:analyze

# 3. Increase cache TTL
vercel env add CACHE_TTL 3600
vercel --prod

# 4. Enable rate limiting
vercel env add RATE_LIMIT_ENABLED true
vercel --prod
```

---

## Communication Templates

### Initial Alert (SEV 1/2)

```
🚨 INCIDENT ALERT - SEV X

Status: Investigating
Affected: [users/features]
Started: HH:MM UTC

We are investigating [description].
Updates every 15 minutes.

Incident Channel: #incident-YYYY-MM-DD-name
Commander: @handle
```

### Update (Every 15-30 min)

```
🔄 INCIDENT UPDATE - HH:MM UTC

Status: [Investigating/Identified/Monitoring]
Progress: [what we've learned/done]
Next steps: [what we're doing next]
ETA: [if known]
```

### Resolution

```
✅ INCIDENT RESOLVED - HH:MM UTC

Issue: [description]
Root cause: [brief explanation]
Fix: [what we did]
Duration: X hours
Impact: X users

Post-mortem: [link]

Thank you for your patience.
```

### Customer Communication

**Subject:** Service Disruption - [Date]

```
We experienced a service disruption today affecting [feature/users].

What happened:
[Brief, non-technical explanation]

Impact:
- Started: HH:MM UTC
- Resolved: HH:MM UTC
- Affected: [X users/X% of requests]

Resolution:
[What we did to fix it]

Prevention:
We are implementing the following to prevent recurrence:
- [Action item 1]
- [Action item 2]

We apologize for the inconvenience.
```

---

## Runbook Quick Reference

### Health Checks
```bash
# Application
curl -f https://your-app.vercel.app/api/health

# Worker
curl -f https://worker.your-app.com/health

# Database
npm run db:ping

# Redis
redis-cli -h <host> ping
```

### Rollback
```bash
# Vercel
vercel rollback <deployment-id> --yes

# Git
git revert HEAD && git push

# Database
npm run db:rollback
```

### Logs
```bash
# Vercel
vercel logs --follow

# Worker
railway logs --tail 100

# Errors only
vercel logs | grep ERROR
```

### Metrics
```bash
# Application metrics
curl https://your-app.vercel.app/api/metrics

# Prometheus
curl http://prometheus:9090/metrics

# Queue status
npm run queue:status
```

### Emergency Commands
```bash
# Enable maintenance mode
vercel env add MAINTENANCE_MODE true && vercel --prod

# Disable feature
vercel env add FEATURE_X_ENABLED false && vercel --prod

# Clear cache
npm run cache:clear

# Restart worker
railway restart

# Scale workers
railway scale --replicas 10
```

---

## Training & Drills

### Monthly Drill Schedule
- **Week 1:** Rollback drill
- **Week 2:** Database failover
- **Week 3:** Security incident
- **Week 4:** Load testing

### New Engineer Onboarding
- [ ] Read this document
- [ ] Shadow incident response
- [ ] Participate in drill
- [ ] Lead drill (after 3 months)

---

## Appendix

### Severity Matrix

| Impact | Users Affected | Downtime | Severity |
|--------|----------------|----------|----------|
| Complete outage | All | Any | SEV 1 |
| Core feature down | > 50% | > 1 hour | SEV 1 |
| Core feature degraded | > 25% | > 2 hours | SEV 2 |
| Minor feature down | < 25% | Any | SEV 2 |
| Performance issue | Any | > 4 hours | SEV 2 |
| Non-critical feature | < 10% | Any | SEV 3 |

### Escalation Paths

```
SEV 1: On-call → Team Lead → CTO (immediate)
SEV 2: On-call → Team Lead (30 min)
SEV 3: On-call → Team Lead (next day)
SEV 4: Create ticket
```

---

**Last Updated:** 2025-11-13
**Version:** 1.0
**Owner:** DevOps Team
