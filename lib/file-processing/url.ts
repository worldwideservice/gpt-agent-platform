/**
 * URL Content Extraction
 * Fetch and extract text from web pages
 */

import { logger } from '@/lib/logger'

export interface URLExtractionResult {
  text: string
  title?: string
  description?: string
  url: string
  statusCode: number
}

/**
 * Extract text from URL using Cheerio (server-side HTML parsing)
 */
export async function extractTextFromURL(
  url: string
): Promise<URLExtractionResult> {
  try {
    logger.info('Extracting text from URL', { url })

    // Validate URL
    const parsedUrl = new URL(url)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Only HTTP and HTTPS URLs are supported')
    }

    // Fetch page
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; KnowledgeBaseBot/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()

    // Parse HTML using simple regex (lightweight alternative to Cheerio)
    const result = parseHTML(html, url, response.status)

    logger.info('Text extracted from URL', {
      url,
      textLength: result.text.length,
    })

    return result
  } catch (error) {
    logger.error('Failed to extract text from URL', { error, url })
    throw new Error(`Failed to extract text from URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Parse HTML and extract text content
 */
function parseHTML(
  html: string,
  url: string,
  statusCode: number
): URLExtractionResult {
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : undefined

  // Extract meta description
  const descMatch = html.match(
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
  )
  const description = descMatch ? descMatch[1].trim() : undefined

  // Remove script and style tags
  let text = html
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  text = text.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '')

  // Remove all HTML tags
  text = text.replace(/<[^>]+>/g, ' ')

  // Decode HTML entities
  text = decodeHTMLEntities(text)

  // Clean whitespace
  text = text.replace(/\s+/g, ' ')
  text = text.replace(/\n+/g, '\n')
  text = text.trim()

  return {
    text,
    title,
    description,
    url,
    statusCode,
  }
}

/**
 * Decode HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  }

  let decoded = text

  // Replace named entities
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  }

  // Replace numeric entities (&#123; or &#xAB;)
  decoded = decoded.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 10))
  )
  decoded = decoded.replace(/&#x([0-9A-F]+);/gi, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  )

  return decoded
}

/**
 * Extract text from multiple URLs
 */
export async function extractTextFromURLs(
  urls: string[]
): Promise<URLExtractionResult[]> {
  logger.info('Extracting text from multiple URLs', { count: urls.length })

  const results = await Promise.allSettled(
    urls.map((url) => extractTextFromURL(url))
  )

  const extracted: URLExtractionResult[] = []

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      extracted.push(result.value)
    } else {
      logger.error('Failed to extract from URL', {
        url: urls[index],
        error: result.reason,
      })
    }
  })

  logger.info('Batch URL extraction complete', {
    total: urls.length,
    successful: extracted.length,
    failed: urls.length - extracted.length,
  })

  return extracted
}

/**
 * Check if URL is accessible
 */
export async function isURLAccessible(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; KnowledgeBaseBot/1.0)',
      },
    })

    return response.ok
  } catch (error) {
    logger.debug('URL not accessible', { url, error })
    return false
  }
}

/**
 * Validate URL format
 */
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * Get domain from URL
 */
export function getDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}
