import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    // Basic health check
    const health = {
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

    // Check Redis connection
    try {
      const { default: Redis } = await import('ioredis')

      const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
      await redis.ping()
      await redis.quit()

      health.redis = 'ok'
    } catch (redisError) {
      health.redis = 'error'
      health.redis_error = redisError instanceof Error ? redisError.message : 'Unknown error'
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
    const services = ['database', 'redis', 'openrouter']
    const hasErrors = services.some(service => health[service] === 'error')

    health.overall_status = hasErrors ? 'degraded' : 'healthy'

    const statusCode = hasErrors ? 200 : 200 // Still return 200, but with degraded status

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    console.error('Health check error:', error)

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