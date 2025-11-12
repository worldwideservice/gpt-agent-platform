import type { Queue } from 'bullmq'

import type { JobPayload } from './types'

type EnqueueOptions = {
 jobId?: string
 attempts?: number
 backoff?: {
 type: 'exponential' | 'fixed'
 delay: number
 }
}

export const enqueueJob = async (
 queue: Queue<JobPayload>,
 payload: JobPayload,
 opts?: EnqueueOptions,
) => {
 await queue.add(payload.type, payload, {
 jobId: opts?.jobId,
 attempts: opts?.attempts ?? 5,
 backoff: opts?.backoff ?? { type: 'exponential', delay: 5000 },
 removeOnComplete: 100,
 removeOnFail: 100,
 })
}
