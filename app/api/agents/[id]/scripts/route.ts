import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

import type { SalesScript } from '@/lib/repositories/company-knowledge'

/**
 * GET /api/agents/[id]/scripts - Получение скриптов продаж для агента
 */
export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
 const { id: agentId } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const agent = await getAgentById(agentId, session.user.orgId)
 if (!agent) {
 return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
 }

 const { searchParams } = new URL(request.url)
 const stageId = searchParams.get('stageId')
 const scriptType = searchParams.get('scriptType')

 const supabase = getSupabaseServiceRoleClient()

 let query = supabase
 .from('sales_scripts')
 .select('*')
 .eq('org_id', session.user.orgId)
 .or(`agent_id.is.null,agent_id.eq.${agentId}`)

 if (stageId) {
 query = query.or(`pipeline_stage_id.is.null,pipeline_stage_id.eq.${stageId}`)
 }

 if (scriptType) {
 query = query.eq('script_type', scriptType)
 }

 query = query.order('effectiveness_score', { ascending: false }).order('usage_count', { ascending: false })

 const { data, error } = await query

 if (error) {
 console.error('Failed to fetch sales scripts', error)
 throw new Error('Не удалось загрузить скрипты')
 }

 const scripts: SalesScript[] = ((data as unknown[]) ?? []).map((row) => {
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
 effectivenessScore: Number(typedRow.effectiveness_score ?? 0.5),
 usageCount: Number(typedRow.usage_count ?? 0),
 createdAt: typedRow.created_at as string,
 updatedAt: typedRow.updated_at as string,
 }
 })

 return NextResponse.json({
 success: true,
 data: scripts,
 })
 } catch (error) {
 console.error('Scripts API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить скрипты',
 },
 { status: 500 },
 )
 }
}

const createScriptSchema = z.object({
 title: z.string().min(1),
 scriptType: z.enum(['greeting', 'qualification', 'presentation', 'objection_handling', 'closing']),
 content: z.string().min(1),
 pipelineStageId: z.string().uuid().nullable().optional(),
 variables: z.record(z.string(), z.unknown()).optional().default({}),
 conditions: z.record(z.string(), z.unknown()).optional().default({}),
})

/**
 * POST /api/agents/[id]/scripts - Создание скрипта продаж
 */
export const POST = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
 const { id: agentId } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const agent = await getAgentById(agentId, session.user.orgId)
 if (!agent) {
 return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
 }

 const body = await request.json()
 const parsed = createScriptSchema.safeParse(body)

 if (!parsed.success) {
 return NextResponse.json(
 {
 success: false,
 error: 'Некорректные данные',
 details: parsed.error.issues,
 },
 { status: 400 },
 )
 }

 const supabase = getSupabaseServiceRoleClient()

 const { data: script, error } = await supabase
 .from('sales_scripts')
 .insert({
 org_id: session.user.orgId,
 agent_id: agentId,
 pipeline_stage_id: parsed.data.pipelineStageId ?? null,
 title: parsed.data.title,
 script_type: parsed.data.scriptType,
 content: parsed.data.content,
 variables: parsed.data.variables ?? {},
 conditions: parsed.data.conditions ?? {},
 })
 .select('*')
 .single()

 if (error || !script) {
 console.error('Failed to create sales script', error)
 throw new Error('Не удалось создать скрипт')
 }

 const row = script as Record<string, unknown>

 const result: SalesScript = {
 id: row.id as string,
 orgId: row.org_id as string,
 agentId: (row.agent_id as string | null) ?? null,
 pipelineStageId: (row.pipeline_stage_id as string | null) ?? null,
 title: row.title as string,
 scriptType: row.script_type as SalesScript['scriptType'],
 content: row.content as string,
 variables: (row.variables as Record<string, unknown>) ?? {},
 conditions: (row.conditions as Record<string, unknown>) ?? {},
 effectivenessScore: Number(row.effectiveness_score ?? 0.5),
 usageCount: Number(row.usage_count ?? 0),
 createdAt: row.created_at as string,
 updatedAt: row.updated_at as string,
 }

 return NextResponse.json({
 success: true,
 data: result,
 })
 } catch (error) {
 console.error('Script create API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось создать скрипт',
 },
 { status: 500 },
 )
 }
}


