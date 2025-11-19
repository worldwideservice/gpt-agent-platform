// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { authOptions } from '@/lib/providers/auth-provider'
import { getSubscription } from '@/lib/repositories/subscriptions'
import { logger } from '@/lib/utils/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId: tenantId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // tenantId is now just the slug
    const slug = tenantId

    // Find organization by slug
    const { getSupabaseServiceRoleClient } = await import('@/lib/supabase/admin')
    const supabase = getSupabaseServiceRoleClient()
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (orgError || !org) {
      logger.warn('[license] Organization not found', { slug, error: orgError })
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const subscription = await getSubscription(org.id)

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
