import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { listDemoWebhookEvents } from '@/lib/demo/webhook-events'

const DEMO_FLAG_VALUES = new Set(['1', 'true'])
const matchesDemoFlag = (value?: string) => (value ? DEMO_FLAG_VALUES.has(value.toLowerCase()) : false)
const isDemoEnvironment = () =>
  matchesDemoFlag(process.env.DEMO_MODE) ||
  matchesDemoFlag(process.env.E2E_ONBOARDING_FAKE) ||
  matchesDemoFlag(process.env.PLAYWRIGHT_DEMO_MODE)

export const GET = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const limit = Number(request.nextUrl.searchParams.get('limit') ?? 10)

    if (isDemoEnvironment()) {
      const demoEvents = listDemoWebhookEvents(session.user.orgId ?? 'demo-org')
      return NextResponse.json({ success: true, data: demoEvents.slice(0, limit) })
    }

    const supabase = getSupabaseServiceRoleClient()
    const { data, error } = await supabase
      .from('webhook_events')
      .select('*')
      .eq('org_id', session.user.orgId)
      .eq('provider', 'kommo')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch (error) {
    console.error('Failed to load webhook events', error)
    return NextResponse.json(
      { success: false, error: 'Не удалось загрузить события webhook' },
      { status: 500 },
    )
  }
}
