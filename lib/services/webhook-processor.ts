/**
 * Сервис для обработки webhook событий от Kommo
 * Обеспечивает полную обработку всех типов событий, retry механизм и интеграцию с Rule Engine
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { executeRules, type RuleExecutionContext } from './rule-engine'
import { startSequence } from './sequences'
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

    // Запускаем Rule Engine и Sequences если событие обработано успешно
    if (success && event.entity_type && event.entity_id) {
      // Запускаем Rule Engine
      await triggerRuleEngine(event.org_id, eventType, eventSubtype, {
        entityId: event.entity_id,
        entityType: event.entity_type,
        payload: event.payload,
      }).catch((error) => {
        console.error('Failed to trigger Rule Engine:', error)
      })

      // Запускаем Sequences для соответствующих событий
      if (eventSubtype === 'lead_created' || eventSubtype === 'lead_status_changed') {
        await triggerSequences(event.org_id, eventType, eventSubtype, {
          entityId: event.entity_id,
          entityType: event.entity_type,
          payload: event.payload,
        }).catch((error) => {
          console.error('Failed to trigger Sequences:', error)
        })
      }
    }

    // Логируем обработку webhook события (асинхронно)
    if (success) {
      try {
        const { logActivity } = await import('./activity-logger')
        const activityType = eventSubtype === 'lead_created' ? 'lead_created' 
          : eventSubtype === 'lead_updated' ? 'lead_updated'
          : eventSubtype === 'task_created' ? 'task_created'
          : eventSubtype === 'task_completed' ? 'task_completed'
          : 'action_executed'
        
        // Используем функцию logActivity
        await logActivity({
          orgId: event.org_id,
          activityType: activityType as any,
          title: `Webhook событие: ${eventType}`,
          description: `Обработано событие ${eventType}${eventSubtype ? ` (${eventSubtype})` : ''}`,
          metadata: { event_type: eventType, event_subtype: eventSubtype, entity_id: event.entity_id },
        }).catch((error: unknown) => {
          console.error('Failed to log webhook activity:', error)
        })
      } catch (error) {
        // Не критично, если не удалось залогировать
        console.error('Failed to import logActivity:', error)
      }
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

    const supabase = getSupabaseServiceRoleClient()

    for (const task of tasks) {
      const taskId = String(task.id || '')
      const entityId = String(task.entity_id || '')
      const entityType = String(task.entity_type || '')
      const taskText = String(task.text || task.name || 'Задача')
      const taskTypeId = task.task_type_id ? Number(task.task_type_id) : null
      const completeTill = task.complete_till ? Number(task.complete_till) : null
      const responsibleUserId = task.responsible_user_id ? Number(task.responsible_user_id) : null
      const isCompleted = task.is_completed === true || task.result === true

      if (!taskId) continue

      // Сохраняем информацию о задаче в БД (если есть таблица crm_tasks)
      try {
        const { error: taskError } = await supabase
          .from('crm_tasks')
          .upsert({
            org_id: orgId,
            task_id: taskId,
            entity_id: entityId,
            entity_type: entityType,
            task_text: taskText,
            task_type_id: taskTypeId,
            complete_till: completeTill ? new Date(completeTill * 1000).toISOString() : null,
            responsible_user_id: responsibleUserId,
            is_completed: isCompleted,
            metadata: task,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'org_id,task_id',
          })

        if (taskError && taskError.code !== '42P01') { // 42P01 = table doesn't exist
          console.error(`Error saving task ${taskId}:`, taskError)
        }
      } catch (tableError) {
        // Таблица может не существовать - это не критично
        if (process.env.NODE_ENV === 'development') {
          console.log(`Table crm_tasks may not exist, skipping save for task ${taskId}`)
        }
      }

      // Если задача связана со сделкой (lead), создаем заметку в conversation
      if (entityType === 'leads' && entityId) {
        try {
          const { data: conversations } = await supabase
            .from('conversations')
            .select('id')
            .eq('org_id', orgId)
            .eq('lead_id', Number(entityId))
            .limit(1)

          if (conversations && conversations.length > 0) {
            const conversationId = conversations[0].id

            // Создаем системное сообщение о задаче
            await supabase
              .from('conversation_messages')
              .insert({
                conversation_id: conversationId,
                role: 'system',
                content: isCompleted 
                  ? `✅ Задача выполнена: ${taskText}`
                  : `📋 Создана задача: ${taskText}${completeTill ? ` (до ${new Date(completeTill * 1000).toLocaleString('ru-RU')})` : ''}`,
                metadata: {
                  task_id: taskId,
                  task_type: 'crm_task',
                  event: isCompleted ? 'task_completed' : 'task_created',
                },
              })
          }
        } catch (conversationError) {
          // Не критично, если не удалось создать заметку
          console.error(`Error creating conversation note for task ${taskId}:`, conversationError)
        }
      }

      console.log(`Task event processed: ${taskId}, entity: ${entityType}:${entityId}, completed: ${isCompleted}`)
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

    const supabase = getSupabaseServiceRoleClient()

    for (const call of calls) {
      const callId = String(call.id || '')
      const entityId = String(call.entity_id || '')
      const entityType = String(call.entity_type || '')
      const callDirection = String(call.direction || 'outbound')
      const callStatus = String(call.status || 'unknown')
      const callDuration = call.duration ? Number(call.duration) : null
      const callSource = call.source || null
      const callUniq = String(call.uniq || '')
      const callCreatedAt = call.created_at ? Number(call.created_at) : Date.now() / 1000

      if (!callId) continue

      // Сохраняем информацию о звонке в БД (если есть таблица crm_calls)
      try {
        const { error: callError } = await supabase
          .from('crm_calls')
          .upsert({
            org_id: orgId,
            call_id: callId,
            entity_id: entityId,
            entity_type: entityType,
            direction: callDirection,
            status: callStatus,
            duration: callDuration,
            source: callSource,
            uniq: callUniq,
            metadata: call,
            created_at: new Date(callCreatedAt * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'org_id,call_id',
          })

        if (callError && callError.code !== '42P01') { // 42P01 = table doesn't exist
          console.error(`Error saving call ${callId}:`, callError)
        }
      } catch (tableError) {
        // Таблица может не существовать - это не критично
        if (process.env.NODE_ENV === 'development') {
          console.log(`Table crm_calls may not exist, skipping save for call ${callId}`)
        }
      }

      // Если звонок связан со сделкой (lead), создаем заметку в conversation
      if (entityType === 'leads' && entityId && callStatus === 'success') {
        try {
          const { data: conversations } = await supabase
            .from('conversations')
            .select('id')
            .eq('org_id', orgId)
            .eq('lead_id', Number(entityId))
            .limit(1)

          if (conversations && conversations.length > 0) {
            const conversationId = conversations[0].id

            // Формируем текст заметки о звонке
            const callNote = callDirection === 'inbound'
              ? `📞 Входящий звонок${callDuration ? ` (${Math.round(callDuration)} сек)` : ''}`
              : `📞 Исходящий звонок${callDuration ? ` (${Math.round(callDuration)} сек)` : ''}`

            // Создаем системное сообщение о звонке
            await supabase
              .from('conversation_messages')
              .insert({
                conversation_id: conversationId,
                role: 'system',
                content: callNote,
                metadata: {
                  call_id: callId,
                  call_type: 'crm_call',
                  direction: callDirection,
                  duration: callDuration,
                  event: 'call_completed',
                },
              })

            // Если звонок пропущен (missed), можно создать задачу на перезвон
            if (callStatus && callStatus !== 'success' && callStatus !== 'completed' && callDirection === 'inbound') {
              // Запускаем создание задачи через очередь (не блокируем обработку)
              const { addJobToQueue } = await import('@/lib/queue')
              await addJobToQueue('kommo:create-task', {
                orgId,
                leadId: Number(entityId),
                taskData: {
                  text: 'Перезвонить клиенту',
                  complete_till: Math.floor(Date.now() / 1000) + 3600, // через час
                  task_type_id: 1, // звонок
                },
              }).catch(error => {
                console.error(`Failed to create callback task for missed call ${callId}:`, error)
              })
            }
          }
        } catch (conversationError) {
          // Не критично, если не удалось создать заметку
          console.error(`Error creating conversation note for call ${callId}:`, conversationError)
        }
      }

      console.log(`Call event processed: ${callId}, entity: ${entityType}:${entityId}, status: ${callStatus}, duration: ${callDuration}`)
    }

    return true
  } catch (error) {
    console.error('Error handling call event:', error)
    return false
  }
}

/**
 * Обработка событий компаний (companies)
 */
async function handleCompanyEvent(
  orgId: string,
  payload: Record<string, unknown>,
  eventSubtype?: string | null
): Promise<boolean> {
  try {
    const companyData = payload.companies || payload

    if (!companyData || typeof companyData !== 'object') {
      return false
    }

    let companies: Array<Record<string, unknown>> = []

    if ('add' in companyData && Array.isArray(companyData.add)) {
      companies = companyData.add as Array<Record<string, unknown>>
    } else if ('update' in companyData && Array.isArray(companyData.update)) {
      companies = companyData.update as Array<Record<string, unknown>>
    } else if (Array.isArray(companyData)) {
      companies = companyData
    }

    for (const company of companies) {
      const companyId = String(company.id || '')
      if (!companyId) continue

      console.log(`Company event processed: ${companyId}, subtype: ${eventSubtype}`)
    }

    return true
  } catch (error) {
    console.error('Error handling company event:', error)
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
 * Запускает Sequences для события
 */
async function triggerSequences(
  orgId: string,
  eventType: string,
  eventSubtype: string | null,
  context: {
    entityId: string
    entityType: string
    payload: Record<string, unknown>
  }
): Promise<boolean> {
  try {
    const supabase = getSupabaseServiceRoleClient()

    // Получаем активные последовательности для организации
    const { data: sequences, error } = await supabase
      .from('sequences')
      .select('*')
      .eq('org_id', orgId)
      .eq('is_active', true)
      .in('trigger_type', ['lead_created', 'stage_changed', 'event'])

    if (error || !sequences || sequences.length === 0) {
      return false
    }

    // Фильтруем последовательности по типу триггера
    const matchingSequences = sequences.filter((seq) => {
      if (seq.trigger_type === 'lead_created' && eventSubtype === 'lead_created') {
        return true
      }
      if (seq.trigger_type === 'stage_changed' && eventSubtype === 'lead_status_changed') {
        return true
      }
      if (seq.trigger_type === 'event' && eventType === eventSubtype) {
        return true
      }
      return false
    })

    // Запускаем каждую подходящую последовательность
    for (const sequence of matchingSequences) {
      try {
        const leadId = context.entityType === 'leads' ? context.entityId : undefined
        const contactId = context.entityType === 'contacts' ? context.entityId : undefined

        if (leadId) {
          await startSequence(
            sequence.id,
            orgId,
            leadId,
            contactId,
            context.payload
          )
        }
      } catch (sequenceError) {
        console.error(`Failed to start sequence ${sequence.id}:`, sequenceError)
      }
    }

    return true
  } catch (error) {
    console.error('Error triggering Sequences:', error)
    return false
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

