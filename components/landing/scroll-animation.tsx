'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  duration?: number
  threshold?: number
}

/**
 * Scroll Animation Component
 * Animates children when they enter the viewport
 */
export function ScrollAnimation({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 600,
  threshold = 0.1,
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold])

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return 'translateY(20px)'
        case 'down':
          return 'translateY(-20px)'
        case 'left':
          return 'translateX(20px)'
        case 'right':
          return 'translateX(-20px)'
        case 'fade':
          return 'none'
        default:
          return 'translateY(20px)'
      }
    }
    return 'translateY(0) translateX(0)'
  }

  const getOpacity = () => {
    return isVisible ? 1 : 0
  }

  return (
    <div
      ref={ref}
      className={`${className} ${!isVisible ? 'will-change-transform will-change-opacity' : ''}`}
      style={{
        opacity: getOpacity(),
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

