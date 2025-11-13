/**
 * Сервис биллинга и подписок
 * Интеграция с Stripe для управления платежами и подписками
 */

import Stripe from 'stripe'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

let stripe: Stripe | null = null

const getStripe = (): Stripe => {
 if (!stripe) {
 const secretKey = process.env.STRIPE_SECRET_KEY
 if (!secretKey) {
 throw new Error('STRIPE_SECRET_KEY is not configured')
 }
 stripe = new Stripe(secretKey, {
 apiVersion: '2025-10-29.clover',
 })
 }
 return stripe
}

export interface BillingPlan {
 id: string
 name: string
 description?: string
 stripe_price_id: string
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
 stripe_subscription_id: string
 stripe_customer_id: string
 plan_id: string
 status: 'active' | 'canceled' | 'past_due' | 'incomplete'
 current_period_start: string
 current_period_end: string
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
 * Создает клиента Stripe для организации
 */
export const createStripeCustomer = async (
 orgId: string,
 email: string,
 name?: string,
): Promise<string | null> => {
 try {
 const customer = await getStripe().customers.create({
 email,
 name,
 metadata: {
 org_id: orgId,
 },
 })

 // Сохраняем customer_id в базе данных
 const supabase = getSupabaseServiceRoleClient()
 await supabase
 .from('organizations')
 .update({ stripe_customer_id: customer.id })
 .eq('id', orgId)

 return customer.id
 } catch (error) {
 logger.error('Error creating Stripe customer', error, { orgId, email })
 return null
 }
}

/**
 * Создает сессию подписки для клиента
 */
export const createSubscriptionSession = async (
 orgId: string,
 planId: string,
 successUrl: string,
 cancelUrl: string,
): Promise<string | null> => {
 try {
 const supabase = getSupabaseServiceRoleClient()

 // Получаем информацию об организации
 const { data: org } = await supabase
 .from('organizations')
 .select('stripe_customer_id, name')
 .eq('id', orgId)
 .single()

 if (!org) {
 throw new Error('Organization not found')
 }

 // Получаем план
 const { data: plan } = await supabase
 .from('billing_plans')
 .select('*')
 .eq('id', planId)
 .eq('is_active', true)
 .single()

 if (!plan) {
 throw new Error('Plan not found')
 }

 let customerId = org.stripe_customer_id

 // Создаем клиента если его нет
 if (!customerId) {
 customerId = await createStripeCustomer(orgId, '', org.name || 'Organization')
 if (!customerId) {
 throw new Error('Failed to create Stripe customer')
 }
 }

 // Создаем сессию подписки
 const session = await getStripe().checkout.sessions.create({
 customer: customerId,
 payment_method_types: ['card'],
 line_items: [
 {
 price: plan.stripe_price_id,
 quantity: 1,
 },
 ],
 mode: 'subscription',
 success_url: successUrl,
 cancel_url: cancelUrl,
 metadata: {
 org_id: orgId,
 plan_id: planId,
 },
 })

 return session.url || null
 } catch (error) {
 logger.error('Error creating subscription session', error, { orgId, planId })
 return null
 }
}

/**
 * Обрабатывает webhook от Stripe
 */
export const handleStripeWebhook = async (
 event: Stripe.Event,
): Promise<boolean> => {
 try {
 switch (event.type) {
 case 'checkout.session.completed':
 return await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)

 case 'invoice.payment_succeeded':
 return await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)

 case 'invoice.payment_failed':
 return await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)

 case 'customer.subscription.updated':
 return await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)

 case 'customer.subscription.deleted':
 return await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)

 default:
 logger.info('Unhandled webhook event', { eventType: event.type })
 return true
 }
 } catch (error) {
 logger.error('Error handling Stripe webhook', error, { eventType: event.type })
 return false
 }
}

/**
 * Обрабатывает завершение checkout сессии
 */
const handleCheckoutCompleted = async (session: Stripe.Checkout.Session): Promise<boolean> => {
 const supabase = getSupabaseServiceRoleClient()
 const orgId = session.metadata?.org_id
 const planId = session.metadata?.plan_id

 if (!orgId || !planId) {
 logger.error('Missing org_id or plan_id in session metadata', undefined, { orgId, planId })
 return false
 }

 try {
 // Получаем подписку из Stripe
 const subscription = await getStripe().subscriptions.retrieve(session.subscription as string)

 // Создаем запись о подписке в базе данных
 const { error } = await supabase
 .from('subscriptions')
 .insert({
 org_id: orgId,
 stripe_subscription_id: subscription.id,
 stripe_customer_id: subscription.customer as string,
 plan_id: planId,
 status: subscription.status,
 current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
 current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
 cancel_at_period_end: subscription.cancel_at_period_end,
 })

 if (error) {
 logger.error('Error saving subscription', error, { orgId, planId })
 return false
 }

 return true
 } catch (error) {
 logger.error('Error handling checkout completed', error, { orgId, planId })
 return false
 }
}

/**
 * Обрабатывает успешную оплату счета
 */
const handleInvoicePaymentSucceeded = async (invoice: Stripe.Invoice): Promise<boolean> => {
 // Логика обработки успешной оплаты
 logger.info('Invoice payment succeeded', { invoiceId: invoice.id })
 return true
}

/**
 * Обрабатывает неудачную оплату счета
 */
const handleInvoicePaymentFailed = async (invoice: Stripe.Invoice): Promise<boolean> => {
 // Логика обработки неудачной оплаты
 logger.warn('Invoice payment failed', { invoiceId: invoice.id })
 return true
}

/**
 * Обрабатывает обновление подписки
 */
const handleSubscriptionUpdated = async (subscription: Stripe.Subscription): Promise<boolean> => {
 const supabase = getSupabaseServiceRoleClient()

 try {
 const { error } = await supabase
 .from('subscriptions')
 .update({
 status: subscription.status,
 current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
 current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
 cancel_at_period_end: subscription.cancel_at_period_end,
 updated_at: new Date().toISOString(),
 })
 .eq('stripe_subscription_id', subscription.id)

 return !error
 } catch (error) {
 logger.error('Error updating subscription', error, { subscriptionId: subscription.id })
 return false
 }
}

/**
 * Обрабатывает удаление подписки
 */
const handleSubscriptionDeleted = async (subscription: Stripe.Subscription): Promise<boolean> => {
 const supabase = getSupabaseServiceRoleClient()

 try {
 const { error } = await supabase
 .from('subscriptions')
 .update({
 status: 'canceled',
 cancel_at_period_end: true,
 updated_at: new Date().toISOString(),
 })
 .eq('stripe_subscription_id', subscription.id)

 return !error
 } catch (error) {
 logger.error('Error deleting subscription', error, { subscriptionId: subscription.id })
 return false
 }
}

/**
 * Получает текущую подписку организации
 */
export const getOrganizationSubscription = async (
 orgId: string,
): Promise<Subscription | null> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('subscriptions')
 .select('*')
 .eq('org_id', orgId)
 .eq('status', 'active')
 .order('created_at', { ascending: false })
 .limit(1)
 .single()

 if (error || !data) {
 return null
 }

 return data
}

/**
 * Получает доступные планы подписки
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
 * Записывает использование ресурса
 */
export const recordUsage = async (
 orgId: string,
 resourceType: UsageRecord['resource_type'],
 amount: number,
 description?: string,
 metadata: Record<string, any> = {},
): Promise<boolean> => {
 const supabase = getSupabaseServiceRoleClient()

 try {
 // Получаем текущую подписку
 const subscription = await getOrganizationSubscription(orgId)

 const { error } = await supabase
 .from('usage_records')
 .insert({
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

 // Проверяем лимиты
 await checkUsageLimits(orgId, resourceType)

 return true
 } catch (error) {
 logger.error('Error recording usage', error, { orgId, resourceType, amount })
 return false
 }
}

/**
 * Получает использование ресурсов за период
 */
export const getUsageStats = async (
 orgId: string,
 startDate: Date,
 endDate: Date,
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
 * Проверяет лимиты использования
 */
const checkUsageLimits = async (
 orgId: string,
 resourceType: UsageRecord['resource_type'],
): Promise<void> => {
 const subscription = await getOrganizationSubscription(orgId)
 if (!subscription) return

 const currentUsage = await getUsageStats(
 orgId,
 new Date(subscription.current_period_start),
 new Date(subscription.current_period_end),
 )

 const limit = subscription.usage_limits[resourceType]
 const current = currentUsage[resourceType] || 0

 if (limit && current >= limit * 0.9) { // 90% от лимита
 // Отправляем предупреждение (можно реализовать позже)
 logger.warn('Usage limit warning', { resourceType, current, limit, orgId })
 }

 if (limit && current >= limit) {
 // Превышен лимит - можно заблокировать или отправить уведомление
 logger.error('Usage limit exceeded', { resourceType, current, limit, orgId })
 }
}

/**
 * Отменяет подписку
 */
export const cancelSubscription = async (
 orgId: string,
 cancelAtPeriodEnd = true,
): Promise<boolean> => {
 const subscription = await getOrganizationSubscription(orgId)
 if (!subscription) {
 return false
 }

 try {
 if (cancelAtPeriodEnd) {
 await getStripe().subscriptions.update(subscription.stripe_subscription_id, {
 cancel_at_period_end: true,
 })
 } else {
 await getStripe().subscriptions.cancel(subscription.stripe_subscription_id)
 }

 return true
 } catch (error) {
 logger.error('Error canceling subscription', error, { orgId, cancelAtPeriodEnd })
 return false
 }
}

/**
 * Возобновляет подписку
 */
export const resumeSubscription = async (orgId: string): Promise<boolean> => {
 const subscription = await getOrganizationSubscription(orgId)
 if (!subscription) {
 return false
 }

 try {
 await getStripe().subscriptions.update(subscription.stripe_subscription_id, {
 cancel_at_period_end: false,
 })

 return true
 } catch (error) {
 logger.error('Error resuming subscription', error, { orgId })
 return false
 }
}


