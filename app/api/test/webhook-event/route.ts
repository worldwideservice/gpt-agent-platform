// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { randomUUID } from 'crypto'

import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import {
  deleteDemoWebhookEvent,
  saveDemoWebhookEvent,
  type DemoWebhookEvent,
} from '@/lib/demo/webhook-events'

const DEMO_FLAG_VALUES = new Set(['1', 'true'])
const matchesDemoFlag = (value?: string) => (value ? DEMO_FLAG_VALUES.has(value.toLowerCase()) : false)
const isDemoEnvironment = () =>
  matchesDemoFlag(process.env.DEMO_MODE) ||
  matchesDemoFlag(process.env.E2E_ONBOARDING_FAKE) ||
  matchesDemoFlag(process.env.PLAYWRIGHT_DEMO_MODE)

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
    if (isDemoEnvironment()) {
      const event: DemoWebhookEvent = {
        id: randomUUID(),
        org_id: session.user.orgId,
        provider: 'kommo',
        event_type: payload.eventType ?? 'playwright.webhook',
        status: payload.status ?? 'failed',
        payload: payload.payload ?? { source: 'playwright' },
        error: payload.error ?? 'Playwright injected failure',
        created_at: new Date().toISOString(),
      }
      saveDemoWebhookEvent(event)
      return NextResponse.json({ success: true, data: event })
    }
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
    if (isDemoEnvironment()) {
      deleteDemoWebhookEvent(eventId)
      return NextResponse.json({ success: true })
    }
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
