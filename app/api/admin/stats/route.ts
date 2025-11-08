import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getAdminStats, checkAdminAccess } from '@/lib/admin'
import { logger } from '@/lib/utils/logger'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
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
 } catch (error: unknown) {
 logger.error('Admin stats API error:', error, {
   endpoint: '/api/admin/stats',
   method: 'GET',
 })
 return NextResponse.json(
 { error: 'Internal server error' },
 { status: 500 }
 )
 }
}
