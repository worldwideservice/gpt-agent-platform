import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'


// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
interface RouteParams {
 params: Promise<{ id: string }>
}

// GET - Получение списка интеграций агента
export async function GET(request: NextRequest, { params }: RouteParams) {
 try {
 const resolvedParams = await params
 const { id: agentId } = resolvedParams

 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json(
 { success: false, error: 'Не авторизовано' },
 { status: 401 }
 )
 }

 const supabase = getSupabaseServiceRoleClient()

 // Получаем интеграции агента
 const { data: integrations, error } = await supabase
 .from('agent_integrations')
 .select('*')
 .eq('agent_id', agentId)
 .eq('org_id', session.user.orgId)

 if (error) {
 logger.error('Error fetching agent integrations:', error, {
   endpoint: '/api/agents/[id]/integrations',
   method: 'GET',
   agentId,
 })
 return NextResponse.json(
 { success: false, error: 'Не удалось получить список интеграций' },
 { status: 500 }
 )
 }

 return NextResponse.json({
 success: true,
 integrations: integrations || [],
 })
 } catch (error: unknown) {
 logger.error('Agent integrations API error:', error, {
   endpoint: '/api/agents/[id]/integrations',
   method: 'GET',
   agentId,
 })
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 }
 )
 }
}

