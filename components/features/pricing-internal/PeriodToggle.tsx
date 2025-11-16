'use client'

import { Button } from '@/components/ui/button'

interface PeriodToggleProps {
  interval: 'month' | 'year'
  onIntervalChange: (interval: 'month' | 'year') => void
}

/**
 * Переключатель периода оплаты: Ежемесячно/Ежегодно
 * Согласно KWID спецификации
 */
export function PeriodToggle({ interval, onIntervalChange }: PeriodToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg border bg-background p-1 shadow-sm">
      <Button
        variant={interval === 'month' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onIntervalChange('month')}
        className="rounded-md px-6"
      >
        Ежемесячно
      </Button>
      <Button
        variant={interval === 'year' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onIntervalChange('year')}
        className="rounded-md px-6"
      >
        Ежегодно
      </Button>
    </div>
  )
}
