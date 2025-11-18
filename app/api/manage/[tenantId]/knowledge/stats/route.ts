// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getKnowledgeBaseStats } from '@/lib/repositories/knowledge-base'

export async function GET(request: NextRequest, { params }: { params: { tenantId: string } }) {
  try {
    const session = await auth()
    const organizationId = session?.user?.orgId

    if (!organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await getKnowledgeBaseStats(organizationId)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch knowledge base stats:', error)
    return NextResponse.json({ error: 'Failed to fetch knowledge base stats' }, { status: 500 })
  }
}
