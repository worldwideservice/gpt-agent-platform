/**
 * Documents List API
 * GET /api/documents
 */

// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { authOptions } from '@/lib/auth'
import { getDocuments, getDocumentStats } from '@/lib/repositories/document-storage'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orgId = session.user.orgId || session.user.id

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const status = searchParams.get('status') || undefined
    const tags = searchParams.get('tags')?.split(',') || undefined
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get documents
    const documents = await getDocuments(orgId, {
      category,
      status,
      tags,
      limit,
      offset,
    })

    // Get stats
    const stats = await getDocumentStats(orgId)

    return NextResponse.json({
      documents: documents.map((doc) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        file_name: doc.file_name,
        file_type: doc.file_type,
        file_size: doc.file_size,
        category: doc.category,
        tags: doc.tags,
        status: doc.status,
        error_message: doc.error_message,
        created_at: doc.created_at,
        indexed_at: doc.indexed_at,
      })),
      stats,
      pagination: {
        limit,
        offset,
        total: stats.total_documents,
      },
    })
  } catch (error) {
    logger.error('Failed to fetch documents', { error })

    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}
