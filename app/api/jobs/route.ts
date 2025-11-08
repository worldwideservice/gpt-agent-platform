import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { checkTierRateLimit } from '@/lib/rate-limit'
import { addJobToQueue } from '@/lib/queue'
import { createErrorResponse } from '@/lib/utils/error-handler'


// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
// API routes should always be dynamic

const jobSchema = z.object({
  type: z.string().min(1, 'Job type is required'),
  payload: z.record(z.string(), z.unknown()).optional().default({}),
})

 export async function POST(request: NextRequest) {
 try {
 const session = await auth()
 if (!session?.user?.id) {
 const { response, status } = createErrorResponse(
   new Error('Unauthorized'),
   { code: 'AUTHENTICATION_ERROR', logToSentry: false }
 )
 return NextResponse.json(response, { status })
 }

 const body = await request.json()
 const parsed = jobSchema.safeParse(body)

 if (!parsed.success) {
 const issues = parsed.error.issues.map((issue) => issue.message)
 const { response, status } = createErrorResponse(
   new Error('Validation failed'),
   {
     code: 'VALIDATION_ERROR',
     details: issues,
     logToSentry: false,
   }
 )
 return NextResponse.json(response, { status })
 }

 const { type, payload } = parsed.data

 // Rate limiting based on job type
 const rateLimitResult = await checkTierRateLimit(
 request,
 'api',
 session.user.id,
 session.user.orgId
 )

 if (rateLimitResult) {
 return rateLimitResult
 }

 // Add job to queue
 const job = await addJobToQueue(type, {
 ...payload,
 userId: session.user.id,
 organizationId: session.user.orgId || session.user.id,
 })

 return NextResponse.json({
 success: true,
 data: {
   jobId: job.id,
   message: 'Job added to queue successfully',
 },
 timestamp: new Date().toISOString(),
 })
 } catch (error) {
 const { response, status } = createErrorResponse(error, {
   code: 'JOB_CREATE_ERROR',
   logToSentry: true,
 })
 return NextResponse.json(response, { status })
 }
}
