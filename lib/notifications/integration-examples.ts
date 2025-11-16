/**
 * Примеры интеграции системы уведомлений с бизнес-логикой
 *
 * ВАЖНО: Это reference-файл с примерами.
 * Скопируйте нужные функции в соответствующие обработчики.
 */

import { createNotification, createBulkNotifications, NotificationTemplates } from './create-notification'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

/**
 * Пример 1: Интеграция с Kommo Webhook - новый лид
 *
 * Где использовать: app/api/integrations/kommo/webhooks/route.ts
 */
export async function notifyOnNewLead(params: {
  orgId: string
  leadName: string
  leadId: string
  source: string
  tenantSlug: string
}) {
  const { orgId, leadName, leadId, source, tenantSlug } = params

  // Получаем всех пользователей организации, которые должны получить уведомление
  const supabase = getSupabaseServiceRoleClient()
  const { data: members } = await supabase
    .from('organization_members')
    .select('user_id, role')
    .eq('org_id', orgId)
    .in('role', ['owner', 'admin', 'member']) // Исключаем viewer

  if (!members || members.length === 0) return

  // Создаем уведомления для всех участников
  const template = NotificationTemplates.leadNew(leadName, source)

  await createBulkNotifications(
    members.map((m) => m.user_id),
    {
      ...template,
      orgId,
      actionUrl: `/manage/${tenantSlug}/leads/${leadId}`,
      metadata: {
        leadId,
        source,
        timestamp: new Date().toISOString(),
      },
    }
  )
}

/**
 * Пример 2: Уведомление при назначении лида
 *
 * Где использовать: app/api/agents/[id]/leads-contacts/route.ts
 */
export async function notifyOnLeadAssigned(params: {
  orgId: string
  assignedToUserId: string
  leadName: string
  leadId: string
  assignedByUserName: string
  tenantSlug: string
}) {
  const { orgId, assignedToUserId, leadName, leadId, assignedByUserName, tenantSlug } = params

  const template = NotificationTemplates.leadAssigned(leadName, assignedByUserName)

  await createNotification({
    ...template,
    orgId,
    userId: assignedToUserId,
    actionUrl: `/manage/${tenantSlug}/leads/${leadId}`,
    metadata: {
      leadId,
      assignedBy: assignedByUserName,
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Пример 3: Уведомление об изменении статуса лида
 *
 * Где использовать: app/api/agents/[id]/pipeline-settings/route.ts
 */
export async function notifyOnLeadStatusChange(params: {
  orgId: string
  assignedToUserId: string
  leadName: string
  leadId: string
  oldStatus: string
  newStatus: string
  tenantSlug: string
}) {
  const { orgId, assignedToUserId, leadName, leadId, oldStatus, newStatus, tenantSlug } = params

  const template = NotificationTemplates.leadStatusChanged(leadName, oldStatus, newStatus)

  await createNotification({
    ...template,
    orgId,
    userId: assignedToUserId,
    actionUrl: `/manage/${tenantSlug}/leads/${leadId}`,
    metadata: {
      leadId,
      oldStatus,
      newStatus,
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Пример 4: Уведомление о новом сообщении от лида
 *
 * Где использовать: app/api/chat/route.ts или webhook обработчик сообщений
 */
export async function notifyOnNewMessage(params: {
  orgId: string
  assignedToUserId: string
  leadName: string
  leadId: string
  messageText: string
  tenantSlug: string
}) {
  const { orgId, assignedToUserId, leadName, leadId, messageText, tenantSlug } = params

  const template = NotificationTemplates.messageNew(leadName, messageText)

  await createNotification({
    ...template,
    orgId,
    userId: assignedToUserId,
    actionUrl: `/manage/${tenantSlug}/chat/${leadId}`,
    metadata: {
      leadId,
      messagePreview: messageText.substring(0, 100),
      timestamp: new Date().toISOString(),
    },
  })
}

/**
 * Пример 5: Уведомление об ошибке интеграции
 *
 * Где использовать: app/api/integrations/[...]/sync/route.ts
 */
export async function notifyOnIntegrationError(params: {
  orgId: string
  integrationName: string
  errorMessage: string
  tenantSlug: string
}) {
  const { orgId, integrationName, errorMessage, tenantSlug } = params

  // Уведомляем только владельцев и администраторов
  const supabase = getSupabaseServiceRoleClient()
  const { data: admins } = await supabase
    .from('organization_members')
    .select('user_id')
    .eq('org_id', orgId)
    .in('role', ['owner', 'admin'])

  if (!admins || admins.length === 0) return

  const template = NotificationTemplates.integrationError(integrationName, errorMessage)

  await createBulkNotifications(
    admins.map((a) => a.user_id),
    {
      ...template,
      orgId,
      actionUrl: `/manage/${tenantSlug}/integrations`,
      metadata: {
        integrationName,
        errorDetails: errorMessage,
        timestamp: new Date().toISOString(),
      },
    }
  )
}

/**
 * Пример 6: Системное уведомление для всех пользователей
 *
 * Где использовать: Admin endpoints или cron jobs
 */
export async function notifySystemAlert(params: {
  orgId: string
  message: string
  tenantSlug?: string
}) {
  const { orgId, message, tenantSlug } = params

  const supabase = getSupabaseServiceRoleClient()
  const { data: members } = await supabase
    .from('organization_members')
    .select('user_id')
    .eq('org_id', orgId)

  if (!members || members.length === 0) return

  const template = NotificationTemplates.systemAlert(message)

  await createBulkNotifications(
    members.map((m) => m.user_id),
    {
      ...template,
      orgId,
      actionUrl: tenantSlug ? `/manage/${tenantSlug}` : undefined,
      metadata: {
        isSystemAlert: true,
        timestamp: new Date().toISOString(),
      },
    }
  )
}

/**
 * INTEGRATION GUIDE:
 *
 * 1. В обработчике webhook Kommo (app/api/integrations/kommo/webhooks/route.ts):
 *    ```ts
 *    import { notifyOnNewLead } from '@/lib/notifications/integration-examples'
 *
 *    // После создания лида:
 *    await notifyOnNewLead({
 *      orgId: agent.org_id,
 *      leadName: lead.name,
 *      leadId: lead.id,
 *      source: 'Kommo',
 *      tenantSlug: organization.slug,
 *    })
 *    ```
 *
 * 2. В API назначения лида (app/api/agents/[id]/leads-contacts/route.ts):
 *    ```ts
 *    import { notifyOnLeadAssigned } from '@/lib/notifications/integration-examples'
 *
 *    await notifyOnLeadAssigned({
 *      orgId: agent.org_id,
 *      assignedToUserId: assignedTo,
 *      leadName: lead.name,
 *      leadId: lead.id,
 *      assignedByUserName: session.user.name,
 *      tenantSlug: tenantId,
 *    })
 *    ```
 *
 * 3. В обработчике ошибок интеграции:
 *    ```ts
 *    import { notifyOnIntegrationError } from '@/lib/notifications/integration-examples'
 *
 *    catch (error) {
 *      await notifyOnIntegrationError({
 *        orgId: agent.org_id,
 *        integrationName: 'Kommo',
 *        errorMessage: error.message,
 *        tenantSlug: organization.slug,
 *      })
 *    }
 *    ```
 */
