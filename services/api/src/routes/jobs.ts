import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { getJobQueue } from '../lib/queue'
import { enqueueJob } from '../lib/queue/enqueue'
import type { ProcessAssetJob } from '../lib/queue/types'

const processAssetSchema = z.object({
 assetId: z.string().uuid(),
 organizationId: z.string().uuid(),
})

const jobPayloadSchema = z.discriminatedUnion('type', [
 z.object({
 type: z.literal('process-asset'),
 assetId: z.string().uuid(),
 organizationId: z.string().uuid(),
 }),
 z.object({
 type: z.literal('extract-knowledge-graph'),
 assetId: z.string().uuid().optional(),
 articleId: z.string().uuid().optional(),
 organizationId: z.string().uuid(),
 agentId: z.string().uuid().nullable().optional(),
 chunkIds: z.array(z.string().uuid()).optional(),
 }),
])

export const registerJobRoutes = async (fastify: FastifyInstance) => {
 const queue = getJobQueue({
 redisUrl: fastify.config.REDIS_URL,
 queueName: fastify.config.JOB_QUEUE_NAME,
 })

 fastify.post<{ Body: ProcessAssetJob | { type: string } }>('/', async (request, reply) => {
 try {
 const payload = jobPayloadSchema.parse(request.body)

 switch (payload.type) {
 case 'process-asset': {
 const assetPayload = processAssetSchema.parse(payload)

 await enqueueJob(
 queue,
 {
 type: 'process-asset',
 assetId: assetPayload.assetId,
 organizationId: assetPayload.organizationId,
 },
 {
 jobId: `process-asset-${assetPayload.assetId}`,
 attempts: 3,
 },
 )

 reply.send({
 success: true,
 jobId: `process-asset-${assetPayload.assetId}`,
 })
 break
 }

 case 'extract-knowledge-graph': {
 const kgPayload = jobPayloadSchema.parse(payload)

 await enqueueJob(
 queue,
 {
 type: 'extract-knowledge-graph',
 assetId: 'assetId' in kgPayload ? kgPayload.assetId : undefined,
 articleId: 'articleId' in kgPayload ? kgPayload.articleId : undefined,
 organizationId: kgPayload.organizationId,
 agentId: 'agentId' in kgPayload ? kgPayload.agentId : undefined,
 chunkIds: 'chunkIds' in kgPayload ? kgPayload.chunkIds : undefined,
 },
 {
 jobId: `extract-kg-${Date.now()}`,
 attempts: 2,
 },
 )

 reply.send({
 success: true,
 jobId: `extract-kg-${Date.now()}`,
 })
 break
 }

 default:
 reply.status(400).send({
 success: false,
 error: `Unsupported job type: ${(payload as { type: string }).type}`,
 })
 }
 } catch (error) {
 fastify.log.error({ err: error }, 'Failed to enqueue job')

 if (error instanceof z.ZodError) {
 reply.status(400).send({
 success: false,
 error: 'Некорректные параметры задачи',
 details: error.errors,
 })
 return
 }

 reply.status(500).send({
 success: false,
 error: 'Не удалось добавить задачу в очередь',
 })
 }
 })
}

