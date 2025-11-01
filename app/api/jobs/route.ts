import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { checkTierRateLimit } from '@/lib/rate-limit'
import { addJobToQueue } from '@/lib/queue'

// API routes should always be dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, payload } = body

    if (!type || !payload) {
      return NextResponse.json(
        { error: 'Missing type or payload' },
        { status: 400 }
      )
    }

    // Rate limiting based on job type
    const rateLimitResult = await checkTierRateLimit(
      request,
      'api',
      session.user.id,
      session.user.orgId
    )

    if (rateLimitResult) {
      return rateLimitResult
    }

    // Add job to queue
    const job = await addJobToQueue(type, {
      ...payload,
      userId: session.user.id,
      organizationId: session.user.orgId || session.user.id,
    })

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Job added to queue successfully',
    })
  } catch (error) {
    console.error('Jobs API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
