import { NextRequest, NextResponse } from 'next/server'


import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
interface UpdateItem {
  id: string
  message: string
  timestamp: string
  color: 'green' | 'blue' | 'purple' | 'yellow'
}

/**
 * Определяет цвет для типа активности
 */
function getActivityColor(activityType: string): 'green' | 'blue' | 'purple' | 'yellow' {
  switch (activityType) {
    case 'agent_created':
    case 'agent_updated':
    case 'integration_connected':
      return 'green'
    case 'agent_response':
    case 'conversation_started':
      return 'blue'
    case 'action_executed':
    case 'rule_executed':
    case 'sequence_executed':
      return 'purple'
    case 'error_occurred':
      return 'yellow'
    default:
      return 'blue'
  }
}

export const GET = async (request: NextRequest) => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseServiceRoleClient()
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get('limit') || '20', 10)

    // Пытаемся получить обновления из activity_logs
    const { data: activityLogs, error: logsError } = await supabase
      .from('activity_logs')
      .select('id, activity_type, title, description, created_at')
      .eq('org_id', session.user.orgId)
      .order('created_at', { ascending: false })
      .limit(limit)

    // Если таблица существует и есть данные - используем их
    if (activityLogs && activityLogs.length > 0) {
      const updates: UpdateItem[] = activityLogs.map((log) => ({
        id: log.id,
        message: log.title,
        timestamp: new Date(log.created_at).toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        color: getActivityColor(log.activity_type),
      }))

      return NextResponse.json({
        success: true,
        data: updates,
      })
    }

    // Fallback: если таблицы нет или она пустая, используем старый метод
    if (logsError && logsError.code === '42P01') {
      // Таблица не существует - используем старый метод
    const [agentsResult, conversationsResult] = await Promise.all([
      supabase
        .from('agents')
        .select('id, name, created_at')
        .eq('org_id', session.user.orgId)
        .order('created_at', { ascending: false })
        .limit(5),

      supabase
          .from('conversations')
          .select('id, agent_id, created_at')
        .eq('org_id', session.user.orgId)
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    const updates: UpdateItem[] = []

    if (agentsResult.data) {
      agentsResult.data.forEach((agent) => {
        updates.push({
          id: `agent-${agent.id}`,
          message: `Создан новый агент: ${agent.name}`,
          timestamp: new Date(agent.created_at).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          color: 'green',
        })
      })
    }

    if (conversationsResult.data) {
      conversationsResult.data.forEach((conversation) => {
        updates.push({
          id: `conversation-${conversation.id}`,
            message: 'Начался новый разговор',
          timestamp: new Date(conversation.created_at).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
            color: 'blue',
        })
      })
    }

    const sortedUpdates = updates
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)

      return NextResponse.json({
        success: true,
        data: sortedUpdates,
      })
    }

    // Если ошибка другая - возвращаем пустой массив
    return NextResponse.json({
      success: true,
      data: [],
    })
  } catch (error) {
    console.error('Failed to fetch dashboard updates:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Не удалось загрузить обновления',
      },
      { status: 500 },
    )
  }
}


