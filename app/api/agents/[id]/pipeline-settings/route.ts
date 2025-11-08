import { NextResponse, type NextRequest } from 'next/server'

import { z } from 'zod'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'


// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
const pipelineSettingsSchema = z.object({
 pipelineId: z.string(),
 isActive: z.boolean(),
 allStages: z.boolean(),
 selectedStages: z.array(z.string()),
 stageInstructions: z.record(z.string(), z.string()).optional(),
})

/**
 * GET /api/agents/[id]/pipeline-settings - Получение настроек воронок для агента
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

 const supabase = getSupabaseServiceRoleClient()

 const { data, error } = await supabase
 .from('agent_pipeline_settings')
 .select('*')
 .eq('agent_id', agentId)
 .eq('org_id', session.user.orgId)

 if (error) {
 logger.error('Failed to fetch pipeline settings', error, {
   endpoint: '/api/agents/[id]/pipeline-settings',
   method: 'GET',
   agentId,
 })
 throw new Error('Не удалось загрузить настройки воронок')
 }

 return NextResponse.json({
 success: true,
 data: data ?? [],
 })
 } catch (error: unknown) {
 logger.error('Pipeline settings API error', error, {
   endpoint: '/api/agents/[id]/pipeline-settings',
   method: 'GET',
   agentId,
 })

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить настройки воронок',
 },
 { status: 500 },
 )
 }
}

/**
 * POST /api/agents/[id]/pipeline-settings - Сохранение настроек воронок для агента
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
 const parsed = z.array(pipelineSettingsSchema).safeParse(body)

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

 // Удаляем старые настройки
 await supabase
 .from('agent_pipeline_settings')
 .delete()
 .eq('agent_id', agentId)
 .eq('org_id', session.user.orgId)

 // Сохраняем новые настройки
 const settingsToInsert = parsed.data.map((setting) => ({
 org_id: session.user.orgId,
 agent_id: agentId,
 pipeline_id: setting.pipelineId,
 is_active: setting.isActive,
 all_stages: setting.allStages,
 selected_stages: setting.selectedStages,
 stage_instructions: setting.stageInstructions ?? {},
 }))

 const { data, error } = await supabase
 .from('agent_pipeline_settings')
 .insert(settingsToInsert)
 .select()

 if (error) {
 logger.error('Failed to save pipeline settings', error, {
   endpoint: '/api/agents/[id]/pipeline-settings',
   method: 'POST',
   agentId,
 })
 throw new Error('Не удалось сохранить настройки воронок')
 }

 return NextResponse.json({
 success: true,
 data,
 })
 } catch (error: unknown) {
 logger.error('Pipeline settings save API error', error, {
   endpoint: '/api/agents/[id]/pipeline-settings',
   method: 'POST',
   agentId,
 })

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось сохранить настройки воронок',
 },
 { status: 500 },
 )
 }
}


