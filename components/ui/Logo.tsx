'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showTagline?: boolean
  href?: string
}

export const Logo = ({ className, showTagline = false, href }: LogoProps) => {
  const content = (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Логотип - стилизованная буква T */}
      <div className="relative mb-2">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Вертикальная часть T с градиентом */}
          <rect
            x="18"
            y="10"
            width="12"
            height="28"
            fill="url(#gradientT)"
            rx="2"
          />
          {/* Горизонтальная часть T - изогнутая форма с вогнутостью сверху */}
          <path
            d="M 6 14 C 8 10, 10 10, 12 12 C 14 10, 16 10, 18 12 L 18 20 C 16 18, 14 18, 12 20 L 12 14 Z M 30 12 C 32 10, 34 10, 36 12 C 38 10, 40 10, 42 14 L 42 20 C 40 18, 38 18, 36 20 L 36 12 Z"
            fill="url(#gradientT)"
          />
          <defs>
            <linearGradient id="gradientT" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="50%" stopColor="#E63946" />
              <stop offset="100%" stopColor="#8B1538" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Текст T11 */}
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold uppercase tracking-tight text-[#5C1A2E]">
          T11
        </span>
        {showTagline && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#5C1A2E] mt-0.5">
            CREATE AND AUTOMATE
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    )
  }

  return content
}

// Компактная версия для Sidebar
export const LogoCompact = ({ className, href }: { className?: string; href?: string }) => {
  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Компактный логотип */}
      <div className="relative">
        <svg
          width="32"
          height="32"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="18"
            y="10"
            width="12"
            height="28"
            fill="url(#gradientTCompact)"
            rx="2"
          />
          <path
            d="M 6 14 C 8 10, 10 10, 12 12 C 14 10, 16 10, 18 12 L 18 20 C 16 18, 14 18, 12 20 L 12 14 Z M 30 12 C 32 10, 34 10, 36 12 C 38 10, 40 10, 42 14 L 42 20 C 40 18, 38 18, 36 20 L 36 12 Z"
            fill="url(#gradientTCompact)"
          />
          <defs>
            <linearGradient id="gradientTCompact" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="50%" stopColor="#E63946" />
              <stop offset="100%" stopColor="#8B1538" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="text-xl font-bold uppercase tracking-tight text-[#5C1A2E]">
        T11
      </span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    )
  }

  return content
}

