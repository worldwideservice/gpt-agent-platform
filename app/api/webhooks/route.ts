/**
 * API для получения истории webhook событий
 * GET /api/webhooks - список событий с фильтрацией и пагинацией
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const querySchema = z.object({
 page: z.coerce.number().int().min(1).default(1),
 limit: z.coerce.number().int().min(1).max(100).default(20),
 status: z.enum(['pending', 'processing', 'completed', 'failed', 'retrying']).optional(),
 event_type: z.string().optional(),
 entity_type: z.string().optional(),
 start_date: z.string().datetime().optional(),
 end_date: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
 try {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json(
 { success: false, error: 'Не авторизовано' },
 { status: 401 }
 )
 }

 const { searchParams } = new URL(request.url)
 const parsed = querySchema.safeParse(Object.fromEntries(searchParams))

 if (!parsed.success) {
 return NextResponse.json(
 {
 success: false,
 error: 'Некорректные параметры запроса',
 details: parsed.error.issues,
 },
 { status: 400 }
 )
 }

 const { page, limit, status, event_type, entity_type, start_date, end_date } = parsed.data
 const orgId = session.user.orgId
 const offset = (page - 1) * limit

 const supabase = getSupabaseServiceRoleClient()

 // Строим запрос
 let query = supabase
 .from('webhook_events')
 .select('*', { count: 'exact' })
 .eq('org_id', orgId)
 .order('created_at', { ascending: false })

 // Применяем фильтры
 if (status) {
 query = query.eq('status', status)
 }

 if (event_type) {
 query = query.eq('event_type', event_type)
 }

 if (entity_type) {
 query = query.eq('entity_type', entity_type)
 }

 if (start_date) {
 query = query.gte('created_at', start_date)
 }

 if (end_date) {
 query = query.lte('created_at', end_date)
 }

 // Применяем пагинацию
 query = query.range(offset, offset + limit - 1)

 const { data: events, error, count } = await query

 if (error) {
 console.error('Error fetching webhook events:', error)
 return NextResponse.json(
 { success: false, error: 'Не удалось получить события' },
 { status: 500 }
 )
 }

 // Форматируем ответ
 const formattedEvents = (events || []).map(event => ({
 id: event.id,
 eventType: event.event_type,
 eventSubtype: event.event_subtype,
 entityType: event.entity_type,
 entityId: event.entity_id,
 status: event.status,
 retryCount: event.retry_count,
 maxRetries: event.max_retries,
 error: event.error,
 createdAt: event.created_at,
 processedAt: event.processed_at,
 nextRetryAt: event.next_retry_at,
 // Не включаем полный payload для экономии трафика, можно добавить отдельный endpoint для деталей
 payloadPreview: event.payload ? Object.keys(event.payload as Record<string, unknown>).slice(0, 3) : [],
 }))

 return NextResponse.json({
 success: true,
 data: formattedEvents,
 pagination: {
 page,
 limit,
 total: count || 0,
 totalPages: Math.ceil((count || 0) / limit),
 },
 })
 } catch (error) {
 console.error('Webhooks API error:', error)
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 }
 )
 }
}

