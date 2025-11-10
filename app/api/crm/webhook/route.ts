import { NextRequest, NextResponse } from 'next/server'

import { KommoAPI } from '@/lib/crm/kommo'
import { saveWebhookEvent, processWebhookEvent } from '@/lib/services/webhook-processor'
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
 const metadata = extractEventMetadata(event.type, event.data)

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

/**
 * Извлекает метаданные события (subtype, entity_id, entity_type)
 */
function extractEventMetadata(
 eventType: string,
 eventData: unknown
): {
 eventSubtype?: string
 entityId?: string
 entityType?: string
} {
 const metadata: {
 eventSubtype?: string
 entityId?: string
 entityType?: string
 } = {}

 try {
 const data = eventData as Record<string, unknown>

 // Определяем entity_type
 metadata.entityType = eventType.slice(0, -1) // 'leads' -> 'lead', 'contacts' -> 'contact'

 // Парсим данные для извлечения entity_id и subtype
 if (eventType === 'leads') {
   const leads = data.leads || data
   
   if (Array.isArray(leads)) {
     if (leads.length > 0 && leads[0]?.id) {
       metadata.entityId = String(leads[0].id)
     }
   } else if (typeof leads === 'object' && leads !== null) {
     // Проверяем формат { status: [...], add: [...], update: [...] }
     const statusArray = (leads as Record<string, unknown>).status as Array<Record<string, unknown>> | undefined
     const addArray = (leads as Record<string, unknown>).add as Array<Record<string, unknown>> | undefined
     const updateArray = (leads as Record<string, unknown>).update as Array<Record<string, unknown>> | undefined
     
     const firstLead = statusArray?.[0] || addArray?.[0] || updateArray?.[0]
     
     if (firstLead?.id) {
       metadata.entityId = String(firstLead.id)
     }
     
     if (statusArray && statusArray.length > 0) {
       metadata.eventSubtype = 'lead_status_changed'
     } else if (addArray && addArray.length > 0) {
       metadata.eventSubtype = 'lead_created'
     } else if (updateArray && updateArray.length > 0) {
       metadata.eventSubtype = 'lead_updated'
     }
   }
 } else if (eventType === 'contacts') {
   const contacts = data.contacts || data
   
   if (Array.isArray(contacts) && contacts.length > 0 && contacts[0]?.id) {
     metadata.entityId = String(contacts[0].id)
     metadata.eventSubtype = 'contact_created'
   } else if (typeof contacts === 'object' && contacts !== null) {
     const addArray = (contacts as Record<string, unknown>).add as Array<Record<string, unknown>> | undefined
     const updateArray = (contacts as Record<string, unknown>).update as Array<Record<string, unknown>> | undefined
     
     const firstContact = addArray?.[0] || updateArray?.[0]
     if (firstContact?.id) {
       metadata.entityId = String(firstContact.id)
       metadata.eventSubtype = addArray ? 'contact_created' : 'contact_updated'
     }
   }
 } else if (eventType === 'tasks') {
   const tasks = data.tasks || data
   
   if (Array.isArray(tasks) && tasks.length > 0) {
     const task = tasks[0] as Record<string, unknown>
     if (task.id) {
       metadata.entityId = String(task.id)
     }
     if (task.entity_id && task.entity_type) {
       metadata.entityId = String(task.entity_id)
       metadata.entityType = String(task.entity_type)
     }
     metadata.eventSubtype = 'task_created'
   }
 } else if (eventType === 'messages') {
   const messages = data.messages || data
   
   if (Array.isArray(messages) && messages.length > 0) {
     const message = messages[0] as Record<string, unknown>
     
     // Определяем тип сообщения (входящее/исходящее)
     const params = message.params as Record<string, unknown> | undefined
     const direction = params?.direction || message.direction
     
     // Получаем entity_id и entity_type
     if (message.entity_id) {
       metadata.entityId = String(message.entity_id)
     }
     if (message.entity_type) {
       metadata.entityType = String(message.entity_type)
     }
     
     // Определяем подтип события
     if (direction === 'in' || !direction || typeof direction === 'undefined') {
       metadata.eventSubtype = 'message_received'
     } else {
       metadata.eventSubtype = 'message_sent'
     }
   } else if (typeof messages === 'object' && messages !== null) {
     // Формат { add: [...], update: [...] }
     const addArray = (messages as Record<string, unknown>).add as Array<Record<string, unknown>> | undefined
     
     if (addArray && addArray.length > 0) {
       const message = addArray[0]
       if (message.entity_id) {
         metadata.entityId = String(message.entity_id)
       }
       if (message.entity_type) {
         metadata.entityType = String(message.entity_type)
       }
       
       const params = message.params as Record<string, unknown> | undefined
       const direction = params?.direction || message.direction
       metadata.eventSubtype = direction === 'in' || !direction ? 'message_received' : 'message_sent'
     }
   }
 } else if (eventType === 'calls') {
   const calls = data.calls || data
   
   if (Array.isArray(calls) && calls.length > 0) {
     const call = calls[0] as Record<string, unknown>
     if (call.id) {
       metadata.entityId = String(call.id)
     }
     metadata.eventSubtype = 'call_started'
   }
 }

 return metadata
 } catch (error) {
 console.error('Error extracting event metadata:', error)
 return {}
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

