import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

/**
 * GET /api/manage/[tenantId]/test-chat/agents
 *
 * Возвращает список AI агентов для выбора в тестовом чате
 *
 * Security:
 * - Защищено middleware (tenant access control + rate limiting)
 * - Возвращает только активных агентов организации пользователя
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    // 1. Проверка аутентификации
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tenantId } = params

    // 2. Получаем organization ID из slug
    const supabase = getSupabaseServiceRoleClient()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', tenantId)
      .single()

    if (orgError || !org) {
      logger.error('Test Chat GET agents: Organization not found', orgError, {
        endpoint: `/api/manage/${tenantId}/test-chat/agents`,
        tenantId,
        userId: session.user.id,
      })
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const orgId = org.id

    // 3. Получаем список активных агентов организации
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('id, name, model, instructions')
      .eq('org_id', orgId)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (agentsError) {
      logger.error('Test Chat GET agents: Failed to fetch agents', agentsError, {
        endpoint: `/api/manage/${tenantId}/test-chat/agents`,
        tenantId,
        orgId,
      })
      return NextResponse.json(
        { error: 'Failed to fetch agents' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      agents: agents || [],
      count: agents?.length || 0,
    })
  } catch (error: unknown) {
    logger.error('Test Chat GET agents: Unexpected error', error, {
      endpoint: `/api/manage/${params.tenantId}/test-chat/agents`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
