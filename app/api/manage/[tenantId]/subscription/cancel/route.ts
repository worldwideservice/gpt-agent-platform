// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getErrorMessage } from '@/lib/utils'
import { cancelSubscriptionSchema } from '@/lib/validation/schemas/subscription'


/**
 * POST /api/manage/[tenantId]/subscription/cancel
 * Отмена подписки (требует подтверждения confirm: true)
 */
export async function POST(req: Request) {
  const { tenantId } = await params

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validation = cancelSubscriptionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      )
    }

    // [MOCK] Логика отмены подписки
    // В реальном проекте здесь будет:
    // 1. Получение subscription_id из БД
    // 2. Отмена подписки через payment provider
    // 3. Обновление статуса в БД на 'cancelled'

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
    // await stripe.subscriptions.cancel(subscription.stripe_subscription_id)
    //
    // await supabase
    //   .from('subscriptions')
    //   .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    //   .eq('org_id', session.user.orgId)

    // eslint-disable-next-line no-console
    console.log(`[MOCK] Subscription cancelled for org ${session.user.orgId}`)

    return NextResponse.json({
      success: true,
      status: 'cancelled',
      message: 'Subscription successfully cancelled',
    })
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 })
  }
}
