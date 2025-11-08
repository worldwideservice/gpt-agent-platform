import { NextResponse, type NextRequest } from 'next/server'

import { z } from 'zod'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

import type { ObjectionResponse } from '@/lib/repositories/company-knowledge'


// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
/**
 * GET /api/agents/[id]/objections - Получение ответов на возражения
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
 const objectionType = searchParams.get('objectionType')

 const supabase = getSupabaseServiceRoleClient()

 let query = supabase.from('objection_responses').select('*').eq('org_id', session.user.orgId)

 if (objectionType) {
 query = query.eq('objection_type', objectionType)
 }

 query = query.order('effectiveness_score', { ascending: false }).order('usage_count', { ascending: false })

 const { data, error } = await query

 if (error) {
 logger.error('Failed to fetch objection responses', error, {
   endpoint: '/api/agents/[id]/objections',
   method: 'GET',
   agentId,
 })
 throw new Error('Не удалось загрузить ответы на возражения')
 }

 const objections: ObjectionResponse[] = ((data as unknown[]) ?? []).map((row) => {
 const typedRow = row as Record<string, unknown>
 return {
 id: typedRow.id as string,
 orgId: typedRow.org_id as string,
 objectionType: typedRow.objection_type as ObjectionResponse['objectionType'],
 objectionText: (typedRow.objection_text as string | null) ?? null,
 responseScript: typedRow.response_script as string,
 context: (typedRow.context as Record<string, unknown>) ?? {},
 effectivenessScore: Number(typedRow.effectiveness_score ?? 0.5),
 usageCount: Number(typedRow.usage_count ?? 0),
 createdAt: typedRow.created_at as string,
 updatedAt: typedRow.updated_at as string,
 }
 })

 return NextResponse.json({
 success: true,
 data: objections,
 })
 } catch (error: unknown) {
 logger.error('Objections API error', error, {
   endpoint: '/api/agents/[id]/objections',
   method: 'GET',
   agentId,
 })

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить ответы на возражения',
 },
 { status: 500 },
 )
 }
}

const createObjectionSchema = z.object({
 objectionType: z.enum(['price', 'timing', 'need', 'competitor', 'trust', 'other']),
 objectionText: z.string().nullable().optional(),
 responseScript: z.string().min(1),
 context: z.record(z.string(), z.unknown()).optional().default({}),
})

/**
 * POST /api/agents/[id]/objections - Создание ответа на возражение
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
 const parsed = createObjectionSchema.safeParse(body)

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

 const { data: objection, error } = await supabase
 .from('objection_responses')
 .insert({
 org_id: session.user.orgId,
 objection_type: parsed.data.objectionType,
 objection_text: parsed.data.objectionText ?? null,
 response_script: parsed.data.responseScript,
 context: parsed.data.context ?? {},
 })
 .select('*')
 .single()

 if (error || !objection) {
 logger.error('Failed to create objection response', error, {
   endpoint: '/api/agents/[id]/objections',
   method: 'POST',
   agentId,
 })
 throw new Error('Не удалось создать ответ на возражение')
 }

 const row = objection as Record<string, unknown>

 const result: ObjectionResponse = {
 id: row.id as string,
 orgId: row.org_id as string,
 objectionType: row.objection_type as ObjectionResponse['objectionType'],
 objectionText: (row.objection_text as string | null) ?? null,
 responseScript: row.response_script as string,
 context: (row.context as Record<string, unknown>) ?? {},
 effectivenessScore: Number(row.effectiveness_score ?? 0.5),
 usageCount: Number(row.usage_count ?? 0),
 createdAt: row.created_at as string,
 updatedAt: row.updated_at as string,
 }

 return NextResponse.json({
 success: true,
 data: result,
 })
 } catch (error: unknown) {
 logger.error('Objection create API error', error, {
   endpoint: '/api/agents/[id]/objections',
   method: 'POST',
   agentId,
 })

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось создать ответ на возражение',
 },
 { status: 500 },
 )
 }
}


