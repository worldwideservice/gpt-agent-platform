import { randomUUID } from 'crypto'

import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

const ensureE2EMode = () => {
  if (process.env.E2E_ONBOARDING_FAKE !== '1') {
    return NextResponse.json({ success: false, error: 'Available only in E2E mode' }, { status: 403 })
  }
  return null
}

export const POST = async (request: NextRequest) => {
  const blocked = ensureE2EMode()
  if (blocked) {
    return blocked
  }

  const session = await auth()
  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const payload = await request.json().catch(() => ({}))
    const supabase = getSupabaseServiceRoleClient()
    const { data, error } = await supabase
      .from('webhook_events')
      .insert({
        id: randomUUID(),
        org_id: session.user.orgId,
        provider: 'kommo',
        event_type: payload.eventType ?? 'playwright.webhook',
        status: payload.status ?? 'failed',
        payload: payload.payload ?? { source: 'playwright' },
        error: payload.error ?? 'Playwright injected failure',
      })
      .select('*')

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data: (data ?? [])[0] ?? null })
  } catch (error) {
    console.error('Failed to create test webhook event', error)
    return NextResponse.json({ success: false, error: 'Не удалось создать тестовое webhook событие' }, { status: 500 })
  }
}

export const DELETE = async (request: NextRequest) => {
  const blocked = ensureE2EMode()
  if (blocked) {
    return blocked
  }

  const session = await auth()
  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  const eventId = request.nextUrl.searchParams.get('eventId')
  if (!eventId) {
    return NextResponse.json({ success: false, error: 'eventId is required' }, { status: 400 })
  }

  try {
    const supabase = getSupabaseServiceRoleClient()
    const { error } = await supabase
      .from('webhook_events')
      .delete()
      .eq('id', eventId)
      .eq('org_id', session.user.orgId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete test webhook event', error)
    return NextResponse.json({ success: false, error: 'Не удалось удалить webhook событие' }, { status: 500 })
  }
}
