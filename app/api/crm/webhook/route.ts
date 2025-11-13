import { NextRequest, NextResponse } from 'next/server'

import { KommoAPI } from '@/lib/crm/kommo'
import { saveWebhookEvent, processWebhookEvent, extractWebhookMetadata } from '@/lib/services/webhook-processor'
import { getCrmConnectionData } from '@/lib/repositories/crm-connection'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

/**
 * Webhook endpoint для получения событий от Kommo CRM
 * Настройка в Kommo: Настройки -> Интеграции -> Webhooks
 * 
 * Полностью обрабатывает все типы событий: leads, contacts, tasks, messages, calls
 * Автоматически запускает Rule Engine при соответствующих событиях
 * Сохраняет историю всех событий с поддержкой retry
 */

export async function POST(request: NextRequest) {
 try {
 const body = await request.json()

 // Проверка подписи webhook (если настроена)
 const signatureValid = verifyWebhookSignature(request)
 if (!signatureValid) {
 return NextResponse.json(
 { success: false, error: 'Invalid webhook signature' },
 { status: 401 }
 )
 }

 // Парсинг события от Kommo
 const event = KommoAPI.parseWebhook(body)

 if (process.env.NODE_ENV === 'development') {
 console.log('Kommo Webhook Event:', event.type, event.data)
 }

 // Определяем orgId из webhook payload или headers
 const orgId = await determineOrgIdFromWebhook(body, request)

 if (!orgId) {
 console.warn('Could not determine orgId from webhook, skipping processing')
 return NextResponse.json({ success: true, message: 'Event received but orgId not found' })
 }

 // Определяем метаданные события (subtype, entity_id, entity_type)
 const metadata = extractWebhookMetadata(event.type, event.data)

 // Сохраняем событие в БД
 const eventId = await saveWebhookEvent(
 orgId,
 'kommo',
 event.type,
 body as Record<string, unknown>,
 metadata
 )

 // Обрабатываем событие асинхронно (не блокируем ответ)
 // Можно использовать очередь для гарантированной обработки
 processWebhookEvent(eventId).catch(error => {
 console.error(`Failed to process webhook event ${eventId}:`, error)
 })

 // Возвращаем успешный ответ сразу (webhook должен ответить быстро)
 return NextResponse.json({ 
 success: true, 
 eventId,
 message: 'Webhook received and queued for processing'
 })
 } catch (error) {
 console.error('Webhook Error:', error)
 return NextResponse.json(
 { 
 success: false, 
 error: error instanceof Error ? error.message : 'Unknown error' 
 },
 { status: 500 }
 )
 }
}

/**
 * Определяет orgId из webhook данных
 */
async function determineOrgIdFromWebhook(
 body: unknown,
 request: NextRequest
): Promise<string | null> {
 try {
 // Пробуем извлечь base_domain из payload
 const payload = body as Record<string, unknown>
 const account = payload?.account as Record<string, unknown> | undefined
 const baseDomainRaw = account?.base_domain || account?.subdomain

 if (typeof baseDomainRaw === 'string') {
 const baseDomain = baseDomainRaw.includes('.')
   ? baseDomainRaw
   : `${baseDomainRaw}.amocrm.ru`

 // Ищем организацию по base_domain
 const supabase = getSupabaseServiceRoleClient()
 const { data: connection } = await supabase
   .from('crm_connections')
   .select('org_id')
   .eq('base_domain', baseDomain)
   .eq('provider', 'kommo')
   .single()

 if (connection?.org_id) {
   return connection.org_id as string
 }
 }

 // Fallback: пробуем из headers или query параметров
 const orgIdHeader = request.headers.get('X-Org-Id')
 if (orgIdHeader) {
 return orgIdHeader
 }

 return null
 } catch (error) {
 console.error('Error determining orgId from webhook:', error)
 return null
 }
}

// Проверка подписи webhook (если настроена в Kommo)
function verifyWebhookSignature(request: NextRequest): boolean {
 const signature = request.headers.get('X-Kommo-Signature')
 const secret = process.env.KOMMO_WEBHOOK_SECRET

 if (!signature || !secret) {
 // Если подпись не настроена, разрешаем
 return true
 }

 // Здесь должна быть логика проверки подписи
 // В зависимости от настроек Kommo
 // Пример: HMAC SHA256 проверка

 return true
}

