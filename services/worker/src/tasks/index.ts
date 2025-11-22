import { createHmac } from 'node:crypto'

import { env } from '../lib/env.ts'
import { decryptSecret } from '../lib/crypto.ts'
import { getSupabaseClient } from '../lib/supabase.ts'
import { kommoApiRequest, refreshKommoToken } from '../providers/kommo'
import type { Database, Json } from '../lib/types.ts'
// Removed process-asset task - will be reimplemented for new architecture
import { extractKnowledgeGraph } from './extract-knowledge-graph'
import { processLargeFile, generateReport, processBulkData, fineTuneModel } from './heavy-processing'
import { KommoAPI, KOMMO_AVAILABLE_ACTIONS, type KommoCustomField, type KommoAction } from '@/lib/crm/kommo'
import { extractWebhookMetadata, processWebhookEvent, saveWebhookEvent } from '@/lib/services/webhook-processor'

const supabase = getSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const supportedCrmProviders = ['kommo'] as const

type SupportedCrmProvider = (typeof supportedCrmProviders)[number]

type CrmCredentialsRow = Database['public']['Tables']['crm_credentials']['Row']
type CrmConnectionRow = Database['public']['Tables']['crm_connections']['Row']

type CrmPipelineInsert = Database['public']['Tables']['crm_pipelines']['Insert']
type CrmPipelineStageInsert = Database['public']['Tables']['crm_pipeline_stages']['Insert']

type CrmSyncPipelinesJob = {
 provider: SupportedCrmProvider
 orgId: string
 connectionId?: string
 baseDomain?: string
}

type CrmSyncContactsJob = {
 provider: SupportedCrmProvider
 orgId: string
 connectionId?: string
 baseDomain?: string
}

type KommoPipelineStatus = {
 id: number | string
 name: string
 sort?: number
 [key: string]: unknown
}

type KommoPipeline = {
 id: number | string
 name: string
 sort?: number
 is_archive?: boolean
 [key: string]: unknown
 _embedded?: {
 statuses?: KommoPipelineStatus[]
 }
}

type PipelineInput = {
 externalId: string
 name: string
 isActive: boolean
 sortOrder: number
 metadata: Json
 stages: StageInput[]
}

type StageInput = {
 externalId: string
 name: string
 sortOrder: number
 metadata: Json
}

type KommoContact = {
 id: number | string
 name?: string
 first_name?: string
 last_name?: string
 created_at?: number
 updated_at?: number
 [key: string]: unknown
}

type CrmCredentials = Pick<CrmCredentialsRow, 'client_id' | 'redirect_uri'> & { client_secret: string }

const normalizeProvider = (provider?: string): SupportedCrmProvider => {
 const normalized = provider?.trim().toLowerCase() ?? 'kommo'

 if (!supportedCrmProviders.includes(normalized as SupportedCrmProvider)) {
 throw new Error(`Unsupported CRM provider: ${provider}`)
 }

 return normalized as SupportedCrmProvider
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
 return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const mergeSyncMetadata = (
 current: unknown,
 patch: Record<string, unknown>,
): Record<string, unknown> => {
 const metadata: Record<string, unknown> = isRecord(current) ? { ...current } : {}
 const currentSync = isRecord(metadata.sync) ? { ...(metadata.sync as Record<string, unknown>) } : {}

 return {
 ...metadata,
 sync: {
 ...currentSync,
 ...patch,
 },
 }
}

const updateSyncMetadata = async (
 connectionId: string,
 currentMetadata: unknown,
 patch: Record<string, unknown>,
): Promise<Record<string, unknown>> => {
 const metadata = mergeSyncMetadata(currentMetadata, patch)
 const { error } = await supabase.from('crm_connections').update({ metadata }).eq('id', connectionId)

 if (error) {
 throw error
 }

 return metadata
}

const fetchCrmCredentials = async (
 orgId: string,
 provider: SupportedCrmProvider,
): Promise<CrmCredentials> => {
 const { data, error } = await supabase
 .from('crm_credentials')
 .select('client_id, client_secret, redirect_uri')
 .eq('org_id', orgId)
 .eq('provider', provider)
 .maybeSingle()

 if (error) {
 throw error
 }

 if (!data) {
 throw new Error(`CRM credentials not found for provider ${provider}`)
 }

 return {
 client_id: data.client_id,
 client_secret: decryptSecret(data.client_secret, env.ENCRYPTION_KEY),
 redirect_uri: data.redirect_uri,
 }
}

const fetchCrmConnection = async (params: {
 orgId: string
 provider: SupportedCrmProvider
 connectionId?: string
 baseDomain?: string
}) => {
 if (!params.connectionId && !params.baseDomain) {
 throw new Error('Either connectionId or baseDomain must be provided for CRM sync')
 }

 let query = supabase
 .from('crm_connections')
 .select('*')
 .eq('org_id', params.orgId)
 .eq('provider', params.provider)

 if (params.connectionId) {
 query = query.eq('id', params.connectionId)
 }

 if (params.baseDomain) {
 query = query.eq('base_domain', params.baseDomain)
 }

 const { data, error } = await query.maybeSingle()

 if (error) {
 throw error
 }

 return data as CrmConnectionRow | null
}

const ensureAccessToken = async (
 connection: CrmConnectionRow,
 credentials: CrmCredentials,
): Promise<CrmConnectionRow> => {
 if (!connection.expires_at) {
 return connection
 }

 const expiresAt = new Date(connection.expires_at)
 const now = new Date()

 if (expiresAt.getTime() - now.getTime() > 60_000) {
 return connection
 }

 if (!connection.refresh_token) {
 throw new Error('CRM connection missing refresh token')
 }

 const refreshed = await refreshKommoToken({
 baseDomain: connection.base_domain,
 clientId: credentials.client_id,
 clientSecret: credentials.client_secret,
 refreshToken: connection.refresh_token,
 })

 const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString()

 const { data, error } = await supabase
 .from('crm_connections')
 .update({
 access_token: refreshed.access_token,
 refresh_token: refreshed.refresh_token,
 expires_at: newExpiresAt,
 })
 .eq('id', connection.id)
 .select('*')
 .single()

 if (error || !data) {
 throw error ?? new Error('Failed to update refreshed token')
 }

 return data as CrmConnectionRow
}

const replaceConnectionPipelines = async (
 connectionId: string,
 pipelines: PipelineInput[],
) => {
 await supabase.from('crm_pipelines').delete().eq('connection_id', connectionId)

 if (pipelines.length === 0) {
 return { pipelinesCount: 0, stagesCount: 0 }
 }

 const stagesByPipeline = new Map<string, StageInput[]>()

 const pipelineRows: CrmPipelineInsert[] = pipelines.map((pipeline) => {
 stagesByPipeline.set(pipeline.externalId, pipeline.stages)

 return {
 connection_id: connectionId,
 external_id: pipeline.externalId,
 name: pipeline.name,
 is_active: pipeline.isActive,
 sort_order: pipeline.sortOrder,
 metadata: pipeline.metadata,
 }
 })

 const { data: insertedPipelines, error: insertError } = await supabase
 .from('crm_pipelines')
 .insert(pipelineRows)
 .select('id, external_id')

 if (insertError || !insertedPipelines) {
 throw insertError ?? new Error('Failed to insert CRM pipelines')
 }

 const stageRows: CrmPipelineStageInsert[] = insertedPipelines.flatMap((pipelineRow: { id: string; external_id: string }) => {
 const stages = stagesByPipeline.get(pipelineRow.external_id) ?? []

 return stages.map((stage) => ({
 pipeline_id: pipelineRow.id,
 external_id: stage.externalId,
 name: stage.name,
 sort_order: stage.sortOrder,
 metadata: stage.metadata,
 }))
 })

 if (stageRows.length > 0) {
 const { error: stageInsertError } = await supabase.from('crm_pipeline_stages').insert(stageRows)

 if (stageInsertError) {
 throw stageInsertError
 }
 }

 return {
 pipelinesCount: pipelines.length,
 stagesCount: stageRows.length,
 }
}

const buildPipelineInputs = (pipelines: KommoPipeline[]): PipelineInput[] => {
 return pipelines.map((pipeline, pipelineIndex) => {
 const statuses = pipeline._embedded?.statuses ?? []

 return {
 externalId: String(pipeline.id),
 name: pipeline.name,
 isActive: pipeline.is_archive ? false : true,
 sortOrder: pipeline.sort ?? pipelineIndex,
 metadata: pipeline as Json,
 stages: statuses.map((status, statusIndex) => {
 return {
 externalId: String(status.id),
 name: status.name,
 sortOrder: status.sort ?? statusIndex,
 metadata: status as Json,
 }
 }),
 }
 })
}

const syncKommoCustomFields = async (
 connection: CrmConnectionRow,
 credentials: CrmCredentials,
) => {
 const ensuredConnection = await ensureAccessToken(connection, credentials)

 const kommoApi = new KommoAPI({
 domain: ensuredConnection.base_domain,
 clientId: credentials.client_id,
 clientSecret: credentials.client_secret,
 redirectUri: credentials.redirect_uri || '',
 accessToken: ensuredConnection.access_token,
 refreshToken: ensuredConnection.refresh_token,
 })

 // Получаем кастомные поля для всех типов сущностей
 const allFields = await kommoApi.getAllCustomFields()

 // Удаляем старые поля этого connection
 await supabase.from('crm_custom_fields').delete().eq('connection_id', ensuredConnection.id)

 const fieldsToInsert: Array<{
 connection_id: string
 external_id: string
 entity_type: string
 name: string
 field_type: string
 code: string | null
 is_required: boolean
 is_editable: boolean
 is_visible: boolean
 is_deletable: boolean
 is_api_only: boolean
 sort_order: number
 enums: Json | null
 settings: Json
 metadata: Json
 }> = []

 // Преобразуем поля для каждого типа сущности
 const processFields = (fields: KommoCustomField[], entityType: string) => {
 fields.forEach((field) => {
 fieldsToInsert.push({
 connection_id: ensuredConnection.id,
 external_id: String(field.id),
 entity_type: entityType.slice(0, -1), // 'leads' -> 'lead'
 name: field.name,
 field_type: field.type,
 code: field.code || null,
 is_required: field.is_required || false,
 is_editable: field.is_deletable !== false, // если deletable = false, то и editable = false
 is_visible: field.is_visible !== false,
 is_deletable: field.is_deletable !== false,
 is_api_only: field.is_api_only || false,
 sort_order: field.sort || 0,
 enums: field.enums ? (field.enums as Json) : null,
 settings: field.nested ? ({ nested: field.nested } as Json) : ({} as Json),
 metadata: field as unknown as Json,
 })
 })
 }

 processFields(allFields.leads, 'leads')
 processFields(allFields.contacts, 'contacts')
 processFields(allFields.companies, 'companies')
 processFields(allFields.customers, 'customers')

 // Вставляем новые поля
 if (fieldsToInsert.length > 0) {
 const { error: insertError } = await supabase.from('crm_custom_fields').insert(fieldsToInsert)

 if (insertError) {
 throw insertError
 }
 }

 return {
 connection: ensuredConnection,
 fieldsCount: fieldsToInsert.length,
 fieldsByEntity: {
 leads: allFields.leads.length,
 contacts: allFields.contacts.length,
 companies: allFields.companies.length,
 customers: allFields.customers.length,
 },
 }
}

const syncKommoActions = async (connection: CrmConnectionRow) => {
 // Удаляем старые действия этого connection
 await supabase.from('crm_actions').delete().eq('connection_id', connection.id)

 const actionsToInsert = KOMMO_AVAILABLE_ACTIONS.map((action) => ({
 connection_id: connection.id,
 action_code: action.code,
 action_name: action.name,
 description: action.description,
 entity_types: action.entityTypes,
 required_params: action.requiredParams as Json,
 optional_params: action.optionalParams as Json,
 is_enabled: true,
 metadata: {} as Json,
 }))

 if (actionsToInsert.length > 0) {
 const { error: insertError } = await supabase.from('crm_actions').insert(actionsToInsert)

 if (insertError) {
 throw insertError
 }
 }

 return {
 actionsCount: actionsToInsert.length,
 actions: KOMMO_AVAILABLE_ACTIONS.map((a) => ({ code: a.code, name: a.name })),
 }
}

const syncKommoPipelines = async (
 connection: CrmConnectionRow,
 credentials: CrmCredentials,
) => {
 const ensuredConnection = await ensureAccessToken(connection, credentials)

 const pipelinesResponse = await kommoApiRequest<{ _embedded?: { pipelines?: KommoPipeline[] } }>({
 baseDomain: ensuredConnection.base_domain,
 accessToken: ensuredConnection.access_token,
 path: '/leads/pipelines',
 })

 const pipelines = pipelinesResponse._embedded?.pipelines ?? []
 const pipelineInputs = buildPipelineInputs(pipelines)

 const { pipelinesCount, stagesCount } = await replaceConnectionPipelines(
 ensuredConnection.id,
 pipelineInputs,
 )

 const pipelinePreview = pipelineInputs.map((pipeline) => ({
 externalId: pipeline.externalId,
 name: pipeline.name,
 stages: pipeline.stages.map((stage) => stage.name),
 }))

 return {
 connection: ensuredConnection,
 pipelinesCount,
 stagesCount,
 pipelinePreview,
 }
}

// DEPRECATED: Функция syncKommoContacts больше не используется
// const syncKommoContacts = async (connection, credentials) => { ... }

const logTokenUsage = async (orgId: string, tokens: number, responses = 1) => {
 const today = new Date().toISOString().slice(0, 10)

 const { data: existing, error: selectError } = await supabase
 .from('usage_daily')
 .select('*')
 .eq('org_id', orgId)
 .eq('usage_date', today)
 .maybeSingle()

 if (selectError) {
 throw selectError
 }

 if (existing) {
 const { error: updateError } = await supabase
 .from('usage_daily')
 .update({
 tokens_consumed: (existing.tokens_consumed ?? 0) + tokens,
 agent_responses: (existing.agent_responses ?? 0) + responses,
 interactions: (existing.interactions ?? 0) + responses,
 })
 .eq('org_id', orgId)
 .eq('usage_date', today)

 if (updateError) {
 throw updateError
 }
 } else {
 const { error: insertError } = await supabase.from('usage_daily').insert({
 org_id: orgId,
 usage_date: today,
 tokens_consumed: tokens,
 agent_responses: responses,
 interactions: responses,
 })

 if (insertError) {
 throw insertError
 }
 }

 const { data: subscription, error: subSelectError } = await supabase
 .from('subscriptions')
 .select('token_used')
 .eq('org_id', orgId)
 .maybeSingle()

 if (subSelectError) {
 throw subSelectError
 }

 if (subscription) {
 const { error: subUpdateError } = await supabase
 .from('subscriptions')
 .update({ token_used: (subscription.token_used ?? 0) + tokens })
 .eq('org_id', orgId)

 if (subUpdateError) {
 throw subUpdateError
 }
 }
}

const estimatedTokens = (text: string) => {
 const words = text.trim().split(/\s+/).length
 return Math.max(50, Math.round(words * 1.3))
}

const handleCrmSyncPipelines = async (payload: CrmSyncPipelinesJob) => {
 const provider = normalizeProvider(payload.provider)

 if (provider !== 'kommo') {
 throw new Error(`CRM provider ${provider} is not yet supported`)
 }

 const connection = await fetchCrmConnection({
 orgId: payload.orgId,
 provider,
 connectionId: payload.connectionId,
 baseDomain: payload.baseDomain,
 })

 if (!connection) {
 throw new Error('CRM connection not found')
 }

 const startedAt = new Date().toISOString()
 let metadata = await updateSyncMetadata(connection.id, connection.metadata, {
 status: 'running',
 startedAt,
 error: null,
 pipelines: {
 status: 'running',
 startedAt,
 error: null,
 },
 })

 try {
 const credentials = await fetchCrmCredentials(payload.orgId, provider)

 // Синхронизируем воронки
 const syncPipelinesResult = await syncKommoPipelines(connection, credentials)

 // Синхронизируем кастомные поля
 const syncFieldsResult = await syncKommoCustomFields(syncPipelinesResult.connection, credentials)

 // Синхронизируем доступные действия
 const syncActionsResult = await syncKommoActions(syncFieldsResult.connection)

 const completedAt = new Date().toISOString()

 metadata = await updateSyncMetadata(syncFieldsResult.connection.id, metadata, {
 status: 'completed',
 completedAt,
 error: null,
 provider,
 baseDomain: syncFieldsResult.connection.base_domain,
 pipelines: {
 status: 'completed',
 completedAt,
 error: null,
 pipelinesCount: syncPipelinesResult.pipelinesCount,
 stagesCount: syncPipelinesResult.stagesCount,
 preview: syncPipelinesResult.pipelinePreview,
 },
 customFields: {
 status: 'completed',
 completedAt,
 error: null,
 fieldsCount: syncFieldsResult.fieldsCount,
 fieldsByEntity: syncFieldsResult.fieldsByEntity,
 },
 actions: {
 status: 'completed',
 completedAt,
 error: null,
 actionsCount: syncActionsResult.actionsCount,
 },
 pipelinesCount: syncPipelinesResult.pipelinesCount,
 stagesCount: syncPipelinesResult.stagesCount,
 fieldsCount: syncFieldsResult.fieldsCount,
 actionsCount: syncActionsResult.actionsCount,
 pipelinesPreview: syncPipelinesResult.pipelinePreview,
 })

 return metadata
 } catch (error) {
 await updateSyncMetadata(connection.id, metadata, {
 status: 'failed',
 failedAt: new Date().toISOString(),
 error: error instanceof Error ? error.message : 'Unknown error',
 pipelines: {
 status: 'failed',
 failedAt: new Date().toISOString(),
 error: error instanceof Error ? error.message : 'Unknown error',
 },
 })

 throw error
 }
}

const sendKommoMessage = async (payload: {
 orgId: string
 dealId: string
 channel: 'email' | 'chat'
 message: {
 subject?: string
 body: string
 attachments?: Array<{ url: string; name: string }>
 }
}) => {
 const { orgId, dealId, channel, message } = payload

 const { data: connection, error } = await supabase
 .from('crm_connections')
 .select('*')
 .eq('org_id', orgId)
 .eq('provider', 'kommo')
 .maybeSingle()

 if (error || !connection) {
 throw error ?? new Error('Kommo connection not found for message sending')
 }

 const credentials = await fetchCrmCredentials(orgId, 'kommo')
 const ensuredConnection = await ensureAccessToken(connection as CrmConnectionRow, credentials)

 const noteType = channel === 'email' ? 'outgoing_email' : 'common'
 const params: Record<string, unknown> = {
 text: message.body,
 }

 if (channel === 'email') {
 params.subject = message.subject ?? 'Письмо от AI-агента'
 }

 if (message.attachments?.length) {
 params.attachments = message.attachments
 }

 await kommoApiRequest({
 baseDomain: ensuredConnection.base_domain,
 accessToken: ensuredConnection.access_token,
 path: `/leads/${dealId}/notes`,
 method: 'POST',
 body: [
 {
 entity_id: Number.parseInt(dealId, 10),
 note_type: noteType,
 params,
 },
 ],
 })

 await logTokenUsage(orgId, estimatedTokens(message.body))
}

export const getTaskHandlers = () => {
 return {
  'crm:sync-pipelines': async (payload: CrmSyncPipelinesJob) => {
   await handleCrmSyncPipelines(payload)
  },
  // DEPRECATED: Синхронизация контактов не требуется - синхронизируем только поля, воронки и действия
  // 'crm:sync-contacts': async (payload: CrmSyncContactsJob) => { ... },
  'kommo:sync-pipelines': async (payload: { orgId: string; baseDomain: string }) => {
   await handleCrmSyncPipelines({
    provider: 'kommo',
    orgId: payload.orgId,
    baseDomain: payload.baseDomain,
   })
  },
  'kommo:webhook': async (payload: {
   orgId: string
   provider: 'kommo'
   payload: unknown
   signature?: string | null
   rawBody?: string
  }) => {
   if (env.KOMMO_WEBHOOK_SECRET) {
    const bodyString = payload.rawBody ?? JSON.stringify(payload.payload ?? {})
    const expected = createHmac('sha256', env.KOMMO_WEBHOOK_SECRET).update(bodyString).digest('hex')

    if (!payload.signature || payload.signature !== expected) {
     throw new Error('Invalid webhook signature')
    }
   }

   if (typeof payload.payload !== 'object' || payload.payload === null) {
    throw new Error('Invalid webhook payload format')
   }

   const record = payload.payload as Record<string, unknown>
   const event = KommoAPI.parseWebhook(record)
   const metadata = extractWebhookMetadata(event.type, event.data)
   const eventId = await saveWebhookEvent(payload.orgId, payload.provider, event.type, record, metadata)
   const success = await processWebhookEvent(eventId)

   if (!success) {
    throw new Error(`Processing failed for webhook event ${eventId}`)
   }
  },
  'webhook:retry': async (payload: { eventId: string; retryCount: number }) => {
   const success = await processWebhookEvent(payload.eventId)

   if (!success) {
    throw new Error(`Retry processing failed for webhook event ${payload.eventId}`)
   }
  },
 'kommo:send-message': async (payload: {
 orgId: string
 dealId: string
 channel: 'email' | 'chat'
 message: { subject?: string; body: string; attachments?: Array<{ url: string; name: string }> }
 }) => {
 await sendKommoMessage(payload)
 },
 // Removed process-asset task - will be reimplemented for new architecture
 // 'process-asset': async (payload: { assetId: string; organizationId: string }) => {
 //   await processAsset(payload)
 // },
 'extract-knowledge-graph': async (payload: {
 assetId?: string
 articleId?: string
 organizationId: string
 agentId?: string | null
 chunkIds?: string[]
 }) => {
 await extractKnowledgeGraph(payload)
 },
 'process-large-file': async (payload: {
 fileId: string
 organizationId: string
 userId: string
 operation: 'analyze' | 'extract' | 'convert' | 'compress'
 }) => {
 await processLargeFile(payload)
 },
 'generate-report': async (payload: {
 reportType: 'usage' | 'analytics' | 'performance' | 'financial'
 organizationId: string
 userId: string
 dateRange: { start: string; end: string }
 format: 'pdf' | 'excel' | 'json'
 }) => {
 await generateReport(payload)
 },
 'process-bulk-data': async (payload: {
 operation: 'import' | 'export' | 'migrate' | 'cleanup'
 organizationId: string
 userId: string
 data: any[]
 options?: Record<string, any>
 }) => {
 await processBulkData(payload)
 },
 'fine-tune-model': async (payload: {
 modelId: string
 organizationId: string
 userId: string
 trainingData: any[]
 parameters: {
 epochs: number
 learningRate: number
 batchSize: number
 }
 }) => {
 await fineTuneModel(payload)
 },
 // Простой тестовый обработчик для проверки работы Worker
 'test-job': async (payload: { test?: boolean; timestamp?: number }) => {
 console.log('[worker] Test job received:', payload)
 // Просто логируем и завершаем успешно
 return { success: true, receivedAt: new Date().toISOString(), payload }
 },
 }
}
