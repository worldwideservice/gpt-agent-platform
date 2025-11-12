'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showTagline?: boolean
  href?: string
}

export const Logo = ({ className, showTagline = false, href }: LogoProps) => {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    
    // Слушаем изменения темы
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const logoSrc = isDark ? '/brand/logo-wordmark-dark.svg' : '/brand/logo-wordmark-light.svg'

  const content = (
    <div className={cn('flex flex-col items-center', className)}>
      {/* Логотип */}
      <div className="relative">
        {mounted ? (
          <Image
            src={logoSrc}
            alt="TON 18 Logo"
            width={160}
            height={64}
            className="drop-shadow-sm object-contain"
            priority
          />
        ) : (
          <div className="w-[160px] h-[64px] bg-transparent" />
        )}
      </div>
      
      {/* Tagline только если нужно */}
      {showTagline && (
        <div className="flex flex-col items-center mt-2">
          <span className="text-[10px] font-normal tracking-wider text-brand-accent">
            create infinity
          </span>
        </div>
      )}
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
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    
    // Слушаем изменения темы
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  const logoSrc = isDark ? '/brand/logo-mark.svg' : '/brand/logo-mark.svg'

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Компактный логотип */}
      <div className="relative">
        {mounted ? (
          <Image src={logoSrc} alt="TON 18 логотип" width={48} height={48} className="object-contain" priority />
        ) : (
          <div className="w-12 h-12 bg-transparent" />
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

