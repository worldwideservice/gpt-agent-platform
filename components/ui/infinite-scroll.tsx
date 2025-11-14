'use client'

import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

interface InfiniteScrollProps {
  children: React.ReactNode
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  threshold?: number
  loader?: React.ReactNode
  endMessage?: React.ReactNode
  className?: string
}

/**
 * Компонент для бесконечной прокрутки
 *
 * @example
 * ```tsx
 * <InfiniteScroll
 *   onLoadMore={fetchNextPage}
 *   hasMore={hasNextPage}
 *   isLoading={isFetchingNextPage}
 * >
 *   {items.map(item => <ItemCard key={item.id} item={item} />)}
 * </InfiniteScroll>
 * ```
 */
export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 200,
  loader,
  endMessage,
  className = '',
}: InfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentTarget = observerTarget.current

    if (!currentTarget || !hasMore || isLoading) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      {
        rootMargin: `${threshold}px`,
      },
    )

    observer.observe(currentTarget)

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, isLoading, onLoadMore, threshold])

  return (
    <div className={className}>
      {children}

      {hasMore && (
        <div ref={observerTarget} className="flex items-center justify-center py-4">
          {isLoading && (
            loader || (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Загрузка...</span>
              </div>
            )
          )}
        </div>
      )}

      {!hasMore && !isLoading && endMessage && (
        <div className="py-4 text-center text-sm text-gray-500">{endMessage}</div>
      )}
    </div>
  )
}

/**
 * Простой вариант infinite scroll на основе скролла окна
 */
export function useInfiniteScrollWindow(
  onLoadMore: () => void,
  hasMore: boolean,
  isLoading: boolean,
  threshold = 500,
) {
  useEffect(() => {
    if (!hasMore || isLoading) {
      return
    }

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = document.documentElement.scrollTop
      const clientHeight = document.documentElement.clientHeight

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        onLoadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, isLoading, onLoadMore, threshold])
}
