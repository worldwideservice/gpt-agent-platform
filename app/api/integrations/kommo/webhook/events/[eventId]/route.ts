import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export const POST = async (
  request: NextRequest,
  { params }: { params: { eventId: string } },
) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
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
