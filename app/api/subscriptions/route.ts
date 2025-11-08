import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSubscription } from '@/lib/repositories/subscriptions'
import { logger } from '@/lib/utils/logger'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const GET = async () => {

 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const subscription = await getSubscription(session.user.orgId)

 return NextResponse.json({
 success: true,
 data: subscription,
 })
 } catch (error: unknown) {
 logger.error('Subscription API error', error, {
   endpoint: '/api/subscriptions',
   method: 'GET',
 })

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось загрузить данные подписки',
 },
 { status: 500 },
 )
 }
}





































