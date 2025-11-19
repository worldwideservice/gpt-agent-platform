// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { deleteAgentChannel, upsertAgentChannel } from '@/lib/repositories/agent-sequences'

const updateSchema = z.object({
 isEnabled: z.boolean(),
 settings: z.record(z.string(), z.unknown()).optional(),
})

export const PATCH = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string; channel: string }> },
) => {
 const { id, channel } = await params
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

 const updated = await upsertAgentChannel(session.user.orgId, id, channel, {
 isEnabled: parsed.data.isEnabled,
 settings: parsed.data.settings ?? {},
 })

 return NextResponse.json({ success: true, data: updated })
 } catch (error) {
 console.error('Agent channel PATCH error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось обновить канал',
 },
 { status: 500 },
 )
 }
}

export const DELETE = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string; channel: string }> },
) => {
 const { id, channel } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 await deleteAgentChannel(session.user.orgId, id, channel)

 return NextResponse.json({ success: true })
 } catch (error) {
 console.error('Agent channel DELETE error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось удалить канал',
 },
 { status: 500 },
 )
 }
}



