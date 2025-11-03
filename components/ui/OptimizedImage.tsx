'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
 src: string
 alt: string
 width?: number
 height?: number
 className?: string
 priority?: boolean
 placeholder?: 'blur' | 'empty'
 blurDataURL?: string
 quality?: number
 sizes?: string
 fill?: boolean
 onLoad?: () => void
 onError?: () => void
 loading?: 'lazy' | 'eager'
 style?: React.CSSProperties
}

export const OptimizedImage = ({
 src,
 alt,
 width,
 height,
 className,
 priority = false,
 placeholder = 'empty',
 blurDataURL,
 quality = 85,
 sizes,
 fill = false,
 onLoad,
 onError,
 loading = 'lazy',
 style,
 ...props
}: OptimizedImageProps) => {
 const [isLoading, setIsLoading] = useState(true)
 const [hasError, setHasError] = useState(false)

 const handleLoad = () => {
 setIsLoading(false)
 onLoad?.()
 }

 const handleError = () => {
 setIsLoading(false)
 setHasError(true)
 onError?.()
 }

 // If it's an external image or we want to use a custom loader
 const isExternal = src.startsWith('http') || src.startsWith('//')

 return (
 <div className={cn('relative overflow-hidden', className)}>
 {isLoading && !hasError && (
        <div
          className={cn(
            'absolute inset-0 animate-pulse bg-gray-200',
            fill ? 'absolute inset-0' : ''
          )}
 style={fill ? undefined : { width, height }}
 aria-hidden="true"
 />
 )}

 {hasError ? (
 <div
 className={cn(
 'flex items-center justify-center bg-gray-100 text-gray-400',
 fill ? 'absolute inset-0' : ''
 )}
 style={fill ? undefined : { width, height }}
 role="img"
 aria-label={`Failed to load image: ${alt}`}
 >
 <svg
 className="h-8 w-8"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 xmlns="http://www.w3.org/2000/svg"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
 />
 </svg>
 </div>
 ) : (
 <Image
 src={src}
 alt={alt}
 width={fill ? undefined : width}
 height={fill ? undefined : height}
 fill={fill}
 priority={priority}
 placeholder={placeholder}
 blurDataURL={blurDataURL}
 quality={quality}
 sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
 onLoad={handleLoad}
 onError={handleError}
 loading={loading}
 style={style}
 className={cn(
 'transition-opacity duration-300',
 isLoading ? 'opacity-0' : 'opacity-100',
 fill ? 'object-cover' : ''
 )}
 {...props}
 />
 )}
 </div>
 )
}

// Hook for lazy loading images with Intersection Observer
export const useLazyImage = () => {
 const [isInView, setIsInView] = useState(false)
 const [ref, setRef] = useState<HTMLDivElement | null>(null)

 useState(() => {
 if (!ref) return

 const observer = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting) {
 setIsInView(true)
 observer.disconnect()
 }
 },
 {
 rootMargin: '50px', // Start loading 50px before the image comes into view
 threshold: 0.1,
 }
 )

 observer.observe(ref)

 return () => observer.disconnect()
 })

 return { ref: setRef, isInView }
}

// Preload critical images
export const preloadImage = (src: string, as: 'image' = 'image') => {
 if (typeof window === 'undefined') return

 const link = document.createElement('link')
 link.rel = 'preload'
 link.as = as
 link.href = src
 link.crossOrigin = 'anonymous'

 document.head.appendChild(link)
}

// Generate responsive image URLs
export const generateResponsiveImages = (baseUrl: string, widths: number[] = [320, 640, 768, 1024, 1280, 1920]) => {
 return widths.map(width => ({
 src: `${baseUrl}?w=${width}`,
 width,
 type: 'image/webp',
 }))
}
