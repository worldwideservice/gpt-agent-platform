/**
 * Rule Engine для автоматизации бизнес-процессов
 * Позволяет создавать правила "Если условие -> выполнить действие"
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { generateChatResponse } from './llm'
import { createKommoApiForOrg } from '@/lib/repositories/crm-connection'
import { logger } from '@/lib/utils/logger'

// Тип для шаблона email
interface EmailTemplate {
  subject?: string
  html?: string
  body?: string
}

export interface RuleCondition {
 type: 'field_value' | 'stage_changed' | 'time_elapsed' | 'event_triggered' | 'custom_condition'
 field?: string // название поля в CRM
 operator?: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'changed_to' | 'not_empty'
 value?: unknown
 timeUnit?: 'minutes' | 'hours' | 'days' | 'weeks'
 timeValue?: number
 customLogic?: string // JavaScript код для кастомных условий
}

export interface RuleAction {
 type: 'send_message' | 'change_stage' | 'create_task' | 'update_field' | 'send_email' | 'webhook' | 'ai_response'
 template?: string | EmailTemplate // шаблон сообщения/задачи
 targetField?: string // поле для обновления
 newValue?: unknown
 recipient?: string // получатель email/сообщения
 webhookUrl?: string // URL для webhook
 aiPrompt?: string // промпт для AI-ответа
}

export interface AutomationRule {
 id: string
 org_id: string
 agent_id: string | null
 name: string
 description?: string
 trigger_type: 'lead_created' | 'lead_updated' | 'message_received' | 'stage_changed' | 'time_based' | 'manual'
 conditions: RuleCondition[]
 actions: RuleAction[]
 is_active: boolean
 priority: number // порядок выполнения (1 = самый высокий)
 cooldown_minutes?: number // минимальный интервал между выполнениями
 max_executions_per_day?: number // лимит выполнений в день
 metadata: Record<string, unknown>
 created_at: string
 updated_at: string
}

export interface RuleExecutionContext {
 organizationId: string
 agentId?: string | null
 leadId?: string
 contactId?: string
 triggerType: string
 triggerData: Record<string, unknown>
 previousState?: Record<string, unknown>
 currentState?: Record<string, unknown>
}

/**
 * Создает новое правило автоматизации
 */
export const createRule = async (
 orgId: string,
 ruleData: Omit<AutomationRule, 'id' | 'org_id' | 'created_at' | 'updated_at'>,
): Promise<string | null> => {
 const supabase = getSupabaseServiceRoleClient()

 try {
 const { data, error } = await supabase
 .from('automation_rules')
 .insert({
 org_id: orgId,
 ...ruleData,
 })
 .select('id')
 .single()

 if (error) {
 logger.error('Failed to create rule', error, { orgId })
 return null
 }

 return data.id
 } catch (error) {
 logger.error('Error creating rule', error, { orgId })
 return null
 }
}

/**
 * Получает правила для организации
 */
export const getRules = async (
 orgId: string,
 agentId?: string | null,
 activeOnly = true,
): Promise<AutomationRule[]> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('automation_rules')
 .select('*')
 .eq('org_id', orgId)
 .order('priority', { ascending: true })

 if (activeOnly) {
 query = query.eq('is_active', true)
 }

 if (agentId) {
 query = query.eq('agent_id', agentId)
 }

 const { data, error } = await query

 if (error) {
 logger.error('Failed to get rules', error, { orgId, agentId, activeOnly })
 return []
 }

 return data ?? []
}

/**
 * Выполняет правила автоматизации на основе контекста
 */
export const executeRules = async (
 context: RuleExecutionContext,
): Promise<Array<{ ruleId: string; actions: RuleAction[]; success: boolean; error?: string }>> => {
 const { organizationId, triggerType } = context

 // Получаем релевантные правила
 const rules = await getRules(organizationId, context.agentId)
 const relevantRules = rules.filter(rule => rule.trigger_type === triggerType)

 if (relevantRules.length === 0) {
 return []
 }

 const results = []

 for (const rule of relevantRules) {
 try {
 // Проверяем условия правила
 const conditionsMet = await evaluateConditions(rule.conditions, context)

 if (!conditionsMet) {
 continue
 }

 // Проверяем cooldown и лимиты
 const canExecute = await checkExecutionLimits(rule, context)

 if (!canExecute) {
 continue
 }

 // Выполняем действия
 const actionResults = await executeActions(rule.actions, context)

 // Логируем выполнение
 await logRuleExecution(rule.id, context, actionResults)

 results.push({
 ruleId: rule.id,
 actions: rule.actions,
 success: actionResults.every(r => r.success),
 error: actionResults.find(r => !r.success)?.error,
 })

 } catch (error) {
 logger.error(`Rule execution failed for rule ${rule.id}`, error, { ruleId: rule.id, organizationId })
 results.push({
 ruleId: rule.id,
 actions: rule.actions,
 success: false,
 error: error instanceof Error ? error.message : 'Unknown error',
 })
 }
 }

 return results
}

/**
 * Оценивает условия правила
 */
const evaluateConditions = async (
 conditions: RuleCondition[],
 context: RuleExecutionContext,
): Promise<boolean> => {
 for (const condition of conditions) {
 const result = await evaluateCondition(condition, context)
 if (!result) {
 return false
 }
 }
 return true
}

/**
 * Оценивает отдельное условие
 */
const evaluateCondition = async (
 condition: RuleCondition,
 context: RuleExecutionContext,
): Promise<boolean> => {
 const { currentState, previousState, triggerData } = context

 switch (condition.type) {
 case 'field_value':
 if (!condition.field || !condition.operator) return false

 const fieldValue = currentState?.[condition.field]
 return evaluateOperator(condition.operator, fieldValue, condition.value)

 case 'stage_changed':
 if (!previousState?.stage || !currentState?.stage) return false
 return previousState.stage !== currentState.stage &&
 (!condition.value || currentState.stage === condition.value)

 case 'time_elapsed':
 if (!condition.timeUnit || !condition.timeValue) return false

 const createdAt = new Date((triggerData.created_at as string | number) || Date.now())
 const now = new Date()
 const diffMs = now.getTime() - createdAt.getTime()

 const multipliers = {
 minutes: 60 * 1000,
 hours: 60 * 60 * 1000,
 days: 24 * 60 * 60 * 1000,
 weeks: 7 * 24 * 60 * 60 * 1000,
 }

 const requiredMs = condition.timeValue * multipliers[condition.timeUnit]
 return diffMs >= requiredMs

 case 'event_triggered':
 return triggerData.type === condition.value

 case 'custom_condition':
 if (!condition.customLogic) return false

 try {
 // Выполняем JavaScript код в изолированном контексте
 const func = new Function('context', `return ${condition.customLogic}`)
 return !!func(context)
 } catch (error) {
 logger.error('Custom condition evaluation failed', error)
 return false
 }

 default:
 return false
 }
}

/**
 * Оценивает оператор сравнения
 */
const evaluateOperator = (operator: string, actualValue: unknown, expectedValue: unknown): boolean => {
 switch (operator) {
 case 'equals':
 return actualValue === expectedValue
 case 'contains':
 return String(actualValue).toLowerCase().includes(String(expectedValue).toLowerCase())
 case 'greater_than':
 return Number(actualValue) > Number(expectedValue)
 case 'less_than':
 return Number(actualValue) < Number(expectedValue)
 case 'changed_to':
 return actualValue === expectedValue
 case 'not_empty':
 return actualValue != null && actualValue !== ''
 default:
 return false
 }
}

/**
 * Проверяет лимиты выполнения правила
 */
const checkExecutionLimits = async (
 rule: AutomationRule,
 context: RuleExecutionContext,
): Promise<boolean> => {
 const supabase = getSupabaseServiceRoleClient()

 // Проверяем cooldown
 if (rule.cooldown_minutes && context.leadId) {
  const cooldownStart = new Date(Date.now() - rule.cooldown_minutes * 60 * 1000)

  const { data: recentExecutions } = await supabase
  .from('rule_executions')
  .select('id')
  .eq('rule_id', rule.id)
 .eq('lead_id', context.leadId)
 .gte('executed_at', cooldownStart.toISOString())
  .limit(1)

  if (recentExecutions && recentExecutions.length > 0) {
  return false // Cooldown активен
  }
 }

 // Проверяем дневной лимит
 if (rule.max_executions_per_day) {
 const today = new Date()
 today.setHours(0, 0, 0, 0)

 const { data: todayExecutions } = await supabase
 .from('rule_executions')
 .select('id')
 .eq('rule_id', rule.id)
 .gte('executed_at', today.toISOString())

 if (todayExecutions && todayExecutions.length >= rule.max_executions_per_day) {
 return false // Лимит превышен
 }
 }

 return true
}

/**
 * Выполняет действия правила
 */
const executeActions = async (
 actions: RuleAction[],
 context: RuleExecutionContext,
): Promise<Array<{ action: RuleAction; success: boolean; error?: string }>> => {
 const results = []

 for (const action of actions) {
 try {
 const success = await executeAction(action, context)
 results.push({ action, success })
 } catch (error) {
 logger.error('Action execution failed', error, { actionType: action.type, organizationId: context.organizationId })
 results.push({
 action,
 success: false,
 error: error instanceof Error ? error.message : 'Unknown error',
 })
 }
 }

 return results
}

/**
 * Выполняет отдельное действие
 */
const executeAction = async (
 action: RuleAction,
 context: RuleExecutionContext,
): Promise<boolean> => {
 switch (action.type) {
 case 'send_message':
 return await executeSendMessage(action, context)

 case 'change_stage':
 return await executeChangeStage(action, context)

 case 'create_task':
 return await executeCreateTask(action, context)

 case 'update_field':
 return await executeUpdateField(action, context)

 case 'send_email':
 return await executeSendEmail(action, context)

 case 'webhook':
 return await executeWebhook(action, context)

 case 'ai_response':
 return await executeAiResponse(action, context)

 default:
 return false
 }
}

/**
 * Выполняет отправку сообщения
 */
const executeSendMessage = async (action: RuleAction, context: RuleExecutionContext): Promise<boolean> => {
  if (!action.template || !context.leadId) {
    return false
  }

  const kommoApi = await createKommoApiForOrg(context.organizationId)
  if (!kommoApi) {
    logger.warn('Kommo API not configured for organization', { organizationId: context.organizationId })
    return false
  }

  try {
    const leadId = Number(context.leadId)
    if (!Number.isFinite(leadId)) {
      return false
    }

    await kommoApi.createNote({
      entity_id: leadId,
      entity_type: 'leads',
      note_type: 'common',
      params: {
        text: typeof action.template === 'string' ? action.template : (action.template?.body || action.template?.html || ''),
        source: 'rule_engine',
      },
    })

    return true
  } catch (error) {
    logger.error('Failed to send message through Kommo', error, { organizationId: context.organizationId, leadId: context.leadId })
    return false
  }
}

/**
 * Выполняет изменение этапа воронки
 */
const executeChangeStage = async (action: RuleAction, context: RuleExecutionContext): Promise<boolean> => {
  if (!action.newValue || !context.leadId) {
    return false
  }

  const kommoApi = await createKommoApiForOrg(context.organizationId)
  if (!kommoApi) {
    logger.warn('Kommo API not available for stage change', { organizationId: context.organizationId })
    return false
  }

  const leadId = Number(context.leadId)
  const newStageId = Number(action.newValue)

  if (!Number.isFinite(leadId) || !Number.isFinite(newStageId)) {
    return false
  }

  try {
    await kommoApi.updateLead(leadId, { status_id: newStageId })
    return true
  } catch (error) {
    logger.error('Failed to change stage in Kommo', error, { organizationId: context.organizationId, leadId: context.leadId })
    return false
  }
}

/**
 * Создает задачу
 */
const executeCreateTask = async (action: RuleAction, context: RuleExecutionContext): Promise<boolean> => {
  if (!action.template || !context.leadId) {
    return false
  }

  const kommoApi = await createKommoApiForOrg(context.organizationId)
  if (!kommoApi) {
    logger.warn('Kommo API unavailable for creating task', { organizationId: context.organizationId })
    return false
  }

  const leadId = Number(context.leadId)
  if (!Number.isFinite(leadId)) {
    return false
  }

  try {
    const defaultResponsibleId = Number(process.env.KOMMO_DEFAULT_USER_ID ?? 1)
    const candidateResponsibleId = Number(context.triggerData?.responsible_user_id)
    const responsibleId =
      Number.isFinite(candidateResponsibleId) && candidateResponsibleId > 0 ? candidateResponsibleId : defaultResponsibleId

    await kommoApi.createTask({
      text: typeof action.template === 'string' ? action.template : (action.template?.body || action.template?.html || ''),
      complete_till: Math.floor(Date.now() / 1000 + 60 * 60),
      task_type_id: 1,
      responsible_user_id: responsibleId,
      entity_id: leadId,
      entity_type: 'leads',
    })
    return true
  } catch (error) {
    logger.error('Failed to create Kommo task', error, { organizationId: context.organizationId, leadId: context.leadId })
    return false
  }
}

/**
 * Обновляет поле в CRM
 */
const executeUpdateField = async (action: RuleAction, context: RuleExecutionContext): Promise<boolean> => {
  if (!action.targetField || !context.leadId) {
    return false
  }

  const kommoApi = await createKommoApiForOrg(context.organizationId)
  if (!kommoApi) {
    logger.warn('Kommo API unavailable for update field', { organizationId: context.organizationId })
    return false
  }

  const leadId = Number(context.leadId)
  if (!Number.isFinite(leadId)) {
    return false
  }

  try {
    await kommoApi.updateLead(leadId, {
      [action.targetField]: action.newValue,
    })
    return true
  } catch (error) {
    logger.error('Failed to update field in Kommo', error, { organizationId: context.organizationId, leadId: context.leadId })
    return false
  }
}

/**
 * Отправляет email
 */
const executeSendEmail = async (
  action: RuleAction,
  context: RuleExecutionContext,
): Promise<boolean> => {
  if (!action.template || !action.recipient) return false

  try {
    const { sendTemplateEmail } = await import('./email')

    // Подготавливаем переменные для шаблона из контекста
    const variables: Record<string, string> = {
      ...(context.currentState || {}),
      ...(context.triggerData || {}),
      recipient: action.recipient || '',
    }

    // Отправляем email
    // template может быть строкой или объектом
    const templateObj = typeof action.template === 'object' ? action.template as EmailTemplate : null
    const templateSubject = typeof action.template === 'string'
      ? 'Сообщение от World Wide Services'
      : templateObj?.subject || 'Сообщение от World Wide Services'
    const templateBody = typeof action.template === 'string'
      ? action.template
      : templateObj?.html || templateObj?.body || ''
    
    const success = await sendTemplateEmail(
      action.recipient,
      templateSubject,
      templateBody,
      variables,
    )

    if (!success) {
      logger.error('Failed to send email in rule action', undefined, {
        recipient: action.recipient,
        actionType: action.type,
      })
      return false
    }

    logger.info('Rule: Email sent successfully', {
      recipient: action.recipient,
      actionType: action.type,
    })

    return true
  } catch (error) {
    logger.error('Error sending email in rule action', error, { recipient: action.recipient })
    return false
  }
}

/**
 * Вызывает webhook
 */
const executeWebhook = async (
 action: RuleAction,
 context: RuleExecutionContext,
): Promise<boolean> => {
 if (!action.webhookUrl) return false

 try {
 const response = await fetch(action.webhookUrl, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 rule_context: context,
 action,
 timestamp: new Date().toISOString(),
 }),
 })

 return response.ok
 } catch (error) {
 logger.error('Webhook execution failed', error, { webhookUrl: action.webhookUrl })
 return false
 }
}

/**
 * Генерирует AI-ответ
 */
const executeAiResponse = async (
 action: RuleAction,
 context: RuleExecutionContext,
): Promise<boolean> => {
 if (!action.aiPrompt) return false

 try {
 await generateChatResponse(context.organizationId, action.aiPrompt, {
 model: 'openai/gpt-4o-mini',
 })
 return true
 } catch (error) {
 logger.error('AI response generation failed', error, { organizationId: context.organizationId })
 return false
 }
}

/**
 * Логирует выполнение правила
 */
const logRuleExecution = async (
 ruleId: string,
 context: RuleExecutionContext,
 actionResults: Array<{ action: RuleAction; success: boolean; error?: string }>,
): Promise<void> => {
 const supabase = getSupabaseServiceRoleClient()
 const success = actionResults.every((result) => result.success)
 const error = actionResults.find((result) => !result.success)?.error ?? null

 try {
 await supabase.from('rule_executions').insert({
 rule_id: ruleId,
 org_id: context.organizationId,
 agent_id: context.agentId ?? null,
 lead_id: context.leadId ?? null,
 trigger_type: context.triggerType,
 execution_context: context,
 action_results: actionResults,
 success,
 error,
 executed_at: new Date().toISOString(),
 })
 } catch (error) {
 logger.error('Failed to log rule execution', error, { ruleId, organizationId: context.organizationId })
 }
}

/**
 * Предварительный просмотр того, какие правила сработают для данного контекста
 */
export const previewRules = async (
  context: RuleExecutionContext,
): Promise<Array<{ rule: AutomationRule; willExecute: boolean; reason?: string }>> => {
 const { organizationId } = context

 const rules = await getRules(organizationId, context.agentId)
 const relevantRules = rules.filter(rule => rule.trigger_type === context.triggerType)

 const results = []

 for (const rule of relevantRules) {
 let willExecute = false
 let reason = ''

 try {
 const conditionsMet = await evaluateConditions(rule.conditions, context)
 const limitsOk = await checkExecutionLimits(rule, context)

 willExecute = conditionsMet && limitsOk

 if (!conditionsMet) {
 reason = 'Условия не выполнены'
 } else if (!limitsOk) {
 reason = 'Превышены лимиты выполнения'
 }
 } catch (error) {
 reason = `Ошибка оценки: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
 }

 results.push({
 rule,
 willExecute,
 reason: reason || undefined,
 })
 }

  return results
}

export const __testable = {
  executeSendMessage,
  executeChangeStage,
  executeCreateTask,
  executeUpdateField,
}
