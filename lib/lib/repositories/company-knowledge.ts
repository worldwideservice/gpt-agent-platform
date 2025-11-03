/**
 * Репозиторий для работы со структурированными знаниями компании
 * Для обучения агентов как штатных сотрудников
 */

import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

export interface CompanyKnowledge {
 id: string
 orgId: string
 agentId: string | null
 category: 'product' | 'service' | 'process' | 'script' | 'objection' | 'company_info'
 title: string
 content: string
 metadata: Record<string, unknown>
 pipelineStageId: string | null
 isGlobal: boolean
 priority: number
 usageCount: number
 createdAt: string
 updatedAt: string
}

export interface SalesScript {
 id: string
 orgId: string
 agentId: string | null
 pipelineStageId: string | null
 title: string
 scriptType: 'greeting' | 'qualification' | 'presentation' | 'objection_handling' | 'closing'
 content: string
 variables: Record<string, unknown>
 conditions: Record<string, unknown>
 effectivenessScore: number
 usageCount: number
 createdAt: string
 updatedAt: string
}

export interface ObjectionResponse {
 id: string
 orgId: string
 objectionType: 'price' | 'timing' | 'need' | 'competitor' | 'trust' | 'other'
 objectionText: string | null
 responseScript: string
 context: Record<string, unknown>
 effectivenessScore: number
 usageCount: number
 createdAt: string
 updatedAt: string
}

/**
 * Получает знания компании для агента с учетом этапа воронки
 */
export const getCompanyKnowledgeForContext = async (
 organizationId: string,
 agentId: string | null,
 pipelineStageId: string | null = null,
 categories?: CompanyKnowledge['category'][],
): Promise<CompanyKnowledge[]> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('company_knowledge')
 .select('*')
 .eq('org_id', organizationId)
 .or(`is_global.eq.true${agentId ? `,agent_id.eq.${agentId}` : ''}`)

 if (categories && categories.length > 0) {
 query = query.in('category', categories)
 }

 if (pipelineStageId) {
 // Получаем знания для конкретного этапа или глобальные
 query = query.or(`pipeline_stage_id.is.null,pipeline_stage_id.eq.${pipelineStageId}`)
 } else {
 // Только глобальные знания или без привязки к этапу
 query = query.is('pipeline_stage_id', null)
 }

 query = query.order('priority', { ascending: false }).order('usage_count', { ascending: false }).limit(50)

 const { data, error } = await query

 if (error) {
 console.error('Failed to fetch company knowledge', error)
 throw new Error('Не удалось загрузить знания компании')
 }

 return ((data as unknown[]) ?? []).map((row) => {
 const typedRow = row as Record<string, unknown>
 return {
 id: typedRow.id as string,
 orgId: typedRow.org_id as string,
 agentId: (typedRow.agent_id as string | null) ?? null,
 category: typedRow.category as CompanyKnowledge['category'],
 title: typedRow.title as string,
 content: typedRow.content as string,
 metadata: (typedRow.metadata as Record<string, unknown>) ?? {},
 pipelineStageId: (typedRow.pipeline_stage_id as string | null) ?? null,
 isGlobal: (typedRow.is_global as boolean) ?? true,
 priority: (typedRow.priority as number) ?? 0,
 usageCount: (typedRow.usage_count as number) ?? 0,
 createdAt: typedRow.created_at as string,
 updatedAt: typedRow.updated_at as string,
 }
 })
}

/**
 * Получает скрипт продаж для этапа воронки
 */
export const getSalesScriptForStage = async (
 organizationId: string,
 pipelineStageId: string,
 scriptType?: SalesScript['scriptType'],
): Promise<SalesScript[]> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('sales_scripts')
 .select('*')
 .eq('org_id', organizationId)
 .eq('pipeline_stage_id', pipelineStageId)

 if (scriptType) {
 query = query.eq('script_type', scriptType)
 }

 query = query.order('effectiveness_score', { ascending: false }).order('usage_count', { ascending: false })

 const { data, error } = await query

 if (error) {
 console.error('Failed to fetch sales scripts', error)
 throw new Error('Не удалось загрузить скрипты продаж')
 }

 return ((data as unknown[]) ?? []).map((row) => {
 const typedRow = row as Record<string, unknown>
 return {
 id: typedRow.id as string,
 orgId: typedRow.org_id as string,
 agentId: (typedRow.agent_id as string | null) ?? null,
 pipelineStageId: (typedRow.pipeline_stage_id as string | null) ?? null,
 title: typedRow.title as string,
 scriptType: typedRow.script_type as SalesScript['scriptType'],
 content: typedRow.content as string,
 variables: (typedRow.variables as Record<string, unknown>) ?? {},
 conditions: (typedRow.conditions as Record<string, unknown>) ?? {},
 effectivenessScore: (typedRow.effectiveness_score as number) ?? 0.5,
 usageCount: (typedRow.usage_count as number) ?? 0,
 createdAt: typedRow.created_at as string,
 updatedAt: typedRow.updated_at as string,
 }
 })
}

/**
 * Получает ответы на возражения
 */
export const getObjectionResponses = async (
 organizationId: string,
 objectionType?: ObjectionResponse['objectionType'],
): Promise<ObjectionResponse[]> => {
 const supabase = getSupabaseServiceRoleClient()

 let query = supabase.from('objection_responses').select('*').eq('org_id', organizationId)

 if (objectionType) {
 query = query.eq('objection_type', objectionType)
 }

 query = query.order('effectiveness_score', { ascending: false }).order('usage_count', { ascending: false })

 const { data, error } = await query

 if (error) {
 console.error('Failed to fetch objection responses', error)
 throw new Error('Не удалось загрузить ответы на возражения')
 }

 return ((data as unknown[]) ?? []).map((row) => {
 const typedRow = row as Record<string, unknown>
 return {
 id: typedRow.id as string,
 orgId: typedRow.org_id as string,
 objectionType: typedRow.objection_type as ObjectionResponse['objectionType'],
 objectionText: (typedRow.objection_text as string | null) ?? null,
 responseScript: typedRow.response_script as string,
 context: (typedRow.context as Record<string, unknown>) ?? {},
 effectivenessScore: (typedRow.effectiveness_score as number) ?? 0.5,
 usageCount: (typedRow.usage_count as number) ?? 0,
 createdAt: typedRow.created_at as string,
 updatedAt: typedRow.updated_at as string,
 }
 })
}

/**
 * Создает новое знание о компании
 */
export const createCompanyKnowledge = async (
 organizationId: string,
 data: {
 agentId?: string | null
 category: CompanyKnowledge['category']
 title: string
 content: string
 metadata?: Record<string, unknown>
 pipelineStageId?: string | null
 isGlobal?: boolean
 priority?: number
 },
): Promise<CompanyKnowledge> => {
 const supabase = getSupabaseServiceRoleClient()

 const { data: knowledge, error } = await supabase
 .from('company_knowledge')
 .insert({
 org_id: organizationId,
 agent_id: data.agentId ?? null,
 category: data.category,
 title: data.title,
 content: data.content,
 metadata: data.metadata ?? {},
 pipeline_stage_id: data.pipelineStageId ?? null,
 is_global: data.isGlobal ?? true,
 priority: data.priority ?? 0,
 })
 .select('*')
 .single()

 if (error || !knowledge) {
 console.error('Failed to create company knowledge', error)
 throw new Error('Не удалось создать знание о компании')
 }

 const row = knowledge as Record<string, unknown>

 return {
 id: row.id as string,
 orgId: row.org_id as string,
 agentId: (row.agent_id as string | null) ?? null,
 category: row.category as CompanyKnowledge['category'],
 title: row.title as string,
 content: row.content as string,
 metadata: (row.metadata as Record<string, unknown>) ?? {},
 pipelineStageId: (row.pipeline_stage_id as string | null) ?? null,
 isGlobal: (row.is_global as boolean) ?? true,
 priority: (row.priority as number) ?? 0,
 usageCount: (row.usage_count as number) ?? 0,
 createdAt: row.created_at as string,
 updatedAt: row.updated_at as string,
 }
}

/**
 * Инкрементирует счетчик использования знания
 */
export const incrementKnowledgeUsage = async (knowledgeId: string): Promise<void> => {
 const supabase = getSupabaseServiceRoleClient()

 const { error } = await supabase.rpc('increment_usage_count', {
 table_name: 'company_knowledge',
 row_id: knowledgeId,
 })

 // Fallback если функция не существует
 if (error) {
 const { data: current } = await supabase
 .from('company_knowledge')
 .select('usage_count')
 .eq('id', knowledgeId)
 .single()

 if (current) {
 await supabase
 .from('company_knowledge')
 .update({ usage_count: ((current as { usage_count: number }).usage_count ?? 0) + 1 })
 .eq('id', knowledgeId)
 }
 }
}


