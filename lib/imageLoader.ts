// Custom image loader that uses our optimization API

export const customImageLoader = ({
 src,
 width,
 quality,
}: {
 src: string
 width: number
 quality?: number
}): string => {
 // If it's already an optimized URL, return as is
 if (src.startsWith('/api/images')) {
 return src
 }

 // If it's a relative path or data URL, return as is
 if (src.startsWith('/') || src.startsWith('data:') || src.startsWith('blob:')) {
 return src
 }

 // For external images, use our optimization API
 const params = new URLSearchParams({
 url: src,
 w: width.toString(),
 q: (quality || 85).toString(),
 f: 'webp', // Default to WebP
 })

 return `/api/images?${params.toString()}`
}

// Loader for different formats
export const imageLoader = {
 webp: ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
 const params = new URLSearchParams({
 url: src,
 w: width.toString(),
 q: (quality || 85).toString(),
 f: 'webp',
 })
 return `/api/images?${params.toString()}`
 },

 avif: ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
 const params = new URLSearchParams({
 url: src,
 w: width.toString(),
 q: (quality || 85).toString(),
 f: 'avif',
 })
 return `/api/images?${params.toString()}`
 },

 jpeg: ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
 const params = new URLSearchParams({
 url: src,
 w: width.toString(),
 q: (quality || 85).toString(),
 f: 'jpeg',
 })
 return `/api/images?${params.toString()}`
 },

 png: ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
 const params = new URLSearchParams({
 url: src,
 w: width.toString(),
 q: (quality || 85).toString(),
 f: 'png',
 })
 return `/api/images?${params.toString()}`
 },
}

// Utility to generate srcSet for responsive images
export const generateSrcSet = (
 src: string,
 widths: number[] = [320, 640, 768, 1024, 1280, 1920],
 format: 'webp' | 'avif' | 'jpeg' | 'png' = 'webp',
 quality: number = 85
): string => {
 const loader = imageLoader[format]
 return widths
 .map(width => `${loader({ src, width, quality })} ${width}w`)
 .join(', ')
}

// Utility to generate sizes attribute
export const generateSizes = (
 breakpoints: { min: number; size: string }[] = [
 { min: 1920, size: '1920px' },
 { min: 1280, size: '1280px' },
 { min: 1024, size: '1024px' },
 { min: 768, size: '768px' },
 { min: 640, size: '640px' },
 { min: 320, size: '320px' },
 ]
): string => {
 return breakpoints
 .map(bp => `(min-width: ${bp.min}px) ${bp.size}`)
 .join(', ')
}
