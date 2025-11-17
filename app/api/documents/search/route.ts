/**
 * Document Search API
 * POST /api/documents/search
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { searchDocuments } from '@/lib/repositories/document-storage'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orgId = session.user.orgId || session.user.id

    const body = await request.json()
    const { query, category, tags, match_threshold, match_count } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    logger.info('Searching documents', {
      query,
      orgId,
      category,
      tags,
    })

    const results = await searchDocuments({
      query,
      org_id: orgId,
      category,
      tags,
      match_threshold: match_threshold || 0.7,
      match_count: match_count || 5,
    })

    return NextResponse.json({
      results: results.map((result) => ({
        chunk_id: result.chunk_id,
        document_id: result.document_id,
        document_title: result.document_title,
        content: result.content,
        similarity: result.similarity,
        metadata: result.metadata,
      })),
      count: results.length,
    })
  } catch (error) {
    logger.error('Document search failed', { error })

    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
