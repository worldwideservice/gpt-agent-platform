// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getKnowledgeBaseArticles } from '@/lib/repositories/knowledge-base'

export async function GET(request: NextRequest, { params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params

  try {
    const session = await auth()
    const organizationId = session?.user?.orgId

    if (!organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId') || undefined
    const search = searchParams.get('search') || undefined

    const articles = await getKnowledgeBaseArticles(organizationId, categoryId, search)

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Failed to fetch knowledge base articles:', error)
    return NextResponse.json({ error: 'Failed to fetch knowledge base articles' }, { status: 500 })
  }
}
