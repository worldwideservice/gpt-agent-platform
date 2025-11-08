import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getOnboardingState } from '@/lib/onboarding/server'
import { logger } from '@/lib/utils/logger'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const GET = async () => {
 try {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 const state = await getOnboardingState(session.user.orgId)

 return NextResponse.json({ success: true, state })
 } catch (error: unknown) {
 logger.error('Onboarding status error:', error, {
   endpoint: '/api/onboarding/status',
   method: 'GET',
 })
 return NextResponse.json(
 { success: false, error: 'Не удалось получить статус онбординга' },
 { status: 500 },
 )
 }
}
