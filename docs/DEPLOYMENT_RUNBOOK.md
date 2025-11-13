# 🚀 Deployment Runbook - GPT Agent Platform

## Оглавление
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Production Deployment Process](#production-deployment-process)
- [Rollback Procedures](#rollback-procedures)
- [Post-Deployment Verification](#post-deployment-verification)
- [Emergency Procedures](#emergency-procedures)
- [Monitoring & Alerts](#monitoring--alerts)
- [Common Issues & Solutions](#common-issues--solutions)

---

## Pre-Deployment Checklist

### 1. Code Readiness
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review completed and approved
- [ ] No `DEMO_MODE` or test flags in production code
- [ ] Security audit completed (no hardcoded secrets)
- [ ] Performance testing completed

### 2. Environment Configuration
```bash
# Verify all required environment variables are set
npm run verify:env

# Check Vercel secrets
vercel env ls

# Verify database connection
npm run db:check
```

### 3. Database
- [ ] Migrations reviewed and tested in staging
- [ ] Backup completed before migration
- [ ] Migration rollback plan prepared
- [ ] No breaking schema changes without migration path

### 4. Dependencies
- [ ] `npm audit` shows 0 vulnerabilities
- [ ] No deprecated packages
- [ ] All dependencies up to date

### 5. Monitoring
- [ ] Sentry DSN configured
- [ ] Grafana dashboards accessible
- [ ] Alert rules reviewed
- [ ] On-call schedule confirmed

---

## Production Deployment Process

### Automatic Deployment (via GitHub Actions)

**Trigger:** Push to `main` branch

```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

**GitHub Actions will automatically:**
1. Run quality checks (TypeScript, ESLint, format)
2. Run all tests (unit, component, E2E)
3. Build application
4. Run database migrations (blocking)
5. Deploy to Vercel production
6. Wait 30s for deployment to stabilize
7. Run health checks (5 retries)
8. Auto-rollback if health checks fail

### Manual Deployment (Emergency)

```bash
# 1. Install Vercel CLI
npm install -g vercel@latest

# 2. Login to Vercel
vercel login

# 3. Pull environment
vercel pull --environment=production --yes

# 4. Build
vercel build --prod

# 5. Deploy
vercel deploy --prebuilt --prod

# 6. Health check
curl -f https://your-app.vercel.app/api/health
```

### Worker Service Deployment

```bash
# Deploy to Railway/Render
cd services/worker

# Build Docker image
docker build -t gpt-agent-worker:latest .

# Push to registry
docker tag gpt-agent-worker:latest registry.your-provider.com/gpt-agent-worker:latest
docker push registry.your-provider.com/gpt-agent-worker:latest

# Deploy via platform CLI or UI
railway up
# OR
render deploy
```

---

## Rollback Procedures

### Automatic Rollback

GitHub Actions will automatically rollback if:
- Health check fails after 5 retries
- Deployment step fails

### Manual Rollback

#### Option 1: Vercel UI
1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

#### Option 2: Vercel CLI
```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url> --yes

# Verify
curl -f https://your-app.vercel.app/api/health
```

#### Option 3: Git Revert
```bash
# Revert last commit
git revert HEAD
git push origin main

# Or revert specific commit
git revert <commit-hash>
git push origin main
```

### Database Rollback

```bash
# If migration failed, rollback database
npm run db:rollback

# Verify database state
npm run db:status
```

**IMPORTANT:** Always test database rollback in staging first!

---

## Post-Deployment Verification

### Automated Checks (performed by CI/CD)
- ✅ Health endpoint returns 200 OK
- ✅ Application responds within 10s

### Manual Verification Checklist

#### 1. Core Functionality
```bash
# Health check
curl -f https://your-app.vercel.app/api/health

# Authentication
curl -f https://your-app.vercel.app/api/auth/signin

# API endpoints
curl -f https://your-app.vercel.app/api/v1/agents
```

#### 2. Database
- [ ] Migrations completed successfully
- [ ] No orphaned transactions
- [ ] Connection pool healthy

#### 3. Worker Service
```bash
# Check worker health
curl -f https://worker.your-app.com/health

# Check Redis connection
redis-cli -h <redis-host> ping

# Check job queue
npm run queue:status
```

#### 4. Monitoring
- [ ] Sentry receiving events
- [ ] Grafana dashboards updating
- [ ] No critical alerts firing
- [ ] Prometheus targets UP

#### 5. User-Facing Features
- [ ] Login works
- [ ] Agent creation works
- [ ] Chat functionality works
- [ ] CRM sync working (if applicable)

#### 6. Performance
- [ ] Response times < 500ms (p95)
- [ ] Error rate < 1%
- [ ] CPU usage < 70%
- [ ] Memory usage stable

---

## Emergency Procedures

### Production is Down

1. **Check Status**
   ```bash
   # Health check
   curl -I https://your-app.vercel.app/api/health

   # Vercel status
   vercel --version  # Ensures CLI is working
   vercel ls | head -5
   ```

2. **Quick Rollback**
   ```bash
   vercel rollback <previous-deployment-id> --yes
   ```

3. **Notify Team**
   - Update status page
   - Notify on-call engineer
   - Post in Slack/Teams

4. **Investigate Root Cause**
   - Check Sentry errors
   - Check Vercel logs: `vercel logs --follow`
   - Check Grafana dashboards
   - Check database status

### Database Issues

#### Connection Errors
```bash
# Check Supabase status
curl -f https://your-project.supabase.co/rest/v1/

# Check connection pooling
npm run db:pool:status
```

#### Migration Failed
```bash
# Check migration status
npm run db:status

# Rollback last migration
npm run db:rollback

# Re-run migration
npm run db:migrate
```

### Worker Service Down

```bash
# Check worker logs
railway logs --tail 100
# OR
render logs --tail 100

# Restart worker
railway restart
# OR
render restart

# Check job queue
npm run queue:clear  # Clear stuck jobs
npm run queue:retry  # Retry failed jobs
```

### High Error Rate

1. **Identify Source**
   - Check Sentry for error patterns
   - Check Grafana error rate dashboard
   - Check application logs

2. **Quick Fixes**
   ```bash
   # Increase rate limits
   vercel env add RATE_LIMIT_MAX <new-value>

   # Enable graceful degradation
   vercel env add ENABLE_FALLBACKS true

   # Redeploy
   vercel --prod
   ```

3. **If Not Resolved → Rollback**

---

## Monitoring & Alerts

### Critical Alerts

| Alert | Threshold | Action |
|-------|-----------|--------|
| Health Check Failed | 3 consecutive failures | Immediate rollback |
| Error Rate High | > 5% | Investigate & consider rollback |
| Response Time High | p95 > 2s | Check performance, scale if needed |
| Database Down | Connection failure | Check Supabase, contact support |
| Worker Queue Backed Up | > 1000 jobs | Scale worker, check for errors |

### Dashboards

- **Production Overview:** http://grafana.your-app.com/d/production
- **Worker Metrics:** http://grafana.your-app.com/d/worker
- **Database Performance:** http://grafana.your-app.com/d/database
- **Error Tracking:** https://sentry.io/your-org/your-project

### Logs

```bash
# Vercel logs
vercel logs --follow

# Worker logs
railway logs --tail 100

# Grafana Loki (if configured)
logcli query '{app="gpt-agent"}'
```

---

## Common Issues & Solutions

### Issue: "Health check failed"

**Symptoms:** Health endpoint returns 500 or times out

**Solutions:**
1. Check if database is accessible
   ```bash
   npm run db:ping
   ```

2. Check environment variables
   ```bash
   vercel env ls
   ```

3. Check logs for errors
   ```bash
   vercel logs --follow | grep ERROR
   ```

4. Rollback if not resolved in 5 minutes

### Issue: "Migrations failed"

**Symptoms:** Database migration step fails in CI/CD

**Solutions:**
1. Check migration syntax
   ```bash
   npm run db:validate
   ```

2. Test in staging first
   ```bash
   npm run db:migrate:staging
   ```

3. Rollback if needed
   ```bash
   npm run db:rollback
   ```

### Issue: "Worker not processing jobs"

**Symptoms:** Job queue grows, no jobs completed

**Solutions:**
1. Check worker health
   ```bash
   curl -f https://worker.your-app.com/health
   ```

2. Check Redis connection
   ```bash
   redis-cli -h <host> ping
   ```

3. Restart worker
   ```bash
   railway restart
   ```

4. Clear stuck jobs
   ```bash
   npm run queue:clear:stuck
   ```

### Issue: "Rate limit exceeded"

**Symptoms:** Users getting 429 errors

**Solutions:**
1. Check current rate limits
   ```bash
   redis-cli GET rate_limit:global
   ```

2. Temporarily increase limits
   ```bash
   vercel env add RATE_LIMIT_MAX 200
   vercel --prod
   ```

3. Monitor for abuse

### Issue: "Memory leak suspected"

**Symptoms:** Memory usage grows over time

**Solutions:**
1. Check Grafana memory dashboard
2. Take heap snapshot
   ```bash
   vercel logs | grep "Heap"
   ```

3. Restart affected service
4. Investigate code for leaks

---

## Deployment Schedule

### Recommended Deployment Windows

- **Production:** Tuesday-Thursday, 10:00-14:00 (local time)
- **Avoid:** Fridays, weekends, holidays
- **Emergency Only:** Outside business hours

### Freeze Periods

- Holiday season (Dec 20 - Jan 5)
- Black Friday weekend
- Major feature launches

---

## Contacts

### On-Call Rotation
- Primary: [Name] - [Phone] - [Email]
- Secondary: [Name] - [Phone] - [Email]

### Escalation
1. On-call engineer (response: 15 min)
2. Team lead (response: 30 min)
3. CTO (response: 1 hour)

### External Services
- Vercel Support: support@vercel.com
- Supabase Support: https://supabase.com/dashboard/support
- Upstash Support: support@upstash.com

---

## Appendix

### Useful Commands

```bash
# Check deployment status
vercel ls --prod

# View environment variables
vercel env ls --environment production

# Run database migration
npm run db:migrate

# Check job queue status
npm run queue:status

# Clear failed jobs
npm run queue:clear:failed

# Health check
curl -f https://your-app.vercel.app/api/health

# Get metrics
curl https://your-app.vercel.app/api/metrics
```

### Links
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Grafana](http://grafana.your-app.com)
- [Sentry](https://sentry.io)
- [GitHub Actions](https://github.com/your-org/your-repo/actions)

---

**Last Updated:** 2025-11-13
**Version:** 1.0
**Owner:** DevOps Team
