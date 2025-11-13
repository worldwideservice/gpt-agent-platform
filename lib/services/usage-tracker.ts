/**
 * Сервис для отслеживания использования ресурсов
 * Автоматически обновляет usage_records и проверяет лимиты
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils'
import { getOrganizationSubscription } from './billing'

export type ResourceType = 'tokens' | 'messages' | 'storage' | 'agents'

interface UsageLimit {
  tokens_per_month?: number
  messages_per_month?: number
  storage_gb?: number
  agents?: number
}

/**
 * Записывает использование ресурса
 */
export const recordUsage = async (
  orgId: string,
  resourceType: ResourceType,
  amount: number,
  description?: string,
  metadata?: Record<string, unknown>
): Promise<void> => {
  try {
    const supabase = getSupabaseServiceRoleClient()

    // Получаем текущую подписку
    const subscription = await getOrganizationSubscription(orgId)
    const subscriptionId = subscription?.id || null

    // Записываем использование
    await supabase.from('usage_records').insert({
      org_id: orgId,
      subscription_id: subscriptionId,
      resource_type: resourceType,
      amount,
      description: description || `Использование ${resourceType}`,
      metadata: metadata || {},
    })
  } catch (error) {
    logger.error('Failed to record usage', error instanceof Error ? error : new Error(String(error)), { orgId, resourceType, amount })
    // Не выбрасываем ошибку, чтобы не прервать выполнение основного кода
  }
}

/**
 * Проверяет, не превышен ли лимит использования
 */
export const checkUsageLimit = async (
  orgId: string,
  resourceType: ResourceType,
  amount: number = 1
): Promise<{ allowed: boolean; current: number; limit: number }> => {
  try {
    const supabase = getSupabaseServiceRoleClient()

    // Получаем текущую подписку и план
    const subscription = await getOrganizationSubscription(orgId)
    
    if (!subscription) {
      // Если нет подписки - используем бесплатный план (очень ограниченный)
      return {
        allowed: false,
        current: 0,
        limit: 0,
      }
    }

    // Получаем план
    const { data: plan } = await supabase
      .from('billing_plans')
      .select('limits')
      .eq('id', subscription.plan_id)
      .single()

    if (!plan) {
      return {
        allowed: false,
        current: 0,
        limit: 0,
      }
    }

    const limits = plan.limits as UsageLimit
    const limitKey = resourceType === 'tokens' ? 'tokens_per_month' :
                     resourceType === 'messages' ? 'messages_per_month' :
                     resourceType === 'storage' ? 'storage_gb' :
                     'agents'

    const limit = limits[limitKey as keyof UsageLimit] as number

    // Если лимит -1, значит неограниченно
    if (limit === -1) {
      return {
        allowed: true,
        current: 0,
        limit: -1,
      }
    }

    // Получаем текущее использование за текущий месяц
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const { data: usageRecords } = await supabase
      .from('usage_records')
      .select('amount')
      .eq('org_id', orgId)
      .eq('resource_type', resourceType)
      .gte('recorded_at', startOfMonth.toISOString())
      .lte('recorded_at', endOfMonth.toISOString())

    const current = usageRecords?.reduce((sum, record) => sum + Number(record.amount), 0) || 0
    const newTotal = current + amount

    return {
      allowed: newTotal <= limit,
      current,
      limit,
    }
  } catch (error) {
    logger.error('Failed to check usage limit', error instanceof Error ? error : new Error(String(error)), { orgId, resourceType, amount })
    // В случае ошибки разрешаем использование (fail-open)
    return {
      allowed: true,
      current: 0,
      limit: -1,
    }
  }
}

/**
 * Проверяет и записывает использование с проверкой лимитов
 * @note Это НЕ React hook, а обычная async функция для отслеживания использования ресурсов
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
export const useResource = async (
  orgId: string,
  resourceType: ResourceType,
  amount: number,
  description?: string,
  metadata?: Record<string, unknown>
): Promise<{ allowed: boolean; current: number; limit: number }> => {
  // Сначала проверяем лимит
  const limitCheck = await checkUsageLimit(orgId, resourceType, amount)

  if (!limitCheck.allowed) {
    return limitCheck
  }

  // Если лимит не превышен - записываем использование
  await recordUsage(orgId, resourceType, amount, description, metadata)

  return limitCheck
}






