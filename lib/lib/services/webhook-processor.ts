/**
 * Сервис для обработки webhook событий от Kommo
 * Обеспечивает полную обработку всех типов событий, retry механизм и интеграцию с Rule Engine
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { executeRules, type RuleExecutionContext } from './rule-engine'
import { addJobToQueue } from '@/lib/queue'
import { getCrmConnectionData } from '@/lib/repositories/crm-connection'
import { KommoAPI } from '@/lib/crm/kommo'

export interface WebhookEvent {
  id: string
  org_id: string
  provider: string
  event_type: string
  event_subtype?: string | null
  entity_id?: string | null
  entity_type?: string | null
  payload: Record<string, unknown>
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retrying'
  retry_count: number
  max_retries: number
  next_retry_at?: string | null
  error?: string | null
  execution_context?: Record<string, unknown>
}

export type WebhookEventType = 'leads' | 'contacts' | 'customers' | 'tasks' | 'messages' | 'calls' | 'companies'
export type WebhookEventSubtype = 
  | 'lead_created' | 'lead_updated' | 'lead_status_changed' | 'lead_deleted'
  | 'contact_created' | 'contact_updated' | 'contact_deleted'
  | 'task_created' | 'task_completed' | 'task_updated' | 'task_deleted'
  | 'message_sent' | 'message_received' | 'message_read'
  | 'call_started' | 'call_ended' | 'call_missed'
  | 'company_created' | 'company_updated'

/**
 * Сохраняет webhook событие в БД
 */
export const saveWebhookEvent = async (
  orgId: string,
  provider: string,
  eventType: string,
  payload: Record<string, unknown>,
  metadata?: {
    eventSubtype?: string
    entityId?: string
    entityType?: string
  }
): Promise<string> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('webhook_events')
    .insert({
      org_id: orgId,
      provider,
      event_type: eventType,
      event_subtype: metadata?.eventSubtype || null,
      entity_id: metadata?.entityId || null,
      entity_type: metadata?.entityType || null,
      payload,
      status: 'pending',
      retry_count: 0,
      max_retries: 3,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to save webhook event: ${error.message}`)
  }

  return data.id
}

/**
 * Обрабатывает webhook событие
 */
export const processWebhookEvent = async (eventId: string): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()

  // Получаем событие
  const { data: event, error: fetchError } = await supabase
    .from('webhook_events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (fetchError || !event) {
    console.error(`Failed to fetch webhook event ${eventId}:`, fetchError)
    return false
  }

  // Проверяем, не обрабатывается ли уже
  if (event.status === 'processing') {
    console.log(`Webhook event ${eventId} is already being processed`)
    return false
  }

  // Помечаем как processing
  await supabase
    .from('webhook_events')
    .update({
      status: 'processing',
      processing_started_at: new Date().toISOString(),
    })
    .eq('id', eventId)

  try {
    // Определяем тип события и обрабатываем
    const eventType = event.event_type as WebhookEventType
    const eventSubtype = event.event_subtype as WebhookEventSubtype | null

    let success = false

    switch (eventType) {
      case 'leads':
        success = await handleLeadEvent(event.org_id, event.payload, eventSubtype)
        break
      case 'contacts':
        success = await handleContactEvent(event.org_id, event.payload, eventSubtype)
        break
      case 'tasks':
        success = await handleTaskEvent(event.org_id, event.payload, eventSubtype)
        break
      case 'messages':
        success = await handleMessageEvent(event.org_id, event.payload, eventSubtype)
        break
      case 'calls':
        success = await handleCallEvent(event.org_id, event.payload, eventSubtype)
        break
      case 'customers':
        success = await handleCustomerEvent(event.org_id, event.payload, eventSubtype)
        break
      default:
        console.warn(`Unknown webhook event type: ${eventType}`)
        success = false
    }

    // Запускаем Rule Engine если событие обработано успешно
    if (success && event.entity_type && event.entity_id) {
      await triggerRuleEngine(event.org_id, eventType, eventSubtype, {
        entityId: event.entity_id,
        entityType: event.entity_type,
        payload: event.payload,
      })
    }

    // Помечаем как completed
    await supabase
      .from('webhook_events')
      .update({
        status: 'completed',
        processed_at: new Date().toISOString(),
      })
      .eq('id', eventId)

    return true
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Увеличиваем счетчик retry
    const newRetryCount = (event.retry_count || 0) + 1
    const shouldRetry = newRetryCount < (event.max_retries || 3)

    // Вычисляем время следующего retry (экспоненциальная задержка)
    const delayMinutes = Math.min(5 * Math.pow(2, newRetryCount - 1), 60) // 5, 10, 20, 40, 60 минут
    const nextRetryAt = shouldRetry
      ? new Date(Date.now() + delayMinutes * 60 * 1000).toISOString()
      : null

    await supabase
      .from('webhook_events')
      .update({
        status: shouldRetry ? 'retrying' : 'failed',
        retry_count: newRetryCount,
        error: errorMessage,
        next_retry_at: nextRetryAt,
      })
      .eq('id', eventId)

    if (shouldRetry) {
      // Добавляем задачу для retry
      await addJobToQueue('webhook:retry', {
        eventId,
        retryCount: newRetryCount,
      })
    }

    console.error(`Failed to process webhook event ${eventId}:`, error)
    return false
  }
}

/**
 * Обработка событий сделок (leads)
 */
async function handleLeadEvent(
  orgId: string,
  payload: Record<string, unknown>,
  eventSubtype?: string | null
): Promise<boolean> {
  try {
    // Парсим данные события
    const leadData = payload.leads || payload

    if (!leadData || typeof leadData !== 'object') {
      return false
    }

    // Определяем тип события
    let leads: Array<Record<string, unknown>> = []

    if ('status' in leadData && Array.isArray(leadData.status)) {
      leads = leadData.status as Array<Record<string, unknown>>
    } else if ('add' in leadData && Array.isArray(leadData.add)) {
      leads = leadData.add as Array<Record<string, unknown>>
    } else if ('update' in leadData && Array.isArray(leadData.update)) {
      leads = leadData.update as Array<Record<string, unknown>>
    } else if (Array.isArray(leadData)) {
      leads = leadData
    }

    if (leads.length === 0) {
      return false
    }

    // Обрабатываем каждую сделку
    for (const lead of leads) {
      const leadId = String(lead.id || '')
      const pipelineId = lead.pipeline_id ? String(lead.pipeline_id) : null
      const statusId = lead.status_id ? String(lead.status_id) : null

      if (!leadId) continue

      // Здесь можно добавить синхронизацию с локальной БД
      // Обновление данных сделки, создание/обновление записей и т.д.

      console.log(`Lead event processed: ${leadId}, pipeline: ${pipelineId}, status: ${statusId}`)
    }

    return true
  } catch (error) {
    console.error('Error handling lead event:', error)
    return false
  }
}

/**
 * Обработка событий контактов (contacts)
 */
async function handleContactEvent(
  orgId: string,
  payload: Record<string, unknown>,
  eventSubtype?: string | null
): Promise<boolean> {
  try {
    const contactData = payload.contacts || payload

    if (!contactData || typeof contactData !== 'object') {
      return false
    }

    let contacts: Array<Record<string, unknown>> = []

    if ('add' in contactData && Array.isArray(contactData.add)) {
      contacts = contactData.add as Array<Record<string, unknown>>
    } else if ('update' in contactData && Array.isArray(contactData.update)) {
      contacts = contactData.update as Array<Record<string, unknown>>
    } else if (Array.isArray(contactData)) {
      contacts = contactData
    }

    for (const contact of contacts) {
      const contactId = String(contact.id || '')
      if (!contactId) continue

      console.log(`Contact event processed: ${contactId}`)
    }

    return true
  } catch (error) {
    console.error('Error handling contact event:', error)
    return false
  }
}

/**
 * Обработка событий задач (tasks)
 */
async function handleTaskEvent(
  orgId: string,
  payload: Record<string, unknown>,
  eventSubtype?: string | null
): Promise<boolean> {
  try {
    const taskData = payload.tasks || payload

    if (!taskData || typeof taskData !== 'object') {
      return false
    }

    let tasks: Array<Record<string, unknown>> = []

    if ('add' in taskData && Array.isArray(taskData.add)) {
      tasks = taskData.add as Array<Record<string, unknown>>
    } else if ('update' in taskData && Array.isArray(taskData.update)) {
      tasks = taskData.update as Array<Record<string, unknown>>
    } else if (Array.isArray(taskData)) {
      tasks = taskData
    }

    for (const task of tasks) {
      const taskId = String(task.id || '')
      const entityId = String(task.entity_id || '')
      const entityType = String(task.entity_type || '')

      if (!taskId) continue

      console.log(`Task event processed: ${taskId}, entity: ${entityType}:${entityId}`)
    }

    return true
  } catch (error) {
    console.error('Error handling task event:', error)
    return false
  }
}

/**
 * Обработка событий сообщений (messages) - входящие email
 */
async function handleMessageEvent(
  orgId: string,
  payload: Record<string, unknown>,
  eventSubtype?: string | null
): Promise<boolean> {
  try {
    const messageData = payload.messages || payload

    if (!messageData || typeof messageData !== 'object') {
      return false
    }

    let messages: Array<Record<string, unknown>> = []

    if ('add' in messageData && Array.isArray(messageData.add)) {
      messages = messageData.add as Array<Record<string, unknown>>
    } else if (Array.isArray(messageData)) {
      messages = messageData
    }

    // Обрабатываем только входящие сообщения (message_received)
    if (eventSubtype !== 'message_received') {
      return true // Игнорируем исходящие, но не считаем ошибкой
    }

    for (const message of messages) {
      const messageId = String(message.id || '')
      const entityId = String(message.entity_id || '')
      const entityType = String(message.entity_type || '')

      if (!messageId || entityType !== 'leads') {
        continue // Обрабатываем только сообщения в сделках
      }

      // Извлекаем данные письма из payload
      const emailParams = message.params as Record<string, unknown> | undefined
      
      if (!emailParams) {
        console.warn(`Message ${messageId}: No params found`)
        continue
      }

      const from = String(emailParams.from || '')
      const to = String(emailParams.to || '')
      const subject = String(emailParams.subject || 'Без темы')
      const text = String(emailParams.text || emailParams.html || '')

      if (!from || !text) {
        console.warn(`Message ${messageId}: Missing email data (from or text)`)
        continue
      }

      console.log(`Processing incoming email in lead ${entityId} from ${from}`)

      // Обрабатываем email через агента (асинхронно, не блокируем обработку)
      handleIncomingEmailForAgentAsync(orgId, {
        leadId: entityId,
        from,
        to,
        subject,
        body: text,
        messageId,
        timestamp: message.created_at ? String(message.created_at) : undefined,
      }).catch(error => {
        console.error(`Failed to handle email in lead ${entityId}:`, error)
        // Не выбрасываем ошибку, чтобы не помечать событие как failed
      })
    }

    return true
  } catch (error) {
    console.error('Error handling message event:', error)
    return false
  }
}

/**
 * Асинхронная обработка email через агента (не блокирует webhook)
 */
async function handleIncomingEmailForAgentAsync(
  orgId: string,
  emailData: {
    leadId: string
    from: string
    to: string
    subject: string
    body: string
    messageId?: string
    timestamp?: string
  }
): Promise<void> {
  try {
    const { handleIncomingEmailForAgent } = await import('./agent-email-handler')
    const result = await handleIncomingEmailForAgent(orgId, emailData)

    if (result.success) {
      console.log(`Agent ${result.agentId} successfully responded to email in lead ${emailData.leadId}`)
    } else {
      console.warn(`Failed to handle email in lead ${emailData.leadId}: ${result.error}`)
    }
  } catch (error) {
    console.error('Error in async email handler:', error)
    throw error
  }
}

/**
 * Обработка событий звонков (calls)
 */
async function handleCallEvent(
  orgId: string,
  payload: Record<string, unknown>,
  eventSubtype?: string | null
): Promise<boolean> {
  try {
    const callData = payload.calls || payload

    if (!callData || typeof callData !== 'object') {
      return false
    }

    let calls: Array<Record<string, unknown>> = []

    if ('add' in callData && Array.isArray(callData.add)) {
      calls = callData.add as Array<Record<string, unknown>>
    } else if (Array.isArray(callData)) {
      calls = callData
    }

    for (const call of calls) {
      const callId = String(call.id || '')
      const entityId = String(call.entity_id || '')
      const entityType = String(call.entity_type || '')

      if (!callId) continue

      console.log(`Call event processed: ${callId}, entity: ${entityType}:${entityId}`)
    }

    return true
  } catch (error) {
    console.error('Error handling call event:', error)
    return false
  }
}

/**
 * Обработка событий покупателей (customers)
 */
async function handleCustomerEvent(
  orgId: string,
  payload: Record<string, unknown>,
  eventSubtype?: string | null
): Promise<boolean> {
  try {
    const customerData = payload.customers || payload

    if (!customerData || typeof customerData !== 'object') {
      return false
    }

    // Обработка событий покупателей
    console.log('Customer event processed:', customerData)

    return true
  } catch (error) {
    console.error('Error handling customer event:', error)
    return false
  }
}

/**
 * Запускает Rule Engine для события
 */
async function triggerRuleEngine(
  orgId: string,
  eventType: string,
  eventSubtype: string | null | undefined,
  context: {
    entityId: string
    entityType: string
    payload: Record<string, unknown>
  }
): Promise<void> {
  try {
    // Маппинг типов событий на trigger types Rule Engine
    const triggerTypeMap: Record<string, 'lead_created' | 'lead_updated' | 'message_received' | 'stage_changed'> = {
      'lead_created': 'lead_created',
      'lead_updated': 'lead_updated',
      'lead_status_changed': 'stage_changed',
      'message_sent': 'message_received',
      'message_received': 'message_received',
    }

    const triggerType = triggerTypeMap[eventSubtype || ''] || 'lead_updated'

    // Создаем контекст для Rule Engine
    const ruleContext: RuleExecutionContext = {
      organizationId: orgId,
      triggerType,
      leadId: context.entityType === 'lead' ? context.entityId : undefined,
      triggerData: context.payload,
    }

    // Запускаем Rule Engine
    const results = await executeRules(ruleContext)

    if (results.length > 0) {
      console.log(`Rule Engine executed ${results.length} rules for event ${eventType}:${eventSubtype}`)
    }
  } catch (error) {
    console.error('Error triggering Rule Engine:', error)
    // Не выбрасываем ошибку, чтобы не прервать обработку webhook
  }
}

/**
 * Получает события, готовые для retry
 */
export const getEventsForRetry = async (limit = 10): Promise<WebhookEvent[]> => {
  const supabase = getSupabaseServiceRoleClient()

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('webhook_events')
    .select('*')
    .in('status', ['retrying', 'failed'])
    .lt('retry_count', 5) // максимальное количество попыток
    .lte('next_retry_at', now)
    .order('next_retry_at', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching events for retry:', error)
    return []
  }

  return (data || []) as WebhookEvent[]
}

