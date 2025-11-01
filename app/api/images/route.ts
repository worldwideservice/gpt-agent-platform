import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { rateLimit, rateLimitConfigs } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'anonymous'
    
    const rateLimitResult = await rateLimit(`images:${ip}`, rateLimitConfigs.api)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    const width = parseInt(searchParams.get('w') || '800')
    const height = parseInt(searchParams.get('h') || '0')
    const quality = parseInt(searchParams.get('q') || '85')
    const format = searchParams.get('f') || 'webp'

    if (!url) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Validate URL to prevent SSRF attacks
    const allowedDomains = [
      'localhost',
      'vercel.app',
      'supabase.co',
      'images.unsplash.com',
      'picsum.photos',
    ]

    const urlObj = new URL(url)
    if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
      return NextResponse.json(
        { error: 'Domain not allowed' },
        { status: 403 }
      )
    }

    // Fetch the image
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageOptimizer/1.0)',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: response.status }
      )
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Process the image with Sharp
    let sharpInstance = sharp(buffer)

    // Get original metadata
    const metadata = await sharpInstance.metadata()

    // Resize if width or height is specified
    if (width > 0 || height > 0) {
      const resizeOptions: any = {}

      if (width > 0) {
        resizeOptions.width = Math.min(width, 2048) // Max width 2048px
      }

      if (height > 0) {
        resizeOptions.height = Math.min(height, 2048) // Max height 2048px
      }

      if (width > 0 && height > 0) {
        resizeOptions.fit = 'cover'
      }

      sharpInstance = sharpInstance.resize(resizeOptions)
    }

    // Convert to requested format
    const supportedFormats = ['webp', 'avif', 'jpeg', 'png']
    const outputFormat = supportedFormats.includes(format) ? format : 'webp'

    switch (outputFormat) {
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: Math.min(quality, 100) })
        break
      case 'avif':
        sharpInstance = sharpInstance.avif({ quality: Math.min(quality, 100) })
        break
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: Math.min(quality, 100) })
        break
      case 'png':
        sharpInstance = sharpInstance.png({ quality: Math.min(quality, 100) })
        break
    }

    // Optimize the image
    const optimizedBuffer = await sharpInstance.toBuffer()

    // Return the optimized image
    return new NextResponse(optimizedBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': `image/${outputFormat}`,
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
        'CDN-Cache-Control': 'max-age=31536000',
        'Vercel-CDN-Cache-Control': 'max-age=31536000',
        'X-Optimized-By': 'Sharp',
        'X-Original-Size': metadata.size?.toString() || 'unknown',
        'X-Optimized-Size': optimizedBuffer.length.toString(),
      },
    })

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Image optimization error:', error)
    }
    return NextResponse.json(
      { error: 'Failed to optimize image' },
      { status: 500 }
    )
  }
}
