// @ts-nocheck
import { hash } from 'bcryptjs'
// import { UserTier } from '@/lib/rate-limit' // Removed to avoid circular dependency

// Helper function to get Supabase client
// Экспортируем для возможности мокирования в тестах
export async function getSupabaseClient() {
 try {
 // Use validated Supabase client with proper env loading
 const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')
 return getSupabaseServiceRoleClient()
 } catch (error) {
 console.error('Failed to create Supabase client:', error)
 throw error
 }
}
import type { User, DatabaseUser, Subscription, Plan } from '@/types/user'

// Repository for user operations
export class UserRepository {
 // Find user by ID (legacy function name)
 static async findUserById(id: string): Promise<User | null> {
 return this.getUserById(id)
 }

 // Get user by ID with subscription info
 static async getUserById(id: string): Promise<User | null> {
 try {
 const supabase = await getSupabaseClient()
 const { data, error } = await supabase
 .from('users')
 .select(`
 *,
 subscriptions (
 id,
 plan_id,
 status,
 current_period_start,
 current_period_end,
 cancel_at_period_end,
 stripe_subscription_id,
 created_at,
 updated_at
 ),
 organizations (
 id,
 name,
 tier
 )
 `)
 .eq('id', id)
 .single()

 if (error || !data) {
 return null
 }

 // Type assertion for data with joined tables
 const userData = data as any

 // Determine user tier based on subscription or organization
 const tier = await this.determineUserTier(userData.subscriptions?.[0], userData.organizations?.tier)

 return {
 id: userData.id,
 email: userData.email,
 name: userData.name,
 image: userData.image,
 orgId: userData.org_id,
 tier,
 subscription: userData.subscriptions?.[0] ? {
 id: userData.subscriptions[0].id,
 userId: userData.id,
 planId: userData.subscriptions[0].plan_id,
 status: userData.subscriptions[0].status as any,
 currentPeriodStart: new Date(userData.subscriptions[0].current_period_start),
 currentPeriodEnd: new Date(userData.subscriptions[0].current_period_end),
 cancelAtPeriodEnd: userData.subscriptions[0].cancel_at_period_end || false,
 stripeSubscriptionId: userData.subscriptions[0].stripe_subscription_id,
 createdAt: new Date(userData.subscriptions[0].created_at),
 updatedAt: new Date(userData.subscriptions[0].updated_at),
 } : undefined,
 createdAt: new Date(userData.created_at),
 updatedAt: new Date(userData.updated_at),
 }
 } catch (error) {
 console.error('Error fetching user:', error)
 return null
 }
 }

 // Get user tier by user ID and org ID
 static async getUserTier(userId?: string, orgId?: string): Promise<import('@/lib/rate-limit').UserTier> {
 const { UserTier } = await import('@/lib/rate-limit')
 try {
 // If no user ID, return FREE tier
 if (!userId) {
 return UserTier.FREE
 }

 // First check if user has an active subscription
 const client = await getSupabaseClient()
 const { data: subscription, error: subError } = await client
 .from('subscriptions')
 .select('plan_id, status')
 .eq('user_id', userId)
 .eq('status', 'active')
 .single()

 if (!subError && subscription) {
 const tier = await this.getTierByPlanId((subscription as any).plan_id)
 if (tier) return tier
 }

 // If no active subscription, check organization tier
 if (orgId) {
 const orgClient = await getSupabaseClient()
 const { data: org, error: orgError } = await orgClient
 .from('organizations')
 .select('tier')
 .eq('id', orgId)
 .single()

 if (!orgError && org?.tier) {
 return (org as any).tier as UserTier
 }
 }

 // Default to FREE tier
 return UserTier.FREE
 } catch (error) {
 console.error('Error determining user tier:', error)
 return UserTier.FREE
 }
 }

 // Get tier by plan ID
 static async getTierByPlanId(planId: string): Promise<import('@/lib/rate-limit').UserTier | null> {
 const { UserTier } = await import('@/lib/rate-limit')
 try {
 const client = await getSupabaseClient()
 const { data, error } = await client
 .from('plans')
 .select('tier')
 .eq('id', planId)
 .single()

 if (error || !data) {
 return null
 }

 return (data as any).tier as UserTier
 } catch (error) {
 console.error('Error fetching plan tier:', error)
 return null
 }
 }

 // Determine user tier based on subscription and organization
 private static async determineUserTier(subscription?: any, orgTier?: string): Promise<import('@/lib/rate-limit').UserTier> {
 const { UserTier } = await import('@/lib/rate-limit')
 // If user has active subscription, use it
 if (subscription && subscription.status === 'active') {
 // This is a simplified version - in real app, you'd map plan_id to tier
 if (subscription.plan_id?.includes('vip')) return UserTier.VIP
 if (subscription.plan_id?.includes('premium')) return UserTier.PREMIUM
 return UserTier.FREE
 }

 // If no subscription but organization has tier, use organization tier
 if (orgTier) {
 return orgTier as import('@/lib/rate-limit').UserTier
 }

 // Default to FREE
 return UserTier.FREE
 }

 // Update user tier (admin function)
 static async updateUserTier(userId: string, tier: import('@/lib/rate-limit').UserTier): Promise<boolean> {
 try {
 const client = await getSupabaseClient()
 const { error } = await client
 .from('users')
 .update({ tier, updated_at: new Date().toISOString() } as any)
 .eq('id', userId)

 return !error
 } catch (error) {
 console.error('Error updating user tier:', error)
 return false
 }
 }

 // Get all users with pagination (admin function)
 static async getUsers(limit = 50, offset = 0): Promise<User[]> {
 try {
 const client = await getSupabaseClient()
 const { data, error } = await client
 .from('users')
 .select(`
 *,
 subscriptions (
 id,
 plan_id,
 status,
 current_period_start,
 current_period_end,
 cancel_at_period_end,
 created_at,
 updated_at
 )
 `)
 .range(offset, offset + limit - 1)
 .order('created_at', { ascending: false })

 if (error) {
 return []
 }

 return data.map(user => ({
 id: user.id,
 email: user.email,
 name: user.name,
 image: user.image,
 orgId: user.org_id,
 tier: user.tier || UserTier.FREE,
 subscription: user.subscriptions?.[0] ? {
 id: user.subscriptions[0].id,
 userId: user.subscriptions[0].user_id,
 planId: user.subscriptions[0].plan_id,
 status: user.subscriptions[0].status,
 currentPeriodStart: new Date(user.subscriptions[0].current_period_start),
 currentPeriodEnd: new Date(user.subscriptions[0].current_period_end),
 cancelAtPeriodEnd: user.subscriptions[0].cancel_at_period_end,
 stripeSubscriptionId: user.subscriptions[0].stripe_subscription_id,
 createdAt: new Date(user.subscriptions[0].created_at),
 updatedAt: new Date(user.subscriptions[0].updated_at),
 } : undefined,
 createdAt: new Date(user.created_at),
 updatedAt: new Date(user.updated_at),
 }))
 } catch (error) {
 console.error('Error fetching users:', error)
 return []
 }
 }

 // Search users (admin function)
 static async searchUsers(query: string, limit = 20): Promise<User[]> {
 try {
 const client = await getSupabaseClient()
 const { data, error } = await client
 .from('users')
 .select(`
 *,
 subscriptions (
 id,
 plan_id,
 status
 )
 `)
 .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
 .limit(limit)
 .order('created_at', { ascending: false })

 if (error) {
 return []
 }

 return data.map(user => ({
 id: user.id,
 email: user.email,
 name: user.name,
 image: user.image,
 orgId: user.org_id,
 tier: user.tier || UserTier.FREE,
 subscription: user.subscriptions?.[0] ? {
 id: user.subscriptions[0].id,
 userId: user.subscriptions[0].user_id,
 planId: user.subscriptions[0].plan_id,
 status: user.subscriptions[0].status,
 currentPeriodStart: new Date(),
 currentPeriodEnd: new Date(),
 cancelAtPeriodEnd: false,
 createdAt: new Date(user.subscriptions[0].created_at),
 updatedAt: new Date(user.subscriptions[0].updated_at),
 } : undefined,
 createdAt: new Date(user.created_at),
 updatedAt: new Date(user.updated_at),
 }))
 } catch (error) {
 console.error('Error searching users:', error)
 return []
 }
 }

 // Find user by email (database user)
 static async findUserByEmail(email: string): Promise<DatabaseUser | null> {
 try {
 console.log('[UserRepository] Finding user by email:', email)
 const client = await getSupabaseClient()
 console.log('[UserRepository] Client created, querying users table...')
 
 const { data, error } = await client
 .from('users')
 .select('*')
 .eq('email', email.toLowerCase().trim())
 .single()

 if (error) {
 console.error('[UserRepository] Error finding user:', {
 error: error.message,
 code: error.code,
 details: error.details,
 hint: error.hint,
 email
 })
 return null
 }

 if (!data) {
 console.log('[UserRepository] User not found for email:', email)
 return null
 }

 console.log('[UserRepository] User found:', data.id, data.email)
 return {
 id: data.id,
 email: data.email,
 full_name: data.full_name,
 password_hash: data.password_hash,
 default_org_id: data.default_org_id,
 avatar_url: data.avatar_url,
 locale: data.locale,
 invited_at: data.invited_at,
 last_sign_in_at: data.last_sign_in_at,
 created_at: data.created_at,
 updated_at: data.updated_at,
 }
 } catch (error) {
 console.error('[UserRepository] Exception finding user by email:', error)
 if (error instanceof Error) {
 console.error('[UserRepository] Exception details:', error.message, error.stack)
 }
 return null
 }
 }

 // Get user by email (with subscription info)
 static async getUserByEmail(email: string): Promise<User | null> {
 try {
 const client = await getSupabaseClient()
 const { data, error } = await client
 .from('users')
 .select(`
 *,
 subscriptions (
 id,
 plan_id,
 status,
 token_quota,
 token_used,
 renews_at,
 created_at
 )
 `)
 .eq('email', email)
 .single()

 if (error || !data) {
 return null
 }

 const subscription = data.subscriptions?.[0] ? {
 id: data.subscriptions[0].id,
 userId: data.id,
 planId: data.subscriptions[0].plan_id,
 status: data.subscriptions[0].status as any,
 currentPeriodStart: new Date(data.subscriptions[0].created_at),
 currentPeriodEnd: data.subscriptions[0].renews_at ? new Date(data.subscriptions[0].renews_at) : new Date(),
 cancelAtPeriodEnd: false,
 stripeSubscriptionId: undefined,
 createdAt: new Date(data.subscriptions[0].created_at),
 updatedAt: new Date(data.subscriptions[0].created_at),
 } : undefined

 return {
 id: data.id,
 email: data.email,
 name: data.full_name,
 image: data.avatar_url,
 orgId: data.default_org_id,
 tier: data.tier || UserTier.FREE,
 subscription,
 createdAt: new Date(data.created_at),
 updatedAt: new Date(data.updated_at),
 }
 } catch (error) {
 console.error('Error getting user by email:', error)
 return null
 }
 }

 // Update user
 static async updateUser(id: string, updates: Partial<User>): Promise<boolean> {
 try {
 const updateData: Record<string, any> = {
 updated_at: new Date().toISOString()
 }

 if (updates.name !== undefined) {
 updateData.name = updates.name
 }
 if (updates.image !== undefined) {
 updateData.image = updates.image
 }
 if (updates.tier !== undefined) {
 updateData.tier = updates.tier
 }
 if (updates.email !== undefined) {
 updateData.email = updates.email
 }

 const client = await getSupabaseClient()
 const { error } = await client
 .from('users')
 .update(updateData)
 .eq('id', id)

 return !error
 } catch (error) {
 console.error('Error updating user:', error)
 return false
 }
 }

// Update user password hash
static async updateUserPasswordHash(id: string, passwordHash: string): Promise<boolean> {
 try {
 const client = await getSupabaseClient()
 const { error } = await client
 .from('users')
 .update({
 password_hash: passwordHash,
 updated_at: new Date().toISOString()
 })
 .eq('id', id)

 return !error
 } catch (error) {
 console.error('Error updating user password:', error)
 return false
 }
 }

 // Update user last sign in
 static async updateUserLastSignIn(id: string): Promise<boolean> {
 try {
 const client = await getSupabaseClient()
 const { error } = await client
 .from('users')
 .update({
 last_sign_in_at: new Date().toISOString(),
 updated_at: new Date().toISOString()
 })
 .eq('id', id)

 return !error
 } catch (error) {
 console.error('Error updating user last sign in:', error)
 return false
 }
 }

// Update user password hash
static async updateUserPasswordHash(id: string, passwordHash: string): Promise<boolean> {
 try {
 const client = await getSupabaseClient()
 const { error } = await client
 .from('users')
 .update({
 password_hash: passwordHash,
 updated_at: new Date().toISOString(),
 })
 .eq('id', id)

 if (error) {
 console.error('Error updating user password hash:', error)
 return false
 }

 return true
 } catch (error) {
 console.error('Error updating user password hash:', error)
 return false
 }
 }

 // Create new user
 static async createUser({
 email,
 password,
 firstName,
 lastName,
 }: {
 email: string
 password: string
 firstName: string
 lastName: string
 }): Promise<DatabaseUser | null> {
 try {
 // Hash password
 const passwordHash = await hash(password, 12)

 // Use validated Supabase client
 const client = await getSupabaseClient()

 const { data, error } = await client
 .from('users')
 .insert({
 email: email.toLowerCase().trim(),
 full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
 password_hash: passwordHash,
 })
 .select()
 .single()

 if (error) {
 console.error('Error creating user - Supabase error:', {
 message: error.message,
 details: error.details,
 hint: error.hint,
 code: error.code,
 })
 throw new Error(`Не удалось создать пользователя: ${error.message || error.details || 'Неизвестная ошибка'}`)
 }

 if (!data) {
 console.error('Error creating user - No data returned from insert')
 throw new Error('Не удалось создать пользователя: нет данных в ответе')
 }

 return data as DatabaseUser
 } catch (error) {
 console.error('Error creating user - Exception:', error)
 if (error instanceof Error) {
 throw error
 }
 throw new Error('Неизвестная ошибка при создании пользователя')
 }
 }
}