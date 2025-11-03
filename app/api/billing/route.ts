import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import {
 getBillingPlans,
 getOrganizationSubscription,
 createSubscriptionSession,
 cancelSubscription,
 resumeSubscription,
 getUsageStats,
} from '@/lib/services/billing'

/**
 * GET /api/billing - Получение информации о биллинге
 */
export const GET = async (request: NextRequest) => {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const { searchParams } = new URL(request.url)
 const action = searchParams.get('action')

 switch (action) {
 case 'plans':
 const plans = await getBillingPlans()
 return NextResponse.json({ success: true, data: plans })

 case 'subscription':
 const subscription = await getOrganizationSubscription(session.user.orgId)
 return NextResponse.json({ success: true, data: subscription })

 case 'usage':
 const startDate = searchParams.get('start_date')
 const endDate = searchParams.get('end_date')

 if (!startDate || !endDate) {
 return NextResponse.json(
 { success: false, error: 'Требуются параметры start_date и end_date' },
 { status: 400 },
 )
 }

 const usage = await getUsageStats(
 session.user.orgId,
 new Date(startDate),
 new Date(endDate),
 )
 return NextResponse.json({ success: true, data: usage })

 default:
 return NextResponse.json(
 { success: false, error: 'Неизвестное действие' },
 { status: 400 },
 )
 }
 } catch (error) {
 console.error('Billing GET API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось получить данные биллинга',
 },
 { status: 500 },
 )
 }
}

/**
 * POST /api/billing - Операции с биллингом
 */
export const POST = async (request: NextRequest) => {
 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json({ success: false, error: 'Не авторизовано' }, { status: 401 })
 }

 try {
 const body = await request.json()
 const { action } = body

 switch (action) {
 case 'create_subscription_session': {
 const { plan_id, success_url, cancel_url } = body

 if (!plan_id || !success_url || !cancel_url) {
 return NextResponse.json(
 { success: false, error: 'Требуются plan_id, success_url и cancel_url' },
 { status: 400 },
 )
 }

 const sessionUrl = await createSubscriptionSession(
 session.user.orgId,
 plan_id,
 success_url,
 cancel_url,
 )

 if (!sessionUrl) {
 return NextResponse.json(
 { success: false, error: 'Не удалось создать сессию подписки' },
 { status: 500 },
 )
 }

 return NextResponse.json({
 success: true,
 data: { session_url: sessionUrl },
 })
 }

 case 'cancel_subscription': {
 const { cancel_at_period_end = true } = body

 const success = await cancelSubscription(session.user.orgId, cancel_at_period_end)

 if (!success) {
 return NextResponse.json(
 { success: false, error: 'Не удалось отменить подписку' },
 { status: 500 },
 )
 }

 return NextResponse.json({
 success: true,
 data: { canceled: true, cancel_at_period_end },
 })
 }

 case 'resume_subscription': {
 const success = await resumeSubscription(session.user.orgId)

 if (!success) {
 return NextResponse.json(
 { success: false, error: 'Не удалось возобновить подписку' },
 { status: 500 },
 )
 }

 return NextResponse.json({
 success: true,
 data: { resumed: true },
 })
 }

 default:
 return NextResponse.json(
 { success: false, error: 'Неизвестное действие' },
 { status: 400 },
 )
 }
 } catch (error) {
 console.error('Billing POST API error', error)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось выполнить операцию биллинга',
 },
 { status: 500 },
 )
 }
}


