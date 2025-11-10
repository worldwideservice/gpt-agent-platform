import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

/**
 * DELETE /api/agents/[id]/objections/[objectionId] - Удаление ответа на возражение
 */
export const DELETE = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string; objectionId: string }> },
) => {
 const { id: agentId, objectionId } = await params
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

 const supabase = getSupabaseServiceRoleClient()

 // Проверяем что ответ на возражение принадлежит организации
 const { data: objection, error: fetchError } = await supabase
 .from('objection_responses')
 .select('org_id')
 .eq('id', objectionId)
 .eq('org_id', session.user.orgId)
 .single()

 if (fetchError || !objection) {
 return NextResponse.json({ success: false, error: 'Ответ на возражение не найден' }, { status: 404 })
 }

 // Удаляем ответ на возражение
 const { error } = await supabase
 .from('objection_responses')
 .delete()
 .eq('id', objectionId)
 .eq('org_id', session.user.orgId)

 if (error) {
 console.error('Failed to delete objection response', error)
 throw new Error('Не удалось удалить ответ на возражение')
 }

 return NextResponse.json({
 success: true,
 })
 } catch (error) {
 console.error('Objection delete API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось удалить ответ на возражение',
 },
 { status: 500 },
 )
 }
}

