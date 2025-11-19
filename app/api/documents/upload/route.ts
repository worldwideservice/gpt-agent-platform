/**
 * Document Upload API
 * POST /api/documents/upload
 */

// Force Node.js runtime (required for database and crypto operations)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'
import { authOptions } from '@/lib/auth'
import { processDocument, processURL } from '@/lib/document-processor'
import { rateLimitAPI } from '@/lib/middleware/rate-limit-api'
import { logger } from '@/lib/logger'
import type { DocumentFileType } from '@/lib/types/knowledge-base'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

const ALLOWED_MIME_TYPES = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
  md: 'text/markdown',
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rateLimitResponse = await rateLimitAPI(request, session.user.id)
    if (rateLimitResponse) return rateLimitResponse

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const url = formData.get('url') as string | null
    const title = formData.get('title') as string | undefined
    const description = formData.get('description') as string | undefined
    const category = formData.get('category') as string | undefined
    const tags = formData.get('tags') as string | undefined

    // Get org_id from session
    const orgId = session.user.orgId || session.user.id

    // Parse tags
    const tagArray = tags ? tags.split(',').map((t) => t.trim()) : undefined

    // Process URL
    if (url) {
      logger.info('Processing URL upload', { url, userId: session.user.id })

      const document = await processURL(url, {
        org_id: orgId,
        title,
        description,
        category,
        tags: tagArray,
      })

      return NextResponse.json({
        document: {
          id: document.id,
          title: document.title,
          status: document.status,
        },
      })
    }

    // Process File
    if (!file) {
      return NextResponse.json(
        { error: 'File or URL is required' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 413 }
      )
    }

    // Detect file type
    const fileType = getFileType(file.type, file.name)
    if (!fileType) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      )
    }

    logger.info('Processing file upload', {
      fileName: file.name,
      fileType,
      fileSize: file.size,
      userId: session.user.id,
    })

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Process document
    const document = await processDocument(
      buffer,
      {
        org_id: orgId,
        file_name: file.name,
        file_type: fileType,
        title: title || file.name,
        description,
        category,
        tags: tagArray,
      }
    )

    return NextResponse.json({
      document: {
        id: document.id,
        title: document.title,
        status: document.status,
        file_size: document.file_size,
      },
    })
  } catch (error) {
    logger.error('Document upload failed', { error })

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Upload failed',
      },
      { status: 500 }
    )
  }
}

function getFileType(
  mimeType: string,
  fileName: string
): DocumentFileType | null {
  // Check by MIME type
  for (const [type, mime] of Object.entries(ALLOWED_MIME_TYPES)) {
    if (mimeType === mime) {
      return type as DocumentFileType
    }
  }

  // Fallback to file extension
  const ext = fileName.split('.').pop()?.toLowerCase()

  if (ext === 'pdf') return 'pdf'
  if (ext === 'docx') return 'docx'
  if (ext === 'txt') return 'txt'
  if (ext === 'md' || ext === 'markdown') return 'md'

  return null
}
