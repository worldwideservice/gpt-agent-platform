import { NextResponse, type NextRequest } from 'next/server'

import { z } from 'zod'
import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'


// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
const fieldsSchema = z.object({
 dealFields: z.array(z.string()),
 contactFields: z.array(z.string()),
})

/**
 * GET /api/agents/[id]/fields - Получение выбранных полей для агента
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

 const settings = agent.settings as Record<string, unknown> | undefined
 const dealFields = (settings?.dealFields as string[]) || []
 const contactFields = (settings?.contactFields as string[]) || []

 return NextResponse.json({
 success: true,
 data: {
 dealFields,
 contactFields,
 },
 })
 } catch (error) {
 console.error('Fields API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить поля',
 },
 { status: 500 },
 )
 }
}

/**
 * POST /api/agents/[id]/fields - Сохранение выбранных полей для агента
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
 const parsed = fieldsSchema.safeParse(body)

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

 const currentSettings = (agent.settings as Record<string, unknown>) || {}

 const { error } = await supabase
 .from('agents')
 .update({
 settings: {
 ...currentSettings,
 dealFields: parsed.data.dealFields,
 contactFields: parsed.data.contactFields,
 },
 })
 .eq('id', agentId)
 .eq('org_id', session.user.orgId)

 if (error) {
 console.error('Failed to save fields', error)
 throw new Error('Не удалось сохранить поля')
 }

 return NextResponse.json({
 success: true,
 })
 } catch (error) {
 console.error('Fields save API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось сохранить поля',
 },
 { status: 500 },
 )
 }
}


