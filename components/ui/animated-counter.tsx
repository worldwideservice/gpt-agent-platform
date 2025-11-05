'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
  decimals?: number
}

/**
 * Animated Counter Component
 * Animates number from 0 to target value when visible
 */
export function AnimatedCounter({
  value,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
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
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime
      }

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = value * easeOut

      setCount(currentValue)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isVisible, value, duration])

  const formatNumber = (num: number) => {
    if (decimals === 0) {
      return Math.floor(num).toString()
    }
    return num.toFixed(decimals)
  }

  return (
    <div 
      ref={ref} 
      className={`${className} ${isVisible && count < value ? 'will-change-transform' : ''}`}
    >
      {prefix}
      {formatNumber(count)}
      {suffix}
    </div>
  )
}

