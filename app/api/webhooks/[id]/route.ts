/**
 * API для получения детальной информации о конкретном webhook событии
 * GET /api/webhooks/[id] - детали события включая полный payload
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export async function GET(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json(
 { success: false, error: 'Не авторизовано' },
 { status: 401 }
 )
 }

 const eventId = params.id
 const orgId = session.user.orgId

 const supabase = getSupabaseServiceRoleClient()

 const { data: event, error } = await supabase
 .from('webhook_events')
 .select('*')
 .eq('id', eventId)
 .eq('org_id', orgId)
 .single()

 if (error || !event) {
 return NextResponse.json(
 { success: false, error: 'Событие не найдено' },
 { status: 404 }
 )
 }

 // Возвращаем полную информацию включая payload
 return NextResponse.json({
 success: true,
 data: {
 id: event.id,
 provider: event.provider,
 eventType: event.event_type,
 eventSubtype: event.event_subtype,
 entityType: event.entity_type,
 entityId: event.entity_id,
 status: event.status,
 retryCount: event.retry_count,
 maxRetries: event.max_retries,
 error: event.error,
 payload: event.payload,
 executionContext: event.execution_context,
 createdAt: event.created_at,
 processedAt: event.processed_at,
 processingStartedAt: event.processing_started_at,
 nextRetryAt: event.next_retry_at,
 },
 })
 } catch (error) {
 console.error('Webhook detail API error:', error)
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 }
 )
 }
}

/**
 * POST /api/webhooks/[id]/retry - принудительный retry события
 */
export async function POST(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json(
 { success: false, error: 'Не авторизовано' },
 { status: 401 }
 )
 }

 const eventId = params.id
 const orgId = session.user.orgId

 const supabase = getSupabaseServiceRoleClient()

 // Проверяем существование события и принадлежность к организации
 const { data: event, error: fetchError } = await supabase
 .from('webhook_events')
 .select('*')
 .eq('id', eventId)
 .eq('org_id', orgId)
 .single()

 if (fetchError || !event) {
 return NextResponse.json(
 { success: false, error: 'Событие не найдено' },
 { status: 404 }
 )
 }

 // Проверяем, можно ли повторить
 if (event.status === 'completed') {
 return NextResponse.json(
 { success: false, error: 'Событие уже успешно обработано' },
 { status: 400 }
 )
 }

 if (event.retry_count >= event.max_retries) {
 return NextResponse.json(
 { success: false, error: 'Достигнут лимит попыток обработки' },
 { status: 400 }
 )
 }

 // Сбрасываем статус для повторной обработки
 await supabase
 .from('webhook_events')
 .update({
 status: 'pending',
 next_retry_at: new Date().toISOString(),
 error: null,
 })
 .eq('id', eventId)

 // Импортируем и запускаем обработку
 const { processWebhookEvent } = await import('@/lib/services/webhook-processor')
 await processWebhookEvent(eventId)

 return NextResponse.json({
 success: true,
 message: 'Событие поставлено в очередь для повторной обработки',
 })
 } catch (error) {
 console.error('Webhook retry API error:', error)
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 }
 )
 }
}

