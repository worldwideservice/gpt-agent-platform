import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'
import type { CreateNotificationInput } from '@/lib/validation/schemas/notification'

/**
 * Создает уведомление для пользователя в организации
 *
 * @param input - Данные для создания уведомления
 * @returns ID созданного уведомления или null в случае ошибки
 *
 * @example
 * ```ts
 * await createNotification({
 *   orgId: 'org-uuid',
 *   userId: 'user-uuid',
 *   type: 'lead_new',
 *   title: 'Новый лид',
 *   message: 'Получен новый лид "Иван Иванов" из Instagram',
 *   actionUrl: '/manage/my-org/leads/lead-id',
 *   metadata: { leadId: 'lead-uuid', source: 'instagram' }
 * })
 * ```
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<string | null> {
  try {
    const supabase = getSupabaseServiceRoleClient()

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        org_id: input.orgId,
        user_id: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        action_url: input.actionUrl,
        metadata: input.metadata || {},
      })
      .select('id')
      .single()

    if (error) {
      logger.error('Failed to create notification', error, {
        context: 'createNotification',
        orgId: input.orgId,
        userId: input.userId,
        type: input.type,
      })
      return null
    }

    logger.info('Notification created successfully', {
      context: 'createNotification',
      notificationId: data.id,
      orgId: input.orgId,
      userId: input.userId,
      type: input.type,
    })

    return data.id
  } catch (error) {
    logger.error('Unexpected error creating notification', error, {
      context: 'createNotification',
      orgId: input.orgId,
      userId: input.userId,
      type: input.type,
    })
    return null
  }
}

/**
 * Создает уведомления для нескольких пользователей одновременно
 *
 * @param userIds - Массив ID пользователей
 * @param notificationData - Общие данные уведомления (без userId)
 * @returns Количество успешно созданных уведомлений
 *
 * @example
 * ```ts
 * await createBulkNotifications(
 *   ['user1-uuid', 'user2-uuid'],
 *   {
 *     orgId: 'org-uuid',
 *     type: 'system_alert',
 *     title: 'Обновление системы',
 *     message: 'Система будет недоступна 10 минут',
 *   }
 * )
 * ```
 */
export async function createBulkNotifications(
  userIds: string[],
  notificationData: Omit<CreateNotificationInput, 'userId'>
): Promise<number> {
  try {
    const supabase = getSupabaseServiceRoleClient()

    const notifications = userIds.map((userId) => ({
      org_id: notificationData.orgId,
      user_id: userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      action_url: notificationData.actionUrl,
      metadata: notificationData.metadata || {},
    }))

    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications)
      .select('id')

    if (error) {
      logger.error('Failed to create bulk notifications', error, {
        context: 'createBulkNotifications',
        orgId: notificationData.orgId,
        userCount: userIds.length,
        type: notificationData.type,
      })
      return 0
    }

    logger.info('Bulk notifications created successfully', {
      context: 'createBulkNotifications',
      orgId: notificationData.orgId,
      createdCount: data?.length || 0,
      type: notificationData.type,
    })

    return data?.length || 0
  } catch (error) {
    logger.error('Unexpected error creating bulk notifications', error, {
      context: 'createBulkNotifications',
      orgId: notificationData.orgId,
      userCount: userIds.length,
    })
    return 0
  }
}

/**
 * Типы уведомлений и их шаблоны
 */
export const NotificationTemplates = {
  /**
   * Новый лид создан
   */
  leadNew: (leadName: string, source: string) => ({
    type: 'lead_new' as const,
    title: 'Новый лид',
    message: `Получен новый лид "${leadName}" из ${source}`,
  }),

  /**
   * Лид назначен пользователю
   */
  leadAssigned: (leadName: string, assignedBy: string) => ({
    type: 'lead_assigned' as const,
    title: 'Лид назначен вам',
    message: `Лид "${leadName}" назначен вам пользователем ${assignedBy}`,
  }),

  /**
   * Статус лида изменен
   */
  leadStatusChanged: (leadName: string, oldStatus: string, newStatus: string) => ({
    type: 'lead_status_changed' as const,
    title: 'Статус лида изменен',
    message: `Лид "${leadName}" перемещен из "${oldStatus}" в "${newStatus}"`,
  }),

  /**
   * Новое сообщение от лида
   */
  messageNew: (leadName: string, messagePreview: string) => ({
    type: 'message_new' as const,
    title: `Сообщение от ${leadName}`,
    message: messagePreview.length > 100
      ? messagePreview.substring(0, 100) + '...'
      : messagePreview,
  }),

  /**
   * Системное уведомление
   */
  systemAlert: (message: string) => ({
    type: 'system_alert' as const,
    title: 'Системное уведомление',
    message,
  }),

  /**
   * Ошибка интеграции
   */
  integrationError: (integrationName: string, errorMessage: string) => ({
    type: 'integration_error' as const,
    title: `Ошибка интеграции ${integrationName}`,
    message: errorMessage,
  }),
}
