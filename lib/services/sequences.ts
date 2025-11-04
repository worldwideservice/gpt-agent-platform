/**
 * Сервис последовательных действий (Sequences)
 * Позволяет создавать и управлять последовательностями автоматизированных действий
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export interface SequenceStep {
 id: string
 sequence_id: string
 step_order: number
 delay_minutes: number // задержка после предыдущего шага
 action_type: 'send_message' | 'create_task' | 'send_email' | 'webhook' | 'ai_response' | 'wait' | 'kommo_action'
 template?: string // шаблон сообщения/email
 recipient?: string
 webhook_url?: string
 ai_prompt?: string
 task_title?: string
 task_description?: string
 kommo_action?: {
 type: 'create_lead' | 'update_lead' | 'create_contact' | 'update_contact' | 'create_task' | 'send_email' | 'create_call_note' | 'create_meeting_note' | 'add_note'
 data: Record<string, any>
 entity_id?: number
 entity_type?: 'leads' | 'contacts' | 'companies'
 }
 metadata: Record<string, any>
}

export interface Sequence {
 id: string
 org_id: string
 agent_id: string | null
 name: string
 description?: string
 trigger_type: 'manual' | 'lead_created' | 'stage_changed' | 'subscription' | 'event'
 trigger_conditions?: Record<string, any> // условия запуска последовательности
 is_active: boolean
 steps: SequenceStep[]
 metadata: Record<string, any>
 created_at: string
 updated_at: string
}

export interface CreateSequenceData extends Omit<Sequence, 'id' | 'org_id' | 'created_at' | 'updated_at' | 'steps'> {
 steps: Omit<SequenceStep, 'id' | 'sequence_id'>[]
}

export interface SequenceExecution {
 id: string
 sequence_id: string
 org_id: string
 lead_id: string
 contact_id?: string
 current_step: number
 status: 'running' | 'completed' | 'paused' | 'failed'
 started_at: string
 completed_at?: string
 next_execution_at?: string
 execution_data: Record<string, any>
 error_message?: string
}

/**
 * Создает новую последовательность
 */
export const createSequence = async (
 orgId: string,
 sequenceData: CreateSequenceData,
): Promise<string | null> => {
 const supabase = getSupabaseServiceRoleClient()

 try {
 // Начинаем транзакцию
 const { data: sequence, error: sequenceError } = await supabase
 .from('sequences')
 .insert({
 org_id: orgId,
 name: sequenceData.name,
 description: sequenceData.description,
 agent_id: sequenceData.agent_id,
 trigger_type: sequenceData.trigger_type,
 trigger_conditions: sequenceData.trigger_conditions,
 is_active: sequenceData.is_active,
 metadata: sequenceData.metadata,
 })
 .select('id')
 .single()

 if (sequenceError || !sequence) {
 console.error('Failed to create sequence', sequenceError)
 return null
 }

 // Создаем шаги последовательности
 if (sequenceData.steps && sequenceData.steps.length > 0) {
 const stepsWithSequenceId = sequenceData.steps.map(step => ({
 ...step,
 sequence_id: sequence.id,
 }))

 const { error: stepsError } = await supabase
 .from('sequence_steps')
 .insert(stepsWithSequenceId)

 if (stepsError) {
 console.error('Failed to create sequence steps', stepsError)
 // Удаляем последовательность если шаги не создались
 await supabase.from('sequences').delete().eq('id', sequence.id)
 return null
 }
 }

 return sequence.id
 } catch (error) {
 console.error('Error creating sequence', error)
 return null
 }
}

/**
 * Получает последовательности организации
 */
export const getSequences = async (
 orgId: string,
 agentId?: string | null,
 activeOnly = false,
): Promise<Sequence[]> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('sequences')
 .select(`
 *,
 steps:sequence_steps(*)
 `)
 .eq('org_id', orgId)
 .order('created_at', { ascending: false })

 if (agentId) {
 query = query.eq('agent_id', agentId)
 }

 if (activeOnly) {
 query = query.eq('is_active', true)
 }

 const { data, error } = await query

 if (error) {
 console.error('Failed to get sequences', error)
 return []
 }

 return (data ?? []).map(seq => ({
 ...seq,
 steps: seq.steps || [],
 }))
}

/**
 * Запускает последовательность для лида
 */
export const startSequence = async (
 sequenceId: string,
 orgId: string,
 leadId: string,
 contactId?: string,
 initialData: Record<string, any> = {},
): Promise<string | null> => {
 const supabase = getSupabaseServiceRoleClient()

 try {
 // Получаем последовательность с шагами
 const { data: sequence, error: seqError } = await supabase
 .from('sequences')
 .select(`
 *,
 steps:sequence_steps(*)
 `)
 .eq('id', sequenceId)
 .eq('org_id', orgId)
 .single()

 if (seqError || !sequence || !sequence.is_active) {
 console.error('Sequence not found or inactive', seqError)
 return null
 }

 // Создаем выполнение последовательности
 const { data: execution, error: execError } = await supabase
 .from('sequence_executions')
 .insert({
 sequence_id: sequenceId,
 org_id: orgId,
 lead_id: leadId,
 contact_id: contactId,
 current_step: 0,
 status: 'running',
 execution_data: initialData,
 })
 .select('id')
 .single()

 if (execError || !execution) {
 console.error('Failed to create sequence execution', execError)
 return null
 }

 // Планируем первый шаг
 await scheduleNextStep(execution.id, sequence.steps, 0)

 return execution.id
 } catch (error) {
 console.error('Error starting sequence', error)
 return null
 }
}

/**
 * Планирует следующий шаг последовательности
 */
const scheduleNextStep = async (
 executionId: string,
 steps: SequenceStep[],
 currentStepIndex: number,
): Promise<void> => {
 const supabase = getSupabaseServiceRoleClient()

 const nextStep = steps.find(step => step.step_order === currentStepIndex + 1)
 if (!nextStep) {
 // Последний шаг завершен
 await supabase
 .from('sequence_executions')
 .update({
 status: 'completed',
 completed_at: new Date().toISOString(),
 })
 .eq('id', executionId)
 return
 }

 // Вычисляем время следующего выполнения
 const nextExecutionAt = new Date(Date.now() + nextStep.delay_minutes * 60 * 1000)

 await supabase
 .from('sequence_executions')
 .update({
 current_step: nextStep.step_order,
 next_execution_at: nextExecutionAt.toISOString(),
 })
 .eq('id', executionId)

 // Добавляем задачу в очередь для выполнения
 await queueStepExecution(executionId, nextStep, nextExecutionAt)
}

/**
 * Добавляет шаг в очередь выполнения
 */
const queueStepExecution = async (
 executionId: string,
 step: SequenceStep,
 executeAt: Date,
): Promise<void> => {
 // Здесь должна быть интеграция с BullMQ для отложенного выполнения
 // Пока просто логируем
 console.log('Queueing step execution:', {
 executionId,
 stepId: step.id,
 executeAt: executeAt.toISOString(),
 actionType: step.action_type,
 })
}

/**
 * Выполняет шаг последовательности
 */
export const executeSequenceStep = async (
 executionId: string,
): Promise<boolean> => {
 const supabase = getSupabaseServiceRoleClient()

 try {
 // Получаем выполнение с последовательностью и шагами
 const { data: execution, error: execError } = await supabase
 .from('sequence_executions')
 .select(`
 *,
 sequence:sequences(
 *,
 steps:sequence_steps(*)
 )
 `)
 .eq('id', executionId)
 .single()

 if (execError || !execution) {
 console.error('Execution not found', execError)
 return false
 }

 const sequence = execution.sequence
 const currentStep = sequence.steps.find((step: SequenceStep) => step.step_order === execution.current_step)

 if (!currentStep) {
 console.error('Current step not found')
 return false
 }

 // Выполняем действие шага
 const success = await executeStepAction(currentStep, execution)

 if (success) {
 // Переходим к следующему шагу
 await scheduleNextStep(executionId, sequence.steps, execution.current_step)
 } else {
 // Помечаем выполнение как failed
 await supabase
 .from('sequence_executions')
 .update({
 status: 'failed',
 error_message: 'Step execution failed',
 })
 .eq('id', executionId)
 }

 return success
 } catch (error) {
 console.error('Error executing sequence step', error)

 // Помечаем выполнение как failed
 await supabase
 .from('sequence_executions')
 .update({
 status: 'failed',
 error_message: error instanceof Error ? error.message : 'Unknown error',
 })
 .eq('id', executionId)

 return false
 }
}

/**
 * Выполняет действие шага
 */
const executeStepAction = async (
 step: SequenceStep,
 execution: any,
): Promise<boolean> => {
 try {
 switch (step.action_type) {
 case 'send_message':
 return await executeSendMessageStep(step, execution)

 case 'create_task':
 return await executeCreateTaskStep(step, execution)

 case 'send_email':
 return await executeSendEmailStep(step, execution)

 case 'webhook':
 return await executeWebhookStep(step, execution)

 case 'ai_response':
 return await executeAiResponseStep(step, execution)

 case 'wait':
 // Wait - просто ничего не делаем, шаг считается выполненным
 return true

 case 'kommo_action':
 return await executeKommoActionStep(step, execution)

 default:
 console.error('Unknown step action type:', step.action_type)
 return false
 }
 } catch (error) {
 console.error('Step action execution failed', error)
 return false
 }
}

/**
 * Выполняет отправку сообщения
 */
const executeSendMessageStep = async (
 step: SequenceStep,
 execution: any,
): Promise<boolean> => {
 if (!step.template) return false

 // Здесь должна быть интеграция с Kommo API
 console.log('Sequence: Sending message', {
 leadId: execution.lead_id,
 template: step.template,
 executionData: execution.execution_data,
 })

 return true
}

/**
 * Создает задачу
 */
const executeCreateTaskStep = async (
 step: SequenceStep,
 execution: any,
): Promise<boolean> => {
 if (!step.task_title) return false

 // Здесь должна быть интеграция с Kommo API
 console.log('Sequence: Creating task', {
 leadId: execution.lead_id,
 title: step.task_title,
 description: step.task_description,
 })

 return true
}

/**
 * Отправляет email
 */
const executeSendEmailStep = async (
 step: SequenceStep,
 execution: any,
): Promise<boolean> => {
 if (!step.template || !step.recipient) return false

  try {
    const { sendTemplateEmail } = await import('./email')

    // Подготавливаем переменные для шаблона
    const variables: Record<string, string> = {
      ...execution.execution_data,
      recipient: step.recipient,
    }

    // Отправляем email
    // template может быть строкой или объектом
    const templateStr = typeof step.template === 'string' 
      ? step.template 
      : (step.template as any)?.html || (step.template as any)?.body || ''
    
    const subject = typeof step.template === 'string'
      ? 'Сообщение от World Wide Services'
      : (step.template as any)?.subject || 'Сообщение от World Wide Services'

    const success = await sendTemplateEmail(
      step.recipient || '',
      subject,
      templateStr,
      variables,
    )

    if (!success) {
      console.error('Failed to send email in sequence step:', {
        recipient: step.recipient,
        stepOrder: step.step_order,
      })
      return false
    }

    console.log('Sequence: Email sent successfully', {
 recipient: step.recipient,
      stepId: step.id,
 })

 return true
  } catch (error) {
    console.error('Error sending email in sequence step:', error)
    return false
  }
}

/**
 * Вызывает webhook
 */
const executeWebhookStep = async (
 step: SequenceStep,
 execution: any,
): Promise<boolean> => {
 if (!step.webhook_url) return false

 try {
 const response = await fetch(step.webhook_url, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 sequence_execution: execution,
 step,
 timestamp: new Date().toISOString(),
 }),
 })

 return response.ok
 } catch (error) {
 console.error('Webhook execution failed', error)
 return false
 }
}

/**
 * Генерирует AI-ответ
 */
const executeAiResponseStep = async (
 step: SequenceStep,
 execution: any,
): Promise<boolean> => {
 if (!step.ai_prompt) return false

 // Здесь должна быть интеграция с AI
 console.log('Sequence: AI response', {
 leadId: execution.lead_id,
 prompt: step.ai_prompt,
 })

 return true
}

/**
 * Получает активные выполнения последовательностей для планировщика
 */
export const getPendingSequenceExecutions = async (): Promise<Array<{
 id: string
 next_execution_at: string
}>> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('sequence_executions')
 .select('id, next_execution_at')
 .eq('status', 'running')
 .not('next_execution_at', 'is', null)
 .lte('next_execution_at', new Date().toISOString())
 .order('next_execution_at', { ascending: true })
 .limit(100)

 if (error) {
 console.error('Failed to get pending executions', error)
 return []
 }

 return data ?? []
}

/**
 * Обновляет последовательность
 */
export const updateSequence = async (
 sequenceId: string,
 orgId: string,
 updates: Partial<Omit<Sequence, 'id' | 'org_id' | 'created_at' | 'updated_at'>>,
): Promise<boolean> => {
 const supabase = getSupabaseServiceRoleClient()

 try {
 const { error } = await supabase
 .from('sequences')
 .update({
 ...updates,
 updated_at: new Date().toISOString(),
 })
 .eq('id', sequenceId)
 .eq('org_id', orgId)

 return !error
 } catch (error) {
 console.error('Error updating sequence', error)
 return false
 }
}

/**
 * Удаляет последовательность
 */
export const deleteSequence = async (
 sequenceId: string,
 orgId: string,
): Promise<boolean> => {
 const supabase = getSupabaseServiceRoleClient()

 try {
 // Сначала удаляем выполнения
 await supabase
 .from('sequence_executions')
 .delete()
 .eq('sequence_id', sequenceId)
 .eq('org_id', orgId)

 // Затем шаги
 await supabase
 .from('sequence_steps')
 .delete()
 .eq('sequence_id', sequenceId)

 // Наконец последовательность
 const { error } = await supabase
 .from('sequences')
 .delete()
 .eq('id', sequenceId)
 .eq('org_id', orgId)

 return !error
 } catch (error) {
 console.error('Error deleting sequence', error)
 return false
 }
}

/**
 * Выполняет действие с Kommo
 */
const executeKommoActionStep = async (
 step: SequenceStep,
 execution: any,
): Promise<boolean> => {
 if (!step.kommo_action) return false

 try {
 const { KommoActionsService } = await import('@/lib/services/kommo-actions')

 const kommoService = new KommoActionsService(execution.org_id)

 const action = {
 type: step.kommo_action.type,
 data: step.kommo_action.data,
 entityId: step.kommo_action.entity_id || execution.lead_id,
 entityType: step.kommo_action.entity_type || 'leads',
 }

 await kommoService.executeAction(action)
 return true
 } catch (error) {
 console.error('Kommo action execution failed', error)
 return false
 }
}


