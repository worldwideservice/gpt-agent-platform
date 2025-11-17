# Operations Runbook

Production operations guide for GPT Agent Platform.

## Table of Contents

- [Daily Operations](#daily-operations)
- [Incident Response](#incident-response)
- [Maintenance Tasks](#maintenance-tasks)
- [Database Operations](#database-operations)
- [Monitoring & Alerts](#monitoring--alerts)
- [Common Issues](#common-issues)
- [Emergency Contacts](#emergency-contacts)

---

## Daily Operations

### Morning Checklist

```bash
# 1. Check system health
curl https://your-domain.com/api/health
curl https://your-domain.com/api/health/db
curl https://your-domain.com/api/health/redis

# 2. Review error logs (last 24 hours)
pm2 logs gpt-agent --lines 100 --err

# 3. Check disk space
df -h

# 4. Check Redis memory
redis-cli INFO memory

# 5. Check database connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"
```

### System Metrics to Monitor

| Metric | Threshold | Action |
|--------|-----------|--------|
| CPU Usage | > 80% | Scale up or optimize |
| Memory Usage | > 85% | Check for memory leaks |
| Disk Space | > 80% | Clean logs, increase storage |
| Response Time (p95) | > 1000ms | Check slow queries |
| Error Rate | > 1% | Investigate errors |
| Database Connections | > 80 | Check connection pool |

### End of Day Review

- Check deployment status
- Review error trends
- Verify backup completion
- Check security alerts
- Review performance metrics

---

## Incident Response

### Severity Levels

**P0 - Critical (Immediate Response)**
- Complete service outage
- Data breach or security incident
- Database corruption

**P1 - High (< 1 hour)**
- Partial service degradation
- Authentication issues
- Critical feature broken

**P2 - Medium (< 4 hours)**
- Non-critical feature broken
- Performance degradation
- API rate limiting issues

**P3 - Low (< 24 hours)**
- Minor bugs
- UI issues
- Documentation updates

### Incident Response Process

#### 1. Acknowledge

```bash
# Check system status
npm run health:check

# Check recent deployments
vercel list --meta

# Review recent errors
pm2 logs gpt-agent --err --lines 200
```

#### 2. Assess

```bash
# Check application logs
tail -f /var/log/gpt-agent/app.log

# Check database status
psql $DATABASE_URL -c "SELECT now(), version();"

# Check Redis status
redis-cli ping

# Check external dependencies
curl -I https://api.openai.com/v1/models
```

#### 3. Mitigate

**If database is down:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart if needed
sudo systemctl restart postgresql

# Verify connection
psql $DATABASE_URL -c "SELECT 1;"
```

**If Redis is down:**
```bash
# Check Redis status
sudo systemctl status redis

# Restart if needed
sudo systemctl restart redis

# Clear cache if corrupted
redis-cli FLUSHDB
```

**If application is down:**
```bash
# Check PM2 status
pm2 status

# Restart application
pm2 restart gpt-agent

# Or rollback deployment
vercel rollback [deployment-url]
```

#### 4. Communicate

- Update status page
- Notify stakeholders
- Create incident ticket
- Document timeline

#### 5. Resolve & Document

- Fix root cause
- Create post-mortem
- Update runbook
- Implement preventive measures

### Emergency Rollback

**Vercel:**
```bash
# List recent deployments
vercel list

# Rollback to previous version
vercel rollback [previous-deployment-url]

# Verify rollback
curl -I https://your-domain.com
```

**Docker:**
```bash
# Pull previous version
docker pull your-registry/gpt-agent-platform:v1.0.0

# Restart with previous version
docker-compose down
docker-compose up -d

# Verify
docker ps
docker logs gpt-agent
```

**PM2:**
```bash
# Checkout previous version
git fetch --tags
git checkout v1.0.0

# Rebuild
npm ci
npm run build

# Restart
pm2 restart gpt-agent
pm2 logs
```

---

## Maintenance Tasks

### Weekly Tasks

#### Update Dependencies

```bash
# Check for updates
npm outdated

# Update non-breaking changes
npm update

# Test thoroughly
npm run test
npm run test:e2e

# Deploy
npm run build
```

#### Database Maintenance

```bash
# Analyze database performance
psql $DATABASE_URL -c "SELECT * FROM pg_stat_user_tables WHERE schemaname = 'public';"

# Reindex if needed
psql $DATABASE_URL -c "REINDEX DATABASE your_db;"

# Vacuum analyze
psql $DATABASE_URL -c "VACUUM ANALYZE;"

# Check table sizes
psql $DATABASE_URL -c "
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
"
```

#### Log Rotation

```bash
# Check log sizes
du -sh /var/log/gpt-agent/*

# Archive old logs
tar -czf logs-$(date +%Y%m%d).tar.gz /var/log/gpt-agent/*.log
mv logs-*.tar.gz /backups/logs/

# Clear old logs (keep last 30 days)
find /var/log/gpt-agent -name "*.log" -mtime +30 -delete
find /backups/logs -name "logs-*.tar.gz" -mtime +90 -delete
```

### Monthly Tasks

#### Security Updates

```bash
# System updates
sudo apt update && sudo apt upgrade -y

# Node.js security audit
npm audit
npm audit fix

# Check for vulnerabilities
npx snyk test

# Review access logs
tail -1000 /var/log/nginx/access.log | grep -i "POST\|PUT\|DELETE"
```

#### Performance Review

```bash
# Generate performance report
npm run performance:report

# Check slow queries
psql $DATABASE_URL -c "
SELECT
  query,
  calls,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
"

# Review cache hit rates
redis-cli INFO stats | grep hit_rate
```

#### Backup Verification

```bash
# List recent backups
ls -lh /backups/db/

# Test restore on staging
pg_restore -d staging_db /backups/db/latest.sql.gz

# Verify backup integrity
gzip -t /backups/db/*.sql.gz
```

---

## Database Operations

### Backup Database

```bash
# Create backup with timestamp
pg_dump $DATABASE_URL | gzip > /backups/db/backup-$(date +%Y%m%d-%H%M%S).sql.gz

# Verify backup
gzip -t /backups/db/backup-*.sql.gz
```

### Restore Database

```bash
# WARNING: This will overwrite existing data!

# 1. Create new database (if needed)
createdb new_database

# 2. Restore from backup
gunzip -c /backups/db/backup-20250117.sql.gz | psql $DATABASE_URL

# 3. Verify restoration
psql $DATABASE_URL -c "SELECT count(*) FROM agents;"
psql $DATABASE_URL -c "SELECT count(*) FROM documents;"

# 4. Run migrations if needed
npm run db:migrate
```

### Database Migrations

```bash
# Check migration status
npm run db:migrate:status

# Apply pending migrations
npm run db:migrate

# Rollback last migration (if needed)
npm run db:migrate:rollback

# Create new migration
npm run db:migrate:create add_new_feature
```

### Database Performance

```bash
# Find slow queries
psql $DATABASE_URL -c "
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
"

# Check index usage
psql $DATABASE_URL -c "
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
"

# Find missing indexes
psql $DATABASE_URL -c "
SELECT
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  idx_scan,
  seq_tup_read / seq_scan AS avg_rows_per_scan
FROM pg_stat_user_tables
WHERE seq_scan > 0
  AND seq_tup_read / seq_scan > 10000
ORDER BY seq_tup_read DESC
LIMIT 10;
"
```

---

## Monitoring & Alerts

### Configure Alerts

#### Uptime Monitoring (UptimeRobot)

Monitor these endpoints every 5 minutes:
- `https://your-domain.com/` (200 OK)
- `https://your-domain.com/api/health` (200 OK)
- `https://your-domain.com/login` (200 OK)

#### Error Rate Alerts (Sentry)

Configure alerts for:
- Error rate > 1% (5-minute window)
- New error types
- Performance degradation (p95 > 1000ms)

#### System Alerts

```bash
# CPU Alert (> 80% for 5 minutes)
# Add to cron:
*/5 * * * * /usr/local/bin/check-cpu.sh

# Disk Space Alert (> 80%)
*/15 * * * * /usr/local/bin/check-disk.sh

# Memory Alert (> 85%)
*/5 * * * * /usr/local/bin/check-memory.sh
```

### Alert Response Scripts

**`/usr/local/bin/check-cpu.sh`**
```bash
#!/bin/bash
CPU=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
if (( $(echo "$CPU > 80" | bc -l) )); then
  echo "HIGH CPU: $CPU%" | mail -s "CPU Alert" ops@your-domain.com
fi
```

**`/usr/local/bin/check-disk.sh`**
```bash
#!/bin/bash
USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $USAGE -gt 80 ]; then
  echo "HIGH DISK USAGE: $USAGE%" | mail -s "Disk Alert" ops@your-domain.com
fi
```

### Log Analysis

```bash
# Find 500 errors in last hour
tail -10000 /var/log/nginx/error.log | grep "500" | tail -50

# Find slow requests (> 5s)
tail -10000 /var/log/nginx/access.log | awk '{if ($10 > 5000) print $0}'

# Top IP addresses
tail -10000 /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20

# Most requested endpoints
tail -10000 /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -20

# Error distribution by status code
tail -10000 /var/log/nginx/access.log | awk '{print $9}' | sort | uniq -c | sort -rn
```

---

## Common Issues

### Issue: High CPU Usage

**Symptoms:**
- Slow response times
- High CPU in `top` or monitoring

**Diagnosis:**
```bash
# Check Node.js processes
pm2 monit

# Check slow queries
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# Check for infinite loops in logs
pm2 logs gpt-agent | grep -i "loop\|recursive"
```

**Resolution:**
1. Identify slow endpoints in logs
2. Optimize database queries
3. Add caching where appropriate
4. Scale horizontally if needed

### Issue: Memory Leak

**Symptoms:**
- Gradually increasing memory usage
- Application crashes with OOM

**Diagnosis:**
```bash
# Monitor memory over time
pm2 monit

# Check heap usage
node --inspect app.js
# Use Chrome DevTools to analyze heap

# Check for memory leaks in logs
pm2 logs gpt-agent | grep -i "memory\|heap"
```

**Resolution:**
1. Restart application as immediate fix: `pm2 restart gpt-agent`
2. Enable memory limit: `pm2 start npm --max-memory-restart 1G -- start`
3. Profile application to find leak
4. Fix leak and redeploy

### Issue: Database Connection Pool Exhausted

**Symptoms:**
- Errors: "Connection pool exhausted"
- Slow queries
- Timeouts

**Diagnosis:**
```bash
# Check active connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# Check connection pool config
grep -r "pool" .env
```

**Resolution:**
```bash
# Increase pool size (in .env)
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=20

# Kill idle connections
psql $DATABASE_URL -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
  AND state_change < current_timestamp - INTERVAL '5 minutes';
"

# Restart application
pm2 restart gpt-agent
```

### Issue: Redis Connection Errors

**Symptoms:**
- Cache misses
- Connection timeout errors
- Slow performance

**Diagnosis:**
```bash
# Check Redis status
redis-cli ping

# Check memory usage
redis-cli INFO memory

# Check connected clients
redis-cli CLIENT LIST
```

**Resolution:**
```bash
# Restart Redis
sudo systemctl restart redis

# Clear cache if corrupted
redis-cli FLUSHDB

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log

# Increase max memory (redis.conf)
maxmemory 2gb
maxmemory-policy allkeys-lru
```

### Issue: SSL Certificate Expiring

**Symptoms:**
- Browser warnings
- Certificate expiry alerts

**Resolution:**
```bash
# Check certificate expiry
openssl s_client -connect your-domain.com:443 -servername your-domain.com | openssl x509 -noout -dates

# Renew with Let's Encrypt
sudo certbot renew

# Or manually
sudo certbot --nginx -d your-domain.com

# Verify renewal
sudo nginx -t
sudo systemctl reload nginx
```

### Issue: Deployment Failed

**Symptoms:**
- Build errors
- Deployment stuck
- Application not starting

**Diagnosis:**
```bash
# Check build logs
vercel logs

# Or PM2 logs
pm2 logs gpt-agent --err

# Check environment variables
npm run verify:env
```

**Resolution:**
```bash
# Clear build cache
rm -rf .next node_modules
npm ci
npm run build

# Or rollback
vercel rollback [previous-deployment]

# Verify environment
cat .env.production
```

---

## Emergency Contacts

### On-Call Schedule

| Day | Primary | Secondary |
|-----|---------|-----------|
| Mon-Tue | Engineer A | Engineer B |
| Wed-Thu | Engineer B | Engineer C |
| Fri-Sun | Engineer C | Engineer A |

### Contact Information

**Engineering Team:**
- Primary On-Call: +1-XXX-XXX-XXXX
- Secondary On-Call: +1-XXX-XXX-XXXX
- Engineering Lead: engineering@your-domain.com

**Infrastructure:**
- DevOps Lead: devops@your-domain.com
- Database Admin: dba@your-domain.com

**External Services:**
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- OpenAI Status: https://status.openai.com

### Escalation Path

1. **L1** - On-call engineer investigates
2. **L2** - Engineering lead notified (if unresolved in 30 min)
3. **L3** - CTO notified (if P0 incident)

---

## Appendix

### Useful Commands

```bash
# System info
uname -a
lsb_release -a
node --version
npm --version

# Process management
pm2 list
pm2 info gpt-agent
pm2 restart all
pm2 save

# Nginx
sudo nginx -t
sudo systemctl status nginx
sudo systemctl reload nginx
tail -f /var/log/nginx/error.log

# Database
psql $DATABASE_URL -c "\l"  # List databases
psql $DATABASE_URL -c "\dt"  # List tables
psql $DATABASE_URL -c "\di"  # List indexes

# Redis
redis-cli INFO
redis-cli DBSIZE
redis-cli MONITOR
redis-cli --stat

# Docker
docker ps
docker logs -f gpt-agent
docker stats
docker system prune -a
```

### Performance Benchmarks

Use these as baseline for performance comparison:

| Metric | Target | Acceptable |
|--------|--------|------------|
| Homepage Load | < 1s | < 2s |
| API Response (p95) | < 500ms | < 1000ms |
| Database Query (avg) | < 50ms | < 100ms |
| Cache Hit Rate | > 90% | > 80% |

### Change Management

**Before deploying changes:**

1. ✅ Code review completed
2. ✅ Tests passing (unit + E2E)
3. ✅ Staging tested
4. ✅ Database migrations reviewed
5. ✅ Rollback plan documented
6. ✅ Stakeholders notified
7. ✅ Deploy during low-traffic hours

**After deployment:**

1. ✅ Health checks passing
2. ✅ Error rates normal
3. ✅ Performance metrics normal
4. ✅ User acceptance testing
5. ✅ Monitor for 1 hour
6. ✅ Document changes

---

**Document Version:** 1.0
**Last Updated:** 2025-01-17
**Maintained By:** DevOps Team
