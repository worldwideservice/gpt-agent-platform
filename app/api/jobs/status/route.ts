import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { supabase } from '@/lib/supabase/client'
import { logger } from '@/lib/utils/logger'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export async function GET(request: NextRequest) {
 try {
 const session = await auth()
 if (!session?.user?.id) {
 return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 }

 const { searchParams } = new URL(request.url)
 const jobId = searchParams.get('jobId')
 const limit = parseInt(searchParams.get('limit') || '10')
 const offset = parseInt(searchParams.get('offset') || '0')

 if (jobId) {
 // Get specific job status
 const { data, error } = await supabase
 .from('job_status')
 .select('*')
 .eq('id', jobId)
 .eq('user_id', session.user.id)
 .single()

 if (error || !data) {
 return NextResponse.json({ error: 'Job not found' }, { status: 404 })
 }

 return NextResponse.json({ job: data })
 } else {
 // Get user's jobs
 const { data, error } = await supabase
 .from('job_status')
 .select('*')
 .eq('user_id', session.user.id)
 .order('created_at', { ascending: false })
 .range(offset, offset + limit - 1)

 if (error) {
 return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
 }

 return NextResponse.json({ jobs: data })
 }
 } catch (error: unknown) {
 logger.error('Jobs status API error:', error, {
   endpoint: '/api/jobs/status',
   method: 'GET',
 })
 return NextResponse.json(
 { error: 'Internal server error' },
 { status: 500 }
 )
 }
}
