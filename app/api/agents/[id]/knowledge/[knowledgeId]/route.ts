import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { getAgentById } from '@/lib/repositories/agents'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

/**
 * DELETE /api/agents/[id]/knowledge/[knowledgeId] - Удаление знания для агента
 */
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; knowledgeId: string }> },
) => {
  const { id: agentId, knowledgeId } = await params
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

    // Проверяем что знание принадлежит организации
    const { data: knowledge, error: fetchError } = await supabase
      .from('company_knowledge')
      .select('org_id')
      .eq('id', knowledgeId)
      .eq('org_id', session.user.orgId)
      .single()

    if (fetchError || !knowledge) {
      return NextResponse.json({ success: false, error: 'Знание не найдено' }, { status: 404 })
    }

    // Удаляем знание
    const { error } = await supabase.from('company_knowledge').delete().eq('id', knowledgeId).eq('org_id', session.user.orgId)

    if (error) {
      console.error('Failed to delete knowledge', error)
      throw new Error('Не удалось удалить знание')
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Knowledge delete API error', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось удалить знание',
      },
      { status: 500 },
    )
  }
}


