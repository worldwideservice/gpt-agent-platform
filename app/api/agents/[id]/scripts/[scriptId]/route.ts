import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

/**
 * DELETE /api/agents/[id]/scripts/[scriptId] - Удаление скрипта продаж
 */
export const DELETE = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string; scriptId: string }> },
) => {
 const { id: agentId, scriptId } = await params
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

 // Проверяем что скрипт принадлежит организации
 const { data: script, error: fetchError } = await supabase
 .from('sales_scripts')
 .select('org_id')
 .eq('id', scriptId)
 .eq('org_id', session.user.orgId)
 .single()

 if (fetchError || !script) {
 return NextResponse.json({ success: false, error: 'Скрипт не найден' }, { status: 404 })
 }

 // Удаляем скрипт
 const { error } = await supabase.from('sales_scripts').delete().eq('id', scriptId).eq('org_id', session.user.orgId)

 if (error) {
 console.error('Failed to delete script', error)
 throw new Error('Не удалось удалить скрипт')
 }

 return NextResponse.json({
 success: true,
 })
 } catch (error) {
 console.error('Script delete API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось удалить скрипт',
 },
 { status: 500 },
 )
 }
}

