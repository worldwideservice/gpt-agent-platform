import { NextRequest, NextResponse } from 'next/server'

import { KommoAPI } from '@/lib/crm/kommo'
import { saveWebhookEvent, processWebhookEvent, extractWebhookMetadata } from '@/lib/services/webhook-processor'
import { getCrmConnectionData } from '@/lib/repositories/crm-connection'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { rateLimitWebhook } from '@/lib/middleware/rate-limit-api'
import { logger } from '@/lib/utils/logger'

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
 // Apply webhook rate limiting (identify by source if possible)
 const rateLimitResponse = await rateLimitWebhook(request, 'kommo')
 if (rateLimitResponse) return rateLimitResponse

 const body = await request.json()

 // Проверка подписи webhook (если настроена)
 const signatureValid = await verifyWebhookSignature(request, body)
 if (!signatureValid) {
 return NextResponse.json(
 { success: false, error: 'Invalid webhook signature' },
 { status: 401 }
 )
 }

 // Парсинг события от Kommo
 const event = KommoAPI.parseWebhook(body)

 if (process.env.NODE_ENV === 'development') {
 logger.debug('Kommo Webhook Event', { eventType: event.type, data: event.data })
 }

 // Определяем orgId из webhook payload или headers
 const orgId = await determineOrgIdFromWebhook(body, request)

 if (!orgId) {
 logger.warn('Could not determine orgId from webhook, skipping processing')
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
 logger.error(`Failed to process webhook event ${eventId}`, error, { eventId })
 })

 // Возвращаем успешный ответ сразу (webhook должен ответить быстро)
 return NextResponse.json({ 
 success: true, 
 eventId,
 message: 'Webhook received and queued for processing'
 })
 } catch (error) {
 logger.error('Webhook processing error', error)
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

 // ❌ SECURITY FIX: НЕ используем X-Org-Id из headers!
 // Это IDOR уязвимость - клиент контролирует header
 // orgId должен определяться только из базы данных через base_domain

 // Если не смогли определить orgId из base_domain - возвращаем null
 logger.warn('Could not determine orgId from base_domain', { baseDomain: baseDomainRaw })
 return null
 } catch (error) {
 logger.error('Error determining orgId from webhook', error)
 return null
 }
}

// Проверка подписи webhook (если настроена в Kommo)
async function verifyWebhookSignature(request: NextRequest, body: unknown): Promise<boolean> {
 const signature = request.headers.get('X-Kommo-Signature')
 const secret = process.env.KOMMO_WEBHOOK_SECRET

 // В production ОБЯЗАТЕЛЬНО требуем подпись
 if (process.env.NODE_ENV === 'production' && (!signature || !secret)) {
 logger.error('Webhook signature or secret missing in production')
 return false
 }

 // В development разрешаем без подписи
 if (!signature || !secret) {
 return true
 }

 try {
 // Проверяем HMAC SHA256 подпись
 const crypto = await import('crypto')
 const payloadString = typeof body === 'string' ? body : JSON.stringify(body)

 const expectedSignature = crypto
 .createHmac('sha256', secret)
 .update(payloadString)
 .digest('hex')

 // Используем timingSafeEqual для защиты от timing attacks
 return crypto.timingSafeEqual(
 Buffer.from(signature),
 Buffer.from(expectedSignature)
 )
 } catch (error) {
 logger.error('Error verifying webhook signature', error)
 return false
 }
}

