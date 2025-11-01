import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export interface AgentPipelineSetting {
  id: string
  org_id: string
  agent_id: string
  pipeline_id: string
  is_active: boolean
  all_stages: boolean
  selected_stages: string[]
  stage_instructions: Record<string, string>
  created_at: string
  updated_at: string
}

/**
 * Проверяет, настроен ли агент для использования на конкретном этапе воронки
 * @param agentId - ID агента
 * @param organizationId - ID организации
 * @param pipelineId - ID воронки из CRM
 * @param stageId - ID этапа из CRM (опционально)
 * @returns true если агент настроен и активен для данного этапа, false в противном случае
 */
export const isAgentConfiguredForStage = async (
  agentId: string,
  organizationId: string,
  pipelineId: string,
  stageId?: string | null,
): Promise<boolean> => {
  const supabase = getSupabaseServiceRoleClient()

  try {
    const { data, error } = await supabase
      .from('agent_pipeline_settings')
      .select('*')
      .eq('agent_id', agentId)
      .eq('org_id', organizationId)
      .eq('pipeline_id', pipelineId)
      .eq('is_active', true)
      .maybeSingle()

    if (error || !data) {
      return false
    }

    // Если агент активен для воронки
    if (!data.is_active) {
      return false
    }

    // Если все этапы разрешены - агент настроен
    if (data.all_stages) {
      return true
    }

    // Если указан конкретный этап - проверяем, есть ли он в списке разрешенных
    if (stageId) {
      return data.selected_stages.includes(stageId)
    }

    // Если этап не указан, но есть выбранные этапы - агент не настроен (нужен конкретный этап)
    if (data.selected_stages.length > 0) {
      return false
    }

    // Если нет выбранных этапов и all_stages = false - агент не настроен
    return false
  } catch (error) {
    console.error('Failed to check agent pipeline settings', error)
    return false
  }
}

/**
 * Получает настройки агента для всех воронок
 */
export const getAgentPipelineSettings = async (
  agentId: string,
  organizationId: string,
): Promise<AgentPipelineSetting[]> => {
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase
    .from('agent_pipeline_settings')
    .select('*')
    .eq('agent_id', agentId)
    .eq('org_id', organizationId)

  if (error) {
    console.error('Failed to fetch agent pipeline settings', error)
    return []
  }

  return (data ?? []) as AgentPipelineSetting[]
}

/**
 * Получает все агенты организации, которые настроены для обработки сделок на конкретном этапе воронки
 * @param organizationId - ID организации
 * @param pipelineId - ID воронки из CRM
 * @param stageId - ID этапа из CRM
 * @returns Массив ID агентов, которые должны обработать событие
 */
export const getAgentsForPipelineStage = async (
  organizationId: string,
  pipelineId: string,
  stageId?: string | null,
): Promise<string[]> => {
  const supabase = getSupabaseServiceRoleClient()

  try {
    // Получаем все активные настройки для этой воронки
    const { data, error } = await supabase
      .from('agent_pipeline_settings')
      .select('agent_id, all_stages, selected_stages')
      .eq('org_id', organizationId)
      .eq('pipeline_id', pipelineId)
      .eq('is_active', true)

    if (error || !data) {
      return []
    }

    const agentIds: string[] = []

    for (const setting of data) {
      // Если все этапы разрешены - агент включен
      if (setting.all_stages) {
        agentIds.push(setting.agent_id)
        continue
      }

      // Если указан конкретный этап - проверяем, есть ли он в списке разрешенных
      if (stageId && setting.selected_stages && setting.selected_stages.includes(stageId)) {
        agentIds.push(setting.agent_id)
      }
    }

    return agentIds
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to get agents for pipeline stage', error)
    }
    return []
  }
}

