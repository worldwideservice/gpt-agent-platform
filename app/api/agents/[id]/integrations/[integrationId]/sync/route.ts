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

 // Запускаем синхронизацию через Job Queue (Worker обрабатывает job 'crm:sync-pipelines')
 try {
 const { addJobToQueue } = await import('@/lib/queue')
 
 // Добавляем job в очередь для обработки Worker
 const job = await addJobToQueue('crm:sync-pipelines', {
 provider: 'kommo',
 orgId: session.user.orgId,
 connectionId: crmConnection.id,
 baseDomain: crmConnection.base_domain,
 })

 // Обновляем timestamp синхронизации в интеграции
 const { error: updateError } = await supabase
 .from('agent_integrations')
 .update({
 settings: {
 ...((integration.settings as Record<string, unknown>) || {}),
 last_synced_at: new Date().toISOString(),
 sync_status: 'queued',
 sync_job_id: job.id, // Сохраняем ID job для отслеживания
 },
 })
 .eq('id', integrationId)

 if (updateError) {
 console.error('Error updating sync timestamp:', updateError)
 // Не прерываем выполнение, т.к. синхронизация уже запущена
 }

 return NextResponse.json({
 success: true,
 message: 'Синхронизация запущена',
 details: {
 jobId: job.id,
 pipelines: 'Синхронизация воронок поставлена в очередь',
 fields: 'Синхронизация полей будет выполнена автоматически',
 channels: 'Синхронизация каналов будет выполнена автоматически',
 },
 })
 } catch (syncError) {
 console.error('Failed to trigger CRM sync:', syncError)
 
 // Обновляем статус ошибки
 await supabase
 .from('agent_integrations')
 .update({
 settings: {
 ...((integration.settings as Record<string, unknown>) || {}),
 sync_status: 'failed',
 sync_error: syncError instanceof Error ? syncError.message : 'Unknown error',
 },
 })
 .eq('id', integrationId)

 return NextResponse.json(
 {
 success: false,
 error: 'Не удалось запустить синхронизацию',
 details: syncError instanceof Error ? syncError.message : 'Unknown error',
 },
 { status: 500 }
 )
 }
 } catch (error) {
 console.error('Agent integration sync API error:', error)
 return NextResponse.json(
 { success: false, error: 'Внутренняя ошибка сервера' },
 { status: 500 }
 )
 }
}

