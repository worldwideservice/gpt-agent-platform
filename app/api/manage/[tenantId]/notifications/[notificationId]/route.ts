// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'

/**
 * PUT /api/manage/[tenantId]/notifications/[notificationId]
 *
 * Помечает конкретное уведомление как прочитанное.
 *
 * Security:
 * - Защищено middleware (tenant access control + rate limiting)
 * - RLS policies в БД ограничивают доступ к уведомлениям пользователя
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantId: string; notificationId: string } }
) {
  const { tenantId } = await params

  try {
    // 1. Проверка аутентификации
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { tenantId, notificationId } = params

    // 2. Валидация UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(notificationId)) {
      return NextResponse.json(
        { error: 'Invalid notification ID format' },
        { status: 400 }
      )
    }

    // 3. Получаем organization ID из slug
    const supabase = getSupabaseServiceRoleClient()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', tenantId)
      .single()

    if (orgError || !org) {
      logger.error('Notification PUT: Organization not found', orgError, {
        endpoint: `/api/manage/${tenantId}/notifications/${notificationId}`,
        tenantId,
        userId,
      })
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const orgId = org.id

    // 4. Проверяем существование уведомления и доступ к нему
    const { data: existingNotification, error: fetchError } = await supabase
      .from('notifications')
      .select('id, is_read')
      .eq('id', notificationId)
      .eq('user_id', userId)
      .eq('org_id', orgId)
      .maybeSingle()

    if (fetchError) {
      logger.error('Notification PUT: Failed to fetch notification', fetchError, {
        endpoint: `/api/manage/${tenantId}/notifications/${notificationId}`,
        tenantId,
        userId,
        notificationId,
      })
      return NextResponse.json(
        { error: 'Failed to fetch notification' },
        { status: 500 }
      )
    }

    if (!existingNotification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    // 5. Если уже прочитано, возвращаем успех без обновления
    if (existingNotification.is_read) {
      return NextResponse.json({
        success: true,
        message: 'Notification already marked as read',
        notification: existingNotification,
      })
    }

    // 6. Помечаем уведомление как прочитанное
    const { data: updatedNotification, error: updateError } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .eq('org_id', orgId)
      .select()
      .single()

    if (updateError) {
      logger.error(
        'Notification PUT: Failed to update notification',
        updateError,
        {
          endpoint: `/api/manage/${tenantId}/notifications/${notificationId}`,
          tenantId,
          userId,
          notificationId,
        }
      )
      return NextResponse.json(
        { error: 'Failed to mark notification as read' },
        { status: 500 }
      )
    }

    // 7. Возвращаем результат
    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
      notification: updatedNotification,
    })
  } catch (error: unknown) {
    logger.error('Notification PUT: Unexpected error', error, {
      endpoint: `/api/manage/${params.tenantId}/notifications/${params.notificationId}`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/manage/[tenantId]/notifications/[notificationId]
 *
 * Удаляет конкретное уведомление.
 *
 * Security:
 * - Защищено middleware (tenant access control + rate limiting)
 * - RLS policies в БД ограничивают доступ к уведомлениям пользователя
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string; notificationId: string } }
) {
  try {
    // 1. Проверка аутентификации
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { tenantId, notificationId } = params

    // 2. Валидация UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(notificationId)) {
      return NextResponse.json(
        { error: 'Invalid notification ID format' },
        { status: 400 }
      )
    }

    // 3. Получаем organization ID из slug
    const supabase = getSupabaseServiceRoleClient()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', tenantId)
      .single()

    if (orgError || !org) {
      logger.error('Notification DELETE: Organization not found', orgError, {
        endpoint: `/api/manage/${tenantId}/notifications/${notificationId}`,
        tenantId,
        userId,
      })
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const orgId = org.id

    // 4. Удаляем уведомление
    const { error: deleteError } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId)
      .eq('org_id', orgId)

    if (deleteError) {
      logger.error(
        'Notification DELETE: Failed to delete notification',
        deleteError,
        {
          endpoint: `/api/manage/${tenantId}/notifications/${notificationId}`,
          tenantId,
          userId,
          notificationId,
        }
      )
      return NextResponse.json(
        { error: 'Failed to delete notification' },
        { status: 500 }
      )
    }

    // 5. Возвращаем результат
    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully',
    })
  } catch (error: unknown) {
    logger.error('Notification DELETE: Unexpected error', error, {
      endpoint: `/api/manage/${params.tenantId}/notifications/${params.notificationId}`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
