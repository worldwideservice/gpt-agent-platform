import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

// Admin access control
export async function checkAdminAccess(userId: string): Promise<boolean> {
 try {
 const supabase = getSupabaseServiceRoleClient()
 
 // Check if user has admin role in organizations
 const { data: orgMember, error: orgError } = await supabase
 .from('organization_members')
 .select('role')
 .eq('user_id', userId)
 .eq('role', 'admin')
 .single()

 if (!orgError && orgMember) {
 return true
 }

 // Check if user is in admin users list (environment variable)
 const adminUsers = process.env.ADMIN_USERS?.split(',') || []
 if (adminUsers.includes(userId)) {
 return true
 }

 // Check if user has admin flag in profile
 const { data: user, error: userError } = await supabase
 .from('users')
 .select('is_admin')
 .eq('id', userId)
 .single()

 if (!userError && user?.is_admin) {
 return true
 }

 return false
 } catch (error) {
 logger.error('Error checking admin access:', error)
 return false
 }
}

// Admin statistics
export async function getAdminStats() {
 try {
 const supabase = getSupabaseServiceRoleClient()
 
 // Users stats
 const { data: users, error: usersError } = await supabase
 .from('users')
 .select('tier, created_at')

 if (usersError) throw usersError

 const totalUsers = users.length
 const usersByTier = users.reduce((acc, user) => {
 acc[user.tier] = (acc[user.tier] || 0) + 1
 return acc
 }, {} as Record<string, number>)

 const newUsersToday = users.filter(user => {
 const createdAt = new Date(user.created_at)
 const today = new Date()
 return createdAt.toDateString() === today.toDateString()
 }).length

 // Organizations stats
 const { data: organizations, error: orgsError } = await supabase
 .from('organizations')
 .select('tier, created_at')

 if (orgsError) throw orgsError

 const totalOrganizations = organizations.length
 const organizationsByTier = organizations.reduce((acc, org) => {
 acc[org.tier] = (acc[org.tier] || 0) + 1
 return acc
 }, {} as Record<string, number>)

 // Agents stats
 const { data: agents, error: agentsError } = await supabase
 .from('agents')
 .select('status, created_at')

 if (agentsError) throw agentsError

 const totalAgents = agents.length
 const activeAgents = agents.filter(agent => agent.status === 'active').length

 // Jobs stats
 const { data: jobs, error: jobsError } = await supabase
 .from('job_status')
 .select('status, created_at')

 if (jobsError) throw jobsError

 const totalJobs = jobs.length
 const jobsByStatus = jobs.reduce((acc, job) => {
 acc[job.status] = (acc[job.status] || 0) + 1
 return acc
 }, {} as Record<string, number>)

 // Usage stats (last 30 days)
 const thirtyDaysAgo = new Date()
 thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

 const { data: usage, error: usageError } = await supabase
 .from('usage_daily')
 .select('tokens_consumed, api_requests, user_sessions')
 .gte('usage_date', thirtyDaysAgo.toISOString().split('T')[0])

 if (usageError) throw usageError

 const totalTokens = usage.reduce((sum, day) => sum + (day.tokens_consumed || 0), 0)
 const totalRequests = usage.reduce((sum, day) => sum + (day.api_requests || 0), 0)
 const totalSessions = usage.reduce((sum, day) => sum + (day.user_sessions || 0), 0)

 return {
 users: {
 total: totalUsers,
 byTier: usersByTier,
 newToday: newUsersToday,
 },
 organizations: {
 total: totalOrganizations,
 byTier: organizationsByTier,
 },
 agents: {
 total: totalAgents,
 active: activeAgents,
 },
 jobs: {
 total: totalJobs,
 byStatus: jobsByStatus,
 },
 usage: {
 tokensLast30Days: totalTokens,
 requestsLast30Days: totalRequests,
 sessionsLast30Days: totalSessions,
 },
 }
 } catch (error) {
 logger.error('Error getting admin stats:', error)
 throw error
 }
}

// Admin actions
function asString(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }
  return ''
}

export async function performAdminAction(action: string, payload: Record<string, unknown>) {
  try {
    switch (action) {
    case 'update_user_tier':
        return await updateUserTier(asString(payload.userId), asString(payload.tier))
      case 'delete_user':
        return await deleteUser(asString(payload.userId))
      case 'update_feature_flag':
        return await updateFeatureFlag(asString(payload.flagKey), payload.updates ?? {})
      case 'clear_cache':
        return await clearCache()
 case 'restart_worker':
 return await restartWorker()
 default:
 throw new Error(`Unknown admin action: ${action}`)
 }
 } catch (error) {
 logger.error('Error performing admin action:', error)
 throw error
 }
}

async function updateUserTier(userId: string, tier: string) {
 const supabase = getSupabaseServiceRoleClient()
 const { error } = await supabase
 .from('users')
 .update({ tier, updated_at: new Date().toISOString() })
 .eq('id', userId)

 if (error) throw error
 return { success: true }
}

async function deleteUser(userId: string) {
 // Soft delete - mark as inactive instead of hard delete
 const supabase = getSupabaseServiceRoleClient()
 const { error } = await supabase
 .from('users')
 .update({
 is_active: false,
 deleted_at: new Date().toISOString(),
 updated_at: new Date().toISOString()
 })
 .eq('id', userId)

 if (error) throw error
 return { success: true }
}

async function updateFeatureFlag(flagKey: string, updates: Record<string, unknown>) {
 // This would update feature flags in database/cache
 // For now, just log the action
 logger.info('Updating feature flag:', flagKey, updates)
 return { success: true }
}

async function clearCache() {
 // Clear Redis cache
 try {
 // This would connect to Redis and clear cache
 logger.info('Clearing cache...')
 return { success: true }
 } catch (error) {
 throw error
 }
}

async function restartWorker() {
 // Restart background worker
 try {
 // This would send signal to restart worker process
 logger.info('Restarting worker...')
 return { success: true }
 } catch (error) {
 throw error
 }
}
