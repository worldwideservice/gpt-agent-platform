/**
 * Document Operations API
 * GET /api/documents/[id] - Get document details
 * PATCH /api/documents/[id] - Update document
 * DELETE /api/documents/[id] - Delete document
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getDocument,
  updateDocument,
  deleteDocument,
  getChunks,
} from '@/lib/repositories/document-storage'
import { reprocessDocument } from '@/lib/document-processor'
import { logger } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const document = await getDocument(params.id)

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    const orgId = session.user.orgId || session.user.id
    if (document.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get chunks count
    const chunks = await getChunks(params.id)

    return NextResponse.json({
      document: {
        id: document.id,
        title: document.title,
        description: document.description,
        file_name: document.file_name,
        file_type: document.file_type,
        file_size: document.file_size,
        category: document.category,
        tags: document.tags,
        status: document.status,
        error_message: document.error_message,
        created_at: document.created_at,
        updated_at: document.updated_at,
        indexed_at: document.indexed_at,
        chunks_count: chunks.length,
      },
    })
  } catch (error) {
    logger.error('Failed to fetch document', { error, id: params.id })

    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const document = await getDocument(params.id)

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    const orgId = session.user.orgId || session.user.id
    if (document.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, category, tags, reindex } = body

    // Update metadata
    const updated = await updateDocument(params.id, {
      title,
      description,
      category,
      tags,
    })

    // Reindex if requested
    if (reindex) {
      logger.info('Reindexing document', { documentId: params.id })

      // Start reprocessing (async, don't wait)
      reprocessDocument(params.id).catch((error) => {
        logger.error('Reindexing failed', { error, documentId: params.id })
      })
    }

    return NextResponse.json({
      document: {
        id: updated.id,
        title: updated.title,
        description: updated.description,
        category: updated.category,
        tags: updated.tags,
        updated_at: updated.updated_at,
      },
    })
  } catch (error) {
    logger.error('Failed to update document', { error, id: params.id })

    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const document = await getDocument(params.id)

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    const orgId = session.user.orgId || session.user.id
    if (document.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    logger.info('Deleting document', { documentId: params.id })

    await deleteDocument(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Failed to delete document', { error, id: params.id })

    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
