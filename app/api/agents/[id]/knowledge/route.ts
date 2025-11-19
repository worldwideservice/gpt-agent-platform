// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import {
 getCompanyKnowledgeForContext,
 createCompanyKnowledge,
 type CompanyKnowledge,
} from '@/lib/repositories/company-knowledge'

/**
 * GET /api/agents/[id]/knowledge - Получение знаний для агента
 */
export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
 const { id: agentId } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 // Проверяем агента
 const agent = await getAgentById(agentId, session.user.orgId)
 if (!agent) {
 return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
 }

 const { searchParams } = new URL(request.url)
 const category = searchParams.get('category')
 const stageId = searchParams.get('stageId')

 const knowledge = await getCompanyKnowledgeForContext(
 session.user.orgId,
 agentId,
 stageId ?? null,
 category ? [category as CompanyKnowledge['category']] : undefined,
 )

 return NextResponse.json({
 success: true,
 data: knowledge,
 })
 } catch (error) {
 console.error('Knowledge API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить знания',
 },
 { status: 500 },
 )
 }
}

const createKnowledgeSchema = z.object({
 category: z.enum(['product', 'service', 'process', 'script', 'objection', 'company_info']),
 title: z.string().min(1),
 content: z.string().min(1),
 metadata: z.record(z.string(), z.unknown()).optional(),
 pipelineStageId: z.string().uuid().nullable().optional(),
 isGlobal: z.boolean().optional().default(true),
 priority: z.number().int().optional().default(0),
})

/**
 * POST /api/agents/[id]/knowledge - Создание знания для агента
 */
export const POST = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
 const { id: agentId } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 // Проверяем агента
 const agent = await getAgentById(agentId, session.user.orgId)
 if (!agent) {
 return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
 }

 const body = await request.json()
 const parsed = createKnowledgeSchema.safeParse(body)

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

 const knowledge = await createCompanyKnowledge(session.user.orgId, {
 agentId,
 ...parsed.data,
 })

 return NextResponse.json({
 success: true,
 data: knowledge,
 })
 } catch (error) {
 console.error('Knowledge create API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось создать знание',
 },
 { status: 500 },
 )
 }
}


