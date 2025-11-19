// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { requeueDemoWebhookEvent } from '@/lib/demo/webhook-events'

const DEMO_FLAG_VALUES = new Set(['1', 'true'])
const matchesDemoFlag = (value?: string) => (value ? DEMO_FLAG_VALUES.has(value.toLowerCase()) : false)
const isDemoEnvironment = () =>
  matchesDemoFlag(process.env.DEMO_MODE) ||
  matchesDemoFlag(process.env.E2E_ONBOARDING_FAKE) ||
  matchesDemoFlag(process.env.PLAYWRIGHT_DEMO_MODE)

export const POST = async (
  request: NextRequest,
  { params }: { params: { eventId: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    if (isDemoEnvironment()) {
      const updated = requeueDemoWebhookEvent(params.eventId)
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Событие не найдено' }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    }

    const supabase = getSupabaseServiceRoleClient()
    const { data: event, error } = await supabase
      .from('webhook_events')
      .select('id, status, retry_count')
      .eq('id', params.eventId)
      .eq('org_id', session.user.orgId)
      .eq('provider', 'kommo')
      .maybeSingle()

    if (error || !event) {
      return NextResponse.json({ success: false, error: 'Событие не найдено' }, { status: 404 })
    }

    const { error: updateError } = await supabase
      .from('webhook_events')
      .update({
        status: 'pending',
        retry_count: (event.retry_count ?? 0) + 1,
        next_retry_at: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
        error: null,
      })
      .eq('id', params.eventId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to requeue webhook event', error)
    return NextResponse.json({ success: false, error: 'Не удалось повторно поставить событие' }, { status: 500 })
  }
}
