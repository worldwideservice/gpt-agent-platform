import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { backendFetch } from '@/lib/backend/client'

/**
 * GET /api/agents/[id]/crm-connection - Получение подключения CRM для агента
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: agentId } = await params
    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
    }

    const agent = await getAgentById(agentId, session.user.orgId)
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
    }

    // Получаем подключение CRM для организации
    const result = await backendFetch<{
      success: boolean
      connection: {
        id: string
        provider: string
        base_domain: string
        access_token?: string
        metadata?: unknown
      } | null
      error?: string
    }>('/crm/status', {
      method: 'GET',
      searchParams: {
        orgId: session.user.orgId,
        provider: 'kommo',
      },
    })

    if (!result.success || !result.connection) {
      return NextResponse.json({
        success: true,
        data: null,
      })
    }

    // Преобразуем в формат CRMConnection
    const connection = {
      id: result.connection.id,
      crmType: result.connection.provider as 'kommo',
      accessToken: result.connection.access_token,
      domain: result.connection.base_domain,
      isConnected: !!result.connection.access_token,
      lastSyncAt: result.connection.metadata
        ? (result.connection.metadata as { synced_at?: string })?.synced_at
          ? new Date((result.connection.metadata as { synced_at: string }).synced_at)
          : null
        : null,
      config: {
        id: 'kommo',
        name: 'Kommo CRM',
        logo: '/logos/kommo.svg',
        description: 'Kommo CRM',
        authType: 'oauth2' as const,
        baseUrl: 'https://kommo.com/api/v4',
        scopes: ['crm:read', 'crm:write'],
        fields: [],
      },
    }

    return NextResponse.json({
      success: true,
      data: connection,
    })
  } catch (error) {
    console.error('CRM connection API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось получить подключение CRM',
      },
      { status: 500 },
    )
  }
}






