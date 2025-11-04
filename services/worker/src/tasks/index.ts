import { env } from '../lib/env.ts'
import { decryptSecret } from '../lib/crypto.ts'
import { getSupabaseClient } from '../lib/supabase.ts'
import { kommoApiRequest, refreshKommoToken } from '../providers/kommo'
import type { Database, Json } from '../lib/types.ts'
import { processAsset } from './process-asset'
import { extractKnowledgeGraph } from './extract-knowledge-graph'
import { processLargeFile, generateReport, processBulkData, fineTuneModel } from './heavy-processing'

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

const recordWebhookEvent = async (orgId: string, payload: unknown) => {
 const eventType =
 typeof payload === 'object' && payload && 'event' in (payload as Record<string, unknown>)
 ? String((payload as Record<string, unknown>).event)
 : 'unknown'

 const { error } = await supabase.from('webhook_events').insert({
 org_id: orgId,
 provider: 'kommo',
 event_type: eventType,
 payload,
 })

 if (error) {
 throw error
 }
}

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
 })

 try {
 const credentials = await fetchCrmCredentials(payload.orgId, provider)
 const syncResult = await syncKommoPipelines(connection, credentials)

 const completedAt = new Date().toISOString()

 metadata = await updateSyncMetadata(syncResult.connection.id, metadata, {
 status: 'completed',
 completedAt,
 error: null,
 provider,
 baseDomain: syncResult.connection.base_domain,
 pipelinesCount: syncResult.pipelinesCount,
 stagesCount: syncResult.stagesCount,
 pipelinesPreview: syncResult.pipelinePreview,
 })

 return metadata
 } catch (error) {
 await updateSyncMetadata(connection.id, metadata, {
 status: 'failed',
 failedAt: new Date().toISOString(),
 error: error instanceof Error ? error.message : 'Unknown error',
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
 'kommo:sync-pipelines': async (payload: { orgId: string; baseDomain: string }) => {
 await handleCrmSyncPipelines({
 provider: 'kommo',
 orgId: payload.orgId,
 baseDomain: payload.baseDomain,
 })
 },
 'kommo:webhook': async (payload: { orgId: string; provider: 'kommo'; payload: unknown }) => {
 await recordWebhookEvent(payload.orgId, payload.payload)
 },
 'webhook:retry': async (payload: { eventId: string; retryCount: number }) => {
 // Импортируем процессор webhook динамически через tsx для поддержки path aliases
 // Используем tsImport для правильного резолва @/ импортов внутри файла
 const { tsImport } = await import('tsx/esm/api')
 const { fileURLToPath } = await import('url')
 const { dirname, resolve } = await import('path')
 
 // Определяем путь к текущему файлу и корню проекта
 const currentFile = fileURLToPath(import.meta.url)
 const currentDir = dirname(currentFile)
 const projectRoot = resolve(process.cwd())
 const tsconfigPath = resolve(projectRoot, 'tsconfig.json')
 
 // Пробуем разные пути к webhook-processor
 const paths = [
   resolve(currentDir, '../../lib/services/webhook-processor.ts'),
   resolve(projectRoot, 'lib/services/webhook-processor.ts'),
 ]
 
 let processWebhookEvent
 let lastError: Error | null = null
 
 for (const libPath of paths) {
   try {
     // Используем tsImport с указанием tsconfig для резолва path aliases
     const module = await tsImport(libPath, {
       parentURL: import.meta.url,
       tsconfig: tsconfigPath,
     })
     if (module && module.processWebhookEvent) {
       processWebhookEvent = module.processWebhookEvent
       console.log(`✅ Successfully imported webhook-processor from: ${libPath}`)
       break
     }
   } catch (error) {
     lastError = error as Error
     console.error(`⚠️ Failed to import from ${libPath}:`, error)
     continue
   }
 }
 
 if (!processWebhookEvent) {
   console.error('❌ Failed to import webhook-processor from all paths:', paths)
   console.error('Last error:', lastError)
   throw new Error(`Failed to import webhook-processor: ${lastError?.message || 'Unknown error'}`)
 }
 
 await processWebhookEvent(payload.eventId)
 },
 'kommo:send-message': async (payload: {
 orgId: string
 dealId: string
 channel: 'email' | 'chat'
 message: { subject?: string; body: string; attachments?: Array<{ url: string; name: string }> }
 }) => {
 await sendKommoMessage(payload)
 },
 'process-asset': async (payload: { assetId: string; organizationId: string }) => {
 await processAsset(payload)
 },
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
 }
}
