import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { backendFetch } from '@/lib/backend/client'

const DEMO_FLAG_VALUES = new Set(['1', 'true'])
const matchesDemoFlag = (value?: string) => (value ? DEMO_FLAG_VALUES.has(value.toLowerCase()) : false)
const isDemoEnvironment = () =>
  matchesDemoFlag(process.env.DEMO_MODE) ||
  matchesDemoFlag(process.env.E2E_ONBOARDING_FAKE) ||
  matchesDemoFlag(process.env.PLAYWRIGHT_DEMO_MODE)

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
    }

    if (isDemoEnvironment()) {
      return NextResponse.json({
        success: true,
        status: {
          provider: 'kommo',
          credentialsConfigured: true,
          connectionConfigured: true,
          connection: {
            base_domain: 'demo.kommo.com',
            status: 'connected',
          },
          credentials: {
            client_id: 'demo-client-id',
            client_secret: 'demo-client-secret',
          },
          sync: {
            last_synced_at: new Date().toISOString(),
            status: 'processed',
            error: null,
          },
        },
      })
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
