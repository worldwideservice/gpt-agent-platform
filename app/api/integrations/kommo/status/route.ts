import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { backendFetch } from '@/lib/backend/client'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
    }

    const result = await backendFetch<{
      success: boolean
      status: {
        provider: string
        credentialsConfigured: boolean
        connectionConfigured: boolean
        connection: unknown
        credentials: unknown
        sync: unknown
      }
      error?: string
    }>('/crm/status', {
      method: 'GET',
      searchParams: {
        orgId: session.user.orgId,
        provider: 'kommo',
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Kommo status error:', error)
    return NextResponse.json(
      { success: false, error: 'Не удалось получить статус подключения Kommo' },
      { status: 500 },
    )
  }
}
