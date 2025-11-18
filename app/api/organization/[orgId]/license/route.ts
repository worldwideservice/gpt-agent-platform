import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { authOptions } from '@/lib/providers/auth-provider'
import { getSubscription } from '@/lib/repositories/subscriptions'
import { logger } from '@/lib/utils/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await getSubscription(params.orgId)

    if (!subscription) {
      return NextResponse.json({
        success: true,
        license: {
          plan: 'free',
          status: 'active',
          expiresAt: null,
          tokenQuota: 10000,
          tokenUsed: 0,
          isExpired: false,
        },
      })
    }

    // Calculate if license is expired
    const expiresAt = subscription.renewsAt ? new Date(subscription.renewsAt) : null
    const isExpired = expiresAt ? expiresAt < new Date() : false

    // Calculate days until expiry
    let daysUntilExpiry: number | null = null
    if (expiresAt && !isExpired) {
      const diffTime = expiresAt.getTime() - new Date().getTime()
      daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    return NextResponse.json({
      success: true,
      license: {
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.renewsAt,
        tokenQuota: subscription.tokenQuota,
        tokenUsed: subscription.tokenUsed,
        tokenRemaining: subscription.tokenQuota - subscription.tokenUsed,
        isExpired,
        daysUntilExpiry,
      },
    })
  } catch (error) {
    logger.error('Failed to fetch license info', error as Error)
    return NextResponse.json(
      { error: 'Failed to fetch license information' },
      { status: 500 }
    )
  }
}
