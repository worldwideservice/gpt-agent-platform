import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getKnowledgeOverview } from '@/lib/services/knowledge'

export async function GET(request: NextRequest, { params }: { params: { tenantId: string } }) {
  try {
    const session = await auth()
    const organizationId = session?.user?.orgId

    if (!organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const overview = await getKnowledgeOverview(organizationId, {
      articlesLimit: 5,
      historyLimit: 10,
    })

    return NextResponse.json(overview)
  } catch (error) {
    console.error('Failed to fetch knowledge overview:', error)
    return NextResponse.json({ error: 'Failed to fetch knowledge overview' }, { status: 500 })
  }
}
