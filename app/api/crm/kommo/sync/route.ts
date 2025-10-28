import { NextRequest, NextResponse } from 'next/server'
import { KommoProvider } from '@/lib/crm/providers/KommoProvider'
import type { CRMConnection } from '@/types/crm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { connection } = body

    if (!connection || !connection.accessToken) {
      return NextResponse.json(
        { error: 'Invalid connection data' },
        { status: 400 }
      )
    }

    // Создаем провайдер
    const provider = new KommoProvider(connection as CRMConnection)

    // Синхронизируем данные
    const syncResult = await provider.syncAll()

    return NextResponse.json({
      success: true,
      data: syncResult
    })

  } catch (error) {
    console.error('Kommo sync error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accessToken = searchParams.get('access_token')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 400 }
      )
    }

    // Создаем временное соединение для тестирования
    const connection: CRMConnection = {
      id: 'test',
      crmType: 'kommo',
      accessToken: accessToken,
      domain: 'test.kommo.com',
      isConnected: true,
      lastSyncAt: new Date(),
      config: {
        id: 'kommo',
        name: 'Kommo CRM',
        logo: '/logos/kommo.svg',
        description: 'Kommo CRM',
        authType: 'oauth2',
        baseUrl: 'https://kommo.com/api/v4',
        scopes: ['crm:read', 'crm:write'],
        fields: []
      }
    }

    const provider = new KommoProvider(connection)

    // Тестируем соединение
    const pipelines = await provider.getPipelines()

    return NextResponse.json({
      success: true,
      data: {
        pipelines: pipelines.slice(0, 3), // Возвращаем только первые 3 для тестирования
        message: 'Kommo connection successful'
      }
    })

  } catch (error) {
    console.error('Kommo test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed'
      },
      { status: 500 }
    )
  }
}
