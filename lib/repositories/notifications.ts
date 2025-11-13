import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

export interface Notification {
 id: string
 orgId: string
 userId: string | null
 type: 'info' | 'warning' | 'error' | 'success'
 title: string
 message: string | null
 linkUrl: string | null
 linkText: string | null
 isRead: boolean
 metadata: Record<string, unknown>
 createdAt: string
}

interface NotificationRow {
 id: string
 org_id: string
 user_id: string | null
 type: string
 title: string
 message: string | null
 link_url: string | null
 link_text: string | null
 is_read: boolean
 metadata: unknown
 created_at: string
}

const mapNotificationRowToDomain = (row: NotificationRow): Notification => {
 return {
 id: row.id,
 orgId: row.org_id,
 userId: row.user_id,
 type: (row.type as Notification['type']) ?? 'info',
 title: row.title,
 message: row.message,
 linkUrl: row.link_url,
 linkText: row.link_text,
 isRead: row.is_read,
 metadata: (row.metadata as Record<string, unknown>) ?? {},
 createdAt: row.created_at,
 }
}

const formatTimestamp = (dateString: string): string => {
 const date = new Date(dateString)
 const now = new Date()
 const diffMs = now.getTime() - date.getTime()
 const diffMins = Math.floor(diffMs / 60000)
 const diffHours = Math.floor(diffMs / 3600000)
 const diffDays = Math.floor(diffMs / 86400000)

 if (diffMins < 1) {
 return 'только что'
 }

 if (diffMins < 60) {
 return `${diffMins} ${diffMins === 1 ? 'минуту' : diffMins < 5 ? 'минуты' : 'минут'} назад`
 }

 if (diffHours < 24) {
 return `${diffHours} ${diffHours === 1 ? 'час' : diffHours < 5 ? 'часа' : 'часов'} назад`
 }

 if (diffDays < 7) {
 return `${diffDays} ${diffDays === 1 ? 'день' : diffDays < 5 ? 'дня' : 'дней'} назад`
 }

 return new Intl.DateTimeFormat('ru-RU', {
 day: '2-digit',
 month: 'short',
 year: 'numeric',
 }).format(date)
}

export const getNotifications = async (
 organizationId: string,
 userId?: string | null,
 options?: { unreadOnly?: boolean; limit?: number },
): Promise<Notification[]> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('notifications')
 .select('*')
 .eq('org_id', organizationId)
 .order('created_at', { ascending: false })

 if (userId) {
 query = query.or(`user_id.is.null,user_id.eq.${userId}`)
 } else {
 query = query.is('user_id', null)
 }

 if (options?.unreadOnly) {
 query = query.eq('is_read', false)
 }

 if (options?.limit) {
 query = query.limit(options.limit)
 }

 const { data, error } = await query

 if (error) {
 logger.error('Failed to fetch notifications', error, { organizationId, userId, unreadOnly: options?.unreadOnly })
 throw new Error('Не удалось загрузить уведомления')
 }

 return ((data as NotificationRow[] | null) ?? []).map(mapNotificationRowToDomain)
}

export const markNotificationAsRead = async (notificationId: string, organizationId: string): Promise<void> => {
 const supabase = getSupabaseServiceRoleClient()

 const { error } = await supabase
 .from('notifications')
 .update({ is_read: true })
 .eq('id', notificationId)
 .eq('org_id', organizationId)

 if (error) {
 logger.error('Failed to mark notification as read', error, { notificationId, organizationId })
 throw new Error('Не удалось отметить уведомление как прочитанное')
 }
}

export const markAllNotificationsAsRead = async (organizationId: string, userId?: string | null): Promise<void> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('notifications')
 .update({ is_read: true })
 .eq('org_id', organizationId)
 .eq('is_read', false)

 if (userId) {
 query = query.or(`user_id.is.null,user_id.eq.${userId}`)
 } else {
 query = query.is('user_id', null)
 }

 const { error } = await query

 if (error) {
 logger.error('Failed to mark all notifications as read', error, { organizationId, userId })
 throw new Error('Не удалось отметить все уведомления как прочитанные')
 }
}

export const deleteNotification = async (notificationId: string, organizationId: string): Promise<void> => {
 const supabase = getSupabaseServiceRoleClient()

 const { error } = await supabase
 .from('notifications')
 .delete()
 .eq('id', notificationId)
 .eq('org_id', organizationId)

 if (error) {
 logger.error('Failed to delete notification', error, { notificationId, organizationId })
 throw new Error('Не удалось удалить уведомление')
 }
}

export const deleteAllNotifications = async (organizationId: string, userId?: string | null): Promise<void> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase.from('notifications').delete().eq('org_id', organizationId)

 if (userId) {
 query = query.or(`user_id.is.null,user_id.eq.${userId}`)
 } else {
 query = query.is('user_id', null)
 }

 const { error } = await query

 if (error) {
 logger.error('Failed to delete all notifications', error, { organizationId, userId })
 throw new Error('Не удалось удалить все уведомления')
 }
}

export const getUnreadCount = async (organizationId: string, userId?: string | null): Promise<number> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('notifications')
 .select('id', { count: 'exact', head: true })
 .eq('org_id', organizationId)
 .eq('is_read', false)

 if (userId) {
 query = query.or(`user_id.is.null,user_id.eq.${userId}`)
 } else {
 query = query.is('user_id', null)
 }

 const { count, error } = await query

 if (error) {
 logger.error('Failed to get unread count', error, { organizationId, userId })
 return 0
 }

 return count ?? 0
}

export const createNotification = async (
 organizationId: string,
 data: {
 userId?: string | null
 type?: Notification['type']
 title: string
 message?: string | null
 linkUrl?: string | null
 linkText?: string | null
 metadata?: Record<string, unknown>
 },
): Promise<Notification> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data: notificationData, error } = await supabase
 .from('notifications')
 .insert({
 org_id: organizationId,
 user_id: data.userId ?? null,
 type: data.type ?? 'info',
 title: data.title,
 message: data.message ?? null,
 link_url: data.linkUrl ?? null,
 link_text: data.linkText ?? null,
 metadata: data.metadata ?? {},
 })
 .select('*')
 .single()

 if (error) {
 logger.error('Failed to create notification', error, { organizationId, userId: data.userId, title: data.title, type: data.type })
 throw new Error('Не удалось создать уведомление')
 }

 return mapNotificationRowToDomain(notificationData as NotificationRow)
}

export { formatTimestamp }

