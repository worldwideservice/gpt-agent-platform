import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

import type { Json } from '@/types/supabase'

import type {
 AgentChannelRow,
 AgentSequenceRow,
 AgentSequenceStepRow,
} from '@/types/supabase'

export interface AgentSequenceStep {
 id: string
 stepType: string
 payload: Record<string, unknown>
 delaySeconds: number
 sortOrder: number
 createdAt: string
 updatedAt: string
}

export interface AgentSequence {
 id: string
 orgId: string
 agentId: string
 name: string
 description: string | null
 isActive: boolean
 sortOrder: number
 settings: Record<string, unknown>
 createdAt: string
 updatedAt: string
 steps: AgentSequenceStep[]
}

export interface AgentChannel {
 id: string
 agentId: string
 orgId: string
 channel: string
 isEnabled: boolean
 settings: Record<string, unknown>
 createdAt: string
 updatedAt: string
}

const mapSequenceStepRowToDomain = (row: AgentSequenceStepRow): AgentSequenceStep => {
 return {
 id: row.id,
 stepType: row.step_type,
 payload: (row.payload as Record<string, unknown> | null) ?? {},
 delaySeconds: row.delay_seconds ?? 0,
 sortOrder: row.sort_order ?? 0,
 createdAt: row.created_at,
 updatedAt: row.updated_at,
 }
}

const mapSequenceRowToDomain = (
 row: AgentSequenceRow,
 steps: AgentSequenceStepRow[],
): AgentSequence => {
 return {
 id: row.id,
 orgId: row.org_id,
 agentId: row.agent_id,
 name: row.name,
 description: row.description,
 isActive: row.is_active ?? true,
 sortOrder: row.sort_order ?? 0,
 settings: (row.settings as Record<string, unknown> | null) ?? {},
 createdAt: row.created_at,
 updatedAt: row.updated_at,
 steps: steps.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map(mapSequenceStepRowToDomain),
 }
}

const mapChannelRowToDomain = (row: AgentChannelRow): AgentChannel => {
 return {
 id: row.id,
 agentId: row.agent_id,
 orgId: row.org_id,
 channel: row.channel,
 isEnabled: row.is_enabled ?? false,
 settings: (row.settings as Record<string, unknown> | null) ?? {},
 createdAt: row.created_at,
 updatedAt: row.updated_at,
 }
}

export const getAgentSequences = async (
 organizationId: string,
 agentId: string,
): Promise<AgentSequence[]> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('agent_sequences')
 .select(
 `
 *,
 agent_sequence_steps (* )
 `,
 )
 .eq('org_id', organizationId)
 .eq('agent_id', agentId)
 .order('sort_order', { ascending: true })
 .order('created_at', { ascending: true })

 if (error) {
 console.error('Failed to fetch agent sequences', error)
 throw new Error('Не удалось загрузить цепочки')
 }

 const sequences = ((data as (AgentSequenceRow & { agent_sequence_steps: AgentSequenceStepRow[] })[] | null) ?? []).map(
 (row) => mapSequenceRowToDomain(row, row.agent_sequence_steps ?? []),
 )

 return sequences
}

export const getAgentSequenceById = async (
 organizationId: string,
 agentId: string,
 sequenceId: string,
): Promise<AgentSequence | null> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('agent_sequences')
 .select(
 `
 *,
 agent_sequence_steps (*)
 `,
 )
 .eq('id', sequenceId)
 .eq('org_id', organizationId)
 .eq('agent_id', agentId)
 .maybeSingle()

 if (error) {
 console.error('Failed to fetch agent sequence', error)
 throw new Error('Не удалось загрузить цепочку')
 }

 if (!data) {
 return null
 }

 const row = data as AgentSequenceRow & { agent_sequence_steps: AgentSequenceStepRow[] }
 return mapSequenceRowToDomain(row, row.agent_sequence_steps ?? [])
}

interface SequenceInput {
 name?: string
 description?: string | null
 isActive?: boolean
 sortOrder?: number
 settings?: Record<string, unknown>
 steps?: Array<{
 id?: string
 stepType: string
 payload?: Record<string, unknown>
 delaySeconds?: number
 sortOrder?: number
 }>
}

export const createAgentSequence = async (
 organizationId: string,
 agentId: string,
 input: SequenceInput,
): Promise<AgentSequence> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('agent_sequences')
 .insert({
 org_id: organizationId,
 agent_id: agentId,
 name: input.name,
 description: input.description ?? null,
 is_active: input.isActive ?? true,
 sort_order: input.sortOrder ?? 0,
 settings: input.settings ?? {},
 })
 .select('*')
 .single()

 if (error || !data) {
 console.error('Failed to create agent sequence', error)
 throw new Error('Не удалось создать цепочку')
 }

 const sequenceRow = data as AgentSequenceRow

 if (input.steps && input.steps.length > 0) {
 const stepRows = input.steps.map((step, index) => ({
 sequence_id: sequenceRow.id,
 step_type: step.stepType,
 payload: step.payload ?? {},
 delay_seconds: step.delaySeconds ?? 0,
 sort_order: step.sortOrder ?? index,
 }))

 const { error: stepsError } = await supabase.from('agent_sequence_steps').insert(stepRows)

 if (stepsError) {
 console.error('Failed to create agent sequence steps', stepsError)
 throw new Error('Не удалось сохранить шаги цепочки')
 }
 }

 return await getAgentSequenceById(organizationId, agentId, sequenceRow.id).then((sequence) => {
 if (!sequence) {
 throw new Error('Не удалось загрузить созданную цепочку')
 }
 return sequence
 })
}

export const updateAgentSequence = async (
 organizationId: string,
 agentId: string,
 sequenceId: string,
 input: SequenceInput,
): Promise<AgentSequence> => {
 const supabase = getSupabaseServiceRoleClient()

 const updatePayload: Partial<AgentSequenceRow> = {}

 if (input.name !== undefined) {
 updatePayload.name = input.name
 }
 if (input.description !== undefined) {
 updatePayload.description = input.description ?? null
 }
 if (input.isActive !== undefined) {
 updatePayload.is_active = input.isActive
 }
 if (input.sortOrder !== undefined) {
 updatePayload.sort_order = input.sortOrder
 }
 if (input.settings !== undefined) {
 updatePayload.settings = input.settings as unknown as Json
 }

 if (Object.keys(updatePayload).length > 0) {
 const { error } = await supabase
 .from('agent_sequences')
 .update(updatePayload)
 .eq('id', sequenceId)
 .eq('org_id', organizationId)
 .eq('agent_id', agentId)

 if (error) {
 console.error('Failed to update agent sequence', error)
 throw new Error('Не удалось обновить цепочку')
 }
 }

 if (input.steps) {
 await supabase.from('agent_sequence_steps').delete().eq('sequence_id', sequenceId)

 if (input.steps.length > 0) {
 const stepRows = input.steps.map((step, index) => ({
 sequence_id: sequenceId,
 step_type: step.stepType,
 payload: step.payload ?? {},
 delay_seconds: step.delaySeconds ?? 0,
 sort_order: step.sortOrder ?? index,
 }))

 const { error: stepInsertError } = await supabase.from('agent_sequence_steps').insert(stepRows)

 if (stepInsertError) {
 console.error('Failed to update agent sequence steps', stepInsertError)
 throw new Error('Не удалось обновить шаги цепочки')
 }
 }
 }

 const sequence = await getAgentSequenceById(organizationId, agentId, sequenceId)

 if (!sequence) {
 throw new Error('Цепочка не найдена')
 }

 return sequence
}

export const deleteAgentSequence = async (
 organizationId: string,
 agentId: string,
 sequenceId: string,
): Promise<void> => {
 const supabase = getSupabaseServiceRoleClient()

 const { error } = await supabase
 .from('agent_sequences')
 .delete()
 .eq('id', sequenceId)
 .eq('org_id', organizationId)
 .eq('agent_id', agentId)

 if (error) {
 console.error('Failed to delete agent sequence', error)
 throw new Error('Не удалось удалить цепочку')
 }
}

export const getAgentChannels = async (
 organizationId: string,
 agentId: string,
): Promise<AgentChannel[]> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('agent_channels')
 .select('*')
 .eq('org_id', organizationId)
 .eq('agent_id', agentId)
 .order('channel', { ascending: true })

 if (error) {
 console.error('Failed to fetch agent channels', error)
 throw new Error('Не удалось загрузить каналы')
 }

 return ((data as AgentChannelRow[] | null) ?? []).map(mapChannelRowToDomain)
}

export const upsertAgentChannel = async (
 organizationId: string,
 agentId: string,
 channel: string,
 input: { isEnabled: boolean; settings?: Record<string, unknown> },
): Promise<AgentChannel> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('agent_channels')
 .upsert(
 {
 org_id: organizationId,
 agent_id: agentId,
 channel,
 is_enabled: input.isEnabled,
 settings: input.settings ?? {},
 },
 { onConflict: 'agent_id,channel' },
 )
 .select('*')
 .single()

 if (error || !data) {
 console.error('Failed to upsert agent channel', error)
 throw new Error('Не удалось обновить канал')
 }

 return mapChannelRowToDomain(data as AgentChannelRow)
}

export const deleteAgentChannel = async (
 organizationId: string,
 agentId: string,
 channel: string,
): Promise<void> => {
 const supabase = getSupabaseServiceRoleClient()

 const { error } = await supabase
 .from('agent_channels')
 .delete()
 .eq('org_id', organizationId)
 .eq('agent_id', agentId)
 .eq('channel', channel)

 if (error) {
 console.error('Failed to delete agent channel', error)
 throw new Error('Не удалось удалить канал')
 }
}



