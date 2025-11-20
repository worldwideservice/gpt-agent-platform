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
    .select('id, status, current_period_end, plan_id, paddle_subscription_id, current_period_start, cancel_at_period_end')
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
  const endDate = sub.current_period_end ? new Date(sub.current_period_end) : new Date()

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

/**
 * Проверка лицензии организации
 */
export const checkLicense = async (orgId: string): Promise<SubscriptionStatus> => {
  return getOrganizationSubscription(orgId)
}

/**
 * Отмена подписки
 */
export const cancelSubscription = async (orgId: string, cancelAtPeriodEnd: boolean): Promise<boolean> => {
  try {
    const supabase = getSupabaseServiceRoleClient()
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('paddle_subscription_id')
      .eq('org_id', orgId)
      .eq('status', 'active')
      .maybeSingle()

    if (!sub?.paddle_subscription_id) {
      return false
    }

    // Отменяем через Paddle API
    await paddle.subscriptions.cancel(sub.paddle_subscription_id, {
      immediately: !cancelAtPeriodEnd,
    })

    // Обновляем в БД
    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: cancelAtPeriodEnd,
        status: cancelAtPeriodEnd ? 'active' : 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('org_id', orgId)

    return true
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return false
  }
}

/**
 * Смена тарифного плана
 */
export const changeSubscriptionPlan = async (orgId: string, newPlanId: string): Promise<boolean> => {
  try {
    const supabase = getSupabaseServiceRoleClient()
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('paddle_subscription_id')
      .eq('org_id', orgId)
      .maybeSingle()

    if (!sub?.paddle_subscription_id) {
      return false
    }

    // Меняем план через Paddle API
    await paddle.subscriptions.update(sub.paddle_subscription_id, {
      items: [
        {
          priceId: newPlanId,
        },
      ],
    })

    // Обновляем в БД
    await supabase
      .from('subscriptions')
      .update({
        plan_id: newPlanId,
        updated_at: new Date().toISOString(),
      })
      .eq('org_id', orgId)

    return true
  } catch (error) {
    console.error('Error changing subscription plan:', error)
    return false
  }
}

/**
 * Обработка Paddle webhook
 */
export const handlePaddleWebhook = async (payload: unknown, signature: string): Promise<boolean> => {
  try {
    // TODO: Реализовать обработку webhook от Paddle
    // Проверка signature, обновление подписки в БД
    console.log('Paddle webhook received:', payload)
    return true
  } catch (error) {
    console.error('Error handling Paddle webhook:', error)
    return false
  }
}
