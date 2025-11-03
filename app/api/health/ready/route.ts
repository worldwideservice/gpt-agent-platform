import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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
 } catch (error) {
 console.error('Readiness check error:', error)

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
