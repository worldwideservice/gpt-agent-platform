import { NextResponse } from 'next/server'

import { registry } from '@/lib/monitoring/metrics'

export const dynamic = 'force-dynamic'

export async function GET() {
  const body = await registry.metrics()
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': registry.contentType,
      'Cache-Control': 'no-store',
    },
  })
}
