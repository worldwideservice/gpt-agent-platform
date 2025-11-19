/**
 * Сервіс біллінгу та підписок
 * Інтеграція з Lemon Squeezy для управління платежами та підписками
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

// Lemon Squeezy API configuration
const LEMON_SQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1'
const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY
const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID
const LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET

// Типи статусів підписки
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'expired' | 'unpaid' | 'on_trial'

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
  variant_id: string // Lemon Squeezy variant ID
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
  lemon_squeezy_subscription_id: string
  lemon_squeezy_customer_id: string
  plan_id: string
  variant_id: string
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
 * Helper функція для запитів до Lemon Squeezy API
 */
const lemonSqueezyRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  if (!LEMON_SQUEEZY_API_KEY) {
    throw new Error('LEMON_SQUEEZY_API_KEY is not configured')
  }

  const response = await fetch(`${LEMON_SQUEEZY_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    logger.error('Lemon Squeezy API error', { error, endpoint })
    throw new Error(`Lemon Squeezy API error: ${error}`)
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
 * Створення checkout сесії в Lemon Squeezy
 */
export const createCheckoutSession = async (
  tenantId: string,
  variantId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string | null> => {
  try {
    if (!LEMON_SQUEEZY_STORE_ID) {
      throw new Error('LEMON_SQUEEZY_STORE_ID is not configured')
    }

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

    // Створюємо checkout
    const response = await lemonSqueezyRequest('/checkouts', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                org_id: tenantId,
              },
            },
            checkout_options: {
              embed: false,
              media: true,
              logo: true,
            },
            expires_at: null,
            preview: false,
            test_mode: process.env.NODE_ENV === 'development',
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: LEMON_SQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId,
              },
            },
          },
        },
      }),
    })

    return response.data.attributes.url || null
  } catch (error) {
    logger.error('Error creating checkout session', error, { tenantId, variantId })
    return null
  }
}

/**
 * Обробка webhook від Lemon Squeezy
 */
export const handleLemonSqueezyWebhook = async (
  payload: any,
  signature: string
): Promise<boolean> => {
  try {
    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature)) {
      logger.error('Invalid webhook signature')
      return false
    }

    const eventName = payload.meta.event_name

    switch (eventName) {
      case 'subscription_created':
        return await handleSubscriptionCreated(payload.data)

      case 'subscription_updated':
        return await handleSubscriptionUpdated(payload.data)

      case 'subscription_cancelled':
      case 'subscription_expired':
        return await handleSubscriptionCancelled(payload.data)

      case 'subscription_resumed':
        return await handleSubscriptionResumed(payload.data)

      case 'subscription_payment_success':
        return await handlePaymentSuccess(payload.data)

      case 'subscription_payment_failed':
        return await handlePaymentFailed(payload.data)

      default:
        logger.info('Unhandled webhook event', { eventName })
        return true
    }
  } catch (error) {
    logger.error('Error handling Lemon Squeezy webhook', error)
    return false
  }
}

/**
 * Verify webhook signature
 */
const verifyWebhookSignature = (payload: any, signature: string): boolean => {
  if (!LEMON_SQUEEZY_WEBHOOK_SECRET) {
    logger.warn('LEMON_SQUEEZY_WEBHOOK_SECRET is not configured, skipping signature verification')
    return true // В розробці можна пропустити
  }

  // TODO: Implement signature verification using HMAC
  // const hmac = crypto.createHmac('sha256', LEMON_SQUEEZY_WEBHOOK_SECRET)
  // const digest = hmac.update(JSON.stringify(payload)).digest('hex')
  // return digest === signature

  return true
}

/**
 * Обробка створення підписки
 */
const handleSubscriptionCreated = async (subscriptionData: any): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()
  const attributes = subscriptionData.attributes
  const customData = attributes.custom_data || {}
  const orgId = customData.org_id

  if (!orgId) {
    logger.error('Missing org_id in subscription webhook', { subscriptionData })
    return false
  }

  try {
    const { error } = await supabase.from('subscriptions').insert({
      org_id: orgId,
      lemon_squeezy_subscription_id: subscriptionData.id,
      lemon_squeezy_customer_id: attributes.customer_id?.toString(),
      variant_id: attributes.variant_id?.toString(),
      status: mapLemonSqueezyStatus(attributes.status),
      current_period_start: attributes.created_at,
      current_period_end: attributes.renews_at || attributes.ends_at,
      trial_ends_at: attributes.trial_ends_at,
      renews_at: attributes.renews_at,
      ends_at: attributes.ends_at,
      cancel_at_period_end: attributes.cancelled,
      metadata: {
        card_brand: attributes.card_brand,
        card_last_four: attributes.card_last_four,
      },
    })

    if (error) {
      logger.error('Error saving subscription', error, { orgId })
      return false
    }

    return true
  } catch (error) {
    logger.error('Error handling subscription created', error, { orgId })
    return false
  }
}

/**
 * Обробка оновлення підписки
 */
const handleSubscriptionUpdated = async (subscriptionData: any): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()
  const attributes = subscriptionData.attributes

  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: mapLemonSqueezyStatus(attributes.status),
        current_period_start: attributes.created_at,
        current_period_end: attributes.renews_at || attributes.ends_at,
        trial_ends_at: attributes.trial_ends_at,
        renews_at: attributes.renews_at,
        ends_at: attributes.ends_at,
        cancel_at_period_end: attributes.cancelled,
        updated_at: new Date().toISOString(),
        metadata: {
          card_brand: attributes.card_brand,
          card_last_four: attributes.card_last_four,
        },
      })
      .eq('lemon_squeezy_subscription_id', subscriptionData.id)

    return !error
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
        ends_at: subscriptionData.attributes.ends_at,
        updated_at: new Date().toISOString(),
      })
      .eq('lemon_squeezy_subscription_id', subscriptionData.id)

    return !error
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
        updated_at: new Date().toISOString(),
      })
      .eq('lemon_squeezy_subscription_id', subscriptionData.id)

    return !error
  } catch (error) {
    logger.error('Error resuming subscription', error, { subscriptionId: subscriptionData.id })
    return false
  }
}

/**
 * Обробка успішної оплати
 */
const handlePaymentSuccess = async (subscriptionData: any): Promise<boolean> => {
  logger.info('Payment succeeded', { subscriptionId: subscriptionData.id })
  return true
}

/**
 * Обробка неуспішної оплати
 */
const handlePaymentFailed = async (subscriptionData: any): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()

  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('lemon_squeezy_subscription_id', subscriptionData.id)

    return !error
  } catch (error) {
    logger.error('Error handling payment failed', error, { subscriptionId: subscriptionData.id })
    return false
  }
}

/**
 * Map Lemon Squeezy status to our status
 */
const mapLemonSqueezyStatus = (status: string): SubscriptionStatus => {
  const statusMap: Record<string, SubscriptionStatus> = {
    'on_trial': 'on_trial',
    'active': 'active',
    'paused': 'past_due',
    'past_due': 'past_due',
    'unpaid': 'unpaid',
    'cancelled': 'canceled',
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
 * Скасування підписки через Lemon Squeezy API
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
    await lemonSqueezyRequest(
      `/subscriptions/${subscription.lemon_squeezy_subscription_id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          data: {
            type: 'subscriptions',
            id: subscription.lemon_squeezy_subscription_id,
            attributes: {
              cancelled: cancelAtPeriodEnd,
            },
          },
        }),
      }
    )

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
    await lemonSqueezyRequest(
      `/subscriptions/${subscription.lemon_squeezy_subscription_id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          data: {
            type: 'subscriptions',
            id: subscription.lemon_squeezy_subscription_id,
            attributes: {
              cancelled: false,
            },
          },
        }),
      }
    )

    return true
  } catch (error) {
    logger.error('Error resuming subscription', error, { orgId })
    return false
  }
}

/**
 * Отримання посилання на customer portal
 */
export const getCustomerPortalUrl = async (orgId: string): Promise<string | null> => {
  const subscription = await getOrganizationSubscription(orgId)
  if (!subscription) {
    return null
  }

  try {
    const response = await lemonSqueezyRequest(
      `/subscriptions/${subscription.lemon_squeezy_subscription_id}`
    )

    return response.data.attributes.urls.customer_portal || null
  } catch (error) {
    logger.error('Error getting customer portal URL', error, { orgId })
    return null
  }
}
