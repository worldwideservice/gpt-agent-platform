// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getErrorMessage } from '@/lib/utils'
import { changePlanSchema } from '@/lib/validation/schemas/subscription'


/**
 * POST /api/manage/[tenantId]/subscription/change-plan
 * Смена тарифного плана пользователем
 */
export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validation = changePlanSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      )
    }

    const { newPlanId, interval } = validation.data

    // [MOCK] Логика смены плана
    // В реальном проекте здесь будет:
    // 1. Получение subscription_id из БД
    // 2. Обновление подписки через payment provider (Stripe/Lemon Squeezy)
    // 3. Обновление записи в БД

    // const supabase = createSupabaseAdminClient()
    // const { data: subscription } = await supabase
    //   .from('subscriptions')
    //   .select('stripe_subscription_id')
    //   .eq('org_id', session.user.orgId)
    //   .single()
    //
    // if (!subscription) {
    //   return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
    // }
    //
    // await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    //   items: [{ price: newPriceId }],
    // })
    //
    // await supabase
    //   .from('subscriptions')
    //   .update({ plan_id: newPlanId, interval, updated_at: new Date().toISOString() })
    //   .eq('org_id', session.user.orgId)

    // eslint-disable-next-line no-console
    console.log(
      `[MOCK] Plan changed for org ${session.user.orgId} to ${newPlanId} (${interval})`
    )

    return NextResponse.json({
      success: true,
      newPlan: newPlanId,
      interval,
      message: 'Plan successfully updated',
    })
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 })
  }
}
