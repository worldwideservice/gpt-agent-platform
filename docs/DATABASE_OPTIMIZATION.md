# 🗄️ Database Optimization Guide - GPT Agent Platform

## Table of Contents
- [Connection Pooling](#connection-pooling)
- [Query Optimization](#query-optimization)
- [Index Strategy](#index-strategy)
- [Performance Monitoring](#performance-monitoring)
- [Backup & Recovery](#backup--recovery)
- [Disaster Recovery](#disaster-recovery)

---

## Connection Pooling

### Supabase Connection Configuration

**Current Setup:**
- Using Supabase managed PostgreSQL
- Default connection pooling via Supabase Pooler (PgBouncer)

**Recommended Configuration:**

```typescript
// lib/db/connection.ts
import { createClient } from '@supabase/supabase-js'

export const supabaseConfig = {
  // Connection pooling settings
  db: {
    // Connection pool size
    // For Vercel serverless: small pool (1-5)
    // For long-running services (worker): larger pool (10-20)
    poolSize: process.env.NODE_ENV === 'production' ? 10 : 5,

    // Connection timeout
    connectionTimeoutMillis: 10000, // 10 seconds

    // Idle timeout (close unused connections)
    idleTimeoutMillis: 30000, // 30 seconds

    // Maximum lifetime of a connection
    maxLifetimeSeconds: 3600, // 1 hour
  },

  // Use Supabase Pooler for optimal performance
  // Format: postgres://[user].[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
  // Benefits:
  // - Connection pooling (PgBouncer)
  // - Lower latency
  // - Better scalability
}

// For Next.js API Routes (serverless)
export const getSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      db: {
        schema: 'public',
      },
      auth: {
        persistSession: false, // Serverless doesn't need session persistence
      },
      global: {
        headers: {
          'x-application-name': 'gpt-agent-platform',
        },
      },
    }
  )
}
```

### Environment Variables

Add to your `.env` files:

```bash
# Database Connection Pool Settings
DB_POOL_SIZE=10
DB_POOL_MIN=2
DB_POOL_MAX=20
DB_CONNECTION_TIMEOUT=10000
DB_IDLE_TIMEOUT=30000
DB_MAX_LIFETIME=3600000

# Use Supabase Pooler for better performance
# Get from: Supabase Dashboard → Project Settings → Database → Connection Pooling
SUPABASE_POOLER_URL=postgres://user.project:password@pooler.supabase.com:6543/postgres
```

---

## Query Optimization

### N+1 Query Problem

**❌ Bad (N+1 queries):**
```typescript
// This causes N+1 queries!
const agents = await supabase
  .from('agents')
  .select('*')

for (const agent of agents.data) {
  const workflows = await supabase
    .from('agent_workflows')
    .select('*')
    .eq('agent_id', agent.id)

  agent.workflows = workflows.data
}
```

**✅ Good (Single query with join):**
```typescript
const agents = await supabase
  .from('agents')
  .select(`
    *,
    agent_workflows (*)
  `)
```

### Use Prepared Statements

**✅ Always use parameterized queries:**
```typescript
// Good - prevents SQL injection
const { data } = await supabase
  .from('agents')
  .select('*')
  .eq('organization_id', organizationId)
  .eq('status', status)

// Bad - vulnerable to SQL injection
const { data } = await supabase
  .rpc('execute_raw', {
    query: `SELECT * FROM agents WHERE name = '${userInput}'`
  })
```

### Pagination

**✅ Always paginate large result sets:**
```typescript
const PAGE_SIZE = 50

const { data, count } = await supabase
  .from('conversation_messages')
  .select('*', { count: 'exact' })
  .range(offset, offset + PAGE_SIZE - 1)
  .order('created_at', { ascending: false })
```

### Query Caching

```typescript
// Cache frequently accessed data
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

async function getAgentById(id: string) {
  // Try cache first
  const cached = await redis.get(`agent:${id}`)
  if (cached) return cached

  // Fetch from database
  const { data } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single()

  // Cache for 5 minutes
  await redis.setex(`agent:${id}`, 300, data)

  return data
}
```

---

## Index Strategy

### Current Indexes

Based on `DATABASE_SCHEMA.md`, ensure these indexes exist:

```sql
-- agents table
CREATE INDEX idx_agents_organization_id ON agents(organization_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_created_at ON agents(created_at DESC);

-- conversations table
CREATE INDEX idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);

-- conversation_messages table
CREATE INDEX idx_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX idx_messages_created_at ON conversation_messages(created_at DESC);
-- Composite index for common query
CREATE INDEX idx_messages_conversation_created ON conversation_messages(conversation_id, created_at DESC);

-- knowledge_base_items table
CREATE INDEX idx_kb_items_category_id ON knowledge_base_items(category_id);
CREATE INDEX idx_kb_items_organization_id ON knowledge_base_items(organization_id);
-- Vector similarity search index (if using pgvector)
CREATE INDEX idx_kb_items_embedding ON knowledge_base_items USING ivfflat (embedding vector_cosine_ops);

-- crm_accounts table
CREATE INDEX idx_crm_accounts_organization_id ON crm_accounts(organization_id);
CREATE INDEX idx_crm_accounts_kommo_account_id ON crm_accounts(kommo_account_id);

-- analytics_events table
CREATE INDEX idx_analytics_events_organization_id ON analytics_events(organization_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
-- Composite index for analytics queries
CREATE INDEX idx_analytics_org_type_created ON analytics_events(organization_id, event_type, created_at DESC);

-- job_queue_jobs table
CREATE INDEX idx_jobs_status ON job_queue_jobs(status);
CREATE INDEX idx_jobs_organization_id ON job_queue_jobs(organization_id);
CREATE INDEX idx_jobs_created_at ON job_queue_jobs(created_at DESC);
```

### Index Analysis Script

```sql
-- Find missing indexes
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Find unused indexes (run this periodically)
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
ORDER BY tablename, indexname;

-- Find slow queries
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
```

---

## Performance Monitoring

### Enable Query Statistics

```sql
-- Enable pg_stat_statements extension
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View slow queries
SELECT
  substring(query, 1, 100) AS short_query,
  round(total_exec_time::numeric, 2) AS total_time_ms,
  calls,
  round(mean_exec_time::numeric, 2) AS avg_time_ms,
  round((100 * total_exec_time / sum(total_exec_time) OVER ())::numeric, 2) AS percentage
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
```

### Monitoring Queries

Add these to your application:

```typescript
// lib/db/monitoring.ts
import { supabase } from './client'

export async function getDatabaseStats() {
  // Connection count
  const { data: connections } = await supabase
    .rpc('pg_stat_database')

  // Table sizes
  const { data: sizes } = await supabase
    .rpc('pg_database_size')

  // Active queries
  const { data: queries } = await supabase
    .rpc('pg_stat_activity')

  return {
    connections: connections?.length || 0,
    databaseSize: sizes?.[0]?.size || 0,
    activeQueries: queries?.filter(q => q.state === 'active').length || 0,
  }
}

// Export metrics for Prometheus
export async function exportDatabaseMetrics() {
  const stats = await getDatabaseStats()

  return `
# HELP database_connections Number of database connections
# TYPE database_connections gauge
database_connections ${stats.connections}

# HELP database_size_bytes Database size in bytes
# TYPE database_size_bytes gauge
database_size_bytes ${stats.databaseSize}

# HELP database_active_queries Number of active queries
# TYPE database_active_queries gauge
database_active_queries ${stats.activeQueries}
  `.trim()
}
```

---

## Backup & Recovery

### Supabase Automatic Backups

**Supabase provides:**
- Daily automatic backups (retained for 7 days on Free plan, 30 days on Pro)
- Point-in-time recovery (Pro plan only)
- Manual backup via Dashboard

### Manual Backup Script

```bash
#!/bin/bash
# scripts/backup-database.sh

set -e

# Load environment variables
source .env.production

BACKUP_DIR="./backups/database"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Get database connection string from Supabase
# Dashboard → Project Settings → Database → Connection string
DB_HOST="db.your-project.supabase.co"
DB_NAME="postgres"
DB_USER="postgres"

echo "Starting database backup..."

# Backup using pg_dump
PGPASSWORD=$SUPABASE_SERVICE_ROLE_KEY pg_dump \
  -h $DB_HOST \
  -U $DB_USER \
  -d $DB_NAME \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  -F c \
  -f $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

echo "Backup completed: ${BACKUP_FILE}.gz"

# Upload to S3 (optional)
if [ ! -z "$AWS_S3_BACKUP_BUCKET" ]; then
  aws s3 cp ${BACKUP_FILE}.gz s3://$AWS_S3_BACKUP_BUCKET/database/
  echo "Uploaded to S3"
fi

# Cleanup old backups (keep last 30 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup process complete"
```

### Restore from Backup

```bash
#!/bin/bash
# scripts/restore-database.sh

set -e

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./restore-database.sh <backup-file.sql.gz>"
  exit 1
fi

echo "⚠️  WARNING: This will restore the database from backup!"
echo "Backup file: $BACKUP_FILE"
read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Aborted"
  exit 0
fi

# Uncompress backup
gunzip -c $BACKUP_FILE > /tmp/restore.sql

# Restore using psql
PGPASSWORD=$SUPABASE_SERVICE_ROLE_KEY pg_restore \
  -h $DB_HOST \
  -U $DB_USER \
  -d $DB_NAME \
  --clean \
  --if-exists \
  --no-owner \
  --no-privileges \
  /tmp/restore.sql

# Cleanup
rm /tmp/restore.sql

echo "✅ Database restored successfully"
```

### Automated Backup Schedule

Add to your CI/CD or use cron:

```yaml
# .github/workflows/backup-database.yml
name: Database Backup

on:
  schedule:
    # Daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install PostgreSQL client
        run: |
          sudo apt-get update
          sudo apt-get install -y postgresql-client

      - name: Run backup
        env:
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          DB_HOST: ${{ secrets.DB_HOST }}
          AWS_S3_BACKUP_BUCKET: ${{ secrets.AWS_S3_BACKUP_BUCKET }}
        run: |
          chmod +x scripts/backup-database.sh
          ./scripts/backup-database.sh

      - name: Upload backup artifact
        uses: actions/upload-artifact@v4
        with:
          name: database-backup-${{ github.run_number }}
          path: backups/database/*.sql.gz
          retention-days: 30
```

---

## Disaster Recovery

### RTO & RPO Targets

- **RTO (Recovery Time Objective):** < 1 hour
- **RPO (Recovery Point Objective):** < 24 hours

### DR Checklist

- [ ] Daily automated backups enabled
- [ ] Backups stored in multiple locations (S3, GitHub artifacts)
- [ ] Restore procedure tested monthly
- [ ] Database replication configured (if using self-hosted)
- [ ] Monitoring alerts for backup failures
- [ ] Documentation updated and accessible
- [ ] Team trained on restore procedures
- [ ] Contact list for Supabase support

### DR Procedures

#### Scenario 1: Complete Database Loss

1. **Immediate Actions (0-15 min)**
   ```bash
   # Enable maintenance mode
   vercel env add MAINTENANCE_MODE true
   vercel --prod
   ```

2. **Create New Supabase Project (15-30 min)**
   - Go to Supabase Dashboard
   - Create new project
   - Note new connection details

3. **Restore from Backup (30-60 min)**
   ```bash
   # Download latest backup
   aws s3 cp s3://$BACKUP_BUCKET/database/latest.sql.gz .

   # Restore
   ./scripts/restore-database.sh latest.sql.gz
   ```

4. **Update Environment Variables (60-70 min)**
   ```bash
   vercel env rm SUPABASE_URL
   vercel env add SUPABASE_URL <new-url>
   # ... update all Supabase env vars
   ```

5. **Deploy & Verify (70-90 min)**
   ```bash
   vercel --prod

   # Verify
   curl -f https://your-app.vercel.app/api/health
   ```

6. **Disable Maintenance Mode (90 min)**
   ```bash
   vercel env rm MAINTENANCE_MODE
   vercel --prod
   ```

#### Scenario 2: Data Corruption

1. **Identify Corruption Timeframe**
2. **Stop Writes**
   ```bash
   # Enable read-only mode
   vercel env add READ_ONLY_MODE true
   vercel --prod
   ```

3. **Restore from Point-in-Time (Supabase Pro)**
   - Dashboard → Database → Backups → Point-in-Time Recovery
   - Select timestamp before corruption

4. **Verify Data Integrity**
   ```sql
   -- Check critical tables
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM agents;
   SELECT COUNT(*) FROM conversations;
   ```

5. **Re-enable Writes**

### Testing DR Plan

**Monthly Drill:**
```bash
# 1. Create test Supabase project
# 2. Restore latest backup to test project
./scripts/restore-database.sh --target test-project
# 3. Verify data integrity
# 4. Document time taken
# 5. Update procedures if needed
```

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Query response time (p95) | < 100ms | > 500ms |
| Connection pool usage | < 70% | > 85% |
| Active connections | < 20 | > 50 |
| Slow queries | 0 | > 5 per hour |
| Lock wait time | < 10ms | > 100ms |

### Monitoring Queries

```sql
-- Check connection pool usage
SELECT
  count(*) FILTER (WHERE state = 'active') AS active,
  count(*) FILTER (WHERE state = 'idle') AS idle,
  count(*) AS total
FROM pg_stat_activity;

-- Find blocking queries
SELECT
  blocked_locks.pid AS blocked_pid,
  blocked_activity.usename AS blocked_user,
  blocking_locks.pid AS blocking_pid,
  blocking_activity.usename AS blocking_user,
  blocked_activity.query AS blocked_statement,
  blocking_activity.query AS blocking_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

---

**Last Updated:** 2025-11-13
**Version:** 1.0
**Owner:** DevOps Team
