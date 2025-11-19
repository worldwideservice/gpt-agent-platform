/**
 * Сервіс біллінгу та підписок
 * Інтеграція з Paddle для управління платежами та підписками
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'
import crypto from 'crypto'

// Paddle API configuration
const PADDLE_API_URL = 'https://api.paddle.com'
const PADDLE_API_KEY = process.env.PADDLE_API_KEY
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET
const PADDLE_ENVIRONMENT = process.env.PADDLE_ENVIRONMENT || 'production' // 'sandbox' or 'production'

// Типи статусів підписки
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'expired' | 'unpaid' | 'on_trial' | 'paused'

export interface LicenseCheckResult {
  isValid: boolean
  status: SubscriptionStatus
  daysLeft?: number
  planName?: string
  trialEndsAt?: string
}

export interface BillingPlan {
  id: string
  name: string
  description?: string
  price_id: string // Paddle price ID
  price_cents: number
  currency: string
  interval: 'month' | 'year'
  features: Record<string, any>
  limits: {
    agents: number
    tokens_per_month: number
    messages_per_month: number
    storage_gb: number
  }
  is_active: boolean
}

export interface Subscription {
  id: string
  org_id: string
  paddle_subscription_id: string
  paddle_customer_id: string
  plan_id: string
  price_id: string
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  trial_ends_at?: string
  renews_at?: string
  ends_at?: string
  cancel_at_period_end: boolean
  usage_limits: Record<string, number>
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface UsageRecord {
  id: string
  org_id: string
  subscription_id?: string
  resource_type: 'tokens' | 'messages' | 'storage' | 'agents'
  amount: number
  cost_cents?: number
  description?: string
  recorded_at: string
  metadata: Record<string, any>
}

/**
 * Helper функція для запитів до Paddle API
 */
const paddleRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  if (!PADDLE_API_KEY) {
    throw new Error('PADDLE_API_KEY is not configured')
  }

  const response = await fetch(`${PADDLE_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${PADDLE_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    logger.error('Paddle API error', { error, endpoint, status: response.status })
    throw new Error(`Paddle API error: ${error}`)
  }

  return response.json()
}

/**
 * Перевірка статусу ліцензії для організації
 * Використовується в Middleware та на UI для блокування функцій
 */
export const checkLicense = async (tenantId: string): Promise<LicenseCheckResult> => {
  try {
    const subscription = await getOrganizationSubscription(tenantId)

    if (!subscription) {
      return {
        isValid: false,
        status: 'expired',
        daysLeft: 0,
      }
    }

    const now = new Date()
    const periodEnd = new Date(subscription.current_period_end)
    const daysLeft = Math.ceil((periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    const isValid = ['active', 'on_trial'].includes(subscription.status) && daysLeft > 0

    return {
      isValid,
      status: subscription.status,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      planName: subscription.plan_id,
      trialEndsAt: subscription.trial_ends_at,
    }
  } catch (error) {
    logger.error('Error checking license', error, { tenantId })
    return {
      isValid: false,
      status: 'expired',
      daysLeft: 0,
    }
  }
}

/**
 * Створення checkout сесії в Paddle
 */
export const createCheckoutSession = async (
  tenantId: string,
  priceId: string,
  successUrl: string,
  cancelUrl?: string
): Promise<string | null> => {
  try {
    const supabase = getSupabaseServiceRoleClient()

    // Отримуємо інформацію про організацію
    const { data: org } = await supabase
      .from('organizations')
      .select('name, email')
      .eq('id', tenantId)
      .single()

    if (!org) {
      throw new Error('Organization not found')
    }

    // Створюємо транзакцію для checkout
    const response = await paddleRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        items: [
          {
            price_id: priceId,
            quantity: 1,
          },
        ],
        customer_email: org.email || undefined,
        custom_data: {
          org_id: tenantId,
        },
        checkout: {
          url: successUrl,
          settings: {
            success_url: successUrl,
            ...(cancelUrl && { cancel_url: cancelUrl }),
          },
        },
      }),
    })

    // Paddle повертає checkout URL у відповіді
    return response.data?.checkout?.url || null
  } catch (error) {
    logger.error('Error creating checkout session', error, { tenantId, priceId })
    return null
  }
}

/**
 * Обробка webhook від Paddle
 */
export const handlePaddleWebhook = async (
  payload: any,
  signature: string
): Promise<boolean> => {
  try {
    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature)) {
      logger.error('Invalid Paddle webhook signature')
      return false
    }

    const eventType = payload.event_type

    logger.info('Processing Paddle webhook', { eventType, eventId: payload.event_id })

    switch (eventType) {
      case 'subscription.created':
        return await handleSubscriptionCreated(payload.data)

      case 'subscription.updated':
        return await handleSubscriptionUpdated(payload.data)

      case 'subscription.canceled':
      case 'subscription.expired':
        return await handleSubscriptionCancelled(payload.data)

      case 'subscription.resumed':
        return await handleSubscriptionResumed(payload.data)

      case 'subscription.paused':
        return await handleSubscriptionPaused(payload.data)

      case 'transaction.completed':
        return await handleTransactionCompleted(payload.data)

      case 'transaction.payment_failed':
        return await handlePaymentFailed(payload.data)

      default:
        logger.info('Unhandled Paddle webhook event', { eventType })
        return true
    }
  } catch (error) {
    logger.error('Error handling Paddle webhook', error)
    return false
  }
}

/**
 * Verify Paddle webhook signature
 */
const verifyWebhookSignature = (payload: any, signature: string): boolean => {
  if (!PADDLE_WEBHOOK_SECRET) {
    logger.warn('PADDLE_WEBHOOK_SECRET is not configured, skipping signature verification')
    return true // В розробці можна пропустити
  }

  try {
    // Paddle uses TS1 signature format (HMAC SHA256)
    const hmac = crypto.createHmac('sha256', PADDLE_WEBHOOK_SECRET)
    const payloadString = JSON.stringify(payload)
    const computedSignature = hmac.update(payloadString).digest('hex')

    // Paddle signature format: "ts=timestamp;h1=signature"
    const signatureParts = signature.split(';')
    const h1 = signatureParts.find((part) => part.startsWith('h1='))?.split('=')[1]

    if (!h1) {
      logger.error('Invalid signature format', { signature })
      return false
    }

    return crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(computedSignature))
  } catch (error) {
    logger.error('Error verifying webhook signature', error)
    return false
  }
}

/**
 * Обробка створення підписки
 */
const handleSubscriptionCreated = async (subscriptionData: any): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()
  const customData = subscriptionData.custom_data || {}
  const orgId = customData.org_id

  if (!orgId) {
    logger.error('Missing org_id in Paddle subscription webhook', { subscriptionData })
    return false
  }

  try {
    const { error } = await supabase.from('subscriptions').insert({
      org_id: orgId,
      paddle_subscription_id: subscriptionData.id,
      paddle_customer_id: subscriptionData.customer_id,
      price_id: subscriptionData.items?.[0]?.price?.id,
      status: mapPaddleStatus(subscriptionData.status),
      current_period_start: subscriptionData.current_billing_period?.starts_at,
      current_period_end: subscriptionData.current_billing_period?.ends_at,
      trial_ends_at: subscriptionData.first_billed_at,
      renews_at: subscriptionData.next_billed_at,
      ends_at: subscriptionData.canceled_at || subscriptionData.paused_at,
      cancel_at_period_end: subscriptionData.scheduled_change !== null,
      metadata: {
        collection_mode: subscriptionData.collection_mode,
        billing_cycle: subscriptionData.billing_cycle,
      },
    })

    if (error) {
      logger.error('Error saving Paddle subscription', error, { orgId })
      return false
    }

    logger.info('Paddle subscription created', { orgId, subscriptionId: subscriptionData.id })
    return true
  } catch (error) {
    logger.error('Error handling Paddle subscription created', error, { orgId })
    return false
  }
}

/**
 * Обробка оновлення підписки
 */
const handleSubscriptionUpdated = async (subscriptionData: any): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()

  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: mapPaddleStatus(subscriptionData.status),
        current_period_start: subscriptionData.current_billing_period?.starts_at,
        current_period_end: subscriptionData.current_billing_period?.ends_at,
        trial_ends_at: subscriptionData.first_billed_at,
        renews_at: subscriptionData.next_billed_at,
        ends_at: subscriptionData.canceled_at || subscriptionData.paused_at,
        cancel_at_period_end: subscriptionData.scheduled_change !== null,
        updated_at: new Date().toISOString(),
        metadata: {
          collection_mode: subscriptionData.collection_mode,
          billing_cycle: subscriptionData.billing_cycle,
        },
      })
      .eq('paddle_subscription_id', subscriptionData.id)

    if (error) {
      logger.error('Error updating Paddle subscription', error)
      return false
    }

    logger.info('Paddle subscription updated', { subscriptionId: subscriptionData.id })
    return true
  } catch (error) {
    logger.error('Error updating subscription', error, { subscriptionId: subscriptionData.id })
    return false
  }
}

/**
 * Обробка скасування підписки
 */
const handleSubscriptionCancelled = async (subscriptionData: any): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()

  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        cancel_at_period_end: true,
        ends_at: subscriptionData.canceled_at,
        updated_at: new Date().toISOString(),
      })
      .eq('paddle_subscription_id', subscriptionData.id)

    if (error) {
      logger.error('Error cancelling Paddle subscription', error)
      return false
    }

    logger.info('Paddle subscription cancelled', { subscriptionId: subscriptionData.id })
    return true
  } catch (error) {
    logger.error('Error cancelling subscription', error, { subscriptionId: subscriptionData.id })
    return false
  }
}

/**
 * Обробка відновлення підписки
 */
const handleSubscriptionResumed = async (subscriptionData: any): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()

  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        cancel_at_period_end: false,
        ends_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('paddle_subscription_id', subscriptionData.id)

    if (error) {
      logger.error('Error resuming Paddle subscription', error)
      return false
    }

    logger.info('Paddle subscription resumed', { subscriptionId: subscriptionData.id })
    return true
  } catch (error) {
    logger.error('Error resuming subscription', error, { subscriptionId: subscriptionData.id })
    return false
  }
}

/**
 * Обробка паузи підписки
 */
const handleSubscriptionPaused = async (subscriptionData: any): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()

  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'paused',
        ends_at: subscriptionData.paused_at,
        updated_at: new Date().toISOString(),
      })
      .eq('paddle_subscription_id', subscriptionData.id)

    if (error) {
      logger.error('Error pausing Paddle subscription', error)
      return false
    }

    logger.info('Paddle subscription paused', { subscriptionId: subscriptionData.id })
    return true
  } catch (error) {
    logger.error('Error pausing subscription', error, { subscriptionId: subscriptionData.id })
    return false
  }
}

/**
 * Обробка завершеної транзакції (успішної оплати)
 */
const handleTransactionCompleted = async (transactionData: any): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()
  const subscriptionId = transactionData.subscription_id

  if (!subscriptionId) {
    logger.info('Transaction completed (one-time payment)', { transactionId: transactionData.id })
    return true
  }

  try {
    // Оновлюємо статус підписки на active після успішної оплати
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('paddle_subscription_id', subscriptionId)

    if (error) {
      logger.error('Error updating subscription after payment', error)
      return false
    }

    logger.info('Payment succeeded for subscription', { subscriptionId, transactionId: transactionData.id })
    return true
  } catch (error) {
    logger.error('Error handling transaction completed', error)
    return false
  }
}

/**
 * Обробка неуспішної оплати
 */
const handlePaymentFailed = async (transactionData: any): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()
  const subscriptionId = transactionData.subscription_id

  if (!subscriptionId) {
    logger.info('One-time payment failed', { transactionId: transactionData.id })
    return true
  }

  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('paddle_subscription_id', subscriptionId)

    if (error) {
      logger.error('Error marking subscription as past_due', error)
      return false
    }

    logger.warn('Payment failed for subscription', { subscriptionId, transactionId: transactionData.id })
    return true
  } catch (error) {
    logger.error('Error handling payment failed', error, { subscriptionId: transactionData.id })
    return false
  }
}

/**
 * Map Paddle status to our status
 */
const mapPaddleStatus = (status: string): SubscriptionStatus => {
  const statusMap: Record<string, SubscriptionStatus> = {
    'trialing': 'on_trial',
    'active': 'active',
    'paused': 'paused',
    'past_due': 'past_due',
    'canceled': 'canceled',
    'expired': 'expired',
  }

  return statusMap[status] || 'expired'
}

/**
 * Отримання поточної підписки організації
 */
export const getOrganizationSubscription = async (
  orgId: string
): Promise<Subscription | null> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('org_id', orgId)
    .in('status', ['active', 'on_trial', 'past_due'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

/**
 * Отримання доступних планів підписки
 */
export const getBillingPlans = async (): Promise<BillingPlan[]> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('billing_plans')
    .select('*')
    .eq('is_active', true)
    .order('price_cents', { ascending: true })

  if (error) {
    logger.error('Error getting billing plans', error)
    return []
  }

  return data ?? []
}

/**
 * Запис використання ресурсу
 */
export const recordUsage = async (
  orgId: string,
  resourceType: UsageRecord['resource_type'],
  amount: number,
  description?: string,
  metadata: Record<string, any> = {}
): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()

  try {
    const subscription = await getOrganizationSubscription(orgId)

    const { error } = await supabase.from('usage_records').insert({
      org_id: orgId,
      subscription_id: subscription?.id,
      resource_type: resourceType,
      amount,
      description,
      metadata,
    })

    if (error) {
      logger.error('Error recording usage', error, { orgId, resourceType, amount })
      return false
    }

    // Перевіряємо ліміти
    await checkUsageLimits(orgId, resourceType)

    return true
  } catch (error) {
    logger.error('Error recording usage', error, { orgId, resourceType, amount })
    return false
  }
}

/**
 * Отримання статистики використання за період
 */
export const getUsageStats = async (
  orgId: string,
  startDate: Date,
  endDate: Date
): Promise<Record<string, number>> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('usage_records')
    .select('resource_type, amount')
    .eq('org_id', orgId)
    .gte('recorded_at', startDate.toISOString())
    .lte('recorded_at', endDate.toISOString())

  if (error) {
    logger.error('Error getting usage stats', error, { orgId })
    return {}
  }

  const stats: Record<string, number> = {}
  for (const record of data ?? []) {
    stats[record.resource_type] = (stats[record.resource_type] || 0) + record.amount
  }

  return stats
}

/**
 * Перевірка лімітів використання
 */
const checkUsageLimits = async (
  orgId: string,
  resourceType: UsageRecord['resource_type']
): Promise<void> => {
  const subscription = await getOrganizationSubscription(orgId)
  if (!subscription) return

  const currentUsage = await getUsageStats(
    orgId,
    new Date(subscription.current_period_start),
    new Date(subscription.current_period_end)
  )

  const limit = subscription.usage_limits[resourceType]
  const current = currentUsage[resourceType] || 0

  if (limit && current >= limit * 0.9) {
    logger.warn('Usage limit warning', { resourceType, current, limit, orgId })
  }

  if (limit && current >= limit) {
    logger.error('Usage limit exceeded', { resourceType, current, limit, orgId })
  }
}

/**
 * Скасування підписки через Paddle API
 */
export const cancelSubscription = async (
  orgId: string,
  cancelAtPeriodEnd = true
): Promise<boolean> => {
  const subscription = await getOrganizationSubscription(orgId)
  if (!subscription) {
    return false
  }

  try {
    const body: any = {}

    if (cancelAtPeriodEnd) {
      // Скасувати в кінці періоду
      body.scheduled_change = {
        action: 'cancel',
        effective_at: 'next_billing_period',
      }
    } else {
      // Скасувати негайно
      body.effective_from = 'immediately'
    }

    await paddleRequest(`/subscriptions/${subscription.paddle_subscription_id}/cancel`, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    logger.info('Subscription cancellation requested', { orgId, cancelAtPeriodEnd })
    return true
  } catch (error) {
    logger.error('Error canceling subscription', error, { orgId, cancelAtPeriodEnd })
    return false
  }
}

/**
 * Відновлення підписки
 */
export const resumeSubscription = async (orgId: string): Promise<boolean> => {
  const subscription = await getOrganizationSubscription(orgId)
  if (!subscription) {
    return false
  }

  try {
    await paddleRequest(`/subscriptions/${subscription.paddle_subscription_id}/resume`, {
      method: 'POST',
      body: JSON.stringify({
        effective_from: 'immediately',
      }),
    })

    logger.info('Subscription resumed', { orgId })
    return true
  } catch (error) {
    logger.error('Error resuming subscription', error, { orgId })
    return false
  }
}

/**
 * Отримання посилання на customer portal (Paddle Billing)
 */
export const getCustomerPortalUrl = async (orgId: string): Promise<string | null> => {
  const subscription = await getOrganizationSubscription(orgId)
  if (!subscription) {
    return null
  }

  try {
    // Paddle не має окремого customer portal API,
    // але підписка містить management URLs у відповіді
    const response = await paddleRequest(`/subscriptions/${subscription.paddle_subscription_id}`)

    // URL для управління підпискою знаходиться в management_urls
    return response.data?.management_urls?.update_payment_method || null
  } catch (error) {
    logger.error('Error getting customer portal URL', error, { orgId })
    return null
  }
}

/**
 * Зміна плану підписки
 */
export const changeSubscriptionPlan = async (
  orgId: string,
  newPriceId: string
): Promise<boolean> => {
  const subscription = await getOrganizationSubscription(orgId)
  if (!subscription) {
    return false
  }

  try {
    await paddleRequest(`/subscriptions/${subscription.paddle_subscription_id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        items: [
          {
            price_id: newPriceId,
            quantity: 1,
          },
        ],
        proration_billing_mode: 'prorated_immediately', // Пропорційно списати/повернути
      }),
    })

    logger.info('Subscription plan changed', { orgId, newPriceId })
    return true
  } catch (error) {
    logger.error('Error changing subscription plan', error, { orgId, newPriceId })
    return false
  }
}
