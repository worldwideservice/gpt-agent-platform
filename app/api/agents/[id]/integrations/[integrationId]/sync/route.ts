import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getSupabaseServiceRoleClient } from '@/lib/supabase/admin'

interface RouteParams {
 params: Promise<{ id: string; integrationId: string }>
}

// POST - Синхронизация настроек CRM
export async function POST(request: NextRequest, { params }: RouteParams) {
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

 // Получаем интеграцию
 const { data: integration, error: integrationError } = await supabase
 .from('agent_integrations')
 .select('*')
 .eq('id', integrationId)
 .eq('agent_id', agentId)
 .eq('org_id', session.user.orgId)
 .single()

 if (integrationError || !integration) {
 return NextResponse.json(
 { success: false, error: 'Интеграция не найдена' },
 { status: 404 }
 )
 }

 // Проверяем что это Kommo интеграция
 if (integration.integration_type !== 'kommo') {
 return NextResponse.json(
 { success: false, error: 'Синхронизация доступна только для Kommo' },
 { status: 400 }
 )
 }

 // Получаем CRM подключение для организации
 const { data: crmConnection, error: crmError } = await supabase
 .from('crm_connections')
 .select('*')
 .eq('org_id', session.user.orgId)
 .eq('provider', 'kommo')
 .single()

 if (crmError || !crmConnection) {
 return NextResponse.json(
 {
 success: false,
 error: 'CRM подключение не найдено. Сначала подключите Kommo.',
 },
 { status: 404 }
 )
 }

 // TODO: Вызвать реальную синхронизацию через API
 // Пока просто обновляем timestamp
 const { error: updateError } = await supabase
 .from('agent_integrations')
 .update({
 settings: {
 ...((integration.settings as Record<string, unknown>) || {}),
 last_synced_at: new Date().toISOString(),
 },
 })
 .eq('id', integrationId)

 if (updateError) {
 console.error('Error updating sync timestamp:', updateError)
 return NextResponse.json(
 { success: false, error: 'Не удалось обновить метаданные синхронизации' },
 { status: 500 }
 )
 }

 // TODO: Запустить фоновую задачу синхронизации:
 // - Синхронизация воронок (pipelines)
 // - Синхронизация полей (lead_fields, contact_fields)
 // - Синхронизация каналов (channels)

 return NextResponse.json({
 success: true,
 message: 'Синхронизация запущена',
 })
 } catch (error) {
 console.error('Agent integration sync API error:', error)
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 }
 )
 }
}

