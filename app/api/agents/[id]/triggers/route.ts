import { NextResponse, type NextRequest } from 'next/server'

import { z } from 'zod'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { getTriggers, createTrigger } from '@/lib/repositories/triggers'
import { logger } from '@/lib/utils/logger'


// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
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

 const triggers = await getTriggers(id)

 return NextResponse.json({
 success: true,
 data: triggers,
 })
 } catch (error: unknown) {
 logger.error('Triggers API error', error, {
   endpoint: '/api/agents/[id]/triggers',
   method: 'GET',
   agentId: id,
 })

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить триггеры',
 },
 { status: 500 },
 )
 }
}

const createTriggerSchema = z.object({
 name: z.string().min(1, 'Название обязательно'),
 description: z.string().optional(),
 isActive: z.boolean().optional().default(true),
 conditions: z.array(
 z.object({
 conditionType: z.string().min(1),
 payload: z.record(z.string(), z.unknown()),
 ordering: z.number().int().min(0),
 }),
 ),
 actions: z.array(
 z.object({
 actionType: z.string().min(1),
 payload: z.record(z.string(), z.unknown()),
 ordering: z.number().int().min(0),
 }),
 ),
})

export const POST = async (
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

 const body = await request.json()
 const parsed = createTriggerSchema.safeParse(body)

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

 const trigger = await createTrigger(id, parsed.data)

 return NextResponse.json({
 success: true,
 data: trigger,
 })
 } catch (error: unknown) {
 logger.error('Trigger create API error', error, {
   endpoint: '/api/agents/[id]/triggers',
   method: 'POST',
   agentId: id,
 })

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось создать триггер',
 },
 { status: 500 },
 )
 }
}



