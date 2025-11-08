import { NextResponse, type NextRequest } from 'next/server'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { auth } from '@/auth'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { getNotifications, getUnreadCount } from '@/lib/repositories/notifications'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const GET = async (request: NextRequest) => {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 const { searchParams } = new URL(request.url)
 const unreadOnly = searchParams.get('unreadOnly') === 'true'
 const limit = searchParams.get('limit') ? Number.parseInt(searchParams.get('limit')!, 10) : undefined

 try {
 const [notifications, unreadCount] = await Promise.all([
 getNotifications(session.user.orgId, session.user.id, {
 unreadOnly,
 limit,
 }),
 getUnreadCount(session.user.orgId, session.user.id),
 ])

 return NextResponse.json({
 success: true,
 data: notifications,
 unreadCount,
 })
 } catch (error) {
 console.error('Notifications API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить уведомления',
 },
 { status: 500 },
 )
 }
}





































