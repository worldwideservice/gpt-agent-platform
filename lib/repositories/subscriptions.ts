import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

import type { SubscriptionRow } from '@/types/supabase'

export interface SubscriptionData {
  plan: string
  status: string
  tokenQuota: number
  tokenUsed: number
  renewsAt: string | null
}

export const getSubscription = async (organizationId: string): Promise<SubscriptionData | null> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('org_id', organizationId)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch subscription', error)
    return null
  }

  if (!data) {
    return null
  }

  const row = data as SubscriptionRow

  return {
    plan: row.plan,
    status: row.status,
    tokenQuota: row.token_quota,
    tokenUsed: row.token_used,
    renewsAt: row.renews_at,
  }
}

export const updateSubscription = async (
  organizationId: string,
  data: {
    plan?: string
    status?: string
    tokenQuota?: number
    tokenUsed?: number
    renewsAt?: string | null
  },
): Promise<SubscriptionData> => {
  const supabase = getSupabaseServiceRoleClient()

  const updatePayload: Record<string, unknown> = {}

  if (data.plan !== undefined) {
    updatePayload.plan = data.plan
  }

  if (data.status !== undefined) {
    updatePayload.status = data.status
  }

  if (data.tokenQuota !== undefined) {
    updatePayload.token_quota = data.tokenQuota
  }

  if (data.tokenUsed !== undefined) {
    updatePayload.token_used = data.tokenUsed
  }

  if (data.renewsAt !== undefined) {
    updatePayload.renews_at = data.renewsAt
  }

  const { data: subscriptionData, error } = await supabase
    .from('subscriptions')
    .update(updatePayload)
    .eq('org_id', organizationId)
    .select('*')
    .single()

  if (error) {
    console.error('Failed to update subscription', error)
    throw new Error('Не удалось обновить подписку')
  }

  if (!subscriptionData) {
    throw new Error('Подписка не найдена')
  }

  const row = subscriptionData as SubscriptionRow

  return {
    plan: row.plan,
    status: row.status,
    tokenQuota: row.token_quota,
    tokenUsed: row.token_used,
    renewsAt: row.renews_at,
  }
}















