import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getCrmConnectionData, createKommoApiForOrg } from '@/lib/repositories/crm-connection'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
    }

    const crmData = await getCrmConnectionData(session.user.orgId)
    if (!crmData.connection || !crmData.connection.access_token) {
      return NextResponse.json(
        { success: false, error: 'CRM не подключен' },
        { status: 400 }
      )
    }

    const kommoApi = await createKommoApiForOrg(session.user.orgId)
    if (!kommoApi) {
      return NextResponse.json(
        { success: false, error: 'Не удалось создать API клиент' },
        { status: 500 }
      )
    }

    const pipelines = await kommoApi.getPipelines()

    // Pipelines already include stages in _embedded.statuses
    const pipelinesWithStages = pipelines.map((pipeline) => ({
      id: pipeline.id,
      name: pipeline.name,
      stages: pipeline._embedded?.statuses || [],
    }))

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
