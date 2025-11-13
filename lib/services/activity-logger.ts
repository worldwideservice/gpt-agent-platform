/**
 * Сервис для записи активности в activity_logs
 * Используется для Dashboard Recent Updates
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils'

export type ActivityType =
  | 'agent_created'
  | 'agent_updated'
  | 'agent_response'
  | 'action_executed'
  | 'lead_created'
  | 'lead_updated'
  | 'lead_status_changed'
  | 'conversation_started'
  | 'conversation_ended'
  | 'task_created'
  | 'task_completed'
  | 'call_completed'
  | 'error_occurred'
  | 'integration_connected'
  | 'integration_synced'
  | 'rule_executed'
  | 'sequence_executed'

export interface ActivityLogData {
  orgId: string
  userId?: string
  agentId?: string
  conversationId?: string
  activityType: ActivityType
  title: string
  description?: string
  metadata?: Record<string, unknown>
}

/**
 * Записывает активность в лог
 */
export const logActivity = async (data: ActivityLogData): Promise<void> => {
  try {
    const supabase = getSupabaseServiceRoleClient()

    const { error } = await supabase.from('activity_logs').insert({
      org_id: data.orgId,
      user_id: data.userId || null,
      agent_id: data.agentId || null,
      conversation_id: data.conversationId || null,
      activity_type: data.activityType,
      title: data.title,
      description: data.description || null,
      metadata: data.metadata || {},
    })

    if (error) {
      logger.error('Failed to log activity', error instanceof Error ? error : new Error(String(error)), { activityType: data.activityType, orgId: data.orgId })
      // Не выбрасываем ошибку, чтобы не прервать выполнение основного кода
    }
  } catch (error) {
    logger.error('Error logging activity', error instanceof Error ? error : new Error(String(error)), { activityType: data.activityType, orgId: data.orgId })
    // Не выбрасываем ошибку, чтобы не прервать выполнение основного кода
  }
}

/**
 * Вспомогательные функции для частых случаев
 */
export const ActivityLogger = {
  /**
   * Логирование создания агента
   */
  agentCreated: async (orgId: string, userId: string, agentId: string, agentName: string) => {
    await logActivity({
      orgId,
      userId,
      agentId,
      activityType: 'agent_created',
      title: `Создан новый агент: ${agentName}`,
      description: `Пользователь создал нового ИИ-агента "${agentName}"`,
      metadata: { agent_name: agentName },
    })
  },

  /**
   * Логирование ответа агента
   */
  agentResponse: async (
    orgId: string,
    agentId: string,
    conversationId: string,
    messageLength: number
  ) => {
    await logActivity({
      orgId,
      agentId,
      conversationId,
      activityType: 'agent_response',
      title: 'Агент отправил ответ',
      description: `Агент ответил в разговоре (${messageLength} символов)`,
      metadata: { message_length: messageLength },
    })
  },

  /**
   * Логирование выполнения действия
   */
  actionExecuted: async (
    orgId: string,
    agentId: string,
    actionType: string,
    actionData: Record<string, unknown>
  ) => {
    await logActivity({
      orgId,
      agentId,
      activityType: 'action_executed',
      title: `Выполнено действие: ${actionType}`,
      description: `Агент выполнил действие "${actionType}"`,
      metadata: { action_type: actionType, ...actionData },
    })
  },

  /**
   * Логирование изменения сделки
   */
  leadUpdated: async (orgId: string, leadId: number, changeType: string, details?: string) => {
    await logActivity({
      orgId,
      activityType: 'lead_updated',
      title: `Сделка обновлена: ${changeType}`,
      description: details || `Изменение в сделке #${leadId}`,
      metadata: { lead_id: leadId, change_type: changeType },
    })
  },

  /**
   * Логирование ошибки
   */
  errorOccurred: async (
    orgId: string,
    errorType: string,
    errorMessage: string,
    metadata?: Record<string, unknown>
  ) => {
    await logActivity({
      orgId,
      activityType: 'error_occurred',
      title: `Ошибка: ${errorType}`,
      description: errorMessage,
      metadata: { error_type: errorType, ...metadata },
    })
  },

  /**
   * Логирование синхронизации интеграции
   */
  integrationSynced: async (orgId: string, integrationType: string, success: boolean) => {
    await logActivity({
      orgId,
      activityType: 'integration_synced',
      title: `Синхронизация ${integrationType}: ${success ? 'успешно' : 'ошибка'}`,
      description: `Синхронизация интеграции ${integrationType} завершена`,
      metadata: { integration_type: integrationType, success },
    })
  },

  /**
   * Логирование выполнения правила
   */
  ruleExecuted: async (orgId: string, ruleId: string, ruleName: string, success: boolean) => {
    await logActivity({
      orgId,
      activityType: 'rule_executed',
      title: `Правило выполнено: ${ruleName}`,
      description: `Автоматическое правило "${ruleName}" ${success ? 'выполнено успешно' : 'завершилось с ошибкой'}`,
      metadata: { rule_id: ruleId, rule_name: ruleName, success },
    })
  },
}

