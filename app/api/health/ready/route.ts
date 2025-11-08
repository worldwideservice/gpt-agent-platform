import { NextRequest, NextResponse } from 'next/server'

import { logger } from '@/lib/utils/logger'



// Force dynamic rendering (uses headers from auth())
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const GET = async (request: NextRequest) => {
 try {
 // Quick readiness check - just verify the app can start
 const ready = {
 status: 'ready',
 timestamp: new Date().toISOString(),
 uptime: process.uptime(),
 memory: process.memoryUsage(),
 }

 return NextResponse.json(ready, { status: 200 })
 } catch (error: unknown) {
 logger.error('Readiness check error:', error, {
   endpoint: '/api/health/ready',
   method: 'GET',
 })

 return NextResponse.json(
 {
 status: 'not_ready',
 timestamp: new Date().toISOString(),
 error: error instanceof Error ? error.message : 'Unknown error',
 },
 { status: 503 }
 )
 }
}
