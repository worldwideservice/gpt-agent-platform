import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { getJobQueue } from '../lib/queue'
import { enqueueJob } from '../lib/queue/enqueue'
import {
  deleteCrmConnection,
  deleteCrmCredentials,
  getCrmConnection,
  getCrmCredentials,
  listCrmConnections,
  saveCrmConnection,
  saveCrmCredentials,
  type CrmConnectionRow,
} from '../lib/repositories/crm'
import { getSupabaseClient } from '../lib/supabase'

const providerSchema = z.string().min(1)

const credentialsBodySchema = z.object({
  orgId: z.string().uuid(),
  provider: providerSchema.optional(),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
  redirectUri: z.string().url().optional(),
})

const deleteCredentialsSchema = z.object({
  orgId: z.string().uuid(),
  provider: providerSchema.optional(),
})

const createConnectionSchema = z.object({
  orgId: z.string().uuid(),
  provider: providerSchema.optional(),
  baseDomain: z.string().min(1),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1).optional(),
  expiresAt: z.string().datetime().optional(),
  scope: z.array(z.string()).optional(),
  accountId: z.string().min(1).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

const listConnectionsSchema = z.object({
  orgId: z.string().uuid(),
  provider: providerSchema.optional(),
})

const deleteConnectionParamsSchema = z.object({
  connectionId: z.string().uuid(),
})

const statusQuerySchema = z.object({
  orgId: z.string().uuid(),
  provider: providerSchema.optional(),
})

const triggerSyncSchema = z.object({
  orgId: z.string().uuid(),
  provider: providerSchema.optional(),
  connectionId: z.string().uuid().optional(),
  baseDomain: z.string().min(1).optional(),
})

const normalizeProvider = (provider?: string) => {
  return provider?.toLowerCase() ?? 'kommo'
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

const extractSyncState = (metadata: unknown): Record<string, unknown> | null => {
  if (!isRecord(metadata) || !isRecord(metadata.sync)) {
    return null
  }

  return metadata.sync as Record<string, unknown>
}

const sanitizeConnection = (connection: CrmConnectionRow) => {
  const metadata = (connection.metadata ?? {}) as Record<string, unknown>

  return {
    id: connection.id,
    orgId: connection.org_id,
    provider: connection.provider,
    baseDomain: connection.base_domain,
    expiresAt: connection.expires_at,
    scope: connection.scope ?? [],
    accountId: connection.account_id,
    metadata,
    createdAt: connection.created_at,
    updatedAt: connection.updated_at,
    sync: extractSyncState(metadata),
  }
}

export const registerCrmRoutes = async (fastify: FastifyInstance) => {
  const supabase = getSupabaseClient(fastify.config.SUPABASE_URL, fastify.config.SUPABASE_SERVICE_ROLE_KEY)
  const queue = getJobQueue({
    redisUrl: fastify.config.REDIS_URL,
    queueName: fastify.config.JOB_QUEUE_NAME,
  })
  const encryptionKey = fastify.config.ENCRYPTION_KEY

  fastify.post('/credentials', async (request, reply) => {
    try {
      const body = credentialsBodySchema.parse(request.body)
      const provider = normalizeProvider(body.provider)

      await saveCrmCredentials(supabase, encryptionKey, {
        orgId: body.orgId,
        provider,
        clientId: body.clientId,
        clientSecret: body.clientSecret,
        redirectUri: body.redirectUri,
      })

      reply.send({ success: true })
    } catch (error) {
      fastify.log.error({ err: error }, 'Failed to save CRM credentials')

      if (error instanceof z.ZodError) {
        reply.status(400).send({ success: false, error: 'Некорректные параметры' })
        return
      }

      reply.status(500).send({ success: false, error: 'Не удалось сохранить учетные данные CRM' })
    }
  })

  fastify.delete('/credentials', async (request, reply) => {
    try {
      const body = deleteCredentialsSchema.parse(request.body)
      const provider = normalizeProvider(body.provider)

      await deleteCrmCredentials(supabase, body.orgId, provider)

      reply.send({ success: true })
    } catch (error) {
      fastify.log.error({ err: error }, 'Failed to delete CRM credentials')

      if (error instanceof z.ZodError) {
        reply.status(400).send({ success: false, error: 'Некорректные параметры' })
        return
      }

      reply.status(500).send({ success: false, error: 'Не удалось удалить учетные данные CRM' })
    }
  })

  fastify.post('/connections', async (request, reply) => {
    try {
      const body = createConnectionSchema.parse(request.body)
      const provider = normalizeProvider(body.provider)

      const connection = await saveCrmConnection(supabase, {
        orgId: body.orgId,
        provider,
        baseDomain: body.baseDomain,
        accessToken: body.accessToken,
        refreshToken: body.refreshToken ?? null,
        expiresAt: body.expiresAt ?? null,
        scope: body.scope ?? null,
        accountId: body.accountId ?? null,
        metadata: body.metadata ?? {},
      })

      let connectionWithMetadata: CrmConnectionRow = connection

      if (provider === 'kommo') {
        const queuedAt = new Date().toISOString()
        const metadata: Record<string, unknown> = mergeSyncMetadata(connection.metadata, {
          status: 'queued',
          requestedAt: queuedAt,
          error: null,
          provider,
        })

        const { data, error } = await supabase
          .from('crm_connections')
          .update({ metadata })
          .eq('id', connection.id)
          .select('*')
          .single()

        if (error || !data) {
          throw error ?? new Error('Не удалось обновить метаданные подключения CRM')
        }

        connectionWithMetadata = data as CrmConnectionRow

        await enqueueJob(
          queue,
          {
            type: 'crm:sync-pipelines',
            provider: 'kommo',
            orgId: connectionWithMetadata.org_id,
            connectionId: connectionWithMetadata.id,
            baseDomain: connectionWithMetadata.base_domain,
          },
          { jobId: `crm-sync-${connectionWithMetadata.id}` },
        )
      }

      reply.send({ success: true, connection: sanitizeConnection(connectionWithMetadata) })
    } catch (error) {
      fastify.log.error({ err: error }, 'Failed to save CRM connection')

      if (error instanceof z.ZodError) {
        reply.status(400).send({ success: false, error: 'Некорректные параметры' })
        return
      }

      reply.status(500).send({ success: false, error: 'Не удалось сохранить подключение CRM' })
    }
  })

  fastify.get('/connections', async (request, reply) => {
    try {
      const query = listConnectionsSchema.parse(request.query)
      const provider = query.provider ? normalizeProvider(query.provider) : undefined

      const connections = await listCrmConnections(supabase, query.orgId, provider)

      reply.send({
        success: true,
        connections: connections.map((connection: CrmConnectionRow) => sanitizeConnection(connection)),
      })
    } catch (error) {
      fastify.log.error({ err: error }, 'Failed to list CRM connections')

      if (error instanceof z.ZodError) {
        reply.status(400).send({ success: false, error: 'Некорректные параметры' })
        return
      }

      reply.status(500).send({ success: false, error: 'Не удалось получить список подключений CRM' })
    }
  })

  fastify.delete('/connections/:connectionId', async (request, reply) => {
    try {
      const params = deleteConnectionParamsSchema.parse(request.params)

      await deleteCrmConnection(supabase, params.connectionId)

      reply.send({ success: true })
    } catch (error) {
      fastify.log.error({ err: error }, 'Failed to remove CRM connection')

      if (error instanceof z.ZodError) {
        reply.status(400).send({ success: false, error: 'Некорректные параметры' })
        return
      }

      reply.status(500).send({ success: false, error: 'Не удалось удалить подключение CRM' })
    }
  })

  fastify.post('/sync', async (request, reply) => {
    try {
      const body = triggerSyncSchema.parse(request.body)
      const provider = normalizeProvider(body.provider)

      let query = supabase
        .from('crm_connections')
        .select('*')
        .eq('org_id', body.orgId)
        .eq('provider', provider)

      if (body.connectionId) {
        query = query.eq('id', body.connectionId)
      } else if (body.baseDomain) {
        query = query.eq('base_domain', body.baseDomain)
      } else {
        reply.status(400).send({ success: false, error: 'Не указан connectionId или baseDomain' })
        return
      }

      const { data: connection, error } = await query.maybeSingle()

      if (error) {
        throw error
      }

      if (!connection) {
        reply.status(404).send({ success: false, error: 'Подключение CRM не найдено' })
        return
      }

      let connectionWithMetadata = connection as CrmConnectionRow

      if (provider === 'kommo') {
        const queuedAt = new Date().toISOString()
      const metadata: Record<string, unknown> = mergeSyncMetadata(connectionWithMetadata.metadata, {
          status: 'queued',
          requestedAt: queuedAt,
          error: null,
          provider,
        })

        const { data: updatedConnection, error: updateError } = await supabase
          .from('crm_connections')
          .update({ metadata })
          .eq('id', connectionWithMetadata.id)
          .select('*')
          .single()

        if (updateError || !updatedConnection) {
          throw updateError ?? new Error('Не удалось обновить метаданные подключения CRM')
        }

        connectionWithMetadata = updatedConnection as CrmConnectionRow

        await enqueueJob(
          queue,
          {
            type: 'crm:sync-pipelines',
            provider: 'kommo',
            orgId: connectionWithMetadata.org_id,
            connectionId: connectionWithMetadata.id,
            baseDomain: connectionWithMetadata.base_domain,
          },
          { jobId: `crm-sync-${connectionWithMetadata.id}` },
        )
      }

      reply.send({ success: true, connection: sanitizeConnection(connectionWithMetadata) })
    } catch (error) {
      fastify.log.error({ err: error }, 'Failed to trigger CRM sync')

      if (error instanceof z.ZodError) {
        reply.status(400).send({ success: false, error: 'Некорректные параметры' })
        return
      }

      reply.status(500).send({ success: false, error: 'Не удалось запустить синхронизацию CRM' })
    }
  })

  fastify.get('/status', async (request, reply) => {
    try {
      const query = statusQuerySchema.parse(request.query)
      const provider = normalizeProvider(query.provider)

      const [credentials, connection] = await Promise.all([
        getCrmCredentials(supabase, encryptionKey, query.orgId, provider).catch((error) => {
          fastify.log.error({ err: error }, 'Failed to fetch CRM credentials')
          throw error
        }),
        getCrmConnection(supabase, query.orgId, provider),
      ])

      const sanitizedConnection = connection ? sanitizeConnection(connection) : null

      reply.send({
        success: true,
        status: {
          provider,
          credentialsConfigured: Boolean(credentials),
          connectionConfigured: Boolean(connection),
          connection: sanitizedConnection,
          credentials: credentials
            ? {
                clientId: credentials.client_id,
                redirectUri: credentials.redirect_uri,
                updatedAt: credentials.updated_at,
              }
            : null,
          sync: sanitizedConnection?.sync ?? null,
        },
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ success: false, error: 'Некорректные параметры' })
        return
      }

      fastify.log.error({ err: error }, 'Failed to get CRM status')
      reply.status(500).send({ success: false, error: 'Не удалось получить статус CRM интеграции' })
    }
  })
}
