/**
 * GET /api/manage/[tenantId]/subscription/status
 * Проверка статуса лицензии для организации
 * Используется в Header для отображения уведомлений об истечении подписки
 */

// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { checkLicense, getOrganizationSubscription } from '@/lib/services/billing'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { getErrorMessage } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tenantId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tenantId } = await params

    // Проверяем, что пользователь имеет доступ к этой организации
    if (session.user.orgId !== tenantId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Получаем полную информацию о подписке
    const subscription = await getOrganizationSubscription(tenantId)

    // Проверяем статус лицензии
    const license = await checkLicense(tenantId)

    // Вычисляем дату истечения для UI
    const expiryDate = subscription?.nextBillDate || null

    // Определяем название плана
    const planName = subscription?.planName || 'Free'

    // Получаем полную информацию о подписке из БД для деталей
    const supabase = getSupabaseServiceRoleClient()
    const { data: subDetails } = await supabase
      .from('subscriptions')
      .select('id, paddle_subscription_id, current_period_start, current_period_end, cancel_at_period_end, plan_id')
      .eq('org_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    return NextResponse.json({
      isValid: license.isValid,
      status: license.status,
      daysLeft: license.daysLeft || 0,
      expiryDate: expiryDate,
      planName: planName,
      subscription: subDetails
        ? {
            id: subDetails.id,
            paddle_subscription_id: subDetails.paddle_subscription_id || null,
            current_period_start: subDetails.current_period_start || null,
            current_period_end: subDetails.current_period_end || null,
            cancel_at_period_end: subDetails.cancel_at_period_end || false,
          }
        : null,
    })
  } catch (error) {
    console.error('Error checking subscription status:', error)
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    )
  }
}
