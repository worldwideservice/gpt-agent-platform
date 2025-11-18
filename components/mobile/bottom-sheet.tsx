/**
 * Bottom Sheet Component
 * Mobile-friendly modal that slides up from the bottom
 */

'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface BottomSheetProps {
  /** Whether the bottom sheet is open */
  open: boolean
  /** Callback when closed */
  onClose: () => void
  /** Sheet content */
  children: ReactNode
  /** Sheet title */
  title?: string
  /** Sheet description */
  description?: string
  /** Show close button */
  showCloseButton?: boolean
  /** Allow swipe down to close */
  swipeToClose?: boolean
  /** Snap points (0-1, where 1 is full height) */
  snapPoints?: number[]
  /** Initial snap point index */
  initialSnap?: number
}

export function BottomSheet({
  open,
  onClose,
  children,
  title,
  description,
  showCloseButton = true,
  swipeToClose = true,
  snapPoints = [0.5, 0.9],
  initialSnap = 0,
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(false)
  const [snapIndex, setSnapIndex] = useState(initialSnap)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!swipeToClose) return
    startY.current = e.touches[0].clientY
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const currentY = e.touches[0].clientY
    const diff = currentY - startY.current

    // Only allow dragging down
    if (diff > 0) {
      setDragOffset(diff)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const threshold = 100

    if (dragOffset > threshold) {
      onClose()
    } else {
      // Snap to nearest snap point
      const windowHeight = window.innerHeight
      const currentHeight = windowHeight * snapPoints[snapIndex] - dragOffset
      const targetSnap = snapPoints.reduce((prev, curr, index) => {
        const prevDiff = Math.abs(windowHeight * snapPoints[prev] - currentHeight)
        const currDiff = Math.abs(windowHeight * curr - currentHeight)
        return currDiff < prevDiff ? index : prev
      }, snapIndex)

      setSnapIndex(targetSnap)
    }

    setDragOffset(0)
    setIsDragging(false)
  }

  if (!mounted) return null

  const height = `${snapPoints[snapIndex] * 100}%`

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-300',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'absolute bottom-0 left-0 right-0 flex flex-col rounded-t-2xl bg-background shadow-2xl',
          'transform transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{
          height,
          transform: isDragging ? `translateY(${dragOffset}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'bottom-sheet-title' : undefined}
        aria-describedby={description ? 'bottom-sheet-description' : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        {swipeToClose && (
          <div className="flex justify-center py-3">
            <div className="h-1 w-12 rounded-full bg-muted-foreground/30" aria-hidden="true" />
          </div>
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              {title && (
                <h2 id="bottom-sheet-title" className="text-lg font-semibold">
                  {title}
                </h2>
              )}
              {description && (
                <p id="bottom-sheet-description" className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
