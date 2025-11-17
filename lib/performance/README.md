# Performance Optimization

Comprehensive performance optimization tools and best practices for the GPT Agent Platform.

## Overview

Performance optimizations implemented:
- **Redis caching** for API responses and database queries
- **Response compression** (gzip/brotli)
- **Query optimization** with performance tracking
- **Frontend optimization** (code splitting, lazy loading, bundle optimization)
- **Performance monitoring** and alerting

## Components

### Redis Cache

Caching layer for reducing database load and improving response times.

```tsx
import { getCache, setCache, cacheOrFetch } from '@/lib/cache/redis-cache'

// Get from cache
const data = await getCache<User>('user:123')

// Set in cache (with 5 min TTL)
await setCache('user:123', user, { ttl: 300 })

// Get or fetch pattern
const data = await cacheOrFetch(
  'users:list',
  async () => {
    return await db.select().from(users)
  },
  { ttl: 600 } // 10 minutes
)
```

**Features:**
- Automatic JSON serialization
- TTL (time-to-live) support
- Cache invalidation by key or pattern
- Cache statistics

**Best Practices:**
- Cache frequently accessed data
- Use appropriate TTL values
- Invalidate cache on updates
- Don't cache user-specific data globally

### Response Compression

Automatic gzip/brotli compression for API responses.

```tsx
import { withCompression } from '@/lib/middleware/compression'

export const GET = withCompression(async (request) => {
  const data = await fetchLargeData()
  return NextResponse.json(data)
})
```

**Compression Thresholds:**
- Minimum size: 1KB
- Compressible types: JSON, JS, HTML, CSS, XML
- Compression ratio: typically 60-80%

### Query Optimization

Track and optimize database queries.

```tsx
import { measureQuery, queryTracker } from '@/lib/performance/query-optimizer'

// Measure query performance
const users = await measureQuery('get-users', async () => {
  return await db.select().from(users).where(eq(users.active, true))
})

// Get query statistics
const stats = queryTracker.getStats()
const slowest = queryTracker.getSlowestQueries(10)
```

**Automatic Alerts:**
- Slow queries (>100ms) logged as warnings
- Query statistics tracked
- Suggestions for missing indexes

**Pagination Helper:**
```tsx
import { calculatePagination, createPaginatedResponse } from '@/lib/performance/query-optimizer'

const { offset, limit, page } = calculatePagination(
  req.query.page,
  req.query.limit,
  maxLimit: 100
)

const users = await db.select().from(users).limit(limit).offset(offset)
const total = await db.select({ count: count() }).from(users)

return createPaginatedResponse(users, total, page, limit)
```

### Frontend Optimization

Tools for optimizing frontend performance.

```tsx
import {
  debounce,
  throttle,
  lazyWithRetry,
  prefetch,
  preload,
  measureRender,
} from '@/lib/performance/frontend-optimization'

// Debounce search input
const handleSearch = debounce((query: string) => {
  fetchResults(query)
}, 300)

// Throttle scroll handler
const handleScroll = throttle(() => {
  updateScrollPosition()
}, 100)

// Lazy load with retry
const DashboardCharts = lazy(() =>
  lazyWithRetry(() => import('./DashboardCharts'))
)

// Prefetch next page
prefetch('/api/users?page=2', 'fetch')

// Preload critical font
preload('/fonts/inter.woff2', 'font')

// Measure component render time
measureRender('Dashboard', (duration) => {
  console.log(`Dashboard rendered in ${duration}ms`)
})
```

### Performance Monitoring

Track and analyze performance metrics.

```tsx
import {
  performanceMonitor,
  measureAsync,
  trackAPIPerformance,
  getPerformanceReport,
} from '@/lib/performance/monitoring'

// Measure async operation
const data = await measureAsync('fetch-users', async () => {
  return await fetchUsers()
})

// Track API performance
trackAPIPerformance('/api/users', 'GET', 200, 145)

// Get performance report
const report = getPerformanceReport()
console.log('API p95:', report.api.p95, 'ms')
console.log('DB p95:', report.db.p95, 'ms')

// Get summary for specific metric
const summary = performanceMonitor.getSummary('api_request')
console.log('Average API response time:', summary.avg, 'ms')
```

## Best Practices

### 1. Database Optimization

✅ **DO:**
```sql
-- Use indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org_id ON users(org_id);

-- Use EXPLAIN to analyze queries
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Limit result sets
SELECT * FROM users LIMIT 100;

-- Use connection pooling
-- (automatically configured with Supabase)
```

❌ **DON'T:**
```sql
-- Avoid SELECT *
SELECT * FROM users;  -- Bad

-- Avoid N+1 queries
-- Use JOINs or batch queries instead
```

### 2. API Caching

✅ **DO:**
```tsx
// Cache GET requests
export async function GET(request: NextRequest) {
  return cacheOrFetch(
    'api:users:list',
    async () => {
      const users = await db.select().from(users)
      return NextResponse.json(users)
    },
    { ttl: 300 }
  )
}

// Invalidate on updates
export async function POST(request: NextRequest) {
  const user = await createUser(data)
  await deleteCache('api:users:list')
  return NextResponse.json(user)
}
```

❌ **DON'T:**
```tsx
// Don't cache user-specific data globally
await setCache('current-user', user) // Bad - cache pollution
```

### 3. Code Splitting

✅ **DO:**
```tsx
// Lazy load non-critical components
const AdminPanel = lazy(() => import('./AdminPanel'))
const Charts = lazy(() => import('./Charts'))

// Route-based code splitting (automatic in Next.js)
// app/admin/page.tsx
// app/dashboard/page.tsx

// Component-based splitting
<Suspense fallback={<Spinner />}>
  <Charts />
</Suspense>
```

❌ **DON'T:**
```tsx
// Don't lazy load critical above-the-fold content
const Header = lazy(() => import('./Header')) // Bad
const Hero = lazy(() => import('./Hero')) // Bad
```

### 4. Image Optimization

✅ **DO:**
```tsx
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  loading="lazy"
  placeholder="blur"
  quality={75}
/>
```

❌ **DON'T:**
```tsx
// Don't use regular img tags
<img src="/large-image.jpg" /> // Bad

// Don't load full-size images
<img src="/hero-4k.jpg" style={{ width: '300px' }} /> // Bad
```

### 5. Bundle Optimization

**next.config.js:**
```js
module.exports = {
  // Analyze bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  },

  // Compression
  compress: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
  },

  // Bundle analyzer (run: ANALYZE=true npm run build)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
        })
      )
      return config
    },
  }),
}
```

## Performance Targets

### API Response Times
- **Target:** <200ms p95
- **Warning:** >500ms
- **Critical:** >1000ms

### Database Queries
- **Target:** <50ms p95
- **Warning:** >100ms
- **Critical:** >500ms

### Page Load Times
- **FCP (First Contentful Paint):** <1.8s
- **LCP (Largest Contentful Paint):** <2.5s
- **TTI (Time to Interactive):** <3.8s
- **CLS (Cumulative Layout Shift):** <0.1
- **FID (First Input Delay):** <100ms

### Bundle Sizes
- **Initial Load:** <200KB (gzipped)
- **Per Route:** <100KB (gzipped)
- **Third-party:** <50KB (gzipped)

## Monitoring

### Real-time Monitoring

```tsx
// Track Web Vitals
import { reportWebVitals } from '@/lib/performance/frontend-optimization'

reportWebVitals((metric) => {
  // Send to analytics
  analytics.track('web-vital', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
  })

  // Log poor metrics
  if (metric.rating === 'poor') {
    console.warn('Poor Web Vital:', metric)
  }
})
```

### Performance Dashboard

Create API endpoint for performance metrics:

```tsx
// app/api/performance/route.ts
import { getPerformanceReport } from '@/lib/performance/monitoring'
import { getCacheStats } from '@/lib/cache/redis-cache'
import { queryTracker } from '@/lib/performance/query-optimizer'

export async function GET() {
  const report = getPerformanceReport()
  const cacheStats = await getCacheStats()
  const slowQueries = queryTracker.getSlowestQueries(10)

  return NextResponse.json({
    api: report.api,
    database: report.db,
    cache: cacheStats,
    slowQueries,
    slowOperations: report.slowOperations,
  })
}
```

## Troubleshooting

### Slow API Endpoints

1. Check cache hit rate
2. Review database query performance
3. Add indexes for common queries
4. Consider pagination
5. Use compression

### Slow Page Loads

1. Analyze bundle size
2. Implement code splitting
3. Optimize images
4. Add resource hints (prefetch/preload)
5. Check for render-blocking resources

### Memory Leaks

1. Use Chrome DevTools Memory Profiler
2. Check for event listener cleanup
3. Review React useEffect dependencies
4. Monitor memory usage over time

## Tools

### Development

```bash
# Analyze bundle
ANALYZE=true npm run build

# Profile performance
npm run build && npm run start
# Open Chrome DevTools → Performance tab

# Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Bundle size
npm run build
# Check .next/analyze/client.html
```

### Production

- **Vercel Analytics:** Built-in performance monitoring
- **Sentry:** Error and performance tracking
- **Datadog:** APM and infrastructure monitoring
- **Google Analytics:** Web Vitals tracking

## Resources

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web.dev Performance](https://web.dev/performance/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
