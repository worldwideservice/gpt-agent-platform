import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { backendFetch } from '@/lib/backend/client'

export const POST = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const payload = {
      orgId: session.user.orgId,
      provider: 'kommo',
      connectionId: typeof body.connectionId === 'string' ? body.connectionId : undefined,
      baseDomain: typeof body.baseDomain === 'string' ? body.baseDomain : undefined,
    }

    await backendFetch('/kommo/sync/contacts', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Kommo sync contacts error', error)
    return NextResponse.json({ success: false, error: 'Не удалось запустить синхронизацию контактов Kommo' }, { status: 500 })
  }
}
