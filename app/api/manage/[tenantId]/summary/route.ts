import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { getWorkspaceSummary } from '@/lib/repositories/manage-summary'

export const dynamic = 'force-dynamic'

export const GET = async (_request: NextRequest, { params }: { params: { tenantId: string } }) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  if (session.user.orgId !== params.tenantId && params.tenantId !== session.user.orgId) {
    return NextResponse.json({ success: false, error: 'Доступ запрещён' }, { status: 403 })
  }

  try {
    const summary = await getWorkspaceSummary(session.user.orgId)
    return NextResponse.json({ success: true, data: summary })
  } catch (error) {
    console.error('Failed to load workspace summary', error)
    return NextResponse.json(
      { success: false, error: 'Не удалось загрузить сводку рабочего пространства' },
      { status: 500 },
    )
  }
}
