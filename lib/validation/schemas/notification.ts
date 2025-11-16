import { z } from 'zod'

/**
 * Допустимые типы уведомлений
 */
export const notificationTypes = [
  'lead_new',
  'lead_assigned',
  'lead_status_changed',
  'message_new',
  'system_alert',
  'integration_error',
] as const

/**
 * Схема для GET /api/manage/[tenantId]/notifications
 * Query параметры для фильтрации и пагинации
 */
export const getNotificationsSchema = z.object({
  isRead: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true
      if (val === 'false') return false
      return undefined
    }),
  type: z.enum(notificationTypes).optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().min(1).max(100)),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .pipe(z.number().min(0)),
})

/**
 * Схема для PUT /api/manage/[tenantId]/notifications/read-all
 * Помечает все уведомления пользователя как прочитанные
 * Body не требуется
 */
export const readAllNotificationsSchema = z.object({})

/**
 * Схема для PUT /api/manage/[tenantId]/notifications/[notificationId]/read
 * Помечает одно уведомление как прочитанное
 * Body не требуется (is_read всегда становится true)
 */
export const readNotificationSchema = z.object({})

/**
 * Схема для DELETE /api/manage/[tenantId]/notifications/[notificationId]
 * Body не требуется
 */
export const deleteNotificationSchema = z.object({})

/**
 * Схема для создания уведомления (для внутренних сервисов)
 * Используется service role для создания уведомлений
 */
export const createNotificationSchema = z.object({
  orgId: z.string().uuid({ message: 'Invalid organization ID' }),
  userId: z.string().uuid({ message: 'Invalid user ID' }),
  type: z.enum(notificationTypes, {
    errorMap: () => ({ message: 'Invalid notification type' }),
  }),
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(255, { message: 'Title must be at most 255 characters' }),
  message: z
    .string()
    .min(1, { message: 'Message is required' })
    .max(2000, { message: 'Message must be at most 2000 characters' }),
  metadata: z.record(z.any()).optional().default({}),
  actionUrl: z.string().url({ message: 'Invalid URL' }).optional(),
})

// Export типов для TypeScript
export type GetNotificationsInput = z.infer<typeof getNotificationsSchema>
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>
export type NotificationType = (typeof notificationTypes)[number]
