import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { getWorkspaceSummary, createDemoWorkspaceSummary } from '@/lib/repositories/manage-summary'

const DEMO_FLAG_VALUES = new Set(['1', 'true'])
const matchesDemoFlag = (value?: string) => (value ? DEMO_FLAG_VALUES.has(value.toLowerCase()) : false)
const isDemoEnvironment = () =>
  matchesDemoFlag(process.env.DEMO_MODE) ||
  matchesDemoFlag(process.env.E2E_ONBOARDING_FAKE) ||
  matchesDemoFlag(process.env.PLAYWRIGHT_DEMO_MODE)

export const dynamic = 'force-dynamic'

export const GET = async (_request: NextRequest, { params }: { params: { tenantId: string } }) => {
  const session = await auth()

  if (isDemoEnvironment()) {
    const tenantId = session?.user?.orgId ?? params.tenantId
    return NextResponse.json({ success: true, data: createDemoWorkspaceSummary(tenantId) })
  }

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
