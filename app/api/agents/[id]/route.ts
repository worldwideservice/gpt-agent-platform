import { NextResponse, type NextRequest } from 'next/server'

import { z } from 'zod'

import { auth } from '@/auth'
import { getAgentById, updateAgent, deleteAgent } from '@/lib/repositories/agents'


// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
const settingsSchema = z
 .object({
 language: z.string().optional(),
 welcomeMessage: z.string().optional(),
 description: z.string().optional(),
 presencePenalty: z.number().min(-2).max(2).optional(),
 frequencyPenalty: z.number().min(-2).max(2).optional(),
 defaultChannels: z.array(z.string()).optional(),
 knowledgeBaseAllCategories: z.boolean().optional(),
 createTaskOnNotFound: z.boolean().optional(),
 notFoundMessage: z.string().optional(),
 checkBeforeSending: z.boolean().optional(),
 })
 .optional()

const updateSchema = z.object({
 name: z.string().min(1).optional(),
 status: z.enum(['active', 'inactive', 'draft']).optional(),
 model: z.string().optional(),
 instructions: z.string().optional(),
 temperature: z.number().min(0).max(2).optional(),
 maxTokens: z.number().int().min(128).max(8000).optional(),
 responseDelaySeconds: z.number().int().min(0).max(86400).optional(),
 settings: settingsSchema,
})

export const GET = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> },
) => {
 const { id } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const agent = await getAgentById(id, session.user.orgId)

 if (!agent) {
 return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
 }

 return NextResponse.json({
 success: true,
 data: agent,
 })
 } catch (error) {
 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить агента',
 },
 { status: 500 },
 )
 }
}

export const PATCH = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> },
) => {
 const { id } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const body = await request.json()
 const parsed = updateSchema.safeParse(body)

 if (!parsed.success) {
 const issues = parsed.error.issues.map((issue) => issue.message)
 return NextResponse.json(
 {
 success: false,
 error: 'Некорректные данные',
 details: issues,
 },
 { status: 400 },
 )
 }

 const agent = await updateAgent(id, session.user.orgId, {
 name: parsed.data.name,
 status: parsed.data.status,
 model: parsed.data.model,
 instructions: parsed.data.instructions,
 temperature: parsed.data.temperature,
 maxTokens: parsed.data.maxTokens,
 responseDelaySeconds: parsed.data.responseDelaySeconds,
 settings: parsed.data.settings ?? {},
 })

 // Логируем обновление агента
 const { ActivityLogger } = await import('@/lib/services/activity-logger')
 await ActivityLogger.agentUpdated(
   session.user.orgId,
   session.user.id,
   agent.id,
   agent.name
 ).catch((error) => {
   console.error('Failed to log agent update:', error)
 })

 return NextResponse.json({
 success: true,
 data: agent,
 })
 } catch (error) {
 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось обновить агента',
 },
 { status: 500 },
 )
 }
}

export const DELETE = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> },
) => {
 const { id } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 await deleteAgent(id, session.user.orgId)

 return NextResponse.json({
 success: true,
 })
 } catch (error) {
 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось удалить агента',
 },
 { status: 500 },
 )
 }
}

