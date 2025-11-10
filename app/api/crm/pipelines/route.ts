import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getCRMConnectionByOrg, createKommoApiForOrg } from '@/lib/repositories/crm-connection'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
    }

    const connection = await getCRMConnectionByOrg(session.user.orgId)
    if (!connection || !connection.is_connected) {
      return NextResponse.json(
        { success: false, error: 'CRM не подключен' },
        { status: 400 }
      )
    }

    const kommoApi = await createKommoApiForOrg(session.user.orgId)
    const pipelines = await kommoApi.getPipelines()

    // Get stages for each pipeline
    const pipelinesWithStages = await Promise.all(
      pipelines.map(async (pipeline) => {
        const stages = await kommoApi.getPipelineStatuses(pipeline.id)
        return {
          ...pipeline,
          stages,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        pipelines: pipelinesWithStages,
      },
    })
  } catch (error) {
    logger.error('Failed to get pipelines:', error, {
      endpoint: '/api/crm/pipelines',
      method: 'GET',
    })

    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
