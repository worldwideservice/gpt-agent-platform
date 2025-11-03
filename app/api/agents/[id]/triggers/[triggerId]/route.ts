import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import {
 getTriggerById,
 updateTrigger,
 deleteTrigger,
 updateTriggerStatus,
} from '@/lib/repositories/triggers'

export const GET = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string; triggerId: string }> },
) => {
 const { id, triggerId } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const agent = await getAgentById(id, session.user.orgId)

 if (!agent) {
 return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
 }

 const trigger = await getTriggerById(triggerId, id)

 if (!trigger) {
 return NextResponse.json({ success: false, error: 'Триггер не найден' }, { status: 404 })
 }

 return NextResponse.json({
 success: true,
 data: trigger,
 })
 } catch (error) {
 console.error('Trigger API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить триггер',
 },
 { status: 500 },
 )
 }
}

const updateTriggerSchema = z.object({
 name: z.string().min(1).optional(),
 description: z.string().nullable().optional(),
 isActive: z.boolean().optional(),
 conditions: z
 .array(
 z.object({
 id: z.string().uuid().optional(),
 conditionType: z.string().min(1),
 payload: z.record(z.string(), z.unknown()),
 ordering: z.number().int().min(0),
 }),
 )
 .optional(),
 actions: z
 .array(
 z.object({
 id: z.string().uuid().optional(),
 actionType: z.string().min(1),
 payload: z.record(z.string(), z.unknown()),
 ordering: z.number().int().min(0),
 }),
 )
 .optional(),
})

export const PATCH = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string; triggerId: string }> },
) => {
 const { id, triggerId } = await params
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

 if (body.isActive !== undefined && Object.keys(body).length === 1) {
 const trigger = await updateTriggerStatus(triggerId, id, body.isActive)

 return NextResponse.json({
 success: true,
 data: trigger,
 })
 }

 const parsed = updateTriggerSchema.safeParse(body)

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

 const trigger = await updateTrigger(triggerId, id, {
 ...parsed.data,
 description: parsed.data.description ?? undefined,
 })

 return NextResponse.json({
 success: true,
 data: trigger,
 })
 } catch (error) {
 console.error('Trigger update API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось обновить триггер',
 },
 { status: 500 },
 )
 }
}

export const DELETE = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string; triggerId: string }> },
) => {
 const { id, triggerId } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const agent = await getAgentById(id, session.user.orgId)

 if (!agent) {
 return NextResponse.json({ success: false, error: 'Агент не найден' }, { status: 404 })
 }

 await deleteTrigger(triggerId, id)

 return NextResponse.json({
 success: true,
 })
 } catch (error) {
 console.error('Trigger delete API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось удалить триггер',
 },
 { status: 500 },
 )
 }
}



