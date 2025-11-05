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
      {/* Логотип - воронка/туннель с концентрическими линиями */}
      <div className="relative mb-2">
        <svg
          width="80"
          height="40"
          viewBox="0 0 120 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Центральный черный круг */}
          <circle
            cx="60"
            cy="30"
            r="5"
            fill="#000000"
          />
          
          {/* Концентрические эллиптические линии с градиентом */}
          <ellipse cx="60" cy="30" rx="12" ry="6" fill="none" stroke="#000000" strokeWidth="0.8" opacity="0.95" />
          <ellipse cx="60" cy="30" rx="15" ry="7.5" fill="none" stroke="#000000" strokeWidth="0.75" opacity="0.9" />
          <ellipse cx="60" cy="30" rx="18" ry="9" fill="none" stroke="#000000" strokeWidth="0.7" opacity="0.85" />
          <ellipse cx="60" cy="30" rx="21" ry="10.5" fill="none" stroke="#000000" strokeWidth="0.65" opacity="0.8" />
          <ellipse cx="60" cy="30" rx="24" ry="12" fill="none" stroke="#000000" strokeWidth="0.6" opacity="0.75" />
          <ellipse cx="60" cy="30" rx="27" ry="13.5" fill="none" stroke="#000000" strokeWidth="0.55" opacity="0.7" />
          <ellipse cx="60" cy="30" rx="30" ry="15" fill="none" stroke="#000000" strokeWidth="0.5" opacity="0.65" />
          <ellipse cx="60" cy="30" rx="33" ry="16.5" fill="none" stroke="#000000" strokeWidth="0.45" opacity="0.6" />
          <ellipse cx="60" cy="30" rx="36" ry="18" fill="none" stroke="#000000" strokeWidth="0.4" opacity="0.55" />
          <ellipse cx="60" cy="30" rx="39" ry="19.5" fill="none" stroke="#000000" strokeWidth="0.35" opacity="0.5" />
          <ellipse cx="60" cy="30" rx="42" ry="21" fill="none" stroke="#000000" strokeWidth="0.3" opacity="0.45" />
          <ellipse cx="60" cy="30" rx="45" ry="22.5" fill="none" stroke="#000000" strokeWidth="0.3" opacity="0.4" />
          <ellipse cx="60" cy="30" rx="48" ry="24" fill="none" stroke="#000000" strokeWidth="0.3" opacity="0.35" />
          <ellipse cx="60" cy="30" rx="51" ry="25.5" fill="none" stroke="#000000" strokeWidth="0.3" opacity="0.3" />
          <ellipse cx="60" cy="30" rx="54" ry="27" fill="none" stroke="#000000" strokeWidth="0.3" opacity="0.25" />
        </svg>
      </div>
      
      {/* Текст TON 18 */}
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold tracking-tight text-black">
          TON 18
        </span>
        {showTagline && (
          <span className="text-[10px] font-normal tracking-wider text-black mt-0.5">
            create infinity
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
          width="48"
          height="24"
          viewBox="0 0 120 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Центральный черный круг */}
          <circle
            cx="60"
            cy="30"
            r="5"
            fill="#000000"
          />
          
          {/* Концентрические эллиптические линии с градиентом */}
          <ellipse cx="60" cy="30" rx="12" ry="6" fill="none" stroke="#000000" strokeWidth="0.8" opacity="0.95" />
          <ellipse cx="60" cy="30" rx="15" ry="7.5" fill="none" stroke="#000000" strokeWidth="0.75" opacity="0.9" />
          <ellipse cx="60" cy="30" rx="18" ry="9" fill="none" stroke="#000000" strokeWidth="0.7" opacity="0.85" />
          <ellipse cx="60" cy="30" rx="21" ry="10.5" fill="none" stroke="#000000" strokeWidth="0.65" opacity="0.8" />
          <ellipse cx="60" cy="30" rx="24" ry="12" fill="none" stroke="#000000" strokeWidth="0.6" opacity="0.75" />
          <ellipse cx="60" cy="30" rx="27" ry="13.5" fill="none" stroke="#000000" strokeWidth="0.55" opacity="0.7" />
          <ellipse cx="60" cy="30" rx="30" ry="15" fill="none" stroke="#000000" strokeWidth="0.5" opacity="0.65" />
          <ellipse cx="60" cy="30" rx="33" ry="16.5" fill="none" stroke="#000000" strokeWidth="0.45" opacity="0.6" />
          <ellipse cx="60" cy="30" rx="36" ry="18" fill="none" stroke="#000000" strokeWidth="0.4" opacity="0.55" />
          <ellipse cx="60" cy="30" rx="39" ry="19.5" fill="none" stroke="#000000" strokeWidth="0.35" opacity="0.5" />
        </svg>
      </div>
      <span className="text-xl font-bold tracking-tight text-black">
        TON 18
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

