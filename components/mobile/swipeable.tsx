/**
 * Swipeable Component
 * Adds swipe gesture support for mobile interactions
 */

'use client'

import { ReactNode, useRef, useState, TouchEvent } from 'react'
import { cn } from '@/lib/utils'

interface SwipeableProps {
  children: ReactNode
  /** Callback when swiped left */
  onSwipeLeft?: () => void
  /** Callback when swiped right */
  onSwipeRight?: () => void
  /** Callback when swiped up */
  onSwipeUp?: () => void
  /** Callback when swiped down */
  onSwipeDown?: () => void
  /** Minimum distance for swipe (px) */
  threshold?: number
  /** Show visual feedback during swipe */
  showFeedback?: boolean
  className?: string
}

export function Swipeable({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  showFeedback = true,
  className,
}: SwipeableProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const [swipeOffset, setSwipeOffset] = useState({ x: 0, y: 0 })
  const [isSwiping, setIsSwiping] = useState(false)

  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
    setIsSwiping(true)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStart.current || !showFeedback) return

    const deltaX = e.touches[0].clientX - touchStart.current.x
    const deltaY = e.touches[0].clientY - touchStart.current.y

    setSwipeOffset({ x: deltaX, y: deltaY })
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart.current) return

    const deltaX = e.changedTouches[0].clientX - touchStart.current.x
    const deltaY = e.changedTouches[0].clientY - touchStart.current.y

    // Determine if horizontal or vertical swipe
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)

    if (isHorizontal) {
      if (Math.abs(deltaX) >= threshold) {
        if (deltaX > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      }
    } else {
      if (Math.abs(deltaY) >= threshold) {
        if (deltaY > 0) {
          onSwipeDown?.()
        } else {
          onSwipeUp?.()
        }
      }
    }

    // Reset
    touchStart.current = null
    setSwipeOffset({ x: 0, y: 0 })
    setIsSwiping(false)
  }

  return (
    <div
      className={cn('touch-pan-x', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={
        showFeedback && isSwiping
          ? {
              transform: `translate(${swipeOffset.x * 0.2}px, ${swipeOffset.y * 0.2}px)`,
              transition: 'none',
            }
          : { transition: 'transform 0.2s ease-out' }
      }
    >
      {children}
    </div>
  )
}

/**
 * Swipeable Card with actions
 * Shows actions when swiped
 */
interface SwipeableCardProps {
  children: ReactNode
  /** Left swipe action */
  leftAction?: {
    label: string
    icon?: ReactNode
    onClick: () => void
    color?: 'red' | 'green' | 'blue' | 'gray'
  }
  /** Right swipe action */
  rightAction?: {
    label: string
    icon?: ReactNode
    onClick: () => void
    color?: 'red' | 'green' | 'blue' | 'gray'
  }
  className?: string
}

export function SwipeableCard({
  children,
  leftAction,
  rightAction,
  className,
}: SwipeableCardProps) {
  const [offset, setOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)

  const actionColors = {
    red: 'bg-red-500 text-white',
    green: 'bg-green-500 text-white',
    blue: 'bg-blue-500 text-white',
    gray: 'bg-gray-500 text-white',
  }

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    const currentX = e.touches[0].clientX
    const diff = currentX - startX.current

    // Limit swipe distance
    const maxOffset = 100
    const newOffset = Math.max(-maxOffset, Math.min(maxOffset, diff))
    setOffset(newOffset)
  }

  const handleTouchEnd = () => {
    const threshold = 60

    if (offset > threshold && rightAction) {
      rightAction.onClick()
    } else if (offset < -threshold && leftAction) {
      leftAction.onClick()
    }

    // Reset
    setOffset(0)
    setIsDragging(false)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Actions */}
      {leftAction && (
        <div
          className={cn(
            'absolute right-0 top-0 flex h-full items-center justify-end px-6',
            actionColors[leftAction.color || 'red']
          )}
          style={{ width: Math.abs(Math.min(0, offset)) }}
        >
          {leftAction.icon}
          <span className="ml-2 text-sm font-medium">{leftAction.label}</span>
        </div>
      )}

      {rightAction && (
        <div
          className={cn(
            'absolute left-0 top-0 flex h-full items-center justify-start px-6',
            actionColors[rightAction.color || 'green']
          )}
          style={{ width: Math.max(0, offset) }}
        >
          {rightAction.icon}
          <span className="mr-2 text-sm font-medium">{rightAction.label}</span>
        </div>
      )}

      {/* Card Content */}
      <div
        className={cn('relative bg-background', className)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${offset}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}
