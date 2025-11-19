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
    const expiryDate = subscription?.current_period_end || null

    // Определяем название плана
    let planName = 'Free'
    if (subscription) {
      // Можно брать из таблицы billing_plans по plan_id
      planName = subscription.plan_id || 'Pro Plan'
    }

    return NextResponse.json({
      isValid: license.isValid,
      status: license.status,
      daysLeft: license.daysLeft || 0,
      expiryDate: expiryDate,
      planName: planName,
      subscription: subscription
        ? {
            id: subscription.id,
            paddle_subscription_id: subscription.paddle_subscription_id,
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            cancel_at_period_end: subscription.cancel_at_period_end,
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
