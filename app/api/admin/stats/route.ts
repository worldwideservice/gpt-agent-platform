import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { auth } from '@/auth'
import { getAdminStats, checkAdminAccess } from '@/lib/admin'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access
    const hasAdminAccess = await checkAdminAccess(session.user.id)
    if (!hasAdminAccess) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get admin statistics
    const stats = await getAdminStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Admin stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
