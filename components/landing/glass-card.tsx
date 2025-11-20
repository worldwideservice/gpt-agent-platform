'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'subtle' | 'strong'
}

/**
 * Glassmorphism Card Component
 * Modern glass effect with backdrop blur and transparency
 */
export function GlassCard({ 
  children, 
  className,
  variant = 'default'
}: GlassCardProps) {
  const variantClasses = {
    default: 'bg-white/70 backdrop-blur-xl border-white/20',
    subtle: 'bg-white/50 backdrop-blur-lg border-white/10',
    strong: 'bg-white/80 backdrop-blur-2xl border-white/30',
  }

  return (
    <Card 
      className={cn(
        variantClasses[variant],
        'shadow-xl shadow-black/5',
        className
      )}
    >
      {children}
    </Card>
  )
}

export { CardContent, CardDescription, CardHeader, CardTitle }

