## Advanced Analytics System

Comprehensive analytics and reporting for AI agents and user behavior.

## Overview

The analytics system provides:
- **Time-series data** - Track metrics over time
- **Dashboard summaries** - Key metrics with period-over-period comparison
- **Agent analytics** - Performance metrics per agent
- **User analytics** - Activity tracking and retention
- **Exports** - CSV/JSON data exports
- **Real-time** - Current hour metrics

## Database Schema

### agent_analytics
Per-agent metrics aggregated by day/hour:
- `total_requests`, `successful_requests`, `failed_requests`
- `input_tokens`, `output_tokens`, `total_tokens`
- `total_cost_cents`
- `avg_rating`, `thumbs_up`, `thumbs_down`
- `conversions`, `conversion_rate`
- `avg_response_time_ms`

### org_analytics
Organization-wide aggregates:
- All agent metrics combined
- `active_users`, `new_users`
- Same time-series structure (by day/hour)

### user_activity
Event-level tracking:
- `event_type` - page_view, chat_message, conversion, rating, etc.
- `event_metadata` - Custom event data
- `agent_id` - Associated agent
- `user_id` / `session_id` - User identification

## API Endpoints

### Dashboard Summary

Get key metrics with comparison to previous period:

```typescript
GET /api/analytics/dashboard?start_date=2025-01-01&end_date=2025-01-31

Response: {
  summary: {
    total_requests: {
      current: 5234,
      previous: 4123,
      change: 26.9  // % change
    },
    total_tokens: {
      current: 1245678,
      previous: 1098765,
      change: 13.4
    },
    total_cost: {
      current: 124.56,
      previous: 98.32,
      change: 26.7
    },
    avg_rating: {
      current: 4.3,
      previous: 4.1,
      change: 4.9
    },
    conversions: {
      current: 234,
      previous: 189,
      change: 23.8
    }
  },
  top_agents: [
    {
      agent_id: "agent_123",
      agent_name: "Support Bot",
      metric_value: 2341,
      total_requests: 2341
    }
  ],
  realtime: {
    total_requests: 45,
    successful_requests: 43,
    failed_requests: 2,
    total_tokens: 12450,
    total_cost_cents: 245,
    active_users: 12
  }
}
```

### Time Series

Get historical data for charts:

```typescript
GET /api/analytics/timeseries?metric=requests&start_date=2025-01-01&end_date=2025-01-31&granularity=day

Response: {
  data: [
    { timestamp: "2025-01-01T00:00:00Z", value: 145 },
    { timestamp: "2025-01-02T00:00:00Z", value: 189 },
    { timestamp: "2025-01-03T00:00:00Z", value: 234 },
    ...
  ]
}
```

**Metrics:**
- `requests` - Total requests
- `tokens` - Token usage
- `cost` - Cost in dollars
- `rating` - Average rating

**Granularity:**
- `hour` - Hourly data
- `day` - Daily data (default)
- `week` - Weekly aggregates
- `month` - Monthly aggregates

### Agent Comparison

Compare multiple agents side-by-side:

```typescript
POST /api/analytics/agents/compare

Body: {
  agent_ids: ["agent_1", "agent_2", "agent_3"],
  start_date: "2025-01-01",
  end_date: "2025-01-31"
}

Response: {
  comparison: [
    {
      agent_id: "agent_1",
      total_requests: 2341,
      total_tokens: 567890,
      total_cost: 56.78,
      avg_rating: 4.5,
      conversions: 134
    },
    {
      agent_id: "agent_2",
      total_requests: 1823,
      total_tokens: 445566,
      total_cost: 44.55,
      avg_rating: 4.2,
      conversions: 98
    },
    ...
  ]
}
```

### Retention Analysis

Calculate user retention rates:

```typescript
GET /api/analytics/retention?cohort_date=2025-01-01

Response: {
  retention: [
    { day: 0, users_retained: 100, retention_rate: 1.00 },
    { day: 1, users_retained: 75, retention_rate: 0.75 },
    { day: 7, users_retained: 50, retention_rate: 0.50 },
    { day: 14, users_retained: 42, retention_rate: 0.42 },
    { day: 30, users_retained: 35, retention_rate: 0.35 }
  ]
}
```

### Export Data

Export analytics as CSV or JSON:

```typescript
GET /api/analytics/export?start_date=2025-01-01&end_date=2025-01-31&format=csv

Response: CSV file download
```

### Track Activity

Track custom user events:

```typescript
POST /api/analytics/track

Body: {
  event_type: "chat_message",
  metadata: {
    message_length: 145,
    response_time_ms: 1250
  },
  session_id: "session_abc",
  agent_id: "agent_123"
}

Response: { success: true }
```

**Event Types:**
- `page_view` - Page visit
- `chat_message` - Message sent
- `conversion` - User converted
- `rating` - User rated response
- `document_upload` - Document uploaded
- `search` - Search performed
- `experiment_assign` - A/B test assignment
- `custom` - Custom event

## Usage

### Client-side Tracking

```typescript
'use client'
import { useEffect } from 'react'

export function Analytics() {
  useEffect(() => {
    // Track page view
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'page_view',
        metadata: {
          path: window.location.pathname,
        },
      }),
    })
  }, [])

  const trackConversion = async () => {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'conversion',
        metadata: {
          value: 99.99,
          source: 'chat',
        },
        agent_id: 'agent_123',
      }),
    })
  }

  return <button onClick={trackConversion}>Convert</button>
}
```

### Dashboard Component

```typescript
'use client'
import { useState, useEffect } from 'react'

export function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/analytics/dashboard')
      const data = await res.json()
      setData(data)
    }
    loadData()
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card
          title="Total Requests"
          value={data.summary.total_requests.current}
          change={data.summary.total_requests.change}
        />
        <Card
          title="Total Cost"
          value={`$${data.summary.total_cost.current.toFixed(2)}`}
          change={data.summary.total_cost.change}
        />
        <Card
          title="Avg Rating"
          value={data.summary.avg_rating.current.toFixed(1)}
          change={data.summary.avg_rating.change}
        />
        <Card
          title="Conversions"
          value={data.summary.conversions.current}
          change={data.summary.conversions.change}
        />
      </div>

      {/* Top Agents */}
      <div>
        <h2>Top Agents</h2>
        <table>
          {data.top_agents.map(agent => (
            <tr key={agent.agent_id}>
              <td>{agent.agent_name}</td>
              <td>{agent.total_requests}</td>
            </tr>
          ))}
        </table>
      </div>

      {/* Realtime */}
      <div>
        <h2>Current Hour</h2>
        <p>Requests: {data.realtime.total_requests}</p>
        <p>Active Users: {data.realtime.active_users}</p>
      </div>
    </div>
  )
}
```

### Time Series Chart

```typescript
'use client'
import { LineChart } from 'recharts'

export function RequestsChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/api/analytics/timeseries?metric=requests&granularity=day')
      const { data } = await res.json()
      setData(data)
    }
    loadData()
  }, [])

  return (
    <LineChart data={data}>
      <Line dataKey="value" />
      <XAxis dataKey="timestamp" />
      <YAxis />
    </LineChart>
  )
}
```

## Data Aggregation

Analytics data is aggregated automatically. You need to set up a cron job or scheduled function to run aggregation:

```typescript
// scripts/aggregate-analytics.ts
import { aggregateAnalytics } from '@/lib/analytics/aggregation'

async function main() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  await aggregateAnalytics(yesterday)

  console.log('Analytics aggregated for:', yesterday.toISOString())
}

main()
```

Run daily:
```bash
# Cron job (runs at 1 AM daily)
0 1 * * * cd /app && npm run aggregate-analytics
```

Or use Vercel Cron:
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/aggregate-analytics",
    "schedule": "0 1 * * *"
  }]
}
```

## Best Practices

### Tracking Events

✅ **DO:**
- Track meaningful events (conversions, ratings)
- Include relevant metadata
- Use consistent event names
- Track anonymously when possible (session_id)

❌ **DON'T:**
- Track PII without consent
- Track every single action (be selective)
- Block user flow waiting for tracking
- Fail if tracking fails (use try/catch)

### Performance

✅ **DO:**
- Use hourly granularity for real-time
- Use daily granularity for historical
- Query specific date ranges
- Cache dashboard data (5-10 min)

❌ **DON'T:**
- Query all data without date filters
- Use hourly granularity for long periods
- Make synchronous analytics calls
- Query on every page load

### Data Retention

Configure retention policy:

```sql
-- Delete activity older than 90 days
DELETE FROM user_activity
WHERE created_at < NOW() - INTERVAL '90 days';

-- Aggregate and delete hourly data after 7 days
-- Keep daily aggregates
```

## Monitoring

Track analytics system health:

```typescript
// Check for missing data
const today = new Date().toISOString().split('T')[0]

const { count } = await supabase
  .from('org_analytics')
  .select('id', { count: 'exact' })
  .eq('date', today)

if (count === 0) {
  console.warn('No analytics data for today - aggregation may have failed')
}
```

## Costs

**Storage:**
- ~1KB per analytics row
- ~100 rows/day per agent
- 1 agent, 30 days = ~3MB

**Queries:**
- Dashboard: ~50ms
- Time series: ~100ms
- Export: ~500ms (depends on range)

**Optimization:**
- Use indexes (automatically created)
- Query specific date ranges
- Use daily aggregates for historical data
- Archive old data

## Troubleshooting

### No data showing

```
Dashboard shows zeros
```

**Solution:**
- Check if aggregation is running
- Verify events are being tracked
- Check date ranges
- Look for errors in logs

### Slow queries

```
Dashboard takes >2s to load
```

**Solution:**
- Add date filters
- Use daily granularity
- Check indexes exist
- Review query explain plans

### Data doesn't match

```
Summary shows different numbers than raw data
```

**Solution:**
- Verify aggregation ran successfully
- Check for timezone issues
- Ensure no duplicate aggregations
- Rerun aggregation for date

## Resources

- [SQL Aggregation Functions](https://www.postgresql.org/docs/current/functions-aggregate.html)
- [Time-series Best Practices](https://www.timescale.com/blog/time-series-data-postgresql-10-key-tips/)
- [Analytics Schema Design](https://www.sisense.com/blog/analytics-database-design-best-practices/)
