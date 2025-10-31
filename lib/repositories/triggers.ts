import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export interface TriggerCondition {
  id: string
  conditionType: string
  payload: Record<string, unknown>
  ordering: number
}

export interface TriggerAction {
  id: string
  actionType: string
  payload: Record<string, unknown>
  ordering: number
}

export interface Trigger {
  id: string
  agentId: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  conditions: TriggerCondition[]
  actions: TriggerAction[]
}

interface TriggerRow {
  id: string
  agent_id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface TriggerConditionRow {
  id: string
  trigger_id: string
  condition_type: string
  payload: unknown
  ordering: number
}

interface TriggerActionRow {
  id: string
  trigger_id: string
  action_type: string
  payload: unknown
  ordering: number
}

const mapTriggerRowToDomain = async (
  row: TriggerRow,
  supabase: ReturnType<typeof getSupabaseServiceRoleClient>,
): Promise<Trigger> => {
  const { data: conditionsData } = await supabase
    .from('agent_trigger_conditions')
    .select('*')
    .eq('trigger_id', row.id)
    .order('ordering', { ascending: true })

  const { data: actionsData } = await supabase
    .from('agent_trigger_actions')
    .select('*')
    .eq('trigger_id', row.id)
    .order('ordering', { ascending: true })

  const conditions = ((conditionsData as TriggerConditionRow[] | null) ?? []).map((cond) => ({
    id: cond.id,
    conditionType: cond.condition_type,
    payload: (cond.payload as Record<string, unknown>) ?? {},
    ordering: cond.ordering,
  }))

  const actions = ((actionsData as TriggerActionRow[] | null) ?? []).map((action) => ({
    id: action.id,
    actionType: action.action_type,
    payload: (action.payload as Record<string, unknown>) ?? {},
    ordering: action.ordering,
  }))

  return {
    id: row.id,
    agentId: row.agent_id,
    name: row.name,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    conditions,
    actions,
  }
}

export const getTriggers = async (agentId: string): Promise<Trigger[]> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('agent_triggers')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch triggers', error)
    throw new Error('Не удалось загрузить триггеры')
  }

  const rows = (data as TriggerRow[] | null) ?? []

  return Promise.all(rows.map((row) => mapTriggerRowToDomain(row, supabase)))
}

export const getTriggerById = async (triggerId: string, agentId: string): Promise<Trigger | null> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('agent_triggers')
    .select('*')
    .eq('id', triggerId)
    .eq('agent_id', agentId)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch trigger', error)
    throw new Error('Не удалось загрузить триггер')
  }

  if (!data) {
    return null
  }

  return mapTriggerRowToDomain(data as TriggerRow, supabase)
}

export const createTrigger = async (
  agentId: string,
  data: {
    name: string
    description?: string
    isActive?: boolean
    conditions: Array<{ conditionType: string; payload: Record<string, unknown>; ordering: number }>
    actions: Array<{ actionType: string; payload: Record<string, unknown>; ordering: number }>
  },
): Promise<Trigger> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data: triggerData, error: triggerError } = await supabase
    .from('agent_triggers')
    .insert({
      agent_id: agentId,
      name: data.name,
      description: data.description ?? null,
      is_active: data.isActive ?? true,
    })
    .select('*')
    .single()

  if (triggerError) {
    console.error('Failed to create trigger', triggerError)
    throw new Error('Не удалось создать триггер')
  }

  const triggerRow = triggerData as TriggerRow

  if (data.conditions.length > 0) {
    const { error: conditionsError } = await supabase.from('agent_trigger_conditions').insert(
      data.conditions.map((cond) => ({
        trigger_id: triggerRow.id,
        condition_type: cond.conditionType,
        payload: cond.payload,
        ordering: cond.ordering,
      })),
    )

    if (conditionsError) {
      console.error('Failed to create trigger conditions', conditionsError)
      throw new Error('Не удалось создать условия триггера')
    }
  }

  if (data.actions.length > 0) {
    const { error: actionsError } = await supabase.from('agent_trigger_actions').insert(
      data.actions.map((action) => ({
        trigger_id: triggerRow.id,
        action_type: action.actionType,
        payload: action.payload,
        ordering: action.ordering,
      })),
    )

    if (actionsError) {
      console.error('Failed to create trigger actions', actionsError)
      throw new Error('Не удалось создать действия триггера')
    }
  }

  return mapTriggerRowToDomain(triggerRow, supabase)
}

export const updateTrigger = async (
  triggerId: string,
  agentId: string,
  data: {
    name?: string
    description?: string
    isActive?: boolean
    conditions?: Array<{ id?: string; conditionType: string; payload: Record<string, unknown>; ordering: number }>
    actions?: Array<{ id?: string; actionType: string; payload: Record<string, unknown>; ordering: number }>
  },
): Promise<Trigger> => {
  const supabase = getSupabaseServiceRoleClient()

  const updatePayload: Record<string, unknown> = {}

  if (data.name !== undefined) {
    updatePayload.name = data.name
  }

  if (data.description !== undefined) {
    updatePayload.description = data.description
  }

  if (data.isActive !== undefined) {
    updatePayload.is_active = data.isActive
  }

  const { data: triggerData, error: triggerError } = await supabase
    .from('agent_triggers')
    .update(updatePayload)
    .eq('id', triggerId)
    .eq('agent_id', agentId)
    .select('*')
    .single()

  if (triggerError) {
    console.error('Failed to update trigger', triggerError)
    throw new Error('Не удалось обновить триггер')
  }

  if (!triggerData) {
    throw new Error('Триггер не найден')
  }

  const triggerRow = triggerData as TriggerRow

  if (data.conditions !== undefined) {
    await supabase.from('agent_trigger_conditions').delete().eq('trigger_id', triggerRow.id)

    if (data.conditions.length > 0) {
      const { error: conditionsError } = await supabase.from('agent_trigger_conditions').insert(
        data.conditions.map((cond) => ({
          trigger_id: triggerRow.id,
          condition_type: cond.conditionType,
          payload: cond.payload,
          ordering: cond.ordering,
        })),
      )

      if (conditionsError) {
        console.error('Failed to update trigger conditions', conditionsError)
        throw new Error('Не удалось обновить условия триггера')
      }
    }
  }

  if (data.actions !== undefined) {
    await supabase.from('agent_trigger_actions').delete().eq('trigger_id', triggerRow.id)

    if (data.actions.length > 0) {
      const { error: actionsError } = await supabase.from('agent_trigger_actions').insert(
        data.actions.map((action) => ({
          trigger_id: triggerRow.id,
          action_type: action.actionType,
          payload: action.payload,
          ordering: action.ordering,
        })),
      )

      if (actionsError) {
        console.error('Failed to update trigger actions', actionsError)
        throw new Error('Не удалось обновить действия триггера')
      }
    }
  }

  return mapTriggerRowToDomain(triggerRow, supabase)
}

export const deleteTrigger = async (triggerId: string, agentId: string): Promise<void> => {
  const supabase = getSupabaseServiceRoleClient()

  const { error } = await supabase.from('agent_triggers').delete().eq('id', triggerId).eq('agent_id', agentId)

  if (error) {
    console.error('Failed to delete trigger', error)
    throw new Error('Не удалось удалить триггер')
  }
}

export const updateTriggerStatus = async (triggerId: string, agentId: string, isActive: boolean): Promise<Trigger> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('agent_triggers')
    .update({ is_active: isActive })
    .eq('id', triggerId)
    .eq('agent_id', agentId)
    .select('*')
    .single()

  if (error) {
    console.error('Failed to update trigger status', error)
    throw new Error('Не удалось обновить статус триггера')
  }

  if (!data) {
    throw new Error('Триггер не найден')
  }

  return mapTriggerRowToDomain(data as TriggerRow, supabase)
}











