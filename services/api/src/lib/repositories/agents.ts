import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '../types'

export type AgentRow = Database['public']['Tables']['agents']['Row']

type AgentInsert = Database['public']['Tables']['agents']['Insert']

type AgentUpdate = Database['public']['Tables']['agents']['Update']

type ListAgentsInput = {
  orgId: string
  status?: 'active' | 'inactive' | 'draft'
  search?: string
  page: number
  limit: number
}

export const upsertAgent = async (
  supabase: SupabaseClient<Database>,
  payload: {
    orgId: string
    name: string
    model: string
    goal: string
    channels: string[]
    schedule: string
  },
): Promise<AgentRow> => {
  const insertPayload: AgentInsert = {
    org_id: payload.orgId,
    name: payload.name,
    default_model: payload.model,
    status: 'active',
    instructions: payload.goal,
    system_prompt: payload.goal,
    settings: {
      channels: payload.channels,
      schedule: payload.schedule,
    },
  }

  const { data, error } = await supabase
    .from('agents')
    .insert(insertPayload)
    .select('*')
    .single()

  if (error || !data) {
    throw error ?? new Error('Failed to create agent')
  }

  return data
}

export const listAgents = async (
  supabase: SupabaseClient<Database>,
  input: ListAgentsInput,
): Promise<{ agents: AgentRow[]; total: number }> => {
  let query = supabase
    .from('agents')
    .select('*', { count: 'exact' })
    .eq('org_id', input.orgId)
    .order('created_at', { ascending: false })
    .range((input.page - 1) * input.limit, input.page * input.limit - 1)

  if (input.status) {
    query = query.eq('status', input.status)
  }

  if (input.search) {
    query = query.ilike('name', `%${input.search}%`)
  }

  const { data, error, count } = await query

  if (error || !data) {
    throw error ?? new Error('Failed to list agents')
  }

  return {
    agents: data,
    total: count ?? data.length,
  }
}

export const updateAgentStatus = async (
  supabase: SupabaseClient<Database>,
  agentId: string,
  status: 'active' | 'inactive' | 'draft',
): Promise<AgentRow> => {
  const updatePayload: AgentUpdate = {
    status,
  }

  const { data, error } = await supabase
    .from('agents')
    .update(updatePayload)
    .eq('id', agentId)
    .select('*')
    .single()

  if (error || !data) {
    throw error ?? new Error('Failed to update agent status')
  }

  return data
}
