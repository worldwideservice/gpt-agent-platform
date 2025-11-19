// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { backendFetch } from '@/lib/backend/client'

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    // Sync CRM data (pipelines, channels, fields) for the agent
    await backendFetch('/crm/sync', {
      method: 'POST',
      body: JSON.stringify({
        orgId: session.user.orgId,
        agentId: id,
        provider: 'kommo',
      }),
    })

    return NextResponse.json({
      success: true,
      message: 'CRM синхронизация запущена успешно',
    })
  } catch (error) {
    console.error('CRM sync error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось запустить синхронизацию CRM',
      },
      { status: 500 },
    )
  }
}
