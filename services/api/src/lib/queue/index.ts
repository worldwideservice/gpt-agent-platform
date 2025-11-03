import { Queue } from 'bullmq'
import Redis from 'ioredis'

import type { JobPayload } from './types'

let queueInstance: Queue<JobPayload> | null = null

export const getJobQueue = (options: { redisUrl: string; queueName: string }) => {
 if (queueInstance) {
 return queueInstance
 }

 const connection = new Redis(options.redisUrl)

 queueInstance = new Queue<JobPayload>(options.queueName, {
 connection,
 })

 return queueInstance
}
