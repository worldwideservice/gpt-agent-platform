import crypto from 'node:crypto'

import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { getSupabaseClient } from '../lib/supabase'
import {
 createOAuthState,
 getKommoConnection,
 getKommoCredentials,
 saveKommoConnection,
 saveKommoCredentials,
 consumeOAuthState,
 getKommoConnectionByBaseDomain,
} from '../lib/repositories/kommo'
import { buildKommoAuthUrl, exchangeKommoCodeForToken } from '../lib/providers/kommo'
import { getJobQueue } from '../lib/queue'
import { enqueueJob } from '../lib/queue/enqueue'

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

const credentialsSchema = z.object({
 orgId: z.string().uuid(),
 provider: z.string().optional(),
 clientId: z.string().min(1),
 clientSecret: z.string().min(1),
 redirectUri: z.string().url().optional(),
})

const oauthStartSchema = z.object({
 orgId: z.string().uuid(),
 provider: z.string().optional(),
 baseDomain: z.string().min(1),
 scope: z.string().optional(),
})

const oauthCallbackSchema = z.object({
 provider: z.string().optional(),
 state: z.string().min(8),
 code: z.string().min(4),
})

const statusQuerySchema = z.object({
 orgId: z.string().uuid(),
 provider: z.string().optional(),
})

const syncPipelinesSchema = z.object({
 orgId: z.string().uuid(),
 provider: z.string().optional(),
})

const sendMessageSchema = z.object({
 orgId: z.string().uuid(),
 provider: z.string().optional(),
 dealId: z.string().min(1),
 channel: z.enum(['email', 'chat']),
 message: z.object({
 subject: z.string().min(1).optional(),
 body: z.string().min(1),
 attachments: z
 .array(
 z.object({
 url: z.string().url(),
 name: z.string().min(1),
 }),
 )
 .optional(),
 }),
})

const DEFAULT_SCOPE = 'crm:read crm:write leads:read leads:write contacts:read contacts:write tasks:read tasks:write'

export const registerKommoRoutes = async (fastify: FastifyInstance) => {
 const supabase = getSupabaseClient(fastify.config.SUPABASE_URL, fastify.config.SUPABASE_SERVICE_ROLE_KEY)
 const queue = getJobQueue({
 redisUrl: fastify.config.REDIS_URL,
 queueName: fastify.config.JOB_QUEUE_NAME,
 })

 fastify.post('/credentials', async (request, reply) => {
 const payload = credentialsSchema.parse(request.body)

 await saveKommoCredentials(supabase, fastify.config.ENCRYPTION_KEY, {
 orgId: payload.orgId,
 provider: payload.provider,
 clientId: payload.clientId,
 clientSecret: payload.clientSecret,
 redirectUri: payload.redirectUri,
 })

 reply.send({ success: true })
 })

 fastify.post('/oauth/start', async (request, reply) => {
 const payload = oauthStartSchema.parse(request.body)

 const credentials = await getKommoCredentials(
 supabase,
 fastify.config.ENCRYPTION_KEY,
 payload.orgId,
 payload.provider,
 )

 if (!credentials) {
 reply.status(400).send({ success: false, error: 'Credentials are not configured for this organization' })
 return
 }

 const redirectUri = credentials.redirect_uri ?? fastify.config.KOMMO_OAUTH_REDIRECT_BASE

 if (!redirectUri) {
 reply.status(400).send({ success: false, error: 'Redirect URI is not configured' })
 return
 }

 const scope = payload.scope ?? DEFAULT_SCOPE
 const state = crypto.randomBytes(16).toString('hex')

 await createOAuthState(supabase, {
 orgId: payload.orgId,
 provider: payload.provider,
 state,
 redirectUri,
 baseDomain: payload.baseDomain,
 })

 const authUrl = buildKommoAuthUrl(payload.baseDomain, credentials.client_id, redirectUri, scope, state)

 reply.send({ success: true, authUrl, state })
 })

 fastify.post('/oauth/callback', async (request, reply) => {
 const payload = oauthCallbackSchema.parse(request.body)

 const stateRow = await consumeOAuthState(
 supabase,
 payload.provider ?? 'kommo',
 payload.state,
 )

 if (!stateRow) {
 reply.status(400).send({ success: false, error: 'Invalid or expired state parameter' })
 return
 }

 const credentials = await getKommoCredentials(
 supabase,
 fastify.config.ENCRYPTION_KEY,
 stateRow.org_id,
 stateRow.provider,
 )

 if (!credentials) {
 reply.status(400).send({ success: false, error: 'Credentials not found for organization' })
 return
 }

 const token = await exchangeKommoCodeForToken({
 baseDomain: stateRow.base_domain,
 clientId: credentials.client_id,
 clientSecret: credentials.client_secret,
 code: payload.code,
 redirectUri: stateRow.redirect_uri,
 })

 const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString()
 const scope = token.scope ? token.scope.split(' ') : null

 const connection = await saveKommoConnection(supabase, {
 orgId: stateRow.org_id,
 provider: stateRow.provider,
 baseDomain: token.base_domain ?? stateRow.base_domain,
 accessToken: token.access_token,
 refreshToken: token.refresh_token,
 expiresAt,
 scope,
 accountId: token.account_id ? String(token.account_id) : undefined,
 metadata: { token_type: token.token_type },
 })

 const metadata = mergeSyncMetadata(connection.metadata, {
 status: 'queued',
 requestedAt: new Date().toISOString(),
 error: null,
 provider: connection.provider,
 })

 const { data: updatedConnection, error: updateError } = await supabase
 .from('crm_connections')
 .update({ metadata })
 .eq('id', connection.id)
 .select('*')
 .single()

 if (updateError || !updatedConnection) {
 throw updateError ?? new Error('Failed to update CRM connection metadata')
 }

 await enqueueJob(queue, {
 type: 'crm:sync-pipelines',
 provider: 'kommo',
 orgId: updatedConnection.org_id,
 connectionId: updatedConnection.id,
 baseDomain: updatedConnection.base_domain,
 })

 reply.send({ success: true, connection: updatedConnection })
 })

 fastify.get('/status', async (request, reply) => {
 const query = statusQuerySchema.parse(request.query)

 const connection = await getKommoConnection(
 supabase,
 query.orgId,
 query.provider ?? 'kommo',
 )

 reply.send({ success: true, connection })
 })

 fastify.post('/sync/pipelines', async (request, reply) => {
 const payload = syncPipelinesSchema.parse(request.body)

 const connection = await getKommoConnection(supabase, payload.orgId, payload.provider ?? 'kommo')

 if (!connection) {
 reply.status(404).send({ success: false, error: 'Kommo connection not found' })
 return
 }

 const metadata = mergeSyncMetadata(connection.metadata, {
 status: 'queued',
 requestedAt: new Date().toISOString(),
 error: null,
 provider: connection.provider,
 })

 const { error: updateError } = await supabase
 .from('crm_connections')
 .update({ metadata })
 .eq('id', connection.id)

 if (updateError) {
 throw updateError
 }

 await enqueueJob(
 queue,
 {
 type: 'crm:sync-pipelines',
 provider: 'kommo',
 orgId: payload.orgId,
 connectionId: connection.id,
 baseDomain: connection.base_domain,
 },
 { jobId: `crm-sync-${connection.id}` },
 )

 reply.send({ success: true })
 })

 fastify.post('/messages/send', async (request, reply) => {
 const payload = sendMessageSchema.parse(request.body)

 const connection = await getKommoConnection(supabase, payload.orgId, payload.provider ?? 'kommo')

 if (!connection) {
 reply.status(404).send({ success: false, error: 'Kommo connection not found' })
 return
 }

 await enqueueJob(queue, {
 type: 'kommo:send-message',
 provider: 'kommo',
 orgId: payload.orgId,
 dealId: payload.dealId,
 channel: payload.channel,
 message: payload.message,
 })

 reply.send({ success: true })
 })

 fastify.post('/webhook', async (request, reply) => {
 const signatureHeader = request.headers['x-signature']
 const secret = fastify.config.KOMMO_WEBHOOK_SECRET

 if (secret) {
 const bodyString = JSON.stringify(request.body ?? {})
 const expected = crypto.createHmac('sha256', secret).update(bodyString).digest('hex')

 if (typeof signatureHeader !== 'string' || signatureHeader !== expected) {
 reply.status(401).send({ success: false, error: 'Invalid webhook signature' })
 return
 }
 }

 const payload = request.body as Record<string, unknown> | undefined
 const account = payload && isRecord(payload.account) ? (payload.account as Record<string, unknown>) : undefined
 const baseDomainRaw = account?.base_domain ?? account?.subdomain
 const baseDomain = typeof baseDomainRaw === 'string' && !baseDomainRaw.includes('.')
 ? `${baseDomainRaw}.amocrm.ru`
 : typeof baseDomainRaw === 'string'
 ? baseDomainRaw
 : undefined

 if (!baseDomain) {
 fastify.log.warn({ payload }, 'Kommo webhook without base_domain')
 reply.send({ success: true })
 return
 }

 const connection = await getKommoConnectionByBaseDomain(supabase, baseDomain)

 if (!connection) {
 fastify.log.warn({ baseDomain }, 'No connection found for Kommo webhook')
 reply.send({ success: true })
 return
 }

 await enqueueJob(queue, {
 type: 'kommo:webhook',
 provider: 'kommo',
 orgId: connection.org_id,
 payload,
 })

 reply.send({ success: true })
 })
}
