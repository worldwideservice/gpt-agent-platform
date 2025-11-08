import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { createErrorResponse } from '@/lib/utils/error-handler'
import { logger } from '@/lib/utils/logger'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
const querySchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'retrying']).optional(),
  event_type: z.string().optional(),
  search: z.string().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
})

/**
 * GET /api/webhooks/events - Получение истории webhook событий
 */
export const GET = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    const { response, status } = createErrorResponse(
      new Error('Unauthorized'),
      { code: 'AUTHENTICATION_ERROR', logToSentry: false }
    )
    return NextResponse.json(response, { status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const parsed = querySchema.safeParse({
      status: searchParams.get('status') || undefined,
      event_type: searchParams.get('event_type') || undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    })

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => issue.message)
      const { response, status } = createErrorResponse(
        new Error('Validation failed'),
        {
          code: 'VALIDATION_ERROR',
          details: issues,
          logToSentry: false,
        }
      )
      return NextResponse.json(response, { status })
    }

    const supabase = getSupabaseServiceRoleClient()
    const limit = Number.parseInt(parsed.data.limit || '50', 10)
    const offset = Number.parseInt(parsed.data.offset || '0', 10)

    let query = supabase
      .from('webhook_events')
      .select('*', { count: 'exact' })
      .eq('org_id', session.user.orgId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Фильтры
    if (parsed.data.status) {
      query = query.eq('status', parsed.data.status)
    }

    if (parsed.data.event_type) {
      query = query.eq('event_type', parsed.data.event_type)
    }

    if (parsed.data.search) {
      query = query.or(
        `event_type.ilike.%${parsed.data.search}%,event_subtype.ilike.%${parsed.data.search}%,entity_id.ilike.%${parsed.data.search}%`
      )
    }

    const { data, error, count } = await query

    if (error) {
      logger.error('Failed to fetch webhook events', error, {
        endpoint: '/api/webhooks/events',
        method: 'GET',
      })
      const { response, status } = createErrorResponse(
        new Error('Не удалось загрузить события'),
        { code: 'WEBHOOKS_FETCH_ERROR', logToSentry: true }
      )
      return NextResponse.json(response, { status })
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: count || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const { response, status } = createErrorResponse(error, {
      code: 'WEBHOOKS_FETCH_ERROR',
      logToSentry: true,
    })
    return NextResponse.json(response, { status })
  }
}


























