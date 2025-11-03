import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/server'

interface UpdateItem {
  id: string
  message: string
  timestamp: string
  color: 'green' | 'blue' | 'purple' | 'yellow'
}

export const GET = async () => {
  const session = await auth()

  if (!session?.user?.orgId) {
    return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseServiceRoleClient()

    // Получаем последние события системы для организации
    // Пока используем комбинацию данных из разных источников
    const [agentsResult, conversationsResult] = await Promise.all([
      // Последние созданные агенты
      supabase
        .from('agents')
        .select('id, name, created_at')
        .eq('org_id', session.user.orgId)
        .order('created_at', { ascending: false })
        .limit(5),

      // Последние разговоры
      supabase
        .from('agent_conversations')
        .select('id, agent_id, created_at, status')
        .eq('org_id', session.user.orgId)
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    const updates: UpdateItem[] = []

    // Добавляем обновления о созданных агентах
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

    // Добавляем обновления о разговорах
    if (conversationsResult.data) {
      conversationsResult.data.forEach((conversation) => {
        const statusText =
          conversation.status === 'active' ? 'Начался новый разговор' : 'Разговор завершен'
        updates.push({
          id: `conversation-${conversation.id}`,
          message: statusText,
          timestamp: new Date(conversation.created_at).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          color: conversation.status === 'active' ? 'blue' : 'purple',
        })
      })
    }

    // Сортируем по времени (новые сначала) и берем последние 10
    const sortedUpdates = updates
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      data: sortedUpdates,
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

