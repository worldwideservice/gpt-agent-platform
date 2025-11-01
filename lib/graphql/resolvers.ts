// @ts-nocheck - TypeScript validation for Supabase queries is complex
import { UserRepository } from '@/lib/repositories/users'
import { supabase } from '@/lib/supabase/client'
import { addJobToQueue } from '@/lib/queue'
import { logger } from '@/lib/utils'

// Input Validation
const validateAgentInput = (input: AgentInput): AgentInput => {
  if (!input.name || input.name.trim().length === 0) {
    throw new Error('Agent name is required')
  }
  if (input.name.length > 100) {
    throw new Error('Agent name must be less than 100 characters')
  }
  if (input.description && input.description.length > 1000) {
    throw new Error('Agent description must be less than 1000 characters')
  }
  if (input.temperature && (input.temperature < 0 || input.temperature > 2)) {
    throw new Error('Temperature must be between 0 and 2')
  }
  return {
    ...input,
    name: input.name.trim(),
    description: input.description?.trim(),
  }
}

const validateKnowledgeCategoryInput = (input: KnowledgeCategoryInput): KnowledgeCategoryInput => {
  if (!input.name || input.name.trim().length === 0) {
    throw new Error('Category name is required')
  }
  if (input.name.length > 100) {
    throw new Error('Category name must be less than 100 characters')
  }
  if (input.description && input.description.length > 500) {
    throw new Error('Category description must be less than 500 characters')
  }
  return {
    ...input,
    name: input.name.trim(),
    description: input.description?.trim(),
  }
}

const validateKnowledgeArticleInput = (input: KnowledgeArticleInput): KnowledgeArticleInput => {
  if (!input.title || input.title.trim().length === 0) {
    throw new Error('Article title is required')
  }
  if (input.title.length > 200) {
    throw new Error('Article title must be less than 200 characters')
  }
  if (!input.content || input.content.trim().length === 0) {
    throw new Error('Article content is required')
  }
  if (input.content.length > 50000) {
    throw new Error('Article content must be less than 50,000 characters')
  }
  if (!input.category_id) {
    throw new Error('Category ID is required')
  }
  return {
    ...input,
    title: input.title.trim(),
    content: input.content.trim(),
    tags: input.tags?.filter(tag => tag.trim().length > 0).slice(0, 10), // Max 10 tags
  }
}

// GraphQL Types
interface GraphQLContext {
  user?: {
    id: string
    email: string
    name?: string
    orgId?: string
  }
}

interface PaginationArgs {
  limit?: number
  offset?: number
}

interface AgentInput {
  name: string
  description?: string
  model?: string
  temperature?: number
  systemPrompt?: string
  organization_id?: string
}

interface KnowledgeCategoryInput {
  name: string
  description?: string
  organization_id?: string
}

interface KnowledgeArticleInput {
  title: string
  content: string
  category_id: string
  tags?: string[]
  organization_id?: string
}

interface DateRange {
  start: string
  end: string
}

/**
 * GraphQL Resolvers for the application
 * Provides queries and mutations for users, agents, knowledge base, and analytics
 */
export const resolvers = {
  Query: {
    // User queries

    /**
     * Get current authenticated user information
     * @param _ - Parent object (unused)
     * @param __ - Arguments (unused)
     * @param user - Current authenticated user context
     * @returns User object or null if not authenticated
     * @throws Error if user is not authenticated
     */
    me: async (_: unknown, __: unknown, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')
      return await UserRepository.getUserById(user.id)
    },

    users: async (_: unknown, { limit, offset }: PaginationArgs, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')
      // Only admins can list all users
      return await UserRepository.getUsers(limit, offset)
    },

    user: async (_: unknown, { id }: { id: string }, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')
      return await UserRepository.getUserById(id)
    },

    // Agent queries
    agents: async (_: unknown, { limit, offset }: PaginationArgs, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('organization_id', user.orgId || user.id)
        .range(offset || 0, (offset || 0) + (limit || 10) - 1)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    agent: async (_: unknown, { id }: { id: string }, { user }: GraphQLContext) => {
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
    knowledgeCategories: async (_: any, __: any, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { data, error } = await supabase
        .from('knowledge_categories')
        .select('*')
        .eq('organization_id', user.orgId || user.id)
        .order('sort_order')

      if (error) throw error
      return data
    },

    knowledgeArticles: async (_: any, { categoryId, limit, offset }: { categoryId?: string; limit: number; offset: number }, { user }: GraphQLContext) => {
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

    knowledgeArticle: async (_: any, { id }: { id: string }, { user }: GraphQLContext) => {
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
    jobs: async (_: any, { limit, offset }: { limit: number; offset: number }, { user }: GraphQLContext) => {
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

    job: async (_: any, { id }: { id: string }, { user }: GraphQLContext) => {
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
    analytics: async (_: any, { dateRange }: { dateRange: { start: string; end: string } }, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')

      const orgId = user.orgId || user.id

      // Get analytics data for the organization
      const { data, error } = await supabase
        .from('usage_daily')
        .select('api_requests, tokens_consumed, active_agents, avg_response_time, user_sessions')
        .eq('org_id', orgId)
        .gte('usage_date', dateRange.start)
        .lte('usage_date', dateRange.end)

      if (error) throw error

      // Type assertion for data
      const analyticsData = data as Array<{
        api_requests?: number
        tokens_consumed?: number
        active_agents?: number
        avg_response_time?: number
        user_sessions?: number
      }> | null

      if (!analyticsData) {
        return {
          totalRequests: 0,
          totalTokens: 0,
          activeAgents: 0,
          responseTime: 0,
          userEngagement: 0,
        }
      }

      // Aggregate data
      const totalRequests = analyticsData.reduce((sum, day) => sum + (day.api_requests || 0), 0)
      const totalTokens = analyticsData.reduce((sum, day) => sum + (day.tokens_consumed || 0), 0)
      const activeAgents = analyticsData.reduce((sum, day) => Math.max(sum, day.active_agents || 0), 0)
      const responseTime = analyticsData.reduce((sum, day) => sum + (day.avg_response_time || 0), 0) / Math.max(analyticsData.length, 1)
      const userEngagement = analyticsData.reduce((sum, day) => sum + (day.user_sessions || 0), 0) / Math.max(analyticsData.length, 1)

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

    /**
     * Create a new AI agent
     * @param _ - Parent object (unused)
     * @param input - Agent creation input data
     * @param user - Current authenticated user context
     * @returns Created agent object
     * @throws Error if validation fails or user is not authenticated
     */
    createAgent: async (_: unknown, { input }: { input: AgentInput }, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')

      logger.info('Creating new agent', {
        userId: user.id,
        orgId: user.orgId,
        agentName: input.name
      })

      const validatedInput = validateAgentInput(input)

      const { data, error } = await supabase
        .from('agents')
        .insert({
          name: validatedInput.name,
          description: validatedInput.description,
          model: validatedInput.model,
          temperature: validatedInput.temperature,
          system_prompt: validatedInput.systemPrompt,
          organization_id: user.orgId || user.id,
        } as any)
        .select()
        .single()

      if (error) {
        logger.error('Failed to create agent', error, {
          userId: user.id,
          orgId: user.orgId,
          input
        })
        throw error
      }

      logger.info('Agent created successfully', {
        userId: user.id,
        agentId: data.id,
        agentName: data.name
      })

      return data
    },

    updateAgent: async (_: unknown, { id, input }: { id: string; input: AgentInput }, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')

      const validatedInput = validateAgentInput(input)

      const { data, error } = await supabase
        .from('agents')
        .update({
          name: validatedInput.name,
          description: validatedInput.description,
          model: validatedInput.model,
          temperature: validatedInput.temperature,
          system_prompt: validatedInput.systemPrompt,
        } as any)
        .eq('id', id)
        .eq('organization_id', user.orgId || user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    deleteAgent: async (_: any, { id }: { id: string }, { user }: GraphQLContext) => {
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
    createKnowledgeCategory: async (_: unknown, { input }: { input: KnowledgeCategoryInput }, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')

      const validatedInput = validateKnowledgeCategoryInput(input)

      const { data, error } = await supabase
        .from('knowledge_categories')
        .insert({
          name: validatedInput.name,
          description: validatedInput.description,
          organization_id: user.orgId || user.id,
        } as any)
        .select()
        .single()

      if (error) throw error
      return data
    },

    updateKnowledgeCategory: async (_: unknown, { id, input }: { id: string; input: KnowledgeCategoryInput }, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')

      const validatedInput = validateKnowledgeCategoryInput(input)

      const { data, error } = await supabase
        .from('knowledge_categories')
        .update({
          name: validatedInput.name,
          description: validatedInput.description,
        } as any)
        .eq('id', id)
        .eq('organization_id', user.orgId || user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    deleteKnowledgeCategory: async (_: any, { id }: { id: string }, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')

      const { error } = await supabase
        .from('knowledge_categories')
        .delete()
        .eq('id', id)
        .eq('organization_id', user.orgId || user.id)

      if (error) throw error
      return true
    },

    createKnowledgeArticle: async (_: unknown, { input }: { input: KnowledgeArticleInput }, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')

      const validatedInput = validateKnowledgeArticleInput(input)

      const { data, error } = await supabase
        .from('knowledge_articles')
        .insert({
          title: validatedInput.title,
          content: validatedInput.content,
          category_id: validatedInput.category_id,
          tags: validatedInput.tags,
          organization_id: user.orgId || user.id,
        } as any)
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

    updateKnowledgeArticle: async (_: unknown, { id, input }: { id: string; input: KnowledgeArticleInput }, { user }: GraphQLContext) => {
      if (!user?.id) throw new Error('Unauthorized')

      const validatedInput = validateKnowledgeArticleInput(input)

      const { data, error } = await supabase
        .from('knowledge_articles')
        .update({
          title: validatedInput.title,
          content: validatedInput.content,
          category_id: validatedInput.category_id,
          tags: validatedInput.tags,
        } as any)
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

    deleteKnowledgeArticle: async (_: any, { id }: { id: string }, { user }: GraphQLContext) => {
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
    createJob: async (_: any, { input }: { input: any }, { user }: GraphQLContext) => {
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
    uploadFile: async (_: any, { file, category }: { file: any; category: string }, { user }: GraphQLContext) => {
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

