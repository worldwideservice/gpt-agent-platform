'use client'

import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      setIsMobile(false)
      return
    }

    const mediaQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      : null

    const update = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    update()
    mediaQuery?.addEventListener?.('change', update)
    window.addEventListener('resize', update)

    return () => {
      mediaQuery?.removeEventListener?.('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return isMobile
}

