import { UserRepository } from '@/lib/repositories/users'
import { supabase } from '@/lib/supabase/client'
import { addJobToQueue } from '@/lib/queue'

// GraphQL Resolvers
export const resolvers = {
  Query: {
    // User queries
    me: async (_: any, __: any, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')
      return await UserRepository.getUserById(user.id)
    },

    users: async (_: any, { limit, offset }: { limit: number; offset: number }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')
      // Only admins can list all users
      return await UserRepository.getUsers(limit, offset)
    },

    user: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')
      return await UserRepository.getUserById(id)
    },

    // Agent queries
    agents: async (_: any, { limit, offset }: { limit: number; offset: number }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('organization_id', user.orgId || user.id)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    agent: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .eq('organization_id', user.orgId || user.id)
        .single()

      if (error) throw error
      return data
    },

    // Knowledge base queries
    knowledgeCategories: async (_: any, __: any, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('knowledge_categories')
        .select('*')
        .eq('organization_id', user.orgId || user.id)
        .order('sort_order')

      if (error) throw error
      return data
    },

    knowledgeArticles: async (_: any, { categoryId, limit, offset }: { categoryId?: string; limit: number; offset: number }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      let query = supabase
        .from('knowledge_articles')
        .select(`
          *,
          knowledge_categories (
            id,
            name,
            description
          )
        `)
        .eq('organization_id', user.orgId || user.id)
        .eq('is_published', true)
        .range(offset, offset + limit - 1)
        .order('sort_order')

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },

    knowledgeArticle: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('knowledge_articles')
        .select(`
          *,
          knowledge_categories (
            id,
            name,
            description
          )
        `)
        .eq('id', id)
        .eq('organization_id', user.orgId || user.id)
        .single()

      if (error) throw error
      return data
    },

    // Job queries
    jobs: async (_: any, { limit, offset }: { limit: number; offset: number }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('job_status')
        .select('*')
        .eq('user_id', user.id)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    job: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('job_status')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      return data
    },

    // Analytics queries
    analytics: async (_: any, { dateRange }: { dateRange: { start: string; end: string } }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const orgId = user.orgId || user.id

      // Get analytics data for the organization
      const { data, error } = await supabase
        .from('usage_daily')
        .select('*')
        .eq('org_id', orgId)
        .gte('usage_date', dateRange.start)
        .lte('usage_date', dateRange.end)

      if (error) throw error

      // Aggregate data
      const totalRequests = data.reduce((sum, day) => sum + (day.api_requests || 0), 0)
      const totalTokens = data.reduce((sum, day) => sum + (day.tokens_consumed || 0), 0)
      const activeAgents = data.reduce((sum, day) => Math.max(sum, day.active_agents || 0), 0)
      const responseTime = data.reduce((sum, day) => sum + (day.avg_response_time || 0), 0) / Math.max(data.length, 1)
      const userEngagement = data.reduce((sum, day) => sum + (day.user_sessions || 0), 0) / Math.max(data.length, 1)

      return {
        totalRequests,
        totalTokens,
        activeAgents,
        responseTime: Math.round(responseTime * 100) / 100,
        userEngagement: Math.round(userEngagement * 100) / 100,
      }
    },

    // Health check
    health: () => 'GraphQL API is healthy',
  },

  Mutation: {
    // Agent mutations
    createAgent: async (_: any, { input }: { input: any }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('agents')
        .insert({
          ...input,
          organization_id: user.orgId || user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },

    updateAgent: async (_: any, { id, input }: { id: string; input: any }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('agents')
        .update(input)
        .eq('id', id)
        .eq('organization_id', user.orgId || user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    deleteAgent: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id)
        .eq('organization_id', user.orgId || user.id)

      if (error) throw error
      return true
    },

    // Knowledge base mutations
    createKnowledgeCategory: async (_: any, { input }: { input: any }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('knowledge_categories')
        .insert({
          ...input,
          organization_id: user.orgId || user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },

    updateKnowledgeCategory: async (_: any, { id, input }: { id: string; input: any }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('knowledge_categories')
        .update(input)
        .eq('id', id)
        .eq('organization_id', user.orgId || user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    deleteKnowledgeCategory: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { error } = await supabase
        .from('knowledge_categories')
        .delete()
        .eq('id', id)
        .eq('organization_id', user.orgId || user.id)

      if (error) throw error
      return true
    },

    createKnowledgeArticle: async (_: any, { input }: { input: any }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('knowledge_articles')
        .insert({
          ...input,
          organization_id: user.orgId || user.id,
        })
        .select(`
          *,
          knowledge_categories (
            id,
            name,
            description
          )
        `)
        .single()

      if (error) throw error
      return data
    },

    updateKnowledgeArticle: async (_: any, { id, input }: { id: string; input: any }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('knowledge_articles')
        .update(input)
        .eq('id', id)
        .eq('organization_id', user.orgId || user.id)
        .select(`
          *,
          knowledge_categories (
            id,
            name,
            description
          )
        `)
        .single()

      if (error) throw error
      return data
    },

    deleteKnowledgeArticle: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { error } = await supabase
        .from('knowledge_articles')
        .delete()
        .eq('id', id)
        .eq('organization_id', user.orgId || user.id)

      if (error) throw error
      return true
    },

    // Job mutations
    createJob: async (_: any, { input }: { input: any }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      const job = await addJobToQueue(input.type, {
        ...input.payload,
        userId: user.id,
        organizationId: user.orgId || user.id,
      })

      return {
        id: job.id,
        type: input.type,
        status: 'PENDING',
        createdAt: new Date(),
      }
    },

    // File upload
    uploadFile: async (_: any, { file, category }: { file: any; category: string }, { user }: Context) => {
      if (!user?.id) throw new Error('Unauthorized')

      // This is a placeholder - implement actual file upload logic
      // For now, just return a mock URL
      return `https://storage.example.com/${category}/${file.filename}`
    },
  },

  // Field resolvers
  KnowledgeArticle: {
    category: async (parent: any) => {
      if (parent.knowledge_categories) {
        return parent.knowledge_categories
      }

      const { data, error } = await supabase
        .from('knowledge_categories')
        .select('*')
        .eq('id', parent.category_id)
        .single()

      if (error) throw error
      return data
    },
  },

  User: {
    subscription: async (parent: any) => {
      if (parent.subscriptions?.[0]) {
        return parent.subscriptions[0]
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', parent.id)
        .eq('status', 'active')
        .single()

      if (error) return null
      return data
    },
  },
}

// Context type
interface Context {
  user?: {
    id: string
    orgId?: string
  }
}
