/**
 * Database Health Check Endpoint
 * Provides detailed database connectivity and performance metrics
 */

// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { logger } from '@/lib/utils/logger'

export const GET = async (request: NextRequest) => {
  try {
    const startTime = Date.now()

    // Database health check
    const { createClient } = await import('@supabase/supabase-js')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Check basic connectivity
    const { data: agentsData, error: agentsError } = await supabase
      .from('agents')
      .select('id')
      .limit(1)

    if (agentsError) {
      logger.warn('Database health check failed', {
        error: agentsError.message,
        endpoint: '/api/health/db',
      })

      return NextResponse.json(
        {
          status: 'error',
          healthy: false,
          timestamp: new Date().toISOString(),
          error: agentsError.message,
          response_time_ms: Date.now() - startTime,
        },
        { status: 503 }
      )
    }

    // Check table counts for diagnostics
    const tables = ['agents', 'documents', 'conversations', 'organizations']
    const tableCounts: Record<string, number> = {}

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })

        if (!error && count !== null) {
          tableCounts[table] = count
        }
      } catch (err) {
        // Continue if table doesn't exist or query fails
        tableCounts[table] = -1
      }
    }

    // Get database version (if using direct PostgreSQL connection)
    let dbVersion = 'unknown'
    let dbSize = 'unknown'

    // Try to get database info via RPC if available
    try {
      const { data: versionData } = await supabase.rpc('version' as any)
      if (versionData) {
        dbVersion = versionData
      }
    } catch {
      // RPC not available, skip
    }

    const responseTime = Date.now() - startTime

    const health = {
      status: 'ok',
      healthy: true,
      timestamp: new Date().toISOString(),
      response_time_ms: responseTime,
      database: {
        provider: 'Supabase/PostgreSQL',
        version: dbVersion,
        size: dbSize,
        connected: true,
      },
      tables: tableCounts,
      performance: {
        query_time_ms: responseTime,
        status: responseTime < 100 ? 'excellent' : responseTime < 500 ? 'good' : 'slow',
      },
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error: unknown) {
    logger.error('Database health check error:', error, {
      endpoint: '/api/health/db',
      method: 'GET',
    })

    return NextResponse.json(
      {
        status: 'error',
        healthy: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown database error',
      },
      { status: 503 }
    )
  }
}

// HEAD method for load balancers
export const HEAD = async () => {
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

    return new NextResponse(null, { status: error ? 503 : 200 })
  } catch {
    return new NextResponse(null, { status: 503 })
  }
}
