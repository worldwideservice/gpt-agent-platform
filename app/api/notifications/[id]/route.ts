import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { markNotificationAsRead, deleteNotification } from '@/lib/repositories/notifications'

// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
 const { id } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const body = await request.json()

 if (body.isRead === true) {
 await markNotificationAsRead(id, session.user.orgId)

 return NextResponse.json({
 success: true,
 })
 }

 return NextResponse.json(
 {
 success: false,
 error: 'Некорректные данные',
 },
 { status: 400 },
 )
 } catch (error) {
 console.error('Notification update API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось обновить уведомление',
 },
 { status: 500 },
 )
 }
}

export const DELETE = async (
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> },
) => {
 const { id } = await params
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 await deleteNotification(id, session.user.orgId)

 return NextResponse.json({
 success: true,
 })
 } catch (error) {
 console.error('Notification delete API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось удалить уведомление',
 },
 { status: 500 },
 )
 }
}





































