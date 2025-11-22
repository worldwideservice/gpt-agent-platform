import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { getSupabaseClient } from '../lib/supabase'
import {
 listAgents,
 upsertAgent,
 updateAgentStatus,
} from '../lib/repositories/agents'
import type { AgentRow } from '../lib/repositories/agents'

type ListAgentsResponse = {
 success: true
 data: AgentRow[]
 pagination: {
 total: number
 page: number
 limit: number
 }
}

const agentPayloadSchema = z.object({
 orgId: z.string().uuid(),
 name: z.string().min(2),
 model: z.string().min(1),
 goal: z.string().min(1),
 channels: z.array(z.string()).min(1),
 schedule: z.string().min(1),
})

const listQuerySchema = z.object({
 orgId: z.string().uuid(),
 status: z.enum(['active', 'inactive', 'draft']).optional(),
 search: z.string().optional(),
 page: z.coerce.number().int().positive().default(1),
 limit: z.coerce.number().int().positive().max(100).default(25),
})

const statusBodySchema = z.object({
 status: z.enum(['active', 'inactive', 'draft']),
})

const statusParamsSchema = z.object({
 agentId: z.string().uuid(),
})

export const registerAgentRoutes = async (fastify: FastifyInstance) => {
 const supabase = getSupabaseClient(fastify.config.SUPABASE_URL, fastify.config.SUPABASE_SERVICE_ROLE_KEY)

 fastify.get('/agents', async (request, reply) => {
 const query = listQuerySchema.parse(request.query)

 try {
 const result = await listAgents(supabase, query)
 const response: ListAgentsResponse = {
 success: true,
 data: result.agents,
 pagination: {
 total: result.total,
 page: query.page,
 limit: query.limit,
 },
 }

 reply.send(response)
 } catch (error) {
 fastify.log.error({ err: error }, 'Failed to list agents')
 reply.status(500).send({ success: false, error: 'Не удалось получить список агентов' })
 }
 })

 fastify.post('/agents', async (request, reply) => {
 const payload = agentPayloadSchema.parse(request.body)

 try {
 const agent = await upsertAgent(supabase, payload)
 const agents = await listAgents(supabase, { orgId: payload.orgId, page: 1, limit: 10 })

 reply.send({ success: true, agent, state: agents })
 } catch (error) {
 fastify.log.error({ err: error }, 'Failed to upsert agent')
 reply.status(500).send({ success: false, error: 'Не удалось сохранить агента' })
 }
 })

 fastify.post('/agents/:agentId/status', async (request, reply) => {
 const params = statusParamsSchema.parse(request.params)
 const body = statusBodySchema.parse(request.body)

 try {
 const agent = await updateAgentStatus(supabase, params.agentId, body.status)
 reply.send({ success: true, agent })
 } catch (error) {
 fastify.log.error({ err: error }, 'Failed to update agent status')
 reply.status(500).send({ success: false, error: 'Не удалось обновить статус агента' })
 }
 })
}
