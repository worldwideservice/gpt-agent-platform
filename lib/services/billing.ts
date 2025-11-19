import { Paddle, Environment } from '@paddle/paddle-node-sdk'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

// Инициализация Paddle Backend SDK
const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: process.env.NEXT_PUBLIC_PADDLE_ENV === 'production'
    ? Environment.production
    : Environment.sandbox,
})

export interface SubscriptionStatus {
  isValid: boolean
  status: string // 'active', 'past_due', 'canceled', 'paused'
  planName?: string
  daysLeft?: number
  nextBillDate?: string
  updatePaymentUrl?: string
}

/**
 * Получение статуса подписки организации (Строгое соответствие KWID)
 */
export const getOrganizationSubscription = async (orgId: string): Promise<SubscriptionStatus> => {
  const supabase = getSupabaseServiceRoleClient()

  // 1. Ищем подписку в БД (синхронизируется через вебхуки)
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('org_id', orgId)
    .neq('status', 'canceled') // Ищем любую не отмененную
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Если подписки нет вообще - бесплатный/триал режим закончился
  if (!sub) {
    return { isValid: false, status: 'free', daysLeft: 0 }
  }

  const now = new Date()
  const endDate = new Date(sub.current_period_end)

  // 2. Логика валидности: 
  // - Статус active или trialing
  // - ИЛИ статус canceled, но дата окончания еще не наступила (grace period)
  const isValid = (['active', 'trialing'].includes(sub.status)) || (endDate > now)

  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  return {
    isValid,
    status: sub.status,
    daysLeft,
    nextBillDate: sub.current_period_end,
    planName: 'Pro Plan' // Можно брать динамически, если планов много
  }
}

/**
 * Конфигурация для открытия чекаута на клиенте
 */
export const getCheckoutConfig = async (orgId: string, userEmail: string) => {
  return {
    customData: { orgId }, // ВАЖНО: Это связывает оплату с организацией в webhook
    userEmail
  }
}
