import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

/**
 * PUT /api/manage/[tenantId]/notifications/read-all
 *
 * Помечает все уведомления текущего пользователя как прочитанные.
 *
 * Security:
 * - Защищено middleware (tenant access control + rate limiting)
 * - RLS policies в БД ограничивают доступ к уведомлениям пользователя
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    // 1. Проверка аутентификации
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { tenantId } = params

    // 2. Получаем organization ID из slug
    const supabase = getSupabaseServiceRoleClient()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', tenantId)
      .single()

    if (orgError || !org) {
      logger.error('Notifications read-all: Organization not found', orgError, {
        endpoint: `/api/manage/${tenantId}/notifications/read-all`,
        tenantId,
        userId,
      })
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const orgId = org.id

    // 3. Помечаем все непрочитанные уведомления как прочитанные
    const { data, error: updateError } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('org_id', orgId)
      .eq('is_read', false)
      .select()

    if (updateError) {
      logger.error(
        'Notifications read-all: Failed to update notifications',
        updateError,
        {
          endpoint: `/api/manage/${tenantId}/notifications/read-all`,
          tenantId,
          userId,
        }
      )
      return NextResponse.json(
        { error: 'Failed to mark notifications as read' },
        { status: 500 }
      )
    }

    // 4. Возвращаем результат
    return NextResponse.json({
      success: true,
      updatedCount: data?.length || 0,
      message: `${data?.length || 0} notifications marked as read`,
    })
  } catch (error: unknown) {
    logger.error('Notifications read-all: Unexpected error', error, {
      endpoint: `/api/manage/${params.tenantId}/notifications/read-all`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
