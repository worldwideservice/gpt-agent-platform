import { NextResponse, type NextRequest } from 'next/server'

import { z } from 'zod'

import { auth } from '@/auth'
import { markAllNotificationsAsRead, deleteAllNotifications } from '@/lib/repositories/notifications'
import { logger } from '@/lib/utils/logger'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
const actionSchema = z.object({
  action: z.enum(['mark_all_read', 'delete_all']),
})

export const POST = async (request: NextRequest) => {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const body = await request.json()
 const parsed = actionSchema.safeParse(body)

 if (!parsed.success) {
 return NextResponse.json(
 {
 success: false,
 error: 'Некорректные данные',
 },
 { status: 400 },
 )
 }

 if (parsed.data.action === 'mark_all_read') {
 await markAllNotificationsAsRead(session.user.orgId, session.user.id)
 } else if (parsed.data.action === 'delete_all') {
 await deleteAllNotifications(session.user.orgId, session.user.id)
 }

 return NextResponse.json({
 success: true,
 })
 } catch (error: unknown) {
 logger.error('Notifications action API error', error, {
   endpoint: '/api/notifications/actions',
   method: 'POST',
 })

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось выполнить действие',
 },
 { status: 500 },
 )
 }
}





































