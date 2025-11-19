// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getErrorMessage } from '@/lib/utils'
import { changePlanSchema } from '@/lib/validation/schemas/subscription'
import { changeSubscriptionPlan } from '@/lib/services/billing'

/**
 * POST /api/manage/[tenantId]/subscription/change-plan
 * Смена тарифного плана пользователем
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
    const validation = changePlanSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      )
    }

    const { newPlanId } = validation.data

    // Меняем план через Paddle API
    // newPlanId здесь должен быть Paddle Price ID
    const success = await changeSubscriptionPlan(tenantId, newPlanId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to change subscription plan' },
        { status: 500 }
      )
    }

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
