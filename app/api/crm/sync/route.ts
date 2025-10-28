import { NextRequest, NextResponse } from 'next/server'
import { KommoAPI } from '@/lib/crm/kommo'

// Синхронизация данных из CRM
export async function POST(request: NextRequest) {
  try {
    const { crmType, accessToken, domain } = await request.json()

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Access token required' },
        { status: 400 }
      )
    }

    let syncResult

    switch (crmType) {
      case 'kommo':
        syncResult = await syncKommoData(accessToken, domain)
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported CRM type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: syncResult
    })

  } catch (error) {
    console.error('CRM sync error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 }
    )
  }
}

async function syncKommoData(accessToken: string, domain: string) {
  const kommo = new KommoAPI({
    domain: domain || 'your-domain',
    clientId: process.env.KOMMO_CLIENT_ID || '',
    clientSecret: process.env.KOMMO_CLIENT_SECRET || '',
    redirectUri: process.env.KOMMO_REDIRECT_URI || '',
    accessToken: accessToken
  })

  try {
    // Получаем воронки
    const pipelines = await kommo.getPipelines()
    
    // Получаем пользователей
    const users = await kommo.getUsers()

    // Преобразуем в универсальный формат
    const universalPipelines = pipelines.map(pipeline => ({
      id: pipeline.id.toString(),
      name: pipeline.name,
      isActive: true,
      stages: pipeline._embedded.statuses.map(stage => ({
        id: stage.id.toString(),
        name: stage.name,
        pipelineId: pipeline.id.toString(),
        order: stage.sort,
        isActive: true
      }))
    }))

    const universalChannels = [
      { id: 'email', name: 'Email', type: 'email' as const, isActive: true },
      { id: 'phone', name: 'Телефон', type: 'phone' as const, isActive: true },
      { id: 'chat', name: 'Чат', type: 'chat' as const, isActive: true }
    ]

    return {
      pipelines: universalPipelines,
      channels: universalChannels,
      users: users,
      lastSyncAt: new Date()
    }

  } catch (error) {
    console.error('Kommo sync error:', error)
    throw new Error(`Failed to sync Kommo data: ${error}`)
  }
}
