import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'
import { logger } from '@/lib/utils/logger'


// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
interface RouteParams {
 params: Promise<{ id: string; integrationId: string }>
}

// PATCH - Обновление настроек интеграции
export async function PATCH(request: NextRequest, { params }: RouteParams) {
 try {
 const resolvedParams = await params
 const { id: agentId, integrationId } = resolvedParams

 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json(
 { success: false, error: 'Не авторизовано' },
 { status: 401 }
 )
 }

 const body = await request.json()
 const { is_active } = body

 if (typeof is_active !== 'boolean') {
 return NextResponse.json(
 { success: false, error: 'Неверный формат данных' },
 { status: 400 }
 )
 }

 const supabase = getSupabaseServiceRoleClient()

 // Проверяем что интеграция существует и принадлежит пользователю
 const { data: existing, error: checkError } = await supabase
 .from('agent_integrations')
 .select('*')
 .eq('id', integrationId)
 .eq('agent_id', agentId)
 .eq('org_id', session.user.orgId)
 .single()

 if (checkError || !existing) {
 return NextResponse.json(
 { success: false, error: 'Интеграция не найдена' },
 { status: 404 }
 )
 }

 // Обновляем настройки
 const { data: updated, error: updateError } = await supabase
 .from('agent_integrations')
 .update({ is_active })
 .eq('id', integrationId)
 .select()
 .single()

 if (updateError) {
 logger.error('Error updating agent integration:', updateError, {
   endpoint: '/api/agents/[id]/integrations/[integrationId]',
   method: 'PATCH',
   agentId,
   integrationId,
 })
 return NextResponse.json(
 { success: false, error: 'Не удалось обновить настройки интеграции' },
 { status: 500 }
 )
 }

 return NextResponse.json({
 success: true,
 integration: updated,
 })
 } catch (error: unknown) {
 logger.error('Agent integration update API error:', error, {
   endpoint: '/api/agents/[id]/integrations/[integrationId]',
   method: 'PATCH',
   agentId,
   integrationId,
 })
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 }
 )
 }
}

// GET - Получение настроек интеграции
export async function GET(request: NextRequest, { params }: RouteParams) {
 try {
 const resolvedParams = await params
 const { id: agentId, integrationId } = resolvedParams

 const session = await auth()

 if (!session?.user?.orgId) {
 return NextResponse.json(
 { success: false, error: 'Не авторизовано' },
 { status: 401 }
 )
 }

 const supabase = getSupabaseServiceRoleClient()

 const { data: integration, error } = await supabase
 .from('agent_integrations')
 .select('*')
 .eq('id', integrationId)
 .eq('agent_id', agentId)
 .eq('org_id', session.user.orgId)
 .single()

 if (error || !integration) {
 return NextResponse.json(
 { success: false, error: 'Интеграция не найдена' },
 { status: 404 }
 )
 }

 return NextResponse.json({
 success: true,
 integration,
 })
 } catch (error: unknown) {
 logger.error('Agent integration get API error:', error, {
   endpoint: '/api/agents/[id]/integrations/[integrationId]',
   method: 'GET',
   agentId,
   integrationId,
 })
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 }
 )
 }
}

