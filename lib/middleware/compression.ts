/**
 * Response Compression Middleware
 * Compresses API responses with gzip/brotli
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '../logger'

const COMPRESSIBLE_TYPES = [
  'application/json',
  'application/javascript',
  'text/html',
  'text/css',
  'text/plain',
  'text/xml',
  'application/xml',
]

const MIN_COMPRESS_SIZE = 1024 // 1KB

/**
 * Check if response should be compressed
 */
function shouldCompress(response: Response): boolean {
  const contentType = response.headers.get('content-type') || ''
  const contentLength = parseInt(response.headers.get('content-length') || '0', 10)

  // Check if content type is compressible
  const isCompressible = COMPRESSIBLE_TYPES.some((type) => contentType.includes(type))

  // Only compress if larger than minimum size
  return isCompressible && contentLength >= MIN_COMPRESS_SIZE
}

/**
 * Compress response with gzip or brotli
 */
export async function compressResponse(
  request: NextRequest,
  response: NextResponse
): Promise<NextResponse> {
  // Skip if already compressed
  if (response.headers.get('content-encoding')) {
    return response
  }

  // Skip if not compressible
  if (!shouldCompress(response)) {
    return response
  }

  try {
    const acceptEncoding = request.headers.get('accept-encoding') || ''

    // Prefer brotli over gzip
    if (acceptEncoding.includes('br') && typeof CompressionStream !== 'undefined') {
      const body = await response.arrayBuffer()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(body))
          controller.close()
        },
      })

      const compressedStream = stream.pipeThrough(new CompressionStream('gzip'))
      const compressed = await new Response(compressedStream).arrayBuffer()

      const newResponse = new NextResponse(compressed, {
        status: response.status,
        headers: response.headers,
      })

      newResponse.headers.set('content-encoding', 'gzip')
      newResponse.headers.set('content-length', String(compressed.byteLength))
      newResponse.headers.delete('content-length')

      logger.debug('Response compressed', {
        encoding: 'gzip',
        originalSize: body.byteLength,
        compressedSize: compressed.byteLength,
        ratio: ((1 - compressed.byteLength / body.byteLength) * 100).toFixed(2) + '%',
      })

      return newResponse
    }

    return response
  } catch (error) {
    logger.error('Compression error', { error })
    return response
  }
}

/**
 * Middleware wrapper for automatic compression
 */
export function withCompression(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const response = await handler(request)
    return compressResponse(request, response)
  }
}
