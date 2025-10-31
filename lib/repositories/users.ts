import { supabase } from '@/lib/supabase/client'
import type { User, Subscription, Plan, UserTier } from '@/types/user'

// Repository for user operations
export class UserRepository {
  // Find user by ID (legacy function name)
  static async findUserById(id: string): Promise<User | null> {
    return this.getUserById(id)
  }

  // Get user by ID with subscription info
  static async getUserById(id: string): Promise<User | null> {
    try {
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

      // Determine user tier based on subscription or organization
      const tier = this.determineUserTier(data.subscriptions?.[0], data.organizations?.tier)

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        image: data.image,
        orgId: data.org_id,
        tier,
        subscription: data.subscriptions?.[0] ? {
          id: data.subscriptions[0].id,
          userId: data.subscriptions[0].user_id,
          planId: data.subscriptions[0].plan_id,
          status: data.subscriptions[0].status,
          currentPeriodStart: new Date(data.subscriptions[0].current_period_start),
          currentPeriodEnd: new Date(data.subscriptions[0].current_period_end),
          cancelAtPeriodEnd: data.subscriptions[0].cancel_at_period_end,
          stripeSubscriptionId: data.subscriptions[0].stripe_subscription_id,
          createdAt: new Date(data.subscriptions[0].created_at),
          updatedAt: new Date(data.subscriptions[0].updated_at),
        } : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  // Get user tier by user ID and org ID
  static async getUserTier(userId?: string, orgId?: string): Promise<UserTier> {
    try {
      // If no user ID, return FREE tier
      if (!userId) {
        return UserTier.FREE
      }

      // First check if user has an active subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('plan_id, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (!subError && subscription) {
        const tier = await this.getTierByPlanId(subscription.plan_id)
        if (tier) return tier
      }

      // If no active subscription, check organization tier
      if (orgId) {
        const { data: org, error: orgError } = await supabase
          .from('organizations')
          .select('tier')
          .eq('id', orgId)
          .single()

        if (!orgError && org?.tier) {
          return org.tier as UserTier
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
  static async getTierByPlanId(planId: string): Promise<UserTier | null> {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('tier')
        .eq('id', planId)
        .single()

      if (error || !data) {
        return null
      }

      return data.tier as UserTier
    } catch (error) {
      console.error('Error fetching plan tier:', error)
      return null
    }
  }

  // Determine user tier based on subscription and organization
  private static determineUserTier(subscription?: any, orgTier?: string): UserTier {
    // If user has active subscription, use it
    if (subscription && subscription.status === 'active') {
      // This is a simplified version - in real app, you'd map plan_id to tier
      if (subscription.plan_id?.includes('vip')) return UserTier.VIP
      if (subscription.plan_id?.includes('premium')) return UserTier.PREMIUM
      return UserTier.FREE
    }

    // If no subscription but organization has tier, use organization tier
    if (orgTier) {
      return orgTier as UserTier
    }

    // Default to FREE
    return UserTier.FREE
  }

  // Update user tier (admin function)
  static async updateUserTier(userId: string, tier: UserTier): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ tier, updated_at: new Date().toISOString() })
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
      const { data, error } = await supabase
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

  // Find user by email
  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !data) {
        return null
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        image: data.image,
        orgId: data.org_id,
        tier: data.tier || UserTier.FREE,
        subscription: undefined, // Would need to fetch separately
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      }
    } catch (error) {
      console.error('Error finding user by email:', error)
      return null
    }
  }

  // Update user
  static async updateUser(id: string, updates: Partial<User>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          image: updates.image,
          tier: updates.tier,
          updated_at: new Date().toISOString()
        })
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
      const { error } = await supabase
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
      const { error } = await supabase
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
}