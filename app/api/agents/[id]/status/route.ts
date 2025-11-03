import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { updateAgentStatus } from '@/lib/repositories/agents'

const statusSchema = z.object({
 status: z.enum(['active', 'inactive', 'draft']),
})

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
 const parsed = statusSchema.safeParse(body)

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

 const agent = await updateAgentStatus(id, session.user.orgId, parsed.data.status)

 return NextResponse.json({
 success: true,
 data: agent,
 })
 } catch (error) {
 console.error('Agent status update API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось обновить статус агента',
 },
 { status: 500 },
 )
 }
}
















