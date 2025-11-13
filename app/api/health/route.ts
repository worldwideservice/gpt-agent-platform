import { NextRequest, NextResponse } from 'next/server'

import { checkCacheHealth } from '@/lib/cache'
import { checkRateLimitHealth, getRateLimitBackend } from '@/lib/rate-limit'
import { logger } from '@/lib/utils/logger'

export const GET = async (request: NextRequest) => {
 try {
 // Basic health check
 const health: Record<string, string | number | undefined> = {
 status: 'ok',
 timestamp: new Date().toISOString(),
 uptime: process.uptime(),
 version: process.env.npm_package_version || '1.0.0',
 environment: process.env.NODE_ENV || 'development',
 }

 // Check database connection (Supabase)
 try {
 const { createClient } = await import('@supabase/supabase-js')

 const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL || '',
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
 {
 auth: {
 autoRefreshToken: false,
 persistSession: false,
 },
 }
 )

 const { error } = await supabase.from('agents').select('id').limit(1)

 health.database = error ? 'error' : 'ok'
 health.database_error = error?.message
 } catch (dbError) {
 health.database = 'error'
 health.database_error = dbError instanceof Error ? dbError.message : 'Unknown error'
 }

// Check Redis connection (only if URL is configured and not a placeholder)
try {
const redisUrl = process.env.REDIS_URL
if (!redisUrl || redisUrl.includes('your-redis-host')) {
health.redis = 'skipped'
health.redis_error = 'Redis URL not configured or using placeholder'
} else {
const cacheHealth = await checkCacheHealth()
health.redis = cacheHealth.healthy ? 'ok' : 'error'
if (!cacheHealth.healthy) {
health.redis_error = cacheHealth.error ?? 'Cache health check failed'
}

if (cacheHealth.stats) {
health.redis_dbSize = cacheHealth.stats.dbSize
}
}
} catch (redisError) {
health.redis = 'error'
health.redis_error = redisError instanceof Error ? redisError.message : 'Unknown error'
}

 // Check rate limiting backend
 try {
   const rateLimitHealth = await checkRateLimitHealth()
   health.rateLimit = rateLimitHealth.status
   health.rateLimit_backend = rateLimitHealth.backend
   health.rateLimit_message = rateLimitHealth.message

   if (rateLimitHealth.details) {
     health.rateLimit_details = rateLimitHealth.details
   }
 } catch (rateLimitError) {
   health.rateLimit = 'error'
   health.rateLimit_error = rateLimitError instanceof Error ? rateLimitError.message : 'Unknown error'
 }

 // Check external API (OpenRouter)
 try {
 const response = await fetch('https://openrouter.ai/api/v1/models', {
 method: 'GET',
 headers: {
 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
 'Content-Type': 'application/json',
 },
 signal: AbortSignal.timeout(5000), // 5 second timeout
 })

 health.openrouter = response.ok ? 'ok' : 'error'
 health.openrouter_status = response.status
 } catch (apiError) {
 health.openrouter = 'error'
 health.openrouter_error = apiError instanceof Error ? apiError.message : 'Unknown error'
 }

 // Determine overall health status
 const services = ['database', 'redis', 'rateLimit', 'openrouter']
 const hasErrors = services.some(service => health[service] === 'error')
 const hasDegraded = services.some(service => health[service] === 'degraded')

 health.overall_status = hasErrors ? 'degraded' : (hasDegraded ? 'degraded' : 'healthy')

 const statusCode = hasErrors ? 200 : 200 // Still return 200, but with degraded status

 return NextResponse.json(health, { status: statusCode })
 } catch (error: unknown) {
 logger.error('Health check error:', error, {
   endpoint: '/api/health',
   method: 'GET',
 })

 return NextResponse.json(
 {
 status: 'error',
 timestamp: new Date().toISOString(),
 error: error instanceof Error ? error.message : 'Unknown error',
 },
 { status: 500 }
 )
 }
}

// HEAD method for load balancers
export const HEAD = async () => {
 return new NextResponse(null, { status: 200 })
}