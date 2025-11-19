// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'
import { getNotificationsSchema } from '@/lib/validation/schemas/notification'

/**
 * GET /api/manage/[tenantId]/notifications
 *
 * Возвращает список уведомлений для текущего пользователя
 * с фильтрацией и пагинацией.
 *
 * Query Parameters:
 * - isRead: boolean (фильтр по статусу прочтения)
 * - type: string (фильтр по типу уведомления)
 * - limit: number (количество записей, по умолчанию 20, максимум 100)
 * - offset: number (смещение для пагинации, по умолчанию 0)
 *
 * Security:
 * - Защищено middleware (tenant access control + rate limiting)
 * - RLS policies в БД ограничивают доступ к уведомлениям пользователя
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  const { tenantId } = await params

  try {
    // 1. Проверка аутентификации
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { tenantId } = params

    // 2. Валидация query параметров
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const validationResult = getNotificationsSchema.safeParse(searchParams)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          issues: validationResult.error.issues.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    const { isRead, type, limit, offset } = validationResult.data

    // 3. Получаем organization ID из slug
    const supabase = getSupabaseServiceRoleClient()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', tenantId)
      .single()

    if (orgError || !org) {
      logger.error('Notifications GET: Organization not found', orgError, {
        endpoint: `/api/manage/${tenantId}/notifications`,
        tenantId,
        userId,
      })
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const orgId = org.id

    // 4. Строим query для получения уведомлений
    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })

    // Применяем фильтры
    if (isRead !== undefined) {
      query = query.eq('is_read', isRead)
    }

    if (type) {
      query = query.eq('type', type)
    }

    // Пагинация
    query = query.range(offset, offset + limit - 1)

    // 5. Выполняем запрос
    const { data: notifications, error: notificationsError, count } = await query

    if (notificationsError) {
      logger.error(
        'Notifications GET: Failed to fetch notifications',
        notificationsError,
        {
          endpoint: `/api/manage/${tenantId}/notifications`,
          tenantId,
          userId,
        }
      )
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      )
    }

    // 6. Получаем количество непрочитанных уведомлений
    const { count: unreadCount, error: unreadError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('org_id', orgId)
      .eq('is_read', false)

    if (unreadError) {
      logger.error(
        'Notifications GET: Failed to fetch unread count',
        unreadError,
        {
          endpoint: `/api/manage/${tenantId}/notifications`,
          tenantId,
          userId,
        }
      )
    }

    // 7. Возвращаем результат
    return NextResponse.json({
      notifications: notifications || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
      unreadCount: unreadCount || 0,
    })
  } catch (error: unknown) {
    logger.error('Notifications GET: Unexpected error', error, {
      endpoint: `/api/manage/${params.tenantId}/notifications`,
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
