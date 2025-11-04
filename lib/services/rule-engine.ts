/**
 * Rule Engine для автоматизации бизнес-процессов
 * Позволяет создавать правила "Если условие -> выполнить действие"
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { generateChatResponse } from './llm'

export interface RuleCondition {
 type: 'field_value' | 'stage_changed' | 'time_elapsed' | 'event_triggered' | 'custom_condition'
 field?: string // название поля в CRM
 operator?: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'changed_to' | 'not_empty'
 value?: any
 timeUnit?: 'minutes' | 'hours' | 'days' | 'weeks'
 timeValue?: number
 customLogic?: string // JavaScript код для кастомных условий
}

export interface RuleAction {
 type: 'send_message' | 'change_stage' | 'create_task' | 'update_field' | 'send_email' | 'webhook' | 'ai_response'
 template?: string // шаблон сообщения/задачи
 targetField?: string // поле для обновления
 newValue?: any
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
 metadata: Record<string, any>
 created_at: string
 updated_at: string
}

export interface RuleExecutionContext {
 organizationId: string
 agentId?: string | null
 leadId?: string
 contactId?: string
 triggerType: string
 triggerData: Record<string, any>
 previousState?: Record<string, any>
 currentState?: Record<string, any>
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
 console.error('Failed to create rule', error)
 return null
 }

 return data.id
 } catch (error) {
 console.error('Error creating rule', error)
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
 console.error('Failed to get rules', error)
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

      // Добавляем ruleName в контекст для логирования
      const contextWithRuleName = {
        ...context,
        ruleName: rule.name,
      }

      // Логируем выполнение
      await logRuleExecution(rule.id, contextWithRuleName, actionResults)

      results.push({
        ruleId: rule.id,
        actions: rule.actions,
        success: actionResults.every(r => r.success),
        error: actionResults.find(r => !r.success)?.error,
      })

 } catch (error) {
 console.error(`Rule execution failed for rule ${rule.id}`, error)
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

 const createdAt = new Date(triggerData.created_at || Date.now())
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
 console.error('Custom condition evaluation failed', error)
 return false
 }

 default:
 return false
 }
}

/**
 * Оценивает оператор сравнения
 */
const evaluateOperator = (operator: string, actualValue: any, expectedValue: any): boolean => {
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
 if (rule.cooldown_minutes) {
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
 console.error('Action execution failed', error)
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
const executeSendMessage = async (
 action: RuleAction,
 context: RuleExecutionContext,
): Promise<boolean> => {
 if (!action.template) return false

 // Здесь должна быть интеграция с Kommo API для отправки сообщения
 // Пока просто логируем
 console.log('Sending message:', {
 template: action.template,
 leadId: context.leadId,
 context,
 })

 return true
}

/**
 * Выполняет изменение этапа воронки
 */
const executeChangeStage = async (
 action: RuleAction,
 context: RuleExecutionContext,
): Promise<boolean> => {
 if (!action.newValue || !context.leadId) return false

 // Здесь должна быть интеграция с Kommo API для изменения этапа
 console.log('Changing stage:', {
 leadId: context.leadId,
 newStage: action.newValue,
 })

 return true
}

/**
 * Создает задачу
 */
const executeCreateTask = async (
 action: RuleAction,
 context: RuleExecutionContext,
): Promise<boolean> => {
 if (!action.template || !context.leadId) return false

 // Здесь должна быть интеграция с Kommo API для создания задачи
 console.log('Creating task:', {
 leadId: context.leadId,
 template: action.template,
 })

 return true
}

/**
 * Обновляет поле в CRM
 */
const executeUpdateField = async (
 action: RuleAction,
 context: RuleExecutionContext,
): Promise<boolean> => {
 if (!action.targetField || !context.leadId) return false

 // Здесь должна быть интеграция с Kommo API для обновления поля
 console.log('Updating field:', {
 leadId: context.leadId,
 field: action.targetField,
 value: action.newValue,
 })

 return true
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
    const templateStr = typeof action.template === 'string' 
      ? action.template 
      : (action.template as any)?.html || (action.template as any)?.body || ''
    
    const subject = typeof action.template === 'string'
      ? 'Сообщение от World Wide Services'
      : (action.template as any)?.subject || 'Сообщение от World Wide Services'

    const success = await sendTemplateEmail(
      action.recipient || '',
      subject,
      templateStr,
      variables,
    )

    if (!success) {
    console.error('Failed to send email in rule action:', {
      recipient: action.recipient,
      actionType: action.type,
    })
      return false
    }

    console.log('Rule: Email sent successfully', {
      recipient: action.recipient,
      actionType: action.type,
    })

    return true
  } catch (error) {
    console.error('Error sending email in rule action:', error)
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
 console.error('Webhook execution failed', error)
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
 console.error('AI response generation failed', error)
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

  try {
    // Логируем в rule_executions (для детального анализа)
    await supabase.from('rule_executions').insert({
      rule_id: ruleId,
      org_id: context.organizationId,
      lead_id: context.leadId,
      execution_context: context,
      action_results: actionResults,
      executed_at: new Date().toISOString(),
    })

    // Логируем в activity_logs (для Dashboard Recent Updates)
    const { logActivity } = await import('./activity-logger')
    const ruleName = context.ruleName || `Правило #${ruleId}`
    const successCount = actionResults.filter((r) => r.success).length
    const totalCount = actionResults.length
    
    await logActivity({
      orgId: context.organizationId,
      agentId: context.agentId || undefined,
      activityType: 'rule_executed',
      title: `Правило выполнено: ${ruleName}`,
      description: `Выполнено ${successCount} из ${totalCount} действий`,
      metadata: {
        rule_id: ruleId,
        rule_name: ruleName,
        success_count: successCount,
        total_actions: totalCount,
        lead_id: context.leadId,
      },
    }).catch((error) => {
      console.error('Failed to log rule execution to activity_logs:', error)
    })
  } catch (error) {
    console.error('Failed to log rule execution', error)
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


