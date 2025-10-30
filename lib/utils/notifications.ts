import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

import { createNotification } from '@/lib/repositories/notifications'

/**
 * Утилиты для создания уведомлений в системе
 */

interface NotificationData {
  userId?: string | null
  type?: 'info' | 'warning' | 'error' | 'success'
  title: string
  message?: string | null
  linkUrl?: string | null
  linkText?: string | null
  metadata?: Record<string, unknown>
}

/**
 * Создает уведомление для организации или конкретного пользователя
 */
export const notifyOrganization = async (
  organizationId: string,
  data: NotificationData,
): Promise<void> => {
  try {
    await createNotification(organizationId, data)
  } catch (error) {
    console.error('Failed to notify organization', error)
  }
}

/**
 * Создает уведомление о достижении лимита ответов ИИ
 */
export const notifyLimitReached = async (
  organizationId: string,
  userId: string | null,
  options: {
    currentUsage: number
    limit: number
    planName?: string
  },
): Promise<void> => {
  await notifyOrganization(organizationId, {
    userId,
    type: 'warning',
    title: 'Месячный лимит достигнут: ответы ИИ отключены',
    message: `Ответы ИИ отключены, вы достигли месячного лимита в ${options.limit.toLocaleString('ru-RU')} ответов.`,
    linkUrl: '/pricing',
    linkText: 'Обновить план',
    metadata: {
      limitReached: true,
      currentUsage: options.currentUsage,
      limit: options.limit,
      planName: options.planName,
    },
  })
}

/**
 * Создает уведомление о приближении к лимиту
 */
export const notifyLimitApproaching = async (
  organizationId: string,
  userId: string | null,
  options: {
    currentUsage: number
    limit: number
    percentage: number
  },
): Promise<void> => {
  await notifyOrganization(organizationId, {
    userId,
    type: 'warning',
    title: `Приближение к лимиту: использовано ${options.percentage}%`,
    message: `Использовано ${options.currentUsage.toLocaleString('ru-RU')} из ${options.limit.toLocaleString('ru-RU')} ответов ИИ в этом месяце.`,
    linkUrl: '/pricing',
    linkText: 'Посмотреть тарифы',
    metadata: {
      limitApproaching: true,
      currentUsage: options.currentUsage,
      limit: options.limit,
      percentage: options.percentage,
    },
  })
}

/**
 * Создает уведомление об успешной интеграции
 */
export const notifyIntegrationConnected = async (
  organizationId: string,
  userId: string | null,
  integrationName: string,
): Promise<void> => {
  await notifyOrganization(organizationId, {
    userId,
    type: 'success',
    title: `Интеграция "${integrationName}" успешно подключена`,
    message: `Интеграция готова к использованию. Вы можете настроить её в разделе интеграций.`,
    linkUrl: '/integrations',
    linkText: 'Перейти к интеграциям',
    metadata: {
      integrationConnected: true,
      integrationName,
    },
  })
}

/**
 * Создает уведомление об ошибке интеграции
 */
export const notifyIntegrationError = async (
  organizationId: string,
  userId: string | null,
  integrationName: string,
  errorMessage: string,
): Promise<void> => {
  await notifyOrganization(organizationId, {
    userId,
    type: 'error',
    title: `Ошибка интеграции "${integrationName}"`,
    message: errorMessage,
    linkUrl: '/integrations',
    linkText: 'Проверить интеграцию',
    metadata: {
      integrationError: true,
      integrationName,
      errorMessage,
    },
  })
}

/**
 * Создает уведомление о создании агента
 */
export const notifyAgentCreated = async (
  organizationId: string,
  userId: string | null,
  agentName: string,
  agentId: string,
): Promise<void> => {
  await notifyOrganization(organizationId, {
    userId,
    type: 'success',
    title: `Агент "${agentName}" создан`,
    message: 'Агент готов к настройке и активации.',
    linkUrl: `/agents/${agentId}`,
    linkText: 'Настроить агента',
    metadata: {
      agentCreated: true,
      agentName,
      agentId,
    },
  })
}

/**
 * Создает уведомление о важном событии в системе
 */
export const notifySystemEvent = async (
  organizationId: string,
  userId: string | null,
  title: string,
  message: string,
  type: 'info' | 'warning' | 'error' | 'success' = 'info',
): Promise<void> => {
  await notifyOrganization(organizationId, {
    userId,
    type,
    title,
    message,
  })
}









