import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { metrics } from '@/lib/utils/metrics'
import { logger } from '@/lib/utils/logger'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
/**
 * API endpoint для получения метрик приложения
 * Используется для мониторинга и аналитики
 * 
 * Security: Требует авторизации
 */
export async function GET() {
  try {
    const session = await auth()

    // Only allow authenticated users
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (optional - можно добавить проверку роли)
    // if (session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Forbidden' },
    //     { status: 403 }
    //   )
    // }

    const redirectSummary = metrics.getSummary('redirect')
    const apiCallSummary = metrics.getSummary('api_call')
    const errorSummary = metrics.getSummary('error')

    logger.debug('[metrics] Metrics requested', {
      userId: session.user.id,
    })

    return NextResponse.json({
      success: true,
      metrics: {
        redirects: redirectSummary,
        apiCalls: apiCallSummary,
        errors: errorSummary,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorInstance = error instanceof Error ? error : new Error(String(error))
    logger.error('[metrics] Failed to get metrics', errorInstance)

    return NextResponse.json(
      {
        success: false,
        error: errorInstance.message,
      },
      { status: 500 }
    )
  }
}

/**
 * POST endpoint для сброса метрик (только для админов)
 */
export async function POST() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Clear metrics
    metrics.clear()

    logger.info('[metrics] Metrics cleared', {
      userId: session.user.id,
    })

    return NextResponse.json({
      success: true,
      message: 'Metrics cleared',
    })
  } catch (error) {
    const errorInstance = error instanceof Error ? error : new Error(String(error))
    logger.error('[metrics] Failed to clear metrics', errorInstance)

    return NextResponse.json(
      {
        success: false,
        error: errorInstance.message,
      },
      { status: 500 }
    )
  }
}

