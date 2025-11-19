// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getErrorMessage } from '@/lib/utils'
import { cancelSubscriptionSchema } from '@/lib/validation/schemas/subscription'
import { cancelSubscription } from '@/lib/services/billing'

/**
 * POST /api/manage/[tenantId]/subscription/cancel
 * Отмена подписки (требует подтверждения confirm: true)
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ tenantId: string }> }
) {
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

    // Отменяем подписку через Paddle API
    const { cancelAtPeriodEnd } = validation.data
    const success = await cancelSubscription(tenantId, cancelAtPeriodEnd)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      status: 'cancelled',
      message: 'Subscription successfully cancelled',
    })
  } catch (e) {
    return NextResponse.json({ error: getErrorMessage(e) }, { status: 500 })
  }
}
