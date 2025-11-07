import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { getNotifications, getUnreadCount } from '@/lib/repositories/notifications'

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




































