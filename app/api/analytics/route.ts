import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { z } from 'zod'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { auth } from '@/auth'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { generateDashboardStats } from '@/lib/services/analytics'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { createErrorResponse } from '@/lib/utils/error-handler'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const querySchema = z.object({
  range: z.enum(['7d', '30d', '90d', '1y']).optional().default('7d'),
})

/**
 * GET /api/analytics - Получение расширенной аналитики
 */
export const GET = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    const { response, status } = createErrorResponse(
      new Error('Unauthorized'),
      { code: 'AUTHENTICATION_ERROR', logToSentry: false }
    )
    return NextResponse.json(response, { status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const parsed = querySchema.safeParse({
      range: searchParams.get('range') || '7d',
    })

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => issue.message)
      const { response, status } = createErrorResponse(
        new Error('Validation failed'),
        {
          code: 'VALIDATION_ERROR',
          details: issues,
          logToSentry: false,
        }
      )
      return NextResponse.json(response, { status })
    }

    // Вычисляем даты на основе диапазона
    const endDate = new Date()
    const startDate = new Date()

    switch (parsed.data.range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
    }

    const stats = await generateDashboardStats(
      session.user.orgId,
      startDate,
      endDate
    )

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const { response, status } = createErrorResponse(error, {
      code: 'ANALYTICS_FETCH_ERROR',
      logToSentry: true,
    })
    return NextResponse.json(response, { status })
  }
}
