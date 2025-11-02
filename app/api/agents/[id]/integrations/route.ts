import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Получение списка интеграций агента
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const { id: agentId } = resolvedParams

    const session = await auth()

    if (!session?.user?.orgId) {
      return NextResponse.json(
        { success: false, error: 'Не авторизовано' },
        { status: 401 }
      )
    }

    const supabase = getSupabaseServiceRoleClient()

    // Получаем интеграции агента
    const { data: integrations, error } = await supabase
      .from('agent_integrations')
      .select('*')
      .eq('agent_id', agentId)
      .eq('org_id', session.user.orgId)

    if (error) {
      console.error('Error fetching agent integrations:', error)
      return NextResponse.json(
        { success: false, error: 'Не удалось получить список интеграций' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      integrations: integrations || [],
    })
  } catch (error) {
    console.error('Agent integrations API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

