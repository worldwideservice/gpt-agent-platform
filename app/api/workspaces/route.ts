import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getOrganizationsForUser } from '@/lib/repositories/organizations'
import { logger } from '@/lib/utils/logger'
import { metrics } from '@/lib/utils/metrics'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * API endpoint для получения списка workspaces (организаций) текущего пользователя
 * Используется в WorkspaceSelector для переключения между workspace'ами
 *
 * @returns {Promise<NextResponse>} Список workspaces пользователя
 */
export async function GET() {
  const startTime = Date.now()

  try {
    const session = await auth()

    if (!session?.user?.id) {
      logger.warn('[workspaces] Unauthorized access attempt')
      return NextResponse.json(
        {
          success: false,
          workspaces: [],
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    logger.debug('[workspaces] Fetching workspaces for user', {
      userId: session.user.id.substring(0, 8) + '...',
    })

    const organizations = await getOrganizationsForUser(session.user.id)

    const workspaces = organizations.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      role: org.role,
    }))

    const duration = Date.now() - startTime
    logger.debug('[workspaces] Successfully fetched workspaces', {
      count: workspaces.length,
      duration: `${duration}ms`,
    })

    metrics.recordApiCall('/api/workspaces', duration, 200)

    return NextResponse.json({
      success: true,
      workspaces,
    })
  } catch (error) {
    const errorInstance = error instanceof Error ? error : new Error(String(error))
    const duration = Date.now() - startTime

    logger.error('[workspaces] Failed to fetch workspaces', errorInstance, {
      duration: `${duration}ms`,
    })

    metrics.recordError('workspaces', {
      errorType: errorInstance.message,
    })
    metrics.recordApiCall('/api/workspaces', duration, 500)

    return NextResponse.json(
      {
        success: false,
        workspaces: [],
        error: error instanceof Error ? error.message : 'Failed to fetch workspaces',
      },
      { status: 500 }
    )
  }
}
